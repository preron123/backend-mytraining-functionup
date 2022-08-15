const express = require('express');
const abc = require('../introduction/intro')
const router = express.Router();

router.get('/GET/movies1', function (req, res) {
       const movies = ["Titanic","Avtar","THE LOST CITY","ALL OF US ARE DEAD"];
         res.send(movies);
});

 router.get('/GET/movies2/:indexNumber', function (req, res){
      const movies = ["CROODS","captain america ","shrek","zombie land"];
      const index = req.params.indexNumber;
      console.log(movies[index]);
      res.send(movies[index]);
})
router.get('/GET/movies3/:indexNumber', function (req, res){
    const movies = ["Tenet","The Btamna Begins","Pather Pachali","Charlie The Choclate Factory"];
    const index = req.params.indexNumber;
       if(index<4){
        res.send(movies[index]);
        console.log(movies[index]);
       }else{
        res.send("use a valid index");
        console.log("use a valid index");
       }
});

router.get('/GET/films1', function (req, res){
       const films = [{
        "id": 1,
        "name": "The Shining"
       }, {
        "id": 2,
        "name": "Incendies"
       }, {
        "id": 3,
        "name": "Rang de Basanti"
       }, {
        "id": 4,
       "name": "Finding Nemo"
       }]
       res.send(films);
});
router.get('/GET/films2/:filmid', function (req, res){
    const films = [{
     "id": 1,
     "name": "The Shining"
    }, {
     "id": 2,
     "name": "Incendies"
    }, {
     "id": 3,
     "name": "Rang de Basanti"
    }, {
     "id": 4,
    "name": "Finding Nemo"
    }];
    const index1 = req.params.filmid;
    if(index1<5 && index1>0 ){
    res.send(films[index1-1]);
    console.log(films[index1-1]);
    }else{
        res.send("No movie exists with this id");
        console.log("No movie exists witht this id");
    }
});

module.exports = router;