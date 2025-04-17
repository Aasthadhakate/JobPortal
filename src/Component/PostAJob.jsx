"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"

const PostJobForm = () => {
  const { jobId } = useParams()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    openings: "0",
    companyName: "",
    role: "",
    jobTypes: {
      fullTime: false,
      partTime: false,
      internship: false,
    },
    workModes: {
      remote: false,
      onSite: false,
      hybrid: false,
    },
    description: "",
    skillsRequired: "",
    location: "",
    minSalary: "",
    maxSalary: "",
    salaryNotDisclosed: false,
    keyResponsibilities: "",
    experienceRange: "",
    education: "",
  })

  // Fetch job data if editing an existing job
  useEffect(() => {
    if (jobId) {
      const fetchJobData = async () => {
        setIsLoading(true)
        try {
          const response = await fetch(`http://localhost:8080/api/jobs/${jobId}`)
          if (!response.ok) {
            throw new Error("Failed to fetch job data")
          }
          const jobData = await response.json()
          console.log("Fetched job data:", jobData)

          // Parse job types and work modes from strings to checkboxes
          const jobTypes = {
            fullTime: jobData.jobType?.includes("fullTime") || false,
            partTime: jobData.jobType?.includes("partTime") || false,
            internship: jobData.jobType?.includes("internship") || false,
          }

          const workModes = {
            remote: jobData.workmode?.includes("remote") || false,
            onSite: jobData.workmode?.includes("onSite") || false,
            hybrid: jobData.workmode?.includes("hybrid") || false,
          }

          // Check if salary is disclosed
          const salaryNotDisclosed = jobData.minSalary === "Not Disclosed" || jobData.maxSalary === "Not Disclosed"

          // Format description, responsibilities, and education by removing bullet points
          const formatText = (text) => {
            if (!text) return ""
            return text.replace(/• /g, "").split("\n").join("\n")
          }

          setFormData({
            openings: jobData.openings.toString(),
            companyName: jobData.companyName || "",
            role: jobData.role || "",
            jobTypes,
            workModes,
            description: formatText(jobData.description),
            skillsRequired: jobData.skillsRequired || "",
            location: jobData.location || "",
            minSalary: salaryNotDisclosed ? "" : jobData.minSalary,
            maxSalary: salaryNotDisclosed ? "" : jobData.maxSalary,
            salaryNotDisclosed,
            keyResponsibilities: formatText(jobData.keyResponsibilities),
            experienceRange: jobData.experienceRange || "",
            education: formatText(jobData.education),
          })
        } catch (error) {
          console.error("Error fetching job:", error)
          setError("Failed to load job data. Please try again.")
        } finally {
          setIsLoading(false)
        }
      }

      fetchJobData()
    }
  }, [jobId])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    if (name.startsWith("jobType") || name.startsWith("workMode")) {
      const category = name.startsWith("jobType") ? "jobTypes" : "workModes"
      setFormData((prevData) => ({
        ...prevData,
        [category]: {
          ...prevData[category],
          [value]: checked,
        },
      }))
    } else {
      setFormData((prevData) => {
        if (name === "salaryNotDisclosed") {
          return {
            ...prevData,
            salaryNotDisclosed: checked,
            minSalary: checked ? "" : prevData.minSalary,
            maxSalary: checked ? "" : prevData.maxSalary,
          }
        }
        return { ...prevData, [name]: type === "checkbox" ? checked : value }
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Get auth token if user is logged in
    const user = localStorage.getItem("user")
    if (!user) {
      alert("Please sign in to post a job")
      navigate("/signin")
      return
    }

    setIsSubmitting(true)
    setError("")

    // Get the work modes string
    const workModesString = Object.keys(formData.workModes)
      .filter((key) => formData.workModes[key])
      .join(", ")

    // Get the job types string
    const jobTypesString = Object.keys(formData.jobTypes)
      .filter((key) => formData.jobTypes[key])
      .join(", ")

    const formattedData = {
      openings: Number.parseInt(formData.openings) || 0,
      companyName: formData.companyName,
      role: formData.role,
      description: formData.description
        .split("\n")
        .map((line) => `• ${line}`)
        .join("\n"),
      keyResponsibilities: formData.keyResponsibilities
        .split("\n")
        .map((line) => `• ${line}`)
        .join("\n"),
      education: formData.education
        .split("\n")
        .map((line) => `• ${line}`)
        .join("\n"),
      minSalary: formData.salaryNotDisclosed ? "Not Disclosed" : formData.minSalary,
      maxSalary: formData.salaryNotDisclosed ? "Not Disclosed" : formData.maxSalary,
      skillsRequired: formData.skillsRequired,
      location: formData.location,
      experienceRange: formData.experienceRange,
      // Include all possible field names to ensure compatibility
      jobType: jobTypesString,
      workmode: workModesString,
    }

    try {
      console.log("Sending job data:", formattedData)

      let url = "http://localhost:8080/api/post"
      let method = "POST"

      // If editing an existing job, use PUT method
      if (jobId) {
        url = `http://localhost:8080/api/jobs/${jobId}`
        method = "PUT"
      }

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedData),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || `Failed to ${jobId ? "update" : "post"} job`)
      }

      const result = await response.text()
      alert(result)

      // Reset form after successful submission
      setFormData({
        openings: "0",
        companyName: "",
        role: "",
        jobTypes: {
          fullTime: false,
          partTime: false,
          internship: false,
        },
        workModes: {
          remote: false,
          onSite: false,
          hybrid: false,
        },
        description: "",
        skillsRequired: "",
        location: "",
        minSalary: "",
        maxSalary: "",
        salaryNotDisclosed: false,
        keyResponsibilities: "",
        experienceRange: "",
        education: "",
      })

      // Redirect to post a job  page after successful submission
      navigate("/PostAJob")
    } catch (error) {
      console.error(`Error ${jobId ? "updating" : "posting"} job:`, error)
      setError(`Error ${jobId ? "updating" : "posting"} job: ${error.message || "Unknown error"}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading job data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen p-4">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-center">
          <h1 className="text-xl font-semibold text-white">{jobId ? "Edit Job" : "Post a New Job"}</h1>
          <p className="text-blue-100 text-sm mt-1">
            {jobId ? "Update the job details below" : "Fill in the details below to create a job posting"}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 m-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information Section */}
            <section className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <div className="text-blue-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h2 className="text-base font-medium text-gray-800">Basic Information</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Company Name</label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-1">Job Role</label>
                  <input
                    type="text"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-1">Experience Range</label>
                  <input
                    type="text"
                    name="experienceRange"
                    value={formData.experienceRange}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="e.g. 2-4 years"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-1">Number of Openings</label>
                  <input
                    type="text"
                    name="openings"
                    value={formData.openings}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-1">Job Type:</label>
                  <div className="flex flex-wrap gap-4 mt-1">
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        name="jobType-fullTime"
                        value="fullTime"
                        checked={formData.jobTypes.fullTime}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        disabled={isSubmitting}
                      />
                      <span className="ml-2 text-sm text-gray-700">Full-time</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        name="jobType-partTime"
                        value="partTime"
                        checked={formData.jobTypes.partTime}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        disabled={isSubmitting}
                      />
                      <span className="ml-2 text-sm text-gray-700">Part-time</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        name="jobType-internship"
                        value="internship"
                        checked={formData.jobTypes.internship}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        disabled={isSubmitting}
                      />
                      <span className="ml-2 text-sm text-gray-700">Internship</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-1">Work Mode:</label>
                  <div className="flex flex-wrap gap-4 mt-1">
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        name="workMode-hybrid"
                        value="hybrid"
                        checked={formData.workModes.hybrid}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        disabled={isSubmitting}
                      />
                      <span className="ml-2 text-sm text-gray-700">Hybrid</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        name="workMode-remote"
                        value="remote"
                        checked={formData.workModes.remote}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        disabled={isSubmitting}
                      />
                      <span className="ml-2 text-sm text-gray-700">Remote</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        name="workMode-onSite"
                        value="onSite"
                        checked={formData.workModes.onSite}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        disabled={isSubmitting}
                      />
                      <span className="ml-2 text-sm text-gray-700">On-site</span>
                    </label>
                  </div>
                </div>
              </div>
            </section>

            {/* Job Description Section */}
            <section className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <div className="text-blue-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h2 className="text-base font-medium text-gray-800">Job Description</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Description</label>
                  <p className="text-xs text-gray-500 mb-1">Enter each point on a new line</p>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={5}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    required
                    disabled={isSubmitting}
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-1">Key Responsibilities</label>
                  <p className="text-xs text-gray-500 mb-1">Enter each point on a new line</p>
                  <textarea
                    name="keyResponsibilities"
                    value={formData.keyResponsibilities}
                    onChange={handleChange}
                    rows={5}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    required
                    disabled={isSubmitting}
                  ></textarea>
                </div>
              </div>
            </section>

            {/* Location & Compensation Section (Swapped) */}
            <section className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <div className="text-blue-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <h2 className="text-base font-medium text-gray-800">Location & Compensation</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="e.g. Bangalore, India"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-1">Salary Range (in LPA)</label>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <input
                        type="number"
                        name="minSalary"
                        value={formData.minSalary}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Min LPA"
                        step="0.1"
                        min="0"
                        disabled={formData.salaryNotDisclosed || isSubmitting}
                        required={!formData.salaryNotDisclosed}
                      />
                    </div>
                    <div className="flex-1">
                      <input
                        type="number"
                        name="maxSalary"
                        value={formData.maxSalary}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Max LPA"
                        step="0.1"
                        min="0"
                        disabled={formData.salaryNotDisclosed || isSubmitting}
                        required={!formData.salaryNotDisclosed}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="salaryNotDisclosed"
                    name="salaryNotDisclosed"
                    checked={formData.salaryNotDisclosed}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    disabled={isSubmitting}
                  />
                  <label htmlFor="salaryNotDisclosed" className="ml-2 text-sm text-gray-700">
                    Salary Not Disclosed
                  </label>
                </div>
              </div>
            </section>

            {/* Education & Qualifications Section */}
            <section className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <div className="text-blue-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998a12.078 12.078 0 01.665-6.479L12 14z" />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998a12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
                    />
                  </svg>
                </div>
                <h2 className="text-base font-medium text-gray-800">Education & Qualifications</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Education Requirements</label>
                  <p className="text-xs text-gray-500 mb-1">Enter each point on a new line</p>
                  <textarea
                    name="education"
                    value={formData.education}
                    onChange={handleChange}
                    rows={5}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    required
                    disabled={isSubmitting}
                  ></textarea>
                </div>
              </div>
            </section>

            {/* Skills Required Section (Swapped) */}
            <section className="bg-white p-6 rounded-lg border border-gray-200 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="text-blue-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h2 className="text-base font-medium text-gray-800">Skills Required</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Skills Required</label>
                  <input
                    type="text"
                    name="skillsRequired"
                    value={formData.skillsRequired}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="e.g. React, Node.js, MongoDB"
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </section>
          </div>

          <div className="mt-6 flex justify-center gap-4">
            <button
              type="button"
              onClick={() => navigate("/jobs")}
              className="px-6 py-2 bg-gray-200 text-gray-800 font-medium rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-700 text-white font-medium rounded-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-70"
            >
              {isSubmitting ? "Saving..." : jobId ? "Update Job" : "Post Job"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PostJobForm
