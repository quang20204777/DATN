const express = require('express')
const { urlencoded } = require('body-parser');
const app = express();
require("dotenv").config();
const db = require("./config/db");
const cors = require('cors')
app.use(express.json());
app.use(urlencoded({ extended: true }));

const allowedOrigins = ['http://localhost:3000', 'http://localhost:3001'] // Add more origins as needed

app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true, 
    })
);

const usersRoute = require("./routes/usersRoute");
const moviesRoute = require("./routes/moviesRoute");
const theatresRoute = require("./routes/theatresRoute");
const bookingsRoute = require("./routes/bookingsRoute");
const paymentsRoute = require("./routes/paymentsRoute");

app.use("/api/users", usersRoute);
app.use("/api/movies", moviesRoute);
app.use("/api/theatres", theatresRoute);
app.use("/api/bookings",bookingsRoute);
app.use("/api/payments", paymentsRoute);

app.get('/', (req, res) => {
    res.json({ message: 'The API is working' });
});

const port = 5000;
app.listen(port, () => console.log(`Server is running on port ${port}`));
