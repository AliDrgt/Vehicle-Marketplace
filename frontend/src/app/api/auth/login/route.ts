import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  // Mock authentication (Replace with database check later)
  if (email === "test@example.com" && password === "password") {
    const token = jwt.sign({ email, role: "user" }, "secret", { expiresIn: "1h" });

    return NextResponse.json({ token });
  }

  return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
}
