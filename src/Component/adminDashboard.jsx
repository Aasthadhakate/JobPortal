import { useState, useEffect } from "react"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from "recharts"
import { Users, Briefcase, FileCheck, Calendar, ArrowUpRight, ArrowDownRight, Building, Info } from "lucide-react"
import axios from "axios"

const COLORS = ["#1e40af", "#3b82f6", "#60a5fa", "#93c5fd", "#bfdbfe"]

// Custom tooltip component for the monthly chart
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-md shadow-md">
        <p className="font-medium text-gray-800">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }}>
            {entry.name === "jobsPosted" ? "Jobs Posted" : "Applications"}: {entry.value}
          </p>
        ))}
      </div>
    )
  }
  return null
}

const AdminDashboard = () => {
  // Dashboard state
  const [totalJobs, setTotalJobs] = useState(0)
  const [totalUsers, setTotalUsers] = useState(0)
  const [totalApplications, setTotalApplications] = useState(0)
  const [jobsByCategory, setJobsByCategory] = useState([])
  const [monthlyJobData, setMonthlyJobData] = useState([])
  const [newApplications, setNewApplications] = useState({ today: 0, thisWeek: 0 })
  const [recentJobPostings, setRecentJobPostings] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [jobGrowth, setJobGrowth] = useState(0)
  const [userGrowth, setUserGrowth] = useState(0)
  const [applicationGrowth, setApplicationGrowth] = useState(0)
  const [actualApplications, setActualApplications] = useState([])

  // Fetch all data on component mount
  const fetchDashboardData = async () => {
    setIsLoading(true)
    try {
      // 1. Fetch jobs data
      let jobs = []
      try {
        // Try the jobs endpoint first
        const jobsResponse = await axios.get("http://localhost:8080/api/jobs")
        jobs = jobsResponse.data || []
      } catch (error) {
        console.error("Error fetching from /api/jobs, trying /api/all:", error)
        // Fallback to the all endpoint
        try {
          const allJobsResponse = await axios.get("http://localhost:8080/api/all")
          jobs = allJobsResponse.data || []
        } catch (allError) {
          console.error("Error fetching from /api/all:", allError)
          jobs = []
        }
      }

      setTotalJobs(jobs.length)

      // Calculate job growth - compare with last month
      const currentDate = new Date()
      const currentMonth = currentDate.getMonth()
      const lastMonth = new Date(currentDate)
      lastMonth.setMonth(currentMonth - 1)

      const currentMonthJobs = jobs.filter((job) => {
        if (!job.datePosted) return false
        const jobDate = new Date(job.datePosted)
        return jobDate.getMonth() === currentMonth && jobDate.getFullYear() === currentDate.getFullYear()
      }).length

      const lastMonthJobs = jobs.filter((job) => {
        if (!job.datePosted) return false
        const jobDate = new Date(job.datePosted)
        return jobDate.getMonth() === lastMonth.getMonth() && jobDate.getFullYear() === lastMonth.getFullYear()
      }).length

      if (lastMonthJobs > 0) {
        setJobGrowth(Math.round(((currentMonthJobs - lastMonthJobs) / lastMonthJobs) * 100))
      } else {
        setJobGrowth(currentMonthJobs > 0 ? 100 : 0)
      }

      // 2. Fetch users data - try to get from API first, then fallback to localStorage
      let users = []
      try {
        // First try to fetch users from API
        try {
          const usersResponse = await axios.get("http://localhost:8080/api/users")
          users = usersResponse.data || []
          console.log("Users fetched from API:", users)
        } catch (apiError) {
          console.error("Error fetching users from API:", apiError)

          // Check localStorage for users
          const localStorageUsers = localStorage.getItem("users")
          if (localStorageUsers) {
            try {
              users = JSON.parse(localStorageUsers)
              console.log("Users fetched from localStorage:", users)
            } catch (parseError) {
              console.error("Error parsing users from localStorage:", parseError)
              users = []
            }
          }

          // If no users in localStorage, try to get user from localStorage
          if (!users || users.length === 0) {
            // Try to fetch all users from the signup endpoint
            try {
              const signupResponse = await axios.get("http://localhost:8080/api/signup")
              users = signupResponse.data || []
              console.log("Users fetched from signup endpoint:", users)
            } catch (signupError) {
              console.error("Error fetching from signup endpoint:", signupError)

              // Last resort: check for individual user in localStorage
              const user = localStorage.getItem("user")
              if (user) {
                // Check if user is a JSON string or just an email
                try {
                  const parsedUser = JSON.parse(user)
                  users = [parsedUser]
                } catch (parseError) {
                  // If it's not valid JSON, it's probably just an email string
                  users = [{ email: user }]
                }
              }
            }
          }
        }

        // Filter out admin users
        users = users.filter((user) => {
          const email = typeof user === "string" ? user : user.email || ""
          return !email?.includes("admin") && email !== "datatypeit@gmail.com"
        })

        console.log("Final filtered users count:", users.length)
        setTotalUsers(users.length)

        // Calculate user growth (simplified for now)
        setUserGrowth(0) // You can implement actual calculation if you have signup dates
      } catch (error) {
        console.error("Error processing users:", error)
        setTotalUsers(0)
      }

      // 3. Fetch applications data - try multiple sources
      let applications = []

      // First try the applications endpoint
      try {
        const applicationsResponse = await axios.get("http://localhost:8080/api/applications")
        applications = applicationsResponse.data || []
      } catch (error) {
        console.error("Error fetching from /api/applications, checking localStorage:", error)
      }

      // If no applications found, try appliedJobs from localStorage
      if (!applications.length) {
        try {
          const appliedJobsFromStorage = localStorage.getItem("appliedJobs")
          if (appliedJobsFromStorage) {
            const parsedAppliedJobs = JSON.parse(appliedJobsFromStorage)
            applications = parsedAppliedJobs
          }
        } catch (error) {
          console.error("Error getting applied jobs from localStorage:", error)
        }
      }

      // Store the actual applications for reference
      setActualApplications(applications)
      setTotalApplications(applications.length)

      // Sort jobs by date posted (newest first)
      const sortedJobs = [...jobs].sort((a, b) => {
        const dateA = a.datePosted ? new Date(a.datePosted) : new Date(0)
        const dateB = b.datePosted ? new Date(b.datePosted) : new Date(0)
        return dateB - dateA
      })

      // Count applications for each job
      const jobsWithApplications = sortedJobs.map((job) => {
        // Count applications that match this job's title
        const jobApplications = applications.filter((app) => {
          const appJobTitle = app.jobTitle || app.role || ""
          const jobTitle = job.role || ""
          const appCompany = app.company || ""
          const jobCompany = job.companyName || ""

          // Match both job title and company when possible for more accurate matching
          if (appCompany && jobCompany) {
            return (
              appJobTitle.toLowerCase() === jobTitle.toLowerCase() &&
              appCompany.toLowerCase() === jobCompany.toLowerCase()
            )
          }

          // Fall back to just matching job title
          return appJobTitle.toLowerCase() === jobTitle.toLowerCase()
        }).length

        return {
          ...job,
          applicationCount: jobApplications,
        }
      })

      // Set all jobs to the state (not just the first 5)
      setRecentJobPostings(jobsWithApplications)

      // Calculate application growth
      const lastMonthApplications = applications.filter((app) => {
        if (!app.applicationDate && !app.appliedDate) return false
        const appDate = new Date(app.applicationDate || app.appliedDate)
        return appDate.getMonth() === lastMonth.getMonth() && appDate.getFullYear() === lastMonth.getFullYear()
      }).length

      const currentMonthApplications = applications.filter((app) => {
        if (!app.applicationDate && !app.appliedDate) return false
        const appDate = new Date(app.applicationDate || app.appliedDate)
        return appDate.getMonth() === currentMonth && appDate.getFullYear() === currentDate.getFullYear()
      }).length

      if (lastMonthApplications > 0) {
        setApplicationGrowth(
          Math.round(((currentMonthApplications - lastMonthApplications) / lastMonthApplications) * 100),
        )
      } else {
        setApplicationGrowth(currentMonthApplications > 0 ? 100 : 0)
      }

      // Calculate today's and this week's applications
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const todayApplications = applications.filter((app) => {
        if (!app.applicationDate && !app.appliedDate) return false
        const appDate = new Date(app.applicationDate || app.appliedDate)
        return appDate >= today
      }).length

      const weekAgo = new Date(today)
      weekAgo.setDate(weekAgo.getDate() - 7)

      const weekApplications = applications.filter((app) => {
        if (!app.applicationDate && !app.appliedDate) return false
        const appDate = new Date(app.applicationDate || app.appliedDate)
        return appDate >= weekAgo
      }).length

      setNewApplications({
        today: todayApplications,
        thisWeek: weekApplications,
      })

      // 4. Calculate jobs by category
      const jobCategories = {}
      jobs.forEach((job) => {
        // Use the full role name as the category
        const category = job.role || "Other"
        if (!jobCategories[category]) {
          jobCategories[category] = {
            count: 1,
            applications: 0,
            companyName: job.companyName || "Unknown Company",
            datePosted: job.datePosted || new Date().toISOString(),
          }
        } else {
          jobCategories[category].count += 1
        }

        // Count applications for this job type
        const jobApplications = applications.filter((app) => {
          const appJobTitle = app.jobTitle || app.role || ""
          const appCompany = app.company || ""
          const jobCompany = job.companyName || ""

          if (appCompany && jobCompany) {
            return (
              appJobTitle.toLowerCase() === category.toLowerCase() &&
              appCompany.toLowerCase() === jobCompany.toLowerCase()
            )
          }

          return appJobTitle.toLowerCase() === category.toLowerCase()
        }).length

        jobCategories[category].applications += jobApplications
      })

      const categoryData = Object.keys(jobCategories).map((category) => ({
        category,
        count: jobCategories[category].count,
        applications: jobCategories[category].applications,
        companyName: jobCategories[category].companyName,
        datePosted: jobCategories[category].datePosted,
      }))

      // Sort by number of jobs (highest first)
      categoryData.sort((a, b) => b.count - a.count)

      setJobsByCategory(categoryData)

      // 5. Generate monthly data - FIX: Ensure we start from January
      const monthlyData = []
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

      // Create data for all 12 months of the current year
      for (let i = 0; i < 12; i++) {
        const month = new Date(currentDate.getFullYear(), i, 1)
        const nextMonth = new Date(currentDate.getFullYear(), i + 1, 1)

        // Count jobs posted in this month
        const jobsPosted = jobs.filter((job) => {
          if (!job.datePosted) return false
          const jobDate = new Date(job.datePosted)
          return jobDate >= month && jobDate < nextMonth
        }).length

        // Count applications in this month
        const monthlyApplications = applications.filter((app) => {
          if (!app.applicationDate && !app.appliedDate) return false
          const appDate = new Date(app.applicationDate || app.appliedDate)
          return appDate >= month && appDate < nextMonth
        }).length

        monthlyData.push({
          month: monthNames[i],
          jobsPosted,
          applications: monthlyApplications,
        })
      }

      setMonthlyJobData(monthlyData)
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()

    // Set up event listener for job deletion
    const handleStorageChange = (e) => {
      if (e.key === "deletedJob" || e.key === "appliedJobs" || e.key === "user" || e.key === "users") {
        // Refresh data when relevant storage changes
        fetchDashboardData()
      }
    }

    window.addEventListener("storage", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [])

  // Format numbers with commas
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  // Format date to readable format
  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }

  // Navigate to view applications page
  const navigateToViewApplications = () => {
    // Use window.location for navigation
    window.location.href = "/ViewUsers"
  }

  if (isLoading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-blue-800 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    )
  }

  // Get the actual applications from the applied-jobs component
  const getActualApplicationCount = (job) => {
    const matchingApplications = actualApplications.filter((app) => {
      const appJobTitle = app.jobTitle || app.role || ""
      const jobTitle = job.role || ""
      const appCompany = app.company || ""
      const jobCompany = job.companyName || ""

      if (appCompany && jobCompany) {
        return (
          appJobTitle.toLowerCase() === jobTitle.toLowerCase() && appCompany.toLowerCase() === jobCompany.toLowerCase()
        )
      }

      return appJobTitle.toLowerCase() === jobTitle.toLowerCase()
    })

    return matchingApplications.length
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Dashboard Header */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome to the Datatype IT Consulting job portal dashboard</p>
        </div>
        <button
          onClick={fetchDashboardData}
          className="px-4 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Refresh Data
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Jobs</p>
              <h3 className="text-3xl font-bold text-blue-800">{formatNumber(totalJobs)}</h3>
              <div className={`flex items-center mt-2 text-sm ${jobGrowth >= 0 ? "text-green-600" : "text-red-600"}`}>
                {jobGrowth >= 0 ? (
                  <ArrowUpRight size={16} className="mr-1" />
                ) : (
                  <ArrowDownRight size={16} className="mr-1" />
                )}
                <span>{Math.abs(jobGrowth)}% from last month</span>
              </div>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Briefcase className="w-6 h-6 text-blue-800" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Users</p>
              <h3 className="text-3xl font-bold text-blue-800">{formatNumber(totalUsers)}</h3>
              <div className={`flex items-center mt-2 text-sm ${userGrowth >= 0 ? "text-green-600" : "text-red-600"}`}>
                {userGrowth >= 0 ? (
                  <ArrowUpRight size={16} className="mr-1" />
                ) : (
                  <ArrowDownRight size={16} className="mr-1" />
                )}
                <span>{Math.abs(userGrowth)}% from last month</span>
              </div>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Users className="w-6 h-6 text-blue-800" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Applications</p>
              <h3 className="text-3xl font-bold text-blue-800">{formatNumber(totalApplications)}</h3>
              <div
                className={`flex items-center mt-2 text-sm ${applicationGrowth >= 0 ? "text-green-600" : "text-red-600"}`}
              >
                {applicationGrowth >= 0 ? (
                  <ArrowUpRight size={16} className="mr-1" />
                ) : (
                  <ArrowDownRight size={16} className="mr-1" />
                )}
                <span>{Math.abs(applicationGrowth)}% from last month</span>
              </div>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <FileCheck className="w-6 h-6 text-blue-800" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
        {/* Left Side: Jobs by Category */}
        <div className="bg-white shadow-md rounded-xl p-6 lg:col-span-2 border border-gray-100 hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-semibold mb-4">Jobs Posted by Position</h3>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={jobsByCategory}
                  dataKey="count"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  fill="#8884d8"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {jobsByCategory.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name, props) => [`${value} Jobs`, props.payload.category]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Side: Recent Job Postings */}
        <div className="bg-white shadow-md rounded-xl p-6 lg:col-span-3 border border-gray-100 hover:shadow-lg transition-shadow">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
            <h3 className="text-lg font-semibold">Recently Posted Jobs</h3>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex items-center bg-blue-50 px-3 py-1.5 rounded-lg">
                <Calendar size={16} className="mr-2 text-blue-800" />
                <div>
                  <span className="text-blue-800 font-medium">{newApplications.today}</span>
                  <span className="text-xs text-blue-600 ml-1">(last 24h)</span>
                  <span className="ml-1 text-gray-500">Today</span>
                </div>
              </div>
              <div className="flex items-center bg-blue-50 px-3 py-1.5 rounded-lg">
                <Calendar size={16} className="mr-2 text-blue-800" />
                <div>
                  <span className="text-blue-800 font-medium">{newApplications.thisWeek}</span>
                  <span className="text-xs text-blue-600 ml-1">(last 7 days)</span>
                  <span className="ml-1 text-gray-500">This Week</span>
                </div>
              </div>
              <div className="group relative">
                <button className="text-gray-500 hover:text-blue-800">
                  <Info size={16} />
                </button>
                <div className="absolute z-10 invisible group-hover:visible bg-gray-800 text-white text-xs rounded py-1 px-2 right-0 bottom-full mb-2 w-48">
                  Today shows applications received in the last 24 hours. This Week shows applications from the last 7
                  days.
                </div>
              </div>
            </div>
          </div>

          <div className="max-h-[350px] overflow-y-auto pr-2 space-y-3">
            {recentJobPostings.length > 0 ? (
              recentJobPostings.map((job, index) => {
                // Get the actual application count for this job
                const applicationCount = getActualApplicationCount(job)

                return (
                  <div
                    key={index}
                    className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 mr-3">
                      <Building size={18} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">{job.role || "Unnamed Position"}</h4>
                      <p className="text-sm text-gray-600">{job.companyName || "Various Companies"}</p>
                    </div>
                    <div className="text-right">
                      {/* Make application count clickable to navigate to view-users page */}
                      <button
                        onClick={navigateToViewApplications}
                        className="text-sm font-medium text-blue-800 hover:underline"
                      >
                        {applicationCount} Applications
                      </button>
                      <p className="text-xs text-gray-500">{formatDate(job.datePosted)}</p>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="text-center py-6 text-gray-500">No recent jobs posted</div>
            )}
          </div>
        </div>
      </div>

      {/* Monthly Chart */}
      <div className="bg-white shadow-md rounded-xl p-6 mb-6 border border-gray-100 hover:shadow-lg transition-shadow">
        <h3 className="text-lg font-semibold mb-4">Monthly Jobs & Applications</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyJobData} barSize={20} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="jobsPosted" name="Jobs Posted" fill="#1e40af" radius={[4, 4, 0, 0]} />
              <Bar dataKey="applications" name="Applications" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
