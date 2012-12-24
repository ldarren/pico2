var
http = require('http'),
url = require('url'),
querystring = require('querystring'),
redis = require('redis'),
redisClient = redis.createClient(),
server = http.createServer(function(req, res){
    var
    info = url.parse(req.url, true),
    params = info.query,
    data ='';

    req.on('data', function(chunk){
        data +=chunk.toString();
    });

    req.on('end',function(){
        var body = querystring.parse(data);
        for (var key in body){
            params[key] = body[key];
        }
        switch(info.pathname){
            case '/save':
                var
                geohash = params.geohash,
                img = decodeURIComponent(params.img);
                redisClient.set(geohash, img, function(err){
                    send(res, {code:1});
                });
                break;
            case '/load':
                var
                geohash = params.geohash;
                redisClient.get(geohash, function(err, img){
                    if (err || !img) return send(res, {code:0, err:1});
                    send(res, {code:2,img:encodeURIComponent(img)});
                });
                break;
            default:
                send(res, {code:0, err:2});
                break;
        }
    });
});

function send(res, obj){
    res.writeHead(200, {'Access-Control-Allow-Origin': '*'});
    res.end(JSON.stringify(obj));
}

server.listen(1337);
redisClient.on('error', function(err){
    console.log('Redis Exception: '+err);
});
