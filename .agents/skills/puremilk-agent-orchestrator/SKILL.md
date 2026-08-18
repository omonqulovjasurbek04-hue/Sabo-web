---
name: puremilk-agent-orchestrator
description: >-
  Master orchestration, subagent delegation, loop-prevention, and cross-agent
  prompting protocol for PureMilk. Compatible with Claude Code, Gemini CLI,
  Antigravity, and OpenAI Codex.
---

# 🤖 PureMilk — AI Agent Orchestrator & Master Workflow Protocol

## 00. Asosiy Vazifa va Agentlar Bo'linmasi
PureMilk loyihasida ishlash jarayonida sun'iy intellekt agentlari (Claude Code, Gemini, Antigravity, ChatGPT/Codex) bir-biri bilan uyg'un, xatosiz, ziddiyatsiz va kontekst limitini tugatmasdan ishlashi shart.

```
                   [ Bosh Arxitektor (Master Agent / User) ]
                                      │
         ┌────────────────────────────┼────────────────────────────┐
         ▼                            ▼                            ▼
   [ UI/UX Subagent ]        [ Frontend & 3D Agent ]      [ Backend & QA Agent ]
 (Maket, Dizayn tokenlar,    (React 19, Motion, Three.js, (API, DB, i18n, TypeScript,
  Fidelity tekshiruvi)         Sahifalar va Savat)         WCAG AA, Unit testlar)
```

---

## 01. Kontekstni Saqlash va Tsikldan Chiqish Qoidalari (No-Loop & Context Budgeting)

1. **Katta fayllarni birdaniga qayta yozmaslik:** Butun faylni bitta promptda almashtirish o'rniga, faqat tegishli funksiya yoki komponentni `replace_file_content` / diff orqali o'zgartirish.
2. **Bir xil xatoni qayta-qayta takrorlamaslik:** Agar buyruq bir marta xato bersa, uni xuddi o'sha parametrlar bilan qayta chaqirmaslik; sababini tahlil qilib, muqobil yo'lni tanlash.
3. **Aniq va qisqa javoblar:** Agent ortiqcha so'zbozlik qilmasdan, faqat bajarilgan ish, fayl havolasi va qisqa xulosani taqdim etishi shart.
4. **Qat'iy bosqichma-bosqich ishlash (Step-by-step Execution):**
   - 1-qadam: Talabni tahlil qilish va `SKILL.md` qoidalarini o'qish.
   - 2-qadam: Kodni o'zgartirish / komponent yaratish.
   - 3-qadam: TypeScript va vizual sifatni tekshirish.
   - 4-qadam: Yakuniy natijani hisobot qilish.

---

## 02. Subagentlarga Buyruq Berish Shablonlari (Delegation Prompts)

### 🎨 A. Dizayn va UI Agentiga Buyruq:
```markdown
Vazifa: [Sahifa / Komponent nomi]ni `Dizayn/` papkasidagi maketga 100% mos holda yarat/yangila.
Protokol: `puremilk-design-fidelity` va `puremilk-fact-integrity` ga qat'iy amal qil.
Cheklovlar:
- Faqat mavjud dizayn tokenlaridan (`#FCF9F4`, `#25683C`, `#052417`, `#ACF3BA`, `#765700`) foydalan.
- Shriftlar: `Playfair Display` (sarlavhalar) va `Inter` (body).
- O'zboshimchalik bilan redesign qilish taqiqlanadi.
```

### ✨ B. 3D va Animatsiya Agentiga Buyruq:
```markdown
Vazifa: [Hero / Kartochka / Banner] uchun silliq 3D/interaktiv animatsiya qo'sh.
Protokol: `puremilk-animations-3d` qoidalariga rioya qil.
Cheklovlar:
- 60fps tezlik, WebGL / Canvas / CSS transform va `prefers-reduced-motion` qo'llab-quvvatlanishi shart.
- Qurilmani qizitmaydigan yengil bundle.
```

### 🔍 C. 10 Yillik Senior QA Agentiga Buyruq:
```markdown
Vazifa: Barcha kod bazasini to'liq audit qil va aniqlangan nuqsonlarni to'g'irla.
Protokol: `puremilk-senior-qa-review` va `puremilk-performance-seo`.
Tekshiruvlar:
1. TypeScript xatolari (0 ta xato).
2. WCAG AA accessibility va klaviatura navigatsiyasi.
3. 360px dan 1920px gacha responsive layout.
4. i18n (UZ/RU/EN) tarjimalar to'liqligi.
```

---

## 03. O'zaro Moslik (Cross-Agent Compatibility: Claude, Gemini, Codex)

| Muhit / Agent | Konfiguratsiya Joyi | Asosiy Direktiva |
|---|---|---|
| **Antigravity / Gemini** | `.agents/skills/` va `GEMINI.md` | Barcha skillarni avtomatik o'qiydi va qoidalarga bo'ysunadi |
| **Claude.ai / Claude Code** | `CLAUDE.md` va `.agents/skills/` | Source of truth, TypeScript 0 xato va design fidelity buyruqlari |
| **ChatGPT / OpenAI Codex** | `PROMPTS_AND_SKILLS_GUIDE.md` | E-commerce arxitekturasi va full-stack API direktivalari |
