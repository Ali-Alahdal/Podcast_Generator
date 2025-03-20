import React, { useRef, useState, useEffect } from "react";
import Default_Image from "../assets/default_image.webp"
const GeneratedPodcast = (props) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const togglePlayPause = () => {
    if (audioRef.current.paused) {
      audioRef.current.play();
      setIsPlaying(true);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const updateProgress = () => {
    setCurrentTime(audioRef.current.currentTime);
    setDuration(audioRef.current.duration);
  };

  const handleProgressClick = (e) => {
    const progressBar = e.currentTarget;
    const clickPosition = e.nativeEvent.offsetX;
    const progressBarWidth = progressBar.clientWidth;
    const seekTime = (clickPosition / progressBarWidth) * duration;
    audioRef.current.currentTime = seekTime;
  };


  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  useEffect(() => {
    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      updateProgress();
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, []);



  return (
    <div
      id="podcasts"
      className="bg-[var(--bg-color)] border-2 w-[50%]  h-full border-[var(--secondary-color)] hover:border-purple-400 cursor-pointer p-4  shadow-lg hover:shadow-sm hover:shadow-purple-400 rounded-xl transition-shadow duration-300 "
    >
        <div className="relative flex  justify-center ">
            {props?.loading == true  ?  
            <div className="absolute z-50 justify-center content-center text-center items-center flex-1 w-full " role="status">
                <svg aria-hidden="true" className="w-12 h-12 text-center mx-auto text-gray-200 animate-spin  fill-purple-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/></svg>
                <span className="sr-only">{props?.loadingMsg}</span>
                <div className="px-3 py-1 text-xs font-medium  w-52 line-clamp-1 overflow-hidden mx-auto mt-4 text-center text-purple-800 bg-purple-200 rounded-full animate-pulse d">{props?.loadingMsg}</div>

            </div>
            : <></> }
        
            {/* Album Cover */}
            <img
                src={props?.image ? props.image : Default_Image}
                className={props?.loading == true  ?   "w-full h-full object-cover rounded-lg blur " : "w-full h-[70%] object-cover rounded-lg  "}
            />
        </div>
        <div className="flex items-center justify-around content-center  h-[40%]   ">
        

        {/* Music Controls */}
        <div className="flex justify-center items-center h-full content-center    ">
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
        <div className="flex flex-col gap-2">
          {/* Song Title */}
          <h2 className="text-xl font-semibold text-center"> {props?.topic ? props.topic : "العنوان" }</h2>
        </div>
      </div>

      {/* Audio Element */}
      <audio
        ref={audioRef}
        src={props?.audio}
      >
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default GeneratedPodcast;
