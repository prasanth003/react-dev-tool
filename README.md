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
