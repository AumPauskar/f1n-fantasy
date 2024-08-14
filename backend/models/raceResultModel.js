import mongoose from 'mongoose';

const raceResultSchema = new mongoose.Schema({
  rd: {
    type: Number,
    required: true,
    unique: true
  },
  finishers: {
    type: Array,
    required: true
  },
  dnf: {
    type: Array,
    required: false
  }
});

const RaceResult = mongoose.model('RaceResult', raceResultSchema);

export default RaceResult;