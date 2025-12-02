import React from 'react';
import { Subject, ExamBoard, PaperType } from './types';

// Icons as simple SVG components
export const Icons = {
  Computer: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
    </svg>
  ),
  Beaker: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
    </svg>
  ),
  Bolt: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
    </svg>
  ),
  Book: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
    </svg>
  ),
  People: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
    </svg>
  ),
  Math: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.745 3A23.933 23.933 0 003 12c0 3.183.62 6.22 1.745 9M19.5 3c.967 2.78 1.5 5.817 1.5 9s-.533 6.22-1.5 9M8.25 8.885l1.444-.89a.75.75 0 011.105.402l2.402 7.206a.75.75 0 001.104.401l1.445-.889m-8.25.75l.213.09a1.687 1.687 0 002.062-.617l4.45-6.676a1.688 1.688 0 012.062-.618l.213.09" />
    </svg>
  ),
  Chart: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
    </svg>
  ),
  Cog: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.02-.398-1.11-.94l-.149-.894c-.07-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527a1.125 1.125 0 01-1.45-.12l-.773-.774c-.39-.389-.44-1.002-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.107-1.204l-.527-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.149-.894z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  Check: () => (
     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-green-600">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  ),
  XMark: () => (
     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-red-600">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
};

export const SUBJECTS: Subject[] = [
  // --- CIE Subjects ---
  {
    id: 'cie-0478',
    name: 'Computer Science',
    code: '0478',
    board: ExamBoard.CIE,
    icon: <Icons.Computer />,
    description: 'Data representation, logic gates, hardware, and algorithms.',
    availablePapers: [PaperType.MCQ_CORE, PaperType.THEORY_EXT],
    syllabusTopics: [
      'Data Representation (Binary, Hexadecimal)',
      'Data Storage (Formats, Compression)',
      'Hardware (Architecture, Fetch-Execute Cycle)',
      'Logic Gates & Logic Circuits',
      'Input & Output Devices',
      'Sensors',
      'High-level and Low-level Languages',
      'Security (Firewalls, Encryption, Phishing)',
      'Ethics and Ownership',
      'Algorithm Design & Pseudocode'
    ]
  },
  {
    id: 'cie-0620',
    name: 'Chemistry',
    code: '0620',
    board: ExamBoard.CIE,
    icon: <Icons.Beaker />,
    description: 'Atoms, stoichiometry, electrochemistry, and organic chemistry.',
    availablePapers: [PaperType.MCQ_CORE, PaperType.THEORY_EXT],
    syllabusTopics: [
      'States of Matter & Atoms',
      'Stoichiometry & The Mole Concept',
      'Electrochemistry & Electrolysis',
      'Chemical Energetics',
      'Rate of Reaction',
      'Reversible Reactions & Equilibrium',
      'Acids, Bases and Salts',
      'The Periodic Table',
      'Metals (Extraction & Properties)',
      'Air and Water',
      'Organic Chemistry (Alkanes, Alkenes, Alcohols)',
      'Polymers (Synthetic & Natural)'
    ]
  },
  {
    id: 'cie-0625',
    name: 'Physics',
    code: '0625',
    board: ExamBoard.CIE,
    icon: <Icons.Bolt />,
    description: 'Motion, forces, energy, thermal physics, and waves.',
    availablePapers: [PaperType.MCQ_CORE, PaperType.THEORY_EXT],
    syllabusTopics: [
      'Measurement (Micrometer, Pendulum Period)',
      'Motion (Speed-Time Graphs, Acceleration)',
      'Forces (Weight vs Mass, Hooke’s Law)',
      'Density and Pressure (Floating, Manometers)',
      'Moments and Stability (See-saw, Pivot)',
      'Work, Energy and Power (KE, GPE, Efficiency)',
      'Thermal Physics (Conduction, Convection, Radiation)',
      'Waves (Light Refraction, Lenses, Sound)',
      'Electricity (Circuits, I=V/R, Transformers, Logic Gates)',
      'Electromagnetism (Motors, Generators)',
      'Nuclear Physics (Alpha/Beta/Gamma, Half-life)',
      'Space Physics (Orbits, Redshift, Hubble Law)'
    ]
  },
  {
    id: 'cie-0510',
    name: 'ESL (Reading & Writing)',
    code: '0510',
    board: ExamBoard.CIE,
    icon: <Icons.Book />,
    description: 'Reading comprehension, info matching, summary, and writing reviews/essays.',
    availablePapers: [PaperType.P1_GENERAL],
    syllabusTopics: [
      'Reading: Information Matching',
      'Reading: Short Answer Questions',
      'Reading: Note-making',
      'Writing: Summary Writing',
      'Writing: Informal Email',
      'Writing: Review',
      'Writing: Article',
      'Writing: Essay'
    ]
  },
  {
    id: 'cie-0495-p1',
    name: 'Sociology Paper 1',
    code: '0495/1',
    board: ExamBoard.CIE,
    icon: <Icons.People />,
    description: 'Research Methods, Identity, and Social Inequality.',
    availablePapers: [PaperType.P1_GENERAL],
    syllabusTopics: [
      'Research Methods (Surveys, Interviews, Sampling, Ethics)',
      'Identity (Socialisation, Norms, Values, Youth subcultures)',
      'Social Inequality (Social Class, Gender, Ethnicity, Age)'
    ]
  },
  {
    id: 'cie-0495-p2',
    name: 'Sociology Paper 2',
    code: '0495/2',
    board: ExamBoard.CIE,
    icon: <Icons.People />,
    description: 'Family, Education, and Crime.',
    availablePapers: [PaperType.P2_GENERAL],
    syllabusTopics: [
      'Family (Functions, Conjugal roles, Divorce, Diversity)',
      'Education (Social class, Gender, Ethnicity, Hidden curriculum)',
      'Crime (Social control, Crime patterns, Media coverage)'
    ]
  },
  
  // --- Edexcel IAL Subjects ---
  {
    id: 'edx-pure1',
    name: 'Pure Mathematics 1',
    code: 'WMA11',
    board: ExamBoard.Edexcel,
    icon: <Icons.Math />,
    description: 'Algebra, quadratics, trigonometry, and basic calculus.',
    availablePapers: [PaperType.PURE_MATH],
    syllabusTopics: [
      'Algebra & Functions (Indices, Surds)',
      'Quadratics (Discriminant, Completing the square)',
      'Equations and Inequalities',
      'Graphs and Transformations',
      'Coordinate Geometry (Straight Lines)',
      'Radian Measure (Arc length, Sector area)',
      'Trigonometry (Sine/Cosine Rule, Graphs)',
      'Differentiation (First principles, Tangents/Normals)',
      'Integration (Indefinite)'
    ]
  },
  {
    id: 'edx-pure2',
    name: 'Pure Mathematics 2',
    code: 'WMA12',
    board: ExamBoard.Edexcel,
    icon: <Icons.Math />,
    description: 'Proofs, exponentials, logs, sequences, and series.',
    availablePapers: [PaperType.PURE_MATH],
    syllabusTopics: [
      'Proof (Algebraic methods)',
      'Algebra & Functions (Factor Theorem)',
      'Coordinate Geometry (Circles)',
      'Binomial Expansion',
      'Sequences and Series (Arithmetic & Geometric)',
      'Trigonometric Identities (Pythagorean)',
      'Exponentials and Logarithms',
      'Differentiation (Maxima/Minima)',
      'Integration (Definite, Area under curve)'
    ]
  },
  {
    id: 'edx-stats1',
    name: 'Statistics 1',
    code: 'WST01',
    board: ExamBoard.Edexcel,
    icon: <Icons.Chart />,
    description: 'Probability, correlation, regression, and discrete random variables.',
    availablePapers: [PaperType.STATISTICS],
    syllabusTopics: [
      'Mathematical Models in Probability',
      'Representation of Data (Histograms, Stem & Leaf)',
      'Location and Dispersion (Mean, Variance, Std Dev)',
      'Probability (Venn Diagrams, Conditional)',
      'Correlation and Regression',
      'Discrete Random Variables',
      'The Normal Distribution'
    ]
  },
  {
    id: 'edx-mech1',
    name: 'Mechanics 1',
    code: 'WME01',
    board: ExamBoard.Edexcel,
    icon: <Icons.Cog />,
    description: 'Kinematics, dynamics, statics, and moments.',
    availablePapers: [PaperType.MECHANICS],
    syllabusTopics: [
      'Kinematics (Constant acceleration, suvat)',
      'Dynamics of a Particle (F=ma)',
      'Statics of a Particle (Equilibrium)',
      'Moments (Equilibrium of rigid bodies)',
      'Vectors (Magnitude, Direction, Resultants)'
    ]
  },
];