const { EDESTADDRREQ } = require("constants");
const Post = require("../models/post");
const Comment = require("../models/comment");
const fs = require("fs").promises;

const AWS = require("aws-sdk");
const { keys, mapKey } = require("../keys/keys");

const s3 = new AWS.S3({
  accessKeyId: keys.ID,
  secretAccessKey: keys.secret,
  bucketName: keys.bucketName,
  signatureVersion: "v4",
  region: "eu-central-1"
});

class PostsController {

  static async feed(req, res) {
    try {
      const posts = await Post.find()
        .populate("user", ["username", "avatar"])
        .sort({ createdAt: req.query.sort || -1 }).lean()
        let feedPosts = posts.map(post => {
          post.image = PostsController.getPostObject(post.image);
          console.log(post);
          return post;
        })
        res.send(feedPosts);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  }

  static async create(req, res) {
    const fileName = req.file.filename;
    // console.log(s3)
    try {
      const fileContent = await fs.readFile("./public/posts/" + fileName);
      const params = {
        Bucket: keys.bucketName,
        Key: fileName,
        Body: fileContent,
      };
      console.log("create", req.file.filename);
      const uploadedFile = s3.upload(params, (err, data) => {
        const post = new Post({
          description: req.body.description,
          image: fileName,
          user: req.user._id,
          north: req.body.north,
          east: req.body.east,
        });
      const newPost = post.save();
      res.status(201).send(newPost);
      });
      // const imageBase64 = await fs.readFile('public/posts/' + fileName, {
      //     encoding: 'base64'
      // });

    } catch (err) {
      console.log(err);
      res.sendStatus(400);
    }
  }

  static  getPostObject(imageId) {
    try {
      let image =  s3.getSignedUrl("getObject", {
        Bucket: keys.bucketName,
        Key: imageId,
      });
      return image;
    } catch (err) {
      console.log(err);
    }
  }

  static async getOnePost(req, res) {
    try {
      let post = await Post.findById(req.params.id).populate("user", [
        "username",
        "avatar",
      ]).lean();
      if (!post) {
        res.sendStatus(404);
        return;
      }
      post.image = PostsController.getPostObject(post.image);
      console.log(post);
        return res.json(post);
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  }



  static async like(req, res) {
    try {
      const { id } = req.params;
      console.log(req.user._id);
      const post = await Post.findByIdAndUpdate(
        id,
        { $addToSet: { likes: req.user._id } },
        { new: true }
      );
      res.status(200).send(post);
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  }

  static async unLike(req, res) {
    try {
      const { id } = req.params;
      console.log(id);
      const post = await Post.findByIdAndUpdate(
        id,
        { $pull: { likes: req.user._id } },
        { new: true }
      );
      res.status(200).send(post);
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  }

  static async createComment(req, res) {
    try {
      const comment = new Comment({
        content: req.body.content,
        postId: req.params.id,
        user: req.user._id,
      });
      const newComment = await comment.save();
      await newComment.populate("user", ["username", "avatar"]).execPopulate();
      res.status(201).send(newComment);
    } catch (err) {
      console.log(err);
      res.sendStatus(400);
    }
  }

  static async getAllComments(req, res) {
    const postId = req.params.id;
    try {
      const comments = await Comment.find({ postId }).populate("user", [
        "username",
        "avatar",
      ]);
      // .execPopulate()
      res.send(comments);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  }
}

module.exports = PostsController;
