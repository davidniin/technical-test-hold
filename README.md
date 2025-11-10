# 📁 Realtime Documents — Technical-test-hold

A **Vanilla JavaScript (ES Modules)** app built with **Vite**, connected to a **Go backend** providing a REST API (`/documents`) and a WebSocket channel (`/notifications`) for realtime updates.

The app displays a list of documents in **List** or **Grid** view, supports local document creation, and listens for live notifications.

---

## 🚀 Setup

```bash
git clone <repo-url>
cd <repo-folder>
npm install
```

### Environment
Create a `.env` file based on `.env.example`:

```
VITE_API_BASE_URL=http://localhost:8080
VITE_WS_URL=http://localhost:8080/notifications
```

### Run
```bash
npm run dev
```
> Open [http://localhost:********](http://localhost:********)

### Build & Test
```bash
npm run build
npm run preview
npm test
```

---

## ⚙️ Stack

| Tool | Purpose |
|------|----------|
| **Vite** | Fast dev/build environment |
| **Vitest + jsdom** | Lightweight unit testing |
| **WebSocket API** | Realtime communication |
| **Vanilla JS** | Clean modular architecture |
| **Go backend** | Fake data + live updates |

---

## 🧩 How It Works
- Loads initial documents from `GET /documents` (HTTP).
- Listens to `/notifications` (WebSocket) for live updates.
- Uses a simple **in-memory store** (pub/sub pattern).
- Switches between **List** and **Grid** views.
- Handles **reconnection** automatically when WS drops.

---

## 🧪 Tests

| File | Tested Module |
|-------|----------------|
| `store.test.js` | store state & subscriptions |
| `sorting.test.js` | sorting logic |
| `dom.test.js` | DOM helpers |
| `date.test.js`   | date formatting utils|
Run:
```bash
npm test
```

**Author:** David Nin — Senior Frontend Developer   