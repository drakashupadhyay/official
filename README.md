# Dr. Akash Kumar Upadhyay - portfolio + enquiry notifications

Enquiry form -> Netlify function -> **email** (Resend) + **WhatsApp** (CallMeBot) to Dr. Akash.

## One-time setup
1. **Email:** create a free account at resend.com using dr.akashupadhyay13@gmail.com, create an API key.
   (Free plan sends from onboarding@resend.dev to the account owner's own email, which is what we need.)
2. **WhatsApp:** from +91 88928 64631, send "I allow callmebot to send me messages" to the CallMeBot WhatsApp
   number listed at callmebot.com/blog/free-api-whatsapp-messages. It replies with an API key.
3. Put this folder in a GitHub repo and import it in Netlify (functions do not work with drag-and-drop deploys).
4. Netlify > Site settings > Environment variables, add:
   - `RESEND_API_KEY` = key from step 1
   - `CALLMEBOT_APIKEY` = key from step 2
   - optional: `NOTIFY_EMAIL`, `NOTIFY_PHONE` (defaults are already Dr. Akash's)
5. Redeploy, submit a test enquiry, check email and WhatsApp.

If the function is unreachable (e.g. index.html opened locally, or keys not set), the form shows an error asking the
visitor to call +91 88928 64631. No WhatsApp window is ever opened by the form.
