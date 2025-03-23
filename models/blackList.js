const mongoose = require("mongoose");

const blackListSchema = mongoose.Schema(
    {
        token: {
            type: String,
            required: true
        }
    },
    { timestamps: true }
);

blackListSchema.index({ token: 1 }, { unique: true });

module.exports = mongoose.model("blackList", blackListSchema);
