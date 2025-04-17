import { Schema, model } from 'mongoose';

const countrySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    id: {
        type: Number,
        required: true,
        unique: true
    }
});

export const Country = model('Country', countrySchema);