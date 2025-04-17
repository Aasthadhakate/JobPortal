"use client"

import { useState, useEffect } from "react"
import {
  BookmarkCheck,
  Calendar,
  Building,
  MapPin,
  DollarSign,
  Briefcase,
  ChevronRight,
  ArrowLeft,
  Trash2,
  X,
} from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import SearchBar from "./SearchBar"
import ApplicationForm from "./applicationForm"

const SavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState([])
  const [selectedJob, setSelectedJob] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [filterType, setFilterType] = useState("all")
  const [searchCriteria, setSearchCriteria] = useState({ role: "", location: "" })
  const navigate = useNavigate()
  // State for chat widget visibility
    const [isChatOpen, setIsChatOpen] = useState(false)

  useEffect(() => {
    const savedJobsFromStorage = JSON.parse(localStorage.getItem("savedJobs") || "[]")
    setSavedJobs(savedJobsFromStorage)
  }, [])

  const removeFromSaved = (jobId, e) => {
    e.stopPropagation()
    const updatedSavedJobs = savedJobs.filter((job) => job.id !== jobId)
    setSavedJobs(updatedSavedJobs)
    localStorage.setItem("savedJobs", JSON.stringify(updatedSavedJobs))

    // If the currently selected job is being removed, close the dialog
    if (selectedJob && selectedJob.id === jobId) {
      closeDialog()
    }
  }

  const openJobDetails = (job) => {
    setSelectedJob(job || {})
    setIsDialogOpen(true)
  }

  const closeDialog = () => {
    setIsDialogOpen(false)
    setSelectedJob(null)
  }

  const handleDialogClick = (e) => {
    if (e.target.classList.contains("dialog-overlay")) {
      closeDialog()
    }
  }

  // Filter jobs based on search criteria and job type
  const filteredJobs = savedJobs.filter((job) => {
    const matchesSearch =
      job.role?.toLowerCase().includes(searchCriteria.role.toLowerCase()) &&
      job.location?.toLowerCase().includes(searchCriteria.location.toLowerCase())

    const matchesType =
      filterType === "all" || (job.jobType && job.jobType.toLowerCase().includes(filterType.toLowerCase()))

    return matchesSearch && matchesType
  })

  const handleApplyNow = (e) => {
    e.preventDefault()
    if (!localStorage.getItem("user")) {
      alert("You need to sign in to perform this action.")
      navigate("/signin")
      return
    }
    setIsModalOpen(true)
  }

  return (
    <div className="max-w-7xl mx-auto mt-6 mb-6 p-4 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Saved Jobs</h1>
            <p className="text-gray-600 mt-1">Your bookmarked job opportunities</p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/appliedJobs"
              className="px-4 py-2 border border-blue-800 text-blue-800 rounded-md hover:bg-blue-50 transition-colors flex items-center"
            >
              <Calendar size={16} className="mr-2" />
              Applied Jobs
            </Link>
            <Link
              to="/"
              className="px-4 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
            >
              <Briefcase size={16} className="mr-2" />
              Browse Jobs
            </Link>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      {savedJobs.length > 0 && (
        <>
          <SearchBar setSearchCriteria={setSearchCriteria} />

          {/* Job Type Filter */}
          <div className="bg-white rounded-xl shadow-md p-4 mb-6">
            <div className="flex flex-wrap gap-2">
              <button
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  filterType === "all" ? "bg-blue-800 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => setFilterType("all")}
              >
                All Types
              </button>
              <button
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  filterType === "full-time" ? "bg-blue-800 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => setFilterType("full-time")}
              >
                Full-Time
              </button>
              <button
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  filterType === "part-time" ? "bg-blue-800 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => setFilterType("part-time")}
              >
                Part-Time
              </button>
              <button
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  filterType === "contract" ? "bg-blue-800 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => setFilterType("contract")}
              >
                Contract
              </button>
              <button
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  filterType === "remote" ? "bg-blue-800 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => setFilterType("remote")}
              >
                Remote
              </button>
              <button
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  filterType === "internship" ? "bg-blue-800 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => setFilterType("internship")}
              >
                Internship
              </button>
            </div>
          </div>
        </>
      )}

      {/* Saved Jobs Section */}
      <div className="mb-10">
        {savedJobs.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-10 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
              <BookmarkCheck size={24} className="text-blue-800" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">No saved jobs yet</h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Jobs you save will appear here. Start exploring and bookmarking jobs you're interested in.
            </p>
            <Link
              to="/"
              className="bg-blue-800 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 inline-flex items-center"
            >
              Explore Jobs
              <ChevronRight size={16} className="ml-1" />
            </Link>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-3">
              <BookmarkCheck size={20} className="text-gray-400" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">No matching jobs found</h2>
            <p className="text-gray-600 mb-4">Try adjusting your search or filter criteria</p>
            <button
              onClick={() => {
                setSearchCriteria({ role: "", location: "" })
                setFilterType("all")
              }}
              className="text-blue-800 hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white border rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => openJobDetails(job)}
              >
                <div className="p-5 relative">
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <button
                      className="text-red-500 hover:text-red-700 bg-red-50 p-1.5 rounded-full"
                      onClick={(e) => removeFromSaved(job.id, e)}
                    >
                      <Trash2 size={16} />
                    </button>
                    <div className="text-blue-600 bg-blue-50 p-1.5 rounded-full">
                      <BookmarkCheck size={16} className="fill-blue-600" />
                    </div>
                  </div>

                  <h4 className="font-semibold text-lg text-gray-800 pr-20 mb-1">{job.role}</h4>
                  <p className="text-gray-600 flex items-center">
                    <Building size={14} className="mr-1 flex-shrink-0" />
                    {job.companyName}
                  </p>

                  <div className="mt-3 space-y-1.5">
                    <p className="text-sm text-gray-500 flex items-center">
                      <MapPin size={14} className="mr-1 flex-shrink-0" />
                      {job.location}
                    </p>

                    <p className="text-sm text-gray-500 flex items-center">
                      <DollarSign size={14} className="mr-1 flex-shrink-0" />
                      {job.minSalary || job.maxSalary
                        ? `₹${job.minSalary || ""} ${job.maxSalary ? `- ₹${job.maxSalary}` : ""} LPA`
                        : "₹ Not Disclosed"}
                    </p>

                    {job.experienceRange && (
                      <p className="text-sm text-gray-500 flex items-center">
                        <Briefcase size={14} className="mr-1 flex-shrink-0" />
                        {job.experienceRange}
                      </p>
                    )}
                  </div>

                  {job.skillsRequired && (
                    <div className="mt-3">
                      <div className="flex flex-wrap gap-1 mt-1">
                        {job.skillsRequired
                          ?.split(",")
                          .slice(0, 3)
                          .map((skill, index) => (
                            <span key={index} className="bg-blue-50 text-blue-800 px-2 py-0.5 rounded-full text-xs">
                              {skill.trim()}
                            </span>
                          ))}
                        {job.skillsRequired?.split(",").length > 3 && (
                          <span className="text-xs text-gray-500">
                            +{job.skillsRequired?.split(",").length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end">
                    <button className="bg-blue-800 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700 transition-colors flex items-center">
                      View Details
                      <ChevronRight size={14} className="ml-1" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Custom Dialog for Saved Jobs */}
      {isDialogOpen && selectedJob && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 dialog-overlay p-4"
          onClick={handleDialogClick}
        >
          <div
            className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative p-6 border-b border-gray-200 bg-gradient-to-r from-blue-800 to-blue-700">
              <div className="flex justify-between items-start">
                <button
                  onClick={closeDialog}
                  className="text-white hover:text-gray-200 transition-colors bg-white bg-opacity-20 rounded-full p-1.5"
                >
                  <ArrowLeft size={18} />
                </button>
                <button
                  onClick={(e) => removeFromSaved(selectedJob.id, e)}
                  className="text-white hover:text-gray-200 transition-colors bg-white bg-opacity-20 rounded-full p-1.5"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              <div className="mt-2">
                <h2 className="text-2xl font-bold text-white">{selectedJob.role}</h2>
                <p className="text-blue-100 flex items-center">
                  <Building size={16} className="mr-2" />
                  {selectedJob.companyName}
                </p>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(80vh-80px)]">
              {/* Job Details Card */}
              <div className="bg-gray-50 rounded-lg p-5 border border-gray-200 mb-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Job Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start">
                    <MapPin className="w-5 h-5 text-blue-800 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-medium">{selectedJob.location}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Calendar className="w-5 h-5 text-blue-800 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Date Posted</p>
                      <p className="font-medium">{selectedJob.datePosted}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <DollarSign className="w-5 h-5 text-blue-800 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Salary</p>
                      <p className="font-medium">
                        {selectedJob.minSalary && selectedJob.maxSalary
                          ? `₹${selectedJob.minSalary} - ₹${selectedJob.maxSalary} LPA`
                          : selectedJob.minSalary
                            ? `₹${selectedJob.minSalary} LPA`
                            : selectedJob.maxSalary
                              ? `₹${selectedJob.maxSalary} LPA`
                              : "₹ Not Disclosed"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Briefcase className="w-5 h-5 text-blue-800 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Experience</p>
                      <p className="font-medium">{selectedJob.experienceRange || selectedJob.experience}</p>
                    </div>
                  </div>
                </div>

                {selectedJob.jobType && (
                  <div className="mt-4 pt-4 border-gray-200">
                    <div className="flex items-start">
                      <div>
                        <p className="text-sm text-gray-500">Job Type</p>
                        <p className="font-medium">{selectedJob.jobType}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Education Section */}
              {selectedJob.education && (
                <div className="bg-gray-50 rounded-lg p-5 border border-gray-200 mb-6">
                  <h3 className="text-lg font-semibold mb-3 text-gray-800">Education</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    {selectedJob.education
                      ?.split(/[•]/)
                      .filter((point) => point.trim() !== "")
                      .map((point, index) => (
                        <li key={index} className="text-gray-700">
                          {point.trim()}
                        </li>
                      ))}
                  </ul>
                </div>
              )}

              {/* Job Description Section */}
              {selectedJob.description && (
                <div className="bg-gray-50 rounded-lg p-5 border border-gray-200 mb-6">
                  <h3 className="text-lg font-semibold mb-3 text-gray-800">Job Description</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    {selectedJob.description
                      .split("•")
                      .filter((point) => point.trim() !== "")
                      .map((point, index) => (
                        <li key={index} className="text-gray-700">
                          {point.trim()}
                        </li>
                      ))}
                  </ul>
                </div>
              )}

              {/* Key Responsibilities Section */}
              {selectedJob.keyResponsibilities && (
                <div className="bg-gray-50 rounded-lg p-5 border border-gray-200 mb-6">
                  <h3 className="text-lg font-semibold mb-3 text-gray-800">Key Responsibilities</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    {selectedJob.keyResponsibilities
                      .split("•")
                      .filter((point) => point.trim() !== "")
                      .map((point, index) => (
                        <li key={index} className="text-gray-700">
                          {point.trim()}
                        </li>
                      ))}
                  </ul>
                </div>
              )}

              {/* Skills Required Section */}
              {selectedJob.skillsRequired && (
                <div className="bg-gray-50 rounded-lg p-5 border border-gray-200 mb-6">
                  <h3 className="text-lg font-semibold mb-3 text-gray-800">Skills Required</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedJob.skillsRequired?.split(",").map((skill, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-center space-x-4">
                <button
                  onClick={closeDialog}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={handleApplyNow}
                  className="bg-blue-800 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
                >
                  Apply Now
                  <ChevronRight size={16} className="ml-1" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Application Form Modal */}
      {isModalOpen && selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
              onClick={() => setIsModalOpen(false)}
            >
              <X size={24} />
            </button>
            <ApplicationForm jobTitle={selectedJob?.role} company={selectedJob?.companyName} />
          </div>
        </div>
      )}
    </div>
  )
}

export default SavedJobs

