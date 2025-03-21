import { useState, useEffect } from "react";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";
import image1 from "../assets/two_ai.webp";
import image2 from "../assets/aiWithMic.jpg";
import image3 from "../assets/mic_chip.webp";

const slides = [
  {
    title: "أنشئ بودكاستك في ثوانٍ باستخدام الذكاء الاصطناعي!",
    text: "حوّل أي فكرة إلى حلقة جاهزة للنشر بصوت احترافي ونص متكامل.",
    image: image1,
  },
  {
    title: "اصنع صوتك. أطلق قصتك. دع الذكاء الاصطناعي يقوم بالباقي!",
    text: "من الفكرة إلى البث – بودكاست احترافي بضغطة زر.",
    image: image2,
  },
  {
    title: "لا تحتاج إلى مايك أو استوديو أو حتى مونتاج!",
    text: "كل ما تحتاجه هو فكرة، والباقي علينا. أنشئ بودكاستك الآن!",
    image: image3,
  },
];

const Header = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-[var(--bg-color)] text-[var(--text-color)]" dir="rtl">
      <nav className="">
        <div className=" flex  items-center p-0 m-0 justify-around">
          <div className="flex items-center justify-center">
            <div className="flex items-center justify-between gap-1"></div>
            <Link to={"/"} className="">
              <img className="w-auto h-28" src={logo} alt="Logo" />
            </Link>
          </div>

          <div className="flex items-center justify-center  text-gray-600 capitalize ">
            <a
              href="#main"
              className="mx-2 text-[var(--text-color)] border-b-2 border-purple-600 "
            >
              الرئيسية
            </a>
            <a
              href="#podcasts"
              className="mx-2 text-[var(--text-color)] border-b-2 border-transparent hover:text-gray-100  hover:border-purple-600 sm:mx-6"
            >
              بودكاستات منشئة
            </a>
            <a
              href="#team"
              className="mx-2 text-[var(--text-color)] border-b-2 border-transparent hover:text-gray-100  hover:border-purple-600 sm:mx-6"
            >
              فريق العمل
            </a>
            <a
              href="#footer"
              className="mx-2 text-[var(--text-color)] border-b-2 border-transparent hover:text-gray-100  hover:border-purple-600 sm:mx-6"
            >
              معلومات التواصل
            </a>
          </div>
        </div>
      </nav>

      <div
        id="main"
        className="container flex flex-col px-6 py-4 mx-auto space-y-6 lg:h-[32rem] lg:py-16 lg:flex-row lg:items-center animate-slideIn"
      >
        <div className="flex flex-col items-center w-full lg:flex-row lg:w-1/2">
          <div className="flex justify-center order-2 mt-6 lg:mt-0 lg:space-y-3 lg:flex-col">
            {slides.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 mx-2 rounded-full lg:mx-0 focus:outline-none ${
                  index === currentIndex
                    ? "bg-purple-600"
                    : "bg-gray-300 hover:bg-purple-400"
                }`}
                onClick={() => setCurrentIndex(index)}
              ></button>
            ))}
          </div>

          <div className="max-w-lg lg:mx-12 lg:order-2">
            <h1 className="text-3xl font-semibold tracking-wide text-[var(--text-color)] text-white lg:text-4xl">
              {slides[currentIndex].title}
            </h1>
            <p className="mt-4 text-gray-600 ">{slides[currentIndex].text}</p>
            <div className="mt-12">
              <Link
                to="/new_podcast"
                className="px-10 py-4 mt-6 text-md font-semibold text-center text-white bg-gradient-to-r from-purple-700  to-pink-500 rounded-2xl shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2"
              >
                انشئ بودكاستك الآن!
              </Link>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center w-full h-96 lg:w-1/2">
          <img
            className="w-full h-full max-w-2xl rounded-md border-2 transition duration-300 ease-in-out border-purple-700 hover:shadow-lg hover:shadow-purple-500 object-cover"
            style={{ aspectRatio: "16/9" }}
            src={slides[currentIndex].image}
            alt="Podcast AI"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
