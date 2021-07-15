const express = require('express');
const app = express();
const port = 3000;

const mongoose = require('mongoose');
mongoose
    .connect(
        'mongodb+srv://dev:suntech9304!@nodejs-01.lcdn9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false,
        }
    )
    .then(() => console.log(`MongoDB Connected...`))
    .catch((err) => console.log(`Connect Error...`));

app.get('/', (req, res) => {
    res.send('SUNTECH KOREA!');
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
