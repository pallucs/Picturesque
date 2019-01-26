var mongoose = require("mongoose");

// SCHEMA SETUP
var pictureSchema = new mongoose.Schema({
   title: String,
   price: String,
   image: String,
   description: String,
   author: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String
   },
    comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ]
});

module.exports = mongoose.model("Picture", pictureSchema);