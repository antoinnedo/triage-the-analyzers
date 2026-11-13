import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    slowTestThreshold: 5000,
    defaultCommandTimeout: 4000
  }
})
