const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const port = 3000;

const db = mysql.createConnection({
  host: 'Panda',
  user: 'Panda',
  password: 'panda',
  database: 'alumini',
});

db.connect(err => {
  if (err) {
    console.error('Database connection failed: ' + err.stack);
    return;
  }
  console.log('Connected to database');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

// API to get all alumni
app.get('/api/alumni', (req, res) => {
  db.query('SELECT * FROM alumni', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// API to add a new alumni
app.post('/api/alumni', (req, res) => {
  const { name, graduation_year, major, email } = req.body;
  const insertQuery = `INSERT INTO alumni (name, graduation_year, major, email) VALUES (?, ?, ?, ?)`;
  db.query(insertQuery, [name, graduation_year, major, email], (err, results) => {
    if (err) throw err;
    res.json({ message: 'Alumni added successfully' });
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// ... (previous code)

// API to get a single alumni
app.get('/api/alumni/:id', (req, res) => {
  const alumniId = req.params.id;
  db.query('SELECT * FROM alumni WHERE id = ?', [alumniId], (err, results) => {
    if (err) throw err;
    if (results.length === 1) {
      res.json(results[0]);
    } else {
      res.status(404).json({ error: 'Alumni not found' });
    }
  });
});

// API to update an alumni
app.put('/api/alumni/:id', (req, res) => {
  const alumniId = req.params.id;
  const { name, graduation_year, major, email } = req.body;
  const updateQuery = `UPDATE alumni SET name = ?, graduation_year = ?, major = ?, email = ? WHERE id = ?`;
  db.query(updateQuery, [name, graduation_year, major, email, alumniId], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'An error occurred while updating the alumni' });
      return;
    }
    res.json({ message: 'Alumni updated successfully' });
  });
});

// API to delete an alumni
app.delete('/api/alumni/:id', (req, res) => {
  const alumniId = req.params.id;
  const deleteQuery = 'DELETE FROM alumni WHERE id = ?';
  db.query(deleteQuery, [alumniId], (err, results) => {
    if (err) throw err;
    res.json({ message: 'Alumni deleted successfully' });
  });
});

// ... (rest of the code)


// ... (existing code)

// Passport configuration
passport.use(
  new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    db.query('SELECT * FROM users WHERE username = ?', [email], (err, results) => {
      if (err) return done(err);

      if (results.length === 0) {
        return done(null, false, { message: 'Incorrect email or password' });
      }

      const user = results[0];

      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) return done(err);

        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false, { message: 'Incorrect email or password' });
        }
      });
    });
  })
);

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'panda2347', // Replace with a strong, random secret key
};

passport.use(
  new JwtStrategy(jwtOptions, (payload, done) => {
    db.query('SELECT * FROM users WHERE id = ?', [payload.id], (err, results) => {
      if (err) return done(err);

      if (results.length === 0) {
        return done(null, false);
      }

      const user = results[0];
      return done(null, user);
    });
  })
);

// Initialize passport
app.use(passport.initialize());

// Authentication middleware
const authenticate = passport.authenticate('local', { session: false });
const requireAuth = passport.authenticate('jwt', { session: false });

// ... (existing code)

// API to login
// ... (existing code)

// API to login
app.post('/api/login', authenticate, (req, res) => {
  const token = jwt.sign({ id: req.user.id }, jwtOptions.secretOrKey);
  res.json({ token });
});

// API to get current user (requires authentication)
app.get('/api/user', requireAuth, (req, res) => {
  res.json(req.user);
});

// ... (existing code)

// Serve the dashboard page
app.get('/dashboard', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, '../public/dashboard.html'));
});


// ... (existing code)
// API to register a new user
app.post('/api/register', (req, res) => {
  const { email, password } = req.body;

  // Hash the password before storing it
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) throw err;

    const insertQuery = `INSERT INTO users (username, password) VALUES (?, ?)`;
    db.query(insertQuery, [email, hash], (err, results) => {
      if (err) throw err;
      res.json({ message: 'User registered successfully' });
    });
  });
});
