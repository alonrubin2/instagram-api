const User = require("../models/user");
const Post = require('../models/post');
const md5 = require('md5');
const jwt = require('jsonwebtoken');
const { jwtSecret } = require("../config/enviornment/index");
const PostService = require("../services/postService");
const fs = require('fs').promises;



class UsersController {

    static createUser(req, res) {
        req.body.password = md5(req.body.password);
        const user = new User(req.body);
        console.log(user, ' created')
        user.save()
            .then((newUser) => {
                res.status(201).send(newUser);
            })
            .catch((err) => {
                console.log(err);
                res.status(400).send(err);
            });
    };

    static login(req, res) {
        User.findOne({
            username: req.body.username,
            password: md5(req.body.password)
        }).then(loginUser => {
            if (!loginUser) {
                res.sendStatus(401);
                return;
            }
            const payload = {
                _id: loginUser._id,
                username: loginUser.username
            };
            const token = jwt.sign(payload, jwtSecret);
            res.send({ token });
        })
            .catch((err) => {
                console.log(err);
                res.sendStatus(500);
            });
    };

    static async editUser(req, res) {
        console.log(req)
        const fileName = req.file.filename;
        const toUpdate = {};
        if (fileName) {
            const imageBase64 = await fs.readFile('public/avatars/' + fileName, {
                encoding: 'base64'
            });
            toUpdate.avatar = imageBase64;
        }
        toUpdate.username = req.body.username;
        toUpdate.email = req.body.email;
        toUpdate.bio = req.body.bio;
        User.findByIdAndUpdate(
            req.params.id,
            toUpdate
        )
            .then(user => {
                User.findById(req.params.id)
                    .then(user => res.send(user))
            })
    }

    static me(req, res) {
        User.findById(req.user._id)
            .then(user => res.send(user))
    }

    static check(req, res) {
        const { username, email } = req.query;

        let property = email ? 'email' : 'username';

        try {
            User.exists({
                [property]: req.query[property]
            })
                .then(isExist => {
                    res.json(isExist);
                });
        }
        catch (err) {
            res.status(400).json(err)
        }
    }

    static async getUserPosts(req, res) {
        const user = await User.findOne({
            username: req.params.username
        });
        if (!user) {
            res.sendStatus(404);
            return;
        }
        try {
            let posts = await PostService.get({ user: user })
            if (!posts) {
                res.sendStatus(404);
                return;
            }
            res.send(posts);
        }
        catch (err) {
            res.status(500).console.log(err)

        }
    }

    static async getUserDetails(req, res) {
        try {
            const user = await User.findOne({
                username: req.params.username
            });
            if (!user) {
                res.sendStatus(404);
                return;
            }
            const { _id, username, avatar } = user;
            res.send(user);
        }
        catch (err) {
            console.log(err);
            res.status(500);
        }
    }

    static async findAllUsers(req, res) {
        const { username } = req.query
        try {
            const users = await User.find({
                username: new RegExp(username, 'i')
            });
            res.json(users.map(user => ({
                _id: user.id,
                username: user.username,
                createdAt: user.createdAt,
                avatar: user.avatar,
                bio: user.bio
            })
            ));
        }
        catch (err) {
            console.log(err)
        }
    }

    static async findOneUser(req, res) {
        try {
            const { username } = req.query;
            const foundUser = await User.findOne({
                username
            });
            if (!foundUser) {
                res.sendStatus(404);
                return;
            }
            const { _id, name, avatar } = foundUser;
            console.log(foundUser)
            return foundUser;
        }
        catch (err) {
            console.log(err);
            sendStatus(500);
        }

    }

    static async follow(req, res) {
        try {
            const { id } = req.params;
            const followerId = req.user._id;
            if (id === followerId) {
                res.sendStatus(400);
                return;
            }
            console.log(req.user._id);
            const user = await User.findByIdAndUpdate(id, { $addToSet: { followers: req.user._id } }, { new: true });
            if (!user) {
                res.sendStatus(404);
                console.log('try')
                console.log(id);
                return;
            }
            res.status(200).send({
                userId: user._id,
                avatar: user.avatar,
                username: user.username,
                followers: user.followers
            });
        }
        catch (err) {
            console.log(err)
            res.sendStatus(500);
        }
    }


    static async unFollow(req, res) {
        try {
            const { id } = req.params;
            console.log(id);
            const user = await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } }, { new: true });
            res.status(200).send({
                userId: user._id,
                avatar: user.avatar,
                username: user.username,
                followers: user.followers
            });
        }
        catch (err) {
            console.log(err)
            res.sendStatus(500);
        }
    }

}

module.exports = UsersController;