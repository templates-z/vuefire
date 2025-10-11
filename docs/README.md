# Vue 3 + Firebase Admin Template# Vue 3 Admin Template



> A professional, scalable, and clean admin template built with Vue 3, Firebase, TailwindCSS, and modern development practices.> A professional, scalable, and easy-to-use admin template built with Vue 3, TailwindCSS, and modern development practices.



![Vue 3](https://img.shields.io/badge/Vue-3.5+-4FC08D?style=flat&logo=vue.js&logoColor=white)![Vue 3](https://img.shields.io/badge/Vue-3.5+-4FC08D?style=flat&logo=vue.js&logoColor=white)

![TypeScript](https://img.shields.io/badge/TypeScript-5.9+-3178C6?style=flat&logo=typescript&logoColor=white)![TypeScript](https://img.shields.io/badge/TypeScript-5.9+-3178C6?style=flat&logo=typescript&logoColor=white)

![Firebase](https://img.shields.io/badge/Firebase-9.0+-FFCA28?style=flat&logo=firebase&logoColor=black)![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4+-06B6D4?style=flat&logo=tailwindcss&logoColor=white)

![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4+-06B6D4?style=flat&logo=tailwindcss&logoColor=white)![Vite](https://img.shields.io/badge/Vite-7.1+-646CFF?style=flat&logo=vite&logoColor=white)

![Vite](https://img.shields.io/badge/Vite-7.1+-646CFF?style=flat&logo=vite&logoColor=white)

## ✨ Features

## ✨ Features

- 🚀 **Vue 3** with Composition API and `<script setup>`

- 🚀 **Vue 3** with Composition API and `<script setup>`- 🎨 **TailwindCSS** for styling with dark mode support

- 🔥 **Firebase Authentication** with Google Sign-in support- 📦 **Pinia** for state management

- 🗃️ **Firestore Database** with real-time updates- 🛣️ **Vue Router** for navigation with route guards

- 🎨 **TailwindCSS** for styling with dark mode support- 🔐 **Authentication system** with mock login/register

- 📦 **Pinia** for state management- 🌙 **Dark mode** with system preference detection

- 🛣️ **Vue Router** with authentication guards- 📱 **Responsive design** for all screen sizes

- 🌙 **Dark mode** with system preference detection- 🎯 **TypeScript** ready with proper type definitions

- 🌍 **Internationalization (i18n)** with multiple languages- 🧩 **Modular architecture** with reusable components

- 📱 **Responsive design** for all screen sizes- 🔄 **Mock API** with Axios integration

- 🎯 **TypeScript** ready with proper type definitions- 📊 **Dashboard** with statistics cards and charts

- 🧩 **Modular collection system** for Firestore operations- 👥 **User management** with CRUD operations

- 📊 **Dashboard** with clean layout- ⚙️ **Settings** with theme customization

- 👤 **Profile management** with Firestore integration- 🔔 **Toast notifications** (ready to implement)

- ⚙️ **Settings** with theme and language customization- 📐 **Clean code** with ESLint and Prettier

- 🔐 **Protected routes** with authentication state management

## 🎯 Demo Credentials

## 🚀 Quick Start

For testing the authentication system:

### Prerequisites

- **Admin**: `admin@example.com` / `password`

- Node.js 20.19+ or 22.12+- **User**: `john@example.com` / `password`

- pnpm (recommended) or npm

- Firebase project with Authentication and Firestore enabled## 🚀 Quick Start



### Installation### Prerequisites



1. **Create Repository**
   - Create a new repository on GitHub or your preferred Git hosting service
   - Use this template to generate your repository
   - Clone the repository to your local machine

2. **Install dependencies**   ```bash

   ```bash   git clone <your-repo-url>

   pnpm install   cd vue-admin-template

   ```   ```



3. **Firebase Configuration**

   ```bash

      Create a `.env` file in the root directory with your Firebase config:   npm install
   ```

   ```env

   VITE_FIREBASE_API_KEY=your_api_key

   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain3. **Start development server**

   VITE_FIREBASE_PROJECT_ID=your_project_id   ```bash

   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket   npm run dev

   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id   ```

   VITE_FIREBASE_APP_ID=your_app_id

   VITE_API_URL=http://localhost:3000/api

   ```

4. **Start development server**

   ```bash

      pnpm dev

   ```
5. **Open your browser**

   Navigate to `http://localhost:5173`


### Build for Production
   ```bash

      npm run build
   ```

### Preview Production Build
   ```bash
      pnpm preview
   ```

### Deploy to Firebase Hosting
   ```bash
      firebase deploy --only hosting:main
   ```
### Deploy Firestore Rules
   ```bash
   firebase deploy --only firestore:rules
   ```

## 📁 Project Structure

```

```src/

src/├── assets/              # Static assets

├── assets/              # Static assets├── components/          # Reusable components

├── components/          # Reusable components│   └── ui/             # UI components (buttons, cards, etc.)

│   └── ui/             # UI components (buttons, cards, etc.)├── composables/        # Vue composables

├── composables/        # Vue composables (theme, i18n)├── layouts/            # Layout components

├── layouts/            # Layout components│   ├── AuthLayout.vue  # Authentication layout

│   ├── AuthLayout.vue  # Authentication layout│   └── DashboardLayout.vue # Dashboard layout

│   └── DashboardLayout.vue # Dashboard layout├── pages/              # Page components

├── locales/            # i18n translations│   ├── auth/           # Authentication pages

├── pages/              # Page components│   └── dashboard/      # Dashboard pages

│   ├── auth/           # Authentication pages├── router/             # Vue Router configuration

│   └── dashboard/      # Dashboard pages├── services/           # API services

├── router/             # Vue Router configuration├── store/              # Pinia stores

├── services/           # Firebase services├── styles/             # Global styles

│   ├── auth.ts         # Firebase Auth integration├── types/              # TypeScript type definitions

│   ├── firebase.ts     # Firebase initialization├── utils/              # Utility functions

│   └── collections/    # Firestore collection system├── App.vue             # Root component

├── store/              # Pinia stores└── main.ts             # Application entry point

├── styles/             # Global styles```

├── types/              # TypeScript type definitions

├── App.vue             # Root component## 🎨 Theming & Customization

└── main.ts             # Application entry point

```




### Authentication Features- 

- **Email/Password** authentication- 

- **Google Sign-in** integration- 

- **User state management** with reactive updates

- **Route protection** with authentication guards### Customizing Colors

- **Automatic token management**


### Firestore Features


- **BaseCollection** system for easy CRUD 

- **Real-time subscriptions** for live data updates  

- **User-owned collections** with automatic security    

- **Type-safe** operations with TypeScript      

- **Event dispatching** for cross-component communication        // Your custom primary colors

       

### Collection System Usage       

```typescript    

// Example: Using the profile store  }

import { useProfileStore } from '@/store/profile'}

const profileStore = useProfileStore()
// Create profile

await profileStore.create({### Environment Variables

  firstName: 'John',

  lastName: 'Doe',Create a `.env` file in the root directory:

  email: 'john@example.com'

})
// Update profileVITE_APP_NAME="Your Admin Template"

await profileStore.update(profileId, { firstName: 'Jane' })



// Real-time subscription### API Integration

const profile = computed(() => profileStore.selectedItem)

```






### Language Support- 

- **English** (default)

- **Spanish**

- **French**

- Easy to add more languages in `src/locales/`





## 🙏 Acknowledgments

### Other Platforms

- [Vue.js](https://vuejs.org/) - The Progressive JavaScript Framework

The built `dist/` directory can be deployed to any static hosting service like:- [TailwindCSS](https://tailwindcss.com/) - A utility-first CSS framework

- Vercel- [Heroicons](https://heroicons.com/) - Beautiful hand-crafted SVG icons

- Netlify- [Pinia](https://pinia.vuejs.org/) - The Vue Store that you will enjoy using

- GitHub Pages- [Vite](https://vitejs.dev/) - Next Generation Frontend Tooling

---

## 🤝 Contributing

**Happy coding! 🚀**

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [Vue.js](https://vuejs.org/) - The Progressive JavaScript Framework
- [Firebase](https://firebase.google.com/) - Google's mobile and web development platform
- [TailwindCSS](https://tailwindcss.com/) - A utility-first CSS framework
- [Heroicons](https://heroicons.com/) - Beautiful hand-crafted SVG icons
- [Pinia](https://pinia.vuejs.org/) - The Vue Store that you will enjoy using
- [Vite](https://vitejs.dev/) - Next Generation Frontend Tooling

---

**Ready to build amazing Firebase-powered Vue apps! 🚀**