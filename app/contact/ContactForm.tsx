"use client";

import { useState } from "react";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState({ loading: false, success: null, error: null });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: null, error: null });

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to send message");

      setStatus({ loading: false, success: "Message sent successfully!", error: null });
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      setStatus({ loading: false, success: null, error: err.message });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-4">
      <input
        type="text"
        name="name"
        placeholder="Your Name"
        value={form.name}
        onChange={handleChange}
        required
        className="w-full border rounded p-2"
      />
      <input
        type="email"
        name="email"
        placeholder="Your Email"
        value={form.email}
        onChange={handleChange}
        required
        className="w-full border rounded p-2"
      />
      <textarea
        name="message"
        placeholder="Your Message"
        value={form.message}
        onChange={handleChange}
        required
        minLength={10}
        className="w-full border rounded p-2"
      />
      <button
        type="submit"
        disabled={status.loading}
        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
      >
        {status.loading ? "Sending..." : "Send Message"}
      </button>

      {status.success && <p className="text-green-600">{status.success}</p>}
      {status.error && <p className="text-red-600">{status.error}</p>}
    </form>
  );
}





"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, CheckCircle2, AlertTriangle } from "lucide-react";
import ContactForm from "@/components/ContactForm";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";



"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<null | "success" | "error">(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    setErrorMsg("");

    // Basic validation
    if (!form.name || !form.email || !form.message) {
      setErrorMsg("All fields are required.");
      setLoading(false);
      setStatus("error");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setErrorMsg("Please enter a valid email address.");
      setLoading(false);
      setStatus("error");
      return;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setStatus("success");
        setForm({ name: "", email: "", message: "" });
      } else {
        const { error } = await res.json();
        setErrorMsg(error || "Something went wrong. Try again.");
        setStatus("error");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Network error. Please try later.");
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Card className="max-w-lg mx-auto shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Contact Me</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <Input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your Name"
            />
            <Input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Your Email"
            />
            <Textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Your Message"
              className="h-32"
            />

            <AnimatePresence mode="wait">
              {status === "success" && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <Alert className="bg-green-100 border-green-400 text-green-800">
                    <AlertDescription>✅ Message sent successfully!</AlertDescription>
                  </Alert>
                </motion.div>
              )}
              {status === "error" && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <Alert className="bg-red-100 border-red-400 text-red-800">
                    <AlertDescription>❌ {errorMsg}</AlertDescription>
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
          <CardFooter>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="w-full">
              <Button type="submit" className="w-full flex items-center justify-center gap-2" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Message"
                )}
              </Button>
            </motion.div>
          </CardFooter>
        </form>
      </Card>
    </motion.div>
  );
}





export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<null | "success" | "error">(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    setErrorMsg("");

    // Basic validation
    if (!form.name || !form.email || !form.message) {
      setErrorMsg("All fields are required.");
      setLoading(false);
      setStatus("error");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setErrorMsg("Please enter a valid email address.");
      setLoading(false);
      setStatus("error");
      return;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setStatus("success");
        setForm({ name: "", email: "", message: "" });
      } else {
        const { error } = await res.json();
        setErrorMsg(error || "Something went wrong. Try again.");
        setStatus("error");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Network error. Please try later.");
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-lg mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Contact Me</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <Input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Your Name"
          />
          <Input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Your Email"
          />
          <Textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Your Message"
            className="h-32"
          />

          {status === "success" && (
            <Alert className="bg-green-100 border-green-400 text-green-800">
              <AlertDescription>✅ Message sent successfully!</AlertDescription>
            </Alert>
          )}
          {status === "error" && (
            <Alert className="bg-red-100 border-red-400 text-red-800">
              <AlertDescription>❌ {errorMsg}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Sending..." : "Send Message"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}



export default function ContactPage() {
  return (
    <section className="min-h-screen bg-gray-100 py-12">
      <ContactForm />
    </section>
  );
}

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const email = String(formData.get("email"));

    // 🔍 Extra email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("❌ Please enter a valid email address.");
      setLoading(false);
      return;
    }

    const res = await fetch("/api/contact", {
      method: "POST",
      body: JSON.stringify({
        name: formData.get("name"),
        email,
        message: formData.get("message"),
      }),
    });

    setLoading(false);

    if (res.ok) {
      setSuccess(true);
      form.reset();

      // Hide success after 5s
      setTimeout(() => setSuccess(false), 5000);
    } else {
      const data = await res.json();
      setError(data.error || "⚠️ Something went wrong. Try again later.");
    }
  }

  return (
    <Card className="max-w-lg mx-auto shadow-lg rounded-2xl">
      <CardContent className="p-6 space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            name="name"
            placeholder="Your Name"
            required
            className="border border-gray-300"
          />
          <Input
            type="email"
            name="email"
            placeholder="Your Email"
            required
            className="border border-gray-300"
          />
          <Textarea
            name="message"
            placeholder="Your Message"
            rows={5}
            required
            className="border border-gray-300"
          />
          <Button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin mr-2 h-4 w-4" /> Sending...
              </>
            ) : (
              "Send Message"
            )}
          </Button>

          {/* ✅ Success state */}
          {success && (
            <p className="flex items-center text-green-600 font-medium mt-2">
              <CheckCircle2 className="h-5 w-5 mr-2" />
              ✅ Message sent successfully!
            </p>
          )}

          {/* ❌ Error state */}
          {error && (
            <p className="flex items-center text-red-600 font-medium mt-2">
              <AlertTriangle className="h-5 w-5 mr-2" />
              {error}
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}



export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        setStatus("✅ Message sent successfully!");
        setFormData({ name: "", email: "", message: "" });
      } else {
        setStatus("❌ Failed to send message. Try again.");
      }
    } catch (err) {
      console.error(err);
      setStatus("⚠️ Error sending message.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      <input
        type="text"
        name="name"
        placeholder="Your Name"
        value={formData.name}
        onChange={handleChange}
        required
        className="w-full p-2 border rounded"
      />
      <input
        type="email"
        name="email"
        placeholder="Your Email"
        value={formData.email}
        onChange={handleChange}
        required
        className="w-full p-2 border rounded"
      />
      <textarea
        name="message"
        placeholder="Your Message"
        value={formData.message}
        onChange={handleChange}
        required
        rows={4}
        className="w-full p-2 border rounded"
      />
      <button
        type="submit"
        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
      >
        Send Message
      </button>
      {status && <p className="text-center mt-2">{status}</p>}
    </form>
  );
}




"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<null | "success" | "error">(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    setErrorMsg("");

    // Basic validation
    if (!form.name || !form.email || !form.message) {
      setErrorMsg("All fields are required.");
      setLoading(false);
      setStatus("error");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setErrorMsg("Please enter a valid email address.");
      setLoading(false);
      setStatus("error");
      return;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setStatus("success");
        setForm({ name: "", email: "", message: "" });
      } else {
        const { error } = await res.json();
        setErrorMsg(error || "Something went wrong. Try again.");
        setStatus("error");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Network error. Please try later.");
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Card className="max-w-lg mx-auto shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Contact Me</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <Input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your Name"
            />
            <Input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Your Email"
            />
            <Textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Your Message"
              className="h-32"
            />

            <AnimatePresence mode="wait">
              {status === "success" && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <Alert className="bg-green-100 border-green-400 text-green-800">
                    <AlertDescription>✅ Message sent successfully!</AlertDescription>
                  </Alert>
                </motion.div>
              )}
              {status === "error" && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <Alert className="bg-red-100 border-red-400 text-red-800">
                    <AlertDescription>❌ {errorMsg}</AlertDescription>
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
          <CardFooter>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="w-full">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Sending..." : "Send Message"}
              </Button>
            </motion.div>
          </CardFooter>
        </form>
      </Card>
    </motion.div>
  );
}





