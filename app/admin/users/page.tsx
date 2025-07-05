"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Search, Users, Mail, Calendar, RefreshCw } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface AuthUser {
  id: string
  email: string
  email_confirmed_at: string | null
  created_at: string
  user_metadata: {
    first_name?: string
    last_name?: string
  }
  last_sign_in_at: string | null
}

interface NewsletterUser {
  id: string
  email: string
  created_at: string
}

export default function AdminUsersPage() {
  const [authUsers, setAuthUsers] = useState<AuthUser[]>([])
  const [newsletterUsers, setNewsletterUsers] = useState<NewsletterUser[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [error, setError] = useState("")

  const fetchUsers = async () => {
    setIsLoading(true)
    setError("")

    try {
      // Fetch authenticated users (requires service role key)
      const { data: authData, error: authError } = await supabase.auth.admin.listUsers()

      if (authError) {
        console.error("Auth users error:", authError)
        setError("Impossibile caricare gli utenti autenticati. Verifica le credenziali admin.")
      } else {
        setAuthUsers(authData.users || [])
      }

      // Fetch newsletter signups
      const { data: newsletterData, error: newsletterError } = await supabase
        .from("newsletter_signups")
        .select("*")
        .order("created_at", { ascending: false })

      if (newsletterError) {
        console.error("Newsletter users error:", newsletterError)
        setError((prev) => prev + " Impossibile caricare gli iscritti alla newsletter.")
      } else {
        setNewsletterUsers(newsletterData || [])
      }
    } catch (err) {
      console.error("Fetch users error:", err)
      setError("Errore durante il caricamento dei dati.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const filteredAuthUsers = authUsers.filter(
    (user) =>
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.user_metadata.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.user_metadata.last_name?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredNewsletterUsers = newsletterUsers.filter((user) =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("it-IT", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Caricamento utenti...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestione Utenti</h1>
          <p className="text-muted-foreground">Visualizza e gestisci gli utenti registrati</p>
        </div>
        <Button onClick={fetchUsers} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Aggiorna
        </Button>
      </div>

      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Cerca per email o nome..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utenti Registrati</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{authUsers.length}</div>
            <p className="text-xs text-muted-foreground">
              {authUsers.filter((u) => u.email_confirmed_at).length} confermati
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Newsletter</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{newsletterUsers.length}</div>
            <p className="text-xs text-muted-foreground">iscritti alla newsletter</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Oggi</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {authUsers.filter((u) => new Date(u.created_at).toDateString() === new Date().toDateString()).length}
            </div>
            <p className="text-xs text-muted-foreground">nuove registrazioni</p>
          </CardContent>
        </Card>
      </div>

      {/* Authenticated Users */}
      <Card>
        <CardHeader>
          <CardTitle>Utenti Autenticati ({filteredAuthUsers.length})</CardTitle>
          <CardDescription>Utenti che hanno completato la registrazione con email e password</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredAuthUsers.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">Nessun utente autenticato trovato</p>
            ) : (
              filteredAuthUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">
                        {user.user_metadata.first_name} {user.user_metadata.last_name}
                      </p>
                      {user.email_confirmed_at ? (
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          Confermato
                        </Badge>
                      ) : (
                        <Badge variant="secondary">In attesa</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <p className="text-xs text-muted-foreground">Registrato: {formatDate(user.created_at)}</p>
                    {user.last_sign_in_at && (
                      <p className="text-xs text-muted-foreground">
                        Ultimo accesso: {formatDate(user.last_sign_in_at)}
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Newsletter Users */}
      <Card>
        <CardHeader>
          <CardTitle>Iscritti Newsletter ({filteredNewsletterUsers.length})</CardTitle>
          <CardDescription>Utenti che si sono iscritti alla newsletter</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredNewsletterUsers.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">Nessun iscritto alla newsletter trovato</p>
            ) : (
              filteredNewsletterUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <p className="font-medium">{user.email}</p>
                    <p className="text-xs text-muted-foreground">Iscritto: {formatDate(user.created_at)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
