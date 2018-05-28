const express = require("express");
const router = express.Router();

//@route        GET api/profile/test
//@description  Test Profile route
//@access       Public

router.get("/test", (req, res) => {
  return res.json({ msg: "Profile Works" });
});

module.exports = router;
