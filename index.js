// index.js

// Required modules
// autentication middleware
const { isAuthenticated } = require("./middleware/authentication");
const express = require("express");
const path = require("path");
const session = require("express-session");
const bcrypt = require('bcrypt');
const { maxHeaderSize } = require("http");
const { isAscii } = require("buffer");

const app = express();
const PORT = 3000;


app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(session({
    secret: "replace_this_with_a_secure_key",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 1 day
    }
}));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Hash the default passwords on startup
const hashedAdminPassword = bcrypt.hashSync('adminPassword', 10);
const hashedUserPassword = bcrypt.hashSync('userPassword', 10);

const USERS = [
    {
        id: 1,
        username: "AdminUser",
        email: "admin@example.com",
        password: hashedAdminPassword, // use the hashed password variable
        role: "admin",
        hasRSVPed: false,
        rsvpTime: null
    },

    {
        id: 2,
        username: "RegularUser",
        email: "user@example.com",
        password: hashedUserPassword,
        role: "user", // Regular user
        hasRSVPed: false,
        rsvpTime: null
    },
];

let nextUserId = 3;

//Note: These are (probably) not all the required routes, nor are the ones present all completed.
//But they are a decent starting point for the routes you'll probably need

// GET / - Render index page or redirect to landing if logged in
app.get("/", (request, response) => {
    if (request.session.userId) {
        return response.redirect("/event");
    }
    response.render("index");
});



// GET /login - Render login form
app.get("/login", (req, res) => {
    res.render("login", {
        error: null,
        success: req.query.success || null
    });
});

// POST /login - Handle login
app.post("/login", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.render("login", { error: "Email and password are required." });
    }

    // Find user by email
    const user = USERS.find(u => u.email === email);
    if (!user) {
        return res.render("login", { 
            error: "Invalid email or password.",
            success: null // always define success
         });
    }

    // Compare password with bcrypt
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
        // When re-rendering after error
        return res.render("login", { 
            error: "Invalid email or password.",
            success: null // always define success
        });

    }

    // Set session variables
    req.session.userId = user.id;
    req.session.username = user.username;
    req.session.role = user.role;

    // Redirect to event page
    res.redirect("/event");
});

// GET /signup - Render signup form
app.get("/signup", (request, response) => {
    if (request.session.userId) {
        return response.redirect("/event");
    }
    response.render("signup", { error: null }); // <-- pass error=null
});

// POST /signup - Allows a user to signup
app.post("/signup", (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.render("signup", { error: "All fields are required." });
    }

    if (password.length < 8) {
        return res.render("signup", { error: "Password must be at least 8 characters long." });
    }

    if (USERS.find(u => u.email === email)) {
        return res.render("signup", { error: "Email already exists." });
    }

    if (USERS.find(u => u.username === username)) {
        return res.render("signup", { error: "Username already exists." });
    }

    try {
        const hashedPassword = bcrypt.hashSync(password, 10);
        const newUser = {
            id: nextUserId++,
            username,
            email,
            password: hashedPassword,
            role: "user",
            hasRSVPed: false,
            rsvpTime: null
        };

        USERS.push(newUser);

        // Only ONE redirect!
        return res.redirect("/login?success=Account created successfully!");
    } catch (err) {
        console.error(err);
        return res.render("signup", { error: "An error occurred. Please try again." });
    }
});

// GET /event - Render event page
app.get("/event", isAuthenticated, (req, res) => {
    const user = USERS.find(u => u.id === req.session.userId);

    if (!user) {
        return res.redirect("/login");
    }

    // If admin, pass USERS to the template
    res.render("landing", {
        user,
        USERS // needed for admin view
    });
});


// POST /event - Handles allowing someone to RSVP to the event
app.post("/event", isAuthenticated, (req, res) => {
    const user = USERS.find(u => u.id === req.session.userId);
    
    if (!user) return res.redirect("/login");

    if (!user.hasRSVPed) {
        user.hasRSVPed = true;
        user.rsvpTime = new Date().toISOString();
    }

    res.redirect("/event"); // will now render landing.ejs
});

// POST /logout - Logs the user out
app.post("/logout", (request, response) => {
    request.session.destroy(err => {
        if (err) {
            console.error("Logout error: ", err);
            return response.redirect("/event");
        }
        response.redirect("/");
    });
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Default users:
    Admin - Email: admin@example.com
    User - Email: user@example.com`);
});
