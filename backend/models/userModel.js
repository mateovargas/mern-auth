import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

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
        required: true,
    },
}, {
    timestamps: true
});

//adds middleware for hashing. DO NOT use arrow function for callback
//as you are using the this keyword to refer to the user we are saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return;
    }

    //key used to hash the password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt); //definitely necessary
    console.log(this.password);
});

//adding methods directly to the user. In this case, to verify password
userSchema.methods.matchPasswords = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

const User = mongoose.model('User', userSchema);

export default User;