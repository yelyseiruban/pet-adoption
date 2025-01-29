import mongoose, { Document, Types } from 'mongoose';

export interface AdoptionDBModel extends Document {
    userId: Types.ObjectId;
    petId: Types.ObjectId;
    dateTime: Date;
}

const AdoptionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    petId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pet', required: true },
    dateTime: { type: Date, default: Date.now }
});

export default mongoose.model<AdoptionDBModel>('Adoption', AdoptionSchema);