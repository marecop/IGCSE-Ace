import React, { useEffect, useRef } from 'react';

interface MathInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

// Symbols configuration with smart visual templates (placeholders)
// #0 = current selection or placeholder
// #? = empty placeholder box
const TOOLS = [
  // Basic Arithmetic & Algebra
  { label: 'x²', insert: '#@^2', tooltip: 'Square' },
  { label: 'xⁿ', insert: '#@^{#?}', tooltip: 'Power' },
  { label: '√', insert: '\\sqrt{#0}', tooltip: 'Square Root' },
  { label: 'ⁿ√', insert: '\\sqrt[#?]{#0}', tooltip: 'N-th Root' },
  { label: 'a/b', insert: '\\frac{#0}{#?}', tooltip: 'Fraction' },
  { label: '|x|', insert: '\\left|#0\\right|', tooltip: 'Absolute Value' },
  
  // Logarithms & Exponentials (Pure Math)
  { label: 'logₙ', insert: '\\log_{#?}(#0)', tooltip: 'Log base n' },
  { label: 'ln', insert: '\\ln(#0)', tooltip: 'Natural Log' },
  { label: 'eˣ', insert: 'e^{#?}', tooltip: 'Exponential' },
  
  // Trigonometry
  { label: 'sin', insert: '\\sin(#0)', tooltip: 'Sine' },
  { label: 'cos', insert: '\\cos(#0)', tooltip: 'Cosine' },
  { label: 'tan', insert: '\\tan(#0)', tooltip: 'Tangent' },
  { label: 'θ', insert: '\\theta', tooltip: 'Theta' },
  { label: 'π', insert: '\\pi', tooltip: 'Pi' },

  // Calculus (Differentiation/Integration)
  { label: 'd/dx', insert: '\\frac{d}{dx}(#0)', tooltip: 'Derivative' },
  { label: '∫', insert: '\\int_{#?}^{#?} #0 \\,dx', tooltip: 'Definite Integral' },
  
  // Statistics & Sequences
  { label: 'Σ', insert: '\\sum_{#?}^{#?} #0', tooltip: 'Summation' },
  { label: '∞', insert: '\\infty', tooltip: 'Infinity' },

  // Mechanics (Vectors)
  { label: 'Vec', insert: '\\binom{#?}{#?}', tooltip: 'Column Vector (2D)' },
];

const MathInput: React.FC<MathInputProps> = ({ value, onChange, placeholder, disabled }) => {
  const mfRef = useRef<any>(null);

  useEffect(() => {
    // Sync external value changes to the math-field
    if (mfRef.current && mfRef.current.value !== value) {
        mfRef.current.setValue(value);
    }
  }, [value]);

  useEffect(() => {
    const mf = mfRef.current;
    if (!mf) return;

    // Listen for input changes from the user
    const handleInput = (evt: Event) => {
        const target = evt.target as any;
        onChange(target.value);
    };

    mf.addEventListener('input', handleInput);
    return () => mf.removeEventListener('input', handleInput);
  }, [onChange]);

  const handleToolClick = (insertCommand: string) => {
    if (!mfRef.current) return;
    mfRef.current.focus();
    // Execute the insertion command. 
    // This creates the "template" effect where the user can just tab/arrow between boxes
    mfRef.current.executeCommand('insert', insertCommand);
  };

  return (
    <div className="flex flex-col gap-0 w-full shadow-sm rounded-lg overflow-hidden border border-slate-200">
      {/* Custom Calculator Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 bg-slate-50 border-b border-slate-200 items-center overflow-x-auto">
        <span className="text-[10px] font-bold text-slate-400 uppercase mr-1 select-none tracking-wider hidden sm:inline-block">
          Tools:
        </span>
        {TOOLS.map((tool) => (
          <button
            key={tool.label}
            onClick={() => handleToolClick(tool.insert)}
            disabled={disabled}
            type="button"
            className="h-8 min-w-[36px] px-2 bg-white border border-slate-200 rounded hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-600 text-sm font-semibold text-slate-600 transition-all shadow-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center whitespace-nowrap"
            title={tool.tooltip}
          >
            {tool.label}
          </button>
        ))}
      </div>

      {/* MathLive Component */}
      <div className="relative bg-white min-h-[60px]">
        {React.createElement('math-field', {
          ref: mfRef,
          'virtual-keyboard-mode': 'manual', // Hide the default mobile virtual keyboard
          disabled: disabled,
          placeholder: placeholder,
          style: {
             fontSize: '1.1rem',
             padding: '1rem',
             width: '100%',
             outline: 'none',
             border: 'none',
             backgroundColor: 'transparent'
          }
        }, value)}
        
        {/* Helper Hint */}
        <div className="absolute top-2 right-2 opacity-0 hover:opacity-100 transition-opacity pointer-events-none z-10">
             <span className="bg-slate-800 text-white text-[10px] px-2 py-1 rounded shadow">Use arrow keys or Tab to move between boxes</span>
        </div>
      </div>

      {/* Footer / Status */}
      <div className="bg-slate-50 px-3 py-1 border-t border-slate-100 flex justify-end items-center">
        <span className="text-[10px] text-slate-400">
           LaTeX Preview: {value ? value.substring(0, 30) + (value.length > 30 ? '...' : '') : '(empty)'}
        </span>
      </div>
    </div>
  );
};

export default MathInput;