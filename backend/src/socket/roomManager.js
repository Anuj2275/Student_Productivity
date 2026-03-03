const rooms = {}; // In-memory (we’ll later wire Redis)

const createRoom = (roomId, ownerId, timeoutConfig) => {
  rooms[roomId] = {
    ownerId,
    members: new Set(),
    timeoutConfig,
    timeoutHandle: null
  };
};

const addUser = (roomId, socketId) => {
  if (!rooms[roomId]) return false;
  rooms[roomId].members.add(socketId);
  return true;
};

const removeUser = (roomId, socketId) => {
  if (!rooms[roomId]) return false;
  rooms[roomId].members.delete(socketId);
  return true;
};

const scheduleEmptyRoomCleanup = (roomId, io) => {
  const room = rooms[roomId];
  if (!room || !room.timeoutConfig.enabled) return;

  if (room.timeoutHandle) clearTimeout(room.timeoutHandle);

  room.timeoutHandle = setTimeout(() => {
    // Notify clients room is closing
    io.to(roomId).emit("room-auto-close", { roomId });
    delete rooms[roomId];
  }, room.timeoutConfig.duration * 1000);
};

const cancelCleanup = (roomId) => {
  if (rooms[roomId]?.timeoutHandle) {
    clearTimeout(rooms[roomId].timeoutHandle);
    rooms[roomId].timeoutHandle = null;
  }
};

module.exports = {
  rooms,
  createRoom,
  addUser,
  removeUser,
  scheduleEmptyRoomCleanup,
  cancelCleanup
};