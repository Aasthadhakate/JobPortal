"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { FiClock, FiCalendar, FiX, FiArrowRight, FiTag, FiSearch } from "react-icons/fi"
import axios from "axios"

// Add this CSS for animations
const styles = document.createElement("style")
styles.innerHTML = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fadeIn {
    animation: fadeIn 0.3s ease-out forwards;
  }
`
document.head.appendChild(styles)

const API_URL = "http://localhost:8080/api/blogs"
// Constant author image path
const AUTHOR_IMAGE = "/datatypeit.jpeg"

const Blog = () => {
  const [blogs, setBlogs] = useState([])
  const [selectedBlog, setSelectedBlog] = useState(null)
  const [activeCategory, setActiveCategory] = useState("all")
  const [categories, setCategories] = useState(["all"])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")

  const navigate = useNavigate()
  const isAdmin = localStorage.getItem("role")?.toLowerCase() === "admin"

  // Fetch blogs from API
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true)
        const response = await axios.get(API_URL)

        // Ensure all blogs use the constant author image
        const blogsWithConstantImage = response.data.map((blog) => ({
          ...blog,
          authorImage: AUTHOR_IMAGE,
        }))

        setBlogs(blogsWithConstantImage)

        // Extract unique categories
        const uniqueCategories = [...new Set(response.data.map((blog) => blog.category))]
        setCategories(["all", ...uniqueCategories])
      } catch (err) {
        setError("Failed to fetch blogs")
        console.error("Error fetching blogs:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchBlogs()
  }, [])

  // Filter blogs by category and search term
  const filteredBlogs = blogs.filter((blog) => {
    const matchesCategory = activeCategory === "all" || blog.category === activeCategory
    const matchesSearch =
      searchTerm === "" ||
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.summary.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesCategory && matchesSearch
  })

  // Handle admin navigation to create/edit blog
  const handleAdminAction = (blogId = null) => {
    if (blogId) {
      navigate(`/admin/blog/edit/${blogId}`)
    } else {
      navigate("/admin/blog/create")
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-800 mb-4"></div>
        <p className="text-gray-600 font-medium">Loading articles...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12 max-w-md mx-auto bg-white rounded-xl shadow-md">
        <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-red-100">
          <FiX className="text-red-500" size={24} />
        </div>
        <h3 className="text-xl font-medium text-gray-900 mb-2">Error Loading Blogs</h3>
        <p className="text-gray-600">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-5xl">
            Our{" "}
            <span className="text-blue-800 relative inline-block">
              Blog
              <span className="absolute bottom-0 left-0 w-full h-1 bg-blue-800 rounded-full transform translate-y-1"></span>
            </span>
          </h1>
          <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
            Insights, strategies, and knowledge to help you succeed in your career
          </p>

          {/* Admin Create Button */}
          {isAdmin && (
            <button
              onClick={() => handleAdminAction()}
              className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-800 hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105"
            >
              Create New Blog Post
            </button>
          )}
        </div>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative group">
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pl-10 pr-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm group-hover:shadow-md"
            />
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" />
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-all duration-200 ${
                activeCategory === category
                  ? "bg-blue-600 text-white shadow-md transform scale-105"
                  : "bg-white text-gray-700 hover:bg-gray-100 hover:shadow"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Featured Posts (Top Row) */}
        {filteredBlogs.filter((blog) => blog.featured).length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="w-8 h-1 bg-blue-600 rounded-full mr-3"></span>
              Featured Articles
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {filteredBlogs
                .filter((blog) => blog.featured)
                .slice(0, 2)
                .map((blog) => (
                  <div
                    key={blog.id}
                    className="bg-white rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group"
                  >
                    <div className="relative h-64 w-full overflow-hidden">
                      <img
                        src={blog.coverImage || "/placeholder.svg?height=400&width=600"}
                        alt={blog.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-600 bg-opacity-90 text-white capitalize">
                          <FiTag className="mr-1" />
                          {blog.category}
                        </span>
                      </div>

                      {/* Admin Edit Button */}
                      {isAdmin && (
                        <div className="absolute top-4 right-4">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleAdminAction(blog.id)
                            }}
                            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-800 bg-opacity-90 text-white hover:bg-opacity-100 transition-all duration-200"
                          >
                            Edit
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h2 className="text-2xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-700 transition-colors duration-200">
                        {blog.title}
                      </h2>
                      <p className="text-gray-600 mb-4 line-clamp-2">{blog.summary}</p>

                      <div className="flex items-center mb-4">
                        <img
                          src={AUTHOR_IMAGE || "/placeholder.svg"}
                          alt={blog.author}
                          className="h-10 w-10 rounded-full mr-3 border-2 border-white shadow-sm"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{blog.author}</p>
                          <div className="flex items-center text-xs text-gray-500">
                            <FiCalendar className="mr-1" />
                            <span className="mr-3">{blog.publishDate}</span>
                            <FiClock className="mr-1" />
                            <span>{Math.ceil(blog.content.length / 1000)} min read</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => setSelectedBlog(blog)}
                        className="flex items-center text-blue-600 font-medium hover:text-blue-800 transition-colors group-hover:font-semibold"
                      >
                        Read Article
                        <FiArrowRight className="ml-2 transform group-hover:translate-x-1 transition-transform duration-200" />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Regular Posts */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="w-8 h-1 bg-blue-600 rounded-full mr-3"></span>
            All Articles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBlogs
              .filter((blog) => !blog.featured || filteredBlogs.filter((b) => b.featured).length > 2)
              .map((blog) => (
                <div
                  key={blog.id}
                  className="bg-white rounded-xl overflow-hidden shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group"
                >
                  <div className="relative h-48 w-full overflow-hidden">
                    <img
                      src={blog.coverImage || "/placeholder.svg?height=400&width=600"}
                      alt={blog.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-600 bg-opacity-90 text-white capitalize">
                        <FiTag className="mr-1" />
                        {blog.category}
                      </span>
                    </div>

                    {/* Admin Edit Button */}
                    {isAdmin && (
                      <div className="absolute top-4 right-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleAdminAction(blog.id)
                          }}
                          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-800 bg-opacity-90 text-white hover:bg-opacity-100 transition-all duration-200"
                        >
                          Edit
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-700 transition-colors duration-200">
                      {blog.title}
                    </h3>
                    <p className="text-gray-600 mb-4 text-sm line-clamp-2">{blog.summary}</p>

                    <div className="flex items-center mb-4">
                      <img
                        src={AUTHOR_IMAGE || "/placeholder.svg"}
                        alt={blog.author}
                        className="h-8 w-8 rounded-full mr-2 border-2 border-white shadow-sm"
                      />
                      <div>
                        <p className="text-xs font-medium text-gray-900">{blog.author}</p>
                        <div className="flex items-center text-xs text-gray-500">
                          <FiCalendar className="mr-1" />
                          <span>{blog.publishDate}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedBlog(blog)}
                      className="flex items-center text-blue-600 text-sm font-medium hover:text-blue-800 transition-colors group-hover:font-semibold"
                    >
                      Read Article
                      <FiArrowRight className="ml-2 transform group-hover:translate-x-1 transition-transform duration-200" />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* No results message */}
        {filteredBlogs.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl shadow-md">
            <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-gray-100">
              <FiSearch className="text-gray-400" size={24} />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No articles found</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              {searchTerm
                ? `No articles found matching "${searchTerm}". Try a different search term.`
                : `No articles found in the "${activeCategory}" category. Try selecting a different category.`}
            </p>
          </div>
        )}
      </div>

      {/* Blog Detail Modal */}
      {selectedBlog && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex justify-center items-center p-4 overflow-y-auto backdrop-blur-sm">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[85vh] overflow-y-auto relative shadow-2xl animate-fadeIn">
            <button
              onClick={() => setSelectedBlog(null)}
              className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors z-10 hover:rotate-90 transform duration-300"
            >
              <FiX className="text-gray-700" size={20} />
            </button>

            <div className="relative h-64 sm:h-80 w-full">
              <img
                src={selectedBlog.coverImage || "/placeholder.svg?height=400&width=600"}
                alt={selectedBlog.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-600 text-white mb-3 capitalize">
                  {selectedBlog.category}
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-white">{selectedBlog.title}</h2>
              </div>
            </div>

            <div className="p-5 sm:p-6">
              <div className="flex items-center mb-4 border-b border-gray-200 pb-4">
                <img
                  src={AUTHOR_IMAGE || "/placeholder.svg"}
                  alt={selectedBlog.author}
                  className="h-10 w-10 rounded-full mr-3 border-2 border-white shadow-sm"
                />
                <div>
                  <p className="font-medium text-gray-900">{selectedBlog.author}</p>
                  <div className="flex flex-wrap items-center text-xs text-gray-500">
                    <div className="flex items-center mr-4">
                      <FiCalendar className="mr-1" />
                      <span>{selectedBlog.publishDate}</span>
                    </div>
                    <div className="flex items-center">
                      <FiClock className="mr-1" />
                      <span>{Math.ceil(selectedBlog.content.length / 1000)} min read</span>
                    </div>
                  </div>
                </div>
              </div>

              <h3 className="text-lg text-gray-700 mb-4 font-medium">{selectedBlog.summary}</h3>

              <div
                className="prose prose-blue max-w-none text-sm prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline"
                dangerouslySetInnerHTML={{ __html: selectedBlog.content }}
              />

              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs font-medium text-gray-700 mr-2">Related topics:</span>
                  {["career", selectedBlog.category, "professional development"].map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-800 capitalize hover:bg-gray-200 transition-colors cursor-pointer"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Blog
