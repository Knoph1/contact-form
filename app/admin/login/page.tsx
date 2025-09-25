"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminLogin() {
  const [secret, setSecret] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleLogin = () => {
    if (secret === process.env.NEXT_PUBLIC_ADMIN_SECRET) {
      localStorage.setItem("admin-auth", secret)
      router.push("/admin/dashboard")
    } else {
      setError("Invalid secret key")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md p-6">
        <CardHeader>
          <CardTitle>Admin Login</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            type="password"
            placeholder="Enter Admin Secret"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
          />
          <Button onClick={handleLogin} className="w-full">
            Login
          </Button>
          {error && <p className="text-red-600">{error}</p>}
        </CardContent>
      </Card>
    </div>
  )
}
