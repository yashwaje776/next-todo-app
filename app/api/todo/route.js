import { NextResponse } from "next/server";
import { connectDB } from "@/lib/connect";
import { cookies } from "next/headers";
import Todo from "@/models/todo.model";
import User from "@/models/user.model";

export async function GET() {
  try {
    await connectDB();
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;
    const user = await User.findById(userId);
    if (!userId || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const todos = await Todo.find({ userId: userId }).sort({ createdAt: -1 }).lean();
    if (todos.length === 0) {
      return NextResponse.json([], { status: 200 });
    }
    return NextResponse.json(todos, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch todos" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const data = await req.json();
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;
    const user = await User.findById(userId);
    if (!userId || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!data.text || !data.text.trim()) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }
    const newTodo = await Todo.create({
      userId,
      text: data.text.trim(),
      completed: false,
    });
    return NextResponse.json(newTodo, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to add todo" }, { status: 500 });
  }
}
