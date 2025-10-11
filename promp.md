Here’s a **well-crafted prompt** you can paste directly into Claude Sonnet to build a **professional, scalable, and easy-to-use Vue.js + TailwindCSS admin template**, suitable for GitHub templating and future app development:

---

### 🧠 Prompt for Claude Sonnet

You are an expert Vue 3 and TailwindCSS architect.
Your task is to **design and implement a professional, scalable, and easy-to-use admin template** using **Vue 3 (Composition API)** and **TailwindCSS**.
This template will be published as a **GitHub template repository**, so it must serve as a solid foundation for future Vue-based admin applications.

---

### 🎯 Goals

Build a **Vue 3 + TailwindCSS Admin Template** that is:

* **Production-ready**
* **Highly maintainable and scalable**
* **Cleanly architected and modular**
* **Developer-friendly** (great DX)
* **Visually professional** (modern admin UI)
* **Fully responsive and accessible**

---

### 🏗️ Core Stack

* **Vue 3** (Composition API + `<script setup>`)
* **Vite** for build tooling
* **Pinia** for state management
* **Vue Router** for navigation
* **TailwindCSS** for styling
* **Heroicons** or **Lucide icons** for UI
* **TypeScript optional but modularity-ready**
* **ESLint + Prettier + EditorConfig** for code style consistency

---

### ⚙️ Architecture & Folder Structure

Design a **clean, scalable folder structure**, for example:

```
src/
 ├─ assets/
 ├─ components/
 ├─ composables/
 ├─ layouts/
 ├─ pages/
 ├─ router/
 ├─ store/
 ├─ services/
 ├─ utils/
 ├─ styles/
 └─ main.js
```

---

### 💎 Features to Include

1. **Authentication layout** (login/register)
2. **Dashboard layout** with sidebar and topbar
3. **Dark mode** (Tailwind dark class strategy)
4. **Reusable UI components** (cards, tables, modals, alerts, forms, etc.)
5. **Dynamic routing system**
6. **Role-based navigation (admin/user)**
7. **Toast/notification system**
8. **Loading and error states**
9. **Responsive design for mobile/tablet/desktop**
10. **Example CRUD page** using mock data
11. **API service layer** using Fetch or Axios
12. **Theme configuration system**
13. **Settings page example**
14. **Reusable form components** (input, select, toggle, etc.)

---

### 🧩 Bonus (if possible)

* Implement a **plugin system** (for feature extensions)
* Support **i18n (Vue I18n)** for translations
* Include a **project setup wizard** (optional CLI script for renaming, branding, etc.)
* Provide a **README** with clear setup instructions and best practices

---

### 🧱 Output Requirements

* Provide **complete code** (Vue + Tailwind project)
* Ensure all components follow **clean architecture principles**
* Comment code where appropriate for reusability
* Include **example pages** (Dashboard, Users, Settings)
* Include a **README.md** detailing:

  * Project structure
  * Development setup
  * Build & deploy instructions
  * Theming & customization guide

---

### 💡 Tone & Style

Use a **minimalist, modern, professional design** inspired by:

* Tailwind UI
* Flowbite Admin
* Shadcn-style structure (optional inspiration)

Avoid bloat — focus on **clarity, modularity, and reusability**.

---

### 🧰 Deliverables

1. Full source code of the Vue 3 + Tailwind admin template
2. Clear explanation of architecture and design decisions
3. Optional: Example of extending the template to a new app (e.g., “Inventory Manager” demo)

---

Would you like me to extend this prompt to **include API endpoint structure and data flow design** (for future backend integration)?
That would make it even more ready for real-world app development.
