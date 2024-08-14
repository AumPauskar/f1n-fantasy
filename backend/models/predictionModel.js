import mongoose from 'mongoose';

const predictionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  rd: {
    type: Number,
    required: true
  },
  predictions: {
    type: Array,
    required: true
  }
});

const Prediction = mongoose.model('Prediction', predictionSchema);

export default Prediction;