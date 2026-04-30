const router = require("express").Router()
const protectRoute = require("../middlewares/auth.middleware")
const { sendFriendRequest, respondToFriendRequest, getFriendsList, getPendingRequests, friendsTaskView, removeFriend } = require("../controllers/friends.controller")

router.post("/request", protectRoute, sendFriendRequest)
router.post("/respond", protectRoute, respondToFriendRequest)
router.get("/list", protectRoute, getFriendsList)
router.get("/pending", protectRoute, getPendingRequests)
router.get("/tasks/:friendId", protectRoute, friendsTaskView)
router.delete("/remove/:friendId", protectRoute, removeFriend)

module.exports = router