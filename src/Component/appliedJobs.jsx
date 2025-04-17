"use client"

import { useState, useEffect } from "react"
import {
  CheckCircle,
  X,
  Calendar,
  User,
  Mail,
  Phone,
  Building,
  MapPin,
  DollarSign,
  Clock,
  AlertCircle,
  XCircle,
  Briefcase,
  FileText,
  ChevronRight,
} from "lucide-react"
import { Link } from "react-router-dom"
import axios from "axios"

const AppliedJobs = () => {
  const [appliedJobs, setAppliedJobs] = useState([])
  const [selectedJob, setSelectedJob] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [userEmail, setUserEmail] = useState("")
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    // Get current user's email
    const email = localStorage.getItem("user")
    setUserEmail(email)

    if (email) {
      fetchAppliedJobs(email)
    } else {
      setLoading(false)
      setAppliedJobs([])
    }
  }, [])

  const fetchAppliedJobs = async (email) => {
    setLoading(true)
    setIsRefreshing(true)

    try {
      if (!email) {
        setLoading(false)
        setIsRefreshing(false)
        return
      }

      console.log("Fetching applied jobs for email:", email)

      // Try to fetch from backend first
      try {
        const response = await axios.get(`http://localhost:8080/api/applications/user/${email}`, {
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        })

        console.log("API response:", response.data)

        // Transform backend data to match the expected format
        const transformedJobs = response.data.map((app) => ({
          jobTitle: app.jobTitle,
          company: app.company,
          name: app.applicantName,
          email: app.applicantEmail,
          phone: app.applicantPhone,
          appliedDate: app.applicationDate,
          status: app.status,
          id: app.id,
        }))

        // Remove any duplicates (same job title and company)
        const uniqueJobs = transformedJobs.reduce((acc, current) => {
          const isDuplicate = acc.find(
            (item) =>
              item.jobTitle === current.jobTitle && item.company === current.company && item.email === current.email,
          )
          if (!isDuplicate) {
            acc.push(current)
          }
          return acc
        }, [])

        setAppliedJobs(uniqueJobs)

        // Also update localStorage for offline access
        localStorage.setItem("appliedJobs", JSON.stringify(uniqueJobs))

        console.log("Applied jobs set from API:", transformedJobs)
      } catch (err) {
        console.error("Error fetching applied jobs from API:", err)

        // Fallback to localStorage if backend fetch fails
        const allAppliedJobs = JSON.parse(localStorage.getItem("appliedJobs") || "[]")

        console.log("All applied jobs from localStorage:", allAppliedJobs)

        // Filter to only show jobs applied by the current user
        const userAppliedJobs = allAppliedJobs.filter((job) => job.email === email)

        console.log("Filtered applied jobs for current user:", userAppliedJobs)

        setAppliedJobs(userAppliedJobs)
      }
    } catch (err) {
      console.error("Error in applied jobs process:", err)
      const allAppliedJobs = JSON.parse(localStorage.getItem("appliedJobs") || "[]")
      const userAppliedJobs = allAppliedJobs.filter((job) => job.email === email)
      setAppliedJobs(userAppliedJobs)
    } finally {
      setLoading(false)
      setIsRefreshing(false)
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

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "PENDING":
        return <Clock size={16} className="mr-1 text-yellow-500" />
      case "REVIEWED":
        return <AlertCircle size={16} className="mr-1 text-blue-500" />
      case "SHORTLISTED":
        return <CheckCircle size={16} className="mr-1 text-green-500" />
      case "REJECTED":
        return <XCircle size={16} className="mr-1 text-red-500" />
      default:
        return <Clock size={16} className="mr-1 text-yellow-500" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "REVIEWED":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "SHORTLISTED":
        return "bg-green-100 text-green-800 border-green-200"
      case "REJECTED":
        return "bg-red-100 text-red-200 border-red-200"
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
    }
  }

  if (loading && !isRefreshing) {
    return (
      <div className="max-w-7xl mx-auto mt-6 mb-6 p-4 flex justify-center items-center h-64">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800"></div>
          <p className="mt-4 text-gray-600">Loading your applications...</p>
        </div>
      </div>
    )
  }

  // Add a debug button to the empty state to help troubleshoot
  const renderEmptyState = () => (
    <div className="bg-white rounded-xl shadow-md p-10 text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
        <Briefcase size={24} className="text-blue-800" />
      </div>
      <h2 className="text-xl font-semibold text-gray-800 mb-2">No applied jobs yet</h2>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        Jobs you apply for will appear here. Start exploring and applying for jobs you're interested in.
      </p>
      <div className="flex flex-col gap-4 items-center">
        <Link
          to="/"
          className="bg-blue-800 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 inline-flex items-center"
        >
          Explore Jobs
          <ChevronRight size={16} className="ml-1" />
        </Link>
      </div>
    </div>
  )

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen)
  }

  return (
    <div className="max-w-7xl mx-auto mt-6 mb-6 p-4 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">My Applications</h1>
            <p className="text-gray-600 mt-1">Track the status of your job applications</p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/savedJobs"
              className="px-4 py-2 border border-blue-800 text-blue-800 rounded-md hover:bg-blue-50 transition-colors flex items-center"
            >
              <Briefcase size={16} className="mr-2" />
              Saved Jobs
            </Link>
            <Link
              to="/"
              className="px-4 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
            >
              <FileText size={16} className="mr-2" />
              Browse Jobs
            </Link>
          </div>
        </div>
      </div>

      {/* Applied Jobs Section */}
      <div className="mb-10">
        {appliedJobs.length === 0 ? (
          renderEmptyState()
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {appliedJobs.map((job, index) => (
              <div
                key={job.id || index}
                className="bg-white border rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => openJobDetails(job)}
              >
                <div className="p-5 relative">
                  <div
                    className={`absolute top-5 right-5 flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status || "PENDING")}`}
                  >
                    {getStatusIcon(job.status || "PENDING")}
                    <span>{job.status || "PENDING"}</span>
                  </div>

                  <h4 className="font-semibold text-lg text-gray-800 pr-24 mb-1">{job.jobTitle}</h4>
                  <p className="text-gray-600 flex items-center">
                    <Building size={14} className="mr-1" />
                    {job.company}
                  </p>

                  {job.appliedDate && (
                    <div className="flex items-center text-gray-500 mt-3">
                      <Calendar size={14} className="mr-1" />
                      <span className="text-xs">Applied on: {formatDate(job.appliedDate)}</span>
                    </div>
                  )}

                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-semibold text-sm">
                          {job.name ? job.name.charAt(0).toUpperCase() : "U"}
                        </div>
                        <span className="ml-2 text-sm text-gray-600 truncate max-w-[120px]">{job.name}</span>
                      </div>
                      <button className="bg-blue-800 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700 transition-colors">
                        Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Custom Dialog for Applied Jobs */}
      {isDialogOpen && selectedJob && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 dialog-overlay p-4"
          onClick={handleDialogClick}
        >
          <div
            className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative p-6 border-b border-gray-200 bg-gradient-to-r from-blue-800 to-blue-700">
              <button
                className="absolute top-6 right-6 text-white hover:text-gray-200 transition-colors"
                onClick={closeDialog}
              >
                <X size={24} />
              </button>
              <h2 className="text-2xl font-bold text-white pr-8">{selectedJob.jobTitle}</h2>
              <p className="text-blue-100 flex items-center">
                <Building size={16} className="mr-2" />
                {selectedJob.company}
              </p>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(80vh-80px)]">
              {/* Application Status */}
              <div className={`mb-6 p-4 rounded-lg border ${getStatusColor(selectedJob.status || "PENDING")}`}>
                <div className="flex items-center mb-2">
                  {getStatusIcon(selectedJob.status || "PENDING")}
                  <span className="font-semibold">Application Status: {selectedJob.status || "PENDING"}</span>
                </div>
                {selectedJob.appliedDate && (
                  <p className="text-sm mt-1 flex items-center">
                    <Calendar size={14} className="mr-2" />
                    Applied on: {formatDate(selectedJob.appliedDate)}
                  </p>
                )}

                <div className="mt-4 pt-4 border-t border-opacity-20" style={{ borderColor: "currentColor" }}>
                  <h4 className="text-sm font-medium mb-2">Application Details:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="flex items-center text-sm">
                      <User size={14} className="mr-2 flex-shrink-0" />
                      <span className="truncate">{selectedJob.name}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Mail size={14} className="mr-2 flex-shrink-0" />
                      <span className="truncate">{selectedJob.email}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Phone size={14} className="mr-2 flex-shrink-0" />
                      <span className="truncate">{selectedJob.phone}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Job details */}
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">Job Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start">
                      <Briefcase className="w-5 h-5 text-blue-800 mr-3 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Position</p>
                        <p className="font-medium">{selectedJob.jobTitle}</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <Building className="w-5 h-5 text-blue-800 mr-3 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Company</p>
                        <p className="font-medium">{selectedJob.company}</p>
                      </div>
                    </div>

                    {selectedJob.location && (
                      <div className="flex items-start">
                        <MapPin className="w-5 h-5 text-blue-800 mr-3 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-500">Location</p>
                          <p className="font-medium">{selectedJob.location}</p>
                        </div>
                      </div>
                    )}

                    {selectedJob.salary && (
                      <div className="flex items-start">
                        <DollarSign className="w-5 h-5 text-blue-800 mr-3 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-500">Salary</p>
                          <p className="font-medium">{selectedJob.salary}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Job description if available */}
                {selectedJob.description && (
                  <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                    <h3 className="text-lg font-semibold mb-3 text-gray-800">Job Description</h3>
                    <div className="text-gray-700 prose max-w-none">{selectedJob.description}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AppliedJobs

