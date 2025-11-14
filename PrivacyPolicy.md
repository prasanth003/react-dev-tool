# Privacy Policy for React Performance Monitor

**Last updated:** [Add date]

Thank you for using **React Performance Monitor**.  
Your privacy is important to us. This extension analyzes React component render performance **without collecting, storing, transmitting, or sharing any personal data**.

---

## 1. Information We Do Not Collect

React Performance Monitor:

- does not collect or store personal information  
- does not track browsing history  
- does not store or transmit any data to external servers  
- does not use analytics, cookies, or tracking technologies  

All processing occurs locally in your browser.

---

## 2. How the Extension Works

- The extension injects a lightweight script (`content.js`) into web pages only to detect React components and monitor render performance.  
- All performance measurements happen **on device**, in memory.  
- No page content, user interactions, or network activity are collected or transmitted.

---

## 3. Permissions Used

### `<all_urls>`

This permission is needed so the extension can detect React applications across any website.

It allows the extension to:

- check whether the current page uses React  
- read component render counts  
- provide performance insights to the user  

It does **not** allow or perform:

- reading page content  
- storing or logging any information  
- sending data to external servers  

No additional permissions are used.

---

## 4. No Third-Party Services

The extension does not use any third-party APIs, SDKs, CDNs, or analytics tools.

---

## 5. Data Sharing

No data is collected, and therefore no data is shared.

---

## 6. Changes to This Policy

Any updates to this policy will be posted here. You may review this document at any time.

---

## 7. Contact

If you have any questions about this policy, contact:

**Developer:** Prasanth Sekar  
**Email:** info.prasanthsekar.gmail.com  
**Website:** https://prasanthsekar.info  

---

# Host Permission Justification

React Performance Monitor requests the host permission `"matches": ["<all_urls>"]` to detect and profile React apps on any webpage.

This permission is required because:

- React apps may appear on any domain  
- performance profiling must run in the context of the active page  
- the extension needs to inject `content.js` to detect React components  

The extension:

- does not read or store page data  
- does not log or track user activity  
- does not send any information to external servers  

This permission is used solely for React performance measurement.

---

# Remote Code Justification

React Performance Monitor **does not execute or load any remote code**.

- All scripts are packaged locally within the extension  
- No scripts are loaded from the internet  
- No external servers are contacted  

All functionality runs completely offline inside the user's browser.

---

# Single Purpose Description

React Performance Monitor’s only purpose is to measure and display real-time React component render performance, helping developers identify unnecessary renders and optimize application efficiency.