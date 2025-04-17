import { useState } from "react"
import { Search, UserCheck, BadgeCheck, ArrowRight,} from "lucide-react"

export default function AboutUs() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: "",
    source: "about",
  })

  const [status, setStatus] = useState(null)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const res = await fetch("http://localhost:8080/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        setStatus("Message sent successfully!")
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          subject: "",
          message: "",
        })
      } else {
        setStatus("Failed to send message. Please try again.")
      }
    } catch (err) {
      console.error(err)
      setStatus("Something went wrong.")
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div
        className="h-[400px] relative bg-indigo-900 flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage:
            'linear-gradient(rgba(30, 27, 75, 0.85), rgba(30, 27, 75, 0.85)), url("https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80")',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/30 to-indigo-800/30 animate-gradient-x"></div>
        <h1 className="text-5xl font-bold text-white text-center relative animate-fade-in">About Us</h1>
      </div>

      {/* About Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="md:w-1/2 animate-slide-up">
            <h2 className="text-4xl font-bold text-blue-800 mb-6">
              About
              <br />
              Datatype IT Consulting
            </h2>
            <p className="text-gray-600 mb-6">
              Datatype IT Consulting is a premier recruitment portal connecting businesses with top-tier IT professionals.
              We specialize in temporary, permanent, and contract staffing, ensuring organizations find the right talent to
              meet their project needs.
            </p>
            <p className="text-gray-600 mb-8">
              Our platform streamlines the hiring process, making it easier for companies to discover skilled candidates
              while helping job seekers find opportunities that match their expertise.
            </p>
          </div>
          <div className="md:w-1/2 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
              alt="Professional with tablet"
              className="rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
            />
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-gray-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-blue-800 text-center mb-4 font-medium">APPLY PROCESS</p>
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-16">How it works</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Search className="w-16 h-16 text-blue-800 transition duration-300 group-hover:text-white" />,
                title: "1. Search a job",
                description:
                  "Browse through thousands of opportunities and find the perfect position that matches your skills and aspirations.",
                delay: "0s",
              },
              {
                icon: <UserCheck className="w-16 h-16 text-blue-800 transition duration-300 group-hover:text-white" />,
                title: "2. Apply for job",
                description: "Submit your application with ease using our streamlined process and professional tools.",
                delay: "0.2s",
              },
              {
                icon: <BadgeCheck className="w-16 h-16 text-blue-800 transition duration-300 group-hover:text-white" />,
                title: "3. Get your job",
                description: "Connect with employers and take the next step in your career journey.",
                delay: "0.4s",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="text-center bg-white border border-blue-800 p-8 rounded-lg transition duration-500 hover:bg-blue-800 hover:text-white group transform hover:-translate-y-2 hover:shadow-xl animate-slide-up"
                style={{ animationDelay: item.delay }}
              >
                <div className="flex justify-center mb-6">{item.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 transition duration-300 group-hover:text-white">
                  {item.title}
                </h3>
                <p className="text-gray-600 transition duration-300 group-hover:text-white">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-blue-800 text-center mb-4 font-medium">CONTACT US</p>
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-16">Get in Touch</h2>

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

                {/* Contact Form */}
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                        First Name
                      </label>
                      <input
                        id="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
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
                        value={formData.lastName}
                        onChange={handleChange}
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
                        value={formData.email}
                        onChange={handleChange}
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
                        value={formData.subject}
                        onChange={handleChange}
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
                      value={formData.message}
                      onChange={handleChange}
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

                  {status && (
                    <p className="mt-4 text-sm text-center text-blue-800 font-medium">{status}</p>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
