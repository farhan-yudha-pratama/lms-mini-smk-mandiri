'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';

const Editor = dynamic(() => import('@monaco-editor/react').then(mod => mod.Editor), {
  ssr: false,
  loading: () => <div className="p-8 text-center text-gray-500 font-mono text-sm bg-gray-50 animate-pulse">Loading Monaco Editor...</div>
});

interface CodeSandboxProps {
  language: string;
  initialCode: string;
  testCases: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export default function CodeSandbox({ language, initialCode, testCases, value, onChange, disabled }: CodeSandboxProps) {
  const [output, setOutput] = useState<string>('');
  const [testResults, setTestResults] = useState<{ passed: number, total: number, results: any[] } | null>(null);
  
  // Use initial code if value is empty and hasn't been edited
  useEffect(() => {
    if (!value && initialCode) {
      onChange(initialCode);
    }
  }, [initialCode, value]);

  const handleRunHTML = () => {
    // We will render it in an iframe using srcDoc
    setOutput(value);
  };

  const runJSTests = () => {
    if (!testCases) return;
    try {
      const parsedCases = JSON.parse(testCases);
      if (!Array.isArray(parsedCases)) return;

      let passedCount = 0;
      const results = parsedCases.map((tc: any, idx: number) => {
        try {
          // Dangerous, but we will sandbox it eventually (this is basic eval for now, inside browser)
          // We wrap user code and call it with inputs if it's a function, 
          // or we just inject variables. Let's do a simple new Function approach.
          
          // Pattern: Assume the user code exposes a function or we just append the test execution
          const testExecutionCode = `
            ${value}
            // Add your test execution logic here based on expected structure
            // For simple scripts, we can just return a specific variable or evaluate a function
          `;
          
          // Temporary placeholder for simple evaluation: 
          // If we want to actually execute JS tests safely in the browser, we should use a Web Worker.
          return { testCase: idx + 1, passed: false, error: 'Auto-testing not fully implemented yet' };
        } catch (e: any) {
          return { testCase: idx + 1, passed: false, error: e.message };
        }
      });
      
      setTestResults({ passed: passedCount, total: parsedCases.length, results });
    } catch (e) {
      console.error("Invalid JSON test cases", e);
    }
  };

  return (
    <div className="flex flex-col h-[500px] md:h-[600px] border-2 border-black rounded-lg overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="flex justify-between items-center bg-gray-100 p-2 border-b-2 border-black">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">terminal</span>
          <span className="font-bold text-sm uppercase">{language}</span>
        </div>
        <div className="flex gap-2">
          {language === 'html' ? (
            <button 
              type="button"
              onClick={handleRunHTML}
              className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded flex items-center gap-1 hover:bg-blue-700"
            >
              <span className="material-symbols-outlined text-[16px]">play_arrow</span> Run Preview
            </button>
          ) : language === 'javascript' ? (
            <button 
              type="button"
              onClick={runJSTests}
              className="px-3 py-1 bg-green-600 text-white text-xs font-bold rounded flex items-center gap-1 hover:bg-green-700"
            >
              <span className="material-symbols-outlined text-[16px]">bug_report</span> Run Tests
            </button>
          ) : null}
        </div>
      </div>

      {/* Editor & Preview Split */}
      <div className={`flex flex-1 overflow-hidden ${language === 'html' ? 'flex-col md:flex-row' : 'flex-col'}`}>
        <div className={`flex-1 overflow-hidden ${language === 'html' ? 'border-b-2 md:border-b-0 md:border-r-2 border-black' : ''}`}>
          <Editor
            height="100%"
            language={language === 'html' ? 'html' : language === 'javascript' ? 'javascript' : 'sql'}
            theme="vs-light"
            value={value}
            onChange={(val) => onChange(val || '')}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              wordWrap: 'on',
              readOnly: disabled
            }}
          />
        </div>
        
        {/* Output Panel for HTML/CSS */}
        {language === 'html' && (
          <div className="flex-1 bg-white relative">
            <iframe 
              srcDoc={output}
              sandbox="allow-scripts"
              className="w-full h-full border-none"
              title="Preview"
            />
            {!output && (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm font-bold">
                Klik "Run Preview" untuk melihat hasil
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Test Results Panel for JS / SQL */}
      {language !== 'html' && testResults && (
        <div className="h-40 bg-gray-900 text-white p-3 font-mono text-sm overflow-y-auto">
          <div className="mb-2 font-bold text-gray-300 border-b border-gray-700 pb-2">
            Test Results: {testResults.passed} / {testResults.total} Passed
          </div>
          {testResults.results.map((res, idx) => (
            <div key={idx} className={`mb-1 ${res.passed ? 'text-green-400' : 'text-red-400'}`}>
              Test Case {res.testCase}: {res.passed ? 'PASSED' : `FAILED - ${res.error}`}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
