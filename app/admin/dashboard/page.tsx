"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

<Button
  onClick={() => {
    localStorage.removeItem("admin-auth")
    router.push("/admin/login")
  }}
  variant="destructive"
>
  Logout
</Button>

export default function AdminPageWrapper() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const auth = localStorage.getItem("admin-auth")
    if (auth !== process.env.NEXT_PUBLIC_ADMIN_SECRET) {
      router.push("/admin/login")
    } else {
      setLoading(false)
    }
  }, [router])

  if (loading) return <p>Loading...</p>

  return <AdminDashboard /> // Your previous full CRUD component
}
