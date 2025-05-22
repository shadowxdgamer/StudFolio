const express = require('express');
const app = express();
const cors = require("cors")
const connectDB = require("./config/db.js")
const dotenv = require('dotenv');


dotenv.config();


//Middleware
app.use(cors())
app.use(express.json())


//Database connection
connectDB();
//Routes

//Starting the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});