import React from 'react';
import Button from './Button';

interface ReadMeViewProps {
  onBack: () => void;
}

const ReadMeView: React.FC<ReadMeViewProps> = ({ onBack }) => {
  return (
    <div className="max-w-4xl mx-auto pb-12 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <button 
          onClick={onBack} 
          className="text-sm text-slate-500 hover:text-indigo-600 mb-4 flex items-center gap-1 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to Home
        </button>
        <h1 className="text-3xl font-extrabold text-slate-900">About & Legal</h1>
        <p className="text-slate-500 mt-2">Usage Regulations, Privacy Policy, and AI Disclaimers.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden divide-y divide-slate-100">
        
        {/* Section 1: AI Disclaimer */}
        <section className="p-8">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">AI-Generated Content Disclaimer</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                This website is powered by <strong>Google Gemini AI</strong>. All questions, diagrams, marking schemes, and feedback are generated in real-time by artificial intelligence.
              </p>
              <ul className="list-disc pl-5 text-slate-600 space-y-2">
                <li>
                  <strong>Accuracy:</strong> While we strive for high accuracy based on the syllabus, AI models can occasionally produce errors, hallucinations, or inaccurate calculations.
                </li>
                <li>
                  <strong>Not Official Advice:</strong> This tool is for practice purposes only. It is not affiliated with Cambridge Assessment International Education (CIE) or Pearson Edexcel. Always consult official textbooks and past papers for definitive exam preparation.
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 2: Privacy Policy */}
        <section className="p-8">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-green-50 text-green-600 rounded-lg shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">Privacy Policy</h2>
              <p className="text-slate-600 leading-relaxed">
                We respect your privacy and data security.
              </p>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="bg-slate-50 p-4 rounded-lg">
                  <h3 className="font-bold text-slate-800 mb-1">No Data Collection</h3>
                  <p className="text-sm text-slate-500">
                    We do not store your answers, performance data, or personal information on any server. All processing happens ephemerally during your session.
                  </p>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <h3 className="font-bold text-slate-800 mb-1">API Usage</h3>
                  <p className="text-sm text-slate-500">
                    Your inputs are sent to the Google Gemini API solely for the purpose of generating questions and evaluating answers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Usage Regulations */}
        <section className="p-8">
           <div className="flex items-start gap-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-lg shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">Usage Regulations</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                By using this application, you agree to the following terms:
              </p>
              <ul className="list-decimal pl-5 text-slate-600 space-y-2 marker:text-slate-400 marker:font-bold">
                <li>
                  <strong>Fair Use:</strong> This tool is intended for personal educational use. Automated scraping or misuse of the API is prohibited.
                </li>
                <li>
                  <strong>Academic Integrity:</strong> Do not use this tool to cheat on real exams or assessments. It is designed to supplement your learning, not replace honest effort.
                </li>
                <li>
                  <strong>Content Rights:</strong> The underlying exam structures and syllabus topics are properties of their respective examination boards. The generated content is synthetic.
                </li>
              </ul>
            </div>
          </div>
        </section>

      </div>
      
      <div className="mt-8 text-center">
         <Button onClick={onBack} variant="primary">I Understand, Return Home</Button>
      </div>
    </div>
  );
};

export default ReadMeView;
