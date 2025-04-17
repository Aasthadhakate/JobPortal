"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import {
  Calendar,
  Mail,
  Phone,
  FileText,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Search,
  RefreshCw,
  X,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
} from "lucide-react"

const ViewUsers = () => {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(7) // Show 7 rows per page as requested
  const [selectedApplication, setSelectedApplication] = useState(null)
  const [showResumeModal, setShowResumeModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [filterStatus, setFilterStatus] = useState("ALL")

  useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    setLoading(true)
    setIsRefreshing(true)
    try {
      const response = await axios.get("http://localhost:8080/api/applications", {
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      })
      setApplications(response.data)
      setError(null)
    } catch (err) {
      console.error("Error fetching applications:", err)
      setError("Failed to load applications. Please try again later.")
    } finally {
      setLoading(false)
      setIsRefreshing(false)
    }
  }

  const handleResumeView = (application) => {
    setSelectedApplication(application)
    setShowResumeModal(true)
  }

  const handleDeleteApplication = async (id, e) => {
    e.stopPropagation() // Prevent row click event
    if (window.confirm("Are you sure you want to delete this application?")) {
      try {
        await axios.delete(`http://localhost:8080/api/applications/${id}`, {
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        })
        // Refresh the applications list
        fetchApplications()
      } catch (err) {
        console.error("Error deleting application:", err)
        alert("Failed to delete application. Please try again.")
      }
    }
  }

  const updateApplicationStatus = async (id, status) => {
    try {
      await axios.put(
        `http://localhost:8080/api/applications/${id}/status?status=${status}`,
        {},
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        },
      )

      // Update local state to avoid refetching
      setApplications((prevApplications) =>
        prevApplications.map((app) => (app.id === id ? { ...app, status: status } : app)),
      )

      if (selectedApplication && selectedApplication.id === id) {
        setSelectedApplication({ ...selectedApplication, status: status })
      }
    } catch (err) {
      console.error("Error updating status:", err)
      alert("Failed to update status")
    }
  }

  // Filter and search applications
  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.applicantEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.company.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter = filterStatus === "ALL" || app.status === filterStatus

    return matchesSearch && matchesFilter
  })

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredApplications.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredApplications.length / itemsPerPage)

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return "N/A"
    const date = new Date(dateTimeString)
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
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
        return <Clock size={16} className="mr-1 text-gray-500" />
    }
  }

  const handleRowClick = (application) => {
    setSelectedApplication(application)
    setShowResumeModal(true)
  }

  if (loading && !isRefreshing) {
    return (
      <div className="container mx-auto p-7 flex justify-center items-center h-screen">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800"></div>
          <p className="mt-4 text-gray-600">Loading applications...</p>
        </div>
      </div>
    )
  }

  if (error && !isRefreshing) {
    return (
      <div className="container mx-auto p-7 flex justify-center items-center h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg shadow-md max-w-lg">
          <div className="flex items-center mb-3">
            <AlertCircle size={24} className="mr-2" />
            <h3 className="text-lg font-semibold">Error Loading Data</h3>
          </div>
          <p>{error}</p>
          <button
            onClick={fetchApplications}
            className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-7 flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Job Applications Dashboard</h1>
        <p className="text-gray-600">Manage and review all job applications</p>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto">

        {/* Applications Table */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden mb-6">
          {filteredApplications.length === 0 ? (
            <div className="p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <FileText size={24} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No applications found</h3>
              <p className="text-gray-500">
                {searchTerm || filterStatus !== "ALL"
                  ? "Try adjusting your search or filter criteria"
                  : "When candidates apply for jobs, they'll appear here"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-800 to-blue-700 text-white">
                    <th className="px-6 py-4 text-left font-semibold">Applicant</th>
                    <th className="px-6 py-4 text-left font-semibold">Job Applied</th>
                    <th className="px-6 py-4 text-left font-semibold">Company</th>
                    <th className="px-6 py-4 text-left font-semibold">Date & Time</th>
                    <th className="px-6 py-4 text-left font-semibold">Status</th>
                    <th className="px-6 py-4 text-left font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((application, index) => (
                    <tr
                      key={application.id}
                      className={`border-b hover:bg-blue-50 transition-colors cursor-pointer ${
                        index === currentItems.length - 1 ? "" : "border-gray-200"
                      }`}
                      onClick={() => handleRowClick(application)}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-semibold">
                            {application.applicantName.charAt(0).toUpperCase()}
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">{application.applicantName}</p>
                            <div className="flex items-center text-xs text-gray-500">
                              <Mail size={12} className="mr-1" />
                              {application.applicantEmail}
                            </div>
                            <div className="flex items-center text-xs text-gray-500">
                              <Phone size={12} className="mr-1" />
                              {application.applicantPhone}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-gray-900">{application.jobTitle}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-500">{application.company}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar size={14} className="mr-1" />
                          {formatDateTime(application.applicationDate)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                            application.status === "PENDING"
                              ? "bg-yellow-100 text-yellow-800"
                              : application.status === "REVIEWED"
                                ? "bg-blue-100 text-blue-800"
                                : application.status === "SHORTLISTED"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                          }`}
                        >
                          {getStatusIcon(application.status)}
                          {application.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
                          <button
                            className="bg-blue-800 hover:bg-blue-700 text-white px-3 py-1.5 rounded transition-colors flex items-center"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleResumeView(application)
                            }}
                          >
                            <FileText size={14} className="mr-1" />
                            Resume
                          </button>
                          <button
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded transition-colors flex items-center"
                            onClick={(e) => handleDeleteApplication(application.id, e)}
                          >
                            <Trash2 size={14} className="mr-1" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {filteredApplications.length > 0 && (
          <div className="flex justify-between items-center bg-white rounded-lg shadow-md p-4 border border-gray-200">
            <div className="text-sm text-gray-600">
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredApplications.length)} of{" "}
              {filteredApplications.length} applications
            </div>
            <nav className="flex space-x-1" aria-label="Pagination">
              <button
                className={`px-3 py-2 rounded-md flex items-center ${
                  currentPage === 1 ? "text-gray-400 cursor-not-allowed" : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft size={16} className="mr-1" />
                Previous
              </button>

              <div className="flex space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  // Logic to show pages around current page
                  let pageNum
                  if (totalPages <= 5) {
                    pageNum = i + 1
                  } else if (currentPage <= 3) {
                    pageNum = i + 1
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i
                  } else {
                    pageNum = currentPage - 2 + i
                  }

                  return (
                    <button
                      key={pageNum}
                      className={`w-10 h-10 rounded-md ${
                        currentPage === pageNum
                          ? "bg-blue-800 text-white font-medium"
                          : "bg-white text-gray-700 hover:bg-gray-100"
                      }`}
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </button>
                  )
                })}

                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <>
                    <span className="flex items-center justify-center w-10 h-10">...</span>
                    <button
                      className="w-10 h-10 rounded-md bg-white text-gray-700 hover:bg-gray-100"
                      onClick={() => setCurrentPage(totalPages)}
                    >
                      {totalPages}
                    </button>
                  </>
                )}
              </div>

              <button
                className={`px-3 py-2 rounded-md flex items-center ${
                  currentPage === totalPages ? "text-gray-400 cursor-not-allowed" : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight size={16} className="ml-1" />
              </button>
            </nav>
          </div>
        )}
      </main>

      {/* Resume Modal */}
      {showResumeModal && selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gradient-to-r from-blue-800 to-blue-700 text-white">
              <h2 className="text-xl font-bold">Application Details</h2>
              <button
                onClick={() => setShowResumeModal(false)}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="overflow-y-auto p-6 max-h-[calc(90vh-80px)]">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left column - Applicant info */}
                <div className="md:col-span-1 space-y-6">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center mb-4">
                      <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 text-xl font-bold">
                        {selectedApplication.applicantName.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-semibold text-gray-900">{selectedApplication.applicantName}</h3>
                        <p className="text-sm text-gray-500">Applicant</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-start">
                        <Mail className="w-5 h-5 text-gray-400 mr-2 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-500">Email</p>
                          <p className="text-sm">{selectedApplication.applicantEmail}</p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <Phone className="w-5 h-5 text-gray-400 mr-2 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-500">Phone</p>
                          <p className="text-sm">{selectedApplication.applicantPhone}</p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <Calendar className="w-5 h-5 text-gray-400 mr-2 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-500">Applied On</p>
                          <p className="text-sm">{formatDateTime(selectedApplication.applicationDate)}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Resume section */}
                  {selectedApplication.resumeUrl && (
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <h3 className="text-md font-semibold mb-3 flex items-center">
                        <FileText size={18} className="mr-2 text-blue-800" />
                        Resume
                      </h3>
                      <div className="bg-white p-3 rounded border border-gray-200">
                        <p className="text-sm mb-3 truncate">{selectedApplication.resumeUrl}</p>
                        <a
                          href={`http://localhost:8080/api/applications/${selectedApplication.id}/resume`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-blue-800 text-white px-4 py-2 rounded inline-flex items-center text-sm hover:bg-blue-700 transition-colors"
                        >
                          <FileText size={14} className="mr-2" />
                          Download Resume
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right column - Job details and status */}
                <div className="md:col-span-2 space-y-6">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-semibold mb-3">Job Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500">Position</p>
                        <p className="text-md font-medium">{selectedApplication.jobTitle}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Company</p>
                        <p className="text-md font-medium">{selectedApplication.company}</p>
                      </div>
                    </div>
                  </div>

                  {/* Application Status */}
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-semibold mb-3">Application Status</h3>
                    <div className="mb-4">
                      <div className="flex items-center mb-2">
                        {getStatusIcon(selectedApplication.status)}
                        <span
                          className={`text-sm font-medium ${
                            selectedApplication.status === "PENDING"
                              ? "text-yellow-800"
                              : selectedApplication.status === "REVIEWED"
                                ? "text-blue-800"
                                : selectedApplication.status === "SHORTLISTED"
                                  ? "text-green-800"
                                  : "text-red-800"
                          }`}
                        >
                          Current Status: {selectedApplication.status}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                        <div
                          className={`h-2.5 rounded-full ${
                            selectedApplication.status === "PENDING"
                              ? "bg-yellow-500 w-1/4"
                              : selectedApplication.status === "REVIEWED"
                                ? "bg-blue-500 w-2/4"
                                : selectedApplication.status === "SHORTLISTED"
                                  ? "bg-green-500 w-3/4"
                                  : "bg-red-500 w-full"
                          }`}
                        ></div>
                      </div>
                    </div>

                    <h4 className="text-sm font-medium mb-2">Update Status:</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      <button
                        onClick={() => updateApplicationStatus(selectedApplication.id, "PENDING")}
                        className={`px-3 py-2 rounded-md text-xs font-medium flex items-center justify-center ${
                          selectedApplication.status === "PENDING"
                            ? "bg-yellow-500 text-white"
                            : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                        }`}
                      >
                        <Clock size={14} className="mr-1" />
                        Pending
                      </button>

                      <button
                        onClick={() => updateApplicationStatus(selectedApplication.id, "REVIEWED")}
                        className={`px-3 py-2 rounded-md text-xs font-medium flex items-center justify-center ${
                          selectedApplication.status === "REVIEWED"
                            ? "bg-blue-500 text-white"
                            : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                        }`}
                      >
                        <AlertCircle size={14} className="mr-1" />
                        Reviewed
                      </button>

                      <button
                        onClick={() => updateApplicationStatus(selectedApplication.id, "SHORTLISTED")}
                        className={`px-3 py-2 rounded-md text-xs font-medium flex items-center justify-center ${
                          selectedApplication.status === "SHORTLISTED"
                            ? "bg-green-500 text-white"
                            : "bg-green-100 text-green-800 hover:bg-green-200"
                        }`}
                      >
                        <CheckCircle size={14} className="mr-1" />
                        Shortlisted
                      </button>

                      <button
                        onClick={() => updateApplicationStatus(selectedApplication.id, "REJECTED")}
                        className={`px-3 py-2 rounded-md text-xs font-medium flex items-center justify-center ${
                          selectedApplication.status === "REJECTED"
                            ? "bg-red-500 text-white"
                            : "bg-red-100 text-red-800 hover:bg-red-200"
                        }`}
                      >
                        <XCircle size={14} className="mr-1" />
                        Rejected
                      </button>
                    </div>
                  </div>

                  {/* Notes section - could be expanded in the future */}
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-semibold mb-3">Notes</h3>
                    <textarea
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-32"
                      placeholder="Add notes about this applicant..."
                    ></textarea>
                    <div className="mt-2 flex justify-end">
                      <button className="bg-blue-800 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition-colors">
                        Save Notes
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
   
export default ViewUsers

