import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { name, email, password } = await req.json();

  console.log("Registering user:", { name, email, password }); // Temporary usage

  return NextResponse.json({ message: `User ${name} registered successfully` });
}
