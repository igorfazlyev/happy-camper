const express = require('express')
const app = express()
const path = require('path')
const ejsMate = require('ejs-mate')
const methodOverride = require('method-override')
const mongoose = require('mongoose')
const Campground = require('./models/campground')
const catchAsync = require('./utils/catchAsync')
const ExpressError = require('./utils/ExpressError')
const port = 3000

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp').then(()=>{
    console.log('MONGO CONNECTION OPEN!!!')
})
.catch(err=>{
    console.log("MONGO CONNECTION ERROR")
    console.log(err)
})
//{
//    useNewUrlParsers: true,
//    useCreateIndex: true,
//    useUnifiedTopology: true
//}
// const db = mongoose.connection;
// db.on("error", console.error.bind(console,"connection error"))
// db.once("open", ()=>{
//     console.log("Database connected")
// })
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(methodOverride('_method'))
//
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.get('/', (req, res)=>{
    res.render('home')
})

app.get('/campgrounds', async (req, res)=>{
    const campgrounds = await Campground.find({})
    //console.log(campgrounds)
    //res.send("we're in testing mode")
    res.render('campgrounds/index', {campgrounds})
})

app.get('/campgrounds/new', (req, res)=>{
    res.render('campgrounds/new')
})

app.post('/add-new-campground', catchAsync(async (req,res, next)=>{
   
    const newCampground = new Campground(req.body.campground)
    await newCampground.save()
    res.redirect('/campgrounds')
    
}))

app.get('/campgrounds/:id', catchAsync(async (req, res)=>{
    const {id} = req.params
    
    const campground = await Campground.findById(id)
        
    res.render('campgrounds/show', {campground})
    
}))

app.get('/campgrounds/:id/edit', catchAsync(async (req, res)=>{
    const {id} = req.params
    
    const campground = await Campground.findById(id)
        
    res.render('campgrounds/edit', {campground})
    
}))

app.patch('/campgrounds/:id', catchAsync(async(req, res)=>{
    
    const id = req.params.id
    
    await Campground.findByIdAndUpdate(id, req.body.campground, {runValidators:true})
    
    res.redirect(`/campgrounds/${id}`)
}))

app.delete('/campgrounds/:id', catchAsync(async(req, res)=>{
//app.delete('/delete-campground/:id', async(req, res)=>{
    const id = req.params.id
    
    const deletedCampground = await Campground.findByIdAndDelete(id)
    console.log(`${deletedCampground.title} has been deleted`)
    
    res.redirect('/campgrounds')
}))

app.use((err, req, res, next)=>{
    res.send(`${err.message}<br><br><a href="/campgrounds">Back to Campgrounds</a>`)
    
})

app.listen(port, ()=> {
    console.log(`serving on port ${port}`)
})