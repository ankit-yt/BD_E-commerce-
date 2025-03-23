const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "do5bugngn",
  api_key: "272686899287346",
  api_secret: "ZvIavKPJA89HkbTc44OAXv6nhZk",  // Replace with actual API secret
  secure: true,
});

module.exports = cloudinary;
