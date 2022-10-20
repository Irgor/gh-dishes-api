import mongoose, { Document, Schema } from "mongoose";

export interface Ingredient {
    image: string,
    name: string,
    quantity: number,
    price: number,
    total: number,
    measurement: string,
    coin: string,
    isBoxed: boolean,
    giver: string,
    created_at: Date,
    updated_at: Date,
}

export interface IngredientModel extends Ingredient, Document { }

const IngredientSchema: Schema = new Schema({
    image: { type: String, required: false },
    name: { type: String, required: false },
    measurement: { type: String, required: false },
    coin: { type: String, required: false },
    giver: { type: String, required: false },
    quantity: { type: Number, required: false },
    price: { type: Number, required: false },
    total: { type: Number, required: false },
    isBoxed: { type: Boolean, required: false },
}, {
    timestamps: true,
})

export default mongoose.model<IngredientModel>('Ingredient', IngredientSchema);