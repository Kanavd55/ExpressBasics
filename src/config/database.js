const mongoose = require('mongoose');

const connectDB = async () => {
    await mongoose.connect("mongodb+srv://kanavdahat55:ppLFx3aocJQOv8A1@namastenode.dg19q.mongodb.net/Expressjs");
}

module.exports = connectDB;