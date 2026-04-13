exports.handler = async function(event, context) {
if (event.httpMethod === “OPTIONS”) {
return {
statusCode: 200,
headers: {
“Access-Control-Allow-Origin”: “*”,
“Access-Control-Allow-Headers”: “Content-Type”,
“Access-Control-Allow-Methods”: “POST, OPTIONS”
},
body: “”
};
}

if (event.httpMethod !== “POST”) {
return { statusCode: 405, body: “Method Not Allowed” };
}

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
return {
statusCode: 500,
headers: { “Access-Control-Allow-Origin”: “*” },
body: JSON.stringify({ reply: “API key not configured.” })
};
}

try {
const body = JSON.parse(event.body);
const messages = body.messages || [];

```
const systemText = "You are the personal AI assistant of MD. Shihab Shahriar. Answer questions about Shihab in a friendly and concise manner. Always respond in the same language the user writes in (Bengali or English). NAME: MD. Shihab Shahriar. TITLE: Full-Stack Developer. AGE: 23. LOCATION: Dhaka, Bangladesh. EMAIL: shihabshahriar.contact@gmail.com. PHONE: +880 1703 347089. LINKEDIN: mdshihabshahriar. FREELANCE: Available. EDUCATION: BSc CSE at AIUB (2023-Present), HSC at Govt. Yasin College (2022), SSC at Faridpur Zilla School (2020). SKILLS: HTML 89%, CSS 85%, C++ 85%, C 80%, Python 66%, JavaScript 65%, Django 65%, Database 65%. PROJECTS: 1. Library Management System (Django) - https://library-management-fqjv.onrender.com/ 2. Bank Management (Django) - https://bank-management-5f7y.onrender.com/ 3. Security Service - https://securityservice1.netlify.app/ 4. Meal Finder - https://mealfind.netlify.app/ 5. Sports Shop - https://online-shopping100.netlify.app/. Never make up information not listed above.";

var geminiContents = messages.map(function(msg) {
  return {
    role: msg.role === "assistant" ? "model" : "user",
    parts: [{ text: msg.content }]
  };
});

var requestBody = {
  system_instruction: {
    parts: [{ text: systemText }]
  },
  contents: geminiContents,
  generationConfig: {
    maxOutputTokens: 600,
    temperature: 0.7
  }
};

var response = await fetch(
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=" + GEMINI_API_KEY,
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestBody)
  }
);

var data = await response.json();

var reply = "Sorry, I could not get a response right now.";
if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0]) {
  reply = data.candidates[0].content.parts[0].text;
} else if (data.error) {
  reply = "API error: " + data.error.message;
}

return {
  statusCode: 200,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*"
  },
  body: JSON.stringify({ reply: reply })
};
```

} catch (err) {
return {
statusCode: 500,
headers: { “Access-Control-Allow-Origin”: “*” },
body: JSON.stringify({ reply: “Server error: “ + err.message })
};
}
};