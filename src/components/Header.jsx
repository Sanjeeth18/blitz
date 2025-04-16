import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/Wisdomhub Academy Logo.png";
import { getDocs, collection } from "firebase/firestore";
import { firestore } from "./backend/firebase-config";

const Header = ({ admin = false }) => {
  //States
  const location = useLocation();
  const today = new Date();
  const navigate = useNavigate();
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1000);
  const [open, setOpen] = useState(false);
  const [ispointstableopen, setispointstableopen] = useState(false);
  const [uid, setUid] = useState(null);
  const registered =
    sessionStorage.getItem("registered") || localStorage.getItem("login");

  //Functions
  useEffect(() => {
    const storedData = localStorage.getItem("data");
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        if (parsedData.uid) {
          setUid(parsedData.uid);
        }
      } catch (error) {
        console.error("Error parsing localStorage data:", error);
      }
    }

    const handleResize = () => {
      setIsMobile(window.innerWidth < 1000);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSchedule = () => {
    setIsScheduleOpen(!isScheduleOpen);
  };

  const togglePointsTablee = () => {
    setispointstableopen(!ispointstableopen);
  };

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.clear();
    sessionStorage.removeItem("registered");

    if (admin) navigate("/admin");
    else navigate("/");

    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  const navigateToSection = (sectionId) => {
    if (window.location.pathname !== "/" && !admin) {
      setTimeout(() => {
        navigate("/");
      }, 100);
      setTimeout(() => {
        scrollToSection(sectionId);
      }, 300);
    } else if (window.location.pathname !== "/" && admin) {
      setTimeout(() => {
        navigate("/admin");
      }, 100);
      setTimeout(() => {
        scrollToSection(sectionId);
      }, 300);
    } else {
      navigate(window.location.pathname);
      scrollToSection(sectionId);
    }
  };

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      const headerOffset = 125;
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
    <div className="w-full ">
      <div
        className="w-full py-3 px-5 fixed top-0 left-0 z-50 backdrop-blur-md bg-[#111]/80 shadow-lg"
        style={{
          color: "#FFA500",
          borderBottom: "2px solid #FFA500",
        }}
      >
        {" "}
        {!isMobile ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img
                className="hover:cursor-pointer w-full h-20"
                onClick={() => {
                  admin ? navigate("/admin") : navigate("/");
                }}
                src={logo}
                alt="Logo"
              />
            </div>
            <nav className="relative z-50">
              <ul className="flex space-x-8">
                <li
                  className={`text-2xl font-medium font-bebas-neue hover:text-gray-300 text-orange-400 ${
                    location.pathname === "/"
                      ? "border-b-2 border-cyan-400"
                      : ""
                  } transition duration-200`}
                >
                  <Link to={admin ? "/admin" : "/"}>Home</Link>
                </li>
                <li className="relative z-50 text-2xl font-medium font-bebas-neue cursor-pointer transition duration-200">
                  <div
                    className="flex flex-row cursor-pointer"
                    onClick={toggleSchedule}
                  >
                    <span
                      className={
                        isScheduleOpen
                          ? "text-orange-400"
                          : "hover:text-gray-300"
                      }
                    >
                      Schedule
                    </span>
                    <div
                      className={`pt-1 ml-2 transform transition-transform duration-400 ${
                        isScheduleOpen ? "rotate-0" : "rotate-180"
                      }`}
                    >
                      {isScheduleOpen ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="size-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m4.5 15.75 7.5-7.5 7.5 7.5"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="size-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m4.5 15.75 7.5-7.5 7.5 7.5"
                          />
                        </svg>
                      )}
                    </div>
                  </div>

                  {isScheduleOpen && (
                    <div className="absolute left-0 top-full mt-2 w-52 bg-gray-800 text-white shadow-lg rounded-md z-50 flex flex-col">
                      <Link
                        onClick={() => {
                          navigateToSection("league-schedule");
                          setIsScheduleOpen(!isScheduleOpen);
                        }}
                        className="block px-4 py-2 hover:bg-gray-700 transition"
                      >
                        League
                      </Link>
                      <Link
                        onClick={() => {
                          navigateToSection("finale-section");
                          setIsScheduleOpen(!isScheduleOpen);
                        }}
                        className="block px-4 py-2 hover:bg-gray-700 transition"
                      >
                        Grand Finale
                      </Link>
                    </div>
                  )}
                </li>
                <li className="relative z-50 text-2xl font-medium font-bebas-neue cursor-pointer transition duration-200">
                  <div
                    className="flex flex-row cursor-pointer"
                    onClick={togglePointsTablee}
                  >
                    <span
                      className={
                        ispointstableopen
                          ? "text-orange-400"
                          : "hover:text-gray-300"
                      }
                    >
                      Points Table
                    </span>
                    <div
                      className={`pt-1 ml-2 transform transition-transform duration-400 ${
                        ispointstableopen ? "rotate-0" : "rotate-180"
                      }`}
                    >
                      {ispointstableopen ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="size-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m4.5 15.75 7.5-7.5 7.5 7.5"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="size-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m4.5 15.75 7.5-7.5 7.5 7.5"
                          />
                        </svg>
                      )}
                    </div>
                  </div>

                  {ispointstableopen && (
                    <div className="absolute left-0 top-full mt-2 w-52 bg-gray-800 text-white shadow-lg rounded-md z-50 flex flex-col">
                      <Link
                        onClick={() => {
                          navigateToSection("open-points");
                          setispointstableopen(!ispointstableopen);
                        }}
                        className="block px-4 py-2 hover:bg-gray-700 transition"
                      >
                        Open
                      </Link>
                      <Link
                        onClick={() => {
                          navigateToSection("women-points");
                          setispointstableopen(!ispointstableopen);
                        }}
                        className="block px-4 py-2 hover:bg-gray-700 transition"
                      >
                        Women
                      </Link>
                    </div>
                  )}
                </li>

                {admin !== true ? (
                  <>
                    <li className="text-2xl font-medium font-bebas-neue hover:text-gray-300 text-orange-400 transition duration-200">
                      {!registered ? (
                        <button
                          onClick={() => navigate("/login")}
                          className="hover:cursor-pointer text-orange-400"
                        >
                          Login
                        </button>
                      ) : (
                        <button
                          onClick={() =>
                            navigate("/profile", {
                              state: { uid: uid },
                            })
                          }
                          className="hover:cursor-pointer text-orange-400"
                        >
                          Profile
                        </button>
                      )}
                    </li>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => navigate("/details")}
                      className="hover:cursor-pointer text-2xl font-medium font-bebas-neue hover:text-gray-300 text-orange-400"
                    >
                      Details
                    </button>
                    <button
                      onClick={() => handleLogout()}
                      className="hover:cursor-pointer text-2xl font-medium font-bebas-neue hover:text-gray-300 text-orange-400"
                    >
                      Log out
                    </button>
                  </>
                )}
              </ul>
            </nav>
          </div>
        ) : (
          <div className="flex items-center justify-between w-full h-20">
            <div className="flex justify-center w-full">
              <img
                className="hover:cursor-pointer w-40 h-14"
                onClick={() => {
                  admin ? navigate("/admin") : navigate("/");
                }}
                src={logo}
                alt="Logo"
              />
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 -960 960 960"
              fill="white"
              className="w-8 h-8 cursor-pointer"
              onClick={() => setOpen(!open)}
            >
              <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" />
            </svg>
          </div>
        )}
      </div>

      <aside
        className={`fixed top-0 right-0 h-full w-64 bg-gray-900 text-white shadow-lg transform transition-transform duration-300 z-50 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4 flex justify-between items-center border-b border-gray-700">
          <h2 className="text-xl font-semibold">Menu</h2>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-6 cursor-pointer"
            onClick={() => setOpen(false)}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18 18 6M6 6l12 12"
            />
          </svg>
        </div>
        <ul className="p-4 space-y-6 text-lg font-medium">
          <li>
            <Link to={admin ? "/admin" : "/"} className="hover:text-blue-400">
              Home
            </Link>
          </li>
          <li>
            <a
              onClick={() => {
                navigateToSection("league-schedule");
                setOpen(!open);
              }}
              className="hover:text-blue-400"
            >
              League Schedule
            </a>
          </li>
          <li>
            <a
              onClick={() => {
                navigateToSection("finale-section");
                setOpen(!open);
              }}
              className="hover:text-blue-400 hover:cursor-pointer"
            >
              Finale Schedule
            </a>
          </li>
          <li>
            <a
              onClick={() => {
                navigateToSection("open-points");
                setOpen(!open);
              }}
              className="hover:text-blue-400"
            >
              Open Points Table
            </a>
          </li>
          <li>
            <a
              onClick={() => {
                navigateToSection("women-points");
                setOpen(!open);
              }}
              className="hover:text-blue-400"
            >
              Women Points Table
            </a>
          </li>

          <li>
            {admin !== true ? (
              !registered ? (
                <button
                  onClick={() => navigate("/login")}
                  className="hover:cursor-pointer text-white"
                >
                  Login
                </button>
              ) : (
                <div className="flex flex-col items-start">
                  <button
                    onClick={() => navigate("profile", { state: { uid: uid } })}
                    className="hover:cursor-pointer text-white mb-5"
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => handleLogout()}
                    className="hover:cursor-pointer text-white"
                  >
                    Logout
                  </button>
                </div>
              )
            ) : (
              <div className="flex flex-col items-start">
                <button
                  onClick={() => navigate("/details")}
                  className="hover:cursor-pointer text-xl mb-5 font-medium font-bebas-neue hover:text-gray-300 text-white"
                >
                  Details
                </button>
                <button
                  onClick={() => handleLogout()}
                  className="hover:cursor-pointer text-xxl font-medium font-bebas-neue hover:text-gray-300 text-white"
                >
                  Log out
                </button>
              </div>
            )}
          </li>
        </ul>
      </aside>
    </div>
  );
};

export default Header;
