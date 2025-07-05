"use client"

import { useState, useEffect } from "react"
import { User, Mail, Calendar, CheckCircle, XCircle } from "lucide-react"
import RegistrationModal from "@/components/registration-modal"
import LoginModal from "@/components/login-modal"
import { getCurrentUser, signOut } from "@/lib/supabase"

export default function TestRegistrationPage() {
  const [showRegistrationModal, setShowRegistrationModal] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    checkCurrentUser()
  }, [])

  const checkCurrentUser = async () => {
    setIsLoading(true)
    try {
      const { user, error } = await getCurrentUser()
      if (!error && user) {
        setCurrentUser(user)
      } else {
        setCurrentUser(null)
      }
    } catch (error) {
      console.error("Error checking user:", error)
      setCurrentUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await signOut()
      setCurrentUser(null)
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const handleLoginFromRegistration = () => {
    setShowRegistrationModal(false)
    setShowLoginModal(true)
  }

  const handleRegisterFromLogin = () => {
    setShowLoginModal(false)
    setShowRegistrationModal(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream to-light-green/20 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-dark-green mb-4">Test Registrazione Utenti</h1>
          <p className="text-xl text-gray-700">
            Interfaccia di test per la registrazione e autenticazione degli utenti
          </p>
        </div>

        {/* Current User Status */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-dark-green mb-4 flex items-center gap-2">
            <User size={24} />
            Stato Utente Corrente
          </h2>

          {isLoading ? (
            <div className="flex items-center gap-2 text-gray-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#483cff]"></div>
              Caricamento...
            </div>
          ) : currentUser ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle size={20} />
                <span className="font-semibold">Utente autenticato</span>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail size={16} className="text-gray-500" />
                    <span className="text-sm text-gray-600">Email:</span>
                    <span className="font-medium">{currentUser.email}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <User size={16} className="text-gray-500" />
                    <span className="text-sm text-gray-600">ID:</span>
                    <span className="font-mono text-xs">{currentUser.id}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-gray-500" />
                    <span className="text-sm text-gray-600">Registrato:</span>
                    <span className="text-sm">{new Date(currentUser.created_at).toLocaleDateString("it-IT")}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Confermato:</span>
                    {currentUser.email_confirmed_at ? (
                      <CheckCircle size={16} className="text-green-500" />
                    ) : (
                      <XCircle size={16} className="text-red-500" />
                    )}
                  </div>

                  {currentUser.user_metadata && (
                    <>
                      {currentUser.user_metadata.first_name && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">Nome:</span>
                          <span>{currentUser.user_metadata.first_name}</span>
                        </div>
                      )}
                      {currentUser.user_metadata.last_name && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">Cognome:</span>
                          <span>{currentUser.user_metadata.last_name}</span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-red-600">
              <XCircle size={20} />
              <span>Nessun utente autenticato</span>
            </div>
          )}
        </div>

        {/* Test Actions */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-dark-green mb-4">Azioni di Test</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <button
              onClick={() => setShowRegistrationModal(true)}
              className="p-4 bg-[#483cff] text-white rounded-lg hover:opacity-90 transition-opacity font-semibold"
            >
              Testa Registrazione
            </button>

            <button
              onClick={() => setShowLoginModal(true)}
              className="p-4 bg-light-green text-dark-green rounded-lg hover:opacity-90 transition-opacity font-semibold"
            >
              Testa Login
            </button>

            <button
              onClick={checkCurrentUser}
              className="p-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
            >
              Ricarica Stato Utente
            </button>

            <button
              onClick={() => (window.location.href = "/admin/users")}
              className="p-4 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors font-semibold"
            >
              Visualizza Tutti gli Utenti
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-dark-green mb-4">Istruzioni per il Test</h2>

          <div className="space-y-4 text-gray-700">
            <div>
              <h3 className="font-semibold text-lg mb-2">1. Test Registrazione</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Clicca su "Testa Registrazione"</li>
                <li>Compila tutti i campi richiesti</li>
                <li>Usa un indirizzo email reale per ricevere la conferma</li>
                <li>La password deve essere di almeno 6 caratteri</li>
                <li>Controlla la tua email per il link di conferma</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">2. Test Login</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Clicca su "Testa Login"</li>
                <li>Usa le credenziali di un account già registrato</li>
                <li>L'account deve essere confermato via email</li>
                <li>Dopo il login, lo stato utente si aggiornerà automaticamente</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">3. Visualizzazione Utenti</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Clicca su "Visualizza Tutti gli Utenti" per vedere l'admin panel</li>
                <li>Puoi vedere tutti gli utenti registrati nel database</li>
                <li>Include statistiche e funzionalità di ricerca</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <RegistrationModal
        isOpen={showRegistrationModal}
        onClose={() => setShowRegistrationModal(false)}
        onSwitchToLogin={handleLoginFromRegistration}
      />

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSwitchToRegister={handleRegisterFromLogin}
      />
    </div>
  )
}
