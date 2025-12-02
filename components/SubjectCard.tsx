import React from 'react';
import { Subject } from '../types';

interface SubjectCardProps {
  subject: Subject;
  onClick: (subject: Subject) => void;
}

const SubjectCard: React.FC<SubjectCardProps> = ({ subject, onClick }) => {
  return (
    <div 
      onClick={() => onClick(subject)}
      className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md border border-slate-100 cursor-pointer transition-all hover:border-indigo-200 group flex flex-col h-full"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors">
          {subject.icon}
        </div>
        <span className="text-xs font-semibold px-2 py-1 bg-slate-100 text-slate-600 rounded">
          {subject.board === 'CIE (Cambridge)' ? 'CIE' : 'IAL'}
        </span>
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-1">{subject.name}</h3>
      <p className="text-sm font-medium text-slate-500 mb-3">{subject.code}</p>
      <p className="text-sm text-slate-600 flex-grow">{subject.description}</p>
    </div>
  );
};

export default SubjectCard;