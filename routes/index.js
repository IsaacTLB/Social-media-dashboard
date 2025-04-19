// routes/index.js
import express from "express";
import authRoutes from './auth.js'; // Import auth routes
import { Verify, VerifyRole } from "../middleware/verify.js";
import NodeCache from "node-cache";
import {
  fetchFacebookData,
  fetchTwitterData,
  fetchInstagramData,
  fetchYouTubeData,
} from "../utils/fetchdata.js";

const cache = new NodeCache({ stdTTL: 3600 }); // Cache expires in 1 hour

const Router = (app) => {
  // Mount Auth Routes
  app.use(authRoutes);

  // Landing Page
  app.get("/v1", (req, res) => {
    try {
      res.render("landing");
    } catch (err) {
      res.status(500).send("Internal Server Error");
    }
  });

  // API Homepage
  app.get("/v1/api", (req, res) => {
    try {
      res.status(200).json({
        status: "success",
        data: [],
        message: "Welcome to our API homepage!",
      });
    } catch (err) {
      res.status(500).json({
        status: "error",
        message: "Internal Server Error",
      });
    }
  });

  // Protected User Dashboard (with cache)
  app.get("/v1/user", Verify, async (req, res) => {
    try {
      let data = cache.get("socialData");

      if (!data) {
        const [facebook, twitter, instagram, youtube] = await Promise.all([
          fetchFacebookData(),
          fetchTwitterData(),
          fetchInstagramData(),
          fetchYouTubeData(),
        ]);
        data = { facebook, twitter, instagram, youtube };
        cache.set("socialData", data);
      }

      res.render("index", { data, user: req.session.user });
    } catch (err) {
      console.error("Error fetching social data:", err);
      res.status(500).send("Error fetching data");
    }
  });

  // Admin Portal (protected with role-based access)
  app.get("/v1/admin", Verify, VerifyRole, (req, res) => {
    res.status(200).json({
      status: "success",
      message: "Welcome to the Admin portal!",
    });
  });
};

export default Router;
