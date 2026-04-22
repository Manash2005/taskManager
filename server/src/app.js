const express = require("express")
const cookieParser = require("cookie-parser")
const session = require('express-session')
const passport = require('../config/passport')
const postRouter = require("./routes/task.routes")
const authRouter = require("./routes/auth.routes")
const userRouter = require("./routes/user.routes")
const oauthRoutes = require("./routes/oauth.routes")
const morgan = require("morgan")
const cors = require("cors")
const app = express();

//Built in middlewares
app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());

// Session middleware for OAuth
app.use(session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'lax'
    }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

const allowedOrigins = [
    "http://localhost:5173",
    "https://task-manager-phi-five-12.vercel.app",
    "https://task-manager-sand-seven-10.vercel.app",
    "https://task-flow-zeta-six.vercel.app"
]
app.use(cors({
    origin: allowedOrigins,
    credentials: true
}))

app.use(morgan("dev"))

app.use('/task', postRouter)
app.use('/auth', authRouter)
app.use('/user', userRouter)
app.use('/auth/oauth', oauthRoutes)
app.get("/ping", (req, res) => {
  res.send("OK");
});

app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    uptime: process.uptime(),
    timestamp: Date.now(),
  });
});
module.exports = app;