const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const mongoose = require('mongoose');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
const { buildSchema } = require('graphql');

const app = express();

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/admin-portal')
.then(() => console.log('MongoDB connected'))
.catch((err) => console.log('MongoDB connection error:', err));
const schema = buildSchema(`
      type Query {
        users: [User]
        posts: [Post]
      }
    
      type Mutation {
        createUser(username: String! ,password: String!,email: String!, role: String!): User
        updateUser(id: ID!, username: String, password: String, role: String, active: Boolean): User
        deleteUser(id: ID!): User
        toggleUserStatus(id: ID!): User
        createPost(title: String!, description: String!, author: String!, images: [String], videos: [String]): Post
      }
    
      type User {
        id: ID!
        username: String!
        email : String!
        password: String!
        role: String!
        active: Boolean!
      }
    
      type Post {
        id: ID!
        title: String!
        description: String!
        author: [User]
        images: [String]
        videos: [String]
        comments: [Comment]
      }
    
      type Comment {
        id: ID!
        content: String!
        author: User
      }
    `);
    
    // Root resolver
    const root = {
      users: async () => await User.find(),
      posts: async () => await Post.find(),
    
      createUser: async ({ username, password, email , role }) => {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashedPassword, email , role, active: true });
        return await user.save();
      },
    
      updateUser: async ({ id, username, password, role, active }) => {
        const user = await User.findById(id);
        if (username) user.username = username;
        if (password) user.password = await bcrypt.hash(password, 10);
        if (role) user.role = role;
        if (active !== undefined) user.active = active;
        return await user.save();
      },
    
      deleteUser: async ({ id }) => await User.findByIdAndDelete(id),
    
      toggleUserStatus: async ({ id }) => {
        const user = await User.findById(id);
        user.active = !user.active;
        return await user.save();
      },
    
      createPost: async ({ title, description, images, videos }) => {
        const post = new Post({ title, description, images, videos });
        return await post.save();
      },
    };

// Apollo Server setup
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      // Get the token from the request headers
      const token = req.headers.authorization || '';
      
      try {
        // Verify the token and extract the user information
        const user = jwt.verify(token, 'secret');
        return { user };  // Pass the user info to the resolvers
      } catch (e) {
        return {};  // No user context if token is invalid
      }
    },
  });
  
// console.log(server)

async function startServer() {
  await server.start();
  server.applyMiddleware({ app });

  app.listen({ port: 4000 }, () =>
    console.log(`Server running at http://localhost:4000${server.graphqlPath}`)
  );
}

startServer();

