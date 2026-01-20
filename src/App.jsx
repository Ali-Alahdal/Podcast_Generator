import React, { useState, useEffect } from "react";
import axios from "axios";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./config/firebase";
import "./App.css";
import Header from "./components/Header";
import Podcast from "./components/Podcast";
import NewPodcast from "./components/NewPodcast";
import TeamSection from "./components/TeamSection";
import Footer from "./components/Footer";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TempContainer from "./components/Generator/TempContainer";
import PodcastGenerator from "./components/Generator/GeneratorPage";
import ImageGenerator from "./components/Generator/ImageGenerator";
import UploadPodcast from "./components/UploadPodcast";
// bjhkhk


import LoadingSkeleton from "./components/Skeleton";
import { motion } from "framer-motion"; // Import Framer Motion

function App() {
  const [specialPodcasts, setSpecialPodcasts] = useState([]);
  const [generalPodcasts, setGeneralPodcasts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPodcasts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "podcasts"));
        const podcastsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          subject: doc.data().topic,
          size: doc.data().category,
          content: doc.data().transcript,
          imageUrl: doc.data().imageUrl,
          audioUrl: doc.data().audioUrl
        }));

        // For now, simple split or just duplicate for demo
        setSpecialPodcasts(podcastsData.slice(0, 2));
        setGeneralPodcasts(podcastsData);

      } catch (error) {
        console.error("Error fetching podcasts from Firestore:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPodcasts();
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
                <div className="grid grid-cols-1 items-center">
                  {/* Featured Podcasts Section */}
                  <div className="text-3xl font-bold text-left py-10 px-20 text-purple-300 rounded-xl">
                    Featured Podcasts
                  </div>
                  <div
                    className={`grid ${isLoading
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

                  <hr className="border-purple-500 w-[70%] flex mx-auto" />

                  {/* General Podcasts Section */}
                  <div className="text-3xl font-bold text-left py-10 px-20 text-purple-300 rounded-xl">
                    General Podcasts
                  </div>
                  <div
                    className={`grid ${isLoading
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
            } />

          <Route path={"/new_podcast"} element={<TempContainer />} />
          <Route path={"/new_podcast2"} element={<PodcastGenerator />} />
          <Route path={"/img"} element={<ImageGenerator />} />
          <Route path={"/upload"} element={<UploadPodcast />} />


          <Route path={"/new_podcast"} element={<TempContainer />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
