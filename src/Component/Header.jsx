import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaBell, FaBars, FaTimes } from "react-icons/fa";
import UserDropdown from "./UserDropdown";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("user");
    const role = localStorage.getItem("role");

    if (user) {
      setIsLoggedIn(true);
      setUserEmail(user);
      setIsAdmin(role?.toLowerCase() === "admin");

      if (role?.toLowerCase() === "admin" && location.pathname === "/") {
        navigate("/adminDashboard");
      }
    }
  }, []);

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 flex items-center justify-between bg-blue-800 text-white p-3 shadow-lg">
      <div className="logo">
        <img src="../src/assets/datatypeit.jpeg" alt="logo" />
      </div>

        {/* Navigation Links (Desktop) */}
        <div className="hidden md:flex space-x-6">
          {(isAdmin
            ? [
                { name: "Home", path: "/adminDashboard" },
                { name: "Post a Job", path: "/PostAJob" },
                
                { name: "All Jobs", path: "/Alljobs" },
                { name: "View Applications", path: "/ViewUser" },
                { name: "Manage Blogs", path: "/admin/blogs" },
              ]
            : [
                { name: "Home", path: "/" },
                { name: "Job Posting", path: "/jobPosting" },
                { name: "Blog", path: "/Blog" },
                { name: "About", path: "/About" },
                { name: "FAQs", path: "/FAQs"}
              ]
          ).map((tab) => (
            <Link
              key={tab.path}
              to={tab.path}
              className={`hover:text-gray-300 transition duration-300 px-3 pb-1 ${
                location.pathname === tab.path ? "border-b-2 border-white" : ""
              }`}
            >
              {tab.name}
            </Link>
          ))}
        </div>

        {/* Right Section: Notification, User Profile, and Hamburger Menu */}
        <div className="flex space-x-4 items-center">
        {isLoggedIn ? (
            <>
              {isAdmin ? (
              // Admin Notifications
              <Link to="/adminNotification">
                <FaBell className="text-white text-xl cursor-pointer hover:text-gray-300 transition duration-300" />
              </Link>
            ) : (
              // User Notifications
              <Link to="/userNotification">
                <FaBell className="text-white text-xl cursor-pointer hover:text-gray-300 transition duration-300" />
              </Link>
            )}
              <UserDropdown user={userEmail} />
            </>
          ) : (
            <>
              <Link to="/signin" className="bg-white text-blue-800 px-3 py-1 rounded-md">
                Sign In
              </Link>
              <Link to="/signup" className="bg-white text-blue-800 px-3 py-1 rounded-md">
                Sign Up
              </Link>
            </>
          )}

          {/* Hamburger Menu Button (Mobile) - Aligned Right */}
          <button className="md:hidden text-white text-2xl" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {menuOpen && (
          <div className="absolute top-16 left-0 w-full bg-blue-800 flex flex-col items-center space-y-4 p-4 md:hidden">
            {(isAdmin
              ? [
                  { name: "Home", path: "/adminDashboard" },
                  { name: "Post a Job", path: "/PostAJob" },
                  { name: "All Jobs", path: "/Alljobs" },
                  { name: "View Applications", path: "/ViewUser" },
                  { name: "Manage Blogs", path: "/admin/blogs" },
                ]
              : [
                  { name: "Home", path: "/" },
                  { name: "Job Posting", path: "/jobPosting" },
                  { name: "Blog", path: "/Blog" },
                  { name: "About", path: "/About" },
                ]
            ).map((tab) => (
              <Link
                key={tab.path}
                to={tab.path}
                onClick={() => setMenuOpen(false)}
                className="text-white text-lg hover:text-gray-300"
              >
                {tab.name}
              </Link>
            ))}
          </div>
        )}
      </nav>

      {/* To prevent content from hiding behind the fixed header */}
      <div className="mt-16"></div>
    </>
  );
};

export default Header;