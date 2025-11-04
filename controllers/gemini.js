import Complaint from "../models/complaint-model.js";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const getComplaintsBySensitivity = async (req, res) => {
  try {
    // 1️⃣ Fetch all complaints (no user/role check)
    const complaints = await Complaint.find().populate("user", "name email");

    if (!complaints || complaints.length === 0) {
      return res.status(404).json({ message: "No complaints found" });
    }

    // 2️⃣ Format complaints for GPT
    const complaintsList = complaints.map(
      (c, i) => `${i + 1}. Category: ${c.category}, Description: ${c.description}`
    );

    const prompt = `
You are an AI that analyzes hostel complaints and rates their sensitivity.
Classify each complaint as "Critical", "High", "Medium", or "Low".
Return ONLY a valid JSON array (no text or code blocks), like this:
[{"index": 1, "sensitivity": "Critical"}]

Complaints:
${complaintsList.join("\n")}
`;

    // 3️⃣ Send to OpenAI
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    const text = response.choices[0].message.content.trim();
    console.log("GPT Output:", text);

    // 4️⃣ Clean and safely parse JSON
    let sensitivityData;
    try {
      const cleaned = text
        .replace(/```json|```/g, "")
        .replace(/[\u200B-\u200D\uFEFF]/g, "")
        .trim();

      sensitivityData = JSON.parse(cleaned);
    } catch (err) {
      console.warn("GPT returned invalid JSON:", text);
      return res.status(500).json({
        message: "GPT returned unexpected data. Please try again.",
        rawOutput: text,
      });
    }

    // 5️⃣ Merge with complaints
    const combined = complaints.map((c, i) => {
      const sens = sensitivityData.find((s) => s.index === i + 1);
      return {
        ...c.toObject(),
        sensitivity: sens ? sens.sensitivity : "Unknown",
      };
    });

    // 6️⃣ Sort by severity
    const order = { Critical: 1, High: 2, Medium: 3, Low: 4, Unknown: 5 };
    combined.sort((a, b) => order[a.sensitivity] - order[b.sensitivity]);

    res.status(200).json({ complaints: combined });
  } catch (error) {
    console.error("Error analyzing complaints:", error);
    res.status(500).json({ message: "Error analyzing complaints" });
  }
};
