import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Header from "./Component/Header";
import Footer from "./Component/Footer";
import SignIn from "./Component/SignIn";
import SignUp from "./Component/SignUp";
import SearchBar from "./Component/SearchBar";
import JobList from "./Component/JobList";
import JobPosting from "./Component/jobPosting";
import AdminDashboard from "./Component/adminDashboard";
import PostJobForm from "./Component/PostAJob";
import ViewUser from "./Component/ViewUser";
import CandidateProfile from "./Component/CandidateProfile";
import About from "./Component/About";
import SavedJobs from "./Component/savedJobs";
import AppliedJobs from "./Component/appliedJobs";
import AllJobs from "./Component/Alljobs";
import FAQS from "./Component/FAQs";
import Review from "./Component/Review";
import AdminNotification from "./Component/AdminNotification";
import UserNotification from "./Component/UserNotification";
import Blog from "./Component/Blog";
import UserSetting from "./Component/UserSetting";
import AdminBlogEditor from "./Component/AdminBlogEditor"
import AdminBlogList from "./Component/AdminBlogList"

const App = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchCriteria, setSearchCriteria] = useState("");

  useEffect(() => {
    const role = localStorage.getItem("role");
    setIsAdmin(role === "admin");
    setIsLoggedIn(!!localStorage.getItem("user"));
  }, []);

  const GOOGLE_CLIENT_ID = "699533533816-8i8bpv5q45fv18egjm9t0d3j35f1lvg0.apps.googleusercontent.com"

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className="flex flex-col min-h-screen">
        <Router>
          <Header isLoggedIn={isLoggedIn} isAdmin={isAdmin} />
          <main className="flex-1">
            <Routes>
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/PostAJob" element={<PostJobForm />} />
              <Route path="/PostAJob/:jobId" element={<PostJobForm />} />
              <Route path="/jobPosting" element={<JobPosting/>}/>
              <Route path="/Blog" element={<Blog/>}/>
              <Route
                 path="/adminDashboard"
                 element={isLoggedIn && isAdmin ? <AdminDashboard /> : <Navigate to="/adminDashboard" replace />}
               />
              <Route path="/ViewUser" element={<ViewUser />} />
              <Route path="/Alljobs"element={<AllJobs/>}/>
              <Route path="/CandidateProfile" element={<CandidateProfile />} />
              <Route path="/savedJobs" element={<SavedJobs/>}/>
              <Route path="/appliedJobs" element={<AppliedJobs/>}/>
              <Route path="/FAQs" element={<FAQS/>}/>
              <Route path="/UserNotification" element={<UserNotification />} />
              <Route path="/Review" element={<Review />} />
              <Route path="/AdminNotification" element={<AdminNotification />} />
              <Route
          path="/admin/blogs"
          element={(() => {
            const user = localStorage.getItem("user")
            const role = localStorage.getItem("role")
            return user && role === "admin" ? <AdminBlogList /> : <Navigate to="/signin" replace />
          })()}
        />

        <Route
          path="/admin/blog/create"
          element={(() => {
            const user = localStorage.getItem("user")
            const role = localStorage.getItem("role")
            return user && role === "admin" ? <AdminBlogEditor /> : <Navigate to="/signin" replace />
          })()}
        />

        <Route
          path="/admin/blog/edit/:id"
          element={(() => {
            const user = localStorage.getItem("user")
            const role = localStorage.getItem("role")
            return user && role === "admin" ? <AdminBlogEditor /> : <Navigate to="/signin" replace />
          })()}
        />
              <Route
                path="/"
                element={
                  isAdmin ? (
                    isLoggedIn ? (
                      <div className="admin-dashboard bg-gray-100 h-[80vh] flex items-center justify-center">
                        <h2 className="text-gray-500 text-xl">Admin Dashboard</h2>
                      </div>
                    ) : (
                      <Navigate to="/signin" replace />
                    )
                  ) : (
                    <div className="main-content">
                      <SearchBar setSearchCriteria={setSearchCriteria} />
                      <JobList searchCriteria={searchCriteria} />
                    </div>
                  )
                }
              />
              <Route path="/About" element={<About/>} />
              <Route path="/UserSetting" element={<UserSetting/>} />
            </Routes>
          </main>
          <Footer />
        </Router>
      </div>
    </GoogleOAuthProvider>
  );
};

export default App;
