const client = require('../../config/imagekit');
const userModel = require('../../models/user.model');
const taskModel = require('../../models/task.model');
const bcrypt = require('bcrypt');
const uploadPfp = async (req, res) => {
    try {

        if (!req.file) {
            return res.status(400).json({
                message: "No file uploaded"
            });
        }

        // Upload file to ImageKit
        const uploadFile = async (buffer) => {
            const response = await client.files.upload({
                file: buffer.toString("base64"),
                fileName: `profile_${Date.now()}.jpg`,
                folder: "/taskManager/users"
            });

            return response;
        };

        const currentUser = await userModel.findById(req.user.id);

        // Delete old profile picture if exists
        if (currentUser.profile_picture?.fileId) {
            try {
                await client.files.delete(currentUser.profile_picture.fileId);
            } catch (err) {
                console.log("Old image deletion failed:", err.message);
            }
        }

        // Upload new image
        const image = await uploadFile(req.file.buffer);

        // Update user
        const updatedUser = await userModel.findByIdAndUpdate(
            req.user.id,
            {
                profile_picture: {
                    url: image.url,
                    fileId: image.fileId
                }
            },
            { new: true }
        );

        return res.status(201).json({
            message: "Profile picture uploaded successfully",
            user: updatedUser
        });

    } catch (error) {
        console.log("Image not uploaded:", error);

        return res.status(500).json({
            message: "Image upload failed",
            error: error.message
        });
    }
};
const phone = async (req, res) => {
    try {
        const user = await userModel.findOneAndUpdate({
            _id: req.user.id
        }, {
            phone: req.body.phone
        })
        return res.status(201).json({
            message: "phone no. added successfully",
            user
        })
    }
    catch (error) {
        console.log("Phone no. not added.\n", error);
        return res.status(500).json({
            message: "Phone no. not added",
            error
        })
    }
}

async function getuserDetails(req, res) {
    try {
        if (!req.user.id) {
            return res.status(401).json({
                message: "User not authenticated"
            })
        }
        const user = await userModel.findById(req.user.id).select("-password")
        const status = await taskModel.aggregate([
            { $match: { user: req.user.id } },
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            }
        ])
        return res.status(200).json({
            message: "User details fetched successfully",
            user,
            status
        })
    }
    catch (error) {
        console.log("User details not fetched.\n", error);
        return res.status(500).json({
            message: "User details not fetched",
            error
        })
    }
}

async function updateName(req, res) {
    try {
        const user = await userModel.findOneAndUpdate({
            _id: req.user.id
        }, {
            name: req.body.name
        }, { new: true }).select("-password")
        return res.status(201).json({
            message: "name updated successfully",
            user
        })
    }
    catch (error) {
        console.log("name not updated.\n", error);
        return res.status(500).json({
            message: "name not updated",
            error
        })
    }
}

async function changeEmail(req, res) {
    try {
        const user = await userModel.findOneAndUpdate({
            _id: req.user.id
        }, {
            email: req.body.email
        }, { new: true }).select("-password")
        return res.status(201).json({
            message: "email updated successfully",
            user
        })
    }
    catch (error) {
        console.log("email not updated.\n", error);
        return res.status(500).json({
            message: "email not updated",
            error
        })
    }
}

async function updatePassword(req, res) {
    try {
        const user = await userModel.findOneAndUpdate({
            _id: req.user.id
        }, {
            password: await bcrypt.hash(req.body.password, 10)
        }, { new: true }).select("-password")
        return res.status(201).json({
            message: "password updated successfully",
            user
        })
    }
    catch (error) {
        console.log("password not updated.\n", error);
        return res.status(500).json({
            message: "password not updated",
            error
        })
    }
}

async function searchUsers(req, res) {
    try {
        const query = req.query.q;
        if (!query) {
            return res.status(400).json({
                message: "Search query is required"
            });
        }

        const users = await userModel.find({
            name: { $regex: query, $options: 'i' },
            _id: { $ne: req.user.id }
        }).select("-password");
        
        return res.status(200).json({
            message: "Users fetched successfully",
            users
        });
    } catch (error) {
        console.log("User search failed.\n", error);
        return res.status(500).json({
            message: "User search failed",
            error
        });
    }
}

module.exports = { uploadPfp, phone, getuserDetails, updateName, changeEmail, updatePassword, searchUsers };