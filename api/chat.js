// api/chat.js
export const config = {
    api: {
      bodyParser: true
    }
  };
  
  export default async function handler(req, res) {
    // Nastavení CORS
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  
    // Odpověď na preflight OPTIONS request
    if (req.method === "OPTIONS") {
      return res.status(200).end();
    }
  
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }
  
    try {
      const { prompt } = req.body;
  
      if (!prompt) {
        return res.status(400).json({ error: "Missing prompt" });
      }
  
      const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7
        })
      });
      console.info("openaiRes", openaiRes);
      console.log("openaiRes", openaiRes);
      const data = await openaiRes.json();
  
      if (!data.choices || !data.choices[0]) {
        return res.status(500).json({ error: "Invalid response from OpenAI" });
      }
  
      return res.status(200).json({ reply: data.choices[0].message.content });
    } catch (err) {
      console.error("CHYBA:", err);
      return res.status(500).json({ error: "Server error" });
    }
  }
  