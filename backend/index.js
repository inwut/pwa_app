require('dotenv').config({path: `${process.cwd()}/.env`});
const express = require('express');
const cors = require('cors');

const PORT = process.env.APP_PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({status: "success", message: "api is running..."});
});

app.use('*', (req, res, next) => {
    res.status(404).json({
        status: "fail",
        message: "Route not found"
    });
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));