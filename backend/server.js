const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");

const app = express();
dotenv.config();

// access json data
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running..");
});

// connect to db
mongoose
  .connect(process.env.MONG_URI)
  .then(() => {
    // listen for requests

    const server = app.listen(
      process.env.PORT,
      console.log("connected to db && listeneing on port", process.env.PORT)
    );

    // socket.io
    // change to front end localhost
    const io = require("socket.io")(server, {
      pingTimeout: 60000,
      cors: {
        origin: "http://localhost:####",
      },
    });

    io.on("connection", (socket) => {
      socket.on("setup", (userData) => {
        socket.join(userData._id);
        socket.emit("connected");
      });

      socket.on("join_chat", (room) => {
        socket.join(room);
        console.log(room);
      });

      socket.on("new message", (newMessage) => {
        let chat = newMessage.chat;
        if (!chat.users) return console.log("chat.users not defined");

        chat.users.forEach((user) => {
          if (user._id == newMessage.sender._id) return;

          socket.in(user._id).emit("new Message", newMessage);
        });
      });

      socket.on("typing", (room) => socket.in(room).emit("typing"));
      socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

      socket.off("setup", () => {
        console.log("USER DISCONNECTED");
        socket.leave(userData._id);
      });
    });

    // api endpoint
    app.use("/api/user", userRoutes);
    app.use("/api/chat", chatRoutes);
    app.use("/api/message", messageRoutes);

    // deplyment

    const backendPath = path.resolve(__dirname);

    if (process.env.NODE_ENV === "production") {
      app.use(express.static(path.join(backendPath, "../frontend/dist")));
      app.get("*", (req, res) => {
        res.sendFile(
          path.resolve(backendPath, "../frontend", "dist", "index.html")
        );
      });
    } else {
      app.get("/", (req, res) => {
        res.send("API is running..");
      });
    }
  })
  .catch((error) => {
    console.log(error);
  });
