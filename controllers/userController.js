const { User, Thought } = require("../models");

module.exports = {
  async getUsers (req, res) {
    try {
      const dbUserData = await User.find({})
        .populate({
          path: "thoughts",
          select: "-__v",
        })
        .select("-__v");
      res.json(dbUserData);
    } catch (err) {
      console.log(err);
      res.status(400).json(err);
    }
  },
    async getSingleUser ({ params }, res) {
    try {
      const dbUserData = await User.findOne({ _id: params.userId })
        .populate({
          path: "friends",
          select: "-__v",
        })
        .populate({
            path: "thoughts",
            select: "-__v",
        })
        .select("-__v");
      if (!dbUserData) {
        res.status(404).json({ message: "No user found with this id!" });
        return;
      }
      res.json(dbUserData);
    } catch (err) {
      console.log(err);
      res.status(400).json(err);
    }
  },
  async createUser ({ body }, res)  {
    try {
      const dbUserData = await User.create(body);
      res.json(dbUserData);
    } catch (err) {
      console.log(err);
      res.status(400).json(err);
    }
  },
  async updateUser ({ params, body }, res) {
    try {
      const dbUserData = await User.findOneAndUpdate(
        { _id: params.userId },
        {$set: body},
        {
          new: true,
          runValidators: true,
        }
      );
      if (!dbUserData) {
        res.status(404).json({ message: "No user found with this id!" });
        return;
      }
      res.json(dbUserData);
    } catch (err) {
      res.status(400).json(err);
    }
  },
  async deleteUser ({ params }, res) {
    try {
      const dbUserData = await User.findOneAndDelete({ _id: params.userId });
      if (!dbUserData) {
        res.status(404).json({ message: "No user found with this id" });
        return;
      }
      await Thought.deleteMany(
        { _id: { $in: dbUserData.thoughts } }
      );
      res.json({ message: "Successfully deleted user and thoughts" });
    } catch (err) {
      res.status(400).json(err);
    }
  },
  async addFriend ({ params }, res) {
    try {
      const dbUserData = await User.findByIdAndUpdate(
        {_id: params.userId},
        { $addToSet: { friends: params.friendId } },
        { new: true }
      ).select("-__v");
      if (!dbUserData) {
        res.status(404).json({ message: "No user found with this id!" });
        return;
      }
      res.json(dbUserData);
    } catch (err) {
      res.status(400).json(err);
    }
  },
  async deleteFriend ({ params }, res) {
    try {
      const dbUserData = await User.findByIdAndUpdate(
        { _id: params.userId },
        { $pull: { friends: params.friendId } },
        { new: true, runValidators: true }
      ).select("-__v");
      if (!dbUserData) {
        res.status(404).json({ message: "No friend found with this id!" });
        return;
      }
      res.json(dbUserData);
    } catch (err) {
      res.status(400).json(err);
    }
  },
};


