const apiKey = process.env.OPENAI_API_KEY
  ?.replace(/[\u2028\u2029\r\n\t]/g, "")
  .trim();

if (!apiKey) {
  throw new Error("OPENAI_API_KEY is missing.");
}

const openai = new OpenAI({
  apiKey,
});

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  try {
    const {
      prompt,
      size = "1024x1024",
      quality = "medium"
    } = req.body;

    const result = await openai.images.generate({
      model: "gpt-image-1",
      prompt,
      size,
      quality
    });

    return res.status(200).json({
      image: result.data[0].b64_json
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      error: err.message
    });
  }
}
