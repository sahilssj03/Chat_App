const MongoClient = require('mongoose');
require('dotenv').config();
module.exports =  MongoClient.connect(process.env.DB_CONNECTION, () => { console.log('DB Connected', typeof(process.env.DB_CONNECTION)) });
