"use client"
import {
  FaPencilAlt,
  FaMapMarkerAlt,
  FaVenusMars,
  FaPhone,
  FaUser,
  FaBriefcase,
  FaDownload,
  FaLinkedin,
  FaGithub,
} from "react-icons/fa"
import axios from "axios"

// Update the resume download function to handle the case where there might be multiple profiles
const handleResumeDownload = async (userId, resumeUrl) => {
  try {
    // Check if userId exists
    if (!userId) {
      console.error("Cannot download resume: User ID is missing")
      alert("Cannot download resume: User profile not found")
      return
    }

    // Check if resumeUrl exists
    if (!resumeUrl) {
      console.error("Cannot download resume: Resume URL is missing")
      alert("No resume found for this profile")
      return
    }

    console.log("Downloading resume for user ID:", userId, "Resume URL:", resumeUrl)

    // Extract the filename from the resumeUrl to use in the download
    const resumeFileName = resumeUrl.split("/").pop() || "resume.pdf"

    const response = await axios.get(`http://localhost:8080/api/profile/${userId}/resume`, {
      responseType: "blob",
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    })

    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", resumeFileName)
    document.body.appendChild(link)
    link.click()
    link.remove() // Clean up
  } catch (error) {
    console.error("Error downloading resume:", error)
    alert("Failed to download resume.")
  }
}

const ProfileSidebar = ({ profileData, onEdit, isNewUser }) => {
  // Ensure completion percentage is 100% if all required fields are filled
  const displayCompletionPercentage = () => {
    // If the percentage is already 100%, return it
    if (profileData.completionPercentage === 100) {
      return 100
    }

    // Check if all required fields are filled
    const hasName = profileData.name && profileData.name.trim() !== ""
    const hasPhone = profileData.phone && profileData.phone.trim() !== ""
    const hasWorkExperience = profileData.workExperience && profileData.workExperience.length > 0
    const hasEducation = profileData.education && profileData.education.length > 0
    const hasSkills = profileData.skills && profileData.skills.length > 0
    const hasCertifications = profileData.certifications && profileData.certifications.length > 0

    // If all required fields are filled, return 100%
    if (hasName && hasPhone && hasWorkExperience && hasEducation && hasSkills && hasCertifications) {
      return 100
    }

    // Otherwise, return the original percentage
    return profileData.completionPercentage || 0
  }

  return (
    <>
      {/* Profile Card */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="relative pb-0">
          <div className="absolute top-4 right-4 z-10">
            <button
              className="p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors"
              onClick={onEdit}
              aria-label="Edit profile"
            >
              <FaPencilAlt className="text-gray-700 w-4 h-4" />
            </button>
          </div>
          <div className="flex flex-col items-center p-6">
            <div className="h-24 w-24 rounded-full bg-gray-200 mb-4 overflow-hidden relative">
              {profileData.profileImageUrl ? (
                <img
                  src={`http://localhost:8080/uploads/${profileData.profileImageUrl}`}
                  alt={profileData.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-gray-700 text-xl font-medium">
                  {isNewUser
                    ? "N/A"
                    : (profileData.name || "")
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                </div>
              )}
            </div>
            <h1 className="text-xl font-bold text-center">{profileData.name || (isNewUser ? "" : "Add your name")}</h1>
            <p className="text-gray-600 text-sm text-center mb-4">
              {profileData.title || (isNewUser ? "" : "Add your job title")}
            </p>
          </div>
        </div>
        <div className="p-6 pt-0">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-gray-500 w-4 h-4" />
              <span className="text-sm" aria-label="Add your location">
                {profileData.location || ""}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <FaVenusMars className="text-gray-500 w-4 h-4" />
              <span className="text-sm" aria-label="Add your gender">
                {profileData.gender}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <FaPhone className="text-gray-500 w-4 h-4" />
              <span className="text-sm" aria-label="Add your contact number">
                {profileData.phone || ""}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <FaUser className="text-gray-500 w-4 h-4" />
              <span className="text-sm">{profileData.email || ""}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaBriefcase className="text-gray-500 w-4 h-4" />
              <span className="text-sm" aria-label="Add your experience">
                {profileData.experience || ""}
              </span>
            </div>
            {/* LinkedIn link - clickable */}
            <div className="flex items-center gap-2">
              <FaLinkedin className="text-gray-500 w-4 h-4" />
              {profileData.linkedinUrl ? (
                <a
                  href={profileData.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline"
                  aria-label="View LinkedIn profile"
                >
                  LinkedIn Profile
                </a>
              ) : (
                <span className="text-sm text-gray-400" aria-label="Add your LinkedIn profile">
                  Add LinkedIn profile
                </span>
              )}
            </div>
            {/* GitHub link - clickable */}
            <div className="flex items-center gap-2">
              <FaGithub className="text-gray-500 w-4 h-4" />
              {profileData.githubUrl ? (
                <a
                  href={profileData.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline"
                  aria-label="View GitHub profile"
                >
                  GitHub Profile
                </a>
              ) : (
                <span className="text-sm text-gray-400" aria-label="Add your GitHub profile">
                  Add GitHub profile
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="px-6 pb-6 flex flex-col gap-2">
          {profileData.resumeUrl && (
            <button
              className="w-full bg-blue-800 text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
              onClick={() => handleResumeDownload(profileData.id, profileData.resumeUrl)}
            >
              <FaDownload className="mr-2 w-4 h-4" />
              Download Resume
            </button>
          )}
        </div>
      </div>
    </>
  )
}

export default ProfileSidebar
