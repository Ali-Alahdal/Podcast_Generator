import React, { useRef, useState, useEffect } from "react";

const Podcast = () => {
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
    <div id="podcasts" className="bg-[var(--bg-color)] border-2  border-[var(--secondary-color)] hover:border-purple-400 cursor-pointer p-6  shadow-lg hover:shadow-sm hover:shadow-purple-400 rounded-lg    transition-shadow duration-300 ">
      {/* Album Cover */}
      <img
        src="https://telegra.ph/file/2acfcad8d39e49d95addd.jpg"
        alt="idk - Highvyn, Taylor Shin"
        className="w-full h-48 object-cover rounded-lg mb-4"
      />

      {/* Song Title */}
      <h2 className="text-xl font-semibold text-center">idk</h2>

      {/* Artist Name */}
      <p className="text-gray-600 text-sm text-center mb-4">
        Highvyn, Taylor Shin
      </p>

      {/* Music Controls */}
      <div className="flex justify-center items-center mb-4">
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

      {/* Progress Bar */}
      <div
        className="mt-4 bg-gray-200 h-2 rounded-full cursor-pointer"
        onClick={handleProgressClick}
      >
        <div
          className="bg-[var(--primary-color)] h-2 rounded-full"
          style={{ width: `${(currentTime / duration) * 100}%` }}
        ></div>
      </div>

      {/* Time Information */}
      <div className="flex justify-between mt-2 text-sm text-gray-600">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>

      {/* Audio Element */}
      <audio
        ref={audioRef}
        src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
      >
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default Podcast;