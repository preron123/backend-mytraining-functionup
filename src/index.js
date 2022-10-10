
const express = require('express');
const route = require('./routes/route');
const mongoose= require('mongoose');

const app = express();


app.use(express.json());

mongoose.connect("mongodb+srv://Backend-Developer:VOsRhEoMTbd0U6U6@cluster0.a48nwas.mongodb.net/group46Database?retryWrites=true&w=majority", {
    useNewUrlParser: true
})
.then( () => console.log("MongoDb is connected"))
.catch ( err => console.log(err) )


app.use('/', route)


app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});