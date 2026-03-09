const express = require("express")
const cookieParser = require("cookie-parser")
const postRouter = require("./routes/task.routes")
const authRouter = require("./routes/auth.routes")
const userRouter = require("./routes/user.routes")
const morgan = require("morgan")
const cors = require("cors")
const app = express();

//Built in middlewares
app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());

const allowedOrigins = [
    "http://localhost:5173",
    "https://task-manager-phi-five-12.vercel.app",
    "https://task-manager-sand-seven-10.vercel.app",
]
app.use(cors({
    origin: allowedOrigins,
    credentials: true
}))

app.use(morgan("dev"))

app.use('/task', postRouter)
app.use('/auth', authRouter)
app.use('/user', userRouter)

module.exports = app;