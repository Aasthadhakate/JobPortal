"use client"

import { useState, useEffect } from "react"
import ProfileSidebar from "./ProfileSidebar"
import ProfileTabs from "./ProfileTabs"
import WorkExperience from "./WorkExperience"
import Education from "./Education"
import Preferences from "./Preferences"
import EditProfileDialog from "./EditProfileDialog"
import { FaPencilAlt, FaPen, } from "react-icons/fa"
import axios from "axios"
import SkillBadge from "./SkillBadge" // Ensure this component exists
import ProgressBar from "./ProgressBar" // Import the ProgressBar component

export default function CandidateProfile() {
  const [activeTab, setActiveTab] = useState("about")
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [activeEditSection, setActiveEditSection] = useState("profile")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [profileExists, setProfileExists] = useState(false)
  const [userInfo, setUserInfo] = useState(null)

  // Default empty profile data
  const defaultProfile = {
    id: null,
    name: "",
    title: "",
    location: "",
    phone: "",
    email: "",
    experience: "",
    gender: "",
    profileImageUrl: null,
    skills: [],
    completionPercentage: 0,
    completionItems: [],
    summary: "",
    workExperience: [],
    education: [],
    preferences: {
      desiredRoles: [],
      jobTypes: [],
      industries: [],
      locations: [],
      salary: "",
      noticePeriod: "",
    },
    certifications: [],
    recommendedJobs: [],
  }

  // Profile data state
  const [profileData, setProfileData] = useState(defaultProfile)
  const [isNewUser, setIsNewUser] = useState(false)

  // Calculate the display percentage based on required fields
  const calculateDisplayPercentage = (profile) => {
    // Check if all required fields are filled
    const hasName = profile.name && profile.name.trim() !== ""
    const hasPhone = profile.phone && profile.phone.trim() !== ""
    const hasWorkExperience = profile.workExperience && profile.workExperience.length > 0
    const hasEducation = profile.education && profile.education.length > 0
    const hasSkills = profile.skills && profile.skills.length > 0
    const hasCertifications = profile.certifications && profile.certifications.length > 0

    // If all required fields are filled, return 100%
    if (hasName && hasPhone && hasWorkExperience && hasEducation && hasSkills && hasCertifications) {
      return 100
    }

    // Otherwise, return the original percentage
    return profile.completionPercentage || 0
  }

  // Fetch user info from localStorage
  useEffect(() => {
    const fetchUserInfo = () => {
      try {
        // Get user email from localStorage
        const userEmail = localStorage.getItem("user")
        const userName = localStorage.getItem("userName")
        const userPhone = localStorage.getItem("userPhone")

        if (!userEmail) {
          setError("User email not found. Please log in again.")
          return null
        }

        return {
          email: userEmail,
          name: userName || "",
          phone: userPhone || "",
        }
      } catch (error) {
        console.error("Error fetching user info:", error)
        return null
      }
    }

    const userInfo = fetchUserInfo()
    setUserInfo(userInfo)
  }, [])

  // Modify the fetchProfile function to ensure we have a user ID
  useEffect(() => {
    if (!userInfo) return

    const fetchProfile = async () => {
      setLoading(true)
      try {
        try {
          // Fetch profile by email
          const response = await axios.get(`http://localhost:8080/api/profile/email/${userInfo.email}`, {
            headers: {
              "Access-Control-Allow-Origin": "*",
            },
          })

          if (response.data) {
            console.log("Profile found:", response.data)
            setProfileData(response.data)
            setProfileExists(true)
            setIsNewUser(false)
          }
        } catch (error) {
          // If profile not found, create a new profile first
          if (error.response && error.response.status === 404) {
            console.log("No profile found for email:", userInfo.email)

            // Create a new profile with the user's email
            try {
              const createResponse = await axios.post(
                `http://localhost:8080/api/profile/create`,
                {
                  email: userInfo.email,
                  name: userInfo.name || "",
                  phone: userInfo.phone || "",
                },
                {
                  headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                  },
                },
              )

              console.log("New profile created:", createResponse.data)

              // Set the newly created profile with ID
              setProfileData(createResponse.data)
              setProfileExists(true)
              setIsNewUser(true)
            } catch (createError) {
              console.error("Error creating new profile:", createError)
              // Set default profile with user info
              const emptyProfile = {
                ...defaultProfile,
                email: userInfo.email,
                name: userInfo.name || "",
                phone: userInfo.phone || "",
              }
              setProfileData(emptyProfile)
              setProfileExists(false)
              setIsNewUser(true)
            }
          } else {
            console.error("Error fetching profile:", error)
            // Set user info in the default profile
            const emptyProfile = {
              ...defaultProfile,
              email: userInfo.email,
              name: userInfo.name || "",
              phone: userInfo.phone || "",
            }
            setProfileData(emptyProfile)
            setProfileExists(false)
            setIsNewUser(true)
          }
        }

        setLoading(false)
      } catch (error) {
        console.error("Error in profile fetch process:", error)
        // Instead of showing error, show empty profile with user info
        setProfileData({
          ...defaultProfile,
          email: userInfo.email,
          name: userInfo.name || "",
          phone: userInfo.phone || "",
        })
        setProfileExists(false)
        setIsNewUser(true)
        setLoading(false)
      }
    }

    fetchProfile()
  }, [userInfo])

  // Open edit dialog
  const openEditDialog = (section) => {
    setActiveEditSection(section)
    setIsEditDialogOpen(true)
  }

  const updateProfileData = async (newData) => {
    try {
      // Make sure we have a valid ID before proceeding
      const userId = profileData.id

      console.log("Updating profile with ID:", userId)
      console.log("Profile data before update:", profileData)
      console.log("New data to merge:", newData)

      async function updateProfile(userId, userInfo, newData, setProfileData, setProfileExists, setIsNewUser) {
        if (!userId) {
          console.error("Cannot update profile: No user ID available");
      
          // If no ID exists, create a new profile first
          try {
            console.log("Creating new profile for email:", userInfo.email);
            const createResponse = await axios.post(
              `http://localhost:8080/api/profile/create`,
              {
                email: userInfo.email,
                name: userInfo.name || "",
                phone: userInfo.phone || "",
                ...newData, // Include the new data in the creation
              },
              {
                headers: {
                  "Content-Type": "application/json",
                  "Access-Control-Allow-Origin": "*",
                },
              }
            );
      
            console.log("New profile created:", createResponse.data);
      
            // Update the state with the newly created profile
            setProfileData(createResponse.data);
            setProfileExists(true);
            setIsNewUser(false);
            return;
          } catch (createError) {
            console.error("Error creating new profile:", createError);
            alert("Failed to create profile. Please try again.");
            return;
          }
        }
      }
      

      // Now update the profile with new data, ensuring ID is included
      const response = await axios.post(
        `http://localhost:8080/api/profile/save`,
        {
          ...profileData,
          ...newData,
          id: userId, // Explicitly include the ID
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        },
      )

      console.log("Profile updated successfully:", response.data)

      setProfileData((prevData) => ({
        ...prevData,
        ...response.data,
      }))

      // After successful update, set isNewUser to false and profileExists to true
      setIsNewUser(false)
      setProfileExists(true)
      
      // Check if all required fields are filled and update the completion percentage on the server
      const updatedProfile = { ...profileData, ...response.data }
      const hasName = updatedProfile.name && updatedProfile.name.trim() !== ""
      const hasPhone = updatedProfile.phone && updatedProfile.phone.trim() !== ""
      const hasWorkExperience = updatedProfile.workExperience && updatedProfile.workExperience.length > 0
      const hasEducation = updatedProfile.education && updatedProfile.education.length > 0
      const hasSkills = updatedProfile.skills && updatedProfile.skills.length > 0
      const hasCertifications = updatedProfile.certifications && updatedProfile.certifications.length > 0

      if (hasName && hasPhone && hasWorkExperience && hasEducation && hasSkills && hasCertifications) {
        try {
          // Update the completion percentage to 100% on the server
          await axios.put(
            `http://localhost:8080/api/profile/${updatedProfile.id}/update-completion`,
            {},
            {
              headers: {
                "Access-Control-Allow-Origin": "*",
              },
            }
          )
          console.log("Completion percentage updated to 100%")
          
          // Update local state to reflect 100% completion
          setProfileData(prev => ({
            ...prev,
            completionPercentage: 100
          }))
        } catch (error) {
          console.error("Error updating completion percentage:", error)
        }
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      alert("Failed to update profile.")
    }
  }

  // Render content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case "about":
        return (
          <div className="card bg-white rounded-lg shadow p-6 relative">
            <button
              onClick={() => openEditDialog("about")}
              className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              aria-label="Edit about section"
            >
              <FaPencilAlt className="w-4 h-4" />
            </button>
            <h2 className="text-xl font-bold mb-4">Professional Summary</h2>
            <p className="text-sm text-gray-600 leading-relaxed">{profileData.summary || ""}</p>
          </div>
        )
      case "experience":
        return (
          <WorkExperience experiences={profileData.workExperience || []} onEdit={() => openEditDialog("experience")} />
        )
      case "education":
        return <Education educationItems={profileData.education || []} onEdit={() => openEditDialog("education")} />
      case "preferences":
        return <Preferences preferences={profileData.preferences || {}} onEdit={() => openEditDialog("preferences")} />
      case "skills":
        return <SkillBadge skills={profileData.skills || []} onEdit={() => openEditDialog("skills")} />
      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-md max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold mb-2">Error Loading Profile</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => (window.location.href = "/signin")}
            className="px-4 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-700"
          >
            Return to Login
          </button>
        </div>
      </div>
    )
  }

  // Calculate the display percentage
  const displayPercentage = calculateDisplayPercentage(profileData)

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8">
        {!profileExists && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  Your profile hasn't been created yet. Please fill in your details and save to create your profile.
                </p>
              </div>
            </div>
          </div>
        )}
        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-1 space-y-6">
            <ProfileSidebar profileData={profileData} onEdit={() => openEditDialog("profile")} isNewUser={isNewUser} />

            {/* Profile Completeness - Using the calculated display percentage */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-3">Profile Completeness</h2>
              <p className="text-sm mb-2">{displayPercentage}% Complete</p>
              <ProgressBar percentage={displayPercentage} />
            </div>

            {/* Key Skills */}
            <div className="bg-white rounded-lg shadow p-6 relative">
              <button
                onClick={() => openEditDialog("skills")}
                className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                aria-label="Edit skills"
              >
                <FaPencilAlt className="w-4 h-4" />
              </button>
              <h2 className="text-lg font-semibold mb-3">Key Skills</h2>
              {profileData.skills && profileData.skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {profileData.skills.map((skill, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic">No skills added yet</p>
              )}
            </div>
          </div>
          <div className="md:col-span-2 space-y-6">
            <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />

            <div className="mt-6">{renderTabContent()}</div>
            <div className="card bg-white rounded-lg shadow mt-6 p-6 relative">
              <button
                onClick={() => openEditDialog("certifications")}
                className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                aria-label="Edit certifications"
              >
                <FaPencilAlt className="w-4 h-4" />
              </button>
              <h2 className="text-xl font-bold mb-4">Certifications & Achievements</h2>
              <div className="space-y-4">
                {profileData?.certifications?.length > 0 ? (
                  profileData.certifications.map((cert, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="mt-0.5 text-blue-800">
                        <FaPen className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium">{cert.title}</h3>
                        <p className="text-xs text-gray-500 mt-1">
                          {cert.issuer} • {cert.year}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 italic">No certifications added yet</p>
                )}
              </div>
            </div>
            {/* Recommended Jobs Section */}
            <div className="card bg-white rounded-lg shadow mt-6 p-6">
              <h2 className="text-xl font-bold mb-4">Recommended Jobs</h2>
              <div className="space-y-4">
                {profileData?.recommendedJobs?.length > 0 ? (
                  profileData.recommendedJobs.map((job, index) => (
                    <div
                      key={index}
                      className="border rounded-lg p-4 hover:bg-slate-50 cursor-pointer transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{job.title}</h3>
                          <p className="text-sm text-gray-500 mt-1">
                            {job.company} • {job.location}
                          </p>
                        </div>
                        <div className="text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs font-medium">
                          {job.match}% Match
                        </div>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">{job.salary}</span>
                        <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">{job.type}</span>
                        <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                          {job.employment}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 italic">No recommended jobs yet</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {isEditDialogOpen && (
        <EditProfileDialog
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          activeSection={activeEditSection}
          profileData={profileData}
          updateProfileData={updateProfileData}
          isNewUser={isNewUser}
        />
      )}
    </div>
  )
}

