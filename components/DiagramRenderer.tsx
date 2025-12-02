import React, { useEffect, useRef, useState } from 'react';
import { DiagramType } from '../types';

interface DiagramRendererProps {
  type: DiagramType;
  data: string;
}

declare global {
  interface Window {
    netlistsvg: any;
    SmilesDrawer: any;
  }
}

const DiagramRenderer: React.FC<DiagramRendererProps> = ({ type, data }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current || !data) return;

    const renderDiagram = async () => {
      setError(null);
      containerRef.current!.innerHTML = ''; // Clear previous

      try {
        // --- 1. NETLIST (Logic Gates) ---
        if (type === 'NETLIST') {
          if (!window.netlistsvg) {
            throw new Error('NetlistSVG library not loaded');
          }
          
          const json = JSON.parse(data);
          
          // NetlistSVG renders into an SVG element
          const svgEl = document.createElementNS("http://www.w3.org/2000/svg", "svg");
          // Set basic attributes to ensure visibility before render
          svgEl.setAttribute('width', '100%');
          svgEl.setAttribute('height', '300px');
          containerRef.current?.appendChild(svgEl);

          // Render
          await window.netlistsvg.render(svgEl, json);
          
          // Post-render adjustments for scaling
          const bbox = svgEl.getBBox();
          if (bbox.width > 0) {
             svgEl.setAttribute('viewBox', `${bbox.x - 10} ${bbox.y - 10} ${bbox.width + 20} ${bbox.height + 20}`);
             svgEl.style.maxHeight = '300px';
             svgEl.style.width = '100%';
          }
        }

        // --- 2. SMILES (Chemical Structures) ---
        else if (type === 'SMILES') {
            if (!window.SmilesDrawer) {
                throw new Error('SmilesDrawer library not loaded');
            }

            const canvas = document.createElement('canvas');
            canvas.setAttribute('id', 'smiles-canvas');
            // Provide large dimensions for high DPI, CSS will scale it down
            canvas.width = 1000;
            canvas.height = 600; 
            canvas.style.width = '100%';
            canvas.style.height = 'auto';
            canvas.style.maxHeight = '300px';
            
            containerRef.current?.appendChild(canvas);

            const options = {
                width: 1000,
                height: 600,
                padding: 20,
                bondThickness: 2.0,
                fontSizeLarge: 20, // Element symbols
                fontSizeSmall: 14, // Numbers/Indices
                terminalCarbons: true, // Show explicit CH3 etc for clarity
                explicitHydrogens: true
            };

            const drawer = new window.SmilesDrawer.Drawer(options);
            // Parse and draw
            window.SmilesDrawer.parse(data, (tree: any) => {
                drawer.draw(tree, canvas, 'light', false);
            }, (err: any) => {
                console.error(err);
                setError('Failed to parse chemical structure');
            });
        }

        // --- 3. RAW SVG (Circuits / Dot & Cross) ---
        else if (type === 'SVG') {
            // Sanitize: ensure it's an SVG tag
            if (!data.trim().startsWith('<svg')) {
                // If AI returned markdown block ```svg ... ```
                const match = data.match(/<svg[\s\S]*<\/svg>/);
                if (match) {
                    containerRef.current!.innerHTML = match[0];
                } else {
                    throw new Error("Invalid SVG data");
                }
            } else {
                containerRef.current!.innerHTML = data;
            }
            
            // Ensure SVG scales responsively
            const svg = containerRef.current!.querySelector('svg');
            if (svg) {
                svg.style.width = '100%';
                svg.style.height = 'auto';
                svg.style.maxHeight = '350px';
                // Ensure text is readable
                svg.style.fontFamily = 'Inter, sans-serif';
            }
        }

        // --- 4. IMAGE (Fallback) ---
        else if (type === 'IMAGE') {
            const img = document.createElement('img');
            img.src = data;
            img.alt = "Diagram";
            img.className = "max-h-[300px] object-contain w-auto mx-auto";
            containerRef.current?.appendChild(img);
        }

      } catch (err) {
        console.error("Diagram Render Error:", err);
        setError("Could not render diagram.");
      }
    };

    renderDiagram();
  }, [type, data]);

  if (error) {
    return (
        <div className="bg-red-50 border border-red-200 text-red-500 text-xs p-2 rounded">
            {error}
        </div>
    );
  }

  return (
    <div 
        className="w-full flex justify-center items-center bg-white rounded-lg p-4 border border-slate-100 shadow-sm overflow-hidden"
        style={{ minHeight: '150px' }}
        ref={containerRef}
    >
        {/* Content injected via ref */}
    </div>
  );
};

export default DiagramRenderer;