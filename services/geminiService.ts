import { GoogleGenAI } from "@google/genai";
import { Subject, Question, QuestionType, EvaluationResult, ExamBoard, PaperType, SubQuestion } from "../types";

const apiKey = process.env.API_KEY || ''; 
const ai = new GoogleGenAI({ apiKey });

// Use Flash for speed
const getModelName = () => {
  return 'gemini-2.5-flash';
};

// --- HELPER: DIAGRAM & INSTRUCTIONS ---
const getSubjectInstructions = (subject: Subject, topic: string) => {
  let specificInstruction = "";
  let diagramInstruction = `
    NO DIAGRAM REQUIRED. 
    Set 'diagramType' to null and 'diagramData' to null.
  `;
  let mathConstraints = "";
  
  // Diagram Logic
  const needsNetlist = subject.id === 'cie-0478' && topic.includes('Logic');
  const needsOrganicChem = subject.id === 'cie-0620' && (topic.includes('Organic') || topic.includes('Polymers'));
  const needsBonding = subject.id === 'cie-0620' && (topic.includes('Atoms') || topic.includes('Bonding') || topic.includes('Matter'));
  const needsPhysicsCircuit = subject.id === 'cie-0625' && (topic.includes('Electricity') || topic.includes('Circuits') || topic.includes('Lens') || topic.includes('Waves') || topic.includes('Motion'));
  
  if (needsNetlist) {
    diagramInstruction = `DIAGRAM REQUIRED: LOGIC GATES (NetlistSVG). Format: JSON string for netlistsvg in 'diagramData', 'diagramType': 'NETLIST'.`;
  } else if (needsOrganicChem) {
    diagramInstruction = `DIAGRAM REQUIRED: CHEMICAL STRUCTURE (SMILES). Format: SMILES string in 'diagramData', 'diagramType': 'SMILES'.`;
  } else if (needsBonding) {
    diagramInstruction = `DIAGRAM REQUIRED: ATOMIC/BONDING (SVG). Format: Raw SVG code in 'diagramData', 'diagramType': 'SVG'. White bg, black lines.`;
  } else if (needsPhysicsCircuit) {
    diagramInstruction = `DIAGRAM REQUIRED: PHYSICS DIAGRAM (SVG). Format: Raw SVG code in 'diagramData', 'diagramType': 'SVG'. Simple black lines, no latex in text.`;
  }

  // Subject Logic
  if (subject.id === 'cie-0510') {
    specificInstruction = `Task: ESL (Reading or Writing). If reading, provide 200-word text in 'context'.`;
  } else if (subject.id === 'cie-0495-p1') {
    specificInstruction = `Sociology P1: MUST generate a 'Source A' (150 words survey/study summary) in 'context'. Questions must refer to Source A.`;
  } else if (subject.id === 'cie-0495-p2') {
    specificInstruction = `Sociology P2: Standard theory questions (Family/Education/Crime). No Source required.`;
  } else if (subject.board === ExamBoard.Edexcel) {
    mathConstraints = `
      STRICT MATH CONSTRAINTS:
      1. Solvable with real numbers.
      2. Integer coefficients preferred.
      3. Specify rounding if irrational.
      4. Use LaTeX $...$ for math.
      5. Mechanics: g=9.8 m/s^2.
      6. Statistics: Include data tables or stem-leaf diagrams in 'context' (Markdown table) if needed.
    `;
  } else if (['cie-0620', 'cie-0625'].includes(subject.id)) {
    specificInstruction = `If data is needed, use Markdown Table in 'context'. No image generation for tables.`;
  }

  return { specificInstruction, diagramInstruction, mathConstraints };
};


// --- SINGLE QUESTION GENERATION (Practice Mode) ---
export const generateQuestion = async (subject: Subject, paperType?: PaperType): Promise<Question> => {
  const modelName = getModelName();
  const randomTopic = subject.syllabusTopics[Math.floor(Math.random() * subject.syllabusTopics.length)];
  const { specificInstruction, diagramInstruction, mathConstraints } = getSubjectInstructions(subject, randomTopic);
  
  // Decide type based on paperType or random
  let allowedTypes = [QuestionType.SHORT_ANSWER];
  if (paperType === PaperType.MCQ_CORE || paperType === PaperType.MCQ_EXT) {
      allowedTypes = [QuestionType.MCQ];
  } else if (subject.board === ExamBoard.Edexcel) {
      allowedTypes = [QuestionType.SHORT_ANSWER]; // Edexcel is structured
  }

  const prompt = `
    Generate a SINGLE practice question for ${subject.board} ${subject.name} (Code: ${subject.code}).
    Topic: ${randomTopic}
    Paper Context: ${paperType || 'General Practice'}

    ${specificInstruction}
    ${mathConstraints}
    ${diagramInstruction}
    Allowed Types: ${allowedTypes.join(', ')}

    IF STRUCTURED (Edexcel/Science Theory):
    - Return a main questionText and a 'subQuestions' array.
    - Sub-questions have: label (a, b, i...), text, maxMarks, type.
    
    Output JSON Schema:
    {
      "questionText": "Main stem or question. Use LaTeX.",
      "context": "Optional passage/table (Markdown)",
      "type": "MCQ or Short Answer",
      "options": ["A", "B", "C", "D"] (if MCQ),
      "maxMarks": number,
      "topic": "${randomTopic}",
      "diagramType": "...",
      "diagramData": "...",
      "subQuestions": [ 
         { "id": "sq1", "label": "(a)", "text": "...", "maxMarks": 2, "type": "Short Answer" } 
      ] (Optional, for structured)
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: { responseMimeType: 'application/json' }
    });
    
    const parsed = JSON.parse(response.text || '{}');
    return {
        id: crypto.randomUUID(),
        subjectId: subject.id,
        ...parsed,
        maxMarks: parsed.maxMarks || 0,
        options: parsed.options || undefined,
        subQuestions: parsed.subQuestions?.map((sq: any) => ({...sq, id: crypto.randomUUID()}))
    };
  } catch (error) {
    console.error("Gen Error", error);
    return {
        id: 'error',
        subjectId: subject.id,
        type: QuestionType.SHORT_ANSWER,
        questionText: "Error generating question.",
        maxMarks: 0
    };
  }
};


// --- MOCK EXAM GENERATION (Batching) ---
export const generateMockExam = async (subject: Subject, paperType: PaperType): Promise<Question[]> => {
  const modelName = getModelName();
  let questions: Question[] = [];

  // Strategy: 
  // 1. CIE MCQ: 40 questions -> 5 batches of 8.
  // 2. Edexcel/Theory: 10-11 structured questions -> 10 parallel requests.

  const isMCQ = paperType === PaperType.MCQ_CORE || paperType === PaperType.MCQ_EXT;
  
  if (isMCQ) {
      // CIE MCQ Paper (40 Qs)
      const batchCount = 5;
      const qsPerBatch = 8;
      const batchPromises = [];

      for (let i = 0; i < batchCount; i++) {
          // Select random topics for this batch
          const topics = subject.syllabusTopics.sort(() => 0.5 - Math.random()).slice(0, 3).join(', ');
          const { specificInstruction, diagramInstruction, mathConstraints } = getSubjectInstructions(subject, topics);

          const prompt = `
            Generate ${qsPerBatch} unique MCQ questions for ${subject.name} ${paperType}.
            Topics to cover: ${topics}.
            
            ${specificInstruction}
            ${mathConstraints}
            ${diagramInstruction}
            
            Output a JSON Object with a "questions" array.
            Each item in array matches schema:
            {
               "questionText": "...",
               "options": ["A","B","C","D"],
               "maxMarks": 1,
               "type": "Multiple Choice",
               "topic": "Specific topic",
               "diagramType": ..., "diagramData": ...
            }
          `;
          
          batchPromises.push(
              ai.models.generateContent({
                  model: modelName,
                  contents: [{ role: 'user', parts: [{ text: prompt }] }],
                  config: { responseMimeType: 'application/json' }
              }).then(res => JSON.parse(res.text || '{"questions": []}').questions)
          );
      }

      const results = await Promise.all(batchPromises);
      results.forEach(batch => {
        if (Array.isArray(batch)) {
          questions.push(...batch);
        }
      });

  } else {
      // Structured Paper (Edexcel or CIE Theory)
      // Edexcel: 10 or 11 questions. Randomly decide.
      // CIE Theory: 5 or 6 questions.
      
      let qCount = 5;
      if (subject.board === ExamBoard.Edexcel) {
          qCount = Math.random() > 0.5 ? 10 : 11;
      } else if (paperType === PaperType.THEORY_CORE || paperType === PaperType.THEORY_EXT) {
          qCount = 6;
      } else if (subject.id.includes('sociology')) {
          qCount = 3; // Sociology usually has fewer, longer questions
      }

      const qPromises = [];
      for (let i = 0; i < qCount; i++) {
          // Pick a topic for this specific large question
          const topic = subject.syllabusTopics[i % subject.syllabusTopics.length];
          const { specificInstruction, diagramInstruction, mathConstraints } = getSubjectInstructions(subject, topic);
          
          // Difficulty curve: Early questions easier, later harder
          const difficulty = i < qCount / 3 ? "Easy/Introductory" : (i < 2 * qCount / 3 ? "Medium" : "Hard/Complex");

          // Randomize sub-question count based on difficulty
          const subQCount = difficulty === "Easy/Introductory" ? "1-2" : "3-5";

          const prompt = `
             Generate ONE complete STRUCTURED question (Question #${i+1}) for ${subject.name} ${paperType}.
             Topic: ${topic}. Difficulty: ${difficulty}.
             
             Structure:
             - Main context/stem (optional).
             - ${subQCount} sub-questions (parts a, b, c...).
             - Be mindful of realistic completion time.
             
             ${specificInstruction}
             ${mathConstraints}
             ${diagramInstruction}
             
             Output JSON Schema:
             {
               "questionText": "Main stem...",
               "context": "Shared context/table...",
               "type": "Short Answer",
               "maxMarks": number (sum of parts),
               "topic": "${topic}",
               "diagramType": ..., "diagramData": ...,
               "subQuestions": [
                  { "label": "(a)", "text": "...", "maxMarks": number, "type": "Short Answer" },
                  { "label": "(b)", "text": "...", "maxMarks": number, "type": "Short Answer" }
               ]
             }
          `;

          qPromises.push(
              ai.models.generateContent({
                  model: modelName,
                  contents: [{ role: 'user', parts: [{ text: prompt }] }],
                  config: { responseMimeType: 'application/json' }
              }).then(res => JSON.parse(res.text || '{}'))
          );
      }
      
      const results = await Promise.all(qPromises);
      results.forEach(q => {
          if (q && typeof q === 'object') {
              questions.push(q);
          }
      });
  }

  // Final cleanup of IDs
  return questions.map(q => ({
      id: crypto.randomUUID(),
      subjectId: subject.id,
      ...q,
      maxMarks: q.maxMarks || 1, // Ensure default
      options: q.options || undefined,
      subQuestions: q.subQuestions?.map((sq: any) => ({...sq, id: crypto.randomUUID()}))
  }));
};


export const evaluateAnswer = async (question: Question, userAnswer: string): Promise<EvaluationResult> => {
    const modelName = getModelName();
    
    const prompt = `
      You are an expert examiner marking a student's answer for ${question.subjectId}.
      Question: ${question.questionText}
      Context: ${question.context || 'None'}
      Sub-questions: ${JSON.stringify(question.subQuestions || [])}
      Max Marks: ${question.maxMarks}
      
      Student Answer: "${userAnswer}"
      (Note: If structured, the student likely labelled parts like (a) answer... (b) answer...)
      
      Mark strictly. Understand LaTeX.
      Output JSON:
      {
        "score": number,
        "feedback": "Detailed feedback per part.",
        "sampleAnswer": "Model answer.",
        "isCorrect": boolean
      }
    `;

    try {
        const response = await ai.models.generateContent({
            model: modelName,
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            config: { responseMimeType: 'application/json' }
        });
        const result = JSON.parse(response.text || '{}');
        return { maxMarks: question.maxMarks, ...result };
    } catch (error) {
        return { score: 0, maxMarks: question.maxMarks, feedback: "Error", sampleAnswer: "", isCorrect: false };
    }
};