import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Define the expected input type
interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Parse and validate the request body
    const body: CreateUserRequest = await request.json();
    const { name, email, password } = body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user in the database
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // Return the response (excluding hashed password)
    return NextResponse.json({
      massage: 'User created successfully',
      data : {user},
    });
  } catch (error) {
    console.error('Error creating user:', error);

    // Return an error response
    return NextResponse.json(
      { error: 'Failed to create user.' },
      { status: 500 }
    );
  }
}
