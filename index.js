const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

const adminPanel = require('./AdminPanel/country')


//middleware
app.use(cors());
app.use(express.json());


// mongodb part 





//routes
app.post('/country', adminPanel.insertCountry);
app.get('/country', adminPanel.getCountry)

//server
app.listen(port, () => { console.log('Blood bank server is running on port:', port) })