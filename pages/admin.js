"use client";
import { useState, useEffect } from "react";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [days, setDays] = useState("");

  const fetchMessages = async () => {
    try {
      const query = new URLSearchParams({ password, search, status, days });
      const res = await fetch(`/api/messages?${query.toString()}`);
      if (!res.ok) {
        setError("Invalid password or server error.");
        setMessages([]);
        return;
      }
      const data = await res.json();
      setMessages(data);
      setError("");
    } catch (err) {
      setError("Error fetching messages.");
    }
  };

  const toggleRead = async (id, read) => {
    await fetch("/api/messages", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, read }),
    });
    fetchMessages();
  };

  const deleteMessage = async (id) => {
    if (!confirm("Delete this message?")) return;
    await fetch("/api/messages", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchMessages();
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">📬 Admin Dashboard</h1>

      {/* Password + Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-4">
        <input
          type="password"
          placeholder="Admin Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Search name/email/message"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 border rounded"
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="p-2 border rounded">
          <option value="">All Status</option>
          <option value="success">Success</option>
          <option value="failed">Failed</option>
          <option value="pending">Pending</option>
        </select>
        <select value={days} onChange={(e) => setDays(e.target.value)} className="p-2 border rounded">
          <option value="">All Time</option>
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
        </select>
      </div>

      <button
        onClick={fetchMessages}
        className="px-4 py-2 bg-blue-600 text-white rounded mb-4"
      >
        Load Messages
      </button>

      {/* Error */}
      {error && <p className="text-red-600 mb-4">{error}</p>}

      {/* Messages Table */}
      {messages.length > 0 && (
        <div className="overflow-x-auto border rounded">
          <table className="min-w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="border px-2 py-1">Name</th>
                <th className="border px-2 py-1">Email</th>
                <th className="border px-2 py-1">Message</th>
                <th className="border px-2 py-1">Owner</th>
                <th className="border px-2 py-1">Sender</th>
                <th className="border px-2 py-1">Date</th>
                <th className="border px-2 py-1">Actions</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((msg) => (
                <tr key={msg._id} className={msg.read ? "bg-gray-100" : ""}>
                  <td className="border px-2 py-1">{msg.name}</td>
                  <td className="border px-2 py-1">{msg.email}</td>
                  <td className="border px-2 py-1">{msg.message}</td>
                  <td className={`border px-2 py-1 ${msg.deliveryStatus?.toOwner === "success" ? "text-green-600" : msg.deliveryStatus?.toOwner === "failed" ? "text-red-600" : "text-gray-600"}`}>
                    {msg.deliveryStatus?.toOwner}
                  </td>
                  <td className={`border px-2 py-1 ${msg.deliveryStatus?.toSender === "success" ? "text-green-600" : msg.deliveryStatus?.toSender === "failed" ? "text-red-600" : "text-gray-600"}`}>
                    {msg.deliveryStatus?.toSender}
                  </td>
                  <td className="border px-2 py-1">
                    {new Date(msg.createdAt).toLocaleString()}
                  </td>
                  <td className="border px-2 py-1 space-x-2">
                    <button
                      onClick={() => toggleRead(msg._id, !msg.read)}
                      className="px-2 py-1 text-xs bg-yellow-500 text-white rounded"
                    >
                      {msg.read ? "Unread" : "Read"}
                    </button>
                    <button
                      onClick={() => deleteMessage(msg._id)}
                      className="px-2 py-1 text-xs bg-red-600 text-white rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}



export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState("");

  const fetchMessages = async () => {
    try {
      const res = await fetch(`/api/messages?password=${password}`);
      if (!res.ok) {
        setError("Invalid password or server error.");
        setMessages([]);
        return;
      }
      const data = await res.json();
      setMessages(data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Error fetching messages.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">📬 Admin Dashboard</h1>

      {/* Password Input */}
      <div className="flex space-x-2 mb-6">
        <input
          type="password"
          placeholder="Enter Admin Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="flex-1 p-2 border rounded"
        />
        <button
          onClick={fetchMessages}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Login
        </button>
      </div>

      {/* Error */}
      {error && <p className="text-red-600 mb-4">{error}</p>}

      {/* Messages Table */}
      {messages.length > 0 && (
        <div className="overflow-x-auto border rounded">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-4 py-2">Name</th>
                <th className="border px-4 py-2">Email</th>
                <th className="border px-4 py-2">Message</th>
                <th className="border px-4 py-2">Status (You)</th>
                <th className="border px-4 py-2">Status (Sender)</th>
                <th className="border px-4 py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((msg) => (
                <tr key={msg._id} className="text-sm">
                  <td className="border px-4 py-2">{msg.name}</td>
                  <td className="border px-4 py-2">{msg.email}</td>
                  <td className="border px-4 py-2">{msg.message}</td>
                  <td
                    className={`border px-4 py-2 ${
                      msg.deliveryStatus?.toOwner === "success"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {msg.deliveryStatus?.toOwner}
                  </td>
                  <td
                    className={`border px-4 py-2 ${
                      msg.deliveryStatus?.toSender === "success"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {msg.deliveryStatus?.toSender}
                  </td>
                  <td className="border px-4 py-2">
                    {new Date(msg.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
