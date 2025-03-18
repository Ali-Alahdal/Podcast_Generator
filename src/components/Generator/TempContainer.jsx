import logo from "../../assets/logo.png";
import {useState} from "react"

function TempContainer() {

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className=" text-[#999] flex flex-col items-center p-6">
      <nav className="">
        <div
          className=" flex  items-center p-0 m-0 justify-around gap-32"
          dir="rtl"
        >
          <div className="flex items-center justify-center">
            <div className="flex items-center justify-between gap-1">
              <p className="font-bold">بودكاست</p>
              <div className="bg-white h-5 w-[1px]"></div>
              <p className="font-bold">AI</p>
            </div>
            <a href="#" className="">
              <img className="w-auto h-24" src={logo} alt="Logo" />
            </a>
          </div>

          <div className="flex items-center justify-center mt-6 text-gray-600 capitalize ">
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

      {/* Main Content */}
      <div className="container mx-auto flex  gap-36 mt-10">
        {/* Left Panel - Controls */}
        <div className="bg-[#1d1d1d] px-10 py-20 rounded-lg shadow-lg w-full md:w-1/3">
          <label className="block mb-2 text-sm font-medium">
            Podcast Subject
          </label>
          <div className="flex gap-2 px-30 items-center ">
            <input
              type="text"
              className="bg-[#555] p-2 w-full rounded-xl border-2 border-black bg-[var(--bg-color)] text-[var(--text-color)]"
              placeholder="Enter subject..."
            />
          </div>

          {/* podcast length */}
          <div className="relative inline-block text-left">
      <label className="block mt-4 mb-2 text-sm font-medium">Length</label>
      <button
        type="button"
        className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50"
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
          className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white ring-1 shadow-lg ring-black/5 focus:outline-none"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
        >
          <div className="py-1" role="none">
            <button
              className="block px-4 py-2 text-sm text-gray-700 w-full text-left hover:bg-gray-100"
              role="menuitem"
              onClick={() => setIsOpen(false)}
            >
              Short
            </button>
            <button
              className="block px-4 py-2 text-sm text-gray-700 w-full text-left hover:bg-gray-100"
              role="menuitem"
              onClick={() => setIsOpen(false)}
            >
              Medium
            </button>
            <button
              className="block px-4 py-2 text-sm text-gray-700 w-full text-left hover:bg-gray-100"
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
            <button className="bg-[var(--primary-color)] px-12 py-5 rounded-xl mb-5 hover:bg-green-700">
              Generate
            </button>
            <div className="flex items-center justify-around gap-5">
              <button className="bg-[var(--bg-color)] border-2 px-8 py-2 rounded-xl border-stone-700 hover:bg-gray-700">
                Save
              </button>
              <button className="bg-[var(--bg-color)] border-2 px-4 py-2 rounded-xl border-stone-700 hover:bg-gray-700">
                Download
              </button>
            </div>
          </div>
        </div>

        {/* Right Panel - Podcast Preview */}
        <div className="flex-1 bg-[#444] p-6 rounded-lg shadow-lg flex flex-col items-center">
          <div className="w-64 h-64 bg-[#666] flex items-center justify-center rounded-lg text-5xl">
            ❓
          </div>
          <p className="mt-4 text-lg">Podcast Subject</p>
          <button className="mt-4 bg-black text-white px-4 py-2 rounded-full flex items-center gap-2 hover:bg-gray-900">
            ▶ Play
          </button>
        </div>
      </div>

      {/* Footer */}
      {/* <footer className="w-full mt-10 p-4 text-center bg-[#444] flex justify-between items-center shadow-md">
        <div className="w-8 h-8 bg-[#666] rounded-full"></div>
        <p className="text-sm">Copyright</p>
        <p className="text-sm">Menu</p>
      </footer>  */}
    </div>
  );
}

export default TempContainer;
