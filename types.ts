import React from 'react';

export enum ExamBoard {
  CIE = 'CIE (Cambridge)',
  Edexcel = 'Edexcel (Pearson)'
}

export enum QuestionType {
  MCQ = 'Multiple Choice',
  SHORT_ANSWER = 'Short Answer',
  ESSAY = 'Essay/Long Answer'
}

export enum ExamMode {
  PRACTICE = 'Practice Mode',
  MOCK = 'Mock Exam Mode'
}

export enum PaperType {
  MCQ_CORE = 'Paper 1 (MCQ Core)',
  MCQ_EXT = 'Paper 2 (MCQ Extended)', // Often CIE P2 is MCQ for A-level or P2 for IGCSE
  THEORY_CORE = 'Paper 3 (Theory Core)',
  THEORY_EXT = 'Paper 4 (Theory Extended)',
  P1_GENERAL = 'Paper 1', // Sociology
  P2_GENERAL = 'Paper 2', // Sociology
  PURE_MATH = 'Pure Mathematics',
  STATISTICS = 'Statistics',
  MECHANICS = 'Mechanics'
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  board: ExamBoard;
  icon: React.ReactNode;
  description: string;
  syllabusTopics: string[]; 
  availablePapers: PaperType[]; // Which papers are available for this subject
}

export type DiagramType = 'IMAGE' | 'SVG' | 'NETLIST' | 'SMILES';

export interface SubQuestion {
  id: string;
  label: string; // e.g., "(a)", "(b)(i)"
  text: string; // The specific question text for this part
  maxMarks: number;
  type: QuestionType;
  answer?: string; // For holding user answer in state
}

export interface Question {
  id: string;
  subjectId: string;
  type: QuestionType;
  context?: string; // Shared context (reading passage, main scenario, table)
  questionText: string; // Main question stem
  options?: string[]; // Only for MCQ
  maxMarks: number; // Total marks for the whole question
  topic?: string;
  
  // Diagramming
  diagramType?: DiagramType;
  diagramData?: string; // JSON string or SVG code or Image URL

  // Structured Questions
  subQuestions?: SubQuestion[];
}

export interface EvaluationResult {
  score: number;
  maxMarks: number;
  feedback: string;
  sampleAnswer: string;
  isCorrect: boolean;
}

export type ViewState = 'HOME' | 'MODE_SELECT' | 'QUIZ' | 'EXAM' | 'README';
