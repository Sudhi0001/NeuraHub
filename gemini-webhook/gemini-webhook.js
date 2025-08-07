export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { docText, userPrompt } = req.body;

  if (!docText || !userPrompt) {
    return res.status(400).json({ message: 'Missing docText or userPrompt' });
  }

  const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyC0x-bCkekB3vQX-6E5jGI6pdv9uWCW4RI", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: `Here is some document context:\n${docText.slice(0, 3000)}\n\nAnd the user asked: ${userPrompt}`
        }]
      }]
    })
  });

  const data = await response.json();

  if (data && data.candidates && data.candidates.length > 0) {
    return res.status(200).json({ suggestion: data.candidates[0].content.parts[0].text });
  } else {
    return res.status(500).json({ message: "No response from Gemini API." });
  }
}
