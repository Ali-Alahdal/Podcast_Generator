import React from "react";
import Logo from "../assets/logo.png";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer id="footer" className="bg-[var(--bg-color)]  w-full">
      <div className="container px-6 py-8 mx-auto">
        {/* Logo and Navigation Links */}
        <div className="flex flex-col items-center text-center">
          <a
            href="#main"
            className="font-bold text-[var(--text-color)] "
          >

            <img src={Logo} className="w-auto h-24" alt="" />

          </a>

          <div className="flex flex-wrap justify-center mt-6 -mx-4">
            <Link
              to={"/#main"}
              className="mx-4 text-sm text-gray-600 transition-colors duration-300 hover:text-[var(--secondary-color)] "
            >
              Home
            </Link>
            <Link
              to={"/#podcasts"}
              className="mx-4 text-sm text-gray-600 transition-colors duration-300 hover:text-[var(--secondary-color)] "

            >
              Generated Podcasts
            </Link>
            <Link
              to={"/#Team"}
              className="mx-4 text-sm text-gray-600 transition-colors duration-300 hover:text-[var(--secondary-color)] "

            >
              Team
            </Link>
            <Link
              to={"/#footer"}
              className="mx-4 text-sm text-gray-600 transition-colors duration-300 hover:text-[var(--secondary-color)] "
            >
              Contact Info
            </Link>
          </div>
        </div>

        {/* Divider */}
        <hr className="my-6 border-gray-200 md:my-10 " />

        {/* Copyright and Social Media Icons */}
        <div className="flex flex-col items-center sm:flex-row sm:justify-between">
          <p className="text-sm text-gray-500 ">
            © Copyright 2025. All Rights Reserved.
          </p>

          <div className="flex -mx-2">
            {[
              {
                name: "Linkedin",
                path: "M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zM8 19h-3v-10h3v10zM6.5 7.5c-.97 0-1.75-.78-1.75-1.75s.78-1.75 1.75-1.75 1.75.78 1.75 1.75-.78 1.75-1.75 1.75zM20 19h-3v-5.5c0-1.38-.03-3.16-2-3.16s-2.31 1.53-2.31 3.06v5.6h-3v-10h2.89v1.38h.04c.4-.75 1.38-1.54 2.84-1.54 3.04 0 3.54 2 3.54 4.58v5.58z",
              },
              {
                name: "Github",
                path: "M12.026 2C7.13295 1.99937 2.96183 5.54799 2.17842 10.3779C1.395 15.2079 4.23061 19.893 8.87302 21.439C9.37302 21.529 9.55202 21.222 9.55202 20.958C9.55202 20.721 9.54402 20.093 9.54102 19.258C6.76602 19.858 6.18002 17.92 6.18002 17.92C5.99733 17.317 5.60459 16.7993 5.07302 16.461C4.17302 15.842 5.14202 15.856 5.14202 15.856C5.78269 15.9438 6.34657 16.3235 6.66902 16.884C6.94195 17.3803 7.40177 17.747 7.94632 17.9026C8.49087 18.0583 9.07503 17.99 9.56902 17.713C9.61544 17.207 9.84055 16.7341 10.204 16.379C7.99002 16.128 5.66202 15.272 5.66202 11.449C5.64973 10.4602 6.01691 9.5043 6.68802 8.778C6.38437 7.91731 6.42013 6.97325 6.78802 6.138C6.78802 6.138 7.62502 5.869 9.53002 7.159C11.1639 6.71101 12.8882 6.71101 14.522 7.159C16.428 5.868 17.264 6.138 17.264 6.138C17.6336 6.97286 17.6694 7.91757 17.364 8.778C18.0376 9.50423 18.4045 10.4626 18.388 11.453C18.388 15.286 16.058 16.128 13.836 16.375C14.3153 16.8651 14.5612 17.5373 14.511 18.221C14.511 19.555 14.499 20.631 14.499 20.958C14.499 21.225 14.677 21.535 15.186 21.437C19.8265 19.8884 22.6591 15.203 21.874 10.3743C21.089 5.54565 16.9181 1.99888 12.026 2Z",
              },
            ].map((social, index) => (
              <a
                key={index}
                href="#"
                className="mx-2 text-gray-600 transition-colors duration-300  hover:text-blue-500 "
                aria-label={social.name}
              >
                <svg
                  className="w-5 h-5 fill-current"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d={social.path} />
                </svg>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;