const express = require('express');
const router = express.Router();

// let players =
//    [
//        {
//            "name": "manish",
//            "dob": "1/1/1995",
//            "gender": "male",
//            "city": "jalandhar",
//            "sports": [
//                "swimming"
//            ]
//        },
//        {
//            "name": "gopal",
//            "dob": "1/09/1995",
//            "gender": "male",
//            "city": "delhi",
//            "sports": [
//                "soccer"
//            ],
//        },
//        {
//            "name": "lokesh",
//            "dob": "1/1/1990",
//            "gender": "male",
//            "city": "mumbai",
//            "sports": [
//                "soccer"
//            ],
//        },
//    ]
//    router.post('/playersall', function (req, res) {
//     let lastplayer = req.body;
//        //LOGIC WILL COME HERE
//        for( let newplayer in players){
//         if(players[newplayer].name === lastplayer.name){
//             req.send("this player is already exist")
//         }
        
//        }

//        players.push(lastplayer)
//        res.json( players);
//    })

let persons =[
    {
        name: "pk",
        age :23,
        votingstatus:false

    },
    {
        name: "sk",
        age :16,
        votingstatus:false

    },
    {
        name: "ab",
        age :10,
        votingstatus:false

    },
    {
        name: "bk",
        age :70,
        votingstatus:false

    },
    {
        name: "pk",
        age :45,
        votingstatus:false

    }
    
]
router.post('/votingage', function (req, res) {
    let blankarray = [];
    
        let voteage = req.query.age;
           //LOGIC WILL COME HERE
           for( let person1 in persons){
             if(persons[person1].age>voteage){
                persons[person1].votingstatus = true;
                blankarray.push(persons[person1])

             }
            
           }
    
    //        players.push(lastplayer)
           res.json(blankarray);
       })
    
 module.exports = router;