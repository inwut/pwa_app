const express = require('express');
const cors = require('cors');
require('dotenv').config();
const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({status: "success", message: "api is running..."});
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));