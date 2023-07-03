const mongoose = require('mongoose');
mongoose.set('strictQuery', true)

mongoose.connect('mongodb+srv://kashyaploki07:RuFvrwOoFhxGnq8q@employeedb.lpawpmd.mongodb.net/Employeedb?retryWrites=true&w=majority')
      


const db = mongoose.connection

db.on('error', console.error.bind(console, 'error connecting to database'));

db.once('open', ()=>{
    console.log("Database Connected to : mongoDB");
});

module.exports = mongoose;





