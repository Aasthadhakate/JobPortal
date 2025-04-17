"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import "../index.css"

const ApplicationForm = ({ jobTitle, company, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    resume: null,
  })
  const [alert, setAlert] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [hasApplied, setHasApplied] = useState(false)

  useEffect(() => {
    checkIfAlreadyApplied()
  }, [])

  const checkIfAlreadyApplied = async () => {
    const userEmail = localStorage.getItem("user")
    if (!userEmail) return

    try {
      const response = await axios.get(`http://localhost:8080/api/applications/user/${userEmail}`, {
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      })

      const alreadyApplied = response.data.some(
        (application) => 
          application.jobTitle === jobTitle && 
          application.company === company && 
          application.applicantEmail === userEmail
      )

      if (alreadyApplied) {
        setError("You have already applied for this job")
        setHasApplied(true)
      }
    } catch (err) {
      console.error("Error checking application status:", err)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleFileChange = (e) => {
    setFormData({ ...formData, resume: e.target.files[0] })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Get the current user's email from localStorage
    const userEmail = localStorage.getItem("user")

    if (!userEmail) {
      alert("You need to be logged in to apply for jobs")
      setLoading(false)
      return
    }

    try {
      // Create form data for API submission
      const apiFormData = new FormData()
      apiFormData.append("name", formData.name)
      apiFormData.append("email", userEmail) // Use logged-in user's email
      apiFormData.append("phone", formData.phone)
      apiFormData.append("jobTitle", jobTitle)
      apiFormData.append("company", company)

      if (formData.resume) {
        apiFormData.append("resume", formData.resume)
      }

      // Submit to backend API
      console.log("Submitting application to API...")
      const response = await axios.post("http://localhost:8080/api/applications", apiFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Access-Control-Allow-Origin": "*",
        },
      })

      console.log("API response:", response.data)

      // Also store in localStorage for offline access
      const localStorageJob = {
        jobTitle,
        company,
        name: formData.name,
        email: userEmail,
        phone: formData.phone,
        appliedDate: new Date().toISOString(),
        status: "PENDING",
        // If we have an ID from the API response, use it
        id: response.data?.id || Date.now(),
      }

      // Get existing applied jobs
      const appliedJobs = JSON.parse(localStorage.getItem("appliedJobs") || "[]")

      // Check if already applied
      const alreadyApplied = appliedJobs.some(
        (job) => job.jobTitle === jobTitle && job.company === company && job.email === userEmail,
      )

      if (!alreadyApplied) {
        // Add new job and update localStorage
        appliedJobs.push(localStorageJob)
        localStorage.setItem("appliedJobs", JSON.stringify(appliedJobs))
  
        console.log("Job application saved to localStorage:", localStorageJob)
        console.log("All applied jobs in localStorage:", appliedJobs)
  
        setAlert(true)
        setTimeout(() => setAlert(false), 1000)
      } else {
        alert("You have already applied for this job")
      }

      // Reset form
      setFormData({ name: "", email: "", phone: "", resume: null })
      document.getElementById("resumeInput").value = ""
    } catch (err) {
      console.error("Error submitting application:", err)
      if (err.response?.status === 409) {
        setError("You have already applied for this job")
        setHasApplied(true)
      } else {
        setError("Failed to submit application. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  if (hasApplied) {
    return (
      <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-lg">
        <div className="text-center">
          <div className="mb-4 text-red-600">
            <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Already Applied</h2>
          <p className="text-gray-600 mb-4">You have already submitted an application for this position.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-lg relative">
      <h2 className="text-2xl font-bold text-center text-gray-800">
        Apply for {jobTitle} at {company}
      </h2>

      {/* Alert Box */}
      {alert && (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg transition-opacity duration-500">
          ✅ Successfully submitted
        </div>
      )}

      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-5 mt-4">
        <div className="flex items-center">
          <label className="w-1/3 text-sm text-left font-medium text-gray-700">Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-[70%] p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="flex items-center">
          <label className="w-1/3 text-sm text-left font-medium text-gray-700">Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-[70%] p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="flex items-center">
          <label className="w-1/3 text-sm text-left font-medium text-gray-700">Phone:</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-[70%] p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="flex items-center">
          <label className="w-1/3 text-left text-sm font-medium text-gray-700">Resume:</label>
          <input
            id="resumeInput"
            type="file"
            onChange={handleFileChange}
            className="w-[70%] p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`bg-blue-600 text-white px-4 py-1 rounded-md hover:bg-blue-700 transition duration-200 ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Submitting..." : "Submit Application"}
        </button>
      </form>
    </div>
  )
}

export default ApplicationForm