'use client';

import {useChat} from 'ai/react';

export default function Home() {
  const  {messages, input, handleInputChange, handleSubmit, isLoading} = useChat()


  return (
    <div className="flex flex-col min-h-screen w-screen bg-psychoffice bg-cover bg-center p-4 md:p-8">
      <h1 className="font-serif tracking-wider text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-slate-200 shadow-md mb-4 md:mb-6 text-center md:text-left"
          style={{
            textShadow: "0px 0px 10px yellow",
          }}>
        psychoanalyze.dev
      </h1>
  
      <div className="flex flex-col md:flex-row flex-grow">
        <div className="flex-grow md:w-[70%] flex flex-col md:pr-8 order-last md:order-first">
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row ">
            <textarea
              className="w-full h-32 sm:h-36 md:h-40 bg-black font-mono bg-opacity-50 border border-gray-600 rounded-md text-white p-2 mb-4"
              value={input}
              onChange={handleInputChange}
              placeholder="For some strange reason, you think showing your analyst a code snippet might be enlightening... (paste code here)"
              spellCheck="false"
            />
            <button 
              className="bg-black bg-opacity-50 hover:bg-amber-800 hover:bg-opacity-80 rounded text-white font-mono w-16 mb-3 self-end"
              type="submit"
            >
              Enter
            </button>
          </form>
          <div
            className="w-full h-64 sm:h-72 md:h-80 bg-black font-mono bg-opacity-50 border border-gray-600 rounded-md text-white p-2 mb-4 overflow-auto"
          >
            {(() => {
              const lastAnalystMessage = messages
                .filter(m => m.role === 'assistant')
                .pop();
              
              if (lastAnalystMessage) {
                return (
                  <div className="whitespace-pre-wrap mb-2">
                    {lastAnalystMessage.content}
                  </div>
                );
              } else if (isLoading) {
                return <div>The analyst is pondering your code...</div>;
              } else {
                return <div>Await the analyst's insights...</div>;
              }
            })()}
          </div>
        </div>
        
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
