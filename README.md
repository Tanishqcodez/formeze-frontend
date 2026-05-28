# Formeze

> **Form-as-a-service — collect submissions from any website, zero backend required.**

![Formeze Banner](https://via.placeholder.com/1200x400/0f1117/2ACA65?text=formeze)

---

## What is Formeze?

Formeze is a developer-friendly form backend that lets you add contact forms, lead capture forms, and any other submission form to your website in minutes — no server setup, no database, no backend code. Just point your form at a Formeze endpoint and submissions land straight in your dashboard with instant email notifications.

---

## Features

- **Zero backend** — drop in a snippet or POST to our REST endpoint; Formeze handles the rest
- **Instant email notifications** — get notified the moment a new message arrives
- **Dashboard inbox** — view, reply to, and manage all submissions in one place
- **Spam protection** — honeypot fields, reCAPTCHA v3, and IP-based rate limiting built in
- **Custom redirects** — send users to a thank-you page after submission
- **Integrations** — connect to Slack, Notion, Airtable, Google Sheets, Mailchimp, and Zapier
- **Webhooks** — POST submission data as JSON to any URL in real time
- **File uploads** — accept attachments directly through your forms
- **Team support** — invite teammates and manage access on Business plans
- **GDPR compliant** — data encrypted in transit (TLS 1.3) and at rest (AES-256)

---

## Getting Started

### 1. Create an account

Sign up at [formeze](https://formeze.netlify.app/) — the free plan requires no credit card.

### 2. Create a form

In your dashboard click **New Form**, give it a name, and copy your unique form endpoint.

### 3. Add it to your site

**HTML form (simplest)**

```html
<form action="https://formeze.up.railway.app/f/YOUR_ID" method="POST">
  <input type="text"  name="name"    placeholder="Your name"    required />
  <input type="email" name="email"   placeholder="Your email"   required />
  <textarea           name="message" placeholder="Your message" required></textarea>
  <button type="submit">Send</button>
</form>
```

**Fetch / JavaScript**

```js
const res = await fetch("https://formeze.up.railway.app/f/YOUR_ID", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name, email, message }),
});

if (res.ok) console.log("Submission received!");
```

**React**

```jsx
const handleSubmit = async (e) => {
  e.preventDefault();
  await fetch("https://formeze.up.railway.app/f/YOUR_ID", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });
};
```

---

## Configuration

Each form can be configured from the **Form Settings** panel in your dashboard.

| Setting | Description |
|---|---|
| `redirect_url` | URL to redirect the user to after a successful submission |
| `email_notifications` | One or more email addresses to notify on new submissions |
| `allowed_origins` | Restrict submissions to specific domains (CORS) |
| `recaptcha` | Enable / disable reCAPTCHA v3 |
| `honeypot` | Enable / disable honeypot spam protection (on by default) |
| `file_uploads` | Allow file attachments (paid plans) |
| `webhook_url` | POST submission payload to your own endpoint |

---

## Integrations

Connect Formeze to your favourite tools in one click from the **Integrations** tab.

| Integration | What it does |
|---|---|
| **Slack** | Posts a message to a channel on every new submission |
| **Notion** | Adds a row to a Notion database |
| **Airtable** | Creates a new record in a base |
| **Google Sheets** | Appends a row to a spreadsheet |
| **Mailchimp** | Subscribes the sender to a mailing list |
| **Zapier** | Connects to 5,000+ apps via Zaps |

---

## Webhooks

Enable webhooks on any paid plan. When a form is submitted, Formeze sends a `POST` request to your configured URL with the following JSON body:

```json
{
  "form_id": "abc123",
  "form_name": "Contact Form",
  "submitted_at": "2026-05-15T10:42:00Z",
  "data": {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "message": "Hello, I'd love to learn more."
  }
}
```

Formeze expects a `2xx` response within 10 seconds. Failed deliveries are retried up to 3 times with exponential back-off.

---


## Security

- All data encrypted **in transit** with TLS 1.3
- All data encrypted **at rest** with AES-256
- Infrastructure hosted on **SOC 2 Type II** certified servers
- **GDPR compliant** — your data is never sold or shared
- Built-in **honeypot**, **reCAPTCHA v3**, and **IP rate-limiting** on every form
- Optional **allowed origins** list to prevent unauthorised submissions

---

## API Reference

Base URL: `https://formeze.up.railway.app/`

### Submit a form

```
POST /f/:form_id
Content-Type: application/json
```

**Request body** — any key/value pairs matching your form fields.

**Responses**

| Status | Meaning |
|---|---|
| `200 OK` | Submission accepted |
| `400 Bad Request` | Missing required fields or validation error |
| `403 Forbidden` | Origin not in allowed list |
| `429 Too Many Requests` | Rate limit exceeded |

### Get submissions *(authenticated)*

```
GET /forms/:form_id/submissions
Authorization: Bearer YOUR_API_KEY
```

Returns a paginated list of submissions for the given form.

Full API docs are available at [formeze.netlify.app/docs](https://formeze.netlify.app/Docs).

---



Support hours: **Monday – Friday, 9am – 6pm UTC**. Pro and Business customers receive priority responses.

---

## License

Formeze's client-side libraries are open source under the [MIT License](LICENSE). The Formeze service itself is proprietary — see [formeze.netlify.app/terms](https://formeze.netlify.app/) for full terms of service.

---

<p align="center">Made with ♥ by the Formeze team · <a href="https://formeze.netlify.app/">formeze.netlify.app</a></p>
