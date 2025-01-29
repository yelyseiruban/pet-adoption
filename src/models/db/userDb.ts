import mongoose, { Schema, Document } from 'mongoose';

export interface UserDBModel extends Document {
    name: string;
    canAdopt: boolean;
    pets: mongoose.Types.ObjectId[];
}

const UserSchema: Schema = new Schema({
    name: { type: String, required: true },
    canAdopt: { type: Boolean, default: false },
    pets: [{ type: Schema.Types.ObjectId, ref: 'Pet' }],
}, { timestamps: true });

export default mongoose.model<UserDBModel>('User', UserSchema);