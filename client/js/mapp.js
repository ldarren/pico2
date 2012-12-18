var map, body,
option = {maximumAge:600000, timeout:50000, enableHighAccuracy:true};

function onOK(pos){
    map.innerHTML = pos.coords.latitude + ', ' + pos.coords.longitude + ': '+stringify(hash(pos.coords.latitude, pos.coords.longitude, 16));
}

function onKO(err){
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
}

function mapp(){
    map =  document.createElement('div');
    body = document.getElementsByTagName('body')[0];
    body.appendChild(map);
    if (navigator.geolocation){
        map.innerHTML=("Checking location...");
        navigator.geolocation.getCurrentPosition(onOK, onKO, option);
    }else{
        map.innerHTML=('is time to upgrade urself');
    }
}
window.addEventListener('load', mapp);
