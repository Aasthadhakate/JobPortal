"use client"

import { useState, useEffect } from "react"
import { RxCross2 } from "react-icons/rx"
import { FaTimes } from "react-icons/fa"
import { FiPlus } from "react-icons/fi"
import { FiCheckCircle } from "react-icons/fi"
import { FiTrash } from "react-icons/fi"
import { FiX } from "react-icons/fi"
import { FiLoader } from "react-icons/fi"
import axios from "axios"

// Update the uploadProfileImage function to handle undefined userId
const uploadProfileImage = async (userId, file) => {
  if (!file) return null

  console.log("Uploading profile image for user:", userId)

  if (!userId) {
    console.error("Cannot upload profile image: User ID is undefined")
    return null
  }

  // Check file size again before upload
  if (file.size > 1024 * 1024) {
    console.error("Image file is too large")
    alert("Image file is too large. Please select an image smaller than 1MB.")
    return null
  }

  const formData = new FormData()
  formData.append("file", file)

  try {
    const response = await axios.post(`http://localhost:8080/api/profile/${userId}/uploadImage`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "Access-Control-Allow-Origin": "*",
      },
    })
    console.log("Profile image uploaded successfully:", response.data)
    return response.data // This should just be the filename
  } catch (error) {
    console.error("Error uploading profile image:", error)
    alert("Failed to upload profile image.")
    return null
  }
}

// Update the uploadResume function to handle undefined userId
const uploadResume = async (userId, file) => {
  if (!file) return null

  console.log("Uploading resume for user:", userId)

  if (!userId) {
    console.error("Cannot upload resume: User ID is undefined")
    return null
  }

  const formData = new FormData()
  formData.append("file", file)

  try {
    const response = await axios.post(`http://localhost:8080/api/profile/${userId}/uploadResume`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "Access-Control-Allow-Origin": "*",
      },
    })
    console.log("Resume uploaded successfully:", response.data)
    return response.data
  } catch (error) {
    console.error("Error uploading resume:", error)
    alert("Failed to upload resume.")
    return null
  }
}

export default function EditProfileDialog({ isOpen, onClose, activeSection, profileData, updateProfileData }) {
  console.log("ProfileData received:", profileData)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState(activeSection)
  const [formData, setFormData] = useState({
    name: profileData.name || "",
    title: profileData.title || "",
    location: profileData.location || "",
    phone: profileData.phone || "",
    email: profileData.email || "",
    experience: profileData.experience || "",
    gender: profileData.gender || "",
    linkedinUrl: profileData.linkedinUrl || "", // Add LinkedIn URL field
    githubUrl: profileData.githubUrl || "", // Add GitHub URL field
    profileImage: null,
    profileImagePreview: profileData.profileImageUrl || "",
    resumeFile: null,
    resumeFileName: profileData.resumeUrl || "",
    summary: profileData.summary || "",
    workExperience: Array.isArray(profileData.workExperience) ? [...profileData.workExperience] : [],
    education: Array.isArray(profileData.education) ? [...profileData.education] : [],
    preferences: profileData.preferences
      ? { ...profileData.preferences }
      : {
          desiredRoles: [],
          jobTypes: [],
          industries: [],
          locations: [],
          salary: "",
          noticePeriod: "",
        },
    certifications: Array.isArray(profileData.certifications) ? [...profileData.certifications] : [],
    skills: Array.isArray(profileData.skills) ? [...profileData.skills] : [],
  })

  // Initialize empty arrays for preferences when adding new items
  useEffect(() => {
    // Ensure all arrays exist in preferences
    const updatedPreferences = { ...formData.preferences }
    if (!updatedPreferences.desiredRoles) updatedPreferences.desiredRoles = []
    if (!updatedPreferences.jobTypes) updatedPreferences.jobTypes = []
    if (!updatedPreferences.industries) updatedPreferences.industries = []
    if (!updatedPreferences.locations) updatedPreferences.locations = []

    setFormData((prev) => ({
      ...prev,
      preferences: updatedPreferences,
    }))
  }, [])

  useEffect(() => {
    console.log("Active section changed:", activeSection)
    setActiveTab(activeSection)
  }, [activeSection])

  useEffect(() => {
    if (isOpen) {
      console.log("Dialog opened, resetting form data")
      setFormData({
        name: profileData.name || "",
        title: profileData.title || "",
        location: profileData.location || "",
        phone: profileData.phone || "",
        email: profileData.email || "",
        experience: profileData.experience || "",
        gender: profileData.gender || "",
        linkedinUrl: profileData.linkedinUrl || "", // Add LinkedIn URL field
        githubUrl: profileData.githubUrl || "", // Add GitHub URL field
        profileImage: null,
        profileImagePreview: profileData.profileImageUrl || "",
        resumeFile: null,
        resumeFileName: profileData.resumeUrl || "",
        summary: profileData.summary || "",
        workExperience: Array.isArray(profileData.workExperience) ? [...profileData.workExperience] : [],
        education: Array.isArray(profileData.education) ? [...profileData.education] : [],
        preferences: profileData.preferences
          ? { ...profileData.preferences }
          : {
              desiredRoles: [],
              jobTypes: [],
              industries: [],
              locations: [],
              salary: "",
              noticePeriod: "",
            },
        certifications: Array.isArray(profileData.certifications) ? [...profileData.certifications] : [],
        skills: Array.isArray(profileData.skills) ? [...profileData.skills] : [],
      })
    }
  }, [isOpen, profileData])

  // Improved handleSubmit function with better data validation and error handling
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Get the user ID from profileData - check all possible property names
      const userId = profileData?.id || profileData?.userId || profileData?.userid

      // Debug the user ID
      console.log("User ID for submission:", userId)
      console.log("Full profile data:", profileData)

      if (!userId) {
        console.error("Error: User ID is undefined or null")

        // If we don't have a user ID, we need to create a new profile
        // We'll pass all the form data to the parent component's updateProfileData function
        // which will handle creating a new profile
        updateProfileData({
          name: formData.name,
          title: formData.title,
          location: formData.location,
          phone: formData.phone,
          email: formData.email,
          experience: formData.experience,
          gender: formData.gender,
          linkedinUrl: formData.linkedinUrl, // Include LinkedIn URL
          githubUrl: formData.githubUrl, // Include GitHub URL
          summary: formData.summary,
          // Don't include profile image or resume yet - they'll be uploaded after profile creation
          workExperience: formData.workExperience,
          education: formData.education,
          preferences: formData.preferences,
          certifications: formData.certifications,
          skills: formData.skills,
        })

        setIsLoading(false)
        onClose()
        return
      }

      // Upload profile image if selected
      let updatedProfileImageUrl = formData.profileImagePreview
      if (formData.profileImage) {
        updatedProfileImageUrl = await uploadProfileImage(userId, formData.profileImage)
      }

      // Upload resume if selected
      let updatedResumeUrl = formData.resumeFileName
      if (formData.resumeFile) {
        const resumeResponse = await uploadResume(userId, formData.resumeFile)
        if (resumeResponse) {
          updatedResumeUrl = resumeResponse
          console.log("Updated resume URL:", updatedResumeUrl)
        }
      }

      // Process work experience - ensure each item has proper structure
      const formattedWorkExperience = formData.workExperience.map((exp) => {
        // Ensure each experience has an ID
        const expId = exp.id || Date.now() + Math.random()

        // Ensure responsibilities is an array
        const responsibilities = Array.isArray(exp.responsibilities)
          ? exp.responsibilities
          : exp.responsibilities
            ? [exp.responsibilities]
            : []

        return {
          id: expId,
          title: exp.title || "",
          company: exp.company || "",
          period: exp.period || "",
          responsibilities: responsibilities,
        }
      })

      // Process education - ensure each item has proper structure
      const formattedEducation = formData.education.map((edu) => {
        return {
          id: edu.id || Date.now() + Math.random(),
          degree: edu.degree || "",
          institution: edu.institution || "",
          period: edu.period || "",
          description: edu.description || "",
        }
      })

      // Process certifications - ensure each item has proper structure
      const formattedCertifications = formData.certifications.map((cert) => {
        return {
          id: cert.id || Date.now() + Math.random(),
          title: cert.title || "",
          issuer: cert.issuer || "",
          year: cert.year || "",
        }
      })

      // Initialize preferences if it's null or undefined
      const preferences = formData.preferences || {}

      // Ensure all array properties in preferences exist
      if (!preferences.desiredRoles) preferences.desiredRoles = []
      if (!preferences.jobTypes) preferences.jobTypes = []
      if (!preferences.industries) preferences.industries = []
      if (!preferences.locations) preferences.locations = []

      // Prepare data to send to backend
      const dataToUpdate = {
        id: userId,
        userid: userId, // Include as userid too for compatibility
        name: formData.name,
        title: formData.title,
        location: formData.location,
        phone: formData.phone,
        email: formData.email,
        experience: formData.experience,
        gender: formData.gender,
        linkedinUrl: formData.linkedinUrl, // Include LinkedIn URL
        githubUrl: formData.githubUrl, // Include GitHub URL
        summary: formData.summary,
        profileImageUrl: updatedProfileImageUrl,
        resumeUrl: updatedResumeUrl,
        workExperience: formattedWorkExperience,
        education: formattedEducation,
        preferences: preferences,
        certifications: formattedCertifications,
        skills: Array.isArray(formData.skills) ? formData.skills : [],
      }

      // Debugging: Check the final data being sent to the API
      console.log("Data to update:", JSON.stringify(dataToUpdate, null, 2))

      // Send updated profile data to backend
      const response = await axios.post(`http://localhost:8080/api/profile/save`, dataToUpdate, {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      })

      // Debugging: Check API response
      console.log("API Response:", response.data)

      updateProfileData(response.data) // Update state in parent component
      alert("Profile updated successfully!")

      onClose()
    } catch (error) {
      console.error("Error updating profile:", error)

      if (error.response) {
        console.log("Response Data:", error.response.data)
        console.log("Response Status:", error.response.status)
        console.log("Response Headers:", error.response.headers)

        // More detailed error message
        alert(
          `Failed to update profile. Server error: ${error.response.status} - ${error.response.data?.message || "Unknown error"}`,
        )
      } else if (error.request) {
        console.log("No response received:", error.request)
        alert("Failed to update profile. No response from server. Please check your connection.")
      } else {
        console.log("Error message:", error.message)
        alert(`Failed to update profile. Error: ${error.message}`)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    console.log(`Input changed: ${name} =`, value)
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Check file size - limit to 1MB
      if (file.size > 1024 * 1024) {
        alert("Image file is too large. Please select an image smaller than 1MB.")
        return
      }

      console.log("Profile image selected:", file.name)
      setFormData((prev) => ({ ...prev, profileImage: file }))

      // Only store the file name in the preview, not the full data URL
      setFormData((prev) => ({
        ...prev,
        profileImagePreview: file.name, // Just store the filename
      }))
    }
  }

  const handleResumeChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      console.log("Resume file selected:", file.name)
      setFormData((prev) => ({
        ...prev,
        resumeFile: file,
        // Store the file name for display
        resumeFileName: file.name,
      }))
    }
  }

  // Handle experience form changes
  const handleExperienceChange = (index, field, value) => {
    const updatedExperience = [...formData.workExperience]
    updatedExperience[index] = {
      ...updatedExperience[index],
      [field]: value,
    }
    setFormData((prev) => ({
      ...prev,
      workExperience: updatedExperience,
    }))
  }

  // Handle responsibility changes
  const handleResponsibilityChange = (expIndex, respIndex, value) => {
    const updatedExperience = [...formData.workExperience]
    if (!updatedExperience[expIndex].responsibilities) {
      updatedExperience[expIndex].responsibilities = []
    }
    updatedExperience[expIndex].responsibilities[respIndex] = value
    setFormData((prev) => ({
      ...prev,
      workExperience: updatedExperience,
    }))
  }

  // Add new responsibility
  const addResponsibility = (expIndex) => {
    const updatedExperience = [...formData.workExperience]
    if (!updatedExperience[expIndex].responsibilities) {
      updatedExperience[expIndex].responsibilities = []
    }
    updatedExperience[expIndex].responsibilities.push("")
    setFormData((prev) => ({
      ...prev,
      workExperience: updatedExperience,
    }))
  }

  // Remove responsibility
  const removeResponsibility = (expIndex, respIndex) => {
    const updatedExperience = [...formData.workExperience]
    if (!updatedExperience[expIndex].responsibilities) {
      updatedExperience[expIndex].responsibilities = []
      return
    }
    updatedExperience[expIndex].responsibilities.splice(respIndex, 1)
    setFormData((prev) => ({
      ...prev,
      workExperience: updatedExperience,
    }))
  }

  // Add new experience
  const addExperience = () => {
    const newExperience = {
      id: Date.now(), // Use timestamp as temporary ID
      title: "",
      company: "",
      period: "",
      responsibilities: [""],
    }

    setFormData((prev) => {
      // Ensure workExperience is an array
      const currentExperience = Array.isArray(prev.workExperience) ? prev.workExperience : []

      return {
        ...prev,
        workExperience: [...currentExperience, newExperience],
      }
    })
  }

  // Remove experience
  const removeExperience = (index) => {
    const updatedExperience = [...formData.workExperience]
    updatedExperience.splice(index, 1)
    setFormData((prev) => ({
      ...prev,
      workExperience: updatedExperience,
    }))
  }

  // Handle education form changes
  const handleEducationChange = (index, field, value) => {
    const updatedEducation = [...formData.education]
    updatedEducation[index] = {
      ...updatedEducation[index],
      [field]: value,
    }
    setFormData((prev) => ({
      ...prev,
      education: updatedEducation,
    }))
  }

  // Add new education
  const addEducation = () => {
    const newEducation = {
      id: Date.now(), // Use timestamp as temporary ID
      degree: "",
      institution: "",
      period: "",
      description: "",
    }

    setFormData((prev) => {
      // Ensure education is an array
      const currentEducation = Array.isArray(prev.education) ? prev.education : []

      return {
        ...prev,
        education: [...currentEducation, newEducation],
      }
    })
  }

  // Remove education
  const removeEducation = (index) => {
    const updatedEducation = [...formData.education]
    updatedEducation.splice(index, 1)
    setFormData((prev) => ({
      ...prev,
      education: updatedEducation,
    }))
  }

  // Handle preferences changes
  const handlePreferenceChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [field]: value,
      },
    }))
  }

  // Handle array preferences (like desiredRoles)
  const handleArrayPreferenceChange = (field, index, value) => {
    // Make sure the preferences object and the field array exist
    const preferences = formData.preferences || {}
    if (!preferences[field]) {
      preferences[field] = []
    }

    const updatedArray = [...preferences[field]]
    updatedArray[index] = value

    setFormData((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [field]: updatedArray,
      },
    }))
  }

  // Add item to array preference
  const addArrayPreferenceItem = (field) => {
    setFormData((prev) => {
      // Create a copy of the current preferences or initialize it
      const preferences = prev.preferences || {}

      // Create a copy of the field array or initialize it
      const fieldArray = Array.isArray(preferences[field]) ? [...preferences[field]] : []

      // Add the new empty item
      fieldArray.push("")

      // Return the updated state
      return {
        ...prev,
        preferences: {
          ...preferences,
          [field]: fieldArray,
        },
      }
    })
  }

  // Remove item from array preference
  const removeArrayPreferenceItem = (field, index) => {
    // Make sure the preferences object and the field array exist
    const preferences = formData.preferences || {}
    if (!preferences[field]) {
      preferences[field] = []
      return
    }

    const updatedArray = [...preferences[field]]
    updatedArray.splice(index, 1)

    setFormData((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [field]: updatedArray,
      },
    }))
  }

  // Handle certification changes
  const handleCertificationChange = (index, field, value) => {
    const updatedCertifications = [...formData.certifications]
    updatedCertifications[index] = {
      ...updatedCertifications[index],
      [field]: value,
    }
    setFormData((prev) => ({
      ...prev,
      certifications: updatedCertifications,
    }))
  }

  // Add new certification
  const addCertification = () => {
    const newCertification = {
      id: Date.now(), // Use timestamp as temporary ID
      title: "",
      issuer: "",
      year: "",
    }

    setFormData((prev) => {
      // Ensure certifications is an array
      const currentCertifications = Array.isArray(prev.certifications) ? prev.certifications : []

      return {
        ...prev,
        certifications: [...currentCertifications, newCertification],
      }
    })
  }

  // Remove certification
  const removeCertification = (index) => {
    const updatedCertifications = [...formData.certifications]
    updatedCertifications.splice(index, 1)
    setFormData((prev) => ({
      ...prev,
      certifications: updatedCertifications,
    }))
  }

  // Handle skills changes
  const handleSkillChange = (index, value) => {
    const updatedSkills = [...formData.skills]
    updatedSkills[index] = value
    setFormData((prev) => ({
      ...prev,
      skills: updatedSkills,
    }))
  }

  // Add new skill
  const addSkill = () => {
    setFormData((prev) => ({
      ...prev,
      skills: [...prev.skills, ""],
    }))
  }

  // Remove skill
  const removeSkill = (index) => {
    const updatedSkills = [...formData.skills]
    updatedSkills.splice(index, 1)
    setFormData((prev) => ({
      ...prev,
      skills: updatedSkills,
    }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Edit Profile</h2>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
              <FaTimes size={20} />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Tabs */}
          <div className="border-b mb-6">
            <div className="flex flex-wrap -mb-px">
              <button
                className={`mr-2 py-2 px-4 text-sm font-medium ${
                  activeTab === "profile"
                    ? "border-b-2 border-blue-600 text-blue-800"
                    : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                onClick={() => setActiveTab("profile")}
              >
                Profile
              </button>
              <button
                className={`mr-2 py-2 px-4 text-sm font-medium ${
                  activeTab === "about"
                    ? "border-b-2 border-blue-600 text-blue-800"
                    : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                onClick={() => setActiveTab("about")}
              >
                About
              </button>
              <button
                className={`mr-2 py-2 px-4 text-sm font-medium ${
                  activeTab === "experience"
                    ? "border-b-2 border-blue-600 text-blue-800"
                    : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                onClick={() => setActiveTab("experience")}
              >
                Experience
              </button>
              <button
                className={`mr-2 py-2 px-4 text-sm font-medium ${
                  activeTab === "education"
                    ? "border-b-2 border-blue-600 text-blue-800"
                    : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                onClick={() => setActiveTab("education")}
              >
                Education
              </button>
              <button
                className={`mr-2 py-2 px-4 text-sm font-medium ${
                  activeTab === "skills"
                    ? "border-b-2 border-blue-600 text-blue-800"
                    : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                onClick={() => setActiveTab("skills")}
              >
                Skills
              </button>
              <button
                className={`mr-2 py-2 px-4 text-sm font-medium ${
                  activeTab === "preferences"
                    ? "border-b-2 border-blue-600 text-blue-800"
                    : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                onClick={() => setActiveTab("preferences")}
              >
                Preferences
              </button>
              <button
                className={`mr-2 py-2 px-4 text-sm font-medium ${
                  activeTab === "certifications"
                    ? "border-b-2 border-blue-600 text-blue-800"
                    : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                onClick={() => setActiveTab("certifications")}
              >
                Certifications
              </button>
            </div>
          </div>
          <form onSubmit={handleSubmit}>
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="space-y-6">
                {/* Profile Image Upload */}
                <div className="space-y-2">
                  <label htmlFor="profileImage" className="block text-sm font-medium text-gray-700">
                    Profile Image
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="h-20 w-20 rounded-full bg-gray-200 overflow-hidden relative">
                      {formData.profileImagePreview ? (
                        <img
                          src={formData.profileImagePreview || "/placeholder.svg"}
                          alt="Profile preview"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-gray-700 text-xl font-medium">
                          {(formData.name ?? "")
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <input
                        id="profileImage"
                        type="file"
                        accept="image/*"
                        onChange={handleProfileImageChange}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-800 hover:file:bg-blue-100 cursor-pointer"
                      />
                      <p className="text-xs text-gray-500 mt-1">Recommended: Square image, at least 300x300px</p>
                    </div>
                    {formData.profileImagePreview && (
                      <button
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            profileImage: null,
                            profileImagePreview: null,
                          }))
                        }
                        className="p-1 rounded-full bg-gray-200 hover:bg-gray-300"
                      >
                        <RxCross2 className="w-4 h-4 text-gray-700" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Basic Information */}
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                    />
                  </div>

                  {/* Add gender field */}
                  <div>
                    <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                      Gender
                    </label>
                    <select
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm p-2 border"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Non-binary">Non-binary</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                      Job Title
                    </label>
                    <input
                      id="title"
                      name="title"
                      type="text"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                    />
                  </div>
                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                      Location
                    </label>
                    <input
                      id="location"
                      name="location"
                      type="text"
                      value={formData.location}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="text"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email Address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                    />
                  </div>
                  <div>
                    <label htmlFor="experience" className="block text-sm font-medium text-gray-700">
                      Professional Experience
                    </label>
                    <input
                      id="experience"
                      name="experience"
                      type="text"
                      value={formData.experience}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                    />
                  </div>
                  {/* LinkedIn URL field */}
                  <div>
                    <label htmlFor="linkedinUrl" className="block text-sm font-medium text-gray-700">
                      LinkedIn URL (optional)
                    </label>
                    <input
                      id="linkedinUrl"
                      name="linkedinUrl"
                      type="url"
                      value={formData.linkedinUrl}
                      onChange={handleInputChange}
                      placeholder="https://linkedin.com/in/yourprofile"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                    />
                  </div>
                  {/* GitHub URL field */}
                  <div>
                    <label htmlFor="githubUrl" className="block text-sm font-medium text-gray-700">
                      GitHub URL (optional)
                    </label>
                    <input
                      id="githubUrl"
                      name="githubUrl"
                      type="url"
                      value={formData.githubUrl}
                      onChange={handleInputChange}
                      placeholder="https://github.com/yourusername"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                    />
                  </div>
                </div>
                {/* Resume Upload */}
                <div className="space-y-2">
                  <label htmlFor="resume" className="block text-sm font-medium text-gray-700">
                    Resume
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      id="resume"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleResumeChange}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-800 hover:file:bg-blue-100 cursor-pointer"
                    />
                    {formData.resumeFile && (
                      <button
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, resumeFile: null }))}
                        className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 flex-shrink-0"
                      >
                        <RxCross2 className="w-4 h-4 text-gray-700" />
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">Accepted formats: PDF, DOC, DOCX (Max 5MB)</p>
                  {formData.resumeFile && (
                    <p className="text-sm text-green-600 flex items-center gap-1">
                      <FiCheckCircle className="w-4 h-4" />
                      {formData.resumeFile.name}
                    </p>
                  )}
                  {!formData.resumeFile && formData.resumeFileName && (
                    <p className="text-sm text-blue-600 flex items-center gap-1">
                      <FiCheckCircle className="w-4 h-4" />
                      Current resume: {formData.resumeFileName}
                    </p>
                  )}
                </div>
              </div>
            )}
            {/* About Tab */}
            {activeTab === "about" && (
              <div className="space-y-6">
                <div>
                  <label htmlFor="summary" className="block text-sm font-medium text-gray-700">
                    Professional Summary
                  </label>
                  <textarea
                    id="summary"
                    name="summary"
                    value={formData.summary}
                    onChange={handleInputChange}
                    rows={8}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Provide a concise overview of your professional background, skills, and career goals.
                  </p>
                </div>
              </div>
            )}
            {/* Skills Tab */}
            {activeTab === "skills" && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Key Skills</label>
                  <p className="text-xs text-gray-500 mb-2">
                    Add skills that showcase your expertise and make you stand out to employers.
                  </p>
                  <div className="space-y-2">
                    {formData.skills.map((skill, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          value={skill}
                          onChange={(e) => handleSkillChange(index, e.target.value)}
                          placeholder="Add skill (e.g., JavaScript, Project Management)"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                        />
                        <button
                          type="button"
                          onClick={() => removeSkill(index)}
                          className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500"
                          aria-label="Remove skill"
                        >
                          <FiX className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    className="mt-3 inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                    onClick={addSkill}
                  >
                    <FiPlus className="w-4 h-4 mr-1 text-gray-600" />
                    Add Skill
                  </button>
                </div>
                <div className="bg-blue-50 p-4 rounded-md">
                  <h3 className="text-sm font-medium text-blue-800 mb-2">Skills Preview</h3>
                  <div className="flex flex-wrap gap-2">
                    {formData.skills
                      .filter((skill) => skill.trim() !== "")
                      .map((skill, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {skill}
                        </span>
                      ))}
                    {formData.skills.filter((skill) => skill.trim() !== "").length === 0 && (
                      <p className="text-sm text-gray-500 italic">No skills added yet</p>
                    )}
                  </div>
                </div>
              </div>
            )}
            {/* Experience Tab */}
            {activeTab === "experience" && (
              <div className="space-y-6">
                {formData.workExperience.map((exp, index) => (
                  <div key={exp.id || index} className="border rounded-lg p-4 space-y-4 relative">
                    <button
                      type="button"
                      onClick={() => removeExperience(index)}
                      className="absolute top-2 right-2 p-1 rounded-full bg-red-50 hover:bg-red-100 text-red-500"
                      aria-label="Remove experience"
                    >
                      <FiTrash className="w-4 h-4" />
                    </button>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label htmlFor={`exp-title-${index}`} className="block text-sm font-medium text-gray-700">
                          Job Title
                        </label>
                        <input
                          id={`exp-title-${index}`}
                          value={exp.title || ""}
                          onChange={(e) => handleExperienceChange(index, "title", e.target.value)}
                          required
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                        />
                      </div>
                      <div>
                        <label htmlFor={`exp-company-${index}`} className="block text-sm font-medium text-gray-700">
                          Company
                        </label>
                        <input
                          id={`exp-company-${index}`}
                          value={exp.company || ""}
                          onChange={(e) => handleExperienceChange(index, "company", e.target.value)}
                          required
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor={`exp-period-${index}`} className="block text-sm font-medium text-gray-700">
                        Period
                      </label>
                      <input
                        id={`exp-period-${index}`}
                        value={exp.period || ""}
                        onChange={(e) => handleExperienceChange(index, "period", e.target.value)}
                        placeholder="e.g., Jan 2020 - Present"
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Responsibilities</label>
                      {(exp.responsibilities || []).map((resp, respIndex) => (
                        <div key={respIndex} className="flex items-center gap-2 mt-2">
                          <input
                            value={resp || ""}
                            onChange={(e) => handleResponsibilityChange(index, respIndex, e.target.value)}
                            placeholder="Add responsibility"
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                          />
                          <button
                            type="button"
                            onClick={() => removeResponsibility(index, respIndex)}
                            className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500"
                            disabled={(exp.responsibilities || []).length <= 1}
                            aria-label="Remove responsibility"
                          >
                            <RxCross2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        className="mt-2 inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                        onClick={() => addResponsibility(index)}
                      >
                        <FiPlus className="w-4 h-4 mr-1" />
                        Add Responsibility
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                  onClick={addExperience}
                >
                  <FiPlus className="w-4 h-4 mr-1" />
                  Add Work Experience
                </button>
              </div>
            )}
            {/* Education Tab */}
            {activeTab === "education" && (
              <div className="space-y-6">
                {formData.education.map((edu, index) => (
                  <div key={edu.id || index} className="border rounded-lg p-4 space-y-4 relative">
                    <button
                      type="button"
                      onClick={() => removeEducation(index)}
                      className="absolute top-2 right-2 p-1 rounded-full bg-red-50 hover:bg-red-100 text-red-500"
                      aria-label="Remove education"
                    >
                      <FiTrash className="w-4 h-4 text-red-500" />
                    </button>
                    <div>
                      <label htmlFor={`edu-degree-${index}`} className="block text-sm font-medium text-gray-700">
                        Degree
                      </label>
                      <input
                        id={`edu-degree-${index}`}
                        value={edu.degree || ""}
                        onChange={(e) => handleEducationChange(index, "degree", e.target.value)}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                      />
                    </div>
                    <div>
                      <label htmlFor={`edu-institution-${index}`} className="block text-sm font-medium text-gray-700">
                        Institution
                      </label>
                      <input
                        id={`edu-institution-${index}`}
                        value={edu.institution || ""}
                        onChange={(e) => handleEducationChange(index, "institution", e.target.value)}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                      />
                    </div>
                    <div>
                      <label htmlFor={`edu-period-${index}`} className="block text-sm font-medium text-gray-700">
                        Period
                      </label>
                      <input
                        id={`edu-period-${index}`}
                        value={edu.period || ""}
                        onChange={(e) => handleEducationChange(index, "period", e.target.value)}
                        placeholder="e.g., 2015 - 2019"
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                      />
                    </div>
                    <div>
                      <label htmlFor={`edu-description-${index}`} className="block text-sm font-medium text-gray-700">
                        Description
                      </label>
                      <textarea
                        id={`edu-description-${index}`}
                        value={edu.description || ""}
                        onChange={(e) => handleEducationChange(index, "description", e.target.value)}
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                      />
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                  onClick={addEducation}
                >
                  <FiPlus className="w-4 h-4 mr-1 text-gray-600" />
                  Add Education
                </button>
              </div>
            )}
            {/* Preferences Tab */}
            {activeTab === "preferences" && (
              <div className="space-y-6">
                {/* Desired Roles */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Desired Roles</label>
                  {(formData.preferences?.desiredRoles || []).map((role, index) => (
                    <div key={index} className="flex items-center gap-2 mt-2">
                      <input
                        value={role || ""}
                        onChange={(e) => handleArrayPreferenceChange("desiredRoles", index, e.target.value)}
                        placeholder="Add role"
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                      />
                      <button
                        type="button"
                        onClick={() => removeArrayPreferenceItem("desiredRoles", index)}
                        className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500"
                        disabled={(formData.preferences?.desiredRoles || []).length <= 1}
                        aria-label="Remove role"
                      >
                        <FiX className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="mt-2 inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                    onClick={() => addArrayPreferenceItem("desiredRoles")}
                  >
                    <FiPlus className="w-4 h-4 text-gray-600 mr-1" />
                    Add Role
                  </button>
                </div>
                {/* Job Types */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Job Types</label>
                  {(formData.preferences?.jobTypes || []).map((type, index) => (
                    <div key={index} className="flex items-center gap-2 mt-2">
                      <input
                        value={type || ""}
                        onChange={(e) => handleArrayPreferenceChange("jobTypes", index, e.target.value)}
                        placeholder="Add job type"
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                      />
                      <button
                        type="button"
                        onClick={() => removeArrayPreferenceItem("jobTypes", index)}
                        className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500"
                        disabled={(formData.preferences?.jobTypes || []).length <= 1}
                        aria-label="Remove job type"
                      >
                        <FiX className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="mt-2 inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                    onClick={() => addArrayPreferenceItem("jobTypes")}
                  >
                    <FiPlus className="w-4 h-4 text-gray-600" />
                    Add Job Type
                  </button>
                </div>
                {/* Industries */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Industry Preferences</label>
                  {(formData.preferences?.industries || []).map((industry, index) => (
                    <div key={index} className="flex items-center gap-2 mt-2">
                      <input
                        value={industry || ""}
                        onChange={(e) => handleArrayPreferenceChange("industries", index, e.target.value)}
                        placeholder="Add industry"
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                      />
                      <button
                        type="button"
                        onClick={() => removeArrayPreferenceItem("industries", index)}
                        className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500"
                        disabled={(formData.preferences?.industries || []).length <= 1}
                        aria-label="Remove industry"
                      >
                        <FiX className="w-4 h-4 text-gray-600 cursor-pointer" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="mt-2 inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                    onClick={() => addArrayPreferenceItem("industries")}
                  >
                    <FiPlus className="w-4 h-4 text-gray-600" />
                    Add Industry
                  </button>
                </div>
                {/* Salary */}
                <div>
                  <label htmlFor="salary" className="block text-sm font-medium text-gray-700">
                    Expected Salary
                  </label>
                  <input
                    id="salary"
                    value={formData.preferences?.salary || ""}
                    onChange={(e) => handlePreferenceChange("salary", e.target.value)}
                    placeholder="e.g., $120,000 - $150,000 per year"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                  />
                </div>
                {/* Locations */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Preferred Locations</label>
                  {(formData.preferences?.locations || []).map((location, index) => (
                    <div key={index} className="flex items-center gap-2 mt-2">
                      <input
                        value={location || ""}
                        onChange={(e) => handleArrayPreferenceChange("locations", index, e.target.value)}
                        placeholder="Add location"
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                      />
                      <button
                        type="button"
                        onClick={() => removeArrayPreferenceItem("locations", index)}
                        className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500"
                        disabled={(formData.preferences?.locations || []).length <= 1}
                        aria-label="Remove location"
                      >
                        <FiX className="w-4 h-4 text-gray-600 cursor-pointer" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="mt-2 inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                    onClick={() => addArrayPreferenceItem("locations")}
                  >
                    <FiPlus className="w-4 h-4 text-gray-600" />
                    Add Location
                  </button>
                </div>
                {/* Notice Period */}
                <div>
                  <label htmlFor="noticePeriod" className="block text-sm font-medium text-gray-700">
                    Notice Period
                  </label>
                  <input
                    id="noticePeriod"
                    value={formData.preferences?.noticePeriod || ""}
                    onChange={(e) => handlePreferenceChange("noticePeriod", e.target.value)}
                    placeholder="e.g., 2 weeks"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                  />
                </div>
              </div>
            )}
            {/* Certifications Tab */}
            {activeTab === "certifications" && (
              <div className="space-y-6">
                {formData.certifications.map((cert, index) => (
                  <div key={cert.id || index} className="border rounded-lg p-4 space-y-4 relative">
                    <button
                      type="button"
                      onClick={() => removeCertification(index)}
                      className="absolute top-2 right-2 p-1 rounded-full bg-red-50 hover:bg-red-100 text-red-500"
                      aria-label="Remove certification"
                    >
                      <FiTrash className="w-4 h-4 text-red-500 cursor-pointer hover:text-red-700" />
                    </button>
                    <div>
                      <label htmlFor={`cert-title-${index}`} className="block text-sm font-medium text-gray-700">
                        Certification Title
                      </label>
                      <input
                        id={`cert-title-${index}`}
                        value={cert.title || ""}
                        onChange={(e) => handleCertificationChange(index, "title", e.target.value)}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                      />
                    </div>
                    <div>
                      <label htmlFor={`cert-issuer-${index}`} className="block text-sm font-medium text-gray-700">
                        {" "}
                        Issuing Organization
                      </label>
                      <input
                        id={`cert-issuer-${index}`}
                        value={cert.issuer || ""}
                        onChange={(e) => handleCertificationChange(index, "issuer", e.target.value)}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                      />
                    </div>
                    <div>
                      <label htmlFor={`cert-year-${index}`} className="block text-sm font-medium text-gray-700">
                        Year
                      </label>
                      <input
                        id={`cert-year-${index}`}
                        value={cert.year || ""}
                        onChange={(e) => handleCertificationChange(index, "year", e.target.value)}
                        placeholder="e.g., 2021"
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                      />
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                  onClick={addCertification}
                >
                  <FiPlus className="w-4 h-4 mr-1" />
                  Add Certification
                </button>
              </div>
            )}
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-800 hover:bg-blue-800 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <FiLoader className="animate-spin w-6 h-6 text-blue-500" />
                    Saving...
                  </span>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
