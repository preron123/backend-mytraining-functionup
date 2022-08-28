const express = require('express');
const bodyParser = require('body-parser');
const route = require('./routes/route.js');
const { default: mongoose } = require('mongoose');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


mongoose.connect("mongodb+srv://preronaDatabase:RX1UhhpAWmeEPPyB@cluster0.cv0moqj.mongodb.net/preronaplutonium", {
    useNewUrlParser: true
})
.then( () => console.log("MongoDb is connected"))
.catch ( err => console.log(err) )


  

app.use('/', route);


app.use (
    function (req, res, next) {
        console.log ("inside GLOBAL MW");
        // next();
        
        let  today = new Date()
let task = today.getDate() +'-'
           +( today.getMonth()+1)+ '-'
            +today.getFullYear()+'  '

           + today.getHours() +':'
           +today.getMinutes() + ':'
           +today.getSeconds()
let ip =req.ip
let apilocation= req.originalUrl
console.log(`${task} ${ip} ${apilocation}`)
// next()
 let mydata = req.body
res.send(mydata)
  }
  );

//   app.use('/', route);

app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});
































































// const express = require('express');
// const bodyParser = require('body-parser');
// const route = require('./routes/route.js');
// const { default: mongoose } = require('mongoose');
// const app = express();

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));


// mongoose.connect("mongodb+srv://preronaDatabase:RX1UhhpAWmeEPPyB@cluster0.cv0moqj.mongodb.net/preronaplutonium", {
//     useNewUrlParser: true
// })
// .then( () => console.log("MongoDb is connected"))
// .catch ( err => console.log(err) )

// app.use (
//     function (req, res, next) {
//         console.log ("inside GLOBAL MW");
//         next();
//   }
//   );
  
//   app.use('/', route);


//   app.use (
//       function (req, res, next) {
//           console.log ("inside GLOBAL MW");
//           // next();
//           let  today = new Date()
//   let task = today.getDate() +'-'
//              +( today.getMonth()+1)+ '-'
//               +today.getFullYear()+'  '
  
//              + today.getHours() +':'
//              +today.getMinutes() + ':'
//              +today.getSeconds()
//   let ip =req.ip
//   let apilocation= req.originalUrl
//   console.log(`${task} ${ip} ${apilocation}`)
  
//     }
//     );


// app.use('/', route);


// app.listen(process.env.PORT || 3000, function () {
//     console.log('Express app running on port ' + (process.env.PORT || 3000))
// });
