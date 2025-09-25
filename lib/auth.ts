import { NextRequest, NextResponse } from "next/server"

export function requireAdmin(req: NextRequest) {
  const authHeader = req.headers.get("x-admin-secret")
  if (authHeader !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  return null
}
