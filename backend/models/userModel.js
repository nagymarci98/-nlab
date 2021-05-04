import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import { productSchema } from '../models/productModel.js'

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false
    },
    favouriteProducts: [productSchema]
}, {
    timestamps: true
});

userSchema.methods.matchPassword = async function (enteredPW) {
    return await bcrypt.compare(enteredPW, this.password);
}

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})

const User = mongoose.model('User', userSchema);
export default User