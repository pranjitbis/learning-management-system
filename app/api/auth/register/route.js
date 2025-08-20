import prisma from "../../../lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const body = await req.json();

    const { name, email, password } = body;

    if (!name || !email || !password) {
      return new Response(JSON.stringify({ error: "All fields required" }), {
        status: 400,
      });
    }

    const hashpassoword = await  bcrypt.hash(password,10)

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashpassoword,
      },
    });
    return new Response(
      JSON.stringify({ message: "User registered successfully", user }),
      {
        status: 200,
      }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "User already exists or server error" }),
      {
        status: 400,
      }
    );
  }
}
