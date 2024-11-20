import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';

export const useSocket = (namespace, options = {}) => {
    const [connected, setConnected] = useState(false);
    const socketRef = useRef(null);

    useEffect(() => {
        const SOCKET_URL = process.env.REACT_APP_SOCKET_URL;
        
        if (!socketRef.current) {
            socketRef.current = io(`${SOCKET_URL}${namespace}`, {
                ...options,
                transports: ['websocket', 'polling']
            });

            socketRef.current.on('connect', () => {
                console.log('Socket connected');
                setConnected(true);
            });

            socketRef.current.on('disconnect', () => {
                console.log('Socket disconnected');
                setConnected(false);
            });

            socketRef.current.on('error', (error) => {
                console.error('Socket error:', error);
            });
        }

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }
        };
    }, [namespace]);

    return socketRef.current;
}; 