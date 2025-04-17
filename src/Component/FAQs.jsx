"use client"

import { useState } from "react"
import ChatWidget from "./ChatWidget"
import {
  Search,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  UserPlus,
  SearchIcon,
  FileText,
  Bell,
  Settings,
  BookOpen,
  ArrowRight,
} from "lucide-react"

const faqs = [
  {
    question: "What is this website about?",
    answer:
      "This is a job recruitment portal to help job seekers find opportunities and connect with employers. Our platform streamlines the job search process and helps you find the perfect match for your skills and experience.",
  },
  {
    question: "How do I apply for a job?",
    answer:
      "You can apply for a job by creating an account, completing your profile, and submitting your application through our easy-to-use interface. Make sure your resume is up-to-date for the best results.",
  },
  {
    question: "Is registration free?",
    answer:
      "Yes, registration is completely free for job seekers. We don't charge any fees for creating an account, applying to jobs, or using our basic features.",
  },
  {
    question: "How do I create a strong profile?",
    answer:
      "To create a strong profile, include a professional photo, detailed work experience, education, skills, and a compelling summary. Complete all sections to increase your visibility to employers.",
  },
  {
    question: "Can I upload my resume?",
    answer:
      "Yes, you can upload your resume in PDF, DOC, or DOCX format. We recommend keeping your resume updated as it increases your chances of getting noticed by employers.",
  },
]

const FAQPage = () => {
  const [openIndex, setOpenIndex] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [firstName, setFirstName] = useState("") // ✅ contact form states
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  const filteredFAQs = faqs.filter((faq) => faq.question.toLowerCase().includes(searchQuery.toLowerCase()))
  const handleSubmit = async (e) => {
    e.preventDefault()
  
    const payload = {
      firstName,
      lastName,
      email,
      subject,
      message,
      source: "contact", // or "about" if needed
    }
  
    try {
      const res = await fetch("http://localhost:8080/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
  
      if (res.ok) {
        alert("Message sent successfully!")
        setFirstName("")
        setLastName("")
        setEmail("")
        setSubject("")
        setMessage("")
      } else {
        const errorData = await res.json()
        alert("Failed: " + (errorData.message || "Unknown error"))
      }
    } catch (err) {
      console.error("Submit error:", err)
      alert("An error occurred. Try again.")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-blue-600 text-white py-10 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">How can we help you?</h1>
          <p className="text-blue-100">Find answers to frequently asked questions about our job portal</p>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto py-12 px-6 flex flex-col md:flex-row items-start gap-10">
        <div className="w-full md:w-3/5">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">Frequently Asked Questions</h2>
          <div className="relative mb-8">
            <input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-4 pl-12 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
            <Search className="absolute left-4 top-4 text-gray-400" size={20} />
          </div>

          <div className="space-y-4">
            {filteredFAQs.length > 0 ? (
              filteredFAQs.map((faq, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <button
                    className="w-full text-left p-4 font-medium flex justify-between items-center bg-white hover:bg-gray-50 transition-colors"
                    onClick={() => toggleFAQ(index)} aria-expanded={openIndex === index}
                    aria-controls={`faq-answer-${index}`}
                  >
                    <span className="text-gray-800">{faq.question}</span>
                    <span className="text-blue-500 flex items-center justify-center h-6 w-6 rounded-full">
                      {openIndex === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </span>
                  </button>
                  {openIndex === index && (
                    <div className="p-4 bg-gray-50 border-t border-gray-200">
                      <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No questions found matching your search.</p>
                <button
                  onClick={() => setSearchQuery("")}
                  className="mt-2 text-blue-500 hover:text-blue-700 font-medium"
                >
                  Clear search
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="w-full md:w-2/5 flex justify-center">
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 w-full">
            <img
              src="https://i.pinimg.com/736x/74/5d/13/745d135940d3ffa73c0385c3c2522104.jpg"
              alt="FAQ Illustration"
              className="w-full rounded-lg mb-4"
            />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Still have questions?</h3>
            <p className="text-gray-600 mb-4">
              If you cannot find answer to your question in our FAQ, you can always contact us. We will answer to you
              shortly!
            </p>
            <button
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
              onClick={() => document.getElementById("contact-section").scrollIntoView({ behavior: "smooth" })}
            >
              <MessageSquare size={18} />
              <span>Contact Support</span>
            </button>
          </div>
        </div>
      </div>

      {/* Browse by Topic */}
      <div className="py-12 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-8">Browse by Topic</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 md:gap-6">
            {[
              { icon: <UserPlus size={24} />, text: "Create Profile", color: "bg-blue-50 text-blue-600" },
              { icon: <SearchIcon size={24} />, text: "Search Jobs", color: "bg-purple-50 text-purple-600" },
              { icon: <FileText size={24} />, text: "Apply", color: "bg-green-50 text-green-600" },
              { icon: <Bell size={24} />, text: "Get Notified", color: "bg-yellow-50 text-yellow-600" },
              { icon: <Settings size={24} />, text: "Settings", color: "bg-red-50 text-red-600" },
              { icon: <BookOpen size={24} />, text: "Explore Blogs", color: "bg-indigo-50 text-indigo-600" },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col items-center text-center hover:shadow-md transition-all cursor-pointer"
              >
                <div className={`w-12 h-12 rounded-full ${item.color} flex items-center justify-center mb-3`}>
                  {item.icon}
                </div>
                <p className="font-medium text-gray-800">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Us Section */}
      <div id="contact-section" className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="bg-white shadow-xl rounded-xl overflow-hidden flex flex-col md:flex-row">
            <div className="w-full md:w-1/2 bg-blue-600 text-white p-8 flex flex-col justify-center">
              <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
              <p className="mb-6 text-blue-100">
                Have questions or need assistance? Fill out the form and our team will get back to you as soon as
                possible.
              </p>
              <img
                src="https://i.pinimg.com/736x/4a/ff/d8/4affd89a9f1bef68eaddc24a749fa532.jpg"
                alt="Contact"
                className="rounded-lg shadow-lg"
              />
            </div>
            <div className="w-full md:w-1/2 p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Contact Us</h2>

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                      First Name
                    </label>
                    <input
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Enter your first name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-transparent transition-all duration-300"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                      Last Name
                    </label>
                    <input
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Enter your last name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-transparent transition-all duration-300"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-transparent transition-all duration-300"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium text-gray-700">
                      Subject
                    </label>
                    <input
                      id="subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="What is this regarding?"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-transparent transition-all duration-300"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium text-gray-700">
                    Message
                  </label>
                  <textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us how we can help you"
                    className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-transparent transition-all duration-300"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-800 hover:bg-blue-900 text-white font-medium py-3 px-4 rounded-md transition duration-300 flex items-center justify-center group"
                >
                  <span>Send Message</span>
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FAQPage

