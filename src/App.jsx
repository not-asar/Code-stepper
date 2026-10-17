import { useState } from 'react';

const fullCode = [
  "void fibonacci(int n) {",
  "    unsigned long long a = 0, b = 1, c;",
  "    printf(\"%llu \", a);",
  "    if (n >= 2) printf(\"%llu \", b);",
  "    for (int i = 2; i < n; i++) {",
  "        c = a + b; printf(\"%llu \", c);",
  "        a = b; b = c;",
  "    }",
  "}"
];

const fibonacciSteps = [
  { 
    lineIndex: 1, 
    vars: { n: 5, a: 0, b: 1, c: "?", output: "" }, 
    explanation: "Initialize starting variables: 'a' holds the 1st term (0), 'b' holds the 2nd term (1).",
    isLoop: false 
  },
  { 
    lineIndex: 2, 
    vars: { n: 5, a: 0, b: 1, c: "?", output: "0 " }, 
    explanation: "Print the first term ('a', which is 0) directly to the screen.",
    isLoop: false 
  },
  { 
    lineIndex: 3, 
    vars: { n: 5, a: 0, b: 1, c: "?", output: "0 1 " }, 
    explanation: "Since n (5) is 2 or greater, print the second term ('b', which is 1).",
    isLoop: false 
  },
  {
    lineIndex: 4,
    vars: { n: 5, a: 2, b: 3, c: 3, output: "0 1 1 2 3 " },
    explanation: "Loop runs 3 times (for i = 2, 3, and 4) to calculate and print the remaining terms.",
    isLoop: true,
    iterations: [
      { cycle: 1, i: 2, vars: { n: 5, a: 1, b: 1, c: 1, output: "0 1 1 " }, detail: "Cycle 1 (i=2): c = 0 + 1 (1). Prints 1. Shifts a=1, b=1." },
      { cycle: 2, i: 3, vars: { n: 5, a: 1, b: 2, c: 2, output: "0 1 1 2 " }, detail: "Cycle 2 (i=3): c = 1 + 1 (2). Prints 2. Shifts a=1, b=2." },
      { cycle: 3, i: 4, vars: { n: 5, a: 2, b: 3, c: 3, output: "0 1 1 2 3 " }, detail: "Cycle 3 (i=4): c = 1 + 2 (3). Prints 3. Shifts a=2, b=3." }
    ]
  }
];

export default function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [loopMaximized, setLoopMaximized] = useState(false);
  const [loopCycle, setLoopCycle] = useState(0);

  const stepData = fibonacciSteps[currentStep];
  const activeVars = (stepData.isLoop && loopMaximized) 
    ? stepData.iterations[loopCycle].vars 
    : stepData.vars;

  return (
    <div style={{ padding: '30px', fontFamily: 'system-ui, sans-serif', maxWidth: '850px', margin: '0 auto', color: '#222' }}>
      <h2>Code Stepper: Visual C Debugger</h2>

      {/* Controls */}
      <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
        <button 
          onClick={() => { setCurrentStep(Math.max(0, currentStep - 1)); setLoopMaximized(false); }}
          disabled={currentStep === 0}
          style={{ padding: '8px 16px', cursor: 'pointer' }}
        >
          ⬅️ Previous Step
        </button>
        <strong>Step {currentStep + 1} of {fibonacciSteps.length}</strong>
        <button 
          onClick={() => { setCurrentStep(Math.min(fibonacciSteps.length - 1, currentStep + 1)); setLoopMaximized(false); }}
          disabled={currentStep === fibonacciSteps.length - 1}
          style={{ padding: '8px 16px', cursor: 'pointer' }}
        >
          Next Step ➡️
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '20px' }}>
        {/* Left Side: Full Code View with Moving Highlight */}
        <div style={{ background: '#1e1e1e', color: '#d4d4d4', padding: '15px', borderRadius: '8px', fontFamily: 'monospace' }}>
          {fullCode.map((lineText, index) => {
            const isHighlighted = index === stepData.lineIndex || (stepData.isLoop && loopMaximized && (index >= 4 && index <= 7));
            return (
              <div 
                key={index} 
                style={{ 
                  background: isHighlighted ? '#264f78' : 'transparent',
                  color: isHighlighted ? '#fff' : '#858585',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  whiteSpace: 'pre'
                }}
              >
                <span style={{ marginRight: '12px', color: '#555' }}>{index + 1}</span>
                {lineText}
              </div>
            );
          })}
        </div>

        {/* Right Side: Live Memory & Console Output */}
        <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px', border: '1px solid #ddd' }}>
          <h4 style={{ marginTop: 0 }}>🧠 Live Memory (Variables)</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
            {['n', 'a', 'b', 'c'].map((varName) => (
              <div key={varName} style={{ background: '#fff', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', textAlign: 'center' }}>
                <div style={{ fontSize: '12px', color: '#666' }}>{varName}</div>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#0066cc' }}>{activeVars[varName]}</div>
              </div>
            ))}
          </div>

          <h4>🖥️ Console Output</h4>
          <div style={{ background: '#000', color: '#4af626', padding: '10px', borderRadius: '6px', fontFamily: 'monospace', minHeight: '24px' }}>
            {activeVars.output || "(nothing printed yet)"}
          </div>
        </div>
      </div>

      {/* Bottom: Explanation & Loop Maximizer */}
      <div style={{ marginTop: '20px', padding: '15px', background: '#eef6ff', borderRadius: '8px', border: '1px solid #b8daff' }}>
        <p style={{ margin: 0, fontSize: '16px' }}><strong>What's happening:</strong> {stepData.explanation}</p>

        {stepData.isLoop && (
          <div style={{ marginTop: '15px', borderTop: '1px solid #b8daff', paddingTop: '15px' }}>
            <button 
              onClick={() => setLoopMaximized(!loopMaximized)}
              style={{ padding: '8px 14px', background: '#0066cc', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
            >
              {loopMaximized ? "🔼 Minimize Loop" : "🔽 Maximize Loop to scrub through each cycle"}
            </button>

            {loopMaximized && (
              <div style={{ marginTop: '15px', background: '#fff', padding: '15px', borderRadius: '6px', border: '1px solid #ccc' }}>
                <label><strong>Scrub Loop Cycle ({loopCycle + 1} of {stepData.iterations.length}): </strong></label>
                <input 
                  type="range" 
                  min="0" 
                  max={stepData.iterations.length - 1} 
                  value={loopCycle}
                  onChange={(e) => setLoopCycle(Number(e.target.value))}
                  style={{ width: '100%', marginTop: '8px' }}
                />
                <p style={{ marginBottom: 0 }}><strong>{stepData.iterations[loopCycle].detail}</strong></p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}