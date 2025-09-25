// Full CRUD Dashboard
"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

type Project = {
  _id: string
  title: string
  description: string
  link?: string
}

type Message = {
  _id: string
  name: string
  email: string
  message: string
}

export default function AdminPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)

  // New project form
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [link, setLink] = useState("")

  // Editing states
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null)
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null)

  // Fetch data
  useEffect(() => {
    fetchProjects()
    fetchMessages()
  }, [])

  async function fetchProjects() {
    const res = await fetch("/api/projects")
    const data = await res.json()
    setProjects(data)
  }

  async function fetchMessages() {
    const res = await fetch("/api/messages")
    const data = await res.json()
    setMessages(data)
  }

  // Add project
  async function addProject() {
    setLoading(true)
    await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, link }),
    })
    setTitle("")
    setDescription("")
    setLink("")
    await fetchProjects()
    setLoading(false)
  }

  // Update project
  async function updateProject(id: string, updated: Partial<Project>) {
    await fetch("/api/projects", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...updated }),
    })
    setEditingProjectId(null)
    await fetchProjects()
  }

  // Delete project
  async function deleteProject(id: string) {
    await fetch("/api/projects", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })
    await fetchProjects()
  }

  // Update message
  async function updateMessage(id: string, updated: Partial<Message>) {
    await fetch("/api/messages", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...updated }),
    })
    setEditingMessageId(null)
    await fetchMessages()
  }

  // Delete message
  async function deleteMessage(id: string) {
    await fetch("/api/messages", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })
    await fetchMessages()
  }

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Projects Section */}
      <Card>
        <CardHeader>
          <CardTitle>Projects</CardTitle>
        </CardHeader>
        <CardContent>
          {/* New project form */}
          <div className="space-y-3">
            <Input
              placeholder="Project Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Textarea
              placeholder="Project Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <Input
              placeholder="Project Link"
              value={link}
              onChange={(e) => setLink(e.target.value)}
            />
            <Button onClick={addProject} disabled={loading}>
              {loading ? "Adding..." : "Add Project"}
            </Button>
          </div>

          {/* Projects list */}
          <div className="mt-6 space-y-3">
            {projects.map((p) => (
              <Card key={p._id} className="p-3">
                {editingProjectId === p._id ? (
                  <>
                    <Input
                      defaultValue={p.title}
                      onChange={(e) =>
                        setProjects((prev) =>
                          prev.map((proj) =>
                            proj._id === p._id
                              ? { ...proj, title: e.target.value }
                              : proj
                          )
                        )
                      }
                    />
                    <Textarea
                      defaultValue={p.description}
                      onChange={(e) =>
                        setProjects((prev) =>
                          prev.map((proj) =>
                            proj._id === p._id
                              ? { ...proj, description: e.target.value }
                              : proj
                          )
                        )
                      }
                    />
                    <Input
                      defaultValue={p.link}
                      onChange={(e) =>
                        setProjects((prev) =>
                          prev.map((proj) =>
                            proj._id === p._id
                              ? { ...proj, link: e.target.value }
                              : proj
                          )
                        )
                      }
                    />
                    <div className="flex gap-2 mt-2">
                      <Button
                        onClick={() =>
                          updateProject(p._id, {
                            title: p.title,
                            description: p.description,
                            link: p.link,
                          })
                        }
                      >
                        Save
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => setEditingProjectId(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="font-bold">{p.title}</p>
                    <p>{p.description}</p>
                    {p.link && (
                      <a
                        href={p.link}
                        target="_blank"
                        className="text-blue-500 underline text-sm"
                      >
                        {p.link}
                      </a>
                    )}
                    <div className="flex gap-2 mt-2">
                      <Button
                        variant="secondary"
                        onClick={() => setEditingProjectId(p._id)}
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => deleteProject(p._id)}
                        variant="destructive"
                      >
                        Delete
                      </Button>
                    </div>
                  </>
                )}
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Messages Section */}
      <Card>
        <CardHeader>
          <CardTitle>Messages</CardTitle>
        </CardHeader>
        <CardContent>
          {messages.map((m) => (
            <Card key={m._id} className="p-3 mb-3">
              {editingMessageId === m._id ? (
                <>
                  <Input
                    defaultValue={m.name}
                    onChange={(e) =>
                      setMessages((prev) =>
                        prev.map((msg) =>
                          msg._id === m._id
                            ? { ...msg, name: e.target.value }
                            : msg
                        )
                      )
                    }
                  />
                  <Input
                    defaultValue={m.email}
                    onChange={(e) =>
                      setMessages((prev) =>
                        prev.map((msg) =>
                          msg._id === m._id
                            ? { ...msg, email: e.target.value }
                            : msg
                        )
                      )
                    }
                  />
                  <Textarea
                    defaultValue={m.message}
                    onChange={(e) =>
                      setMessages((prev) =>
                        prev.map((msg) =>
                          msg._id === m._id
                            ? { ...msg, message: e.target.value }
                            : msg
                        )
                      )
                    }
                  />
                  <div className="flex gap-2 mt-2">
                    <Button
                      onClick={() =>
                        updateMessage(m._id, {
                          name: m.name,
                          email: m.email,
                          message: m.message,
                        })
                      }
                    >
                      Save
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => setEditingMessageId(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <p className="font-bold">{m.name}</p>
                  <p className="text-sm text-gray-500">{m.email}</p>
                  <p className="mt-2">{m.message}</p>
                  <div className="flex gap-2 mt-2">
                    <Button
                      variant="secondary"
                      onClick={() => setEditingMessageId(m._id)}
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => deleteMessage(m._id)}
                      variant="destructive"
                    >
                      Delete
                    </Button>
                  </div>
                </>
              )}
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}



  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">📩 Admin Dashboard</h1>

      {/* Auth Input */}
      <div className="flex space-x-2 mb-4">
        <input
          type="password"
          placeholder="Enter Admin Secret"
          value={authKey}
          onChange={(e) => setAuthKey(e.target.value)}
          className="border p-2 flex-1 rounded"
        />
        <button
          onClick={() => fetchMessages(1)}
          disabled={loading || !authKey}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Loading..." : "Login"}
        </button>
      </div>

      {/* Search */}
      {authKey && (
        <div className="flex space-x-2 mb-4">
          <input
            type="text"
            placeholder="Search messages..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 flex-1 rounded"
          />
          <button
            onClick={() => fetchMessages(1, search)}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Search
          </button>
        </div>
      )}

      {error && <p className="text-red-600">{error}</p>}

      {/* Messages Table */}
      {messages.length > 0 && (
        <div>
          <table className="w-full border border-gray-300 rounded shadow-sm mt-6">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Message</th>
                <th className="p-2 border">Date</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((msg) => (
                <tr key={msg._id} className="hover:bg-gray-50">
                  <td className="p-2 border">{msg.name}</td>
                  <td className="p-2 border">{msg.email}</td>
                  <td className="p-2 border">{msg.message}</td>
                  <td className="p-2 border">{new Date(msg.createdAt).toLocaleString()}</td>
                  <td className="p-2 border text-center">
                    <button
                      onClick={() => deleteMessage(msg._id)}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          {pagination && (
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={() => fetchMessages(page - 1)}
                disabled={page <= 1}
                className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
              >
                Prev
              </button>
              <p>
                Page {pagination.page} of {pagination.pages} (Total: {pagination.total})
              </p>
              <button
                onClick={() => fetchMessages(page + 1)}
                disabled={page >= pagination.pages}
                className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}



export default function AdminPage() {
  const [authKey, setAuthKey] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function fetchMessages() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/messages?auth=${authKey}`);
      if (!res.ok) throw new Error("Unauthorized or failed request");
      const data = await res.json();
      setMessages(data.messages);
    } catch (err: any) {
      setError(err.message || "Error fetching messages");
    } finally {
      setLoading(false);
    }
  }

  async function deleteMessage(id: string) {
    if (!confirm("Are you sure you want to delete this message?")) return;

    try {
      const res = await fetch(`/api/messages?auth=${authKey}&id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      setMessages(messages.filter((msg) => msg._id !== id));
    } catch (err: any) {
      alert(err.message || "Error deleting message");
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">📩 Admin Dashboard</h1>

      {/* Auth Input */}
      <div className="flex space-x-2 mb-4">
        <input
          type="password"
          placeholder="Enter Admin Secret"
          value={authKey}
          onChange={(e) => setAuthKey(e.target.value)}
          className="border p-2 flex-1 rounded"
        />
        <button
          onClick={fetchMessages}
          disabled={loading || !authKey}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Loading..." : "Login"}
        </button>
      </div>

      {error && <p className="text-red-600">{error}</p>}

      {/* Messages Table */}
      {messages.length > 0 && (
        <table className="w-full border border-gray-300 rounded shadow-sm mt-6">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Message</th>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {messages.map((msg) => (
              <tr key={msg._id} className="hover:bg-gray-50">
                <td className="p-2 border">{msg.name}</td>
                <td className="p-2 border">{msg.email}</td>
                <td className="p-2 border">{msg.message}</td>
                <td className="p-2 border">
                  {new Date(msg.createdAt).toLocaleString()}
                </td>
                <td className="p-2 border text-center">
                  <button
                    onClick={() => deleteMessage(msg._id)}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
