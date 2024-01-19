const express = require("express")
const isAuthenticated = require("../middlewares/isAuthenticated");
const openAIController = require("../controllers/openAIController");
const checkApiRequestLimit = require("../middlewares/checkApiRequestLimit");
const openAIRouter = express.Router();


openAIRouter.post(
    "/generate-content",
    isAuthenticated,
    checkApiRequestLimit,
    openAIController,
    );

module.exports = openAIRouter; 
// const express = require("express");
// const openAIController = require("../controllers/openAIController.js");
// const router = express.Router();

// router.route("/generate-content").post(openAIController);

// module.exports = router;
