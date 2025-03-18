import logo from "../../assets/logo.png";
import { useState } from "react";

function TempContainer() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <nav className="m-0">
        <div className=" flex items-center justify-between " dir="rtl">
          <div className="flex items-center justify-center">
            <div className="flex items-center justify-between gap-1">
              
            </div>
            <a href="#" className="">
              <img className="w-auto h-28" src={logo} alt="Logo" />
            </a>
          </div>

          <div className="flex items-center justify-center text-gray-600 capitalize ">
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

      <div className=" text-[#999] flex flex-col items-center ">
        {/* Main Content */}
        <div className="container mx-auto flex  gap-60 mt-10">
          {/* Left Panel - Controls */}
          <div className=" px-10 py-32 rounded-lg shadow-md w-1/3 text-left shadow-[var(--secondary-color)]  ">
            <div className="flex gap-2 px-30 items-center ">
              <input 
                type="text"
                className="bg-[#555] p-2 w-full rounded-xl border-2 focus:border-[var(--text-color)] focus:outline-none border-ring-[#444] bg-[var(--bg-color)] text-gray-300 "
                placeholder="Enter subject..."
              />
            </div>

            {/* podcast length */}
            <div className="relative inline-block text-left">
              <label className="block mt-4 mb-2 text-sm font-medium text-left"></label>
              <button
                type="button"
                className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-[var(--bg-color)] px-3 py-2 text-sm font-semibold text-[var(--text-color)] ring-1 shadow-xs ring-[#444] ring-inset hover:bg-"
                id="menu-button"
                aria-expanded={isOpen}
                aria-haspopup="true"
                onClick={() => setIsOpen(!isOpen)}
              >
                Options
                <svg
                  className="-mr-1 size-5 text-gray-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {isOpen && (
                <div
                  className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-[var(--bg-color)] ring-1 shadow-lg ring-black/5 focus:outline-none"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="menu-button"
                >
                  <div className="py-1" role="none">
                    <button
                      className="block px-4 py-2 text-sm text-[var(--text-color)] w-full text-left hover:bg-gray-100"
                      role="menuitem"
                      onClick={() => setIsOpen(false)}
                    >
                      Short
                    </button>
                    <button
                      className="block px-4 py-2 text-sm text-[var(--text-color)] w-full text-left hover:bg-gray-100"
                      role="menuitem"
                      onClick={() => setIsOpen(false)}
                    >
                      Medium
                    </button>
                    <button
                      className="block px-4 py-2 text-sm text-[var(--text-color)] w-full text-left hover:bg-gray-100"
                      role="menuitem"
                      onClick={() => setIsOpen(false)}
                    >
                      Long
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3 mt-6">
              <button className="bg-[var(--primary-color)] font-bold text-[var(--text-color)] px-12 transition duration-300 py-3 rounded-xl mb-5 hover:bg-[var(--secondary-color)]">
                Generate
              </button>
              
                <button className="bg-[var(--bg-color)] border-2 px-8 py-2 rounded-xl text-[var(--text-color)] border-[#444] hover:bg-[#222]">
                  Save
                </button>
                <button className="bg-[var(--bg-color)] border-2 px-4 py-2 rounded-xl text-[var(--text-color)] border-[#444] hover:bg-[#222]">
                  Download
                </button>
              
            </div>
          </div>

          {/* Right Panel - Podcast Preview */}
          <div className="flex-1 bg-[#222] p-2 rounded-lg shadow-lg flex flex-col items-center">
            <div className="w-full h-full bg-[#111] flex flex-col gap-5 items-center  justify-center rounded-sm ">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-12"
              >
                <path
                  fillRule="evenodd"
                  d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 0 1 .67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 1 1-.671-1.34l.041-.022ZM12 9a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="px-20">
                enter a topic in the prompt to generate a podcast
              </p>
            </div>
            <div className="flex justify-around items-center gap-60 pt-3">
              <p className=" text-xl">Podcast Subject</p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-12 cursor-pointer"
              >
                <path
                  fillRule="evenodd"
                  d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm14.024-.983a1.125 1.125 0 0 1 0 1.966l-5.603 3.113A1.125 1.125 0 0 1 9 15.113V8.887c0-.857.921-1.4 1.671-.983l5.603 3.113Z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Footer */}
        {/* <footer className="w-full mt-10 p-4 text-center bg-[#444] flex justify-between items-center shadow-md">
        <div className="w-8 h-8 bg-[#666] rounded-full"></div>
        <p className="text-sm">Copyright</p>
        <p className="text-sm">Menu</p>
      </footer>  */}
      </div>
    </>
  );
}

export default TempContainer;
