var https = require(“https”);

exports.handler = function(event, context, callback) {
if (event.httpMethod === “OPTIONS”) {
return callback(null, {
statusCode: 200,
headers: { “Access-Control-Allow-Origin”: “*”, “Access-Control-Allow-Headers”: “Content-Type” },
body: “”
});
}

var key = process.env.GEMINI_API_KEY;
if (!key) {
return callback(null, {
statusCode: 200,
headers: { “Access-Control-Allow-Origin”: “*”, “Content-Type”: “application/json” },
body: JSON.stringify({ reply: “API key not set.” })
});
}

var parsed = JSON.parse(event.body);
var messages = parsed.messages || [];

var system = “You are the AI assistant of MD. Shihab Shahriar. Answer in the same language as the user (Bengali or English). Be friendly and concise. Facts: Full-Stack Developer, age 23, Dhaka Bangladesh, email: shihabshahriar.contact@gmail.com, phone: +880 1703 347089, LinkedIn: mdshihabshahriar, freelance available. Education: BSc CSE at AIUB (2023-present), HSC Govt Yasin College 2022, SSC Faridpur Zilla School 2020. Skills: HTML 89%, CSS 85%, C++ 85%, C 80%, Python 66%, JS 65%, Django 65%, Database 65%. Projects: Library Management (Django) https://library-management-fqjv.onrender.com, Bank Management (Django) https://bank-management-5f7y.onrender.com, Security Service https://securityservice1.netlify.app, Meal Finder https://mealfind.netlify.app, Sports Shop https://online-shopping100.netlify.app. Never invent facts.”;

var contents = messages.map(function(m) {
return { role: m.role === “assistant” ? “model” : “user”, parts: [{ text: m.content }] };
});

var reqBody = JSON.stringify({
system_instruction: { parts: [{ text: system }] },
contents: contents,
generationConfig: { maxOutputTokens: 500, temperature: 0.7 }
});

var options = {
hostname: “generativelanguage.googleapis.com”,
path: “/v1beta/models/gemini-1.5-flash-latest:generateContent?key=” + key,
method: “POST”,
headers: { “Content-Type”: “application/json”, “Content-Length”: Buffer.byteLength(reqBody) }
};

var req = https.request(options, function(res) {
var data = “”;
res.on(“data”, function(chunk) { data += chunk; });
res.on(“end”, function() {
try {
var json = JSON.parse(data);
var reply = “Sorry, no response.”;
if (json.candidates && json.candidates[0] && json.candidates[0].content && json.candidates[0].content.parts) {
reply = json.candidates[0].content.parts[0].text;
} else if (json.error) {
reply = “API error: “ + json.error.message;
}
callback(null, {
statusCode: 200,
headers: { “Content-Type”: “application/json”, “Access-Control-Allow-Origin”: “*” },
body: JSON.stringify({ reply: reply })
});
} catch (e) {
callback(null, {
statusCode: 200,
headers: { “Access-Control-Allow-Origin”: “*”, “Content-Type”: “application/json” },
body: JSON.stringify({ reply: “Parse error: “ + e.message })
});
}
});
});

req.on(“error”, function(e) {
callback(null, {
statusCode: 200,
headers: { “Access-Control-Allow-Origin”: “*”, “Content-Type”: “application/json” },
body: JSON.stringify({ reply: “Request error: “ + e.message })
});
});

req.write(reqBody);
req.end();
};