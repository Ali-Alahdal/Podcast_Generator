import React from 'react';
import { Link } from 'react-router-dom';

function NewPodcast() {
  return (
    
    <Link to={"/new_podcast"} className="bg-[var(--bg-color)] border-2 border-[var(--secondary-color)] hover:border-purple-400 cursor-pointer p-8 rounded-lg shadow-lg hover:shadow-sm hover:shadow-purple-400 transition-shadow duration-300 flex flex-col gap-6  items-center justify-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-24 h-24 text-[var(--primary-color)]  hover:text-purple-500 transition-colors duration-300"
      >
        <path
          fillRule="evenodd"
          d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z"
          clipRule="evenodd"
        />
      </svg>
      <p className='p-5'>قم بتوليد بودكاستك الخاص والإستماع إلى مواضيع شيقة ومثيرة للإهتمام </p>
    </Link>
  );
} 


export default NewPodcast;