**Alumni Tracking System**

Welcome to the Alumni Tracking System repository! This system is designed to help track alumni data efficiently. Follow the instructions below to set up and run the program.

**Requirements**
Before running the program, make sure you have the following dependencies installed:

express: Fast, unopinionated, minimalist web framework for Node.js
express-fileupload: Simple express middleware for uploading files
mysql2: MySQL client for Node.js
body-parser: Node.js body-parsing middleware
passport: Authentication middleware for Node.js
passport-local: Passport strategy for authenticating with a username and password
passport-jwt: Passport strategy for authenticating with a JSON Web Token (JWT)
bcrypt: Library to help hash passwords
jsonwebtoken: JSON Web Token implementation for Node.js
You can install these dependencies using npm:

**bash**
npm install express express-fileupload mysql2 body-parser passport passport-local passport-jwt bcrypt jsonwebtoken


**Getting Started**

**Follow these steps to run the program:**

**Configure Database: ** Change the SQL username, password, and database name in server/config/db.config.js to match your MySQL database credentials.

Run the Server: Open your terminal or command prompt, navigate to the project directory, and run the following command:
**
bash**
node server/server.js

Access the System: Once the server is running, visit http://localhost:3000 in your web browser to access the Alumni Tracking System.

**Contributing**

Contributions are welcome! If you have any suggestions, bug reports, or feature requests, please open an issue or submit a pull request.
