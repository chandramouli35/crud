const express = require("express");
const router = express.Router();
const Alien = require("../models/alien");
const User = require("../models/user");

// router.get("/", async (req, res) => {
//   try {
//     const aliens = await Alien.find();
//     res.json({
//       data: aliens,
//       status: true,
//       message: "Data Retrived Successfully",
//     });
//   } catch (err) {
//     res.send("Error" + err);
//   }
// });

router.get("/", async (req, res) => {
  try {
    // Fetch data from both collections
    const aliens = await Alien.find();
    const users = await User.find(); // Fetch users

    res.json({
      aliens, // Aliens data
      users, // Users data
      status: true,
      message: "Data Retrieved Successfully",
    });
  } catch (err) {
    res.status(500).send("Error: " + err.message);
  }
});
router.get("/:id", async (req, res) => {
  try {
    const alien = await Alien.findById(req.params.id);
    res.json(alien);
  } catch (err) {
    res.send("Error" + err);
  }
});
router.post("/", async (req, res) => {
  const alien = new Alien({
    name: req.body.name,
    tech: req.body.tech,
    sub: req.body.sub,
  });
  try {
    const a1 = await alien.save();
    res.json(a1);
  } catch (err) {
    res.send("Error");
  }
});
router.patch("/:id", async (req, res) => {
  try {
    const alien = await Alien.findById(req.params.id);
    alien.sub = req.body.sub;
    const a1 = await alien.save();
    res.json(a1);
  } catch (err) {
    res.send("Error");
  }
});
router.delete("/user/:id", async (req, res) => {
  try {
    const alien = await User.findByIdAndDelete(req.params.id);

    if (!alien) {
      return res.status(404).send("Alien not found");
    }

    res.json({ message: "Alien deleted successfully" });
  } catch (err) {
    res.status(500).send("Error: " + err.message);
  }
});
module.exports = router;
