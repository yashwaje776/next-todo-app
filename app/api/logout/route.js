import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ message: "Logged out" });
  const cookieStore = await cookies();
  await cookieStore.delete("userId", { path: "/" });
  
  return res;
}