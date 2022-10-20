import mongoose, { Document, Schema } from "mongoose";

export interface Dish {
    image: string,
    name: string,
    stars: number,
    origin: string,
    description: string,
    more_reference: string,
    how_to: [{ name: string, step: string[] }]
    stuff: [{name: string, quantity: number, measurement: string}]
    created_at: Date,
    updated_at: Date,
}

export interface DishModel extends Dish, Document { }

const DishSchema: Schema = new Schema({
    image: { type: String, required: false },
    name: { type: String, required: false },
    stars: { type: Number, required: false },
    origin: { type: String, required: false },
    description: { type: String, required: false },
    how_to: [{ type: Schema.Types.Mixed, required: false }],
    stuff: [{ type: Schema.Types.Mixed, required: false }],
}, {
    timestamps: true,
})

export default mongoose.model<DishModel>('Dish', DishSchema);