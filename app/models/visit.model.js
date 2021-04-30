const mongoose = require('mongoose');

const VisitSchema = mongoose.Schema({
    realEstate_ID: String,
    user_ID: String,
    mediator_ID: String,
    date: Date,
    accepted: Boolean
}, {
    timestamps: true
});

module.exports = mongoose.model('Visit', VisitSchema);
