import React from "react";
import "./App.css";
import Header from "./components/Header";
import Podcast from "./components/Podcast";
import NewPodcast from "./components/NewPodcast";
import TeamSection from "./components/TeamSection";
import Footer from "./components/Footer";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TempContainer from "./components/Generator/TempContainer";
import LoadingSkeleton from "./components/Skeleton";

function App() {
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
                  <div className="text-3xl font-bold text-right py-10 px-20 text-purple-300 rounded-xl">
                  بودكاستات مميزة
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 p-10">
                    <Podcast />
                    <Podcast />
                    <Podcast />
                    <Podcast />
                    <Podcast />
                    <Podcast />
                  </div>
                    <LoadingSkeleton />
                  <div className="text-3xl font-bold text-right py-10 px-20 text-purple-300 rounded-xl">
                    بودكاستات عامة
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 p-10">
                    <Podcast />
                    <Podcast />
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