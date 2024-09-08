const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

const app = express();
dotenv.config();

const port = process.env.PORT || 3000;

const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;

// Correct MongoDB connection string (with URL-encoded password)
mongoose.connect(`mongodb+srv://kadbhaneshruti75:mongo1234%23@cluster0.8e5zp.mongodb.net/registrationdbForm`)
    .then(() => console.log("Connected to MongoDB"))
    .catch((error) => console.log("Error connecting to MongoDB: ", error));

// Registration schema
const registrationSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
});

// Model of registration schema
const Registration = mongoose.model("Registration", registrationSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Route to serve the main HTML form
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/pages/index.html");
});

// Handling the form submission
app.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const registrationData = new Registration({
            name,
            email,
            password
        });

        // Save registration data to MongoDB
        await registrationData.save();
        res.redirect("/success");
    } catch (error) {
        console.log(error);
        res.redirect("/error");
    }
});

// Success page route
app.get("/success", (req, res) => {
    res.sendFile(__dirname + "/pages/success.html");
});

// Error page route
app.get("/error", (req, res) => {
    res.sendFile(__dirname + "/pages/error.html");
});

// Starting the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
