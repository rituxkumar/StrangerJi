'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import Peer from 'simple-peer';
import { useSocket } from './SocketContext';
import { useMediaStream } from '@/hooks/useMediaStream';

interface WebRTCContextType {
  callUser: (id: string) => void;
  answerCall: () => void;
  leaveCall: () => void;

  callAccepted: boolean;
  callEnded: boolean;
  receivingCall: boolean;

  caller: string;
  callerName: string;
  callerSignal: any;

  userVideo: React.RefObject<HTMLVideoElement | null>;
  myVideo: React.RefObject<HTMLVideoElement | null>;

  stream: MediaStream | null;

  toggleVideo: () => void;
  toggleAudio: () => void;

  isVideoEnabled: boolean;
  isAudioEnabled: boolean;
}

const WebRTCContext = createContext<WebRTCContextType | undefined>(undefined);

export const useWebRTC = () => {
  const context = useContext(WebRTCContext);

  if (!context) {
    throw new Error('useWebRTC must be used within a WebRTCProvider');
  }

  return context;
};

export const WebRTCProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { socket, me } = useSocket();

  const {
    stream,
    toggleVideo: toggleV,
    toggleAudio: toggleA,
  } = useMediaStream();

  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [receivingCall, setReceivingCall] = useState(false);

  const [caller, setCaller] = useState('');
  const [callerName, setCallerName] = useState('');
  const [callerSignal, setCallerSignal] = useState<any>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);

  const myVideo = useRef<HTMLVideoElement | null>(null);
  const userVideo = useRef<HTMLVideoElement | null>(null);

  const connectionRef = useRef<Peer.Instance | null>(null);

  // Show local video
  useEffect(() => {
    if (stream && myVideo.current) {
      myVideo.current.srcObject = stream;
    }
  }, [stream]);

  // Show remote video when available
  useEffect(() => {
    if (remoteStream && userVideo.current && callAccepted) {
      userVideo.current.srcObject = remoteStream;
    }
  }, [remoteStream, callAccepted]);

  // Listen for incoming calls
  useEffect(() => {
    if (!socket) return;

    socket.on('incoming-call', ({ from, name, signal }) => {
      console.log('Incoming call received');

      setCaller(from);
      setCallerName(name);
      setCallerSignal(signal);

      // Auto-answer if we are not already in a call
      if (!callAccepted && !callEnded) {
        setReceivingCall(true);
      }
    });
  }, [socket, callAccepted, callEnded]);

  // Auto-answer effect
  useEffect(() => {
    if (receivingCall && !callAccepted && stream) {
      console.log('Auto-answering...');
      answerCall();
    }
  }, [receivingCall, callAccepted, stream]);

    socket.on('call-ended', () => {
      setCallEnded(true);
      if (connectionRef.current) {
        connectionRef.current.destroy();
      }
      window.location.reload();
    });

    return () => {
      socket.off('incoming-call');
    };
  }, [socket]);

  // Call another user
  const callUser = (id: string) => {
    if (!stream || !socket) return;

    console.log('Calling user:', id);

    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
      config: {
        iceServers: [
          {
            urls: 'stun:stun.l.google.com:19302',
          },
        ],
      },
    });

    peer.on('signal', (data) => {
      console.log('Sending offer');

      socket.emit('call-user', {
        userToCall: id,
        signalData: data,
        from: me,
        name: 'Stranger',
      });
    });

    peer.on('stream', (currentStream) => {
      console.log('Received remote stream');
      setRemoteStream(currentStream);
    });

    socket.on('call-accepted', (signal) => {
      console.log('Call accepted');

      setCallAccepted(true);
      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  // Answer incoming call
  const answerCall = () => {
    if (!stream || !socket) return;

    console.log('Answering call');

    setCallAccepted(true);

    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
      config: {
        iceServers: [
          {
            urls: 'stun:stun.l.google.com:19302',
          },
        ],
      },
    });

    peer.on('signal', (data) => {
      console.log('Sending answer');

      socket.emit('answer-call', {
        signal: data,
        to: caller,
      });
    });

    peer.on('stream', (currentStream) => {
      console.log('Remote stream connected');
      setRemoteStream(currentStream);
    });

    if (callerSignal) {
      peer.signal(callerSignal);
    }

    connectionRef.current = peer;
  };

  // Leave call
  const leaveCall = () => {
    setCallEnded(true);

    if (socket && caller) {
      socket.emit('end-call', { to: caller });
    }

    if (connectionRef.current) {
      connectionRef.current.destroy();
    }

    window.location.reload();
  };

  // Toggle camera
  const toggleVideo = () => {
    toggleV();
    setIsVideoEnabled((prev) => !prev);
  };

  // Toggle microphone
  const toggleAudio = () => {
    toggleA();
    setIsAudioEnabled((prev) => !prev);
  };

  return (
    <WebRTCContext.Provider
      value={{
        callUser,
        answerCall,
        leaveCall,

        callAccepted,
        callEnded,
        receivingCall,

        caller,
        callerName,
        callerSignal,

        userVideo,
        myVideo,

        stream,

        toggleVideo,
        toggleAudio,

        isVideoEnabled,
        isAudioEnabled,
      }}
    >
      {children}
    </WebRTCContext.Provider>
  );
};