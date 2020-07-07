/* eslint-disable no-console */

/**
 * Example websocket server for uploads.
 */
function blobToFile(theBlob, fileName){
    //A Blob() is almost a File() - it's just missing the two properties below which we will add
    theBlob.lastModifiedDate = new Date();
    theBlob.name = fileName;
    return theBlob;
}

const https = require('https');
const sockjs = require('sockjs');
const datefns = require('date-fns');
const node_static = require('node-static');
const timestamp = require('log-timestamp')(function() { return '[' + datefns.format(new Date(), 'yyyy/MM/dd HH:mm:ss.SSS') + '] %s'; });
const fs = require('fs');
var path = require('path');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const _ = require('lodash');
var key = fs.readFileSync(__dirname + '/selfsigned.key');
var cert = fs.readFileSync(__dirname + '/selfsigned.crt');
var options = {
  key: key,
  cert: cert
};
let index = 0;

// create websocket
const sockjs_upload = sockjs.createServer();

// listen for connections
sockjs_upload.on('connection', (conn) => {
    conn.on('data', data => {
        console.log(data)
        if (data === 'start') {
            // started recording
            index = 0;

            console.log('');
            console.log('started recording.');
            console.log('');
        } else if (data === 'stop') {
            // stopped recording
            console.log('');
            console.log('finished recording.');
            console.log('');
        } else if (data) {
            // received data
            index++;

            console.log(
                ' received data [' + index + ']:',
                data
            );
            var myFile = blobToFile(data, "my-video-file-name.webm");
            fs.writeFile(myFile, imagedata, 'binary', function(err){
                if (err) throw err
                console.log('File saved.')
            })
        }
    });
});


// static files server
const static_directory = new node_static.Server(__dirname);
const server = https.createServer(options);
const port = 9999;
const host = '0.0.0.0';
server.addListener('request', (req, res) => {
    static_directory.serve(req, res);
});
server.addListener('upgrade', (req, res) => {
    res.end();
});
sockjs_upload.installHandlers(server, {prefix: '/uploads'});

// print startup message
console.log('');
console.log(' [examples] Websocket upload server listening on ' +
            host + ':' + port);
server.listen(port, host);
console.log('');