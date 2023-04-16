const Joi = require('joi');
const { number } = require('joi');



module.exports.guideSchema = Joi.object({
    touristGuide: Joi.object({
        name: Joi.string().required(),
        price: Joi.number().required().min(1),
        location: Joi.string().required(),
        experience: Joi.number().required().min(0),
        language: Joi.string().required(),
        services: Joi.string().required(),
        image: Joi.string().required(),
        contactNo: Joi.number().required().min(0),
        city: Joi.string().required(),
        state: Joi.string().required(),
        description: Joi.string().required()
    }).required()
});

module.exports.visitSchema = Joi.object({
    spot: Joi.object({
        name: Joi.string().required(),
        city: Joi.string().required(),
        state: Joi.string().required(),
        address: Joi.string().required(),
        services: Joi.string().required(),
        image: Joi.string().required(),
        contactNo: Joi.number().required(),
        description: Joi.string().required()
    }).required()
});

module.exports.hotelSchema = Joi.object({
    hotel: Joi.object({
        name: Joi.string().required(),
        price: Joi.number().required().min(1),
        city: Joi.string().required(),
        state: Joi.string().required(),
        address: Joi.string().required(),
        star: Joi.string().required(),
        image: Joi.string().required(),
        contactNo: Joi.number().required(),
        description: Joi.string().required()
    }).required()
});


module.exports.restaurantSchema = Joi.object({
    restaurant: Joi.object({
        name: Joi.string().required(),
        price: Joi.number().required().min(1),
        city: Joi.string().required(),
        state: Joi.string().required(),
        address: Joi.string().required(),
        services: Joi.string().required(),
        image: Joi.string().required(),
        contactNo: Joi.number().required(),
        description: Joi.string().required()
    }).required()
});


module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required()
    }).required()
})