import axios from 'axios';

interface TextToSpeechOptions {
  text: string;
  voiceId?: string;
  modelId?: string;
}

// Generate speech audio from text using ElevenLabs
export const generateSpeech = async ({
  text,
  voiceId = 'pNInz6obpgDQGcFmaJgB', // Adam voice (default)
  modelId = 'eleven_monolingual_v1'
}: TextToSpeechOptions): Promise<Blob | null> => {
  try {
    // For a real implementation, you would use your ElevenLabs API key
    // const ELEVENLABS_API_KEY = process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY;
    const ELEVENLABS_API_KEY = 'YOUR_ELEVENLABS_API_KEY'; // Replace with actual key in production
    
    // Make request to ElevenLabs API
    const response = await axios.post(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        text,
        model_id: modelId,
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': ELEVENLABS_API_KEY
        },
        responseType: 'blob'
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Error generating speech:', error);
    return null;
  }
};

// Play audio blob
export const playAudio = async (audioBlob: Blob): Promise<void> => {
  try {
    const url = URL.createObjectURL(audioBlob);
    const audio = new Audio(url);
    
    await audio.play();
    
    // Clean up URL object after audio is done playing
    audio.onended = () => {
      URL.revokeObjectURL(url);
    };
  } catch (error) {
    console.error('Error playing audio:', error);
  }
};

// Convert text to speech and play it
export const speakFeedback = async (text: string): Promise<void> => {
  try {
    const audioBlob = await generateSpeech({ text });
    
    if (audioBlob) {
      await playAudio(audioBlob);
    }
  } catch (error) {
    console.error('Error speaking feedback:', error);
  }
};

// For development/testing when API is not available
export const simulateSpeech = (text: string): void => {
  if ('speechSynthesis' in window) {
    // Use browser's built-in speech synthesis
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Configure voice
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.lang.includes('en') && 
      (voice.name.includes('Male') || voice.name.includes('Daniel'))
    );
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }
    
    // Adjust speech parameters
    utterance.rate = 1; // Speed of speech
    utterance.pitch = 1; // Pitch of voice
    utterance.volume = 1; // Volume (0 to 1)
    
    // Speak the text
    window.speechSynthesis.speak(utterance);
  } else {
    console.warn('Speech synthesis not supported in this browser');
  }
}; 