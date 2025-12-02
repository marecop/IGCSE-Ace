import React from 'react';
import { Subject, PaperType, ExamMode } from '../types';
import Button from './Button';

interface ModeSelectionProps {
  subject: Subject;
  onSelectPractice: () => void;
  onSelectMock: (paper: PaperType) => void;
  onBack: () => void;
}

const ModeSelection: React.FC<ModeSelectionProps> = ({ subject, onSelectPractice, onSelectMock, onBack }) => {
  return (
    <div className="max-w-2xl mx-auto py-12">
      <div className="mb-8">
         <button onClick={onBack} className="text-sm text-slate-500 hover:text-indigo-600 mb-4 flex items-center gap-1">
           &larr; Back to Subjects
         </button>
         <h2 className="text-3xl font-bold text-slate-900 mb-2">{subject.name}</h2>
         <p className="text-slate-600">{subject.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Practice Mode */}
        <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm hover:border-indigo-200 transition-all flex flex-col">
          <div className="bg-green-50 w-12 h-12 rounded-lg flex items-center justify-center text-green-600 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Practice Mode</h3>
          <p className="text-slate-500 text-sm mb-6 flex-grow">
            Focus on one question at a time. Instant feedback, skip questions, and learn at your own pace.
          </p>
          <Button onClick={onSelectPractice} className="w-full">Start Practice</Button>
        </div>

        {/* Mock Exam Mode */}
        <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm hover:border-indigo-200 transition-all flex flex-col">
           <div className="bg-amber-50 w-12 h-12 rounded-lg flex items-center justify-center text-amber-600 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Mock Exam Mode</h3>
          <p className="text-slate-500 text-sm mb-4">
            Simulate a real exam. Full paper, timed conditions, no skips. Review your answers at the end.
          </p>
          
          <div className="space-y-2 mt-auto">
            <p className="text-xs font-bold uppercase text-slate-400">Select Paper:</p>
            {subject.availablePapers.map(paper => (
              <Button 
                key={paper} 
                variant="outline" 
                className="w-full text-sm py-1.5"
                onClick={() => onSelectMock(paper)}
              >
                {paper}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModeSelection;