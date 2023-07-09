const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const path = require("path");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const { authMiddleware } = require("./utils/auth");
const db = require("./config/connection");
const cors = require("cors");

const { typeDefs, resolvers } = require("./schemas/index");

const PORT = process.env.PORT || 3001;
const app = express();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
});

const upload = multer({ dest: "uploads/" });

app.use("/uploads", express.static("uploads"));

app.post("/upload", upload.single("file"), (req, res) => {
  // Handle file uploads
  console.log(req.file);
  res.send("File uploaded successfully");
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));

  // The "catchall" handler: for any request that doesn't
  // match one above, send back React's index.html file.
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });
}

async function startServer() {
  await server.start();

  server.applyMiddleware({ app });

  db.once("open", () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(
        `GraphQL is running at http://localhost:${PORT}${server.graphqlPath}`
      );
    });
  });
}

startServer();
