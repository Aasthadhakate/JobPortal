"use client"

import { useState, useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import { FcGoogle } from "react-icons/fc"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Float, Environment, PerspectiveCamera } from "@react-three/drei"
import { motion } from "framer-motion"
import { useGoogleLogin } from "@react-oauth/google"
import axios from "axios"

// 3D Model function component
function ConnectModel(props) {
  const group = useRef()

  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = state.clock.getElapsedTime() * 0.2
    }
  })

  return (
    <group ref={group} {...props}>
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="#ffffff" roughness={0.3} metalness={0.8} />
      </mesh>
      <mesh position={[0, 0, 1.5]} castShadow>
        <torusGeometry args={[0.5, 0.2, 16, 32]} />
        <meshStandardMaterial color="#4dabf7" roughness={0.2} metalness={0.8} />
      </mesh>
      <mesh position={[1.5, 0, 0]} castShadow>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color="#4dabf7" roughness={0.2} metalness={0.8} />
      </mesh>
      <mesh position={[-1.5, 0, 0]} castShadow>
        <octahedronGeometry args={[0.5]} />
        <meshStandardMaterial color="#4dabf7" roughness={0.2} metalness={0.8} />
      </mesh>
    </group>
  )
}

// Floating particles function component
function Particles({ count = 50 }) {
  const particles = Array.from({ length: count }, (_, i) => ({
    position: [(Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10],
    size: Math.random() * 0.05 + 0.05,
  }))

  return (
    <group>
      {particles.map((particle, i) => (
        <mesh key={i} position={particle.position}>
          <sphereGeometry args={[particle.size, 8, 8]} />
          <meshStandardMaterial color="#ffffff" transparent opacity={0.6} />
        </mesh>
      ))}
    </group>
  )
}

// Scene component
function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
        <ConnectModel position={[0, 0, 0]} scale={0.8} />
      </Float>
      <Particles count={100} />
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
      <Environment preset="city" />
    </>
  )
}

const SignIn = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  // Forgot password states from first code
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [forgotPasswordStep, setForgotPasswordStep] = useState(1) // 1: Email, 2: OTP, 3: New Password
  const [forgotEmail, setForgotEmail] = useState("")
  const [forgotOtp, setForgotOtp] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmNewPassword, setConfirmNewPassword] = useState("")
  const [forgotPasswordError, setForgotPasswordError] = useState("")
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) {
      setError("Please fill in all fields.")
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("http://localhost:8080/api/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || "Invalid credentials")
        setIsLoading(false)
        return
      }

      const isAdmin = email.toLowerCase() === "datatypeit@gmail.com"

      // Store user email in localStorage
      localStorage.setItem("user", email)
      localStorage.setItem("role", isAdmin ? "admin" : "user")
      localStorage.setItem("token", data.token)

      // Fetch user details to get name and phone
      try {
        const userResponse = await axios.get(`http://localhost:8080/api/user/${email}`, {
          headers: { "Content-Type": "application/json" },
        })

        if (userResponse.data) {
          localStorage.setItem("userName", userResponse.data.name || "")
          localStorage.setItem("userPhone", userResponse.data.mobileno || "")
        }
      } catch (userError) {
        console.error("Error fetching user details:", userError)
      }

      alert("Successfully Logged in!")
      window.location.href = isAdmin ? "/adminDashboard" : "/"
    } catch (error) {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Google login handler from second code
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setIsLoading(true)
        setError("")

        // Get user info from Google using the access token
        const userInfoResponse = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`,
          },
        })

        const userInfo = userInfoResponse.data
        console.log("Google user info:", userInfo)

        // Send Google user info to your backend
        const response = await fetch("http://localhost:8080/api/google-signin", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: userInfo.email,
            googleId: userInfo.sub,
          }),
        })
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || "Google sign-in failed")
        }

        const data = await response.json()

        // Check if this is the admin email
        const isAdmin = userInfo.email.toLowerCase() === "datatypeit@gmail.com"

        // Store user info in localStorage
        localStorage.setItem("user", userInfo.email)
        localStorage.setItem("role", isAdmin ? "admin" : data.role || "user")
        localStorage.setItem("token", data.token || "")

        // Store user name from Google profile
        localStorage.setItem("userName", userInfo.name || "")

        // Fetch additional user details from your backend if needed
        try {
          const userResponse = await axios.get(`http://localhost:8080/api/user/${userInfo.email}`, {
            headers: { "Content-Type": "application/json" },
          })

          if (userResponse.data) {
            // If phone isn't available from Google, get it from your backend
            localStorage.setItem("userPhone", userResponse.data.mobileno || "")
          }
        } catch (userError) {
          console.error("Error fetching user details:", userError)
        }

        alert("Successfully Logged in with Google!")
        window.location.href = isAdmin ? "/adminDashboard" : "/"
      } catch (error) {
        console.error("Google login error:", error)
        setError("Failed to login with Google. Please try again.")
      } finally {
        setIsLoading(false)
      }
    },
    onError: (errorResponse) => {
      console.error("Google login error:", errorResponse)
      setError("Google login failed. Please try again.")
    },
  })

  // Forgot password handlers from first code
  const handleRequestOTP = async (e) => {
    e.preventDefault()
    if (!forgotEmail) {
      setForgotPasswordError("Please enter your email address")
      return
    }

    setIsLoading(true)
    setForgotPasswordError("")

    try {
      const response = await fetch("http://localhost:8080/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to send OTP")
      }

      setForgotPasswordSuccess("OTP sent to your email address")
      setForgotPasswordStep(2)
    } catch (error) {
      setForgotPasswordError(error.message || "Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOTP = async (e) => {
    e.preventDefault()
    if (!forgotOtp) {
      setForgotPasswordError("Please enter the OTP sent to your email")
      return
    }

    setIsLoading(true)
    setForgotPasswordError("")

    try {
      const response = await fetch("http://localhost:8080/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail, otp: forgotOtp }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Invalid OTP")
      }

      setForgotPasswordSuccess("OTP verified successfully")
      setForgotPasswordStep(3)
    } catch (error) {
      setForgotPasswordError(error.message || "Invalid OTP. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    if (!newPassword || !confirmNewPassword) {
      setForgotPasswordError("Please fill in all fields")
      return
    }

    if (newPassword !== confirmNewPassword) {
      setForgotPasswordError("Passwords do not match")
      return
    }

    if (newPassword.length < 6) {
      setForgotPasswordError("Password must be at least 6 characters long")
      return
    }

    setIsLoading(true)
    setForgotPasswordError("")

    try {
      const response = await fetch("http://localhost:8080/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail, otp: forgotOtp, newPassword }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to reset password")
      }

      setForgotPasswordSuccess("Password reset successfully")
      setTimeout(() => {
        setShowForgotPassword(false)
        setForgotPasswordStep(1)
        setForgotEmail("")
        setForgotOtp("")
        setNewPassword("")
        setConfirmNewPassword("")
        setForgotPasswordSuccess("")
      }, 2000)
    } catch (error) {
      setForgotPasswordError(error.message || "Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const resetForgotPassword = () => {
    setShowForgotPassword(false)
    setForgotPasswordStep(1)
    setForgotEmail("")
    setForgotOtp("")
    setNewPassword("")
    setConfirmNewPassword("")
    setForgotPasswordError("")
    setForgotPasswordSuccess("")
  }

  return (
    <div className="flex h-[80vh] w-[70vw] mx-auto my-12 shadow-2xl rounded-lg overflow-hidden bg-gray-50">
      {/* Left side - sign in form */}
      <div className="w-1/2 flex flex-col justify-center items-center bg-white p-10 border-r">
        <h2 className="text-2xl font-bold text-blue-800 mb-3">Datatype IT Consulting</h2>
        <h3 className="text-base mb-5 text-gray-700">Log in to your Account</h3>
        
        {!showForgotPassword ? (
          <>
            <button
              onClick={() => googleLogin()}
              disabled={isLoading}
              className="w-full flex items-center justify-center p-2 bg-gray-100 border rounded-md hover:bg-gray-200 transition-all mb-3 shadow-sm disabled:opacity-70"
            >
              <FcGoogle className="mr-2 text-xl" /> {isLoading ? "Processing..." : "Login with Google"}
            </button>
            <p className="mb-2 text-gray-500 text-sm">or continue with email</p>

            <form onSubmit={handleSubmit} className="w-full">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="w-full p-2 border rounded-md mb-3 focus:outline-none focus:ring-2 focus:ring-blue-800"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="w-full p-2 border rounded-md mb-3 focus:outline-none focus:ring-2 focus:ring-blue-800"
              />
              {error && <p className="text-red-500 text-xs mb-2">{error}</p>}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full p-2 bg-blue-800 text-white font-medium rounded-md disabled:opacity-70"
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </button>
            </form>

            <div className="mt-4 text-gray-600 text-sm flex flex-col items-center">
              <button onClick={() => setShowForgotPassword(true)} className="text-blue-800 hover:underline mb-2">
                Forgot your password?
              </button>
              <p>
                Don't have an account?{" "}
                <Link to="/signup" className="text-blue-800 hover:underline">
                  Sign Up
                </Link>
              </p>
            </div>
          </>
        ) : (
          <div className="w-full">
            <div className="flex items-center mb-4">
              <button onClick={resetForgotPassword} className="text-gray-500 hover:text-gray-700 mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              <h3 className="text-lg font-medium">Reset Password</h3>
            </div>

            {forgotPasswordError && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm">{forgotPasswordError}</div>
            )}

            {forgotPasswordSuccess && (
              <div className="bg-green-50 text-green-600 p-3 rounded-md mb-4 text-sm">{forgotPasswordSuccess}</div>
            )}

            {forgotPasswordStep === 1 && (
              <form onSubmit={handleRequestOTP} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="Enter your email"
                    disabled={isLoading}
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-800"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full p-2 bg-blue-800 text-white font-medium rounded-md disabled:opacity-70"
                >
                  {isLoading ? "Sending..." : "Send OTP"}
                </button>
              </form>
            )}

            {forgotPasswordStep === 2 && (
              <form onSubmit={handleVerifyOTP} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">One-Time Password</label>
                  <input
                    type="text"
                    value={forgotOtp}
                    onChange={(e) => setForgotOtp(e.target.value)}
                    placeholder="Enter OTP from your email"
                    disabled={isLoading}
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-800"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full p-2 bg-blue-800 text-white font-medium rounded-md disabled:opacity-70"
                >
                  {isLoading ? "Verifying..." : "Verify OTP"}
                </button>
              </form>
            )}

            {forgotPasswordStep === 3 && (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    disabled={isLoading}
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-800"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                  <input
                    type="password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    placeholder="Confirm new password"
                    disabled={isLoading}
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-800"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full p-2 bg-blue-800 text-white font-medium rounded-md disabled:opacity-70"
                >
                  {isLoading ? "Resetting..." : "Reset Password"}
                </button>
              </form>
            )}
          </div>
        )}
      </div>

      {/* Right Side - Enhanced with 3D and animations */}
      <div className="w-1/2 bg-gradient-to-b from-blue-900 via-blue-700 to-blue-400 flex flex-col items-center justify-center text-white p-10 text-center relative overflow-hidden">
        {/* 3D Canvas */}
        <div className="absolute inset-0 opacity-70">
          <Canvas shadows>
            <Scene />
          </Canvas>
        </div>

        {/* Content with animations and improved visibility */}
        <div className="relative z-10">
          <motion.h2
            className="text-3xl font-bold mb-4 text-white drop-shadow-md"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Welcome Back!
          </motion.h2>

          <motion.p
            className="text-base font-semibold max-w-sm leading-relaxed drop-shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Securely connect with all your applications and manage your account effortlessly.
          </motion.p>

          <motion.div
            className="mt-8 flex flex-col gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-blue-200 flex items-center justify-center text-blue-800 shadow-md">
                ✓
              </div>
              <span className="text-sm font-bold">Secure authentication</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-blue-200 flex items-center justify-center text-blue-800 shadow-md">
                ✓
              </div>
              <span className="text-sm font-bold">Easy account management</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-blue-200 flex items-center justify-center text-blue-800 shadow-md">
                ✓
              </div>
              <span className="text-sm font-bold">24/7 technical support</span>
            </div>
          </motion.div>
        </div>

        {/* Animated circles in background */}
        <div className="absolute top-10 right-10">
          <motion.div
            className="w-20 h-20 rounded-full bg-white opacity-10"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 4,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          />
        </div>
        <div className="absolute bottom-10 left-10">
          <motion.div
            className="w-32 h-32 rounded-full bg-white opacity-10"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.1, 0.15, 0.1],
            }}
            transition={{
              duration: 5,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default SignIn;