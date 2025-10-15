import { NextResponse } from "next/server";
import {connectDB} from "@/lib/connect";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "@/models/user.model";

export async function POST(req) {
  try {
    await connectDB();

    const data = await req.json();
    const {  email, password } = data;

    if ( !email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return NextResponse.json({ error: "User is not find" }, { status: 400 });
    }

    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordCorrect) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
    }
    
    

    const token = jwt.sign(
      { id: existingUser._id},
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const response = NextResponse.json({
      message: "User registered successfully",
      user: {
        id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
      },
      token, 
    });

    response.cookies.set("userId",existingUser._id , {
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, 
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("POST /api/login error:", error);
    return NextResponse.json({ error: "Failed to login user" }, { status: 500 });
  }
}
