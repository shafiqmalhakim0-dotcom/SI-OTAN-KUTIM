import { Language } from '../types';

let currentUtterance: SpeechSynthesisUtterance | null = null;

export const playSpeech = (
  text: string,
  lang: Language,
  onStart?: () => void,
  onEnd?: () => void,
  onError?: () => void
): boolean => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('SpeechSynthesis is not supported on this device/browser.');
    return false;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  try {
    const utterance = new SpeechSynthesisUtterance(text);
    currentUtterance = utterance;

    // Pick proper language code
    if (lang === 'en') {
      utterance.lang = 'en-US';
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
    } else {
      // Indonesian and Bahasa Kutai both use Indonesian phonetic phonemes
      utterance.lang = 'id-ID';
      utterance.rate = 0.92; // slightly deliberate for clarity
      utterance.pitch = 1.0;
    }

    // Try finding natural voices if available
    const voices = window.speechSynthesis.getVoices();
    if (voices && voices.length > 0) {
      const preferred = voices.find(
        (v) =>
          v.lang.toLowerCase().startsWith(utterance.lang.toLowerCase().slice(0, 2)) &&
          (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Indonesian') || v.default)
      );
      if (preferred) {
        utterance.voice = preferred;
      }
    }

    utterance.onstart = () => {
      if (onStart) onStart();
    };

    utterance.onend = () => {
      currentUtterance = null;
      if (onEnd) onEnd();
    };

    utterance.onerror = (e) => {
      console.warn('Speech error:', e);
      currentUtterance = null;
      if (onError) onError();
    };

    window.speechSynthesis.speak(utterance);
    return true;
  } catch (err) {
    console.error('Failed to trigger speech synthesis:', err);
    if (onError) onError();
    return false;
  }
};

export const stopSpeech = () => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    currentUtterance = null;
  }
};

export const isSpeaking = (): boolean => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    return window.speechSynthesis.speaking;
  }
  return false;
};
