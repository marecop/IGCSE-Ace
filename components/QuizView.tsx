import React, { useState, useEffect, useCallback } from 'react';
import { Subject, Question, QuestionType, EvaluationResult, ExamBoard } from '../types';
import { generateQuestion, evaluateAnswer } from '../services/geminiService';
import Button from './Button';
import { Icons } from '../constants';
import MathText from './MathText';
import MathInput from './MathInput';
import DiagramRenderer from './DiagramRenderer';

interface QuizViewProps {
  subject: Subject;
  onExit: () => void;
}

const QuizView: React.FC<QuizViewProps> = ({ subject, onExit }) => {
  const [question, setQuestion] = useState<Question | null>(null);
  const [userAnswer, setUserAnswer] = useState(''); // Simple string for simple Qs, JSON string for structured
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const loadNewQuestion = useCallback(async () => {
    setLoading(true);
    setEvaluation(null);
    setUserAnswer('');
    setError('');
    try {
      const q = await generateQuestion(subject);
      setQuestion(q);
    } catch (err) {
      setError("Failed to load question. Please check your connection or API limit.");
    } finally {
      setLoading(false);
    }
  }, [subject]);

  useEffect(() => {
    loadNewQuestion();
  }, [loadNewQuestion]);

  const handleSubmit = async () => {
    if (!question) return;
    
    // Formatting structured answer for evaluation if needed
    let finalAns = userAnswer;
    if (question.subQuestions) {
        // If it's structured, userAnswer is a JSON string of { subQId: ans }
        // We convert it to a readable string for the AI evaluator
        try {
            const parsed = JSON.parse(userAnswer || '{}');
            finalAns = question.subQuestions.map(sq => `(${sq.label}) ${parsed[sq.id] || '(No Answer)'}`).join('\n');
        } catch (e) { finalAns = userAnswer; }
    }

    if (!finalAns.trim()) return;

    setSubmitting(true);
    try {
      const result = await evaluateAnswer(question, finalAns);
      setEvaluation(result);
    } catch (err) {
      setError("Failed to evaluate answer. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSkip = () => {
    loadNewQuestion();
  };

  const handleSubQuestionChange = (subId: string, val: string) => {
     const current = userAnswer ? JSON.parse(userAnswer) : {};
     current[subId] = val;
     setUserAnswer(JSON.stringify(current));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] animate-pulse">
        <div className="bg-white p-4 rounded-full shadow-lg mb-4">
           {subject.icon}
        </div>
        <h2 className="text-xl font-semibold text-slate-700">Examining Past Papers...</h2>
        <p className="text-slate-500 mt-2">Checking {subject.board} {subject.code} Syllabus...</p>
      </div>
    );
  }

  if (error) {
    return (
       <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="text-red-500 mb-4 text-4xl">⚠️</div>
        <p className="text-slate-800 mb-4 font-medium">{error}</p>
        <div className="flex gap-3">
          <Button onClick={loadNewQuestion}>Try Again</Button>
          <Button variant="outline" onClick={onExit}>Back to Menu</Button>
        </div>
       </div>
    );
  }

  if (!question) return null;

  const isMathSubject = subject.board === ExamBoard.Edexcel;

  return (
    <div className="max-w-3xl mx-auto pb-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-slate-500 hover:text-slate-700 cursor-pointer" onClick={onExit}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          <span className="text-sm font-medium">Exit</span>
        </div>
        <div className="flex flex-col items-end">
          <div className="text-sm font-semibold text-slate-900">
            {subject.name} ({subject.code})
          </div>
          <div className="text-xs text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded mt-1">
             Topic: {question.topic}
          </div>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-6">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Practice Question
          </span>
          <span className="text-xs font-bold bg-slate-200 text-slate-700 px-2 py-0.5 rounded">
            Max Marks: {question.maxMarks}
          </span>
        </div>
        
        <div className="p-6 sm:p-8">
          {question.context && (
            <div className="mb-8 bg-amber-50 border-l-4 border-amber-300 p-4 rounded-r-lg">
              <MathText 
                text={question.context} 
                className="text-slate-800 text-sm sm:text-base leading-7 font-serif whitespace-pre-wrap"
              />
            </div>
          )}

          {question.diagramType && question.diagramData && (
            <div className="mb-6">
                <DiagramRenderer type={question.diagramType} data={question.diagramData} />
            </div>
          )}
          
          <MathText 
            text={question.questionText} 
            className="text-lg sm:text-xl font-medium text-slate-900 leading-relaxed whitespace-pre-wrap block"
          />

          {/* Render Sub-questions if structured */}
          {question.subQuestions ? (
             <div className="mt-6 space-y-6 border-l-2 border-slate-100 pl-4">
               {question.subQuestions.map(sq => {
                  const currentAns = userAnswer ? JSON.parse(userAnswer)[sq.id] || '' : '';
                  return (
                    <div key={sq.id}>
                       <div className="flex gap-2 mb-2 items-baseline">
                          <span className="font-bold text-slate-700">{sq.label}</span>
                          <MathText text={sq.text} className="text-slate-800" />
                          <span className="text-xs text-slate-400 ml-auto">[{sq.maxMarks}]</span>
                       </div>
                       <MathInput 
                         value={currentAns}
                         onChange={(val) => handleSubQuestionChange(sq.id, val)}
                         disabled={!!evaluation}
                         placeholder={`Answer for part ${sq.label}...`}
                       />
                    </div>
                  )
               })}
             </div>
          ) : (
            // Standard Single Input
            <>
              {question.type === QuestionType.MCQ && question.options ? (
                <div className="mt-8 grid grid-cols-1 gap-3">
                  {question.options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => !evaluation && setUserAnswer(opt)}
                      disabled={!!evaluation}
                      className={`p-4 rounded-lg text-left transition-all border group flex items-center ${
                        userAnswer === opt 
                          ? 'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600' 
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <span className={`font-bold mr-3 ${userAnswer === opt ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'}`}>
                        {String.fromCharCode(65 + idx)}.
                      </span>
                      <MathText text={opt} isInline className={userAnswer === opt ? 'text-indigo-900' : 'text-slate-700'} />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="mt-8">
                   <label className="block text-sm font-medium text-slate-500 mb-2">
                     Your Answer:
                   </label>
                   {isMathSubject ? (
                     <MathInput
                       value={userAnswer}
                       onChange={setUserAnswer}
                       disabled={!!evaluation}
                     />
                   ) : (
                     <textarea
                       value={userAnswer}
                       onChange={(e) => setUserAnswer(e.target.value)}
                       placeholder="Write your answer..."
                       disabled={!!evaluation}
                       className="w-full h-48 p-4 rounded-lg border border-slate-200 focus:border-indigo-500 outline-none resize-none text-slate-800 bg-slate-50 font-mono text-sm"
                     />
                   )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Action Bar */}
        {!evaluation && (
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
            <button 
              onClick={handleSkip} 
              className="text-slate-500 hover:text-slate-700 text-sm font-medium flex items-center gap-1"
            >
              Skip
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </button>
            <Button 
              onClick={handleSubmit} 
              isLoading={submitting}
              // Basic check: either userAns string is full, OR if structured, check if parsed object has keys
              disabled={!userAnswer || (question.subQuestions && Object.keys(JSON.parse(userAnswer)).length === 0)}
            >
              Submit Answer
            </Button>
          </div>
        )}
      </div>

      {/* Feedback Section */}
      {evaluation && (
        <div className={`rounded-2xl shadow-sm border overflow-hidden animate-fade-in mb-8 ${evaluation.isCorrect ? 'bg-green-50 border-green-100' : 'bg-white border-slate-200'}`}>
          <div className={`px-6 py-4 border-b flex justify-between items-center ${evaluation.isCorrect ? 'border-green-100 bg-green-100/50' : 'border-slate-100 bg-slate-50'}`}>
            <div className="flex items-center gap-2">
              {evaluation.isCorrect ? <Icons.Check /> : <Icons.XMark />}
              <span className={`font-bold ${evaluation.isCorrect ? 'text-green-800' : 'text-slate-800'}`}>
                {evaluation.isCorrect ? 'Excellent!' : 'Needs Improvement'}
              </span>
            </div>
            <span className="font-bold text-lg bg-white px-3 py-1 rounded shadow-sm border border-slate-100">
              {evaluation.score} / {evaluation.maxMarks}
            </span>
          </div>
          
          <div className="p-6 sm:p-8 space-y-6">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Examiner's Remarks</h4>
              <MathText text={evaluation.feedback} className="text-slate-700 leading-relaxed whitespace-pre-wrap" />
            </div>
            
            <div className="bg-slate-800 rounded-lg p-5 text-slate-200 text-sm">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Model Answer</h4>
              <MathText text={evaluation.sampleAnswer} className="leading-relaxed whitespace-pre-wrap" />
            </div>

            <div className="flex justify-end pt-2">
              <Button onClick={loadNewQuestion}>Next Question</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizView;