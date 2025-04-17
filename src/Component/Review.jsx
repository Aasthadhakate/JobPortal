"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { ChevronLeft, ChevronRight, Check, AlertCircle } from "lucide-react"

export default function Review() {
  const [formData, setFormData] = useState({
    name: "",
    rating: 5,
    comment: "",
  })

  const [reviews, setReviews] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSignedIn, setIsSignedIn] = useState(false) // This would be determined by your auth system
  const [showAuthWarning, setShowAuthWarning] = useState(false)

  useEffect(() => {
    fetchReviews()
    // In a real app, you would check authentication status here
  }, [])

  const fetchReviews = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/reviews")
      setReviews(res.data)
    } catch (err) {
      console.error("Error fetching reviews:", err)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "rating" ? Number.parseInt(value) : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Check if user is signed in
    if (!isSignedIn) {
      setShowAuthWarning(true)
      return
    }

    setIsLoading(true)
    setShowAuthWarning(false)

    try {
      await axios.post("http://localhost:8080/api/reviews", formData, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      })

      setIsSubmitted(true)
      setTimeout(() => {
        setFormData({ name: "", rating: 5, comment: "" })
        setIsSubmitted(false)
      }, 2000)

      await fetchReviews()
    } catch (err) {
      console.error("Failed to submit review:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === reviews.length - 1 ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? reviews.length - 1 : prev - 1))
  }

  const goToSlide = (index) => {
    setCurrentSlide(index)
  }

  const renderStars = (rating) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(
          <span key={i} className="text-amber-400">
            ★
          </span>,
        )
      } else {
        stars.push(
          <span key={i} className="text-gray-300">
            ☆
          </span>,
        )
      }
    }
    return <div className="flex">{stars}</div>
  }

  return (
    <div className="max-w-6xl mx-auto p-3 bg-white rounded-lg shadow-sm">
      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Customer Testimonials</h1>
        <p className="text-sm text-gray-600 mt-1">See what our customers are saying about us</p>
      </div>

      <div className="grid md:grid-cols-12 gap-4">
        {/* Form Section */}
        <div className="md:col-span-5 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-100">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Share Your Experience</h2>
              <p className="text-xs text-gray-500">Your feedback helps us improve</p>
            </div>
          </div>

          {showAuthWarning && (
            <div className="mb-3 p-2 bg-amber-50 border border-amber-200 rounded-md flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-amber-800">Authentication Required</h4>
                <p className="text-xs text-amber-700 mt-0.5">You need to sign in before submitting a review.</p>
              </div>
            </div>
          )}

          {isSubmitted ? (
            <div className="text-center py-4">
              <div className="mx-auto w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mb-2">
                <Check className="w-4 h-4 text-green-600" />
              </div>
              <h3 className="text-base font-medium text-gray-800">Thank You!</h3>
              <p className="text-sm text-gray-600">Your review has been submitted successfully.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label htmlFor="name" className="block text-xs font-medium text-gray-700 mb-1">
                  Your Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter your name"
                  className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="rating" className="block text-xs font-medium text-gray-700 mb-1">
                  Your Rating <span className="text-red-500">*</span>
                </label>
                <div className="space-y-1">
                  <select
                    id="rating"
                    name="rating"
                    value={formData.rating}
                    onChange={handleChange}
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {[1, 2, 3, 4, 5].map((num) => (
                      <option key={num} value={num}>
                        {num} Star{num !== 1 ? "s" : ""}
                      </option>
                    ))}
                  </select>
                  <div className="flex text-lg">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`cursor-pointer ${star <= formData.rating ? "text-amber-400" : "text-gray-300"}`}
                        onClick={() => setFormData((prev) => ({ ...prev, rating: star }))}
                      >
                        {star <= formData.rating ? "★" : "☆"}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="comment" className="block text-xs font-medium text-gray-700 mb-1">
                  Your Review <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="comment"
                  name="comment"
                  value={formData.comment}
                  onChange={handleChange}
                  rows="3"
                  required
                  placeholder="Tell us about your experience..."
                  className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-1.5 px-3 rounded-md transition-colors"
                disabled={isLoading}
              >
                {isLoading ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          )}
        </div>

        {/* Reviews Section */}
        <div className="md:col-span-7 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="mb-3 pb-2 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 text-center">What Our Customers Say</h2>
          </div>

          {reviews.length > 0 ? (
            <div className="relative">
              <div className="flex justify-between items-center mb-2">
                <button
                  onClick={prevSlide}
                  className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                  aria-label="Previous review"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div className="text-xs text-gray-500">
                  <span className="font-medium text-gray-700">{currentSlide + 1}</span> / {reviews.length}
                </div>
                <button
                  onClick={nextSlide}
                  className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                  aria-label="Next review"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="min-h-[200px]">
                {reviews.map((review, index) => (
                  <div key={review.id} className={`${index === currentSlide ? "block" : "hidden"}`}>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="mb-2">
                        <h3 className="text-sm font-medium text-gray-800">{review.name}</h3>
                        <div className="flex justify-between items-center mt-0.5">
                          <div className="text-base">{renderStars(review.rating)}</div>
                          <div className="text-xs text-gray-400">ID: {review.id}</div>
                        </div>
                      </div>

                      <div className="mb-2">
                        <p className="text-sm text-gray-700">{review.comment}</p>
                      </div>

                      <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                        <div className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded-full">
                          <Check className="w-3 h-3" />
                          <span>Verified</span>
                        </div>
                        <div className="text-xs text-gray-400">{new Date().toLocaleDateString()}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-center gap-1 mt-2">
                {reviews.map((_, index) => (
                  <button
                    key={index}
                    className={`w-1.5 h-1.5 rounded-full ${index === currentSlide ? "bg-blue-600" : "bg-gray-300"}`}
                    onClick={() => goToSlide(index)}
                    aria-label={`Go to review ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                <span className="text-xl">?</span>
              </div>
              <h3 className="text-base font-medium text-gray-800">No Reviews Yet</h3>
              <p className="text-sm text-gray-600">Be the first to share your experience with us!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
