# Contributing to Raasta (रास्ता)

Thank you for your interest in contributing to **Raasta**! We are building India's open-source citizen recovery layer to bring clarity, dignity, and calm to public welfare services.

Whether you're fixing a bug, adding support for a new Indian language, improving voice AI interfaces, or adding adapters for new welfare schemes (such as PM-Awas, Ration PDS, Ayushman Bharat, or State DBT programs), your contributions are deeply appreciated.

---

## 🏛️ Six Core Contribution Principles

Before submitting code, please ensure your changes adhere to these six foundations:

1. **Understand the Recovery Case Model**:
   - Status is not just a label — it is an active case that connects cause, responsibility, and the single next recovery action.
2. **Don't Invent Government Facts**:
   - Every state transition, document requirement, and failure reason must match officially documented government operating procedures (SOPs).
3. **Preserve Evidence Provenance**:
   - Citizen self-report (`CITIZEN_REPORTED`) must never be conflated with official confirmation (`OFFICIAL`). The system remains honest about what has been submitted vs. what is officially confirmed.
4. **Don't Introduce Unsupported Timelines or Remedies**:
   - Never show arbitrary countdown timers or guaranteed SLAs (e.g. *"Resolved in 3 days"*) unless officially codified by government rules.
5. **Keep Citizen Workload as the Primary Design Constraint**:
   - Every flow must minimize citizen cognitive load. If the state is acting, tell the citizen clearly: *"You don't need to do anything right now."*
6. **Add Tests for Behavioral Changes**:
   - Any modification to journeys, state machines, or translations must include corresponding tests in `src/app/api/__tests__/` or `src/domain/__tests__/`.

> **Guiding Principle**:
> *Contributions that make the system technically more sophisticated but increase citizen cognitive load are not automatically improvements.*

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: `v20.x` or higher
- **npm**: `v10.x` or higher
- **Git**

### Local Setup

```bash
# 1. Clone the repository
git clone https://github.com/shashankatthaluri/Raasta.git
cd Raasta

# 2. Install dependencies
npm install

# 3. Setup environment variables (Optional)
cp .env.example .env.local

# 4. Start local development server
npm run dev

# 5. Run test suite
npm test
```

Visit [`http://localhost:3000`](http://localhost:3000) (or `http://localhost:3998`) in your browser.

---

## 🛠️ Development Workflow

1. **Fork & Branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. **Coding Standards**:
   - Follow TypeScript strict type safety.
   - Use Tailwind CSS v4 design tokens and Apple-grade spatial restraint.
   - Ensure multi-lingual copy is maintained across all 8 supported Indian languages in `src/lib/caseTranslations.ts`.
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

## 🌐 Adding a New Welfare Scheme Adapter

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
