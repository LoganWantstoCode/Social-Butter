const { Thought, User, Types } = require("../models");

const ThoughtController = {
  async getThought (req, res) {
    try {
      const dbThoughtData = await Thought.find({})
        .select("-__v")
        .sort({ _id: -1 });
      res.json(dbThoughtData);
    } catch (err) {
      console.log(err);
      res.status(400).json(err);
    }
  },

  async getSingleThought ({ params }, res) {
    console.log("params sent", params);
    try {
      const dbThoughtData = await Thought.findOne({
        _id: params.thoughtId,
      }).select("-__v");
      if (!dbThoughtData) {
        res.status(404).json({ message: "No thought found with this id!" });
        return;
      }
      res.json(dbThoughtData);
    } catch (err) {
      console.log(err);
      res.status(400).json(err);
    }
  },

  async createThought ({ body }, res) {
    console.log("Thought inbound", body);
    try {
      const { _id, username } = await Thought.create(body);
      const dbUserData = await User.findOneAndUpdate(
        { username: username },
        { $push: { thoughts: _id } },
        { new: true }
      );
      if (!dbUserData) {
        res
          .status(404)
          .json({ message: "Thought created but no User with this ID" });
        return;
      }
      res.json("thought created successfully");
    } catch (err) {
      console.log(err);
      res.status(400).json(err);
    }
  },

  async deleteThought ({ params }, res) {
    try {
      const deletedthought = await Thought.findOneAndDelete({
        _id: params.thoughtId,
      });
      if (!deletedthought) {
        return res.status(404).json({ message: "No thought with this id!" });
      }
      const dbUserData = await User.findOneAndUpdate(
        { username: deletedthought.username },
        { $pull: { thoughts: params.thoughtId } },
        { new: true }
      );
      res.json(dbUserData);
    } catch (err) {
      console.log(err);
      res.json(err);
    }
  },
  async updateThought ({ params, body }, res) {
    try {
      const updatedThought = await Thought.findOneAndUpdate(
        {
          _id: params.thoughtId,
        },
        { $set: body },
        { new: true }
      );
      if (!updatedThought) {
        return res.status(404).json({ message: "unable to update thought! " });
      }
      res.json(updatedThought);
    } catch (err) {
      console.log(err);
      res.json(err);
    }
  },
  async addReaction ({ params, body }, res)  {
    console.log("Reaction inbound", body);
    try {
      const dbUserData = await Thought.findOneAndUpdate(
        { _id: params.thoughtId },
        { $push: { reactions: body } },
        { new: true }
      );
      if (!dbUserData) {
        res.status(404).json({ message: "No User found with this id!" });
        return;
      }
      res.json(dbUserData);
    } catch (err) {
      console.log(err);
      res.json(err);
    }
  },

  async deleteReaction ({ params }, res) {
    try {
      const dbUserData = await Thought.findOneAndUpdate(
        { _id: params.thoughtId },
        { $pull: { reactions: { reactionId: params.reactionId } } },
        { new: true }
      );
      res.json(dbUserData);
    } catch (err) {
      console.log(err);
      res.json(err);
    }
  },
};

module.exports = ThoughtController;
