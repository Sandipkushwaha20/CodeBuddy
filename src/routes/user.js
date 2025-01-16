const express = require("express");
const userAuth = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const userRouter = express.Router();

userRouter.use("/", userAuth);

const USER_SAFE_DATA = "firstName lastName age about photoUrl skills";
//get all the pending request for the loggedIn user
userRouter.get("/user/requests/received", async (req, res) => {
  try {
    const loggedInUser = req.user;

    const receivedRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate(
      "fromUserId", 
      USER_SAFE_DATA
    );
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

userRouter.get("/user/requests/sent", async (req, res) => {
  try {
    const loggedInUser = req.user;

    const sentRequests = await ConnectionRequest.find({
      fromUserId: loggedInUser._id,
      status: "interested",
    }).populate(
      "toUserId", 
      USER_SAFE_DATA
    );
    // .populate("fromUserId", ["firstName", "lastName"]) //=> another way to write the above populate

    // console.log("All:  ", connectionRequests);

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

userRouter.get("/user/connections", async(req , res) =>{
  try{
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      $or: [
        {toUserId: loggedInUser._id, status: "accepted"},
        {fromUserId: loggedInUser._id, status: "accepted"}
      ]
    }).populate(
      "fromUserId", USER_SAFE_DATA
    ).populate(
      "toUserId", USER_SAFE_DATA
    )

    //We cann't directly compare mongoDB ID's so in the following code first convert into string then compare
    const data = connectionRequests.map((row)=>{
      if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
        return row.toUserId;
      }
      return row.fromUserId;
    });

    return res.status(200).json({
      success: true,
      message: "All connections fetches successfully.",
      data: data
    })
  }catch(err){
    return res.status(500).json({
      success: false,
      message: "Error while fetching connection.",
      data: allConnections
    })
  }
})
module.exports = userRouter;
