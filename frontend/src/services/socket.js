// import { io } from "socket.io-client";

// const URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

// export const socket = io(URL, {
//   autoConnect: false,
// });
import { io } from "socket.io-client";

export const socket = io("http://localhost:5000", {
  autoConnect: false,
  transports: ["websocket", "polling"], // best for dev
});