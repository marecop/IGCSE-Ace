import React, { useState, useEffect } from 'react';
import { Subject, Question, PaperType, ExamBoard, QuestionType } from '../types';
import { generateMockExam, evaluateAnswer } from '../services/geminiService';
import Button from './Button';
import MathText from './MathText';
import MathInput from './MathInput';
import DiagramRenderer from './DiagramRenderer';

interface ExamViewProps {
  subject: Subject;
  paperType: PaperType;
  onExit: () => void;
}

const ExamView: React.FC<ExamViewProps> = ({ subject, paperType, onExit }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(0); // For pagination
  
  // User answers state: Map question ID -> answer string (or JSON for structured)
  const [answers, setAnswers] = useState<{[id: string]: string}>({});
  
  const [isReviewing, setIsReviewing] = useState(false);
  const [evaluations, setEvaluations] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // Load Exam
  useEffect(() => {
    const loadExam = async () => {
      setLoading(true);
      setError('');
      try {
        const qs = await generateMockExam(subject, paperType);
        if (!qs || qs.length === 0) {
           setError("No questions were generated. Please try again.");
        } else {
           setQuestions(qs);
        }
      } catch (err) {
        setError("Failed to generate exam. Please check your connection.");
      } finally {
        setLoading(false);
      }
    };
    loadExam();
  }, [subject, paperType]);

  // Handle Input Change
  const handleAnswerChange = (qId: string, val: string) => {
    setAnswers(prev => ({...prev, [qId]: val}));
  };

  // Structured Answer Helper
  // We store structured answers as a JSON string for simplicity in the 'answers' map
  // Key: mainQuestionId, Value: JSON.stringify({ subQId1: "ans", subQId2: "ans" })
  const handleStructuredAnswer = (mainQId: string, subQId: string, val: string) => {
    let current: any = {};
    try {
      current = answers[mainQId] ? JSON.parse(answers[mainQId]) : {};
    } catch (e) {
      current = {};
    }
    current[subQId] = val;
    setAnswers(prev => ({...prev, [mainQId]: JSON.stringify(current)}));
  };

  const handleSubmitExam = async () => {
    if (!window.confirm("Are you sure you want to finish the exam?")) return;
    setSubmitting(true);
    
    try {
        const results: any[] = [];
        // Batch requests to prevent rate limiting or browser stall
        const BATCH_SIZE = 5;
        
        for (let i = 0; i < questions.length; i += BATCH_SIZE) {
            const batch = questions.slice(i, i + BATCH_SIZE);
            const batchPromises = batch.map(async (q) => {
                const ans = answers[q.id] || "";
                let finalAns = ans;
                
                if (q.subQuestions) {
                     try {
                        const parsed = ans ? JSON.parse(ans) : {};
                        finalAns = q.subQuestions.map(sq => `(${sq.label}) ${parsed[sq.id] || "No Answer"}`).join('\n');
                     } catch (e) {
                        finalAns = "Error parsing structured answer.";
                     }
                }
                // Graceful evaluation
                try {
                  return await evaluateAnswer(q, finalAns);
                } catch (e) {
                   return { score: 0, maxMarks: q.maxMarks, feedback: "Error evaluating this question.", sampleAnswer: "N/A", isCorrect: false };
                }
            });
            
            const batchResults = await Promise.all(batchPromises);
            results.push(...batchResults);
        }

        setEvaluations(results);
        setIsReviewing(true);
        window.scrollTo(0,0);
    } catch (e) {
        console.error("Submission error", e);
        alert("An error occurred during submission. Please check your connection and try again.");
    } finally {
        setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
        <h2 className="text-xl font-bold text-slate-800">Generating Full Mock Exam...</h2>
        <p className="text-slate-500 mt-2">Creating {paperType} questions and diagrams.</p>
        <p className="text-xs text-slate-400 mt-1">Estimated time: ~15-20 seconds</p>
      </div>
    );
  }

  if (error || questions.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="text-red-500 mb-4 text-4xl">⚠️</div>
          <p className="text-slate-800 mb-4 font-medium">{error || "No questions available."}</p>
          <Button onClick={onExit} variant="secondary">Back to Menu</Button>
        </div>
      );
  }

  // Determine Layout Mode
  // Edexcel Math = Pagination. Science MCQ = Scroll.
  const isPaginationMode = subject.board === ExamBoard.Edexcel; 

  const renderQuestion = (q: Question, index: number) => {
    if (!q) return null; // Safeguard against undefined questions

    const evalResult = isReviewing ? evaluations[index] : null;
    
    return (
      <div key={q.id || index} className="bg-white rounded-xl shadow-sm border border-slate-200 mb-8 overflow-hidden">
        <div className="bg-slate-50 px-6 py-3 border-b border-slate-100 flex justify-between">
          <span className="font-bold text-slate-700">Question {index + 1}</span>
          <span className="text-sm bg-slate-200 px-2 py-0.5 rounded text-slate-600">
            {q.maxMarks || 0} Marks
          </span>
        </div>

        <div className="p-6">
          {q.context && (
            <div className="mb-6 p-4 bg-amber-50 rounded border-l-4 border-amber-300">
                <MathText text={q.context} className="text-sm text-slate-800"/>
            </div>
          )}
          
          {q.diagramData && <div className="mb-6"><DiagramRenderer type={q.diagramType!} data={q.diagramData} /></div>}
          
          <MathText text={q.questionText} className="text-lg font-medium text-slate-900 mb-6 block" />

          {/* Render Sub-questions OR Standard Input */}
          {q.subQuestions ? (
             <div className="space-y-6 pl-4 border-l-2 border-slate-100">
               {q.subQuestions.map(sq => {
                  let currentMainAns: any = {};
                  try {
                    currentMainAns = answers[q.id] ? JSON.parse(answers[q.id]) : {};
                  } catch (e) {
                    currentMainAns = {};
                  }
                  
                  return (
                    <div key={sq.id}>
                       <div className="flex gap-2 mb-2">
                          <span className="font-bold text-slate-600">{sq.label}</span>
                          <MathText text={sq.text} className="text-slate-800" />
                          <span className="text-xs text-slate-400 ml-auto">[{sq.maxMarks}]</span>
                       </div>
                       <MathInput 
                         value={currentMainAns[sq.id] || ''} 
                         onChange={(v) => handleStructuredAnswer(q.id, sq.id, v)}
                         disabled={isReviewing}
                       />
                    </div>
                  );
               })}
             </div>
          ) : q.type === QuestionType.MCQ ? (
             <div className="grid grid-cols-1 gap-2">
               {q.options?.map((opt, i) => (
                 <button
                   key={i}
                   onClick={() => !isReviewing && handleAnswerChange(q.id, opt)}
                   disabled={isReviewing}
                   className={`p-3 text-left border rounded hover:bg-slate-50 flex items-center gap-3 ${
                      answers[q.id] === opt ? 'bg-indigo-50 border-indigo-500 ring-1 ring-indigo-500' : 'border-slate-200'
                   }`}
                 >
                   <span className="font-bold text-slate-400">{String.fromCharCode(65+i)}</span>
                   <MathText text={opt} isInline/>
                 </button>
               ))}
             </div>
          ) : (
             <MathInput 
                value={answers[q.id] || ''} 
                onChange={(v) => handleAnswerChange(q.id, v)}
                disabled={isReviewing}
             />
          )}
        </div>
        
        {/* Review Feedback */}
        {isReviewing && evalResult && (
           <div className={`p-4 border-t ${evalResult.isCorrect ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
              <p className="font-bold text-sm mb-2">Score: {evalResult.score}/{evalResult.maxMarks}</p>
              <MathText text={evalResult.feedback} className="text-sm text-slate-700 block mb-2" />
              <div className="text-xs text-slate-500 mt-2 p-2 bg-white rounded border">
                 <span className="font-bold">Model Answer:</span> <MathText text={evalResult.sampleAnswer} isInline />
              </div>
           </div>
        )}
      </div>
    );
  };

  return (
    <div className="pb-20">
      <div className="mb-6 flex justify-between items-center sticky top-20 z-10 bg-slate-50/90 backdrop-blur py-2 shadow-sm px-4 rounded-b-lg">
        <h2 className="text-xl font-bold text-slate-800 truncate">{subject.name} - {paperType}</h2>
        <div className="flex gap-2">
          {!isReviewing && <Button onClick={handleSubmitExam} isLoading={submitting} variant="primary">Finish Exam</Button>}
          {isReviewing && <Button onClick={onExit} variant="secondary">Exit Review</Button>}
        </div>
      </div>

      {isPaginationMode ? (
        // PAGINATION MODE
        <div className="px-4 md:px-0">
           {questions[currentPage] ? renderQuestion(questions[currentPage], currentPage) : <div className="p-8 text-center text-slate-500">Loading Question...</div>}
           
           <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 flex justify-center gap-2 overflow-x-auto z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
              <Button 
                variant="outline" 
                disabled={currentPage === 0}
                onClick={() => setCurrentPage(c => c - 1)}
              >
                Prev
              </Button>
              <div className="flex gap-2 overflow-x-auto no-scrollbar">
                {questions.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentPage(idx)}
                    className={`w-10 h-10 rounded-lg font-bold text-sm flex-shrink-0 transition-all ${
                        currentPage === idx 
                        ? 'bg-indigo-600 text-white shadow-md scale-105' 
                        : (questions[idx] && answers[questions[idx].id]) 
                          ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' 
                          : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
              <Button 
                variant="outline" 
                disabled={currentPage === questions.length - 1}
                onClick={() => setCurrentPage(c => c + 1)}
              >
                Next
              </Button>
           </div>
        </div>
      ) : (
        // SCROLL MODE
        <div className="space-y-8 px-4 md:px-0">
           {questions.map((q, idx) => renderQuestion(q, idx))}
        </div>
      )}
    </div>
  );
};

export default ExamView;