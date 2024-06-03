require('dotenv').config();
const express = require('express');
const app = express();
const PORT = 3000;
const userRouter = require("./routes/user");
const cors = require("cors");

const adminRouter = require("./routes/admin")
const studentRouter = require("./routes/student");
const anonymousRouter= require("./routes/anonymous");
const jobRouter= require("./routes/jobRoutes");
const applicationRouter= require('./routes/applicationRoutes');

//socket
const { Server } = require("socket.io");
const cookieParser = require('cookie-parser');
const fileUpload= require('express-fileupload');


// Middleware
app.use(express.json()); // Parse JSON bodies
const { query } = require('./dbconfig/dbconfig');
app.use(cookieParser());

//cors policy
app.use(cors(
    {
        origin: "http://localhost:5173",
        methods: "GET, POST, OPTIONS, PUT, DELETE",
        credentials: true,
    }
));

//file upload
// app.use(
//     fileUpload({
//         useTempFiles: true,
//         tempFileDir:'/tmp/',
//     })
// )


// Routes
app.use("/api/admin", adminRouter);
app.use("/api/user", userRouter);
app.use("/api/student", studentRouter);
app.use("/api/anonymous", anonymousRouter);
app.use("/api/job", jobRouter);
app.use("/api/application", applicationRouter);
app.get('/', async (req, res) => {
    // res.send('Hello, World!');

    try {
        const queryi = `
        SELECT * FROM users_student
        `

        const users = await query({
            query: queryi,
            values: []
        });

        res.json(users);
    } catch (error) {
        console.log("helllo error")
        res.status(500).json({ message: error.message });
    }
});

const server = app.listen(process.env.PORT, () => {
    console.log("connected to db & listening on port", process.env.PORT);
});
//create socket instance
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST", "PUT"],
        credentials: true,
    },
});

// handle WebSocket connections
const userSocketMap = new Map();
io.on("connection", (socket) => {
    const { username, message, userType } = socket.handshake.query;
    console.log("value", socket.handshake.query)
    console.log("Hello Socket");
    // console.log(`user connected: ${socket.id}`)
    //console.log(userid);
    // Attach userid and username to the socket object
    socket.message = message;
    socket.username = username;
    socket.userType= userType;

    //initialise user
    //initializeUser(userSocketMap,socket);
    // Add the user ID and socket ID to the mapping
    userSocketMap.set(username, socket.id);

    console.log("User Socket Map:");
    userSocketMap.forEach((value, key) => {
        console.log(`${key}: ${value}`);
    });
    // socket.on("add_friend", (friendName, cb)=>{
    //      addFriend(socket, friendName, cb);
    // });
    // socket.on("disconnecting", ()=>{ 
    //     onDisconnect(userSocketMap, socket)
    // }
    // )
    console.log("userType:",userType)
    // if(userType=="student"){
    //     console.log("message is being sended from student to admin")
    //     const adminSocketId= userSocketMap.get("admin01");
    //     socket.to(adminSocketId).emit("message", message);
    // }
    socket.on("message_sent", (message)=>{
        if(userType=="student" && message){
            console.log("inside socket on :", message);
          socket.to(userSocketMap.get("admin01")).emit("message_received", message);
        }
    })
    // socket.on("dm", (message)=> {dm(io, userSocketMap, socket, message)})
    socket.on('disconnect', () => {
        console.log("deletion of the the user from map")
        // Remove the user ID and socket ID from the mapping when a socket disconnects
        userSocketMap.delete(username);
    });
});

