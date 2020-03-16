const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Populate = require("../utils/autopopulate");

const RecipeSchema = new Schema({
  name: { type: String, required: true },
  servings: { type: String, required: true },
  ingredients: { type: String, required: true },
  directions: { type: String, required: true },
  author : { type: Schema.Types.ObjectId, ref: "User", required: true },
  upVotes : [{ type: Schema.Types.ObjectId, ref: "User"}],
  downVotes : [{ type: Schema.Types.ObjectId, ref: "User"}],
  voteScore : {type: Number}
});

// Always populate the author field
RecipeSchema
    .pre('findOne', Populate('author'))
    .pre('find', Populate('author'))

module.exports = mongoose.model("Recipe", RecipeSchema);