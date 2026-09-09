import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import "@fontsource/geist/latin-400.css"
import "@fontsource/geist/latin-500.css"
import "@fontsource/geist/latin-600.css"
import "@fontsource/geist/latin-700.css"
import "@fontsource/instrument-serif/latin-400.css"
import "@fontsource/jetbrains-mono/latin-400.css"
import "@fontsource/jetbrains-mono/latin-500.css"
import "@fontsource/jetbrains-mono/latin-600.css"
import { App } from "./App"
import "./styles/globals.css"

const root = document.getElementById("root")
if (!root) {
  throw new Error("Missing #root")
}

createRoot(root).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <App />
    </BrowserRouter>
  </StrictMode>
)
