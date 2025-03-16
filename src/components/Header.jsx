import { useState, useEffect } from "react";
import logo from "../assets/logo.png";


const slides = [
  {
    title: "أنشئ بودكاستك في ثوانٍ باستخدام الذكاء الاصطناعي!",
    text: "حوّل أي فكرة إلى حلقة جاهزة للنشر بصوت احترافي ونص متكامل.",
    image: "./src/assets/two_ai.jpeg",
  },
  {
    title: "اصنع صوتك. أطلق قصتك. دع الذكاء الاصطناعي يقوم بالباقي!",
    text: "من الفكرة إلى البث – بودكاست احترافي بضغطة زر.",
    image: "./src/assets/aiWithMic.jpg",
  },
  {
    title: "لا تحتاج إلى مايك أو استوديو!",
    text: "كل ما تحتاجه هو فكرة، والباقي علينا. أنشئ بودكاستك الآن!",
    image: "./src/assets/micChip.jpg",
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
    <header className="bg-white dark:bg-gray-900" dir="rtl">
      <nav className="bg-white dark:bg-gray-900">
        <div className=" flex  items-center p-0 m-0 justify-center">
          <p className="font-bold">بودكاست AI</p>
          <a href="#" className="">
            <img
              className="w-auto h-24"
              src= {logo}
              alt="Logo"
            />
          </a>

          <div className="flex items-center justify-center mt-6 text-gray-600 capitalize ">
            <a
              href="#main"
              className="mx-2 text-gray-800 border-b-2 border-blue-500 "
            >
              الرئيسية
            </a>
            <a
              href="#podcasts"
              className="mx-2 border-b-2 border-transparent hover:text-gray-800  hover:border-blue-500 sm:mx-6"
            >
              بودكاستات منشئة
            </a>
            <a
              href="#team"
              className="mx-2 border-b-2 border-transparent hover:text-gray-800  hover:border-blue-500 sm:mx-6"
            >
              فريق العمل
            </a>
            <a
              href="#footer"
              className="mx-2 border-b-2 border-transparent hover:text-gray-800  hover:border-blue-500 sm:mx-6"
            >
              معلومات التواصل
            </a>
            
            
          </div>
        </div>
      </nav>

      <div id="main" className="container flex flex-col px-6 py-4 mx-auto space-y-6 lg:h-[32rem] lg:py-16 lg:flex-row lg:items-center">
      <div className="flex flex-col items-center w-full lg:flex-row lg:w-1/2">
        <div className="flex justify-center order-2 mt-6 lg:mt-0 lg:space-y-3 lg:flex-col">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 mx-2 rounded-full lg:mx-0 focus:outline-none ${
                index === currentIndex ? "bg-blue-500" : "bg-gray-300 hover:bg-blue-500"
              }`}
              onClick={() => setCurrentIndex(index)}
            ></button>
          ))}
        </div>

        <div className="max-w-lg lg:mx-12 lg:order-2">
          <h1 className="text-3xl font-semibold tracking-wide text-gray-800 dark:text-white lg:text-4xl">
            {slides[currentIndex].title}
          </h1>
          <p className="mt-4 text-gray-600 dark:text-gray-300">
            {slides[currentIndex].text}
          </p>
          <div className="mt-6">
            <a
              href="#"
              className="px-6 py-2.5 mt-6 text-sm font-medium leading-5 text-center text-white capitalize bg-blue-600 rounded-lg hover:bg-blue-500 lg:mx-0 lg:w-auto focus:outline-none"
            >
              انشئ بودكاستك الآن!
            </a>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center w-full h-96 lg:w-1/2">
        <img
          className="object-cover w-full h-full max-w-2xl rounded-md transition-opacity duration-500"
          src={slides[currentIndex].image}
          alt="Podcast AI"
        />
      </div>
    </div>
    </header>
  );
};

export default Header;