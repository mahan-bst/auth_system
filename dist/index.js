"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var body_parser_1 = __importDefault(require("body-parser"));
var mongoose_1 = require("mongoose");
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var bcrypt_1 = __importDefault(require("bcrypt"));
var joiValidation_1 = __importDefault(require("./joiValidation"));
var jwtToken_1 = __importDefault(require("./jwtToken"));
var User_1 = __importDefault(require("./models/User"));
var app = express_1.default();
var port = process.env.PORT || 8000;
// set salt CONST
var salt = 12;
//
//
//
// middlewares
app.use(body_parser_1.default.json());
// connect to mongo db
mongoose_1.connect("mongodb://localhost:27017/test", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}, function (err) {
    if (!err) {
        console.log("db is ok!!");
    }
    else {
        console.log(err);
    }
});
// frontend post email password and username we check for unique and make a coluumn and return jwt if its not unique err
app.post("/api/auth/create", function (req, res) {
    //post body
    var body = req.body;
    // valid datas with Joi
    var validation = joiValidation_1.default.validate(body);
    if (validation.error) {
        return res.json({ err: validation.error });
    }
    // hash password and put it in db
    bcrypt_1.default.hash(body.password, salt, function (err, hash) {
        if (!err) {
            var userInfo = {
                username: body.username,
                password: hash,
                email: body.email,
            };
            var user = new User_1.default(userInfo);
            user.save();
            var resp = {
                username: body.username,
                email: body.email,
                jwtToken: jsonwebtoken_1.default.sign(user._id.toString(), jwtToken_1.default),
            };
            res.json(resp);
        }
        else {
            res.json({ err: err });
        }
    });
});
// front end post username and password and we check and return if true jwt if not true err
app.post("/api/auth/verify", function (req, res) {
    //post body
    var body = req.body;
    //check "username" and "password " is exist
    if (body.username && body.password) {
        // check typeof password and username
        if (typeof body.username !== "string" ||
            typeof body.password !== "string") {
            return res.json({ err: "please enter correct values" });
        }
        // check "username" is username or email
        // if is_email = -1 means its username if is_email != -1 means its password
        var is_email = body.username.search(/^.*@.*$/);
        if (is_email == -1) {
            // its username
            User_1.default.find({ username: body.username }, function (err, docs) {
                if (docs.length > 0) {
                    var passHash = docs[0].get("password");
                    bcrypt_1.default.compare(body.password, passHash, function (err, is_same) {
                        if (!err) {
                            if (is_same) {
                                return res.json({
                                    valid: true,
                                    jwtToken: jsonwebtoken_1.default.sign(docs[0]._id.toString(), jwtToken_1.default),
                                });
                            }
                            else {
                                return res.json({ valid: false });
                            }
                        }
                    });
                }
                else {
                    return res.json({ valid: false });
                }
            });
        }
        else {
            // its email
            User_1.default.find({ email: body.username }, function (err, docs) {
                if (docs.length > 0) {
                    var passHash = docs[0].get("password");
                    bcrypt_1.default.compare(body.password, passHash, function (err, is_same) {
                        if (!err) {
                            if (is_same) {
                                return res.json({
                                    valid: true,
                                    jwtToken: jsonwebtoken_1.default.sign(docs[0]._id.toString(), jwtToken_1.default),
                                });
                            }
                            else {
                                return res.json({ valid: false });
                            }
                        }
                    });
                }
                else {
                    return res.json({ valid: false });
                }
            });
        }
    }
    else {
        return res.json({ err: "please enter correct values" });
    }
});
var authjwt = function (req, res, next) {
    var header = req.headers.authorization;
    if (!header)
        return res.json({ err: true });
    var token = header.split(" ")[1];
    jsonwebtoken_1.default.verify(token, jwtToken_1.default, function (err, decoded) {
        if (err)
            return res.json({ err: true });
        req.userID = decoded;
        next();
    });
};
app.get("/api/auth/info", authjwt, function (req, res) {
    User_1.default.find({ _id: req.userID }, function (err, docs) {
        if (err)
            return res.json({ err: true });
        if (docs.length > 0) {
            res.json({
                username: docs[0].get("username"),
                email: docs[0].get("email"),
            });
        }
    });
});
// run server on port
app.listen(port, function () { return console.log("Im running on port " + port); });
