"use client"

import { useState, useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Float, Environment, PerspectiveCamera } from "@react-three/drei"
import { motion } from "framer-motion"

// 3D Model function component (inside the main component)
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

// Floating particles function component (inside the main component)
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

// Scene component (inside the main component)
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

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirm_password: "", // ✅ Default value to prevent "uncontrolled input" warning
    mobileno: "",
    workStatus: "Fresher",
  })

  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { name, email, password, confirm_password, mobileno, workStatus } = formData

    // ✅ Validation
    if (!name || !email || !password || !confirm_password || !mobileno) {
      setError("All fields are required.")
      return
    }
    if (password !== confirm_password) {
      setError("Passwords do not match.")
      return
    }

    const dataToSend = {
      name,
      email,
      password,
      confirm_password, // ✅ Fix: Include this field
      mobileno: String(mobileno),
      workStatus,
    }

    try {
      console.log("Sending data to backend:", dataToSend)

      const response = await axios.post("http://localhost:8080/api/signup", dataToSend, {
        headers: { "Content-Type": "application/json" },
      })

      console.log("Response:", response)

      if (response.status === 201) {
        // Store user information in localStorage for profile page
        localStorage.setItem("user", email)
        localStorage.setItem("userName", name)
        localStorage.setItem("userPhone", mobileno)

        alert("Registration Successful!")
        navigate("/signin")
      } else {
        setError("Signup failed! Try again.")
      }
    } catch (error) {
      console.error("Signup error:", error.response?.data || error.message)
      setError(error.response?.data?.message || "An error occurred. Please try again.")
    }
  }

  return (
    <div className="flex h-[80vh] w-[70vw] mx-auto my-12 shadow-2xl rounded-lg overflow-hidden bg-gray-50">
      <div className="w-1/2 flex flex-col justify-start items-center bg-white p-10 border-r max-h-full overflow-y-auto">
        <h2 className="text-2xl font-bold text-blue-800 mb-3">Datatype IT Consulting</h2>
        <p className="mb-2 text-gray-500 text-sm">"Create your account"</p>
        <form onSubmit={handleSubmit} className="w-full">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded-md mb-3"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border rounded-md mb-3"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 border rounded-md mb-3"
            required
          />
          <input
            type="password"
            name="confirm_password"
            placeholder="Confirm Password"
            value={formData.confirm_password}
            onChange={handleChange}
            className="w-full p-2 border rounded-md mb-3"
            required
          />
          <input
            type="text"
            name="mobileno"
            placeholder="Mobile Number"
            value={formData.mobileno}
            onChange={handleChange}
            className="w-full p-2 border rounded-md mb-3"
            required
          />
          <select
            name="workStatus"
            value={formData.workStatus}
            onChange={handleChange}
            className="w-full p-2 border rounded-md mb-3"
          >
            <option value="Fresher">Fresher</option>
            <option value="Experienced">Experienced</option>
          </select>
          {error && <p className="text-red-500 text-xs mb-2">{error}</p>}
          <button type="submit" className="w-full p-2 bg-blue-800 text-white font-medium rounded-md">
            Sign Up
          </button>
        </form>
        <p className="mt-4 text-gray-600 text-sm">
          Already have an account?{" "}
          <Link to="/signin" className="text-blue-800 hover:underline">
            Sign In
          </Link>
        </p>
      </div>

      {/* Right Side - Enhanced with 3D and animations */}
      <div className="w-1/2 bg-gradient-to-b from-blue-900 via-blue-700 to-blue-400 flex flex-col items-center justify-center text-white p-10 text-center relative overflow-hidden">
        {/* 3D Canvas */}
        <div className="absolute inset-0 opacity-70">
          <Canvas shadows>
            <Scene />
          </Canvas>
        </div>

        {/* Content with animations */}
        <div className="relative z-10">
          <motion.h2
            className="text-3xl font-bold mb-4 text-white drop-shadow-md"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Join Us Today!
          </motion.h2>

          <motion.p
            className="text-base font-semibold max-w-sm leading-relaxed drop-shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Unlock endless possibilities and seamlessly connect with your applications.
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
              <span className="text-sm font-bold">Advanced data integration</span>
            </div>
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

export default SignUp

