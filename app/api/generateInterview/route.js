import { PROMPT } from "@/lib/utils";
import { NextResponse } from "next/server";
import OpenAI from "openai";

export const POST = async (req) => {
  try {
    const { jobPosition, jobDescription, duration, type } = await req.json();

    const openai = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENROUTER_KEY,
    });

    const finalPrompt = PROMPT.replace("{{jobTitle}}", jobPosition)
    .replace("{{jobDescription}}", jobDescription)
    .replace("{{duration}}", duration)
    .replace("{{type}}", type);
    
    const completion = await openai.chat.completions.create({
        model: "openai/gpt-4o-mini",
        messages: [{ role: "user", content: finalPrompt }],
    });
    return NextResponse.json(completion.choices[0]?.message);
  } catch (error) {
    return NextResponse.json(error);
  }
};
