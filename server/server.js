const express = require('express');
const fileUpload = require('express-fileupload');
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
app.use(fileUpload());
const db = mysql.createConnection({
  host: 'Panda',
  user: 'Panda',
  password: 'panda',
  database: 'alumni',
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

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.post('/api/login', passport.authenticate('userLocal', { session: false }), (req, res) => {
  const token = jwt.sign({ id: req.user.id }, jwtOptions.secretOrKey);
  res.json({ token });
});

// Passport configuration
passport.use(
  'userLocal',
  new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    db.query('SELECT * FROM admin WHERE Admin_id = ? OR Inst_id = ?', [email, email], (err, results) => {
      if (err) return done(err);

      if (results.length === 0) {
        return done(null, false, { message: 'Incorrect email or password' });
      }

      const user = results[0];
      if (!user.password) {
        console.log('User has no password:', user);
        return done(null, false, { message: 'Incorrect email or password' });
      }

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

// API to Alumni login
app.post('/api/alumnilogin', passport.authenticate('alumniLocal', { session: false }), (req, res) => {
  const token = jwt.sign({ id: req.user.id }, jwtOptions.secretOrKey);
  res.json({ token });
});
app.delete("/deletealumni", (req, res) => {
  const animalId = req.body.id;
  const deleteQuery = "DELETE FROM alumni WHERE id = ?";

  db.query(deleteQuery, [animalId], (error, results) => {
    if (error) {
      console.error("Error deleting alumni:", error);
      res.status(500).json({ error: "Failed to delete alumni." });
    } else {
      console.log("Alumni deleted successfully.");
      res.status(200).json({ message: "ALumni deleted successfully." });
    }
  });
});
passport.use(
  'alumniLocal',
  new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    db.query('SELECT * FROM user WHERE user_id = ? OR email = ?', [email, email], (err, results) => {
      if (err) return done(err);

      if (results.length === 0) {
        return done(null, false, { message: 'Incorrect email or password' });
      }

      const user = results[0];

      if (!user.password) {
        console.log('User has no password:', user);
        return done(null, false, { message: 'Incorrect email or password' });
      }

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
  secretOrKey:'panda2347',
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};
// ... (existing code)




// API to register a new user
app.post('/api/register', (req, res) => {
  const { username, name, email, password } = req.body;

  // Hash the password before storing it
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) throw err;

    const insertQuery = `INSERT INTO user (user_id, name, email ,password) VALUES (?, ?, ?, ?)`;
    db.query(insertQuery, [username, name, email, hash], (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: 'An error occurred during registration', error: err });
      } else {
        console.log('You have successfully registered');
        res.json({ message: 'You have successfully registered' });
      }
    })
})});


// API to register a new admin
app.post('/api/adminregister', (req, res) => {
  const { username, name, instid, phnum, email, notify, password } = req.body;

  // Hash the password before storing it
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) throw err;

    const insertQuery = 'INSERT INTO admin (Admin_id, name, Inst_id, Email, verifier, notifications, password) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(insertQuery, [username, name, instid, phnum, email, notify, hash], (err) => {
      if (err) {
        res.status(500).json({ message: 'An error occurred during registration' });
      } else {
        console.log('You have successfully registered');
        res.json({ message: 'You have successfully registered' });
      }
    });
  });
});


// API to store alumni details
app.post('/submitForm', (req, res) => {
  const {
    user_id,
    first_name,
    last_name,
    dob,
    mother,
    father,
    phone,
    instid,
    address,
    usn,
    grad,
    tc,
    mode,
    admd,
    Course,
  } = req.body;

  
  const verification_status = 'pending';

  const sql = `
    INSERT INTO ALUMNI (user_id, Name, dob, mothername, fathername, phone, Inst_id, address, USN, graduation_date,  TC_received, course, admission_mode, admission_date, verification_status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?,  ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [
    user_id,
    first_name + ' ' + last_name,
    dob,
    mother,
    father,
    phone,
    instid,
    address,
    usn,
    grad,
    tc,
    Course,
    mode,
    admd,
    verification_status
  ], (err, result) => {
    if (err) {
      console.error('Error executing query: ' + err.stack);
      res.status(500).send(`Internal Server Error: ${err.message}`);
      return;
    }

    console.log('Record inserted successfully');
    res.status(200).json({ message: 'Record inserted successfully' });
  });
});


app.get('/api/admin', (req, res) => {
  // Use the pool to execute a query
  db.query(`SELECT * FROM admin`, (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(results);
    }
  });
});
app.put('/api/update/:id', (req, res) => {
  const { id } = req.params; // Get id from request parameters

  const query = `UPDATE alumni SET verification_status = 'verified' WHERE id = ?`;
  db.query(query, [id], (error, results) => {
    if (error) {
      console.error('Error updating alumni:', error);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    res.json({ message: 'Alumni updated successfully' });
  });
});

app.post('/api/job', (req, res) => {
  const {user_id, name, admin_id, accomplishments, experiences, current_job, company_name, web_profile} = req.body;

  if (!user_id || !name || !admin_id || !accomplishments || !experiences || !current_job || !company_name || !web_profile) {
    return res.status(400).json({ message: 'Required field is missing' });
  }
  // Use mv() to place file on the server
 
    const insertQuery = 'INSERT INTO career (user_id, admin_id, name, accomplishments, experiences, current_job, company_name, web_profile) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    
    db.query(insertQuery, [user_id, admin_id, name, accomplishments, experiences, current_job, company_name, web_profile], (err,result) => {
      if (err) {
        return res.status(500).json({ message: 'An error occurred during registration' });
      } else {
        console.log('You have successfully registered');
        return res.json({ message: 'You have successfully registered' });
      }
    });

});

app.delete("/deletecareer", (req, res) => {
  const animalId = req.body.id;
  const deleteQuery = "DELETE FROM admin WHERE id = ?";

  db.query(deleteQuery, [animalId], (error, results) => {
    if (error) {
      console.error("Error deleting admin:", error);
      res.status(500).json({ error: "Failed to delete admin." });
    } else {
      console.log("Admin deleted successfully.");
      res.status(200).json({ message: "Admin deleted successfully." });
    }
  });
});

app.get('/api/career', (req, res) => {
  // Use the pool to execute a query
  db.query(`SELECT * FROM career`, (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(results);
    }
  });
});
app.get('/api/alumni/:id', (req, res) => {
  const id = req.params.id;
  const query = 'SELECT * FROM career WHERE user_id = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error fetching data:', err);
      res.status(500).json({ message: 'Failed to fetch data' });
      return;
    }
    if (result.length === 0) {
      res.status(404).json({ message: 'Alumni not found' });
      return;
    }
    res.json(result[0]); // Send the fetched data back to the client
  });
});
app.get('/api/admin/:id', (req, res) => {
  const id = req.params.id;
  const query = 'SELECT * FROM admin WHERE admin_id = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error fetching data:', err);
      res.status(500).json({ message: 'Failed to fetch data' });
      return;
    }
    if (result.length === 0) {
      res.status(404).json({ message: 'Alumni not found' });
      return;
    }
    res.json(result[0]); // Send the fetched data back to the client
  });
});

// PUT route to update data
app.put('/api/alumni/:id', (req, res) => {
  const id = req.params.id;
  const formData = req.body;
  const query = 'UPDATE career SET  admin_id = ?, accomplishments = ?, experiences = ?, current_job = ?, company_name = ?, web_profile = ? WHERE id = ?';
  const values = [formData.admin_id, formData.accomplishments, formData.experiences, formData.current_job, formData.company_name, formData.web_profile, id];
  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Error updating data:', err);
      res.status(500).json({ message: 'Failed to update data' });
      return;
    }
    console.log('Data updated successfully');
    res.json({ message: 'Data updated successfully' });
  });
});
// API endpoint to store an event

app.post('/addAnimals', (req, res) => {
  const { animalName, feedNumber, cageNumber,   description,imageURL} = req.body;
  const sql = 'INSERT INTO event (title, location, date, description,image) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [animalName,feedNumber,  cageNumber, description,imageURL], (err, result) => {
    if (err) {
      console.error('Error adding Event:', err);
      res.status(500).json({ error: 'Error adding Event' });
      return;
    }
    console.log('Event added successfully');
    res.json({ message: 'Event added successfully' });
  });
});
app.get('/animals', (req, res) => {
  const query = 'SELECT * FROM event';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching events from the database:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(results);
    }
  });
});
app.delete("/deletevent", (req, res) => {
  const animalId = req.body.id;
  const deleteQuery = "DELETE FROM event WHERE id = ?";

  db.query(deleteQuery, [animalId], (error, results) => {
    if (error) {
      console.error("Error deleting event:", error);
      res.status(500).json({ error: "Failed to delete event." });
    } else {
      console.log("Event deleted successfully.");
      res.status(200).json({ message: "Admin deleted successfully." });
    }
  });
});