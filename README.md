# Element Craft

An advanced, AI-powered browser game where you merge basic elements to discover an ever-expanding universe of new creations.

This project was generated using AI, including the game concept, structure, and implementation logic. The goal is to simulate an *infinite crafting system* where new elements are dynamically created using AI while maintaining logical consistency.

---

## 🚀 Live Demo

👉 **Play the game here:**
[https://element-craft.designarena.ai]

---

## 🧠 Concept

Inspired by games like Infinite Craft and Little Alchemy, this project allows players to:

* Start with basic elements: **Water, Fire, Earth, Air**
* Combine elements to discover new ones
* Build a massive, ever-growing collection
* Explore logically generated creations powered by AI

Unlike traditional crafting games, this system is designed to feel **endless**, with AI generating new elements on demand.

---

## ⚙️ Features

* 🔀 Drag-and-drop element merging
* 🧠 AI-generated combinations (infinite potential)
* 📦 Persistent storage using `localStorage`
* 🔍 Searchable inventory system
* ✨ Discovery animations
* 📊 Progress tracking & achievements
* 📜 History log of discoveries
* 🌙 Optional dark mode

---

## 🧩 How It Works

* Each combination of elements is checked against existing data.
* If the combination doesn't exist:

  * An AI system generates a **new, logically consistent element**
  * The result is cached so it remains consistent
* All discoveries are saved locally in the browser

---

## ▶️ How to Run Locally

⚠️ **Do NOT just open `index.html` directly** — it will break due to browser restrictions.

### Option 1: Quick Run (Recommended)

1. Install Node.js (if not already installed)
2. Open a terminal in your project folder
3. Run:

```
npx serve .
```

or:

```
npx http-server .
```

4. Open your browser and go to:

```
http://localhost:3000
```

---

### Option 2: If the `/api` Folder Is Used

If your project includes backend logic inside `/api`, you may need to run it separately:

1. Install dependencies:

```
npm install
```

2. Start the server:

```
node api/server.js
```

or:

```
npm start
```

3. Then open the frontend (either via server or a local dev server)

---

### Why This Is Required

* Browsers block local file imports (`file://`)
* Modules and API calls won’t work without a server
* A local server simulates a real deployment environment

---

## ⚠️ Important Design Rule

This project enforces **logical consistency** in all generated elements:

* Every combination must make sense

  * Example: `Fire + Water = Steam` ✅
  * Example: `Fire + Water = Banana Laser` ❌
* Abstract combinations are allowed, but must still be meaningful
* If no logical result exists, the system may reject the merge

This prevents the game from turning into random nonsense.

---

## 🤖 AI-Generated Project

This project was created using AI.
Below is the exact prompt used to generate the game:

---

## 🧾 AI Prompt Used

```
Create a fully functional, browser-based game inspired by Infinite Craft and Little Alchemy, where players merge elements to discover new ones. The game must be long-term engaging, technically robust, and powered by AI for dynamic content generation.

CORE CONCEPT:
- The player starts with 4 base elements: Water, Fire, Earth, Air.
- Players can drag and combine two elements to create new ones.
- The system should support theoretically infinite combinations using AI generation.

AI INTEGRATION (CRITICAL):
- Use an AI model (mock API or real API structure) to generate new elements when a combination is attempted that does not already exist.
- The AI should:
  - Take two input elements (e.g., "Water" + "Fire")
  - Return:
    - A new element name
    - A short description
    - Optional category (e.g., nature, technology, abstract)

LOGICAL CONSISTENCY (MANDATORY):
- Every generated element MUST be reasonable and logically derived from its parent elements.
- The AI must follow these rules:
  - The result should reflect a real-world relationship, transformation, or commonly understood concept.
  - Abstract combinations are allowed, but must still make sense.
  - Avoid random, unrelated, or nonsensical outputs.
  - Avoid repeating or slightly renaming existing elements.
  - Prefer widely recognizable concepts over obscure or meaningless ones.
- If no logical combination exists, the AI should:
  - Return a fallback like "Unknown" or
  - Refuse the merge with a message like "These elements cannot logically combine"

- Cache results so the same combination always returns the same output.

GAME SYSTEMS:
- Maintain a growing collection/inventory of discovered elements.
- Display elements as draggable UI cards or bubbles.
- Allow combining via drag-and-drop or click selection.
- Show discovery animations when a new element is created.
- Include a search bar to filter discovered elements.

PROGRESSION:
- Track total discoveries.
- Unlock achievements for milestones (e.g., 50 elements, 100 elements, rare combinations).
- Highlight “rare” or “complex” elements.

UI/UX:
- Clean, modern interface with smooth animations.
- Responsive layout (desktop-first but works on mobile).
- Visual feedback when combining elements.

TECHNICAL REQUIREMENTS:
- Use HTML, CSS, and JavaScript only (no backend required, but structure it as if an API exists).
- Simulate AI responses with a function if no API key is provided.
- Store discovered elements and combinations using localStorage so progress persists.

ADVANCED FEATURES:
- Prevent infinite loops or meaningless duplicates.
- Allow element chaining for deeper combinations.
- Add a history log of discoveries.
- Include a reset button with confirmation.

IMPORTANT:
- The game must feel endless, not finite.
- AI generation must be central, not a gimmick.
- Logical consistency is more important than randomness.
- Code should be clean, modular, and scalable.
```

---

## 📌 Notes

* This project does **not currently use a license**
* You are free to experiment, modify, and expand it
* AI-generated projects still require human iteration to reach production quality

---

## 🧱 Future Improvements

* Real AI API integration (instead of simulation)
* Better filtering for edge-case combinations
* Multiplayer/shared discoveries
* Cloud save system

---

## 💡 Final Thought

If your AI logic is weak, the entire game becomes trash.
The quality of this project depends entirely on how well the system enforces **meaningful, logical generation**.

---
