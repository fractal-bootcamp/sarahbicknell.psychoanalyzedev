'use client';

import { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
  const [code, setCode] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [displayText, setDisplayText] = useState("");
  const [loading, setLoading] = useState(false);
 

  async function generateAnalysis() {
    setLoading(true);
    try {
      const response = await axios.post('/api/generate-comments', { code });
      setAnalysis(response.data.message);
    } catch (error) {
      console.log("Error generating comments: ", error);
      setAnalysis("The analyst just sighs, puffing on his cigarette. (Perhaps try a bit later)");
    }
  }

  useEffect(() => {
    setLoading(false);
    if (displayText.length < analysis.length) {
      setTimeout(() => {
        setDisplayText(analysis.slice(0, displayText.length + 1));
      }, 4);
    } 
  }, [displayText,analysis]);
  return (
    <div className="flex flex-col min-h-screen w-screen bg-psychoffice bg-cover bg-center p-4 md:p-8">
      {/* keept totitle at top top */}
      <h1 className="font-serif tracking-wider text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-slate-200 shadow-md mb-4 md:mb-6 text-center md:text-left"
          style={{
            textShadow: "0px 0px 10px yellow",
          }}>
        psychoanalyze.dev
      </h1>
  
      {/* imge and main content */}
      <div className="flex flex-col md:flex-row flex-grow">
        {/* Left column for content */}
        <div className="flex-grow md:w-[70%] flex flex-col md:pr-8 order-last md:order-first">
          <textarea
            className="w-full h-32 sm:h-36 md:h-40 bg-black font-mono bg-opacity-50 border border-gray-600 rounded-md text-white p-2 mb-4"
            value={code}
            onChange={(event) => setCode(event.target.value)}
            placeholder="For some strange reason, you think showing your analyst a code snippet might be enlightening... (paste code here)"
            spellCheck="false"
          />
          <button 
            className="bg-black bg-opacity-50 hover:bg-amber-800 hover:bg-opacity-80 rounded text-white font-mono w-16 mb-3 self-end"
            onClick={generateAnalysis}
          >
            Enter
          </button>
          <textarea
            className="w-full h-64 sm:h-72 md:h-80 bg-black font-serif bg-opacity-50 border border-gray-600 rounded-md text-white p-2 mb-4"
            value={loading ? "Analyzing..." : displayText}
            readOnly
          />
        </div>
        
        {/* Right column image*/}
        <div className="md:w-[30%] flex justify-center items-center mb-4 md:mb-0 md:items-start order-first md:order-last"> 
          <img 
            src="/analyst.webp" 
            alt="Analyst" 
            className="h-32 w-32 md:h-auto md:w-auto md:max-h-[80vh] lg:max-h-[85vh] rounded-full md:rounded-3xl object-cover" 
          />
        </div>
      </div>
    </div>
  );
}

