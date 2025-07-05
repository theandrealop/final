// Buttondown API integration
const BUTTONDOWN_API_KEY = "25701f26-6537-4cb8-9449-5873372f0265"
const BUTTONDOWN_API_URL = "https://api.buttondown.email/v1/subscribers"

export interface ButtondownResponse {
  success: boolean
  message: string
  error?: string
}

export const subscribeToNewsletter = async (email: string): Promise<ButtondownResponse> => {
  const cleanedEmail = email.trim().toLowerCase()

  try {
    const response = await fetch(BUTTONDOWN_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Token ${BUTTONDOWN_API_KEY}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        email_address: cleanedEmail,
        tags: ["newsletter", "website"],
      }),
    })

    if (response.ok) {
      return {
        success: true,
        message: "Grazie! Ti abbiamo aggiunto alla nostra newsletter.",
      }
    }

    // Try to parse Buttondown's error payload
    const errJson = await response.json().catch(() => ({}))

    // Duplicate email case (Buttondown returns 400 or 422 depending on the account)
    if (response.status === 400 || response.status === 422) {
      const msgFromAPI =
        errJson?.email_address?.[0] ?? errJson?.detail ?? "L'indirizzo email non è valido o è già registrato."

      // Map to friendlier copy for the UI
      const friendly = /already exists/i.test(msgFromAPI)
        ? "Questa email è già registrata alla newsletter!"
        : "L'indirizzo email non è valido."

      return { success: false, message: friendly, error: msgFromAPI }
    }

    // Any other non-OK status
    throw new Error(`HTTP ${response.status}: ${errJson?.detail || "Unknown error"}`)
  } catch (error) {
    console.error("Buttondown API error:", error)
    return {
      success: false,
      message: "Andrea it's better to change platform for your newsletter",
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
