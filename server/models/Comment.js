const { Schema, model } = require("mongoose");
const dateFormat = require("../utils/dateFormat");

const commentSchema = new Schema({
  commentText: {
    type: String,
    unique: true,
    minLength: 1,
    maxLength: 280,
    trim: true,
  },
  video: {
    type: Schema.Types.ObjectId,
    ref: "Video",
  },
  postDate: {
    type: Date,
    default: Date.now,
    get: (timestamp) => dateFormat(timestamp),
  },
});

const Comment = model("Comment", commentSchema);

module.exports = Comment;
