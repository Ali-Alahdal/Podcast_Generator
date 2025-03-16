import React from 'react';

const Header = () => {
  return (
    <header className="bg-white " dir="rtl">
      <nav className="bg-white ">
        <div className="container flex flex-col items-center p-6 mx-auto">
          <a href="#" className="mx-auto">
            <img
              className="w-auto h-6 sm:h-7"
              src="https://merakiui.com/images/full-logo.svg"
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
            <button className="w-3 h-3 mx-2 bg-blue-500 rounded-full lg:mx-0 focus:outline-none"></button>
            <button className="w-3 h-3 mx-2 bg-gray-300 rounded-full lg:mx-0 focus:outline-none hover:bg-blue-500"></button>
            <button className="w-3 h-3 mx-2 bg-gray-300 rounded-full lg:mx-0 focus:outline-none hover:bg-blue-500"></button>
            <button className="w-3 h-3 mx-2 bg-gray-300 rounded-full lg:mx-0 focus:outline-none hover:bg-blue-500"></button>
          </div>

          <div className="max-w-lg lg:mx-12 lg:order-2">
            <h1 className="text-3xl font-semibold tracking-wide text-gray-800  lg:text-4xl">
              أفضل تطبيقات ساعة أبل
            </h1>
            <p className="mt-4 text-gray-600 ">
              لوريم إيبسوم هو نص نموذجي يستخدم في صناعة الطباعة والتنضيد. لوريم إيبسوم هو نص وهمي يستخدم في صناعة الطباعة والتنضيد.
            </p>
            <div className="mt-6">
              <a
                href="#"
                className="px-6 py-2.5 mt-6 text-sm font-medium leading-5 text-center text-white capitalize bg-blue-600 rounded-lg hover:bg-blue-500 lg:mx-0 lg:w-auto focus:outline-none"
              >
                تنزيل من متجر التطبيقات
              </a>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center w-full h-96 lg:w-1/2">
          <img
            className="object-cover w-full h-full max-w-2xl rounded-md"
            src="./src/assets/two_ai.jpeg"
            alt="apple watch"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;