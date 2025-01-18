const express = require("express");
const userAuth = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const userRouter = express.Router();

userRouter.use(userAuth);

const USER_SAFE_DATA = "firstName lastName age about photoUrl skills";
//get all the pending request for the loggedIn user
userRouter.get("/requests/received", async (req, res) => {
  try {
    const loggedInUser = req.user;

    const receivedRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);

    if (receivedRequests.length == 0) {
      return res.status(200).json({
        success: true,
        message: "You haven't received any requests.",
      });
    }
    // .populate("fromUserId", ["firstName", "lastName"]) //=> another way to write the above populate

    // console.log("All:  ", connectionRequests);

    return res.status(200).json({
      success: true,
      message: "All received requests fetches successfully.",
      data: receivedRequests,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error while fetching data for received requests: " + err,
    });
  }
});

userRouter.get("/requests/sent", async (req, res) => {
  try {
    const loggedInUser = req.user;

    const sentRequests = await ConnectionRequest.find({
      fromUserId: loggedInUser._id,
      status: "interested",
    }).populate("toUserId", USER_SAFE_DATA);
    // .populate("fromUserId", ["firstName", "lastName"]) //=> another way to write the above populate

    // console.log("All:  ", connectionRequests);

    if (sentRequests.length == 0) {
      return res.status(200).json({
        success: true,
        message: "You haven't sent any requests which are pending to accept.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "All sent requests fetches successfully.",
      data: sentRequests,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error while fetching data for sent requests: " + err,
    });
  }
});

userRouter.get("/connections", async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    //We cann't directly compare mongoDB ID's so in the following code first convert into string then compare
    const data = connectionRequests.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

    if (data.length == 0) {
      return res.status(200).json({
        success: true,
        message: "You are not connected with any users.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "All connections fetches successfully.",
      data: data,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error while fetching connection.",
      data: allConnections,
    });
  }
});

userRouter.get("/feed", async (req, res) => {
  try {
    // 0. find loggedIn user
    const loggedInUser = req.user;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;
    // 1. find all connection related to loggedIn user
    const connectionRequest = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    // 2. collect all the users which are not connected to LoggedIn user and also excluding loggedIn user
    const hideUsersFromFeed = new Set();
    connectionRequest.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });

    // console.log(hideUsersFromFeed);

    const feedUsers = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    }).select(USER_SAFE_DATA)
    .skip(skip)
    .limit(limit);

    // if (feedUsers.length == 0) {
    //   return res.status(200).json({
    //     success: true,
    //     message: "Now there are no users left for you to send requests.",
    //   });
    // }

    return res.status(200).json({
      success: true,
      message: "Feed users fetches successfully.",
      data: feedUsers,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error while fetching data for feed API.",
    });
  }
});

module.exports = userRouter;
