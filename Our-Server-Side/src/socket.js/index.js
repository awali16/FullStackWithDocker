const socketIO = require("socket.io");
// const redis = require("redis");
// const redisAdapter = require("socket.io-redis");

let io; // Module-level variable to store the io instance

function createSocketServer(server) {
  io = socketIO(server, {
    cors: {
      origin: [
        "http://localhost:5000",
        "https://localhost:5000",
        
      ],
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    },
  });

//   const redisHost = process.env.SOCKET_REDIS_HOST;
//   const redisPort = process.env.SOCKET_REDIS_PORT;

  // Redis Adapter for Socket.IO
//   io.adapter(redisAdapter({ host: redisHost, port: redisPort }));

//   io.of("/").adapter.pubClient.on("connect", () => {
//     console.log(`Successfully connected to Redis at ${redisHost}:${redisPort}`);
//   });

//   io.of("/").adapter.pubClient.on("error", (err) => {
//     console.error(`Redis connection error: ${err}`);
//   });

  let activeUsers = [];

  io.on("connection", (socket) => {
    console.log("user connected into socket");

    //subscribing with userId
    // socket.on("user-login", (newUserId) => {
    //   if (newUserId) {
    //     activeUsers = activeUsers.filter((user) => user.userId !== newUserId);
    //     activeUsers.push({ userId: newUserId, socketId: socket.id });
    //   }
    // });

    // socket.on("initialize-session", (userId) => {
    //   activeUsers = activeUsers.filter((user) => user.userId !== userId);
    //   if (userId) {
    //     activeUsers.push({ userId, socketId: socket.id });
    //   }
    // });

    socket.on("logout", (id) => {
      activeUsers = activeUsers.filter((user) => user.userId !== id);
    });
  });

  return io;
}

function getIoInstance() {
  if (!io) {
    throw new Error(
      "Socket.io instance has not been initialized. Call createSocketServer first."
    );
  }
  return io;
}

module.exports = { createSocketServer, getIoInstance };
