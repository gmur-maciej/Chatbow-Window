import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import ChatWindow from './Chat.tsx'
import { AcceptedLanguages } from './models/AcceptedLanguages.ts';

function detectBrowserLanguage(): AcceptedLanguages {
  let primaryLanguage: string = 'en';

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
  return primaryLanguage as AcceptedLanguages;
}
const lang = detectBrowserLanguage();
createRoot(document.getElementById('chatbothwoehf88234bp')!).render(
  <StrictMode>
    <ChatWindow lang={lang}/>
  </StrictMode>,
)
