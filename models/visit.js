const mongoose = require('mongoose')
const Review = require('./review')
const Schema = mongoose.Schema

const spot = new Schema({
    name: String,
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
    // city:String,
    // state:String
});


spot.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Visit', spot);