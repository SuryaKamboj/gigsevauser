# UI/UX Information Architecture & Wireframe Specification

## Project Name: KAIROVA
**Lead UX Architect & Senior Product Designer:** SIH Solution Design Team  
**Design Philosophy:** "Trust through Transparency, Inclusion through Simplicity"  
**Document Version:** 1.0.0  

---

## 1. Global Experience Philosophy & Design System Tokens

KAIROVA serves three distinct user classes with radically different technical confidence and environments:

```
  ┌───────────────────────────┬───────────────────────────┬───────────────────────────┐
  │     CUSTOMER PORTAL       │       WORKER PORTAL       │      ADMIN DASHBOARD      │
  ├───────────────────────────┼───────────────────────────┼───────────────────────────┤
  │ • Aesthetics: Premium,    │ • Aesthetics: High-       │ • Aesthetics: Operational,│
  │   Clean, Modern           │   Contrast, Accessible    │   Data-Dense, Analytical  │
  │ • Target: Homeowners,     │ • Target: Local Skilled   │ • Target: Coop Secretaries│
  │   Apartment Residents     │   Workers (Low Literacy)  │   & Regional Directors    │
  │ • Focus: Trust, Speed,    │ • Focus: Large Touch      │ • Focus: Real-time Fleet, │
  │   Voice & 1-Tap Booking   │   Targets, Voice, Earnings│   Pooling Audit, Heatmaps │
  └───────────────────────────┴───────────────────────────┴───────────────────────────┘
```

### Key Design Tokens
* **Primary Brand Palette:** Deep Cooperative Navy (`#0F172A`), Empowerment Emerald (`#059669`), Safety Coral/SOS (`#DC2626`).
* **Typography:** Inter (Headings & Body), Outfit (Hero & Numerical Metrics), Noto Sans (Multilingual Hindi/Regional text).
* **Elevations & Glassmorphism:** Subtle background blurs (`backdrop-blur-md`), soft shadow layers for depth.

---

## 2. Customer Portal UI/UX Architecture

### 2.1 Screen Inventory & Route Map
* `/customer` — Home & Service Discovery Hub
* `/customer/category/:slug` — Category Details & Worker Selection
* `/customer/checkout` — Location & Razorpay Payment Checkout
* `/customer/track/:bookingId` — Real-Time Worker Live Tracking & Status
* `/customer/history` — Past Bookings & Invoices
* `/customer/profile` — User Settings & Saved Addresses

---

### 2.2 Navigation, Header & Placements

```
 ┌─────────────────────────────────────────────────────────────────────────────┐
 │ [Logo: KAIROVA]  [📍 Location: South Delhi ▾]     [🎙️ Voice Assist]  [🚨 SOS]│
 ├─────────────────────────────────────────────────────────────────────────────┤
 │ 🔍 Search "Fix electrical wiring, plumber..."                               │
 └─────────────────────────────────────────────────────────────────────────────┘
```

* **Header Components:**
  * **Brand Logo:** Kairova Cooperative Shield icon.
  * **Location Selector:** Auto-detects GPS coordinates + dropdown manual pincode picker.
  * **Voice Assistant Placement:** Glowing mic icon inside the central search bar AND a sticky floating action button (FAB) on the bottom-right screen corner.
  * **Emergency SOS Placement:** Bright Red Pill (`[🚨 EMERGENCY SOS]`) pinned to the top-right header navigation for immediate 1-tap booking.
* **Navigation Bar:** Fixed bottom navigation bar on mobile web (Home, Bookings, Active Track, Profile).

---

### 2.3 Key Widgets & AI Components
* **AI Worker Match Card:** Displays recommended local worker with Trust Score badge (`94/100`), distance (`1.2 km`), category skill match percentage (`98% Match`), and verified cooperative tag (`South Delhi Coop`).
* **Price Transparency Pill:** Explicitly shows the revenue distribution breakdown to the customer before payment:
  ```
  Total Fee: ₹500 ───► Worker Receives: ₹425 (85%) | Coop Fund: ₹50 (10%) | Platform: ₹25 (5%)
  ```

---

### 2.4 Customer Booking Journey Wireframe Layout
```
 [Step 1: Discovery]      [Step 2: Matching]       [Step 3: Checkout]       [Step 4: Live Track]
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│ Service Grid     │     │ AI Recommended   │     │ Address Summary  │     │ Live Google Map  │
│ [⚡ Electrical]  │ ──► │ Worker Cards     │ ──► │ Razorpay Payment │ ──► │ Worker Moving Pin│
│ [🚰 Plumbing]    │     │ Trust Score: 94  │     │ 85/10/5 Split    │     │ OTP: 4821        │
│ [🎙️ Voice Book]  │     │ [Select Worker]  │     │ [Pay & Confirm]  │     │ Status: In Transit│
└──────────────────┘     └──────────────────┘     └──────────────────┘     └──────────────────┘
```

---

## 3. Worker Portal UI/UX Architecture (High Accessibility PWA)

### 3.1 Screen Inventory & Route Map
* `/worker` — Home & Availability Dashboard
* `/worker/active-job/:bookingId` — Active Job Execution & Navigation Map
* `/worker/earnings` — Financial Ledger & Payout History
* `/worker/welfare` — Social Security & Insurance Hub
* `/worker/profile` — Skill Profile & Verification Status

---

### 3.2 Navigation & Header Layout

```
 ┌─────────────────────────────────────────────────────────────────────────────┐
 │  [👤 Profile]   [🏆 Trust Score: 92/100]           [🌐 Language: हिंदी ▾]  │
 ├─────────────────────────────────────────────────────────────────────────────┤
 │                      STATUS: [ 🟢 ONLINE / OFFLINE ]                        │
 └─────────────────────────────────────────────────────────────────────────────┘
```

* **Header Components:**
  * **Trust Score Display:** Prominent circular badge displaying current score (`92/100`) and Tier (`Master Artisan`), giving workers instant visual pride in their reliability score.
  * **Language Switcher:** 1-tap dropdown supporting English, Hindi, and regional languages with text + voice guidance audio hints.
  * **Large Availability Switch:** High-contrast toggle switch (`OFFLINE` ➔ `ONLINE`) with clear color states (Gray ➔ Emerald Green).

---

### 3.3 Key Components & Job Request Modal
* **Incoming Job Request Banner (Overlay Modal):**
  * Visual 30-second countdown ring.
  * Service Type & Address (with distance in km).
  * **Net Earnings Display:** Prominently displays the worker's 85% payout in large green numbers (e.g., `You Earn: ₹425`).
  * Large green **[ ACCEPT JOB ]** button and red **[ DECLINE ]** button.
* **Active Job Execution View:**
  * One-tap launch to Google Maps turn-by-turn navigation.
  * Customer Contact Button (Masked call/chat).
  * **Start Job OTP Input:** Large numerical keypad for customer 4-digit verification.

---

### 3.4 Worker Journey Wireframe Layout
```
 [Status: ONLINE]         [Job Alert Card]        [Active Job View]        [Completion & Cash]
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│ Availability: ON │     │ ⚡ Electrical    │     │ Google Maps Route│     │ Job Complete!    │
│ Trust Score: 92  │ ──► │ You Earn: ₹425   │ ──► │ Enter Customer   │ ──► │ Earned: ₹425     │
│ Waiting for jobs │     │ Distance: 1.8km  │     │ OTP: [ _ _ _ _ ] │     │ Trust Score: +1  │
│                  │     │ [ ACCEPT (30s) ] │     │ [ Complete Job ] │     │ [ Back to Home ] │
└──────────────────┘     └──────────────────┘     └──────────────────┘     └──────────────────┘
```

---

## 4. Admin Dashboard UI/UX Architecture (Cooperative Operations)

### 4.1 Screen Inventory & Route Map
* `/admin` — Operations Overview & Key Performance Indicators
* `/admin/map` — Real-Time Fleet & Active Job Map
* `/admin/pooling` — Inter-Cooperative Pooling Audit Ledger
* `/admin/verification` — Worker Document Verification Queue
* `/admin/forecasting` — AI Demand Heatmap & Resource Planning
* `/admin/complaints` — Sentiment Analysis & Dispute Stream

---

### 4.2 Sidebar & Layout Grid

```
 ┌──────────────────┬──────────────────────────────────────────────────────────┐
 │ KAIROVA ADMIN    │ [Header: South Delhi Coop Admin]     [🔔 Alerts (3)]      │
 ├──────────────────┼──────────────────────────────────────────────────────────┤
 │ 📊 Overview      │ ┌────────────────┐ ┌────────────────┐ ┌────────────────┐ │
 │ 🗺️ Fleet Map      │ │ Active Workers │ │ Today's Revenue│ │ Pooled Jobs    │ │
 │ 🤝 Inter-Pooling │ │      142       │ │   ₹ 68,500     │ │   18 (Shared)  │ │
 │ 📄 Verifications │ └────────────────┘ └────────────────┘ └────────────────┘ │
 │ 📈 Demand Heatmap│ ┌──────────────────────────────────────────────────────┐ │
 │ 💬 Sentiments    │ │              REAL-TIME MAP / HEATMAP LAYER           │ │
 └──────────────────┴──────────────────────────────────────────────────────────┘
```

* **Sidebar Structure:** Fixed collapsible left sidebar with explicit icons and badge counters for pending worker verifications and negative sentiment alerts.
* **Heatmap Placement:** Integrated directly into the `/admin/forecasting` view and accessible as a toggle layer (`[ Show Demand Heatmap ]`) on the `/admin/map` fleet tracking view.

---

### 4.3 Key Admin Widgets
1. **Inter-Cooperative Pooling Widget:**
   * Live transaction ticker showing pooled orders shared between Coop A and Coop B.
   * Highlights fee distribution: Servicing Coop (9%), Referring Coop (1%), Worker (85%).
2. **Worker Verification Card:**
   * Side-by-side view of uploaded Aadhaar/Skill certificates alongside worker profile details.
   * Action buttons: `[ APPROVE & ACTIVATE ]` or `[ REJECT WITH REASON ]`.
3. **Sentiment Analysis Stream:**
   * Customer reviews automatically tagged with sentiment pills (`POSITIVE` / `NEGATIVE`).
   * Red warning badge for negative reviews with direct `[ Call Customer ]` / `[ Open Dispute ]` resolution triggers.

---

## 5. UI Layout Summaries for Core Features

| Feature | Primary Portal | Screen Placement | Visual Component Type |
| :--- | :--- | :--- | :--- |
| **Emergency SOS** | Customer & Worker | Top-Right Navigation Header & Floating Action Pill | High-contrast Red Button with instant broadcast pulse |
| **Voice Assistant** | Customer | Embedded Search Bar & Bottom-Right Floating Mic | Animated audio wave circle with transcript toast |
| **Trust Score Badge** | Worker & Customer | Top Profile Header (Worker) & Match Cards (Customer) | Radial ring progress meter (0–100) with tier label |
| **Inter-Coop Ledger** | Admin | `/admin/pooling` & Financial Overview | Dual-column table showing Coop A / Coop B 9%/1% split |
| **Demand Heatmap** | Admin | `/admin/forecasting` & Live Map Layer | Google Maps Heatmap Layer (Red = Deficit, Green = Surplus) |
