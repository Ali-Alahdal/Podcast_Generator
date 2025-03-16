import React from 'react';

function NewPodcast() {
  return (
    <div className="bg-white cursor-pointer p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col gap-10 items-center justify-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-24 h-24 text-blue-500 hover:text-blue-600 transition-colors duration-300"
      >
        <path
          fillRule="evenodd"
          d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z"
          clipRule="evenodd"
        />
      </svg>
      <p>قم بتوليد بودكاستك الخاص والإستماع إلى مواضيع شيقة ومثيرة للإهتمام </p>
    </div>
  );
}

export default NewPodcast;