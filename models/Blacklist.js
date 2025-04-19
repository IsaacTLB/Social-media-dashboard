import mongoose from "mongoose";

// Define the Blacklist Schema
const BlacklistSchema = new mongoose.Schema(
  {
    token: {
      type: String,    // Storing the token as a string
      required: true,
      unique: true,    // Ensures tokens are unique in the blacklist
    },
  },
  { timestamps: true }
);

// Optional: TTL index for automatic token expiration
// Uncomment the following line if you want tokens to expire after a certain period
BlacklistSchema.index({ createdAt: 1 }, { expireAfterSeconds: 3600 }); // 1 hour expiry

export default mongoose.model("blacklist", BlacklistSchema);
