import { useCallback } from 'react';

interface TextToSpeechHook {
  speak: (text: string, options?: { rate?: number; pitch?: number; volume?: number }) => void;
  cancel: () => void;
  isSupported: boolean;
}

export const useTextToSpeech = (): TextToSpeechHook => {
  const isSupported = 'speechSynthesis' in window;

  const speak = useCallback((text: string, options = {}) => {
    if (!isSupported) return;

    // Cancel any ongoing speech
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = options.rate || 0.9;
    utterance.pitch = options.pitch || 1;
    utterance.volume = options.volume || 1;
    
    speechSynthesis.speak(utterance);
  }, [isSupported]);

  const cancel = useCallback(() => {
    if (isSupported) {
      speechSynthesis.cancel();
    }
  }, [isSupported]);

  return { speak, cancel, isSupported };
};