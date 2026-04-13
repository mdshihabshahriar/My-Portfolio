exports.handler = async function (event, context) {
if (event.httpMethod === “OPTIONS”) {
return {
statusCode: 200,
headers: {
“Access-Control-Allow-Origin”: “*”,
“Access-Control-Allow-Headers”: “Content-Type”,
“Access-Control-Allow-Methods”: “POST, OPTIONS”,
},
body: “”,
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
body: JSON.stringify({ reply: “API key not configured.” }),
};
}

try {
const body = JSON.parse(event.body);
const messages = body.messages || [];

```
const SHIHAB_INFO = `You are the personal AI assistant of MD. Shihab Shahriar, embedded on his portfolio website. Answer questions about Shihab in a friendly, concise, and professional manner. Always respond in the same language the user writes in (Bengali or English).
```

ABOUT SHIHAB:

- Full name: MD. Shihab Shahriar
- Title: Full-Stack Developer (Junior Python Developer)
- Age: 23, Nationality: Bangladeshi, Location: Dhaka, Bangladesh
- Freelance: Available. Languages: Bangla, English
- Email: shihabshahriar.contact@gmail.com
- Phone: +880 1703 347089
- LinkedIn: mdshihabshahriar
- Experience: 1 year, 9 projects, 5 happy customers, 9 collaborations

EDUCATION:

- BSc in CSE at AIUB / American International University-Bangladesh (2023-Present)
- HSC at Govt. Yasin College (2022)
- SSC at Faridpur Zilla School (2020)

SKILLS: HTML 89%, CSS 85%, C++ 85%, C 80%, Python 66%, JavaScript 65%, Django 65%, Database 65%

PROJECTS:

1. Library Management System - Django, HTML, CSS, JS - https://library-management-fqjv.onrender.com/
1. Bank Management - Django, HTML, CSS, JS - https://bank-management-5f7y.onrender.com/
1. Security Service - HTML, CSS, JS - https://securityservice1.netlify.app/
1. Meal Finder - HTML, CSS, JS - https://mealfind.netlify.app/
1. Sports Shop - HTML, CSS, JS - https://online-shopping100.netlify.app/

BLOG TOPICS: C++, Python, Django, C#, JavaScript, PostgreSQL

If someone asks to hire or contact Shihab, share his email and say he is available for freelance work.
Keep answers short and friendly. Never make up information not listed above.`;

```
const geminiContents = messages.map((msg) => ({
  role: msg.role === "assistant" ? "model" : "user",
  parts: [{ text: msg.content }],
}));

const response = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`,
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: SHIHAB_INFO }] },
      contents: geminiContents,
      generationConfig: { maxOutputTokens: 600, temperature: 0.7 },
    }),
  }
);

const data = await response.json();

let reply = "Sorry, I could not get a response right now.";
if (
  data.candidates &&
  data.candidates[0] &&
  data.candidates[0].content &&
  data.candidates[0].content.parts &&
  data.candidates[0].content.parts[0]
) {
  reply = data.candidates[0].content.parts[0].text;
} else if (data.error) {
  reply = "API error: " + data.error.message;
}

return {
  statusCode: 200,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
  body: JSON.stringify({ reply }),
};
```

} catch (err) {
return {
statusCode: 500,
headers: { “Access-Control-Allow-Origin”: “*” },
body: JSON.stringify({ reply: “Server error: “ + err.message }),
};
}
};