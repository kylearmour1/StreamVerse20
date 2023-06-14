const { AuthenticationError } = require("apollo-server-express");
const { User, Comment, Video } = require("../models");
// const { signToken } = require('../utils/auth');
const SECRET = `${process.env.JWT_SECRET}`;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const resolvers = {
  Query: {
    user: async (parent, { id }) => {
      return await User.findById(id);
    },
    users: async () => {
      return await User.find();
    },
    video: async (parent, { id }) => {
      return await Video.findById(id);
    },
    videos: async () => {
      return await Video.find();
    },
    comment: async (parent, { id }) => {
      return await Comment.findById(id);
    },
    comments: async () => {
      return await Comment.find();
    },
  },
  Mutation: {
    addUser: async (
      parent,
      { firstName, lastName, username, email, password }
    ) => {
      // Password hashing
      // const hashedPassword = await bcrypt.hash(password, 10);

      const user = new User({ firstName, lastName, username, email, password });
      await user.save();

      // generate JWT
      const token = jwt.sign({ id: user._id }, SECRET);

      return { token, user };
    },
    login: async (parent, { username, password }) => {
      const user = await User.findOne({ username });
      // User verification
      if (!user) {
        throw new AuthenticationError("User not found");
      }
      // Password verification
      const valid = await user.isCorrectPassword(password);
      if (!valid) {
        throw new AuthenticationError("Invalid password");
      }

      // generate JWT
      const token = jwt.sign({ id: user._id }, SECRET);
      return { token, user };
    },
    addVideo: async (parent, { title, description, url, userId }) => {
      const video = new Video({ title, description, url, userId });
      return await video.save();
    },
    addComment: async (parent, { text, userId, videoId }) => {
      const comment = new Comment({ text, userId, videoId });
      return await comment.save();
    },
  },
};

module.exports = resolvers;
