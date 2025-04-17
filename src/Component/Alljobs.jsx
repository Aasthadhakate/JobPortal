import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  Briefcase,
  MapPin,
  DollarSign,
  Clock,
  Edit,
  Trash2,
  Building,
  RefreshCw,
  Plus,
  Search,
  Users,
  ExternalLink,
  Share2,
} from "lucide-react"

const AllJobs = () => {
  const [jobs, setJobs] = useState([])
  const [searchRole, setSearchRole] = useState("")
  const [searchLocation, setSearchLocation] = useState("")
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const navigate = useNavigate()

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    setRefreshing(true);
    try {
      const response = await fetch("http://localhost:8080/api/jobs");
  
      console.log("Raw response status:", response.status);
      const text = await response.text();
      console.log("Raw response text:", text);
  
      let data;
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        console.error("Failed to parse JSON:", parseError);
        setJobs([]);
        return;
      }
  
      if (Array.isArray(data)) {
        setJobs(data);
      } else {
        console.error("Invalid jobs data:", data);
        setJobs([]);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setJobs([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };  

  const handleEditJob = (jobId, e) => {
    e.stopPropagation()
    navigate(`/PostAJob/${jobId}`)
  }

  const handleDeleteJob = async (jobId, e) => {
    e.stopPropagation()
    // Show confirmation dialog
    if (window.confirm("Are you sure you want to delete this job? This action cannot be undone.")) {
      try {
        const response = await fetch(`http://localhost:8080/api/jobs/${jobId}`, {
          method: "DELETE",
        })

        if (response.ok) {
          // Remove the job from the state
          setJobs(jobs.filter((job) => job.id !== jobId))
          alert("Job deleted successfully")
        } else {
          alert("Failed to delete job. Please try again.")
        }
      } catch (error) {
        console.error("Error deleting job:", error)
        alert("An error occurred while deleting the job.")
      }
    }
  }

  const handleViewJob = (jobId) => {
    // Navigate to job details page
    navigate(`/job/${jobId}`)
  }

  // 🔍 Filter jobs based on search input and active tab
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.role?.toLowerCase().includes(searchRole.toLowerCase()) &&
      job.location?.toLowerCase().includes(searchLocation.toLowerCase())

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "fulltime" && job.jobType?.toLowerCase().includes("full")) ||
      (activeTab === "parttime" && job.jobType?.toLowerCase().includes("part")) ||
      (activeTab === "remote" && job.jobType?.toLowerCase().includes("remote")) ||
      (activeTab === "contract" && job.jobType?.toLowerCase().includes("contract"))

    return matchesSearch && matchesTab
  })

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getTimeAgo = (dateString) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    const now = new Date()
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24))

    if (diffInDays === 0) return "Today"
    if (diffInDays === 1) return "Yesterday"
    if (diffInDays < 7) return `${diffInDays} days ago`
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`
    return `${Math.floor(diffInDays / 30)} months ago`
  }

  const getJobTypeBadge = (jobType) => {
    if (!jobType) return null

    const type = jobType.toLowerCase()
    let bgColor = "bg-blue-100 text-blue-800"

    if (type.includes("full")) {
      bgColor = "bg-green-100 text-green-800"
    } else if (type.includes("part")) {
      bgColor = "bg-purple-100 text-purple-800"
    } else if (type.includes("contract")) {
      bgColor = "bg-orange-100 text-orange-800"
    } else if (type.includes("remote")) {
      bgColor = "bg-teal-100 text-teal-800"
    }

    return <span className={`${bgColor} text-xs font-medium px-2.5 py-0.5 rounded-full`}>{jobType}</span>
  }

  return (
    <div className="min-h-screen bg-gray-50 p-5">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Job Management</h1>
              <p className="text-gray-600 mt-1">Create, edit and manage job listings</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={fetchJobs}
                className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={refreshing}
              >
                <RefreshCw size={16} className={`mr-2 ${refreshing ? "animate-spin" : ""}`} />
                Refresh
              </button>
              <button
                onClick={() => navigate("/PostAJob")}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
              >
                <Plus size={16} className="mr-2" />
                Post New Job
              </button>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search job titles, skills, or keywords"
                  value={searchRole}
                  onChange={(e) => setSearchRole(e.target.value)}
                  className="pl-10 pr-4 py-2.5 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="relative md:w-1/3">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Location"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="pl-10 pr-4 py-2.5 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex overflow-x-auto pb-1 -mx-1 mt-2">
              <button
                onClick={() => setActiveTab("all")}
                className={`px-4 py-2 mx-1 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === "all" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                All Jobs
              </button>
              <button
                onClick={() => setActiveTab("fulltime")}
                className={`px-4 py-2 mx-1 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === "fulltime" ? "bg-green-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Full-time
              </button>
              <button
                onClick={() => setActiveTab("parttime")}
                className={`px-4 py-2 mx-1 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === "parttime" ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Part-time
              </button>
              <button
                onClick={() => setActiveTab("remote")}
                className={`px-4 py-2 mx-1 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === "remote" ? "bg-teal-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Remote
              </button>
              <button
                onClick={() => setActiveTab("contract")}
                className={`px-4 py-2 mx-1 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === "contract" ? "bg-orange-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Contract
              </button>
            </div>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-4 flex items-center">
            <div className="bg-blue-100 p-3 rounded-lg mr-4">
              <Briefcase size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Jobs</p>
              <p className="text-xl font-semibold">{jobs.length}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 flex items-center">
            <div className="bg-green-100 p-3 rounded-lg mr-4">
              <Users size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Full-time</p>
              <p className="text-xl font-semibold">
                {jobs.filter((job) => job.jobType?.toLowerCase().includes("full")).length}
              </p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 flex items-center">
            <div className="bg-purple-100 p-3 rounded-lg mr-4">
              <Clock size={20} className="text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Part-time</p>
              <p className="text-xl font-semibold">
                {jobs.filter((job) => job.jobType?.toLowerCase().includes("part")).length}
              </p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 flex items-center">
            <div className="bg-teal-100 p-3 rounded-lg mr-4">
              <MapPin size={20} className="text-teal-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Remote</p>
              <p className="text-xl font-semibold">
                {jobs.filter((job) => job.jobType?.toLowerCase().includes("remote")).length}
              </p>
            </div>
          </div>
        </div>

        {/* Jobs Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64 bg-white rounded-xl shadow-sm p-8">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Loading jobs...</p>
            </div>
          </div>
        ) : (
          <>
            {filteredJobs.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-10 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
                  <Briefcase size={24} className="text-blue-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">No jobs found</h2>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  {jobs.length === 0
                    ? "There are no jobs in the system. Start by posting a new job."
                    : "No jobs match your search criteria. Try adjusting your filters."}
                </p>
                {jobs.length > 0 && (
                  <button
                    onClick={() => {
                      setSearchRole("")
                      setSearchLocation("")
                      setActiveTab("all")
                    }}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm inline-flex items-center"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredJobs.map((job) => (
                  <div
                    key={job.id}
                    className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all border border-gray-100 cursor-pointer"
                    onClick={() => handleViewJob(job.id)}
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-lg font-bold text-gray-800 hover:text-blue-600 transition-colors">
                            {job.role ?? "No Role"}
                          </h3>
                          <div className="flex items-center text-gray-600 mt-1">
                            <Building size={14} className="mr-1.5 flex-shrink-0" />
                            <span className="text-sm">{job.companyName ?? "Unknown Company"}</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          {getJobTypeBadge(job.jobType)}
                          <span className="text-xs text-gray-500 mt-1.5">{getTimeAgo(job.datePosted)}</span>
                        </div>
                      </div>

                      <div className="space-y-2 mt-4">
                        <div className="flex items-center text-gray-600">
                          <MapPin size={16} className="mr-2 flex-shrink-0 text-gray-500" />
                          <span className="text-sm">{job.location ?? "No location"}</span>
                        </div>

                        <div className="flex items-center text-gray-600">
                          <DollarSign size={16} className="mr-2 flex-shrink-0 text-gray-500" />
                          <span className="text-sm">
                            {job.minSalary && job.maxSalary
                              ? `₹${job.minSalary} - ₹${job.maxSalary} LPA`
                              : job.minSalary
                                ? `₹${job.minSalary} LPA+`
                                : job.maxSalary
                                  ? `Up to ₹${job.maxSalary} LPA`
                                  : "Salary not specified"}
                          </span>
                        </div>

                        <div className="flex items-center text-gray-600">
                          <Briefcase size={16} className="mr-2 flex-shrink-0 text-gray-500" />
                          <span className="text-sm">{job.experienceRange ?? "Experience not specified"}</span>
                        </div>
                      </div>

                      {job.skillsRequired && (
                        <div className="mt-4">
                          <div className="flex flex-wrap gap-1.5">
                            {job.skillsRequired
                              ?.split(",")
                              .slice(0, 3)
                              .map((skill, index) => (
                                <span
                                  key={index}
                                  className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded-full text-xs"
                                >
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

                      <div className="flex items-center  justify-center mt-5 pt-4 border-t border-gray-100">
                        <div className="flex space-x-2">
                        <button
  onClick={(e) => handleEditJob(job.id, e)}
  className="bg-blue-800 text-white px-3 py-1 rounded-lg hover:bg-blue-900 transition-colors"
  title="Edit job"
>
  Edit
</button>

<button
  onClick={(e) => handleDeleteJob(job.id, e)}
  className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-900 transition-colors"
  title="Delete job"
>
  Delete
</button>

                        </div>
                        <div className="flex space-x-2">
                          
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default AllJobs

