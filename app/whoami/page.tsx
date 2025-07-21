"use client"

import { useState, useEffect, useCallback } from "react"
import { ArrowLeft } from "lucide-react" // Assuming lucide-react is available for icons
import Link from "next/link" // Assuming next/link is available for navigation

const whoamiLines = [
  " who am i?",
  "Voice #1: you are a wish and a fear",
  "i am a coin?",
  "Voice's #'s 2 - 103: (Unison) you are the archtypes united and a solitar wolf wanderer",
  "i am paradox",
  "Voices: #104 - 359 (Syncopated): you are a dream, and you are now",
  "i am a existence",
  "Voices: #360 - 403: you are 12 times great at once",
  "Voice #404: I am infinite", // Filled in based on the previous conversation
  "PLEASE FILL IN", // This line will also be typed out as part of the sequence
];

const TYPING_SPEED = 80; // Speed at which characters are typed
const DELETING_SPEED = 50; // Speed at which characters are deleted
const PAUSE_AFTER_TYPE = 2000; // Pause after a line is fully typed
const PAUSE_AFTER_DELETE = 500; // Pause after a line is fully deleted

export default function App() { // Renamed to App for default export
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  // Callback function to handle the typing and deleting animation
  const handleTyping = useCallback(() => {
    // If all lines have been processed, mark as complete and stop
    if (currentLineIndex >= whoamiLines.length) {
      setIsComplete(true);
      return;
    }

    const currentLine = whoamiLines[currentLineIndex];
    // Determine if the current line is an "odd" line (Voice #1, Voice #2-103, etc.) which will be deleted
    // or an "even" line (user's response) which will remain.
    // Note: Array index 0 is "who am i?" (even), index 1 is "Voice #1..." (odd), index 2 is "i am a coin?" (even), etc.
    const isOddLine = currentLineIndex % 2 === 1;

    if (!isDeleting) {
      // Typing phase
      if (currentCharIndex < currentLine.length) {
        // Append one character at a time to the current line
        const newLines = [...displayedLines];
        newLines[currentLineIndex] = currentLine.substring(0, currentCharIndex + 1);
        setDisplayedLines(newLines);
        setCurrentCharIndex((prev) => prev + 1);
      } else {
        // Current line is fully typed
        setTimeout(() => {
          if (isOddLine) {
            // If it's an odd line, start deleting it after a pause
            setIsDeleting(true);
          } else {
            // If it's an even line, move to the next line after a pause
            setCurrentLineIndex((prev) => prev + 1);
            setCurrentCharIndex(0);
            // Initialize the next line in the displayedLines array to prevent undefined errors
            setDisplayedLines(prev => {
                const newArr = [...prev];
                if (!newArr[currentLineIndex + 1]) {
                    newArr[currentLineIndex + 1] = "";
                }
                return newArr;
            });
          }
        }, PAUSE_AFTER_TYPE);
      }
    } else {
      // Deleting phase
      if (currentCharIndex > 0) {
        // Remove one character at a time from the current line
        const newLines = [...displayedLines];
        newLines[currentLineIndex] = currentLine.substring(0, currentCharIndex - 1);
        setDisplayedLines(newLines);
        setCurrentCharIndex((prev) => prev - 1);
      } else {
        // Current line is fully deleted
        setIsDeleting(false); // Stop deleting
        setCurrentLineIndex((prev) => prev + 1); // Move to the next line
        setCurrentCharIndex(0); // Reset char index for the new line
        // Initialize the next line in the displayedLines array
        setDisplayedLines(prev => {
            const newArr = [...prev];
            if (!newArr[currentLineIndex + 1]) {
                newArr[currentLineIndex + 1] = "";
            }
            return newArr;
        });
        // Removed the empty setTimeout here as it served no functional purpose.
      }
    }
  }, [currentLineIndex, currentCharIndex, isDeleting, displayedLines]);

  // Effect hook to manage the typing/deleting animation loop
  useEffect(() => {
    if (!isComplete) {
      // Set a timer based on whether we are typing or deleting
      const timer = setTimeout(handleTyping, isDeleting ? DELETING_SPEED : TYPING_SPEED);
      return () => clearTimeout(timer); // Cleanup the timer on unmount or re-render
    }
  }, [handleTyping, isDeleting, isComplete]);

  // Effect hook to initialize the first line when the component mounts
  useEffect(() => {
    if (whoamiLines.length > 0) {
      setDisplayedLines([""]); // Start with an empty string for the first line
    }
  }, []);

return (
  <div className="min-h-screen bg-black font-inter">
    {/* Main container with font-inter class */}
    <header className="bg-black border-b border-gray-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Link component for navigation, assuming Next.js environment */}
        <Link href="/">
          <button className="text-gray-300 hover:text-white hover:bg-gray-800 flex items-center px-3 py-2 rounded-lg transition-colors shadow-md">
            {/* Added rounded-lg and shadow-md for better aesthetics */}
            <ArrowLeft className="h-4 w-4 mr-2" />
            back to home
          </button>
        </Link>
      </div>
    </header>

    <main className="flex flex-col items-center justify-center min-h-[80vh] px-8">
      <div className="w-full max-w-4xl">
        {/* ARIA live region for accessibility, announces content as it appears */}
        <div aria-live="polite" className="sr-only">
          {displayedLines.map((line) => line).join(" ")}
        </div>

        {/* Map through the displayedLines to render each line with appropriate styling */}
        {displayedLines.map((line, index) => {
          const isOddLine = index % 2 === 1;
          const isCurrentLine = index === currentLineIndex;

          return (
            <div
              key={index}
              className={`font-mono text-xl md:text-3xl lg:text-4xl leading-relaxed mb-4 rounded-md p-2 ${
                isOddLine ? "text-orange-400 text-right" : "text-white text-left"
              } ${isCurrentLine && !isComplete ? "opacity-100" : "opacity-80"}`}
            >
              {line}
              {/* Blinking cursor for the current line being typed/deleted */}
              {isCurrentLine && !isComplete && (
                <span className="inline-block w-1 h-6 md:h-8 lg:h-10 bg-white ml-2 animate-pulse rounded-full"></span>
              )}
            </div>
          );
        })}
      </div>
    </main>
  </div>
);
}
