const db = require("../config/connection");
const { User, Video, Comment } = require("../models");
const userSeeds = require("./userSeeds.json");
const videoSeeds = require("./videoSeeds.json");
const commentSeeds = require("./commentSeeds.json");

db.once("open", async () => {
  try {
    await User.deleteMany({});
    await User.create(userSeeds);

    await Video.deleteMany({});
    await Video.create(videoSeeds);

    await Comment.deleteMany({});
    await Comment.create(commentSeeds);

    console.log("All seeds planted successfully!");
    process.exit(0);
  } catch (err) {
    throw err;
  }
});
