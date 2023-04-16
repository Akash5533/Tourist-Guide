const mongoose = require('mongoose')
const Review = require('./review')
const Schema = mongoose.Schema

const touristGuide = new Schema({
    name: String,
    price: Number,
    language: String,
    experience: Number,
    location: String,
    services: String,
    description: String,
    image: String,
    contactNo: Number,
    city:String,
    state:String,
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
});


touristGuide.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Guide', touristGuide);