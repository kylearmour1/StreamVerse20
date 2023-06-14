const { gql } = require("apollo-server-express");
const typeDefs = gql`
  type User {
    id: ID
    firstName: String
    lastName: String
    username: String
    email: String
    videos: [Video]
    password: String
  }

  type Video {
    id: ID
    title: String
    description: String
    url: String
    # uploadDate: Date!
    comments: [Comment]
  }

  type Comment {
    id: ID
    commenttText: String
    video: [Video]
    user: [User]
  }

  type Auth {
    token: ID
    user: User
  }

  type Query {
    user(id: ID!): User
    users: [User]
    video(id: ID!): Video
    videos: [Video]
    comment(id: ID!): Comment
    comments: [Comment]
  }

  type Mutation {
    addUser(
      firstName: String!
      lastName: String!
      username: String!
      email: String!
      password: String!
    ): Auth
    addVideo(
      userId: ID!
      title: String!
      description: String
      url: String!
    ): Video
    addComment(userId: ID!, videoId: ID!, text: String!): Comment
    login(username: String!, password: String!): Auth
    # Further mutations for updating and deleting
  }
`;

module.exports = typeDefs;
