import { model, Schema } from 'mongoose';

const employeeSchema = new Schema({
  name: { type: String, required: true },
  position: { type: String, required: true },
  department: { type: String, required: true },
  salary: { type: Number, required: true },
}, {
  timestamps: true,
  versionKey: false,
});

export default model('Employee', employeeSchema);
