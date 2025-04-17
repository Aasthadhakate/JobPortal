"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { FiEdit2, FiEye, FiEyeOff, FiPlus, FiSearch, FiStar, FiTrash2 } from "react-icons/fi"
import axios from "axios"

const API_URL = "http://localhost:8080/api/blogs"

const AdminBlogList = () => {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const navigate = useNavigate()

  // Fetch blogs from API
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true)
        // Get all blogs including drafts for admin
        const response = await axios.get(`${API_URL}?status=all`)
        setBlogs(response.data)
      } catch (err) {
        setError("Failed to fetch blogs")
        console.error("Error fetching blogs:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchBlogs()
  }, [])

  // Filter blogs by search term and status
  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch =
      searchTerm === "" ||
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.summary.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || blog.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Handle blog deletion
  const handleDelete = async (id, e) => {
    e.stopPropagation()

    if (!window.confirm("Are you sure you want to delete this blog post? This action cannot be undone.")) {
      return
    }

    try {
      await axios.delete(`${API_URL}/${id}`)
      // Remove the deleted blog from state
      setBlogs(blogs.filter((blog) => blog.id !== id))
    } catch (err) {
      setError("Failed to delete blog")
      console.error("Error deleting blog:", err)
    }
  }

  // Handle toggling featured status
  const handleToggleFeatured = async (id, currentFeatured, e) => {
    e.stopPropagation()

    try {
      await axios.patch(`${API_URL}/${id}/featured`, { featured: !currentFeatured })
      // Update the blog in state
      setBlogs(blogs.map((blog) => (blog.id === id ? { ...blog, featured: !currentFeatured } : blog)))
    } catch (err) {
      setError("Failed to update blog")
      console.error("Error updating blog:", err)
    }
  }

  // Handle toggling published status
  const handleToggleStatus = async (id, currentStatus, e) => {
    e.stopPropagation()

    const newStatus = currentStatus === "published" ? "draft" : "published"

    try {
      await axios.patch(`${API_URL}/${id}/status`, { status: newStatus })
      // Update the blog in state
      setBlogs(blogs.map((blog) => (blog.id === id ? { ...blog, status: newStatus } : blog)))
    } catch (err) {
      setError("Failed to update blog")
      console.error("Error updating blog:", err)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-800"></div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h1 className="text-2xl font-bold text-gray-900">Manage Blog Posts</h1>
              <button
                onClick={() => navigate("/admin/blog/create")}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FiPlus className="mr-2" />
                Create New Post
              </button>
            </div>

            {/* Error Message */}
            {error && <div className="mb-6 p-4 rounded-md bg-red-50 text-red-800">{error}</div>}

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search blog posts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 pl-10 pr-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>
              <div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Posts</option>
                  <option value="published">Published</option>
                  <option value="draft">Drafts</option>
                </select>
              </div>
            </div>

            {/* Blog List */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Title
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Category
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Date
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Featured
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredBlogs.length > 0 ? (
                    filteredBlogs.map((blog) => (
                      <tr
                        key={blog.id}
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => navigate(`/admin/blog/edit/${blog.id}`)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0">
                              <img
                                className="h-10 w-10 rounded-md object-cover"
                                src={blog.coverImage || "/placeholder.svg?height=40&width=40"}
                                alt=""
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 line-clamp-1">{blog.title}</div>
                              <div className="text-sm text-gray-500 line-clamp-1">{blog.summary}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 capitalize">
                            {blog.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{blog.publishDate}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              blog.status === "published"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {blog.status === "published" ? "Published" : "Draft"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {blog.featured ? (
                            <span className="text-yellow-500">
                              <FiStar className="inline" />
                            </span>
                          ) : (
                            <span className="text-gray-300">
                              <FiStar className="inline" />
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={(e) => handleToggleFeatured(blog.id, blog.featured, e)}
                            className="text-blue-600 hover:text-blue-900 mr-3"
                            title={blog.featured ? "Remove from featured" : "Add to featured"}
                          >
                            <FiStar />
                          </button>
                          <button
                            onClick={(e) => handleToggleStatus(blog.id, blog.status, e)}
                            className="text-green-600 hover:text-green-900 mr-3"
                            title={blog.status === "published" ? "Unpublish" : "Publish"}
                          >
                            {blog.status === "published" ? <FiEyeOff /> : <FiEye />}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              navigate(`/admin/blog/edit/${blog.id}`)
                            }}
                            className="text-indigo-600 hover:text-indigo-900 mr-3"
                            title="Edit"
                          >
                            <FiEdit2 />
                          </button>
                          <button
                            onClick={(e) => handleDelete(blog.id, e)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete"
                          >
                            <FiTrash2 />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                        No blog posts found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminBlogList
