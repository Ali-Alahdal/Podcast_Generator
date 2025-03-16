import React from "react";
import "./App.css";
import Header from "./components/Header";
import Podcast from "./components/Podcast";
import NewPodcast from "./components/newPodcast";
import TeamSection from "./components/TeamSection";
import Footer from "./components/Footer";

function App() {
  return (
    <>
      <Header />
      <div className="text-3xl font-bold text-right py-10 px-6   ">
        قائمة البودكاست
      </div>
      <div  className="container mx-auto  flex flex-col items-center">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-20">
          <NewPodcast />
          <Podcast />
          <Podcast />
        </div>
          <TeamSection />
          <Footer />
      </div>
    </>
  );
}

export default App;