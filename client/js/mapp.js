var map, body, watchId,
optionHi = {maximumAge:1000, timeout:30000, enableHighAccuracy:true},
optionLo = {maximumAge:1000, timeout:30000, enableHighAccuracy:false};

function getPosition(pos){
    var
    lat = pos.coords.latitude,
    lon = pos.coords.longitude,
    geocode = stringify(hash(lat, lon, 16));

    map.innerHTML = lat + ', ' + lon + ': '+ geocode;
    return geocode;
}

function getError(err){
    var
    code = err ? err.code : 500,
    msg;

    switch(code) {
        case err.PERMISSION_DENIED:
            msg='User denied the request for Geolocation.';
            break;
        case err.POSITION_UNAVAILABLE:
            msg='Location information is unavailable.';
            break;
        case err.TIMEOUT:
            msg='The request to get user location timed out.';
            break;
        case err.UNKNOWN_ERROR:
            msg='An unknown err occurred.';
            break;
        default:
            code = 500;
            msg = 'Is time to upgrade urself';
            break;
    }
    map.innerHTML = msg;
    return {code:code, msg:msg};
}

function getGeoHash(cb){
    if (navigator.geolocation){
        map.innerHTML=("Checking location...");
        navigator.geolocation.getCurrentPosition(
        function(pos){
            cb(null, getPosition(pos));
        }, 
        function(err){
            cb(getError(err));
        }, optionHi);
    }else{
        cb(getError());
    }
}

function watchGeoHash(cb){
    if (navigator.geolocation){
        if (watchId) navigator.geolocation.clearPosition(watchId);
        watchId = navigator.geolocation.watchPosition(
        function(pos){
            var hash = getPosition(pos);
            if (cb) cb(null, hash);
        }, 
        function(err){
            var errObj = getError(err);
            if (cb) cb(errObj);
        }, optionLo);
    }else{
        var errObj = getError(err);
        if (cb) cb(errObj);
    }
}

function clearGeoHash(){
    if (watchId) navigator.geolocation.clearPosition(watchId);
    watchId = 0;
}

function mapp(){
    map =  document.createElement('div');
    body = document.getElementsByTagName('body')[0];
    body.appendChild(map);
    watchGeoHash();
}

window.addEventListener('load', mapp);
