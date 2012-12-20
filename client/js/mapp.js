var map, body,
option = {maximumAge:600000, timeout:50000, enableHighAccuracy:true};

function getGeoHash(cb){
    if (navigator.geolocation){
        map.innerHTML=("Checking location...");
        navigator.geolocation.getCurrentPosition(
        function(pos){
            var
            lat = pos.coords.latitude,
            lon = pos.coords.longitude,
            geocode = stringify(hash(lat, lon, 16));

            map.innerHTML = lat + ', ' + lon + ': '+ geocode;
            cb(null, geocode);
        }, 
        function(err){
            switch(err.code) {
                case err.PERMISSION_DENIED:
                    map.innerHTML=("User denied the request for Geolocation.");
                    break;
                case err.POSITION_UNAVAILABLE:
                    map.innerHTML=("Location information is unavailable.");
                    break;
                case err.TIMEOUT:
                    map.innerHTML=("The request to get user location timed out.");
                    break;
                case err.UNKNOWN_ERROR:
                    map.innerHTML=("An unknown err occurred.");
                    break;
            }
            cb(err);
        }, option);
    }else{
        map.innerHTML=('is time to upgrade urself');
        cb('obsolete');
    }
}

function mapp(){
    map =  document.createElement('div');
    body = document.getElementsByTagName('body')[0];
    body.appendChild(map);
}

window.addEventListener('load', mapp);
