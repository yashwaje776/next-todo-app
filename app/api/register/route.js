import { NextResponse } from "next/server";
import {connectDB} from "@/lib/connect";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "@/models/user.model";

export async function POST(req) {
  try {
    await connectDB();

    const data = await req.json();
    const { name, email, password } = data;

    if (!name || !email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "Email already in use" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { id: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const response = NextResponse.json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
      token, 
    });

    response.cookies.set("userId", newUser._id, {
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, 
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("POST /api/register error:", error);
    return NextResponse.json({ error: "Failed to register user" }, { status: 500 });
  }
}


