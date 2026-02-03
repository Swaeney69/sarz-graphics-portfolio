import { generateText } from "ai";

export async function POST(req: Request) {
  try {
    const { title, type, tools } = await req.json();

    if (!title || !type) {
      return Response.json(
        { error: "Title and type are required" },
        { status: 400 }
      );
    }

    const toolsList = Array.isArray(tools) ? tools.join(", ") : "various design tools";

    const prompt = `Create a professional project description for a design portfolio. 

Project Details:
- Title: ${title}
- Type: ${type}
- Tools Used: ${toolsList}

Generate JSON with the following structure (respond ONLY with valid JSON, no markdown):
{
  "description": "A 1-2 sentence brief description of the project",
  "problem": "The client's challenge or need (2-3 sentences)",
  "approach": "Your design approach and methodology (2-3 sentences)",
  "outcome": "The result and impact of your work (2-3 sentences)"
}`;

    const result = await generateText({
      model: "openai/gpt-4-mini",
      prompt,
      temperature: 0.7,
    });

    const responseText = result.text.trim();
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error("Failed to parse AI response as JSON");
    }

    const parsed = JSON.parse(jsonMatch[0]);

    return Response.json({
      description: parsed.description,
      details: {
        problem: parsed.problem,
        approach: parsed.approach,
        outcome: parsed.outcome,
      },
    });
  } catch (error) {
    console.error("Error generating description:", error);
    return Response.json(
      { 
        error: "Failed to generate description",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
