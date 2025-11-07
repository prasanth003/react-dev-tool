# React Dev Tool

A Chrome DevTools extension and panel for visualizing and diagnosing performance issues in React applications.

## 🚀 What it does  
- Adds a custom DevTools panel in Chrome (via Manifest V3) to inspect React component performance.  
- Tracks and reports metrics such as render counts, re‑renders, component update durations, and slow operations.  
- Offers both a standalone extension popup and an embedded DevTools view — making it easy to debug performance without leaving your browser’s dev workflow.  
- Built with React, TypeScript, Vite and optimized for Chrome extension development.

## 🧩 Why use this  
- Quickly identify inefficient re‑renders or unexpected updates in your React tree.  
- Integrate performance insights directly into your browser, rather than relying solely on external profiling tools.  
- Lightweight and extension‑native: minimal overhead, just plug into your app and start exploring render behaviour.

## 📦 Tech stack  
- React + TypeScript for UI components  
- Vite for fast local development & bundling  
- Chrome Extension (Manifest V3) to create the DevTools panel  
- Tailwind (optional) for styling (or adjust if you used a different system)  
- Custom hooks or instrumentation logic to capture render metrics  

## 🛠️ Getting started  
1. Clone the repo:  
   ```bash
   git clone https://github.com/prasanth003/react-dev-tool.git  
   cd react-dev-tool

2.	Install dependencies:
   ```bash
   npm install
   ```

3. Build for production:
   ```bash
   npm run build
   ```

4. Load the extension in Chrome:

   - Go to chrome://extensions/
	- Enable Developer mode
	- Click Load unpacked and select the dist/ (or build output) folder
	- Open your React app, then open DevTools and switch to the “React Dev Tool” panel.


## 📋 Usage
- With your React app open in the browser, open DevTools (⌘ + Option + I on macOS / Ctrl + Shift + I on Windows).
- Select the “React Dev Tool” panel (or whatever name you defined).
- View the performance metrics: render durations, update counts, component tree state.
- Use filters or search to focus on specific sub‑trees or components.
- Identify slow components or frequent re‑renders, then inspect and optimize.

## 🧪 Tips for optimization
- Keep your render tree shallow and avoid passing new object/array props unintentionally.
- Memoize components using React.memo or use callback refs/handlers intelligently.
- Use profiling tools (React Profiler) in parallel to this extension for deeper dives.
- Use this tool iteratively during development, not just at the end, so you catch issues early.

## ❗ Known limitations
- Works with React applications only (currently versions 16.8+ with hooks).
- Extensions may be subject to browser security policies — in some cases you’ll need to enable “Allow access to file URLs” if debugging local files.
- Metrics are approximate and designed for quick insights, not exact performance certification.

## 🤝 Contribution

Feel free to fork the project, raise issues, or propose enhancements. Pull requests are welcome — please follow the existing code style and include tests for new instrumentation logic where possible.
   
