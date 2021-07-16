const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const config = require('./config/key');
const { User } = require('./models/User');

// application/x-www~from-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// application/json
app.use(bodyParser.json());
app.use(cookieParser());

const mongoose = require('mongoose');
mongoose
    .connect(config.mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
    })
    .then(() => console.log(`MongoDB Connected...`))
    .catch((err) => console.log(`Connect Error...`));

app.get('/', (req, res) => {
    res.send('SUNTECH KOREA!!!');
});

app.post('/register', (req, res) => {
    // sign in info --> insert DB

    const user = new User(req.body);

    user.save((err, userInfo) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).json({
            success: true,
        });
    });
});

app.post('/login', (req, res) => {
    // request e-mail --> find database
    User.findOne({ email: req.body.email }, (err, user) => {
        if (!user) {
            return res.json({
                loginSuccess: false,
                message: 'Email not found',
            });
        }
        // if found e-mail --> password check
        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch) {
                return res.json({
                    loginSuccess: false,
                    message: 'password is not match',
                });
            }

            // if match password  --> token creat
            user.generateToken((err, user) => {
                if (err) return res.status(400).send(err);

                // tocken save (cookie, localstorige, etc...)
                res.cookie('x_auth', user.token)
                    .status(200)
                    .json({ loginSuccess: true, userID: user._id });
            });
        });
    });
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
