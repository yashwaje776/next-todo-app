"use client";

import { useEffect, useState } from "react";

export default function TodosPage() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");
  const [editId, setEditId] = useState(null);
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const res = await fetch("/api/todo");
      if (res.status === 401) {
        setTodos([]);
        return;
      }
      const data = await res.json();
      setTodos(data);
    } catch (err) {
      console.error("Fetch todos error:", err);
      setError("Failed to fetch todos");
    }
  };

  const handleAdd = async () => {
    if (!input.trim()) return;

    try {
      if (editId) {
        const todo = todos.find((t) => t._id === editId);
        console.log(todo)
                const res = await fetch(`/api/todo/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...todo, text: input.trim() }),
        });

        if (!res.ok) {
          const err = await safeJson(res);
          setError(err?.error || "Failed to update todo");
          return;
        }

        setEditId(null);
      } else {
        const res = await fetch("/api/todo", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: input.trim() }),
        });

        if (!res.ok) {
          const err = await safeJson(res);
          setError(err?.error || "Failed to add todo");
          return;
        }
      }

      setInput("");
      setError("");
      fetchTodos();
    } catch (err) {
      console.error("handleAdd error:", err);
      setError("Something went wrong");
    }
  };

  const handleDelete = async (_id) => {
    try {
      const res = await fetch(`/api/todo/${_id}`, { method: "DELETE" });
      if (!res.ok) {
        const err = await safeJson(res);
        setError(err?.error || "Failed to delete todo");
        return;
      }
      setError("");
      fetchTodos();
    } catch (err) {
      console.error("handleDelete error:", err);
      setError("Something went wrong");
    }
  };

  const handleToggle = async (_id) => {
    try {
      const todo = todos.find((t) => t._id === _id);
      const res = await fetch(`/api/todo/${_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...todo, completed: !todo.completed }),
      });

      if (!res.ok) {
        const err = await safeJson(res);
        setError(err?.error || "Failed to update todo");
        return;
      }

      setError("");
      fetchTodos();
    } catch (err) {
      console.error("handleToggle error:", err);
      setError("Something went wrong");
    }
  };

  const handleEdit = (todo) => {
    setInput(todo.text);
    setEditId(todo._id);
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  const safeJson = async (res) => {
    try {
      return await res.json();
    } catch {
      return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center pt-12 bg-black text-white transition-colors duration-300">
      <h1 className="text-3xl font-bold mb-6">📝 Todo List (API)</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          className="border border-gray-700 rounded px-3 py-2 w-64 outline-none focus:ring focus:ring-blue-500 bg-gray-900 text-white"
          placeholder="Enter a todo..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          {editId ? "Update" : "Add"}
        </button>
      </div>

      <div className="flex gap-2 mb-6">
        {["all", "active", "completed"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded ${
              filter === f
                ? "bg-blue-600 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <ul className="w-full max-w-md space-y-3">
        {filteredTodos.length === 0 && (
          <p className="text-gray-500 text-center">No todos found.</p>
        )}
        {filteredTodos.map((todo) => {
          const _id = todo._id;
          return (
            <li
              key={_id}
              className="flex justify-between items-center bg-gray-900 p-3 rounded shadow-md"
            >
              <div className="flex items-center gap-2 flex-1">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => handleToggle(_id)}
                  className="w-4 h-4 cursor-pointer accent-blue-500"
                />
                <span
                  className={`${
                    todo.completed ? "line-through text-gray-500" : "text-white"
                  }`}
                >
                  {todo.text}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(todo)}
                  className="text-sm bg-yellow-500 text-black px-2 py-1 rounded hover:bg-yellow-400"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(_id)}
                  className="text-sm bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
