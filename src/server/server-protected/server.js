const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const admin = require("firebase-admin");
const { SecretManagerServiceClient } = require("@google-cloud/secret-manager");

require("dotenv").config();
admin.initializeApp();

const app = express();

const corsOptions = {
  origin: ["http://localhost:3000", "https://resumancy.com"],
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

// Global middleware to attach secrets
app.use(async (req, res, next) => {
  try {
    req.secrets = {
      GPT_API_KEY: await getSecret("GPT_API_KEY"),
      STRIPE_KEY: await getSecret("STRIPE_KEY")
    };
    next();
  } catch (error) {
    console.error("Error retrieving secrets:", error);
    return res.status(500).json({
      error: "Internal Server Error: Unable to fetch secrets"
    });
  }
});

// Public route (health check)
app.get("/", (req, res) => res.send("🔒 Protected API Server is live!"));

// Authentication middleware for protected routes
function requireAuth(req, res, next) {
  // Allow OPTIONS (preflight) requests without authentication
  if (req.method === "OPTIONS") return next();

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.error("Missing or malformed Authorization header:", req.headers.authorization);
    return res.status(401).json({
      error: "Unauthorized",
      details: "Missing or malformed Authorization header"
    });
  }

  const idToken = authHeader.split("Bearer ")[1];
  admin
    .auth()
    .verifyIdToken(idToken)
    .then(decodedToken => {
      req.user = decodedToken;
      next();
    })
    .catch(error => {
      console.error("Token verification error:", error);
      return res.status(403).json({
        error: "Invalid or expired token",
        details: error.message
      });
    });
}

// Apply authentication middleware to all protected routes below this line
app.use(requireAuth);

// Mount protected route modules
const limitedRoutes = require("./limitedFunction");
const tailoredResumeRoutes = require("./generateTailoredResume");
const coverLetterRoutes = require("./generateCoverLetter");
const gapAnalysisRoutes = require("./generateGapAnalysisWithRetry");
const createStripeCustomer = require("./createStripeCustomer");
const createStripePortalSession = require("./createStripePortalSession");
const deleteUserAccount = require("./deleteUserAccount");
const generateBaseResume = require("./generateBaseResume");

app.use("/limited-function", limitedRoutes);
app.use("/generate-tailored-resume", tailoredResumeRoutes);
app.use("/generate-cover-letter", coverLetterRoutes);
app.use("/generate-gap-analysis", gapAnalysisRoutes);
app.use("/create-stripe-customer", createStripeCustomer);
app.use("/create-stripe-portal-session", createStripePortalSession);
app.use("/delete-user-account", deleteUserAccount);
app.use("/generate-base-resume", generateBaseResume);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () =>
  console.log(`🔒 Protected API Server running on port ${PORT}`)
);

// Helper to fetch secrets
async function getSecret(secretName) {
  const client = new SecretManagerServiceClient();
  const [version] = await client.accessSecretVersion({
    name: `projects/resumancy/secrets/${secretName}/versions/latest`
  });
  return version.payload.data.toString();
}
