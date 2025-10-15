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
    const user = await User.findById(userId).select("-password");
    if (!userId || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}
