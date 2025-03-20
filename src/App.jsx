import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import Header from "./components/Header";
import Podcast from "./components/Podcast";
import NewPodcast from "./components/NewPodcast";
import TeamSection from "./components/TeamSection";
import Footer from "./components/Footer";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TempContainer from "./components/Generator/TempContainer";

function App() {
  const [specialPodcasts, setSpecialPodcasts] = useState([]);
  const [generalPodcasts, setGeneralPodcasts] = useState([]);

  useEffect(() => {
    // Fetch featured podcasts
    const fetchSpecialPodcasts = async () => {
      try {
        const response = await axios.get("https://www.podcastai.somee.com/api/Podcast/get-special-podcast");
        console.log(response);
        setSpecialPodcasts(response.data.data); // Assuming the response has a `data` field
      } catch (error) {
        console.error("Error fetching featured podcasts:", error);
      }
    };

    // Fetch general podcasts
    const fetchGeneralPodcasts = async () => {
      try {
        const response = await axios.get("https://www.podcastai.somee.com/api/Podcast/get-podcasts");
        console.log(response);
        setGeneralPodcasts(response.data.data); // Assuming the response has a `data` field
      } catch (error) {
        console.error("Error fetching general podcasts:", error);
      }
    };

    fetchSpecialPodcasts();
    fetchGeneralPodcasts();
  }, []);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            index
            path={"/"}
            element={
              <>
                <Header />
                <div className="grid grid-cols-1 items-center" dir="rtl">
                  {/* Featured Podcasts Section */}
                  <div className="text-3xl font-bold text-right py-10 px-20 text-purple-300 rounded-xl">
                    بودكاستات مميزة
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 p-10 mb-10">
                    {specialPodcasts.map((podcast) => (
                      <Podcast
                        key={podcast.id}
                        subject={podcast.subject}
                        size={podcast.size}
                        content={podcast.content}
                        audioUrl={podcast.audioUrl}
                        imageUrl={podcast.imageUrl}
                      />
                    ))}
                  </div>

                  <hr className="border-purple-500" />

                  {/* General Podcasts Section */}
                  <div className="text-3xl font-bold text-right py-10 px-20 text-purple-300 rounded-xl">
                    بودكاستات عامة
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 p-10">
                    {generalPodcasts.map((podcast) => (
                      <Podcast
                        key={podcast.id}
                        subject={podcast.subject}
                        size={podcast.size}
                        content={podcast.content}
                        audioUrl={podcast.audioUrl}
                        imageUrl={podcast.imageUrl}
                      />
                    ))}
                    <NewPodcast />
                  </div>

                  <TeamSection />
                  <Footer />
                </div>
              </>
            }
          />

          <Route path={"/new_podcast"} element={<TempContainer />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;