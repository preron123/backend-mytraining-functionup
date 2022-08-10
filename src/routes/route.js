const express = require('express');
const router = express.Router();

let players =
   [
       {
           "name": "manish",
           "dob": "1/1/1995",
           "gender": "male",
           "city": "jalandhar",
           "sports": [
               "swimming"
           ]
       },
       {
           "name": "gopal",
           "dob": "1/09/1995",
           "gender": "male",
           "city": "delhi",
           "sports": [
               "soccer"
           ],
       },
       {
           "name": "lokesh",
           "dob": "1/1/1990",
           "gender": "male",
           "city": "mumbai",
           "sports": [
               "soccer"
           ],
       },
   ]
   router.post('/playersall', function (req, res) {
    let lastplayer = req.body;
       //LOGIC WILL COME HERE
       for( let newplayer in players){
        if(players[newplayer].name === lastplayer.name){
            req.send("this player is already exist")
        }
        
       }

       players.push(lastplayer)
       res.json( players);
   })


   
module.exports = router;