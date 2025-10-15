"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (data.token) {
        localStorage.setItem("token", data.token);
      }
      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      console.log("✅ Registration successful:", data);

      setForm({ name: "", email: "", password: "" });

      router.push("/");
    } catch (err) {
      console.error("Registration error:", err);
      setError("Failed to register");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-950 to-gray-900 text-white px-4">
      <div className="bg-gray-900 border border-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-2">Create Account 📝</h1>
        <p className="text-gray-400 text-center mb-6">Join to start managing your Todos</p>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="John Doe"
              className="w-full p-2 rounded bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full p-2 rounded bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="********"
              className="w-full p-2 rounded bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 transition text-white py-2 rounded font-semibold"
          >
            Register
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-4">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-500 hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
