import { io, Socket } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:8080";

let socket: Socket | null = null;

export function sock_emit(socket: Socket, event: string, arg: unknown) {
  console.log("emitting", event, arg)
  socket.emit(event, JSON.stringify(arg))
}

export const initSocket = (): Socket => {
  if (!socket) {
    socket = io(`${SOCKET_URL}`);
  }
  return socket;
};

export const getSocket = (): Socket => {
  if (socket) {
    return socket
  }
  socket = initSocket()
  return socket
};
