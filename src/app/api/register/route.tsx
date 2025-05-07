import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { db } from '~/server/db';

interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json() as RegisterRequest;

    if (!email || !password || !name) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const existingUser = await db.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 409 });
    }

    const hashedPassword = await hash(password, 10);

    const user = await db.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      }
    });

    return NextResponse.json({ message: "User created successfully", userId: user.id }, { status: 201 });

  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  } finally {

  }
}
