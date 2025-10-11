import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './styles/main.css'
import App from './App.vue'
import router from './router'
import i18n from './locales'
import { initializeFirebase } from './services/firebase'

// Initialize Firebase before creating the app
async function bootstrap() {
  try {
    await initializeFirebase()
    console.log('Firebase initialized successfully')
    
    const app = createApp(App)
    const pinia = createPinia()

    app.use(pinia)
    app.use(i18n)
    app.use(router)

    app.mount('#app')
  } catch (error) {
    console.error('Failed to initialize app:', error)
    // Show error to user
    document.body.innerHTML = `
      <div style="display: flex; justify-content: center; align-items: center; height: 100vh; flex-direction: column;">
        <h1 style="color: red;">Failed to initialize application</h1>
        <p>Please check the console for more details.</p>
      </div>
    `
  }
}

bootstrap()
