require('dotenv').config();              // reads .env so process.env.MONGO_URI works
const express = require('express');      // import express
const mongoose = require('mongoose');    // import mongoose
const cors = require('cors');            // import cors

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', require('./routes/auth'));   // this line
 app.use('/api/skills', require('./routes/skills'));''
 app.use('/api/logs', require('./routes/logs'));

app.get('/', (req, res) => res.send('Level 616 API running'));
mongoose.connect(process.env.MONGO_URI)  // connect to Atlas, returns a promise
  .then(() => {                          // runs only if the connection worked
    console.log('MongoDB connected');
    app.listen(process.env.PORT || 5000, () => console.log('Server up')); // start listening; 5000 if PORT missing
  })
  .catch(err => console.error(err));
  
