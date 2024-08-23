import mongoose from "mongoose";

const pointsSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    ppr: {
        type: Array,
        required: true
    },
    points: {
        type: Number,
        required: true
    }
});

const Points = mongoose.model("Points", pointsSchema);
export default Points;