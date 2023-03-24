const mongoose = require('mongoose');
const cities = require('./cities');
const { descriptors, places } = require('./seedHelpers');
const Campground = require('../models/campground');


const database_name = 'yelp-camp'
mongoose.connect(`mongodb://localhost:27017/${database_name}`)
.then(() => {
    console.log("MONGO CONNECTION SUCCESS")
})
.catch(err => {
    console.log("MONGO CONNECTION ERROR!!")
    console.log(err)
})

const imageURLs = [
    "https://images.unsplash.com/reserve/uvRBqDAfQfaGPJiI6lVS_R0001899.jpg?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHw0ODQzNTF8fHx8fHx8MTY0MTcyNDI3NA&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080",
    "https://images.unsplash.com/photo-1483354483454-4cd359948304?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHw0ODQzNTF8fHx8fHx8MTY0MTcyMjk1OQ&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080",
    "https://images.unsplash.com/photo-1469053913977-1d2f009670d9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHw0ODQzNTF8fHx8fHx8MTY0MTcyMjY4NA&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080",
    "https://images.unsplash.com/photo-1440700265116-fe3f91810d72?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHw0ODQzNTF8fHx8fHx8MTY0MTcyMjcyMQ&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080",
    "https://images.unsplash.com/photo-1472978346569-9fa7ea7adf4a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHw0ODQzNTF8fHx8fHx8MTY0MTcyMjc3MA&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080",
    "https://images.unsplash.com/photo-1436712702142-096ca31693c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHw0ODQzNTF8fHx8fHx8MTY0MTcyMjc4Mg&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080",
    "https://images.unsplash.com/photo-1463062511209-f7aa591fa72f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHw0ODQzNTF8fHx8fHx8MTY0MTcyMjgxMA&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080",
    "https://images.unsplash.com/photo-1442128788708-15f1811dd622?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHw0ODQzNTF8fHx8fHx8MTY0MTcyMjgyMQ&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080",
    "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHw0ODQzNTF8fHx8fHx8MTY0MTcyMjg0OQ&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080",
    "https://images.unsplash.com/photo-1475518845976-0fd87b7e4e5d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHw0ODQzNTF8fHx8fHx8MTY0MTcyMjg3Mw&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080"
];

const sample = arr => arr[Math.floor(Math.random() * arr.length)];

const saveToDB = async () => {
    await Campground.deleteMany({});

    const n = 10 // No of random samples
    for (let i = 0; i < n ; i++) {
        
        const randomCity = sample(cities);
        const randomPrice = Math.floor(Math.random() * 20);
        const d = new Campground({
            location: `${randomCity.city}, ${randomCity.state}`, 
            title: `${sample(descriptors)} ${sample(places)}`,
            imageURL: imageURLs[i],
            author: '628534a251a54cb70c528e8a',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas sunt at ipsa maxime corrupti atque. Esse saepe accusamus officia eligendi earum blanditiis iure tenetur facere, harum dolores explicabo eos ipsum!',
            price: randomPrice
        });
        await d.save();
    }
}

saveToDB()
.then(() => {
    console.log("RANDOM SAMPLES GENERATED")
    mongoose.connection.close()
})
.catch(err => {
    console.log("ERROR!")
    console.log(err)
})