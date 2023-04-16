const mongoose = require('mongoose')
const Review = require('./review')
const Schema = mongoose.Schema

const hotel = new Schema({
    name: String,
    price: Number,
    state: String,
    city: String,
    address: String,
    star: String,
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
    // contactNo: Number
    // city:String,
    // state:String
});


hotel.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Hotel', hotel);