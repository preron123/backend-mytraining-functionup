let axios = require("axios")


let getStates = async function (req, res) {

    try {
        let options = {
            method: 'get',
            url: 'https://cdn-api.co-vin.in/api/v2/admin/location/states'
        }
        let result = await axios(options);
        console.log(result)
        let data = result.data
        res.status(200).send({ msg: data, status: true })
    }
    catch (err) {
        console.log(err)
        res.status(500).send({ msg: err.message })
    }
}


let getDistricts = async function (req, res) {
    try {
        let id = req.params.stateId
        let options = {
            method: "get",
            url: `https://cdn-api.co-vin.in/api/v2/admin/location/districts/${id}`
        }
        let result = await axios(options);
        console.log(result)
        let data = result.data
        res.status(200).send({ msg: data, status: true })
    }
    catch (err) {
        console.log(err)
        res.status(500).send({ msg: err.message })
    }
}

let getByPin = async function (req, res) {
    try {
        let pin = req.query.pincode
        let date = req.query.date
        console.log(`query params are: ${pin} ${date}`)
        var options = {
            method: "get",
            url: `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByPin?pincode=${pin}&date=${date}`
        }
        let result = await axios(options)
        console.log(result.data)
        res.status(200).send({ msg: result.data })
    }
    catch (err) {
        console.log(err)
        res.status(500).send({ msg: err.message })
    }
}


let getdistrictID = async function (req, res) {

try{ 



    let district = req.query.districtId

    let date = req.query.date
    
    let options ={
        method:"get",
        url : `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id=${district}&date=${date}`
    }


    let result = await axios (options)
    console.log(result.data)
    res.status(200).send({msg:result.data})

}
catch (err){
    console.log(err)
    res.status(500).send({msg:err.message})
}

}

let getOtp = async function (req, res) {
    try {
        let blahhh = req.body
        
        console.log(`body is : ${blahhh} `)
        var options = {
            method: "post",
            url: `https://cdn-api.co-vin.in/api/v2/auth/public/generateOTP`,
            data: blahhh
        }

        let result = await axios(options)
        console.log(result.data)
        res.status(200).send({ msg: result.data })
    }
    catch (err) {
        console.log(err)
        res.status(500).send({ msg: err.message })
    }
}
  
let memHandler = async function (req, res){
    try {
        let options = {
            method: "post",
            url:"https://api.imgflip.com/caption_image?template_id=181913649&text0=Functionup&text1=yes&username=chewie12345&password=meme@123"
        }
        let results= await axios(options)
        res.send({data: results.data})
    } catch (error){
        console.log(error)
        res.status(500).send({status: false, msg: "server error"})
    }
}

let weather = async function (req, res) {
    try {
     let cities=["Bengaluru","Mumbai", "Delhi", "Kolkata", "Chennai", "London", "Moscow"]
        let result=[]       
     for( let elements of cities){      
        let Cities={city:elements}
        let options={
           method:"get",
           url:`http://api.openweathermap.org/data/2.5/weather?q=${elements}&appid=8da9dbb65f3268acdf9011a1f046ae82`
        }
        let resp= await axios(options);
        Cities.temp=resp.data.main.temp;
         result.push(Cities);
     }
   
     result.sort(function (a,b){return a.temp-b.temp})
      
     res.status(200).send({ msg:result })
     
     console.log({ msg:result })
    }catch (err) {
    console.log(err)
    res.status(500).send({ msg: err.message })
    }
    }
    






module.exports.getStates = getStates
module.exports.getDistricts = getDistricts
module.exports.getByPin = getByPin
module.exports.getOtp = getOtp

module.exports.getdistrictID = getdistrictID
module.exports.memHandler = memHandler

module.exports.weather =  weather