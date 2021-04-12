const AWS = require("aws-sdk");
const { keys, mapKey } = require("../keys/keys");
const Post = require("../models/post");


const s3 = new AWS.S3({
  accessKeyId: keys.ID,
  secretAccessKey: keys.secret,
  bucketName: keys.bucketName,
  signatureVersion: "v4",
  region: "eu-central-1"
});

class PostService {


  static  getPostObject(imageId) {
    try {
      let image =  s3.getSignedUrl("getObject", {
        Bucket: keys.bucketName,
        Key:  `${keys.folderPosts}/${imageId}`,
      });
      return image;
    } catch (err) {
      console.log(err);
    }
  }


    static async get(params) {
      let posts;
        try {
       if (params.id) {        
       posts = Post.findById(params.id)   
    }
    else if (params.user) {
             posts = Post.find({
                user: user._id
            })
    }
    else {
       posts = Post.find()
    }
    posts = await posts
    .populate("user", ["username", "avatar"])
    .sort({ createdAt: -1 }).lean()
        }
        catch(err) {
          console.log(err);
          return [];
        }
          posts.forEach(post => {
          post.image = PostService.getPostObject(post.image);
        })
        return posts;
            }
}

module.exports = PostService;
