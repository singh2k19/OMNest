const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type User {
        id: ID!
        username: String!
        email: String!
        password: String!
        role: String!
        status: String!
    }

    type Post {
        id: ID!
        title: String!
        description: String!
        author: User
        media: String
        likes: [User]
        comments: [Comment]
        
    }

    type Comment {
        id: ID!
        content: String!
        author: User!
        post: Post!
    }

    type Carpool {
        id: ID!
        route: String!
        timing: String!
        availableSeats: Int!
        user: User!
    }

    type Query {
        users: [User]
        posts: [Post]
        carpools: [Carpool]
    }
    type AuthPayload {
        token: String!
        user: User!
    }

    type Mutation {
        createUser(username: String!, email: String!, password: String!, role: String): User
        updateUser(id: ID!, status: String, role: String): User
        deleteUser(id: ID!): String
        loginUser(email: String!, password: String!): AuthPayload
        createPost(title: String!, description: String!, media: String, author: ID!): Post
        updatePost(id: ID!, title: String, description: String, media: String): Post
        deletePost(id: ID!): String
    }
`;

module.exports = typeDefs;
