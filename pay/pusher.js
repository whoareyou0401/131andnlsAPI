var pgConString = process.env.DATABASE_URL;
var host = process.env.CM_REDIS_URL;
var redis_db = process.env.CM_VENDOR_CACHE_DB;
var redis_port = process.env.CM_REDIS_PORT;
var redis_pwd = process.env.CM_REDIS_PASSWORD;
var http = require('http');
var express = require('express');
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var redis = require("redis");
var redis_client = redis.createClient({'port':redis_port, 'host':"cmb-redis-small.zcllqp.0001.cnn1.cache.amazonaws.com.cn", 'db':redis_db});
var winston = require('winston');

var logger = new (winston.Logger)({
    transports: [
        new(winston.transports.File)({filename: './server.log'})
    ]
});
server.listen(12350, function (req){
    try{
        var mas = {};
        var query_array = [];

        io.sockets.on('connection', function (socket) {
            socket.emit('connection', socket.id);
        });
        redis_client.on('ready', function(){
        redis_client.subscribe('pay_order');
          console.log('连接成功');
        });
        redis_client.on("subscribe", function(channel, count){
            console.log('client subscribed' + channel + ',' + count);
        });
        redis_client.on("message", function(channel, message){
            console.log("message is:" + message + ',channel is:' + channel);
            io.sockets.emit('news', message);

        });
       // executes after one second, and blocks the thread

      } catch(e){
          logger.info({'err msg':e.message});
      }

});