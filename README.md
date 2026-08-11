# Social Media Dashboard

A small server-rendered dashboard built with Node.js, Express and EJS that provides the foundation for aggregating social media metrics. The project includes server routes, EJS views for a landing [...] 

## Key features
- Server-rendered pages using EJS templates (views/landing.ejs, views/index.ejs, views/login.ejs, views/register.ejs)
- Basic authentication UI routes (login, signup, logout)
- Placeholder utilities for fetching platform data (imports for fetchFacebookData, fetchTwitterData, fetchInstagramData, fetchYouTubeData are present in app.js and implemented under utils/)
- Session handling with express-session and cookie-parser
- Static assets served from public/ (style.css and icons under public/images/)
- MongoDB connection via mongoose (app expects a MONGO_URI environment variable)

## Technologies used
- Node.js (Express)
- EJS (server-side templating)
- MongoDB (via Mongoose)
- CSS for styling (public/style.css)
- Express middleware: express-session, cookie-parser, cors

## Project structure
Top-level files and directories (relevant entries):

```
.
├─ app.js                   # Express application entry (ES module imports)
├─ db.js                    # Database helper/connection (small helper file)
├─ package.json             # Node project manifest (dependencies in repository)
├─ package-lock.json
├─ public/
│  ├─ style.css             # Global stylesheet
│  └─ images/               # Favicons and social icon SVGs
├─ routes/                  # Route definitions (mounted from app.js)
├─ utils/                   # Utility modules (fetchdata.js referenced from app.js)
├─ views/
│  ├─ landing.ejs           # Landing / marketing page
│  ├─ index.ejs             # Dashboard view (aggregated data rendering)
│  ├─ login.ejs             # Login form view
│  └─ register.ejs          # Signup form view
├─ controllers/             # (present as a folder for controllers)
├─ models/                  # (present as a folder for data models)
├─ middleware/              # (present as a folder for middleware)
└─ README.md
```

How it fits together:
- app.js is the application entry that sets up middleware, static assets, view engine (EJS), mounts routes (from routes/), and connects to MongoDB using mongoose.
- Views in views/ are rendered by route handlers and consume data provided by controllers / route handlers.
- utils/fetchdata.js (imported from app.js) contains per-platform fetch functions referenced by a commented dashboard route in app.js; these provide a clear integration point for fetching and norm[...]
- public/ holds the stylesheet and icons used by the EJS templates.

## Design / development highlights
- Server-side rendering with EJS keeps markup and styling in separate templates and CSS files (views/ + public/style.css).
- Session support and cookie parsing are configured so login/signup flows can persist user sessions (express-session, cookie-parser).
- The codebase separates concerns: routes, controllers, models, middleware and utilities are present as distinct directories to make future development and testing easier.
- The app contains a commented example in app.js that shows an approach to aggregating data from multiple platforms and rendering them into the dashboard view.

## Responsive design
- The project uses a single stylesheet (public/style.css). The EJS templates and CSS are structured for a simple responsive layout (responsive rules are implemented in the stylesheet). To confirm[...]

## Running the project locally

Prerequisites:
- Node.js and npm installed
- A running MongoDB instance (or a MongoDB connection string)

1. Clone the repository
```bash
git clone https://github.com/IsaacTLB/Social-media-dashboard.git
cd Social-media-dashboard
```

2. Install dependencies
```bash
npm install
```

3. Set environment variables (example .env entries)
Create a `.env` file in the project root (app.js uses dotenv). At minimum set:
```
MONGO_URI=<your-mongodb-connection-string>
SESSION_SECRET=<your-session-secret>
PORT=3000        # optional, defaults to 3000
```

4. Start the server
```bash
node app.js
```

5. Open the app in a browser:
- Landing page: http://localhost:3000/v1
- Login: http://localhost:3000/v1/login
- Signup: http://localhost:3000/v1/signup

Notes:
- app.js uses ES module-style imports. Ensure your Node version supports ES modules or that "type": "module" is present in package.json.
- The dashboard route in app.js that aggregates social data is currently commented out; enable and adapt it after implementing the fetch utilities and providing appropriate API credentials.

## How to customize
- Views: Edit templates in views/ (landing.ejs, index.ejs, login.ejs, register.ejs) to change page structure or copy the pages for additional routes.
- Styling: Update public/style.css to modify layout, colors, spacing and responsive rules.
- Data integration: Implement or modify utils/fetchdata.js functions (fetchFacebookData, fetchTwitterData, fetchInstagramData, fetchYouTubeData) to connect to real APIs and normalize the returned[...]
- Routes & controllers: Add new route files under routes/ and corresponding controller functions in controllers/.
- Models: Define Mongoose schemas under models/ and use db.js to centralize database utilities.

## Screenshots / Preview
A live demo URL is not included in this repository. If you want to preview the project locally, follow the steps in "Running the project locally".

[Live Demo](#)

## Credits / Attribution
- Icons and images are stored in public/images/ (favicon-32x32.png and several social icon SVGs). If any of these assets require attribution, update this section with the appropriate source and l[...]
- Project authored by the repository owner (see repository metadata). No external template or third-party design license is bundled in the repo files.

## License
No license file was found in the repository. If you intend to reuse or distribute this code, add a LICENSE file to specify terms (for example MIT, Apache-2.0, etc.). Until a license is added, usa[...]

