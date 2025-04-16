import React from "react";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  //States
  const navigate = useNavigate();
  
  //Functions
  const navigateToSection = (sectionId) => {
    if (window.location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        scrollToSection(sectionId);
      }, 200);
    } else {
      scrollToSection(sectionId);
    }
  };

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      const headerOffset = 120;
      const targetPosition =
        section.getBoundingClientRect().top + window.pageYOffset - headerOffset;
      const startPosition = window.pageYOffset;
      const distance = targetPosition - startPosition;
      const duration = 100;
      let startTime = null;
  
      const animateScroll = (currentTime) => {
        if (!startTime) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
  
        window.scrollTo(0, startPosition + distance * progress);
  
        if (timeElapsed < duration) {
          requestAnimationFrame(animateScroll);
        }
      };
  
      requestAnimationFrame(animateScroll);
    }
  };
  
  return (
    <footer className="text-white font-bebas-neue p-5 text-xl bg-black border-t-4 border-orange-500">
      <div className="flex flex-wrap py-1 ">
        <div className="p-5 lg:p-10 w-full md:w-1/3 ">
          <h2 className="font-extrabold text-left text-2xl text-orange-500">
            Wisdomhub Academy
          </h2>
          <p className="text-gray-300 mt-3">
            Welcome to Wisdom Hub Academy, where young minds discover the magic
            of Chess! With over 15 years of expertise, we specialize in turning
            beginners into confident players and guiding enthusiasts to master
            the game.
          </p>
          <p className="text-gray-300 mt-3">
            Join us on this exciting journey, and let’s unlock the champion in
            your child.
          </p>
        </div>
        <div className="p-5 lg:p-10 w-full md:w-auto ">
          <h2 className="font-extrabold text-left text-xl text-orange-500">
            More Information
          </h2>
          <p className="text-gray-300 mt-3 hover:text-cyan-400 hover:cursor-pointer">
            <a onClick={() => navigateToSection("faq-section")}>FAQ</a>
          </p>
        </div>
        <div className="p-5 lg:p-10 w-full md:w-auto ">
          <h2 className="font-extrabold text-left text-xl text-orange-500">
            Contact Us
          </h2>
          <div className="text-gray-300 mt-3 text-lg space-y-3">
            <div className="flex items-center">
              <span className="text-orange-400">📞</span>
              <a href="tel:+916382424153" className="ml-2 hover:text-cyan-400">
                +91-6382424153
              </a>
            </div>
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="white"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                />
              </svg>
              <a
                href="mailto:gyanwisdomhub@gmail.com"
                className="ml-2 hover:text-cyan-400"
              >
                gyanwisdomhub@gmail.com
              </a>
            </div>
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
                class="size-6"
                fill="white"
              >
                <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
              </svg>
              <a
                href="https://www.instagram.com/wisdomhubchess?igsh=MTB6a3JzazlhYW5rbg=="
                className="ml-2 hover:text-cyan-400"
              >
                WisdomHubChess
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="text-center text-gray-300 border-t border-gray-500 pt-3">
        Copyright © 2025 WisdomHubAcademy. All Rights Reserved
      </div>
    </footer>
  );
};

export default Footer;
