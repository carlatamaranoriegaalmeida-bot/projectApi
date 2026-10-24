import { Schema, model } from 'mongoose';

const UserSchema = new Schema({
 email: { type: String, required: true, unique: true, trim: true },
 password: { type: String, required: true },
 rol: { type: String, default: 'alumno' }
}, { timestamps: true });
export const UserModel = model('User', UserSchema);