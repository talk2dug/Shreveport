




const express = require('express');
const https = require('https');
const fs = require('fs');
var path = require('path');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const _ = require('lodash');
const port = 3000;
//import FFmpegjsEngine from './node_modules/videojs-record/dist/plugins/videojs.record.ffmpegjs.js';
var key = fs.readFileSync(__dirname + '/selfsigned.key');
var cert = fs.readFileSync(__dirname + '/selfsigned.crt');
var options = {
  key: key,
  cert: cert
};

app = express()
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});
app.use(fileUpload({
    createParentPath: true
}));

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));
var server = https.createServer(options, app);

server.listen(port, () => {
  console.log("server starting on port : " + port)
});

app.post('/upload-avatar', async (req, res) => {
    try {
        if(!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
            let avatar = req.files.Avatar;
            console.log(req)
            //Use the mv() method to place the file in upload directory (i.e. "uploads")
            avatar.mv('./uploads/' + avatar.name);

            //send response
            res.send({
                status: true,
                message: 'File is uploaded',
                data: {
                    name: avatar.name,
                    mimetype: avatar.mimetype,
                    size: avatar.size
                }
            });
        }
    } catch (err) {
        console.log(err)
        res.status(500).send(err);
    }
});