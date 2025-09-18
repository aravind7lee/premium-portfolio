var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// netlify/functions/contact.js
var contact_exports = {};
__export(contact_exports, {
  handler: () => handler
});
module.exports = __toCommonJS(contact_exports);
var WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";
var handler = async (event, context) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: { Allow: "POST", "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Method not allowed" })
    };
  }
  const accessKey = process.env.WEB3FORMS_ACCESS_KEY;
  if (!accessKey) {
    console.error("Missing WEB3FORMS_ACCESS_KEY env var.");
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server misconfigured" })
    };
  }
  let payload;
  try {
    payload = JSON.parse(event.body || "{}");
  } catch (err) {
    console.error("Invalid JSON body", err);
    return { statusCode: 400, body: JSON.stringify({ error: "Invalid JSON" }) };
  }
  const { name, email, subject, message } = payload;
  if (!name || !email || !message) {
    return { statusCode: 400, body: JSON.stringify({ error: "Missing required fields" }) };
  }
  const body = {
    access_key: accessKey,
    name,
    email,
    subject: subject || "",
    message,
    source: "portfolio-contact-form"
  };
  try {
    const res = await fetch(WEB3FORMS_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    const resJson = await res.json().catch(() => ({}));
    if (!res.ok) {
      console.error("Web3Forms returned error", res.status, resJson);
      return { statusCode: 500, body: JSON.stringify({ error: "Failed to send", details: resJson }) };
    }
    return { statusCode: 200, body: JSON.stringify({ ok: true, res: resJson }) };
  } catch (err) {
    console.error("Error forwarding to Web3Forms", err);
    return { statusCode: 500, body: JSON.stringify({ error: "Server error" }) };
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});
//# sourceMappingURL=contact.js.map
