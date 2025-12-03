import React, { useState } from 'react';
import { Subject, ViewState, PaperType } from './types';
import { SUBJECTS } from './constants';
import SubjectCard from './components/SubjectCard';
import QuizView from './components/QuizView';
import ModeSelection from './components/ModeSelection';
import ExamView from './components/ExamView';
import ReadMeView from './components/ReadMeView';

const App: React.FC = () => {
  const [viewState, setViewState] = useState<ViewState>('HOME');
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedPaper, setSelectedPaper] = useState<PaperType | null>(null);

  // Flow: Home -> Subject Select -> Mode Select -> (Quiz OR Exam)

  const handleSubjectClick = (subject: Subject) => {
    setSelectedSubject(subject);
    setViewState('MODE_SELECT');
  };

  const handlePracticeStart = () => {
    setViewState('QUIZ');
  };

  const handleMockStart = (paper: PaperType) => {
    setSelectedPaper(paper);
    setViewState('EXAM');
  };

  const handleBackToHome = () => {
    setViewState('HOME');
    setSelectedSubject(null);
    setSelectedPaper(null);
  };

  const handleBackToMode = () => {
    setViewState('MODE_SELECT');
    setSelectedPaper(null);
  };

  const handleOpenReadMe = () => {
    setViewState('README');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2 cursor-pointer" onClick={handleBackToHome}>
              <div className="bg-indigo-600 rounded-lg p-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-white">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.499 5.516 50.552 50.552 0 00-2.658.813m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                </svg>
              </div>
              <span className="font-bold text-xl text-slate-900 tracking-tight">IGCSE Ace</span>
            </div>
            
            <div className="text-xs text-slate-500 font-medium hidden sm:block">
              Powered by Gemini 2.5 Flash
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        
        {viewState === 'HOME' && (
          <div className="space-y-12 animate-fade-in">
            <div className="text-center max-w-2xl mx-auto">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
                Master Your Exams
              </h1>
              <p className="text-lg text-slate-600">
                Select a subject to start practicing with AI-generated questions based on CIE and Edexcel syllabus patterns. You may need to connect the VPN to connect the Gemini services.
              </p>
            </div>

            <div className="space-y-8">
              {/* CIE Section */}
              <div>
                <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-indigo-500 rounded-full"></span>
                  Cambridge IGCSE
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {SUBJECTS.filter(s => s.board.includes('CIE')).map(subject => (
                    <SubjectCard 
                      key={subject.id} 
                      subject={subject} 
                      onClick={handleSubjectClick} 
                    />
                  ))}
                </div>
              </div>

              {/* Edexcel Section */}
              <div>
                 <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
                  Edexcel IAL
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {SUBJECTS.filter(s => s.board.includes('Edexcel')).map(subject => (
                    <SubjectCard 
                      key={subject.id} 
                      subject={subject} 
                      onClick={handleSubjectClick} 
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {viewState === 'README' && (
          <ReadMeView onBack={handleBackToHome} />
        )}

        {viewState === 'MODE_SELECT' && selectedSubject && (
           <ModeSelection 
             subject={selectedSubject} 
             onSelectPractice={handlePracticeStart} 
             onSelectMock={handleMockStart}
             onBack={handleBackToHome}
           />
        )}

        {viewState === 'QUIZ' && selectedSubject && (
          <QuizView 
            subject={selectedSubject} 
            onExit={handleBackToMode} 
          />
        )}
        
        {viewState === 'EXAM' && selectedSubject && selectedPaper && (
          <ExamView
            subject={selectedSubject}
            paperType={selectedPaper}
            onExit={handleBackToMode}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto py-8">
        <div className="max-w-6xl mx-auto px-4 text-center space-y-2">
          <p className="text-sm text-slate-400">
            Note: Questions are generated by AI based on syllabus topics. Always refer to official past papers for final revision.
          </p>
          <button 
            onClick={handleOpenReadMe}
            className="text-xs text-indigo-500 hover:text-indigo-700 font-medium underline"
          >
            ReadMe, Privacy Policy & Disclaimers
          </button>
        </div>
      </footer>
    </div>
  );
};

export default App;
