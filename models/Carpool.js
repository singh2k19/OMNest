const mongoose = require('mongoose');

const CarpoolSchema = new mongoose.Schema({
    route: { type: String, required: true },
    timing: { type: String, required: true },
    availableSeats: { type: Number, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

module.exports = mongoose.model('Carpool', CarpoolSchema);
