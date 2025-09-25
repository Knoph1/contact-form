import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { requireAdmin } from "@/lib/auth"

export async function POST(req: Request) {
  const authError = requireAdmin(req as any)
  if (authError) return authError

  const body = await req.json()
  const client = await clientPromise
  const db = client.db("portfolio")
  const result = await db.collection("projects").insertOne(body)

  return NextResponse.json({ success: true, id: result.insertedId })
}

export async function GET(req: Request) {
  const authError = requireAdmin(req as any)
  if (authError) return authError

  const client = await clientPromise
  const db = client.db("portfolio")
  const projects = await db.collection("projects").find({}).toArray()

  return NextResponse.json(projects)
}

export async function PUT(req: Request) {
  const authError = requireAdmin(req as any)
  if (authError) return authError

  const { id, ...updateData } = await req.json()
  const client = await clientPromise
  const db = client.db("portfolio")

  const result = await db
    .collection("projects")
    .updateOne({ _id: new ObjectId(id) }, { $set: updateData })

  if (result.matchedCount === 0) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 })
  }

  return NextResponse.json({ success: true })
}

export async function DELETE(req: Request) {
  const authError = requireAdmin(req as any)
  if (authError) return authError

  const { id } = await req.json()
  const client = await clientPromise
  const db = client.db("portfolio")

  const result = await db.collection("projects").deleteOne({ _id: new ObjectId(id) })
  if (result.deletedCount === 0) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 })
  }

  return NextResponse.json({ success: true })
}



const headers = {
  "Content-Type": "application/json",
  "x-admin-secret": process.env.NEXT_PUBLIC_ADMIN_SECRET
}



await fetch("/api/projects", {
  method: "POST",
  headers,
  body: JSON.stringify({ title, description, link }),
})



const authError = requireAdmin(req as any)
if (authError) return authError



import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

// CREATE project
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const client = await clientPromise
    const db = client.db("portfolio")
    const result = await db.collection("projects").insertOne(body)

    return NextResponse.json({ success: true, id: result.insertedId })
  } catch (error) {
    return NextResponse.json({ error: "Failed to add project" }, { status: 500 })
  }
}

// READ all projects
export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("portfolio")
    const projects = await db.collection("projects").find({}).toArray()

    return NextResponse.json(projects)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 })
  }
}

// UPDATE project
export async function PUT(req: Request) {
  try {
    const { id, ...updateData } = await req.json()
    const client = await clientPromise
    const db = client.db("portfolio")

    const result = await db
      .collection("projects")
      .updateOne({ _id: new ObjectId(id) }, { $set: updateData })

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 })
  }
}

// DELETE project
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json()
    const client = await clientPromise
    const db = client.db("portfolio")

    const result = await db.collection("projects").deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 })
  }
}
