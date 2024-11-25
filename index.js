const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const userRoute = require('./route/route'); // Import the router
const path = require('path');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.use(express.static(path.join(__dirname,"/")))

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/imit", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.error("MongoDB connection error:", err));

// Use the router
app.use('/user',userRoute); // Attach the router

// Start the server
app.listen(3001, () => {
    console.log("App is running on port 3001");
});
