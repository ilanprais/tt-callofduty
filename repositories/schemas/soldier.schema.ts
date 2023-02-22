import mongoose, { Schema } from "mongoose";

export const SoldierSchema: Schema = new Schema({
    _id: {
        type: String
    },
    name: {
        type: String,
        required: true,
        minLength: 1
    },
    rank: {
        type: String,
        required: true,
        minLength: 1
    },
    limitations: {
        type: [String],
        required: true
    },
    duties: {
        type: [String],
        required: true,
        default: []
    }
    
});

export const Soldier = mongoose.model("Soldier", SoldierSchema);
