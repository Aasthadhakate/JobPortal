import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Save,
  Trash2,
  X,
  Bold,
  Italic,
  Underline,
  Link2,
  Image,
  List,
  ListOrdered,
  Heading2,
  Heading3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Code,
  Quote,
  Strikethrough,
  Subscript,
  Superscript
} from "lucide-react";
import axios from "axios";
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

const API_URL = "http://localhost:8080/api/blogs";

const AdminBlogEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  const editorRef = useRef(null);
  const quillRef = useRef(null);

  const [blog, setBlog] = useState({
    title: "",
    summary: "",
    content: "",
    category: "general",
    coverImage: "/placeholder.svg?height=400&width=600",
    author: localStorage.getItem("user") || "Admin User",
    authorImage: "../datatypeit.jpeg?height=100&width=100",
    publishDate: new Date().toISOString().split("T")[0],
    status: "draft",
    featured: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  // Categories for the dropdown
  const categories = ["general", "career", "technology", "industry", "interview", "resume", "job-search"];

  // Initialize Quill editor
  useEffect(() => {
    if (editorRef.current && !quillRef.current) {
      const toolbarOptions = [
        [{ 'font': [] }],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'script': 'sub'}, { 'script': 'super' }],
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'align': [] }],
        ['blockquote', 'code-block'],
        ['link', 'image'],
        ['clean']
      ];

      quillRef.current = new Quill(editorRef.current, {
        modules: {
          toolbar: toolbarOptions
        },
        theme: 'snow'
      });

      quillRef.current.on('text-change', () => {
        setBlog(prev => ({
          ...prev,
          content: quillRef.current.root.innerHTML
        }));
      });
    }
  }, []);

  // Fetch blog data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      const fetchBlog = async () => {
        try {
          setLoading(true);
          const response = await axios.get(`${API_URL}/${id}`);
          setBlog(response.data);
          
          if (quillRef.current) {
            quillRef.current.root.innerHTML = response.data.content;
          }
        } catch (err) {
          setError("Failed to fetch blog");
          console.error("Error fetching blog:", err);
        } finally {
          setLoading(false);
        }
      };

      fetchBlog();
    }
  }, [id, isEditMode]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setBlog({
      ...blog,
      [name]: type === "checkbox" ? e.target.checked : value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);

      if (isEditMode) {
        await axios.put(`${API_URL}/${id}`, blog);
        setSuccessMessage("Blog updated successfully!");
      } else {
        await axios.post(API_URL, blog);
        setSuccessMessage("Blog created successfully!");
      }

      setTimeout(() => {
        navigate("/admin/blogs");
      }, 1500);
    } catch (err) {
      setError("Failed to save blog");
      console.error("Error saving blog:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle blog deletion
  const handleDelete = async () => {
    if (!isEditMode) return;

    if (!window.confirm("Are you sure you want to delete this blog post? This action cannot be undone.")) {
      return;
    }

    try {
      setLoading(true);
      await axios.delete(`${API_URL}/${id}`);
      setSuccessMessage("Blog deleted successfully!");

      setTimeout(() => {
        navigate("/admin/blogs");
      }, 1500);
    } catch (err) {
      setError("Failed to delete blog");
      console.error("Error deleting blog:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditMode) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-800"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 sm:p-8">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditMode ? "Edit Blog Post" : "Create New Blog Post"}
            </h1>
            <button
              type="button"
              onClick={() => navigate("/admin/blogs")}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>

          {successMessage && <div className="mb-6 p-4 rounded-md bg-green-50 text-green-800">{successMessage}</div>}
          {error && <div className="mb-6 p-4 rounded-md bg-red-50 text-red-800">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={blog.title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter blog title"
                />
              </div>

              {/* Summary */}
              <div>
                <label htmlFor="summary" className="block text-sm font-medium text-gray-700 mb-1">
                  Summary *
                </label>
                <textarea
                  id="summary"
                  name="summary"
                  value={blog.summary}
                  onChange={handleChange}
                  required
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Brief summary of the blog post"
                />
              </div>

              {/* Cover Image */}
              <div>
                <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700 mb-1">
                  Cover Image URL
                </label>
                <input
                  type="text"
                  id="coverImage"
                  name="coverImage"
                  value={blog.coverImage}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter image URL"
                />
              </div>

              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={blog.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1).replace("-", " ")}
                    </option>
                  ))}
                </select>
              </div>

              {/* Content Editor */}
              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                  Content *
                </label>
                <div className="border border-gray-300 rounded-md overflow-hidden">
                  <div ref={editorRef} className="min-h-[400px]" />
                </div>
              </div>

              {/* Publication Settings */}
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Publication Settings</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Status */}
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={blog.status}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </select>
                  </div>

                  {/* Publish Date */}
                  <div>
                    <label htmlFor="publishDate" className="block text-sm font-medium text-gray-700 mb-1">
                      Publish Date
                    </label>
                    <input
                      type="date"
                      id="publishDate"
                      name="publishDate"
                      value={blog.publishDate}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Featured */}
                <div className="mt-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="featured"
                      name="featured"
                      checked={blog.featured}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="featured" className="ml-2 block text-sm text-gray-900">
                      Feature this post (displayed prominently at the top)
                    </label>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between pt-4 border-t border-gray-200">
                <div>
                  {isEditMode && (
                    <button
                      type="button"
                      onClick={handleDelete}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      disabled={loading}
                    >
                      <Trash2 className="mr-2" />
                      Delete
                    </button>
                  )}
                </div>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => navigate("/admin/blogs")}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    disabled={loading}
                  >
                    <Save className="mr-2" />
                    {loading ? "Saving..." : "Save"}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminBlogEditor;