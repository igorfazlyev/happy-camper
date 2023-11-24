const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

let db

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp').then((dbConnection)=>{
    console.log('MONGO CONNECTION OPEN!!!')
    db = dbConnection
    seedDB()
})
.catch(err=>{
    console.log("MONGO CONNECTION ERROR")
    console.log(err)
})

//ain()
//
// async function main() {
//     try {
//         const db = await mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
//         seedDB()
//         db.disconnect()
//     }catch (e) {
//         console.log('failed to connect to the database')
//         console.log(e)
//     }
// }

async function seedDB(){
    await Campground.deleteMany({})
    Array.from(Array(100).keys()).forEach(async ()=>{
        const randCity = cities[Math.floor(Math.random()*cities.length)]
        const randDescriptor = descriptors[Math.floor(Math.random()*descriptors.length)]
        const randPlace = places[Math.floor(Math.random()*places.length)]
        const camp = new Campground({
            title: `${randDescriptor} ${randPlace}`, 
            location: `${randCity.city}, ${randCity.state}`,
            image:'https://source.unsplash.com/collection/483251',
            description:"I'm baby echo park sartorial synth letterpress pinterest glossier meditation. Tacos semiotics truffaut, blackbird spyplane neutral milk hotel readymade street art cardigan messenger bag affogato tote bag lo-fi palo santo. Kombucha shaman pop-up chartreuse retro big mood.",
            price: Math.floor(Math.random()*20) + 10
        })
        await camp.save()
        console.log(`saving ${randDescriptor} ${randPlace} in ${randCity.city}, ${randCity.state}`)
    })
    //db.disconnect()
}


