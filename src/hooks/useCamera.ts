'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface UseCameraOptions {
  enabled?: boolean;
  facingMode?: 'user' | 'environment';
  onError?: (error: Error) => void;
}

interface UseCameraReturn {
  stream: MediaStream | null;
  webcamRef: React.RefObject<HTMLVideoElement>;
  isLoading: boolean;
  error: Error | null;
  startCamera: () => Promise<void>;
  stopCamera: () => void;
}

export default function useCamera({
  enabled = false,
  facingMode = 'user',
  onError,
}: UseCameraOptions = {}): UseCameraReturn {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const webcamRef = useRef<HTMLVideoElement>(null);

  // Function to start the camera
  const startCamera = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const constraints = {
        video: {
          facingMode,
        },
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);

      // Connect stream to video element
      if (webcamRef.current) {
        webcamRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error occurred');
      setError(error);
      if (onError) {
        onError(error);
      }
    } finally {
      setIsLoading(false);
    }
  }, [facingMode, onError]);

  // Function to stop the camera
  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => {
        track.stop();
      });
      setStream(null);

      // Disconnect stream from video element
      if (webcamRef.current) {
        webcamRef.current.srcObject = null;
      }
    }
  }, [stream]);

  // Start camera when enabled changes
  useEffect(() => {
    if (enabled) {
      startCamera();
    } else {
      stopCamera();
    }

    // Cleanup function to stop camera when component unmounts
    return () => {
      stopCamera();
    };
  }, [enabled, startCamera, stopCamera]);

  return {
    stream,
    webcamRef,
    isLoading,
    error,
    startCamera,
    stopCamera,
  };
} 