import { User } from "../models/User.js";

const registerUser = async (req, res) => {
    const { name, email, password, type } = req.body;

    try
    {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        const newUser = await User.create({
            name,
            email,
            password,
            type
        });

        res.status(200).json({ message: "User registered successfully"});


    }
    catch (error)
    {
        console.error("Error registering user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try
    {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid email or password" });

        // Here you would typically compare the password with a hashed version
        if (user.password !== password) return res.status(400).json({ message: "Invalid email or password" });

        res.status(200).json({ 
            message: "Login successful", 
            user: { ...user._doc, password: undefined, id: user._id }
        });
    }
    catch (error)
    {
        console.error("Error logging in user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const getUserProfile = async (req, res) => {
    const { userId } = req.query;

    try
    {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json({ user: { ...user._doc , password: undefined, id: user._id } });
    }
    catch (error)
    {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const deleteUser = async (req, res) => {
    const { email } = req.query;

    try
    {
        const user = await User.findOneAndDelete({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json({ message: "User deleted successfully" });
    }
    catch (error)
    {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export { registerUser, loginUser, getUserProfile, deleteUser };