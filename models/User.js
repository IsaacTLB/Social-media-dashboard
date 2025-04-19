import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { SECRET_ACCESS_TOKEN } from "../config/index.js";

const UserSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: "Your firstname is required",
      max: 25,
    },
    last_name: {
      type: String,
      required: "Your lastname is required",
      max: 25,
    },
    email: {
      type: String,
      required: "Your email is required",
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: "Your password is required",
      select: false,
      // Consider increasing the max length to 72 for bcrypt hashed passwords
      max: 72, 
    },
    role: {
      type: String,
      required: true,
      enum: ['user', 'admin', 'superadmin'], // Used descriptive roles instead of hex values
      default: 'user',
    },
  },
  { timestamps: true }
);

// Hash password before saving
UserSchema.pre("save", function (next) {
  const user = this;

  if (!user.isModified("password")) return next();

  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) return next(err);

      user.password = hash;
      next();
    });
  });
});

// JWT generation
UserSchema.methods.generateAccessJWT = function () {
  const payload = {
    id: this._id,
    email: this.email,  // You may want to add other useful information in the payload
  };

  try {
    return jwt.sign(payload, SECRET_ACCESS_TOKEN, {
      expiresIn: "20m",
    });
  } catch (err) {
    throw new Error("Error generating JWT");
  }
};

// Password verification method
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model("users", UserSchema);
