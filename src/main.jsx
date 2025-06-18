import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import ChatWindow from './Chat/Chat'

function detectBrowserLanguage() {
  let primaryLanguage = 'en';

  // Check if the navigator object is available
  if (typeof navigator !== 'undefined') {
    // Use navigator.languages if available (returns an array of preferred languages)
    if (navigator.languages && navigator.languages.length > 0) {
      primaryLanguage = navigator.languages[0]; // Get the most preferred language
    } else if (navigator.language) {
      // Fallback to navigator.language if navigator.languages is not available
      primaryLanguage = navigator.language;
    }
  }

  // Normalize the primary language code (take the first two letters)
  if (primaryLanguage) {
    primaryLanguage = primaryLanguage.split('-')[0].toLowerCase();
  }
  return primaryLanguage;
}
const lang = detectBrowserLanguage();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <img src='/src/assets/zitt.png' style={{ width: '100vw', height: '100vh' }} /> */}
    <ChatWindow lang={lang} />
  </StrictMode>,
)
