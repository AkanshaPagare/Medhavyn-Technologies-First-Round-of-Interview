const express = require('express');
const passport = require('passport');
const session = require('express-session');
const { Sequelize } = require('sequelize');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const app = express();

// Create a Sequelize instance and connect to the MySQL database
const sequelize = new Sequelize('your-database-name', 'your-username', 'your-password', {
  host: 'localhost',
  dialect: 'mysql',
});

// Set up middleware
app.use(express.json());
app.use(
  session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Define a User model and schema using Sequelize
const User = sequelize.define('User', {
  googleId: {
    type: Sequelize.STRING,
    unique: true,
  },
  // Other user properties here
});

// Configure Google OAuth strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: 'your-google-client-id',
      clientSecret: 'your-google-client-secret',
      callbackURL: '/auth/google/callback',
    },
    (accessToken, refreshToken, profile, done) => {
      // Check if user exists in the database, or create a new user
      User.findOne({ where: { googleId: profile.id } })
        .then((existingUser) => {
          if (existingUser) {
            return done(null, existingUser);
          } else {
            return User.create({ googleId: profile.id }).then((newUser) => {
              return done(null, newUser);
            });
          }
        })
        .catch((err) => done(err));
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findByPk(id)
    .then((user) => done(null, user))
    .catch((err) => done(err));
});

// Define your API routes for GET and POST requests here

const port = process.env.PORT || 5000;
sequelize
  .sync()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => console.error('Error syncing database:', err));
