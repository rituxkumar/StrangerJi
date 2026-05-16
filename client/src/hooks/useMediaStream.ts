'use client';

import { useState, useEffect, useCallback } from 'react';

const mediaConstraints = {
  audio: {
    echoCancellation: true,
    noiseSuppression: true,
  },
  video: {
    width: 640,
    height: 480,
    frameRate: 24,
  },
};

export const useMediaStream = () => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getMedia = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia(mediaConstraints);
      setStream(mediaStream);
      return mediaStream;
    } catch (err: any) {
      console.error('Error accessing media devices:', err);
      setError(err.message || 'Failed to access camera/microphone');
      return null;
    }
  }, []);

  const toggleVideo = useCallback(() => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
      }
    }
  }, [stream]);

  const toggleAudio = useCallback(() => {
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
      }
    }
  }, [stream]);

  const stopStream = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  }, [stream]);

  useEffect(() => {
    getMedia();
    return () => {
      // Don't stop stream on unmount automatically if it's being used by WebRTC context
      // But we might want to cleanup if it's just a preview
    };
  }, [getMedia]);

  return { stream, error, toggleVideo, toggleAudio, stopStream, getMedia };
};
