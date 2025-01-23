
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'


import { createVuetify } from 'vuetify'


export default createVuetify({
  theme: {
    defaultTheme: 'dark',
    themes: {
      light: {
        colors: {
          background: '#FFFFFF',
          surface: '#FFFFFF',
        }
      },
      dark: {
        colors: {
          background: '#121212',
          surface: '#121212',
        }
      }
    }
  },
  defaults: {
    VBtn: {
      style: {
        fontFamily: 'Tajawal, serif',
      },
    },
  },
 
})
