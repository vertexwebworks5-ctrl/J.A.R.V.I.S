const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
res.send("Hania JARVIS backend is running!");
});

app.post("/chat", async (req, res) => {
try {
const key = process.env.GROQ_API_KEY;
if (!key) {
return res.status(500).json({ error: "API key not configured" });
}

const response = await fetch(
  "https://api.groq.com/openai/v1/chat/completions",
  {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${key}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "openai/gpt-oss-20b",
      messages: [
        {
          role: "system",
          content: "Tum Hania ho, ek helpful AI assistant. Roman Urdu mein simple aur short jawab do."
        },
        {
          role: "user",
          content: String(req.body.message || "").slice(0, 4000)
        }
      ]
    })
  }
);

const data = await response.json();
if (!response.ok) {
  return res.status(response.status).json({ error: "AI request failed", details: data });
}

res.json({ reply: data.choices?.[0]?.message?.content || "Jawab nahi mila." });

} catch (error) {
res.status(500).json({ error: "Server error" });
}
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => console.log("JARVIS ready"));
