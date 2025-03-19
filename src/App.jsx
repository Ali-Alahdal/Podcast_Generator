import React from "react";
import "./App.css";
import Header from "./components/Header";
import Podcast from "./components/Podcast";
import NewPodcast from "./components/NewPodcast";
import TeamSection from "./components/TeamSection";
import Footer from "./components/Footer";
import { BrowserRouter , Routes , Route } from "react-router-dom";
import TempContainer from "./components/Generator/TempContainer";
// import GeneratorPage from "./components/Generator/GeneratorPage";



function App() {
  return (
    <>
      
      <BrowserRouter>
        <Routes>
            <Route index path={"/"} element={
              <>
                <Header />
                <div className="text-3xl font-bold text-right py-10 px-20 text-purple-300 rounded-xl   ">
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
            } />


           <Route path={"/new_podcast"} element={<TempContainer />} />
        </Routes>
     
      

      </BrowserRouter>
    </>
  );
}

export default App;