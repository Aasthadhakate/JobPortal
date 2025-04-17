"use client"

import { useState, useEffect } from "react"
import {
  Bookmark,
  BookmarkCheck,
  ChevronDown,
  ChevronUp,
  X,
  Building,
  MapPin,
  DollarSign,
  Briefcase,
  Calendar,
  Monitor,
  GraduationCap,
  Clipboard,
  CheckSquare,
  Star,
} from "lucide-react"
import { useNavigate } from "react-router-dom" // Import useNavigate for redirection
import ApplicationForm from "./applicationForm"

const JobPosting = () => {
  const [jobs, setJobs] = useState([])
  const [searchRole, setSearchRole] = useState("")
  const [searchLocation, setSearchLocation] = useState("")
  const [appliedSearchRole, setAppliedSearchRole] = useState("")
  const [appliedSearchLocation, setAppliedSearchLocation] = useState("")
  const [filters, setFilters] = useState({
    experience: [],
    salary: [],
    jobType: [],
    workMode: [],
  })
  const [filterVisibility, setFilterVisibility] = useState({
    experience: true,
    salary: true,
    jobType: true,
    workMode: true,
  })
  const [currentPage, setCurrentPage] = useState(1)
  const jobsPerPage = 6
  const [selectedJob, setSelectedJob] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [savedJobIds, setSavedJobIds] = useState(new Set())
  const navigate = useNavigate() // Initialize useNavigate
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    fetch("http://localhost:8080/api/all")
      .then((response) => response.json())
      .then((data) => setJobs(data))
      .catch((error) => console.error("Error fetching jobs:", error))

    // Load saved job IDs from localStorage
    const savedJobs = JSON.parse(localStorage.getItem("savedJobs")) || []
    setSavedJobIds(new Set(savedJobs.map((job) => job.id)))
  }, [])

  const showAlertAndRedirect = () => {
    alert("You need to sign in to perform this action.")
    navigate("/signin")
  }

  const toggleBookmark = (job) => {
    if (!localStorage.getItem("user")) {
      showAlertAndRedirect() // Show alert and redirect if not logged in
      return
    }

    let updatedSavedJobs = JSON.parse(localStorage.getItem("savedJobs")) || []
    const updatedSavedIds = new Set(savedJobIds)

    if (savedJobIds.has(job.id)) {
      // Remove job from saved list
      updatedSavedJobs = updatedSavedJobs.filter((item) => item.id !== job.id)
      updatedSavedIds.delete(job.id)
    } else {
      // Add job to saved list
      updatedSavedJobs.push(job)
      updatedSavedIds.add(job.id)
    }

    // Update state & localStorage
    setSavedJobIds(updatedSavedIds)
    localStorage.setItem("savedJobs", JSON.stringify(updatedSavedJobs))
  }

  const handleApplyNow = () => {
    if (!localStorage.getItem("user")) {
      showAlertAndRedirect() // Show alert and redirect if not logged in
      return
    }
    setIsModalOpen(true) // Open the modal instead of showing an alert
  }

  const toggleFilterSection = (section) => {
    setFilterVisibility((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  const handleCheckboxChange = (e, category) => {
    const { value, checked } = e.target
    setFilters((prevFilters) => {
      const updatedValues = checked
        ? [...prevFilters[category], value]
        : prevFilters[category].filter((v) => v !== value)
      return { ...prevFilters, [category]: updatedValues }
    })
  }

  const handleSearch = () => {
    setAppliedSearchRole(searchRole)
    setAppliedSearchLocation(searchLocation)
    setCurrentPage(1) // Reset to first page when searching
  }

  const filterOptions = {
    experience: ["0-1 Years", "1-3 Years", "3+ Years"],
    salary: ["0-3 LPA", "3-6 LPA", "6+ LPA"],
    jobType: ["Full-time", "Part-time", "Internship"],
    workMode: ["Remote", "Hybrid", "On-site"],
  }

  // Helper function to normalize work mode strings for comparison
  const normalizeWorkMode = (mode) => {
    if (!mode) return ""
    // Convert to lowercase and remove hyphens, spaces, etc.
    return mode
      .toLowerCase()
      .replace(/[-\s]/g, "") // Remove hyphens and spaces
      .replace("onsite", "on-site") // Normalize common variations
      .replace("inoffice", "on-site")
  }

  // Helper function to check if a job matches a work mode filter
  const matchesWorkMode = (job, filterMode) => {
    const normalizedFilterMode = normalizeWorkMode(filterMode)

    // Check in workmode field
    if (job.workmode) {
      const normalizedWorkMode = normalizeWorkMode(job.workmode)
      if (normalizedWorkMode.includes(normalizedFilterMode)) {
        return true
      }
    }

    // Check in workMode field (alternative spelling)
    if (job.workMode) {
      const normalizedWorkMode = normalizeWorkMode(job.workMode)
      if (normalizedWorkMode.includes(normalizedFilterMode)) {
        return true
      }
    }

    // Check in description
    if (job.description) {
      const normalizedDescription = normalizeWorkMode(job.description)
      if (normalizedDescription.includes(normalizedFilterMode)) {
        return true
      }
    }

    return false
  }

  const filteredJobs = jobs.filter((job) => {
    // Convert description to lowercase for case-insensitive filtering
    const jobDescription = job.description ? job.description.toLowerCase() : ""

    let minExperience = 0,
      maxExperience = Number.POSITIVE_INFINITY
    if (job.experienceRange) {
      const experienceNumbers = job.experienceRange.match(/\d+/g)
      if (experienceNumbers) {
        minExperience = Number.parseInt(experienceNumbers[0]) // First number
        maxExperience = experienceNumbers.length > 1 ? Number.parseInt(experienceNumbers[1]) : minExperience
      }
    }
    const experienceFilterRanges = {
      "0-1 Years": [0, 1],
      "1-3 Years": [1, 3],
      "3+ Years": [3, Number.POSITIVE_INFINITY],
    }
    return (
      // Role-based search (Job Role or mentioned in Description)
      (appliedSearchRole === "" ||
        (job.role && job.role.toLowerCase().includes(appliedSearchRole.toLowerCase())) ||
        jobDescription.includes(appliedSearchRole.toLowerCase())) &&
      // Location-based search
      (appliedSearchLocation === "" ||
        (job.location && job.location.toLowerCase().includes(appliedSearchLocation.toLowerCase()))) &&
      // Experience filter (Check experience field + job description)
      (filters.experience.length === 0 ||
        filters.experience.some((exp) => {
          const [filterMin, filterMax] = experienceFilterRanges[exp] || []
          return (
            (minExperience <= filterMax && maxExperience >= filterMin) ||
            (job.experienceRange && job.experienceRange.toLowerCase().includes(exp.toLowerCase()))
          )
        })) &&
      // Salary Range Filtering
      (filters.salary.length === 0 ||
        (job.minSalary != null &&
          job.maxSalary != null &&
          ((filters.salary.includes("0-3 LPA") && job.maxSalary <= 3) ||
            (filters.salary.includes("3-6 LPA") && job.minSalary >= 3 && job.maxSalary <= 6) ||
            (filters.salary.includes("6+ LPA") && job.minSalary >= 6)))) &&
      // Job Type filter (Check jobType field + job description)
      (filters.jobType.length === 0 ||
        filters.jobType.some((type) => {
          // Check if job type exists and matches (case-insensitive)
          if (
            (job.jobType && job.jobType.toLowerCase().includes(type.toLowerCase())) ||
            (job.jobTypes && job.jobTypes.toLowerCase().includes(type.toLowerCase()))
          ) {
            return true
          }
          // Check if job type is mentioned in description (case-insensitive)
          if (jobDescription.includes(type.toLowerCase())) {
            return true
          }
          // Check for common variations (e.g., "full time" vs "full-time")
          const normalizedType = type.toLowerCase().replace(/[-\s]/g, "")
          const normalizedJobType = job.jobType ? job.jobType.toLowerCase().replace(/[-\s]/g, "") : ""
          const normalizedJobTypes = job.jobTypes ? job.jobTypes.toLowerCase().replace(/[-\s]/g, "") : ""
          return normalizedJobType.includes(normalizedType) || normalizedJobTypes.includes(normalizedType)
        })) &&
      // Work Mode filter - using the new helper function
      (filters.workMode.length === 0 || filters.workMode.some((mode) => matchesWorkMode(job, mode)))
    )
  })

  const indexOfLastJob = currentPage * jobsPerPage
  const indexOfFirstJob = indexOfLastJob - jobsPerPage
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob)
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage)

  const openJobDetails = (job) => {
    setSelectedJob(job || {})
    setIsDialogOpen(true)
  }

  const closeDialog = () => {
    setIsDialogOpen(false)
  }

  // Handle clicking outside the dialog to close it
  const handleDialogClick = (e) => {
    if (e.target.classList.contains("dialog-overlay")) {
      closeDialog()
    }
  }

  return (
    <div className="max-w-7xl mx-auto mt-6 mb-6 p-4">
      {/* Search Section */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-6 px-6">
        <input
          type="text"
          placeholder="Job Role"
          className="p-2 border rounded w-full md:w-1/3"
          value={searchRole}
          onChange={(e) => setSearchRole(e.target.value)}
        />
        <input
          type="text"
          placeholder="Location"
          className="p-2 border rounded w-full md:w-1/3"
          value={searchLocation}
          onChange={(e) => setSearchLocation(e.target.value)}
        />
        <button className="bg-blue-800 text-white px-6 py-2 rounded" onClick={handleSearch}>
          Search
        </button>
      </div>

      <div className="flex gap-6 px-6">
        {/* Filter Section */}
        <div className="w-1/4 bg-white p-4 border rounded shadow-md min-h-[400px] overflow-y-auto">
          <h3 className="font-semibold text-lg mb-4">All Filters</h3>

          {Object.keys(filterOptions).map((category) => (
            <div key={category} className="mb-4">
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleFilterSection(category)}
              >
                <h4 className="font-semibold">{category.charAt(0).toUpperCase() + category.slice(1)}</h4>
                {filterVisibility[category] ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </div>

              {filterVisibility[category] && (
                <div className="mt-2">
                  {filterOptions[category].map((option) => (
                    <label key={option} className="flex items-center space-x-2 mb-2">
                      <input
                        type="checkbox"
                        value={option}
                        checked={filters[category]?.includes(option)}
                        onChange={(e) => handleCheckboxChange(e, category)}
                        className="h-4 w-4"
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Job Listings */}
        <div className="w-3/4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {currentJobs.length > 0 ? (
              currentJobs.map((job) => (
                <div key={job.id} className="bg-white border rounded-xl shadow-md p-5 flex flex-col h-44 relative">
                  <h4 className="font-semibold text-lg text-gray-800">{job.role}</h4>
                  <p className="text-gray-600">{job.companyName}</p>
                  <p className="text-sm text-gray-500">
                    <span className="font-semibold">Salary:</span>{" "}
                    {job.minSalary || job.maxSalary
                      ? `₹${job.minSalary || job.maxSalary} ${job.maxSalary ? `- ₹${job.maxSalary}` : ""} LPA`
                      : "₹ Not Disclosed"}
                    <span className="mx-2">|</span>
                    <span className="text-sm text-gray-500">{job.location}</span>
                  </p>

                  {/* Bookmark Button */}
                  <button
                    className="absolute top-4 right-4 text-gray-500 hover:text-blue-600"
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleBookmark(job)
                    }}
                  >
                    {savedJobIds.has(job.id) ? (
                      <BookmarkCheck size={20} className="text-blue-600" />
                    ) : (
                      <Bookmark size={20} />
                    )}
                  </button>

                  <div className="flex justify-center mt-4">
                    <button
                      className="bg-blue-800 text-white px-4 py-1 rounded-md font-medium"
                      onClick={() => openJobDetails(job)}
                    >
                      Details
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 col-span-3">No jobs found matching your criteria.</p>
            )}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-6 gap-2">
            <button
              className={`px-3 py-1 rounded ${currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-800 text-white"}`}
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                className={`px-3 py-1 rounded ${currentPage === index + 1 ? "bg-blue-800 text-white" : "bg-gray-200"}`}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}
            <button
              className={`px-3 py-1 rounded ${currentPage === totalPages ? "bg-gray-300 cursor-not-allowed" : "bg-blue-800 text-white"}`}
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Custom Dialog */}
      {isDialogOpen && selectedJob && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 dialog-overlay"
          onClick={handleDialogClick}
        >
          <div
            className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Dialog Header */}
            <div className="relative p-5 border-b">
              <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-700" onClick={closeDialog}>
                <X size={20} />
              </button>
              <h2 className="text-2xl font-bold text-blue-800 text-center pr-8">{selectedJob.role}</h2>
              <p className="text-lg text-gray-600 text-center">{selectedJob.companyName}</p>
            </div>

            {/* Dialog Content */}
            <div className="p-6">
              {/* Job Details */}
              <div className="space-y-2 text-gray-700 text-left">
                <p className="flex items-center">
                  <MapPin size={16} className="mr-2 text-blue-800" />
                  <span className="font-semibold">Location:</span> {selectedJob.location}
                </p>

                <p className="flex items-center">
                  <DollarSign size={16} className="mr-2 text-blue-800" />
                  <span className="font-semibold">Salary:</span>{" "}
                  {selectedJob.minSalary && selectedJob.maxSalary
                    ? `₹${selectedJob.minSalary} - ₹${selectedJob.maxSalary} LPA`
                    : selectedJob.minSalary
                      ? `₹${selectedJob.minSalary} LPA`
                      : selectedJob.maxSalary
                        ? `₹${selectedJob.maxSalary} LPA`
                        : "₹ Not Disclosed"}
                </p>

                <p className="flex items-center">
                  <Building size={16} className="mr-2 text-blue-800" />
                  <span className="font-semibold ">Experience:</span>{" "}
                  {selectedJob.experienceRange || selectedJob.experience}
                </p>

                <p className="flex items-center">
                  <Briefcase size={16} className="mr-2 text-blue-800" />
                  <span className="font-semibold">Job Type:</span> {selectedJob.jobType || "Not specified"}
                </p>

                <p className="flex items-center">
                  <Monitor size={16} className="mr-2 text-blue-800" />
                  <span className="font-semibold">Work Mode:</span> {selectedJob.workmode || "Not specified"}
                </p>

                <p className="flex items-center">
                  <Calendar size={16} className="mr-2 text-blue-800" />
                  <span className="font-semibold">Date Posted:</span> {selectedJob.datePosted}
                </p>
              </div>

              {/* Education */}
              {selectedJob.education && (
                <div className="mt-6">
                  <h3 className="font-semibold text-gray-800 text-left flex items-center">
                    <GraduationCap size={16} className="mr-2 text-blue-800" />
                    Education
                  </h3>
                  <ul className="list-disc list-inside text-gray-700 mt-2 text-left">
                    {selectedJob.education
                      ?.split(/[•]/)
                      .filter((point) => point.trim() !== "")
                      .map((point, index) => (
                        <li key={index}>{point.trim()}</li>
                      ))}
                  </ul>
                </div>
              )}

              {/* Job Description */}
              {selectedJob.description && (
                <div className="mt-6">
                  <h3 className="font-semibold text-gray-800 text-left flex items-center">
                    <Clipboard size={16} className="mr-2 text-blue-800" />
                    Job Description
                  </h3>
                  <ul className="list-disc list-inside text-gray-700 mt-2 text-left">
                    {selectedJob.description
                      .split("•")
                      .filter((point) => point.trim() !== "")
                      .map((point, index) => (
                        <li key={index}>{point.trim()}</li>
                      ))}
                  </ul>
                </div>
              )}

              {/* Key Responsibilities */}
              {selectedJob.keyResponsibilities && (
                <div className="mt-6">
                  <h3 className="font-semibold text-gray-800 text-left flex items-center">
                    <CheckSquare size={16} className="mr-2 text-blue-800" />
                    key Responsibilties
                  </h3>
                  <ul className="list-disc list-inside text-gray-700 mt-2 text-left">
                    {selectedJob.keyResponsibilities
                      .split("•")
                      .filter((point) => point.trim() !== "")
                      .map((point, index) => (
                        <li key={index}>{point.trim()}</li>
                      ))}
                  </ul>
                </div>
              )}

              {/* Skills Required */}
              {selectedJob.skillsRequired && (
                <div className="mt-6">
                  <h3 className="font-semibold text-gray-800 text-left flex items-center">
                    <Star size={16} className="mr-2 text-blue-800" />
                    Skills Required
                  </h3>
                  <div className="flex flex-wrap gap-2 mt-2">
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

              {/* Apply Now Button */}
              <div className="mt-6 flex justify-center">
                <button
                  className="bg-blue-800 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700"
                  onClick={handleApplyNow} // Use the new function for applying
                >
                  Apply Now
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

export default JobPosting
