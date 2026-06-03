"use client";

import { useEffect, useRef } from "react";
import { wsBase } from "./constants";
import { getStoredTokens } from "./auth-storage";

export function useProposalSocket({ enabled, onMessageCreated }) {
  const socketRef = useRef(null);

  useEffect(() => {
    if (!enabled) return undefined;

    const { token } = getStoredTokens();
    if (!token) return undefined;

    const socket = new WebSocket(`${wsBase}/ws/messages?token=${encodeURIComponent(token)}`);
    socketRef.current = socket;

    socket.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (payload.type === "message:created") onMessageCreated?.(payload.message);
      } catch {
        // Ignore malformed realtime payloads.
      }
    };

    return () => {
      socket.close();
      socketRef.current = null;
    };
  }, [enabled, onMessageCreated]);

  function sendMessage(proposalId, body) {
    const socket = socketRef.current;
    if (!socket || socket.readyState !== WebSocket.OPEN) return false;
    socket.send(JSON.stringify({ type: "message:create", proposalId, body }));
    return true;
  }

  return { sendMessage };
}
