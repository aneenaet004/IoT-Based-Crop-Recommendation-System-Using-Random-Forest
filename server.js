const express = require("express");
const { SerialPort } = require("serialport");
const {Readline, ReadlineParser} = require("@serialport/parser-readline");
const cors = require("cors");

const app = express();
const PORT = 5001; // Server port
app.use(cors()); // Enable CORS for frontend requests

// ✅ Replace 'COM3' with your actual Arduino port (Check Arduino IDE)
const port = new SerialPort({
  path: "COM3", // Change this if your port is different
  baudRate: 9600,
});

const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));

let sensorData = { N: 0, P: 0, K: 0 };

parser.on("data", (data) => {
  console.log("Received:", data);
  const values = data.trim().split(",");

  if (values.length === 3) {
    sensorData = {
      N: parseInt(values[0], 10),
      P: parseInt(values[1], 10),
      K: parseInt(values[2], 10),
    };
  }
});


// API Endpoint to send sensor data to frontend
app.get("/sensor", (req, res) => {
  res.json(sensorData);
});

app.listen(PORT, () => {
  console.log(`Server running on http://127.0.0.1:${PORT}`);
});
