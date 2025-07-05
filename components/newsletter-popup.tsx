"use client"

import type React from "react"

import { useState } from "react"
import { X } from "lucide-react"
import { subscribeToNewsletter } from "@/lib/buttondown"

interface NewsletterPopupProps {
  isOpen: boolean
  onClose: () => void
}

export function NewsletterPopup({ isOpen, onClose }: NewsletterPopupProps) {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsSubmitting(true)
    setSubmitMessage("")

    try {
      const result = await subscribeToNewsletter(email)

      if (result.success) {
        setSubmitMessage(result.message)
        setEmail("")
        setTimeout(() => {
          onClose()
        }, 2000)
      } else {
        setSubmitMessage(result.message)
      }
    } catch (error) {
      console.error("Newsletter signup error:", error)
      setSubmitMessage("Si è verificato un errore. Riprova più tardi.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        transform: "none",
        transition: "none",
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "16px",
          padding: "32px",
          maxWidth: "500px",
          width: "90%",
          maxHeight: "90vh",
          overflow: "auto",
          position: "relative",
          transform: "none",
          transition: "none",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "8px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background-color 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#f3f4f6"
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent"
          }}
        >
          <X size={24} color="#374151" />
        </button>

        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <h2 style={{ fontSize: "28px", fontWeight: "bold", color: "#1f2937", marginBottom: "8px" }}>
            Iscriviti alla Newsletter
          </h2>
          <p style={{ color: "#6b7280", fontSize: "16px" }}>
            Ricevi le migliori offerte di volo direttamente nella tua casella email
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ marginBottom: "16px" }}>
          <div style={{ marginBottom: "16px" }}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="La tua email"
              required
              style={{
                width: "100%",
                padding: "12px 16px",
                border: "2px solid #e5e7eb",
                borderRadius: "8px",
                fontSize: "16px",
                outline: "none",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#483cff"
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#e5e7eb"
              }}
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              width: "100%",
              padding: "12px 24px",
              backgroundColor: "#483cff",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: isSubmitting ? "not-allowed" : "pointer",
              opacity: isSubmitting ? 0.5 : 1,
              transition: "opacity 0.2s",
            }}
            onMouseEnter={(e) => {
              if (!isSubmitting) {
                e.currentTarget.style.opacity = "0.9"
              }
            }}
            onMouseLeave={(e) => {
              if (!isSubmitting) {
                e.currentTarget.style.opacity = "1"
              }
            }}
          >
            {isSubmitting ? "Invio..." : "Iscriviti"}
          </button>
        </form>

        {submitMessage && (
          <p
            style={{
              textAlign: "center",
              fontSize: "14px",
              color: submitMessage.includes("Grazie") ? "#059669" : "#dc2626",
            }}
          >
            {submitMessage}
          </p>
        )}

        <p style={{ fontSize: "12px", color: "#9ca3af", textAlign: "center", marginTop: "16px" }}>
          Gratuito per sempre • Nessuna carta di credito richiesta
        </p>
      </div>
    </div>
  )
}
