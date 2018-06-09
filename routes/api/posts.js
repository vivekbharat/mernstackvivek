const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

//Post Model
const Post = require("../../models/Post");
//Profile Models
const Profile = require("../../models/Profile");

//post validation
const validatePostInput = require("../../validation/post");

//@route        GET api/posts/test
//@description  Test posts route
//@access       Public
router.get("/test", (req, res) => res.json({ msg: "Posts Works" }));

//@route        GET api/posts
//@description  GET posts route
//@access       Public

router.get("/", (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .then(posts => res.json(posts))
    .catch(err => res.status(404).json({ noPostFound: "No posts found" }));
});

//@route        GET api/posts/:id
//@description  GET posts route
//@access       Public

router.get("/:id", (req, res) => {
  Post.findById(req.params.id)
    .sort({ date: -1 })
    .then(post => res.json(post))
    .catch(err =>
      res.status(404).json({ noPostFound: "No post found with this id" })
    );
});

//@route        POST api/posts
//@description  Create posts route
//@access       private

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    if (!isValid) {
      //If any errors, send 400 with errors ObjectId
      return res.status(400).json(errors);
    }

    const newPost = new Post({
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar,
      user: req.user.id
    });

    newPost.save().then(post => res.json(post));
  }
);

//@route        DELETE api/posts/:id
//@description  Delete post
//@access       private

router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    //const { errors, isValid } =
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          //Check for post owner
          if (post.user.toString() !== req.user.id) {
            return res
              .status(401)
              .json({ notAuthorized: "User not authorized" });
          }

          //DELETE
          post.remove().then(() => res.json({ success: true }));
        })
        .catch(err => res.status(404).json({ postNotFound: "No Post found" }));
    });
  }
);

//@route        POST api/posts/like/:id
//@description  Delete post
//@access       private

router.post(
  "/like/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    //const { errors, isValid } =
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          if (
            post.likes.filter(like => like.user.toString() === req.user.id)
              .length > 0
          ) {
            return res
              .status(400)
              .json({ alreadyLiked: "User already liked this post" });
          }
          //Add the user id to like array
          post.likes.unshift({ user: req.user.id });

          //save the user to // DB
          post.save().then(post => res.json(post));
        })
        .catch(err => res.status(404).json({ postNotFound: "No Post found" }));
    });
  }
);

//@route        POST api/posts/unlike/:id
//@description  Unlike post
//@access       private

router.post(
  "/unlike/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    //const { errors, isValid } =
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          if (
            post.likes.filter(like => like.user.toString() === req.user.id)
              .length === 0
          ) {
            return res
              .status(400)
              .json({ alreadyLiked: "You have not liked this post yet" });
          }
          //Get the remove index
          const removeIndex = post.likes
            .map(item => item.user.toString())
            .indexOf(req.user.id);

          post.likes.splice(removeIndex, 1);
          //save the user to // DB
          post.save().then(post => res.json(post));
        })
        .catch(err => res.status(404).json({ postNotFound: "No Post found" }));
    });
  }
);

//@route        POST api/posts/comment/:id
//@description  Add comment to a post
//@access       private

router.post(
  "/comment/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    if (!isValid) {
      //If any errors, send 400 with errors ObjectId
      return res.status(400).json(errors);
    }

    Post.findById(req.params.id)
      .then(post => {
        const newComment = {
          text: req.body.text,
          name: req.body.name,
          avatar: req.body.avatar,
          user: req.user.id
        };

        //Add to comments array
        post.comments.unshift(newComment);
        post.save().then(post => res.json(post));
      })
      .catch(err => res.status(404).json({ postNotFound: "No Post found" }));
  }
);

//@route        DELETE api/posts/comment/:id/:comment_id
//@description  Removes comment from a post
//@access       private

router.delete(
  "/comment/:id/:comment_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.findById(req.params.id)
      .then(post => {
        //Check to see if comment exists
        if (
          post.comments.filter(
            comment => comment._id.toString() === req.params.comment_id
          ).length === 0
        ) {
          return res
            .status(404)
            .json({ commentDoesNotExist: " Comment Does not exist " });
        }
        const removeIndex = post.comments
          .map(item => item._id.toString())
          .indexOf(req.params.comment_id);

        post.comments.splice(removeIndex, 1);
        //save the user to // DB
        post.save().then(post => res.json(post));
      })
      .catch(err =>
        res
          .status(404)
          .json({ commentDoesNotExist: " Comment Does not exist " })
      );
  }
);

module.exports = router;
