const crypto = require("crypto");
const db = require("./db.js");

function generateId() {
  return crypto.randomBytes(4).toString("hex") + "c";
}

function getRoom(roomId) {
  const row = db.prepare("SELECT * FROM rooms WHERE id = ?").get(roomId);
  if (!row) return null;
  return { id: row.id, users: JSON.parse(row.users) };
}

function saveRoom(room) {
  db.prepare("UPDATE rooms SET users = ? WHERE id = ?").run(JSON.stringify(room.users), room.id);
}

function sanitizeName(value) {
  return String(value)
    .split("")
    .filter((char) => char.charCodeAt(0) > 31 && char.charCodeAt(0) !== 127)
    .join("")
    .trim()
    .slice(0, 24);
}

exports.create = function (peerId, nickname) {
  const id = generateId();
  const users = JSON.stringify([{ id: peerId, nickname: sanitizeName(nickname) }]);
  db.prepare("INSERT INTO rooms (id, users) VALUES (?, ?)").run(id, users);
  return { id };
};

exports.delete = function (roomId, peerId) {
  const room = getRoom(roomId);
  if (!room) throw new Error("Room does not exist");
  const idx = room.users.findIndex((u) => u.id === peerId);
  if (idx === -1) throw new Error("User does not exist in room");
  room.users.splice(idx, 1);
  if (room.users.length === 0) {
    db.prepare("DELETE FROM rooms WHERE id = ?").run(roomId);
  } else {
    saveRoom(room);
  }
};

exports.get = function (roomId) {
  const room = getRoom(roomId);
  if (!room) throw new Error("Room does not exist");
  return room.users;
};

exports.join = function (roomId, peerId, nickname) {
  const room = getRoom(roomId);
  if (!room) throw new Error("Room does not exist");
  const present = room.users.some((u) => u.id === peerId);
  if (!present) room.users.push({ id: peerId, nickname: sanitizeName(nickname) });
  saveRoom(room);
};
