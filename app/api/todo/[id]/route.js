import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { connectDB } from "@/lib/connect";
import Todo from "@/models/todo.model";
import { cookies } from "next/headers";
import User from "@/models/user.model";

export async function GET(request, context) {
  try {
    const { params } = context;
    const { id } = await params;
    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    await connectDB();
    const todo = await Todo.findOne({ _id: new ObjectId(id) });
    if (!todo) return NextResponse.json({ error: "Todo not found" }, { status: 404 });

    return NextResponse.json({
      _id: todo._id.toString(),
      text: todo.text,
      completed: todo.completed,
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch todo" }, { status: 500 });
  }
}

export async function PUT(request, context) {
  try {
    const { params } = context;
    const { id } = await params;

    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;
    const user = await User.findById(userId);
    if (!userId || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    const body = await request.json();
    const updateFields = {};
    if (typeof body.text === "string") updateFields.text = body.text.trim();
    if (typeof body.completed === "boolean") updateFields.completed = body.completed;
    if (Object.keys(updateFields).length === 0)
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });

    await connectDB();
    const result = await Todo.findOneAndUpdate(
      { _id: new ObjectId(id), userId: userId },
      { $set: updateFields },
      { returnDocument: "after" }
    );

    return NextResponse.json({
      _id: result._id.toString(),
      text: result.text,
      completed: result.completed,
    });
  } catch {
    return NextResponse.json({ error: "Failed to update todo" }, { status: 500 });
  }
}

export async function DELETE(request, context) {
  try {
    const { params } = context;
    const { id } = await params;
    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;
    await connectDB();
    const result = await Todo.deleteOne({ _id: new ObjectId(id), userId: userId });
    if (!result.deletedCount)
      return NextResponse.json({ error: "Todo not found" }, { status: 404 });

    return NextResponse.json({ message: `Todo ${id} deleted successfully` });
  } catch {
    return NextResponse.json({ error: "Failed to delete todo" }, { status: 500 });
  }
}
