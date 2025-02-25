import React from 'react'
import AppRouter from './routers/AppRouter.js'
import { AuthProvider } from "./contexts/AuthContext";
import { GlobalProvider } from "./contexts/GlobalContext";
import 'react-big-calendar/lib/css/react-big-calendar.css'
const App = () => (
  <AuthProvider >
    <GlobalProvider>
      <AppRouter />
    </GlobalProvider>
  </AuthProvider>
)

export default App
