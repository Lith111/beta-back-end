const express = require('express')
require('dotenv').config();
const cors = require('cors');
const connectToDb = require("./config/connectToDb");
const { errorHandler, notFound } = require('./middlewares/errormidle');
const app = express();
const port = process.env.PORT||8000;
// TODO: connect to mongo data base
connectToDb();

// TODO:add json to exprees
app.use(express.json());
app.use(cors({ origin: "*", credentials: true }));
// Router
// controles to register
app.use("/api/auth",require("./router/authRoute"));
// constrol to users
app.use("/api/users",require('./router/usersRouter'));
// post 
app.use("/api/posts",require("./router/postRouter"));
// midacl
app.use("/api/midacls",require("./router/midcalRoute"));
//comment
app.use("/api/comment",require("./router/commentRoute")); 
// category
app.use("/api/category",require("./router/categoryRoute"));
// error  handler Middleware
app.use(notFound)
app.use(errorHandler);
// TODO: ruing the server run 
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

