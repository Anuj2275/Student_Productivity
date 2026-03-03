const {
  createRoom,
  addUser,
  removeUser,
  scheduleEmptyRoomCleanup,
  cancelCleanup,
  rooms
} = require("../socket/roomManager");

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    //////////////////////////////////////
    // JOIN ROOM
    //////////////////////////////////////
    socket.on("join-room", ({ roomId, ownerId, timeoutConfig }) => {
      // Create room on first private join
      if (!rooms[roomId]) createRoom(roomId, ownerId, timeoutConfig);

      // Enforce max ~5 users
      if (rooms[roomId].members.size >= 5) {
        socket.emit("room-full", { roomId });
        return;
      }

      socket.join(roomId);
      addUser(roomId, socket.id);

      // Cancel auto-cleanup
      cancelCleanup(roomId);

      // Send current members to client
      const members = Array.from(rooms[roomId].members);
      socket.emit("room-members", { members, ownerId: rooms[roomId].ownerId });

      // Tell existing members a new user joined
      socket.to(roomId).emit("user-joined", { id: socket.id });
    });

    //////////////////////////////////////
    // LEAVE ROOM
    //////////////////////////////////////
    socket.on("leave-room", ({ roomId }) => {
      socket.leave(roomId);
      removeUser(roomId, socket.id);

      // Notify everyone that member left
      io.to(roomId).emit("user-left", { id: socket.id });

      // If owner left and others remain, ownership persists
      if (rooms[roomId]?.members.size === 0) {
        scheduleEmptyRoomCleanup(roomId, io);
      }
    });

    //////////////////////////////////////
    // EXPLICIT ROOM CLOSE
    //////////////////////////////////////
    socket.on("close-room", ({ roomId }) => {
      io.to(roomId).emit("room-closed", { roomId });
      delete rooms[roomId];
    });

    //////////////////////////////////////
    // SIGNALING EVENTS
    //////////////////////////////////////
    socket.on("sending-signal", (payload) => {
      io.to(payload.target).emit("receive-signal", {
        signal: payload.signal,
        callerID: socket.id
      });
    });

    socket.on("returning-signal", (payload) => {
      io.to(payload.target).emit("receive-returned-signal", {
        signal: payload.signal,
        id: socket.id
      });
    });

    //////////////////////////////////////
    // CHAT EVENTS
    //////////////////////////////////////
    socket.on("room-chat", ({ roomId, message }) => {
      io.to(roomId).emit("room-chat", {
        id: socket.id,
        message
      });
    });

    //////////////////////////////////////
    // DISCONNECT
    //////////////////////////////////////
    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
      // Remove socket from all rooms it was in
      for (const roomId in rooms) {
        if (rooms[roomId].members.has(socket.id)) {
          removeUser(roomId, socket.id);
          io.to(roomId).emit("user-left", { id: socket.id });

          // Schedule cleanup if room empty
          if (rooms[roomId].members.size === 0) {
            scheduleEmptyRoomCleanup(roomId, io);
          }
        }
      }
    });
  });
};
// module.exports = (io) => {
//   io.on("connection", (socket) => {
//     console.log("New client connected:", socket.id);

//     socket.on("sending-signal", (payload) => {
//       io.to(payload.userToSignal).emit("user-joined-signal", {
//         signal: payload.signal,
//         callerID: payload.callerID,
//       });
//     });

//     socket.on("returning-signal", (payload) => {
//       io.to(payload.callerID).emit("receiving-returned-signal", {
//         signal: payload.signal,
//         id: socket.id,
//       });
//     });

//     socket.on("join-room", ({ roomId, userId }) => {
//       socket.join(roomId);

//       const otherUsers = Array.from(
//         io.sockets.adapter.rooms.get(roomId) || [],
//       ).filter((id) => id !== socket.id);

//       // Tell the new user who else is in the room
//       socket.emit("all-users", otherUsers);

//       // Broadcast to others that a new user joined
//       socket.to(roomId).emit("user-joined", socket.id);
//     });

//     socket.on("disconnect", () => {
//       console.log("Client disconnected:", socket.id);
//     });
//   });
// };
