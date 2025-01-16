const express = require("express");
const userAuth = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const userRouter = express.Router();

userRouter.use("/", userAuth);
//get all the pending request for the loggedIn user
userRouter.get("/user/requests/received", async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate(
      "fromUserId", 
      "firstName lastName age about photoUrl skills"
    );
    // .populate("fromUserId", ["firstName", "lastName"]) //=> another way to write the above populate

    // console.log("All:  ", connectionRequests);

    return res.status(200).json({
      success: true,
      message: "All requests fetches successfully.",
      data: connectionRequests,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error while fetching data for all requests: " + err,
    });
  }
});

module.exports = userRouter;
