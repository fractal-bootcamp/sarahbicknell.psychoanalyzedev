'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import {useChat} from 'ai/react';
import { motion } from 'framer-motion';

function useSlowChat(delay: number) {
  const [slowMessage, setSlowMessage] = useState('');
  const [isWaitingForNewMessage, setIsWaitingForNewMessage] = useState(false);
  const [shouldToggleImage, setShouldToggleImage] = useState(false);

  const chat = useChat();

  const slowStreamEffect = useCallback(() => {
    if (chat.messages.length === 0) return;

    const lastMessage = chat.messages[chat.messages.length - 1];
    if (lastMessage.role !== 'assistant') return;

    if (isWaitingForNewMessage) {
      setSlowMessage('');
      setIsWaitingForNewMessage(false);
    }


    let index = slowMessage.length;
    const intervalId = setInterval(() => {
      if (index < lastMessage.content.length) {
        const nextChar = lastMessage.content[index];
        setSlowMessage(prev => prev + nextChar);
        
        // Check if the current character is an asterisk
        if (nextChar === '*') {
          setShouldToggleImage(prev => !prev);
        }
        
        index++;
      } else {
        clearInterval(intervalId);
      }
    }, delay);

    return () => clearInterval(intervalId);
  }, [chat.messages, slowMessage, delay, isWaitingForNewMessage]);

  useEffect(slowStreamEffect, [slowStreamEffect]);

  //waiting flag for new msg beign generated
  useEffect(() => {
    if (chat.isLoading) {
      setIsWaitingForNewMessage(true);
    }
  }, [chat.isLoading]);

  return { 
    ...chat,
    messages: [
      ...chat.messages.slice(0, -1),
      { ...chat.messages[chat.messages.length - 1], content: slowMessage }
    ],
    isWaitingForNewMessage,
    shouldToggleImage,
    setShouldToggleImage
  };
}

export default function Home() {
  const { messages, input, handleInputChange, handleSubmit: originalHandleSubmit, isLoading, isWaitingForNewMessage, shouldToggleImage, setShouldToggleImage } = useSlowChat(25); 
  const [inputValue, setInputValue] = useState(input); // init with the input from useChat
  const insightsRef = useRef<HTMLDivElement>(null); // ref for the insights div
  const [images, setImages] = useState({
    image1: '/analyst.webp',
    image2: '/smoking_analyst.webp',
    currentImage: 'image1'
  });

  const toggleImage = () => {
    setImages(prev => ({
      ...prev,
      currentImage: prev.currentImage === 'image1' ? 'image2' : 'image1'
    }));
  };

    // Effect to scroll to the bottom of the insights div when messages change
    useEffect(() => {
      if (insightsRef.current) {
        insightsRef.current.scrollTop = insightsRef.current.scrollHeight; // Scroll to the bottom
      }
    }, [messages]);

    // Effect to toggle image when shouldToggleImage changes
    useEffect(() => {
      if (shouldToggleImage) {
        toggleImage()
        setShouldToggleImage(false);  // Reset the flag
      }
    }, [shouldToggleImage, setShouldToggleImage]);
    

  const handleInputChangeLocal = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    handleInputChange(e); // Call the original handleInputChange to keep useChat in sync
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    originalHandleSubmit(e); // Call the original handleSubmit
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
          <h1 className="font-serif tracking-wider text-xl sm:text-5xl xl:text-6xl font-light text-neutral-100 text-center shadow-md lg:text-left xl:pl-5 pt-4 lg:pb-4 text-shadow-gold"
              style={{
                textShadow: "0px 0px 8px gold",
              }}>
            psychoanalyze.dev
          </h1>
        </div>
  
        {/* Image */}
        <div className="w-full lg:w-1/3 order-2 lg:order-3 flex flex-shrink justify-center items-center mb-4  lg:mb-0  relative">
            <motion.img 
              src={images.image1}
              alt="Analyst" 
              className="h-40 w-40 md:h-48 md:w-48 lg:h-auto lg:w-auto lg:max-h-[80vh] xl:max-h-[85vh] rounded-full lg:rounded-3xl object-cover shadow-[0_0_10px_rgba(255,255,255,3)] lg:shadow-none"
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5}}
            />
            <motion.img 
              src={images.image2}
              alt="Analyst Smoking"
              className="absolute h-40 w-40 md:h-48 md:w-48 lg:h-auto lg:w-auto lg:max-h-[80vh] xl:max-h-[85vh] rounded-full lg:rounded-3xl object-cover shadow-[0_0_10px_rgba(255,255,255,3)] lg:shadow-none"
              animate={{ opacity: images.currentImage === 'image2' ? 1 : 0 }}
              initial={{ opacity: 0 }}
              transition={{ duration: 1.5 }}
            />
          </div>
  
        {/* Text boxes */}
        <div className="w-full lg:w-2/3 order-3 lg:order-2 md:mr-8 lg:mr-4">
          <form onSubmit={handleSubmit} className="flex flex-col">
            <div className='flex flex-col'>
              <textarea
                className="w-full max-h-[30vh] min-h-[20vh] sm:h-36 xl:h-44 bg-[#1D0902] focus:ring-amber-500 font-mono bg-opacity-85 2xl:text-lg focus:!ring-offset-0 border border-[#4A2F25] rounded-md focus:border-transparent focus:ring-0 placeholder-neutral-300 text-neutral-100 p-2 mb-4"
                value={inputValue}
                onChange={handleInputChangeLocal}
                placeholder="For some strange reason, you think showing your analyst a code snippet might be enlightening... (paste code here)"
                spellCheck="false"
              />
              <button 
                className="bg-amber-950 bg-opacity-90 hover:bg-amber-900 hover:bg-opacity-90 rounded mr-6 lg:mr-10 text-neutral-100 font-mono text-xl px-1 mb-3 transition hover:scale-110 self-end"
                type="submit"
              >
                Analyze
              </button>
            </div>
          </form>
          <div 
            ref={insightsRef}
            className="w-full h-64 sm:h-72 lg:h-80 xl:h-[40vh] bg-[#1D0902] font-mono bg-opacity-85 border border-[#4A2F25] rounded-md 2xl:text-lg text-neutral-100 p-2 mb-2 overflow-auto"
          >
            {(() => {
              const lastAnalystMessage = messages
                .filter(m => m.role === 'assistant')
                .pop();
              
              if (lastAnalystMessage && !isWaitingForNewMessage) {
                return (
                  <div className="whitespace-pre-wrap mb-2">
                    {lastAnalystMessage.content}
                  </div>
                );
              } else if (isLoading || isWaitingForNewMessage) {
                return <div>Analyzing...</div>;
              } else {
                return <div>{`Await the doctor's insights...`}</div>;
              }
            })()}
          </div>
          <p className='text-neutral-100 text-opacity-85 font-mono text-sm xl:text-md font-thin text-right pr-4 lg:text-left lg:pl-4'> Made with <a className='hover:animate-pulse' href="https://en.wikipedia.org/wiki/Love">♥</a> by <a className='hover:underline' href="https://hyperdiscogirl.netlify.app/">Disco</a></p>
        </div>
      </div>
    </div>
  );
}

