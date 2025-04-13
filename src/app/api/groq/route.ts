import { NextResponse } from "next/server";
import { Groq } from "groq-sdk";

export async function POST(request: Request) {
  try {
    const client = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    const completion = await client.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant.",
        },
        {
          role: "user",
          content: "Hello!",
        },
      ],
      model: "llama-3.3-70b-versatile",
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error("No response received from Groq API");
    }

    return NextResponse.json({ response });
  } catch (error) {
    console.error("Error in Groq test:", error);
    return NextResponse.json(
      { error: "Failed to test Groq API" },
      { status: 500 }
    );
  }
}
