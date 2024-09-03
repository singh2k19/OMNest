// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const User = require('../models/User');
// const Post = require('../models/Post');
// const Carpool = require('../models/Carpool.js');

// const resolvers = {
//     Query: {
//         users: async () => await User.find(),
//         posts: async () => await Post.find().populate('author').populate('comments'),
//         carpools: async () => await Carpool.find().populate('user'),
//     },
 
//     Mutation: {
//         loginUser: async (_, { email, password }) => {
//             const user = await User.findOne({ email });
//             if (!user) {
//               throw new Error('User not found');
//             }
      
//             const isPasswordValid = await bcrypt.compare(password, user.password);
//             if (!isPasswordValid) {
//               throw new Error('Invalid password');
//             }
      
//             const token = jwt.sign({ userId: user.id, role: user.role }, 'your_jwt_secret', {
//               expiresIn: '1h',
//             });
      
//             return { token, user };
//           },
//         createUser: async (_, { username, email, password, role }) => {
//             const hashedPassword = await bcrypt.hash(password, 10);
//             const user = new User({ username, email, password: hashedPassword, role });
//             return await user.save();
//         },

//         updateUser: async (_, { id, status, role }) => {
//             return await User.findByIdAndUpdate(id, { status, role }, { new: true });
//         },

//         deleteUser: async (_, { id }) => {
//             await User.findByIdAndDelete(id);
//             return "User deleted";
//         },

     
//         createPost: async (_, { title, description, author }) => {
//             // Find the author (assuming author is the user's ID)
//             if (!title || !description || !author) {
//                 throw new Error('Title, description, and author are required.');
//               }
            
//               console.log('Creating post with title:', title);
//             const user = await User.findById(author);
//             if (!user) {
//               throw new Error('Author not found');
//             }
      
//             // Create the post and link it to the author
//             const post = new Post({
//               title,
//               description,
//               author: user._id,  // Store the author's ID in the post
//             });
      
//             const savedPost = await post.save();
//             console.log('Post saved successfully:', savedPost);
//             const populatedPost = await Post.findById(savedPost._id).populate('author');

//             console.log('Populated Post:', populatedPost);

//             return populatedPost;
//         },

//         updatePost: async (_, { id, title, description, media }) => {
//             return await Post.findByIdAndUpdate(id, { title, description, media }, { new: true });
//         },

//         deletePost: async (_, { id }) => {
//             await Post.findByIdAndDelete(id);
//             return "Post deleted";
//         },
//     },
// };

// module.exports = resolvers;




const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Post = require('../models/Post');

const resolvers = {
  Query: {
    users: async () => await User.find(),
    posts: async () => await Post.find().populate('author').populate('comments'),
    carpools: async () => await Carpool.find().populate('user'),
  },

  Mutation: {
    loginUser: async (_, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error('User not found');
      }
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new Error('Invalid password');
      }
  
      const token = jwt.sign({ userId: user.id, role: user.role }, 'your_jwt_secret', {
        expiresIn: '1h',
      });
  
      return { token, user };
    },

    createUser: async (_, { username, email, password, role }) => {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ username, email, password: hashedPassword, role });
      return await user.save();
    },

    updateUser: async (_, { id, status, role }) => {
      return await User.findByIdAndUpdate(id, { status, role }, { new: true });
    },

    deleteUser: async (_, { id }) => {
      await User.findByIdAndDelete(id);
      return "User deleted";
    },

    createPost: async (_, { title, description, author }) => {
      if (!title || !description || !author) {
        throw new Error('Title, description, and author are required.');
      }
    
      const user = await User.findById(author);
      if (!user) {
        throw new Error('Author not found');
      }

      const post = new Post({
        title,
        description,
        author: user._id,
      });

      const savedPost = await post.save();
      const populatedPost = await Post.findById(savedPost._id).populate('author');

      return populatedPost;
    },

    updatePost: async (_, { id, title, description, media }, { user }) => {
      // Check if user is authenticated
      if (!user) {
        throw new Error('Not authenticated');
      }

      // Fetch the post
      const post = await Post.findById(id).populate('author');

      // Check if the post exists
      if (!post) {
        throw new Error('Post not found');
      }

      // Allow update if the user is admin or the author of the post
      if (user.role !== 'admin' && post.author.id !== user.userId) {
        throw new Error('Not authorized');
      }

      // Proceed with the update
      return await Post.findByIdAndUpdate(id, { title, description, media }, { new: true });
    },

    deletePost: async (_, { id }, { user }) => {
      // Check if user is authenticated
      if (!user) {
        throw new Error('Not authenticated');
      }

      // Fetch the post
      const post = await Post.findById(id).populate('author');

      // Check if the post exists
      if (!post) {
        throw new Error('Post not found');
      }

      // Allow delete if the user is admin or the author of the post
      if (user.role !== 'admin' && post.author.id !== user.userId) {
        throw new Error('Not authorized');
      }

      // Proceed with the delete
      await Post.findByIdAndDelete(id);
      return "Post deleted";
    },
  },
};

module.exports = resolvers;

