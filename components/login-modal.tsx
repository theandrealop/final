"use client"

import type React from "react"
import { useState } from "react"
import { X, Eye, EyeOff, Mail, Lock } from "lucide-react"
import { signIn } from "@/lib/supabase"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onSwitchToRegister?: () => void
}

export default function LoginModal({ isOpen, onClose, onSwitchToRegister }: LoginModalProps) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email.trim()) {
      newErrors.email = "L'email è obbligatoria"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Inserisci un'email valida"
    }

    if (!formData.password) {
      newErrors.password = "La password è obbligatoria"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)
    setErrors({})

    try {
      const { data, error } = await signIn(formData.email, formData.password)

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          setErrors({ general: "Email o password non corretti" })
        } else if (error.message.includes("Email not confirmed")) {
          setErrors({ general: "Conferma la tua email prima di accedere" })
        } else {
          setErrors({ general: "Errore durante l'accesso. Riprova." })
        }
      } else {
        setSuccessMessage("Accesso effettuato con successo!")
        setFormData({ email: "", password: "" })

        // Auto close after 2 seconds
        setTimeout(() => {
          onClose()
          setSuccessMessage("")
          // Refresh the page to update auth state
          window.location.reload()
        }, 2000)
      }
    } catch (error) {
      console.error("Login error:", error)
      setErrors({ general: "Errore imprevisto. Riprova più tardi." })
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-dark-green">Accedi</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
              {successMessage}
            </div>
          )}

          {/* General Error */}
          {errors.general && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">{errors.general}</div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="loginEmail" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="email"
                  id="loginEmail"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#483cff] ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="la-tua-email@esempio.com"
                />
              </div>
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="loginPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  id="loginPassword"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#483cff] ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="La tua password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#483cff] text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Accesso..." : "Accedi"}
            </button>
          </form>

          {/* Switch to Register */}
          {onSwitchToRegister && (
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Non hai un account?{" "}
                <button onClick={onSwitchToRegister} className="text-[#483cff] font-semibold hover:underline">
                  Registrati
                </button>
              </p>
            </div>
          )}

          {/* Forgot Password */}
          <div className="mt-4 text-center">
            <button className="text-sm text-gray-500 hover:text-gray-700">Password dimenticata?</button>
          </div>
        </div>
      </div>
    </div>
  )
}
