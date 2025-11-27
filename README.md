[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/P0d_vKNM)
# Event RSVP Portal

This is the starting point for the **Event RSVP Portal** assignment. The goal of this project is to create a simple web application where users can register, log in, and RSVP to a private event. Admins will be able to see who has RSVP’d, while regular users can only RSVP themselves.

For full project details, requirements, and grading criteria, refer to the [assignment sheet](https://menglishca.github.io/keyin-course-notes/fullstack/qaps/qap-3-makeup/).

## Setup Instructions
1. **Accept the GitHub Assignment** (link provided in the assignment sheet).

1. **Name your new repository** and choose its visibility (public or private).

1. Once your repository is created, **clone your new repo** to your local machine:
   ```bash
   git clone <your-new-repo-url>
   ```

1. Navigate into the project directory and install the necessary dependencies:
   ```bash
   cd <your-new-repo-name>
   npm install
   ```

1. **Run the app:**
   ```bash
   npm start
   ```
   This will start the server at `http://localhost:3000/`.

1. You can now begin working on your project, adding your own code and committing your changes as you go:
   ```bash
   git add .
   git commit -m "First commit"
   git push origin main
   ```

## Development Guidelines
1. **Authentication**:
   - Use `express-session` to manage login sessions.
   - Hash all passwords using `bcrypt` before storing them.
   - Authenticate users by comparing hashed passwords during login.

2. **Role-Based Access Control**:
   - All users should be able to RSVP to the event after logging in.
   - Admins can view the RSVP list (name and timestamp).
   - Regular users can only view their own RSVP status.

3. **Error Handling**:
   - Show appropriate error messages for failed registration, duplicate emails, or invalid login attempts.

4. **Security**:
   - Never store plaintext passwords.
   - Ensure users can’t access protected pages without logging in.

5. **Data Storage**:
   - Store users in an in-memory array. Persistent storage is not required for this assignment.

## Submission Guidelines
- Ensure the application runs correctly with `npm start`.
- Include all required functionality as outlined in the [assignment sheet](https://menglishca.github.io/keyin-course-notes/fullstack/qaps/qap-3-makeup/).

## Notes
- You may use additional npm packages to enhance your app if helpful, but avoid adding full frontend frameworks.
- All pages must be rendered using **EJS templates**.
- Focus on functionality, secure login, and clear user experience.