import { useState, useEffect } from "react";
import type { Socket } from "socket.io-client";

export type ConnectionStatus = "connected" | "connecting" | "disconnected";

export const useConnectionStatus = (socket: Socket | null): ConnectionStatus => {
  const [status, setStatus] = useState<ConnectionStatus>("connecting");

  useEffect(() => {
    if (!socket) {
      setStatus("disconnected");
      return;
    }

    if (socket.connected) setStatus("connected");
    else setStatus("connecting");

    const onConnect = () => setStatus("connected");
    const onDisconnect = () => setStatus("disconnected");
    const onConnectError = () => setStatus("connecting");
    const onReconnectAttempt = () => setStatus("connecting");

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onConnectError);
    socket.io.on("reconnect_attempt", onReconnectAttempt);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onConnectError);
      socket.io.off("reconnect_attempt", onReconnectAttempt);
    };
  }, [socket]);

  return status;
};
