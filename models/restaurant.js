const mongoose = require('mongoose')
const Review = require('./review')
const Schema = mongoose.Schema

const restaurant = new Schema({
    name: String,
    price: Number,
    city: String,
    state: String,
    address: String,
    services: String,
    description: String,
    image: String,
    contactNo: Number,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
    // contactNo: Number,
    // city:String,
    // state:String
});


restaurant.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Restaurant', restaurant);