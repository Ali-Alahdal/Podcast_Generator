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
import LoadingSkeleton from "./components/Skeleton";
import { motion } from "framer-motion"; // Import Framer Motion

function App() {
  const [specialPodcasts, setSpecialPodcasts] = useState([]);
  const [generalPodcasts, setGeneralPodcasts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate a delay of 3 seconds (3000 milliseconds)
    const delay = 1000;

    // Fetch featured podcasts
    const fetchSpecialPodcasts = async () => {
      try {
        const response = await axios.get(
          "https://www.podcastai.somee.com/api/Podcast/get-special-podcast"
        );
        setSpecialPodcasts(response.data.data); // Assuming the response has a `data` field
      } catch (error) {
        console.error("Error fetching featured podcasts:", error);
      }
    };

    // Fetch general podcasts
    const fetchGeneralPodcasts = async () => {
      try {
        const response = await axios.get(
          "https://www.podcastai.somee.com/api/Podcast/get-podcasts"
        );
        setGeneralPodcasts(response.data.data); // Assuming the response has a `data` field
      } catch (error) {
        console.error("Error fetching general podcasts:", error);
      }
    };

    // Fetch data immediately
    fetchSpecialPodcasts();
    fetchGeneralPodcasts();

    // Set a timeout to disable loading state after 3 seconds
    const loadingTimeout = setTimeout(() => {
      setIsLoading(false);
    }, delay);

    // Cleanup the timeout to avoid memory leaks
    return () => clearTimeout(loadingTimeout);
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
                  <div
                    className={`grid ${
                      isLoading
                        ? ""
                        : "grid-cols-2 md:grid-cols-2 lg:grid-cols-4"
                    } gap-8 p-10 mb-10`}
                  >
                    {isLoading
                      ? Array.from({ length: specialPodcasts.length }).map(
                          (_, index) => <LoadingSkeleton key={index} />
                        )
                      : specialPodcasts.map((podcast) => (
                          <motion.div
                            key={podcast.id}
                            initial={{ opacity: 0, scale: 0.9 }} // Initial state (hidden and scaled down)
                            whileInView={{ opacity: 1, scale: 1 }} // Animate when in view
                            transition={{ duration: 0.5, delay: 0.2 }} // Animation duration and delay
                            viewport={{ once: true }} // Only animate once
                          >
                            <Podcast
                              subject={podcast.subject}
                              size={podcast.size}
                              content={podcast.content}
                              audioUrl={podcast.audioUrl}
                              imageUrl={podcast.imageUrl}
                            />
                          </motion.div>
                        ))}
                  </div>

                  <hr className="border-purple-500" />

                  {/* General Podcasts Section */}
                  <div className="text-3xl font-bold text-right py-10 px-20 text-purple-300 rounded-xl">
                    بودكاستات عامة
                  </div>
                  <div
                    className={`grid ${
                      isLoading
                        ? ""
                        : "grid-cols-2 md:grid-cols-2 lg:grid-cols-4"
                    } gap-8 p-10 mb-10`}
                  >
                    {isLoading
                      ? Array.from({ length: generalPodcasts.length }).map(
                          (_, index) => <LoadingSkeleton key={index} />
                        )
                      : generalPodcasts.map((podcast) => (
                          <motion.div
                            key={podcast.id}
                            initial={{ opacity: 0, scale: 0.9 }} // Initial state (hidden and scaled down)
                            whileInView={{ opacity: 1, scale: 1 }} // Animate when in view
                            transition={{ duration: 0.5, delay: 0.2 }} // Animation duration and delay
                            viewport={{ once: true }} // Only animate once
                          >
                            <Podcast
                              subject={podcast.subject}
                              size={podcast.size}
                              content={podcast.content}
                              audioUrl={podcast.audioUrl}
                              imageUrl={podcast.imageUrl}
                            />
                          </motion.div>
                        ))}

                    {/* Render NewPodcast only when not loading */}
                    {!isLoading && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }} // Initial state (hidden and scaled down)
                        whileInView={{ opacity: 1, scale: 1 }} // Animate when in view
                        transition={{ duration: 0.5, delay: 0.2 }} // Animation duration and delay
                        viewport={{ once: true }} // Only animate once
                      >
                        <NewPodcast />
                      </motion.div>
                    )}
                  </div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }} // Initial state (hidden and scaled down)
                    whileInView={{ opacity: 1, scale: 1 }} // Animate when in view
                    transition={{ duration: 0.5, delay: 0.2 }} // Animation duration and delay
                    viewport={{ once: true }} // Only animate once
                  >
                    <TeamSection />
                  </motion.div>
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
