"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
// Import icons from a library like react-icons or lucide-react
// If you don't have these libraries, you can replace with your own icons or remove them

const ChatWidget = () => {
  const [isExpanded, setIsExpanded] = useState(true)
  const [isMinimized, setIsMinimized] = useState(false)
  const [chat, setChat] = useState([
    {
      id: "welcome",
      from: "bot",
      text: "👋 Welcome to DataType IT Consulting Pvt. Ltd! How can we help you today?",
      timestamp: new Date(),
      isRead: true,
    },
  ])
  const [optionIndex, setOptionIndex] = useState({})
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [suggestedQuestions, setSuggestedQuestions] = useState([])
  const chatContainerRef = useRef(null)

  // Define options with URLs
  const options = [
    {
      id: "dashboard",
      label: "View Dashboard",
      icon: "📊",
      url: "/CandidateProfile",
      description: "Access your personalized dashboard",
    },
    {
      id: "browse",
      label: "Browse Jobs",
      icon: "🔍",
      url: "/jobPosting",
      description: "Explore available job opportunities",
    },
    {
      id: "track",
      label: "Track Applications",
      icon: "📝",
      url: "/appliedJobs",
      description: "Monitor your job application status",
    },
    {
      id: "interview",
      label: "Get Interview Tips",
      icon: "💼",
      url: "/interview-tips",
      description: "Prepare for your upcoming interviews",
    },
    {
      id: "support",
      label: "Help & Support",
      icon: "🛟",
      url: "/FAQs",
      description: "Get assistance with any issues",
    },
    {
      id: "exit",
      label: "Exit",
      icon: "👋",
      url: "/",
      description: "Return to the homepage",
    },
  ]

  const responses = {
    "View Dashboard": [
      "Your dashboard includes saved jobs, applied jobs, and notifications.",
      "Keep track of interviews, documents, and profile updates from your dashboard.",
      "You can customize your dashboard view in the settings menu.",
    ],
    "Browse Jobs": [
      "Explore the latest openings across top companies. Use filters to refine your search.",
      "Find roles matching your experience and preferred location.",
      "We've added 156 new jobs in your field this week!",
    ],
    "Track Applications": [
      "Monitor the status of your job applications here.",
      "See which applications are under review, shortlisted, or rejected.",
      "You currently have 3 applications in progress.",
    ],
    "Get Interview Tips": [
      "Prepare for interviews with our curated tips and question banks.",
      "Learn how to ace technical rounds and HR interviews.",
      "Our AI interview coach can help you practice with real-time feedback.",
    ],
    "Help & Support": [
      "Need help? Contact our support team or visit the FAQ section.",
      "We're here to help! Chat with support for assistance.",
      "You can also schedule a call with our career advisors.",
    ],
    Exit: [
      "Thank you for visiting DataType IT Consulting's recruitment portal!",
      "Session ended. Good luck with your career journey!",
      "We hope to see you again soon!",
    ],
  }

  // Suggested questions that appear after bot responses
  const suggestedFollowUps = {
    "View Dashboard": ["How do I customize my dashboard?", "Where can I find my saved jobs?"],
    "Browse Jobs": ["Show me remote jobs", "Filter by salary range"],
    "Track Applications": ["What does 'under review' mean?", "How long until I hear back?"],
    "Get Interview Tips": ["Tips for technical interviews", "Common HR questions"],
    "Help & Support": ["I can't upload my resume", "How do I change my email?"],
    Exit: ["Actually, I have another question", "Reopen chat"],
  }

  // Scroll to bottom of chat when new messages are added
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [chat])

  const handleOptionClick = (option) => {
    // Find the option object that matches the label
    const selectedOption = options.find((opt) => opt.label === option)

    if (!selectedOption) return

    const index = optionIndex[option] || 0
    const allResponses = responses[option]
    const nextResponse = allResponses[index % allResponses.length]

    // Add user message
    const userMessage = {
      id: `user-${Date.now()}`,
      from: "user",
      text: option,
      timestamp: new Date(),
    }

    setChat((prev) => [...prev, userMessage])
    setIsTyping(true)

    // Simulate typing delay for bot response
    setTimeout(
      () => {
        const botMessage = {
          id: `bot-${Date.now()}`,
          from: "bot",
          text: nextResponse,
          timestamp: new Date(),
          link: {
            url: selectedOption.url,
            label: `Go to ${selectedOption.label}`,
            description: selectedOption.description,
          },
        }

        setChat((prev) => [...prev, botMessage])
        setIsTyping(false)

        // Set suggested follow-up questions
        const followUps = suggestedFollowUps[option] || []
        setSuggestedQuestions(followUps)
      },
      1000 + Math.random() * 1000,
    ) // Random delay between 1-2 seconds

    setOptionIndex((prev) => ({
      ...prev,
      [option]: index + 1,
    }))
  }

  const handleInputSubmit = (e) => {
    e.preventDefault()
    if (!inputValue.trim()) return

    // Add user message
    const userMessage = {
      id: `user-${Date.now()}`,
      from: "user",
      text: inputValue,
      timestamp: new Date(),
    }

    setChat((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Find a relevant response or use a default one
    let botResponse = "I'm not sure how to respond to that. Can you try one of the options above?"
    let selectedOption = null

    // Simple keyword matching
    const input = inputValue.toLowerCase()
    if (input.includes("dashboard") || input.includes("profile")) {
      botResponse = responses["View Dashboard"][0]
      setSuggestedQuestions(suggestedFollowUps["View Dashboard"])
      selectedOption = options.find((opt) => opt.label === "View Dashboard")
    } else if (input.includes("job") || input.includes("search") || input.includes("find")) {
      botResponse = responses["Browse Jobs"][0]
      setSuggestedQuestions(suggestedFollowUps["Browse Jobs"])
      selectedOption = options.find((opt) => opt.label === "Browse Jobs")
    } else if (input.includes("application") || input.includes("apply") || input.includes("status")) {
      botResponse = responses["Track Applications"][0]
      setSuggestedQuestions(suggestedFollowUps["Track Applications"])
      selectedOption = options.find((opt) => opt.label === "Track Applications")
    } else if (input.includes("interview") || input.includes("prepare") || input.includes("tips")) {
      botResponse = responses["Get Interview Tips"][0]
      setSuggestedQuestions(suggestedFollowUps["Get Interview Tips"])
      selectedOption = options.find((opt) => opt.label === "Get Interview Tips")
    } else if (input.includes("help") || input.includes("support") || input.includes("assist")) {
      botResponse = responses["Help & Support"][0]
      setSuggestedQuestions(suggestedFollowUps["Help & Support"])
      selectedOption = options.find((opt) => opt.label === "Help & Support")
    } else if (input.includes("exit") || input.includes("bye") || input.includes("goodbye")) {
      botResponse = responses["Exit"][0]
      setSuggestedQuestions(suggestedFollowUps["Exit"])
      selectedOption = options.find((opt) => opt.label === "Exit")
    } else {
      // Default to showing all options
      setSuggestedQuestions([])
    }

    // Simulate typing delay for bot response
    setTimeout(() => {
      const botMessage = {
        id: `bot-${Date.now()}`,
        from: "bot",
        text: botResponse,
        timestamp: new Date(),
        link: selectedOption
          ? {
              url: selectedOption.url,
              label: `Go to ${selectedOption.label}`,
              description: selectedOption.description,
            }
          : undefined,
      }

      setChat((prev) => [...prev, botMessage])
      setIsTyping(false)
    }, 1500)
  }

  const handleSuggestedQuestionClick = (question) => {
    setInputValue(question)
    // Focus the input field
    const inputField = document.getElementById("chat-input")
    if (inputField) {
      inputField.focus()
    }
  }

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized)
  }

  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  // Icons as SVG components (since we're not using an icon library)
  const BotIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 8V4H8"></path>
      <rect width="16" height="12" x="4" y="8" rx="2"></rect>
      <path d="M2 14h2"></path>
      <path d="M20 14h2"></path>
      <path d="M15 13v2"></path>
      <path d="M9 13v2"></path>
    </svg>
  )

  const UserIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  )

  const SendIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m22 2-7 20-4-9-9-4Z"></path>
      <path d="M22 2 11 13"></path>
    </svg>
  )

  const ClockIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
  )

  const CheckIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 7 17l-5-5"></path>
      <path d="m22 10-7.5 7.5L13 16"></path>
    </svg>
  )

  const SparklesIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path>
      <path d="M5 3v4"></path>
      <path d="M19 17v4"></path>
      <path d="M3 5h4"></path>
      <path d="M17 19h4"></path>
    </svg>
  )

  const XIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18"></path>
      <path d="m6 6 12 12"></path>
    </svg>
  )

  const MaximizeIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="15 3 21 3 21 9"></polyline>
      <polyline points="9 21 3 21 3 15"></polyline>
      <line x1="21" x2="14" y1="3" y2="10"></line>
      <line x1="3" x2="10" y1="21" y2="14"></line>
    </svg>
  )

  const MinimizeIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="4 14 10 14 10 20"></polyline>
      <polyline points="20 10 14 10 14 4"></polyline>
      <line x1="14" x2="21" y1="10" y2="3"></line>
      <line x1="3" x2="10" y1="21" y2="14"></line>
    </svg>
  )

  const ArrowRightIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14"></path>
      <path d="m12 5 7 7-7 7"></path>
    </svg>
  )

  const ExternalLinkIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
      <polyline points="15 3 21 3 21 9"></polyline>
      <line x1="10" x2="21" y1="14" y2="3"></line>
    </svg>
  )

  return (
    <div
      className={`fixed ${isMinimized ? "bottom-0 right-6" : "bottom-6 right-6"} z-50 transition-all duration-300 ease-in-out`}
    >
      {/* Minimized Chat Button */}
      {isMinimized && (
        <motion.button
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex items-center gap-2 bg-blue-700 text-white px-4 py-3 rounded-t-xl shadow-lg"
          onClick={toggleMinimize}
        >
          <BotIcon />
          <span className="font-medium">Chat with DataType Assistant</span>
        </motion.button>
      )}

      {/* Main Chat Widget */}
      {!isMinimized && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          className={`bg-white rounded-2xl shadow-2xl border border-blue-200 flex flex-col overflow-hidden
            ${isExpanded ? "w-[800px] h-[600px]" : "w-[350px] h-[500px]"}`}
        >
          {/* Chat Header */}
          <div className="bg-blue-700 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-blue-800 flex items-center justify-center">
                  <BotIcon />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-blue-700"></span>
              </div>
              <div>
                <h3 className="font-semibold">DataType Assistant</h3>
                <p className="text-xs text-blue-200">Online | Powered by AI</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={toggleExpand} className="p-1 hover:bg-blue-800 rounded-full transition-colors">
                {isExpanded ? <MinimizeIcon /> : <MaximizeIcon />}
              </button>
              <button onClick={toggleMinimize} className="p-1 hover:bg-blue-800 rounded-full transition-colors">
                <XIcon />
              </button>
            </div>
          </div>

          {/* Chat Body */}
          <div className="flex flex-1 overflow-hidden">
            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col">
              {/* Messages */}
              <div ref={chatContainerRef} className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50">
                <AnimatePresence>
                  {chat.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className={`flex ${msg.from === "bot" ? "justify-start" : "justify-end"}`}
                    >
                      <div className={`flex gap-2 max-w-[80%] ${msg.from === "bot" ? "flex-row" : "flex-row-reverse"}`}>
                        {/* Avatar */}
                        <div className="flex-shrink-0 mt-1">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center
                            ${msg.from === "bot" ? "bg-blue-700 text-white" : "bg-gray-200"}`}
                          >
                            {msg.from === "bot" ? <BotIcon /> : <UserIcon />}
                          </div>
                        </div>

                        {/* Message Bubble */}
                        <div className="flex flex-col">
                          <div
                            className={`p-3 rounded-2xl shadow-sm
                            ${
                              msg.from === "bot"
                                ? "bg-white border border-gray-200 text-gray-800 rounded-tl-none"
                                : "bg-blue-700 text-white rounded-tr-none"
                            }`}
                          >
                            <p className="text-sm whitespace-pre-wrap">{msg.text}</p>

                            {/* Link Button (only for bot messages with links) */}
                            {msg.from === "bot" && msg.link && (
                              <div className="mt-3 pt-3 border-t border-gray-200">
                                <div className="flex flex-col">
                                  <p className="text-xs text-gray-500 mb-2">{msg.link.description}</p>
                                  <a
                                    href={msg.link.url}
                                    className="flex items-center justify-between bg-blue-700 hover:bg-blue-800 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                                  >
                                    <span>{msg.link.label}</span>
                                    <ArrowRightIcon />
                                  </a>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Timestamp and Read Status */}
                          <div
                            className={`flex items-center mt-1 text-xs text-gray-500
                            ${msg.from === "bot" ? "justify-start" : "justify-end"}`}
                          >
                            <ClockIcon style={{ width: 10, height: 10 }} className="mr-1" />
                            <span>{formatTime(msg.timestamp)}</span>
                            {msg.from === "user" && (
                              <CheckIcon style={{ width: 12, height: 12 }} className="ml-1 text-blue-500" />
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {/* Typing Indicator */}
                  {isTyping && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                      <div className="flex gap-2 max-w-[80%]">
                        <div className="flex-shrink-0 mt-1">
                          <div className="w-8 h-8 rounded-full bg-blue-700 text-white flex items-center justify-center">
                            <BotIcon />
                          </div>
                        </div>
                        <div className="p-3 rounded-2xl bg-white border border-gray-200 rounded-tl-none shadow-sm">
                          <div className="flex space-x-1">
                            <div
                              className="w-2 h-2 bg-blue-700 rounded-full animate-bounce"
                              style={{ animationDelay: "0ms" }}
                            ></div>
                            <div
                              className="w-2 h-2 bg-blue-700 rounded-full animate-bounce"
                              style={{ animationDelay: "150ms" }}
                            ></div>
                            <div
                              className="w-2 h-2 bg-blue-700 rounded-full animate-bounce"
                              style={{ animationDelay: "300ms" }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Suggested Questions */}
              {suggestedQuestions.length > 0 && (
                <div className="p-3 bg-gray-50 border-t border-gray-200">
                  <p className="text-xs text-gray-500 mb-2 flex items-center">
                    <SparklesIcon style={{ width: 12, height: 12 }} className="mr-1" />
                    Suggested questions:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {suggestedQuestions.map((question, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSuggestedQuestionClick(question)}
                        className="text-xs bg-white hover:bg-blue-50 text-blue-700 border border-blue-200 rounded-full px-3 py-1 transition-colors"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input Area */}
              <div className="p-3 bg-white border-t border-gray-200">
                <form onSubmit={handleInputSubmit} className="flex gap-2">
                  <input
                    id="chat-input"
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Type your message here..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="submit"
                    className="bg-blue-700 text-white p-2 rounded-full hover:bg-blue-800 transition-colors"
                    disabled={!inputValue.trim()}
                  >
                    <SendIcon />
                  </button>
                </form>
              </div>
            </div>

            {/* Options Sidebar (only visible when expanded) */}
            {isExpanded && (
              <div className="w-64 bg-gray-50 border-l border-gray-200 p-4 overflow-y-auto">
                <h3 className="font-semibold text-gray-700 mb-3">Quick Actions</h3>
                <div className="space-y-2">
                  {options.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => handleOptionClick(opt.label)}
                      className="w-full flex items-center gap-2 text-left bg-white hover:bg-blue-50 text-gray-800 border border-gray-200 rounded-lg p-3 transition-all duration-200 hover:shadow-md"
                    >
                      <span className="text-xl">{opt.icon}</span>
                      <span className="text-sm font-medium">{opt.label}</span>
                    </button>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="font-semibold text-gray-700 mb-3">Resources</h3>
                  <div className="space-y-2">
                    <a href="/career-guide" className="flex items-center text-sm text-blue-700 hover:underline">
                      <ExternalLinkIcon style={{ width: 12, height: 12 }} className="mr-2" />
                      Career Guide
                    </a>
                    <a href="/resume-templates" className="flex items-center text-sm text-blue-700 hover:underline">
                      <ExternalLinkIcon style={{ width: 12, height: 12 }} className="mr-2" />
                      Resume Templates
                    </a>
                    <a href="/salary-insights" className="flex items-center text-sm text-blue-700 hover:underline">
                      <ExternalLinkIcon style={{ width: 12, height: 12 }} className="mr-2" />
                      Salary Insights
                    </a>
                    <a href="/company-reviews" className="flex items-center text-sm text-blue-700 hover:underline">
                      <ExternalLinkIcon style={{ width: 12, height: 12 }} className="mr-2" />
                      Company Reviews
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default ChatWidget;