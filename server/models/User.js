const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');

// Define the Book schema (if not already defined)
const bookSchema = new Schema({
  // ... Book schema fields ...
});

// Define the User schema
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+@.+\..+/, 'Must use a valid email address'],
    },
    password: {
      type: String,
      required: true,
    },
    savedBooks: [bookSchema], // savedBooks as an array of books
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);

// Hash user password before saving
userSchema.pre('save', async function (next) {
  if (this.isNew || this.isModified('password')) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }

  next();
});

userSchema.methods.isCorrectPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};


// Virtual field for bookCount
userSchema.virtual('bookCount').get(function () {
  return this.savedBooks.length;
});

// Create the User model
const User = model('User', userSchema);

module.exports = User;
