# Contributing to Raasta (रास्ता)

Thank you for your interest in contributing to **Raasta**! We are building India's open-source citizen recovery layer to bring clarity, dignity, and calm to public welfare services.

Whether you're fixing a bug, adding support for a new Indian language, improving voice AI interfaces, or adding adapters for new welfare schemes (such as PM-Awas, Ration PDS, Ayushman Bharat, or State DBT programs), your contributions are deeply appreciated.

---

## 🏛️ Guiding Architectural Principles

Before writing code, please keep our core tenets in mind:

1. **Deterministic Truth vs. AI Explanation**:
   - **Rules determine reality**: State transitions, evidence requirements, and "whose turn it is" are 100% deterministic TypeScript domain logic.
   - **AI explains reality**: Sarvam AI and LLM models are purely assistive interfaces that explain state, translate to native dialects, and answer citizen queries. AI is never given the authority to mutate official case states.

2. **Citizen-First Calm (Apple Restraint)**:
   - Avoid cluttered dashboards, overwhelming tables, or bureaucratic jargon.
   - Every case screen must answer the **5 Core Civic Questions** in exact hierarchy:
     1. *What happened?*
     2. *Why?*
     3. *Whose turn is it?*
     4. *What do I need to do?*
     5. *What happens next?*

3. **No False Certainties**:
   - Never invent arbitrary deadlines or SLAs (e.g. "will be resolved in 7 days") unless officially codified by government Gazette or departmental rules.
   - If the state is reviewing, tell the citizen clearly: *"You don't need to do anything right now."*

4. **Language as an Entry Gate**:
   - Language is access, not a settings dropdown. Always ensure first-class support for native Indian scripts (Devanagari, Telugu, Tamil, Kannada, Bengali, Marathi, Gurmukhi) and audio playback.

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: `v20.x` or higher
- **Package Manager**: `npm` (v10+)
- **Git**

### Local Setup

```bash
# 1. Clone the repository
git clone https://github.com/shashankatthaluri/Raasta.git
cd Raasta

# 2. Install dependencies
npm install

# 3. Setup environment variables
cp .env.example .env.local  # (Optional: Add SARVAM_API_KEY / DATABASE_URL)

# 4. Start local development server
npm run dev

# 5. Run test suite
npm test
```

Visit [`http://localhost:3000`](http://localhost:3000) in your browser.

---

## 🛠️ Development Workflow

1. **Fork & Branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. **Coding Standards**:
   - Follow TypeScript strict type safety.
   - Use Tailwind CSS v4 design tokens and Apple-grade spatial components.
   - Ensure multi-lingual copy is updated in `src/lib/caseTranslations.ts` across all 8 supported languages.
3. **Running Verification**:
   ```bash
   # Run all Vitest unit & contract tests
   npm test

   # Run Next.js production compilation & type check
   npm run build
   ```
4. **Submitting a Pull Request**:
   - Write a concise, clear PR description explaining what was changed and the motivation.
   - Include before/after screenshots or screen recordings for any UI changes.

---

## 🌐 Adding a New Welfare Scheme

To add a new public welfare scheme (e.g. Ayushman Bharat or PM-Awas Yojana):
1. Define the journey states in `src/domain/journeys.ts`.
2. Implement the state transitions in `src/domain/engine.ts`.
3. Add a corresponding adapter in `src/adapters/` extending `GovernmentAdapter`.
4. Add journey unit tests in `src/app/api/__tests__/journeys.api.test.ts`.

---

## 📜 Code of Conduct

We are dedicated to providing a welcoming, inclusive, and harassment-free environment for everyone. Please treat all contributors, maintainers, and community members with mutual respect and empathy.

---

## 💬 Community & Questions

- **GitHub Issues**: For bug reports, feature proposals, and technical discussions.
- **Repository**: [https://github.com/shashankatthaluri/Raasta](https://github.com/shashankatthaluri/Raasta)
- **Live Deployment**: [https://raasta.online](https://raasta.online)
