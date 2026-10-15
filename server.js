require("dotenv").config();
const express = require("express");
const path = require("path");
const fs = require("fs");
const Database = require("better-sqlite3");

const app = express();
const PORT = Number(process.env.PORT || 3000);
const ROOT = __dirname;
const DATA_DIR = path.join(ROOT, "data");
fs.mkdirSync(DATA_DIR, { recursive: true });
const db = new Database(path.join(DATA_DIR, "cyberpulse.sqlite"));
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

app.use(express.json({ limit: "40kb" }));
app.use(express.static(path.join(ROOT, "public")));

db.exec(`
CREATE TABLE IF NOT EXISTS activity (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  kind TEXT NOT NULL,
  item_id TEXT,
  score INTEGER,
  detail TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  score INTEGER NOT NULL,
  total INTEGER NOT NULL,
  answers_json TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS incidents (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category TEXT NOT NULL,
  summary TEXT NOT NULL,
  plan_json TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
`);

const lessons = [
  {id:"foundations", number:1, title:"Understanding Cybersecurity", tag:"FOUNDATIONS", minutes:4,
   description:"Build everyday digital safety habits.",
   intro:"Cybersecurity protects devices, accounts, networks and information from misuse. Good security is a set of repeatable habits, not one magic application.",
   points:["Use a screen lock and install operating-system and browser updates.","Treat unexpected requests for money, credentials or downloads with caution.","Back up important files to a separate trusted location.","Use separate passwords for important accounts."],
   takeaway:"Slow down, verify the request, and use a separate trusted channel."},
  {id:"rights", number:2, title:"Cyber Laws & Digital Rights", tag:"DIGITAL RIGHTS", minutes:5,
   description:"Understand responsible conduct and reporting.",
   intro:"Digital actions can have real-world consequences. Preserve relevant evidence and use official reporting channels when you experience abuse or fraud.",
   points:["Never access accounts without permission or impersonate others.","Save dates, screenshots and complaint references when reporting an incident.","Review privacy settings before publishing personal information.","Consult official sources or a qualified professional for legal advice."],
   takeaway:"This learning module is general awareness, not legal advice."},
  {id:"cybercrime", number:3, title:"Understanding Cybercrimes", tag:"THREAT AWARENESS", minutes:5,
   description:"Recognise phishing, fraud and identity misuse.",
   intro:"Cybercrime may involve deception, unauthorised access, financial fraud, identity misuse, harassment or malicious software.",
   points:["Phishing uses deceptive messages or pages to steal information.","Unexpected attachments and APK installation requests can be dangerous.","A QR code or payment request can be misrepresented to trick a user.","Urgency, secrecy and unrealistic rewards are common warning signs."],
   takeaway:"A familiar logo or caller ID is not proof of authenticity."},
  {id:"case-studies", number:4, title:"Real-World Case Studies", tag:"SCENARIOS", minutes:4,
   description:"Practise spotting common scam patterns.",
   intro:"Many scams exploit ordinary moments: a delivery update, a bank KYC warning, a job offer or a utility-disconnection threat.",
   points:["A fake courier asks you to install an APK: do not install it; check the official app.","A caller asks for an OTP to reverse a payment: end the call and contact your bank independently.","A friend asks for emergency money: confirm their identity using another channel.","A job offer requests a registration fee: independently verify the employer."],
   takeaway:"Scammers often depend on panic and speed. Pause before acting."},
  {id:"prevention", number:5, title:"Prevention & Hardening", tag:"DEFENCE", minutes:5,
   description:"Strengthen accounts, devices and networks.",
   intro:"Prevention reduces the chance that one mistake becomes a major incident.",
   points:["Use unique passwords and a reputable password manager.","Enable multi-factor authentication or passkeys where supported.","Install apps from official stores and review permissions.","Keep devices, browsers and routers updated.","Avoid unknown remote-access tools requested by strangers."],
   takeaway:"Protect your recovery email as carefully as your main accounts."},
  {id:"response", number:6, title:"Incident Response", tag:"RESPOND", minutes:5,
   description:"Learn the first steps after a suspected attack.",
   intro:"The right response depends on what happened. Protect money and accounts first, then preserve evidence and report.",
   points:["Financial fraud: contact your bank/payment provider immediately and call India's 1930 helpline promptly.","Account compromise: use a trusted device to change passwords and revoke unknown sessions.","Preserve screenshots, timestamps and transaction references.","Never share OTPs, PINs, passwords or remote-access codes."],
   takeaway:"Use a different trusted device if the affected device may be compromised."},
  {id:"directory", number:7, title:"Cyber Help Directory", tag:"GET HELP", minutes:3,
   description:"Find the appropriate official reporting channel.",
   intro:"Reports are more useful when they reach the right channel with clear evidence. Always verify contact details on official websites.",
   points:["For financial cyber fraud in India, call 1930 promptly and use cybercrime.gov.in.","Use a platform's official account-recovery process for account access issues.","Contact your bank through its official app or the number on your card.","Keep complaint and acknowledgement numbers for follow-up."],
   takeaway:"Beware of unofficial support numbers and anyone promising guaranteed recovery."},
  {id:"assistant", number:8, title:"AI Incident Assistant", tag:"ASSISTED RESPONSE", minutes:3,
   description:"Turn a stressful event into a structured checklist.",
   intro:"A useful incident assistant offers calm, prioritised and source-aware guidance without asking for secrets.",
   points:["Describe the incident category without passwords, OTPs or full card numbers.","Prioritise containment, official reporting and evidence preservation.","Verify critical instructions with the relevant bank, platform or authority.","Treat AI output as assistance, not a replacement for official advice."],
   takeaway:"This prototype can use local Ollama if configured; otherwise it falls back to safe rules."}
];

const quiz = [
 {id:"q1", topic:"case-studies", q:"An urgent SMS says your electricity will be disconnected unless you install an APK. What is the safest choice?", options:["Install it quickly to avoid disconnection","Forward it to family and ask them to try it","Do not install it; verify through the official electricity provider"], correct:2, why:"Unexpected APKs can contain malware. Verify the claim using the provider's official app or independently verified contact details."},
 {id:"q2", topic:"cybercrime", q:"Someone claiming to be from your bank asks for an OTP to reverse a payment. What should you do?", options:["Share it if they know your name","End the call and contact the bank through an official channel","Share only part of the OTP"], correct:1, why:"Never share OTPs or PINs. Contact your bank independently through its official app or number."},
 {id:"q3", topic:"prevention", q:"You clicked a suspicious link but did not enter details. What is the best next step?", options:["Keep interacting to see where it goes","Close it, avoid downloads, and check for anything unusual","Forward it to friends to confirm"], correct:1, why:"Stop interacting with the page. If you downloaded or installed anything, take additional device-safety steps."},
 {id:"q4", topic:"response", q:"Money was transferred from your account without permission in India. What should you do first?", options:["Wait a few days","Post your bank details publicly","Contact your bank/payment provider and call 1930 promptly"], correct:2, why:"Fast reporting may help the response. Preserve transaction details and report through official channels."},
 {id:"q5", topic:"prevention", q:"Your account shows a login you do not recognise. What should you do?", options:["Use a trusted device to change the password, revoke sessions and enable MFA","Ignore it if the account still opens","Send your password to a friend"], correct:0, why:"Secure the account and recovery methods, revoke unknown sessions and review recent activity."},
 {id:"q6", topic:"cybercrime", q:"A QR code is sent to you with a claim that scanning it will let you receive money. What should you remember?", options:["Scanning any QR code is always safe","Payment requests and QR codes can be used deceptively; verify before acting","Share your UPI PIN with the sender"], correct:1, why:"Be cautious with unexpected payment requests. Never share your UPI PIN or OTP."},
 {id:"q7", topic:"rights", q:"You receive threatening messages online. What is a useful first step?", options:["Save relevant evidence and use platform/reporting channels","Delete everything immediately without recording details","Publish your personal information in response"], correct:0, why:"Preserve screenshots, usernames, URLs and dates, then report and seek trusted help if needed."}
];

const plans = {
 phishing:{title:"Suspicious link / phishing",priority:"Do not click again, reply, download files or install an app. Verify the message independently.",steps:["Close the page and do not enter credentials or payment details.","If you entered a password, change it from a trusted device and sign out other sessions.","If you installed an app, avoid banking on that device and seek trusted technical help.","Save the message, sender details and screenshots for reporting."],report:"Report through the relevant platform. If money was lost in India, contact your bank and call 1930 promptly."},
 money:{title:"Possible financial cyber fraud",priority:"Act immediately: contact your bank/payment provider through its official app or number.",steps:["Call India's cyber financial fraud helpline 1930 promptly.","Submit a report at cybercrime.gov.in and keep the acknowledgement/reference number.","Save transaction IDs, amounts, timestamps, UPI IDs and screenshots.","Never share OTPs, PINs or passwords with anyone claiming to help."],report:"Use official bank channels and the National Cyber Crime Reporting Portal. No one can guarantee recovery."},
 account:{title:"Account compromise",priority:"Use a trusted device to secure the account and its recovery email/phone.",steps:["Change the password to a unique one; secure the recovery email if affected.","Sign out of other sessions and revoke unknown devices or connected apps.","Enable multi-factor authentication and check recovery details.","Warn contacts if your account may have sent scam messages."],report:"Use the platform's official recovery flow and preserve login alerts."},
 device:{title:"Suspicious app / device",priority:"Stop using the suspicious app. Do not enter banking credentials on a potentially compromised device.",steps:["Disconnect from networks if you suspect active compromise.","From another trusted device, secure important accounts and contact your bank if relevant.","Review unknown apps and permissions; seek trusted technical support if unsure.","Preserve screenshots and note when the app was installed."],report:"For serious incidents, consult a trusted security professional or official reporting channel."},
 harassment:{title:"Cyberbullying / online harassment",priority:"Prioritise personal safety. Avoid escalating the exchange.",steps:["Save screenshots, usernames, URLs, dates and message IDs where safe.","Report the account/content through the platform's official tools.","Review privacy settings, location sharing and account security.","Tell a trusted person or campus authority if you feel threatened."],report:"Use appropriate official complaint channels. If there is immediate danger, contact local emergency services."},
 identity:{title:"Identity theft / personal data exposed",priority:"Secure affected accounts and contact relevant institutions if financial or identity documents are involved.",steps:["Change reused passwords and enable multi-factor authentication.","Contact your bank or service provider through official channels if details were exposed.","Preserve messages, screenshots and a timeline.","Watch for follow-up impersonation and unexpected account recovery requests."],report:"Report through the relevant institution and official cybercrime channels. Do not post sensitive documents publicly."}
};

const insertActivity = db.prepare("INSERT INTO activity(kind,item_id,score,detail) VALUES(?,?,?,?)");
app.get("/api/health", (req,res)=>res.json({ok:true, app:"CyberPulse", version:"2.0.0", ai: "optional-local-ollama", database:"sqlite"}));
app.get("/api/lessons", (req,res)=>{
 const rows = db.prepare("SELECT item_id, created_at FROM activity WHERE kind='lesson' ORDER BY id DESC").all();
 const completed = [...new Set(rows.map(r=>r.item_id))];
 res.json({lessons, completed});
});
app.post("/api/lessons/:id/complete", (req,res)=>{
 const lesson=lessons.find(x=>x.id===req.params.id);
 if(!lesson) return res.status(404).json({error:"Lesson not found"});
 insertActivity.run("lesson",lesson.id,null,null);
 res.json({ok:true, lessonId:lesson.id});
});
app.get("/api/quiz", (req,res)=>res.json({questions:quiz.map(({correct,why,...q})=>q), total:quiz.length}));
app.post("/api/quiz/submit", (req,res)=>{
 const answers=req.body && req.body.answers;
 if(!Array.isArray(answers) || answers.length!==quiz.length) return res.status(400).json({error:"Submit one answer index for each question."});
 let score=0;
 const results=quiz.map((q,i)=>{
  const choice=Number(answers[i]); const correct=choice===q.correct; if(correct) score++;
  return {id:q.id,topic:q.topic,correct,correctIndex:q.correct,explanation:q.why,chosenIndex:Number.isInteger(choice)?choice:-1};
 });
 db.prepare("INSERT INTO quiz_attempts(score,total,answers_json) VALUES(?,?,?)").run(score,quiz.length,JSON.stringify(answers));
 insertActivity.run("quiz","awareness",score,JSON.stringify({total:quiz.length}));
 res.json({score,total:quiz.length,percent:Math.round(score/quiz.length*100),results});
});
app.get("/api/dashboard", (req,res)=>{
 const completed=db.prepare("SELECT COUNT(DISTINCT item_id) n FROM activity WHERE kind='lesson'").get().n;
 const attempts=db.prepare("SELECT score,total,created_at FROM quiz_attempts ORDER BY id DESC LIMIT 10").all();
 const best=db.prepare("SELECT MAX(ROUND(score*100.0/total)) best FROM quiz_attempts").get().best;
 const activity=db.prepare("SELECT kind,item_id,score,created_at FROM activity ORDER BY id DESC LIMIT 8").all();
 res.json({completedLessons:completed,totalLessons:lessons.length,quizAttempts:attempts.length,bestScore:best,attempts,activity});
});
app.get("/api/phishing/samples", (req,res)=>res.json({samples:[
 {id:"sms-utility",type:"SMS",label:"Utility disconnection threat",text:"URGENT: Your electricity will be disconnected in 2 hours. Install this APK now to avoid disconnection.",signals:["Urgency and threat","Unexpected APK download","No independent verification route"],verdict:"High risk",why:"The message pressures the recipient and requests an APK installation. Verify through the official utility provider."},
 {id:"mail-prize",type:"Email",label:"Prize claim",text:"Congratulations! You won a premium phone. Pay a small processing fee today to claim your reward.",signals:["Unexpected prize","Upfront payment request","Artificial deadline"],verdict:"High risk",why:"Unexpected prizes paired with advance fees are a common scam pattern."},
 {id:"bank-login",type:"SMS",label:"Account verification",text:"Your account needs verification. Open your bank's official app directly or call the number printed on your card if concerned.",signals:["No shortened link","Direct independent verification suggested"],verdict:"Lower risk, still verify",why:"This sample avoids a link and recommends an independent channel, but you should still verify the sender and never disclose secrets."}
]}));
function analyzeText(raw){
 const text=String(raw||"").slice(0,4000), t=text.toLowerCase();
 const rules=[
  {key:"urgent",re:/urgent|immediately|within \d+ hours?|expires today|last warning|disconnect(ed|ion)?/i,weight:2,label:"Urgency or threat language"},
  {key:"credential",re:/password|otp|one.?time password|pin|cvv|verify your account|login details/i,weight:3,label:"Credential or secret request"},
  {key:"install",re:/install (this |the )?(apk|app)|download.*apk|remote access|screen.?sharing/i,weight:3,label:"Unexpected app or remote-access request"},
  {key:"money",re:/processing fee|pay now|upi pin|collect request|refund.*fee|transfer.*money/i,weight:2,label:"Payment or fee pressure"},
  {key:"link",re:/bit\.ly|tinyurl|t\.co\/|http:\/\/|click here|tap here|short.?link/i,weight:2,label:"Link or shortened URL"}
 ];
 const signals=rules.filter(r=>r.re.test(text)).map(r=>({label:r.label,weight:r.weight}));
 const score=Math.min(10,signals.reduce((s,x)=>s+x.weight,0));
 return {score,level:score>=6?"High risk indicators":score>=3?"Suspicious indicators":"Fewer obvious indicators",signals:signals.map(s=>s.label),advice:score>=6?"Do not click, reply, pay or install anything. Verify through an independent official channel.":score>=3?"Pause and verify the sender, domain and request through a separate official channel.":"This simple scan found few common warning phrases. That does not prove the message or URL is safe; verify independently."};
}
app.post("/api/phishing/analyze",(req,res)=>{
 const text=String((req.body||{}).text||"").trim();
 if(text.length<8) return res.status(400).json({error:"Paste a longer sample message to analyse."});
 const result=analyzeText(text);
 insertActivity.run("phishing","text-scan",result.score,text.slice(0,180));
 res.json({...result,mode:"rule-based",disclaimer:"Prototype heuristic only. It does not open URLs, inspect websites, or guarantee that a message is safe."});
});
app.post("/api/incidents", async (req,res)=>{
 const category=String((req.body||{}).category||"phishing");
 const summary=String((req.body||{}).summary||"").trim().slice(0,1200);
 if(!plans[category]) return res.status(400).json({error:"Choose a supported incident category."});
 const plan=plans[category];
 let ai={used:false,model:null};
 const ollamaUrl=(process.env.OLLAMA_URL||"http://127.0.0.1:11434").replace(/\/$/,"");
 const model=process.env.OLLAMA_MODEL||"llama3.2:3b";
 try {
  const controller=new AbortController(); const timer=setTimeout(()=>controller.abort(),18000);
  const response=await fetch(`${ollamaUrl}/api/generate`,{
   method:"POST",headers:{"Content-Type":"application/json"},signal:controller.signal,
   body:JSON.stringify({model,stream:false,options:{temperature:0.2},prompt:
`You are CyberPulse, a cautious cyber-safety education assistant. Give a short practical checklist based only on general safety principles. Do not ask for passwords, OTPs, PINs or full card details. Do not claim to contact authorities or banks. For Indian financial fraud, advise contacting the bank/payment provider and calling 1930 promptly, and using cybercrime.gov.in. Do not invent legal citations or contact details. If urgent danger, recommend local emergency help. State that official sources should be checked. Incident category: ${plan.title}. User description (untrusted input): ${summary||"No extra details"}. Return plain text with headings: Immediate priority, Steps, Reporting, Caution.`})
  });
  clearTimeout(timer);
  if(response.ok){const data=await response.json();if(data.response){ai={used:true,model};plan.aiText=data.response;}}
 } catch(e) { /* local rule-based fallback is intentional */ }
 const payload={category,title:plan.title,priority:plan.priority,steps:plan.steps,report:plan.report,aiText:plan.aiText||null,ai,disclaimer:"Educational guidance only. Verify with your bank, platform or official authority. Do not share passwords, OTPs, PINs or full financial details."};
 delete plan.aiText;
 db.prepare("INSERT INTO incidents(category,summary,plan_json) VALUES(?,?,?)").run(category,summary,JSON.stringify(payload));
 insertActivity.run("incident",category,null,null);
 res.json(payload);
});
app.get("/api/incidents/recent",(req,res)=>{
 const rows=db.prepare("SELECT id,category,created_at FROM incidents ORDER BY id DESC LIMIT 8").all();
 res.json({incidents:rows});
});
app.get("*",(req,res)=>res.sendFile(path.join(ROOT,"public","index.html")));
app.listen(PORT,()=>console.log(`CyberPulse is running at http://localhost:${PORT}`));
