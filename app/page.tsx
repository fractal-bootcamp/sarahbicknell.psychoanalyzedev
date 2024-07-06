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
    <div className="flex bg-psychoffice bg-cover bg-center h-screen w-screen py-8 px-8">
          {/* left column */}
          <div className="flex-grow-[.7] flex flex-col pl-20">
            <h1 className="font-serif tracking-wider text-6xl font-light pl-10 text-slate-200 shadow-md mb-6"
                style={{
                  textShadow: "0px 0px 10px yellow",
                }}>
              psychoanalyze.dev
            </h1>
            <textarea
              className="max-w-[95%] h-40 bg-black bg-opacity-50 border border-gray-600 rounded-md text-white p-2 mb-4"
              value={code}
              onChange={(event) => setCode(event.target.value)}
              placeholder="For some strange reason, you think showing your analyst a code snippet might be enlightening... (paste code here)"
            />
            <button 
              className="bg-black bg-opacity-50 hover:bg-amber-800 hover:bg-opacity-80 rounded text-white font-mono w-16 mb-3 self-end mr-12"
              onClick={generateAnalysis}
            >
              Enter
            </button>
            <textarea
              className="max-w-[95%] h-80 bg-black bg-opacity-50 border border-gray-600 rounded-md text-white p-2 mb-4"
              value={loading ? "Analyzing..." : displayText}
              readOnly
            />
        </div>
        {/* right column */}
        <div className="flex-grow-[.3]"> 
        <img 
          src="/analyst.webp" 
          alt="Analyst" 
          className="max-h-[95%] w-auto rounded-3xl" 
          />
        </div> 
    </div>
  );
}

