import userModel from "../models/userModel.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cloudinary from '../config/cloudinary.js';
import User from "../models/userModel.js";

export const test = (req, res) => {
    return res.json({ message: "Note routes is working", id: req.user.id });
}

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({
                success: false,
                message: "User does not exist."
            });
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.json({ success: false, message: "Invalid email or password." });
        }

        const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: '2d' });
        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: 'none',
            secure: true
        });

        return res.json({ success: true, message: "LoggedIn successfully!", user });

    } catch (error) {
        res.json({
            success: false,
            message: error.message
        });
    }
}

export const register = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const user = await userModel.findOne({ email });
        if (user) {
            return res.json({ success: false, message: "User already exists." });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await userModel.create({
            name,
            email,
            password: hashedPassword
        });

        const token = jwt.sign({ id: newUser._id }, process.env.SECRET_KEY, { expiresIn: '2d' });
        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: 'none',
            secure: true
        });

        return res.json({ success: true, message: "User created successfully!", user: newUser });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

export const isAuthorised = async (req, res) => {
    try {
        if (!req.user) {
            return res.json({ success: false, message: "You are not authorised" });
        }
        const user = await userModel.findById(req.user.id).select("-password").populate("uploads").populate("downloads");
        return res.json({ success: true, user });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

export const logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            sameSite: 'lax'
        });
        console.log("logging out");
        res.json({ success: true, message: "Logout Successfully!" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export const downloadNote = async (req, res) => {
    try {
        const user = await userModel.findById(req.user.id);
        const { id } = req.body;
        console.log(id);

        if (user.downloads.includes(id)) {
            return res.json({ success: false, message: "Note already downloaded!" });
        }

        user.downloads.push(id);
        user.points -= 10;
        await user.save();
        return res.json({ success: true, message: "Note downloaded successfully!", user });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

export const updateUser = async (req, res) => {
    try {
        const { name, email, degree, college, branch, semester } = req.body;
        const file = req.file;
        console.log(file);

        let result = null;

        if (file) {
            result = await cloudinary.uploader.upload(file.path, {
                folder: 'note',
                resource_type: 'auto',
                access_mode: 'public',
            });
        }

        const url = result?.secure_url;

        console.log(url);

        const user = await userModel.findByIdAndUpdate(req.user.id, {
            name,
            email,
            degree,
            college,
            branch,
            semester,
            profileImg: url || ""
        }, { new: true });

        res.json({ success: true, message: "User updated successfully!", user });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export const temp = async (req, res) => {
    const result = await User.updateMany(
        { messages: { $exists: false } },  // users without messages field
        { $set: { messages: [] } }
      );
    res.json({ success: true, message: "Updated successfully!", result });
}

export const addMsg = async (req, res) => {
    const { messages } = req.body;
    const userId = req.user.id;
    

    try {
        
        const user = await userModel.findById(userId);
        messages.forEach((msg) => {
            user.messages.push(msg);
        })
        await user.save();
        res.json({ success: true, message: "Messages added successfully!", messages: user.messages });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export const clearMsg = async (req, res) => {
    const user = await userModel.findById(req.user.id);
    try {
        user.messages = [];
        await user.save();
        res.json({success : true, message : "Chat history cleared successfully"})
    } catch (error) {
        res.json({success : false, message : error.message});
    }
}
