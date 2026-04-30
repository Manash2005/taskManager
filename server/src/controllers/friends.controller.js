const friendRequestModel = require("../../models/friendRequest.model");
const userModel = require("../../models/user.model");
const taskModel = require("../../models/task.model");

const sendFriendRequest = async (req, res) => {
    try {
        const { receiverId } = req.body;

        if (receiverId === req.user.id) {
            return res.status(400).json({ message: "You cannot send a friend request to yourself" });
        }

        const receiver = await userModel.findById(receiverId);
        if (!receiver) {
            return res.status(404).json({ message: "Receiver not found" });
        }

        // Check if already friends
        const currentUser = await userModel.findById(req.user.id);
        if (currentUser.friends.includes(receiverId)) {
            return res.status(400).json({ message: "Already friends with this user" });
        }

        // Check for existing pending request in either direction
        const existingRequest = await friendRequestModel.findOne({
            $or: [
                { sender: req.user.id, receiver: receiverId, status: "pending" },
                { sender: receiverId, receiver: req.user.id, status: "pending" }
            ]
        });

        if (existingRequest) {
            return res.status(400).json({ message: "Friend request already pending" });
        }

        const newRequest = new friendRequestModel({
            sender: req.user.id,
            receiver: receiverId
        });

        await newRequest.save();
        return res.status(201).json({ message: "Friend request sent successfully", request: newRequest });
    } catch (error) {
        console.error("Error sending friend request:", error);
        return res.status(500).json({ message: "Failed to send friend request", error: error.message });
    }
};

const respondToFriendRequest = async (req, res) => {
    try {
        const { requestId, action } = req.body; // action: "accepted" or "declined"

        if (!["accepted", "declined"].includes(action)) {
            return res.status(400).json({ message: "Invalid action. Use 'accepted' or 'declined'" });
        }

        const request = await friendRequestModel.findById(requestId);
        if (!request) {
            return res.status(404).json({ message: "Friend request not found" });
        }

        // Only the receiver can respond
        if (request.receiver.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized to respond to this request" });
        }

        if (request.status !== "pending") {
            return res.status(400).json({ message: "This request has already been responded to" });
        }

        request.status = action;
        await request.save();

        // If accepted, add each user to the other's friends array
        if (action === "accepted") {
            await userModel.findByIdAndUpdate(request.sender, {
                $addToSet: { friends: request.receiver }
            });
            await userModel.findByIdAndUpdate(request.receiver, {
                $addToSet: { friends: request.sender }
            });
        }

        return res.status(200).json({ message: `Friend request ${action}` });
    } catch (error) {
        console.error("Error responding to friend request:", error);
        return res.status(500).json({ message: "Failed to respond to friend request", error: error.message });
    }
};

const getPendingRequests = async (req, res) => {
    try {
        const requests = await friendRequestModel.find({ receiver: req.user.id, status: "pending" })
            .populate("sender", "name email profile_picture");
        return res.status(200).json({ message: "Friend requests fetched successfully", requests });
    } catch (error) {
        console.error("Error fetching friend requests:", error);
        return res.status(500).json({ message: "Failed to fetch friend requests", error: error.message });
    }
};

const getFriendsList = async (req, res) => {
    try {
        const user = await userModel.findById(req.user.id)
            .populate("friends", "name email profile_picture");
        return res.status(200).json({ message: "Friends list fetched successfully", friends: user.friends });
    } catch (error) {
        console.error("Error fetching friends list:", error);
        return res.status(500).json({ message: "Failed to fetch friends list", error: error.message });
    }
};

const friendsTaskView = async (req, res) => {
    try {
        const { friendId } = req.params;

        const isFriend = await friendRequestModel.findOne({
            $or: [
                { sender: req.user.id, receiver: friendId, status: "accepted" },
                { sender: friendId, receiver: req.user.id, status: "accepted" }
            ]
        });

        if (!isFriend) {
            return res.status(403).json({ message: "You are not friends with this user" });
        }

        const friend = await userModel.findById(friendId).select("name email profile_picture");
        const tasks = await taskModel.find({ user: friendId });
        return res.status(200).json({ message: "Friend's tasks fetched successfully", tasks, friend });
    } catch (error) {
        console.error("Error fetching friend's tasks:", error);
        return res.status(500).json({ message: "Failed to fetch friend's tasks", error: error.message });
    }
};

const removeFriend = async (req, res) => {
    try {
        const { friendId } = req.params;

        // Remove from both users' friends arrays
        await userModel.findByIdAndUpdate(req.user.id, {
            $pull: { friends: friendId }
        });
        await userModel.findByIdAndUpdate(friendId, {
            $pull: { friends: req.user.id }
        });

        // Delete the accepted friend request record
        await friendRequestModel.deleteOne({
            $or: [
                { sender: req.user.id, receiver: friendId, status: "accepted" },
                { sender: friendId, receiver: req.user.id, status: "accepted" }
            ]
        });

        return res.status(200).json({ message: "Friend removed successfully" });
    } catch (error) {
        console.error("Error removing friend:", error);
        return res.status(500).json({ message: "Failed to remove friend", error: error.message });
    }
};

module.exports = {
    sendFriendRequest,
    respondToFriendRequest,
    getPendingRequests,
    getFriendsList,
    friendsTaskView,
    removeFriend
};