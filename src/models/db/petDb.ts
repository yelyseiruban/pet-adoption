import mongoose, { Schema, Document } from 'mongoose';

export interface PetDBModel extends Document {
    race: string;
    name: string;
    age: number;
    adopted: boolean;
}

const PetSchema: Schema = new Schema({
    race: { type: String, required: true },
    name: { type: String, required: true },
    age: { type: Number, required: true },
    adopted: { type: Boolean, default: false },
});

export default mongoose.model<PetDBModel>('PetDb', PetSchema);