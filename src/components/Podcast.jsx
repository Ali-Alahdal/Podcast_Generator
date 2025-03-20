import React, { useRef, useState, useEffect } from "react";

const Podcast = ({ subject, audioUrl, imageUrl}) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
 

  const togglePlayPause = () => {
    if (audioRef.current.paused) {
      audioRef.current.play();
      setIsPlaying(true);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };




  return (
    <div
      id="podcasts"
      className="bg-[var(--bg-color)] border-2  border-[var(--secondary-color)] hover:border-purple-400 cursor-pointer p-6  shadow-lg hover:shadow-sm hover:shadow-purple-400 rounded-xl transition-shadow duration-300 "
    >
      {/* Album Cover */}
      <img
        src={imageUrl}
        alt="idk - Highvyn, Taylor Shin"
        className="w-full h-48 object-cover rounded-lg mb-4"
      />

      <div className="flex items-center justify-around mb-4 mt-5 gap-3  ">
        
      <div className="flex flex-col gap-2 overflow-hidden">
          {/* Song Title */}
          <h2 className="text-xl font-semibold text-center">{subject}</h2>

         
        </div>

        {/* Music Controls */}
        <div className="flex justify-center items-center  ">
          <button
            onClick={togglePlayPause}
            className="p-3 rounded-full bg-[var(--primary-color)] hover:bg-[var(--secondary-color)] focus:outline-none transition-colors duration-300"
          >
            {isPlaying ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="white"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 5.25v13.5m-7.5-13.5v13.5"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 20 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.752 11.168l-6.56-3.84A1 1 0 006 8.32v7.36a1 1 0 001.192.98l6.56-3.84a1 1 0 000-1.696z"
                />
              </svg>
            )}
          </button>
        </div>
        
      </div>

      {/* Audio Element */}
      <audio
        ref={audioRef}
        src={audioUrl}
      >
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default Podcast;
