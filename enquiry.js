// Receives the website enquiry form and notifies Dr. Akash by email (Resend) and WhatsApp (CallMeBot).
// Secrets live in Netlify environment variables, never in the browser.
exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method not allowed" };
  let d;
  try { d = JSON.parse(event.body || "{}"); } catch { return { statusCode: 400, body: "Bad request" }; }
  if (d.website) return { statusCode: 200, body: JSON.stringify({ ok: true }) }; // honeypot: bots fill this

  const clean = (v, n) => String(v || "").replace(/[\r\n]+/g, " ").trim().slice(0, n);
  const name = clean(d.name, 80), phone = clean(d.phone, 20), need = clean(d.need, 80), note = clean(d.message, 400);
  if (!name || !/^[+\d][\d\s-]{7,15}$/.test(phone)) return { statusCode: 400, body: "Invalid details" };

  const text = `New enquiry from your website\nName: ${name}\nPhone: ${phone}\nConcern: ${need}` + (note ? `\nNote: ${note}` : "");
  const { RESEND_API_KEY, CALLMEBOT_APIKEY } = process.env;
  const email = process.env.NOTIFY_EMAIL || "dr.akashupadhyay13@gmail.com";
  const wa = process.env.NOTIFY_PHONE || "918892864631";

  const jobs = [];
  if (RESEND_API_KEY) jobs.push(fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: "Website Enquiry <onboarding@resend.dev>", to: [email], subject: `New enquiry: ${need} (${name})`, text })
  }));
  if (CALLMEBOT_APIKEY) jobs.push(fetch(`https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent("+" + wa)}&text=${encodeURIComponent(text)}&apikey=${CALLMEBOT_APIKEY}`));

  const results = await Promise.allSettled(jobs);
  const ok = results.some(r => r.status === "fulfilled" && r.value.ok);
  return { statusCode: ok ? 200 : 502, body: JSON.stringify({ ok }) };
};
