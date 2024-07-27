'use client';
import { useState, useEffect, useCallback } from 'react';
import {useChat} from 'ai/react';

function useSlowChat(delay = 25) {
  const [slowMessage, setSlowMessage] = useState('');
  const chat = useChat();

  const slowStreamEffect = useCallback(() => {
    if (chat.messages.length === 0) return;

    const lastMessage = chat.messages[chat.messages.length - 1];
    if (lastMessage.role !== 'assistant') return;

    let index = slowMessage.length;
    const intervalId = setInterval(() => {
      if (index < lastMessage.content.length) {
        setSlowMessage(lastMessage.content.slice(0, index + 1));
        index++;
      } else {
        clearInterval(intervalId);
      }
    }, delay);

    return () => clearInterval(intervalId);
  }, [chat.messages, slowMessage, delay]);

  useEffect(slowStreamEffect, [slowStreamEffect]);

  return { 
    ...chat,
    messages: [
      ...chat.messages.slice(0, -1),
      { ...chat.messages[chat.messages.length - 1], content: slowMessage }
    ]
  };
}

export default function Home() {
  const { messages, input, handleInputChange, handleSubmit: originalHandleSubmit, isLoading } = useSlowChat(50);
  const [inputValue, setInputValue] = useState(input); // Initialize with the input from useChat

  const handleInputChangeLocal = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    handleInputChange(e); // Call the original handleInputChange to keep useChat in sync
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    originalHandleSubmit(e); // Call the original handleSubmit
    // Do not clear inputValue here
  };

  // Update inputValue when messages change (e.g., after a response)
  useEffect(() => {
    setInputValue(input); 
  }, []); 

  return (
    <div className="flex flex-col min-h-screen min-w-full bg-psychoffice bg-cover bg-center p-8 lg:p-8">
      <div className="flex flex-col lg:flex-wrap lg:max-h-screen">
        {/* Title */}
        <div className="max-w-full lg:w-2/3 order-1 lg:order-1 mb-4 lg:mb-0 overflow-hidden break-all">
          <h1 className="font-serif tracking-wider text-3xl sm:text-5xl xl:text-6xl font-light text-neutral-100 text-center shadow-md lg:text-left xl:pl-5 pt-4 lg:pb-4"
              style={{
                textShadow: "0px 0px 8px gold",
              }}>
            psychoanalyze.dev
          </h1>
        </div>
  
        {/* Image */}
        <div className="w-full lg:w-1/3 order-2 lg:order-3 flex flex-shrink justify-center items-center mb-4  lg:mb-0 ">
          <img 
            src="/analyst.webp" 
            alt="Analyst" 
            className="h-32 w-32 lg:h-auto lg:w-auto lg:max-h-[80vh] xl:max-h-[85vh] rounded-full lg:rounded-3xl object-cover shadow-[0_0_10px_rgba(255,255,255,3)] lg:shadow-none" 
          />
        </div>
  
        {/* Text boxes */}
        <div className="w-full lg:w-2/3 order-3 lg:order-2 md:mr-8 lg:mr-4">
          <form onSubmit={handleSubmit} className="flex flex-col">
            <div className='flex flex-col'>
              <textarea
                className="w-full max-h-[30vh] min-h-[20vh] sm:h-36 xl:h-44 bg-[#1D0902] focus:ring-amber-500 font-mono bg-opacity-85 focus:!ring-offset-0 border border-[#4A2F25] rounded-md focus:border-transparent focus:ring-0 placeholder-neutral-300 text-neutral-100 p-2 mb-4"
                value={inputValue}
                onChange={handleInputChangeLocal}
                placeholder="For some strange reason, you think showing your analyst a code snippet might be enlightening... (paste code here)"
                spellCheck="false"
              />
              <button 
                className="bg-amber-950 bg-opacity-75 hover:bg-amber-900 hover:bg-opacity-80 rounded mr-6 lg:mr-10 text-neutral-100 font-mono text-xl px-1 mb-3 transition hover:scale-110 self-end"
                type="submit"
              >
                Analyze
              </button>
            </div>
          </form>
          <div 
            className="w-full h-64 sm:h-72 lg:h-80 xl:h-[40vh] bg-[#1D0902] font-mono bg-opacity-85 border border-[#4A2F25] rounded-md  text-neutral-100 p-2 mb-4 overflow-auto"
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
                return <div>Pondering...</div>;
              } else {
                return <div>{`Await the analyst's insights...`}</div>;
              }
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}


//greater opacity text background
//change button to be more visible and maybe called Analyze 
//make it slower or pause between actions to create suspense, with a button that says "Continue doctor" or something like that 
//can hold the display text in a different state variable to do this 
//super extra cool: puffing cigar frame 
//brian: breakpoint too soon 