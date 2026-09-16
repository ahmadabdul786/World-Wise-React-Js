import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // server: {
  //   proxy: {
  //     // ➡️ When frontend fetches /api/..., Vite redirects it to https://api.transit.land/...
  //     '/api': {
  //       target: 'https://www.transit.land',
  //       changeOrigin: true, // IMPORTANT: Changes the 'Host' header to match the target
  //       rewrite: (path) => path.replace(/^\/api/, ''),
  //       headers: {
  //         'Origin': null, // یہ Transitland کو بتائے گا کہ ریکویسٹ براؤزر سے نہیں آ رہی
  //       }, // Removes the /api prefix before forwarding
  //     },
  //   },
  // },
})
