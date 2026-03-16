require("dotenv").config()

const express = require("express")
const cors = require("cors")
const passport = require("passport")
const session = require("express-session")
require("./config/passport") 
const connectDB = require("./config/db")
const authRoutes = require("./routes/authRoutes")
const googleAuthRoutes = require("./routes/googleAuth");
const taskRoutes = require("./routes/taskRoutes");
const scheduleRoutes = require("./routes/scheduleRoutes");
const focusRoutes = require("./routes/focusRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const initSocket = require("./socket/socketHandler");

const http = require("http");
const { Server } = require("socket.io");
// const PORT = 5000;


connectDB();

// session setup

const app = express()
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
)

app.use(cors())
app.use(express.json()) // allow backend to parse JSON bodies in requests
app.use(passport.initialize())
app.use(passport.session())
app.use("/api/auth", authRoutes);
app.use("/api/auth", googleAuthRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/schedules", scheduleRoutes);
app.use("/api/focus-sessions", focusRoutes);
app.use("/api/analytics", analyticsRoutes);

app.get("/", (req, res) => {
  res.json({message: "FlowMind API is alive!"})
})

const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"],
  },
});

// Socket.IO logic will be here later
initSocket(io);

server.listen(PORT, () => {
  console.log(`FlowMind Server running on port ${PORT}`);
}); 