function reduce(input, output){
    var center = (input[1] + input[2]) * 0.5;
    
    if (input[0] > center){
        output.push(1);
        input[1] = center;
        return 1;
    }
    output.push(0);
    input[2] = center;
    return 0;
}
// base32hex
function stringify(bitfield){
    
    for(var i=bitfield.length-1, c=0, value=0, text=''; i>-1; c++, i--){
        value += bitfield[i] << c;
        if (29 === c){
            text = value.toString(32) + text;
            c = -1;
            value = 0;
        }
    }
    if (value){
        text = value.toString(32) + text;
    }
    return text;
}
// latitude then longitude
// position=1, negative=0
function hash(lat, lng, accuracy){
    var
    bitfield=[],
    data = [ [lat, -90, 90], [lng, -180, 180] ];
    
    for(var i=0; i<accuracy; i++){
        reduce(data[0], bitfield);
        reduce(data[1], bitfield);
    }
    
    return bitfield;
}
function peer(bitfield, relLat, relLng){
    var
    lng = bitfield.pop(),
    lat = bitfield.pop(),
    maskLat = 1 < relLat,
    maskLng = 1 < relLng,
    b = bitfield;
    
    if ((!maskLat && relLat === lat) || (!maskLng && relLng === lng)){
        // relative only maintain if lat and lng all changed
        b = peer(bitfield, lat === relLat ? relLat : 2, lng === relLng ? relLng : 2);
    }
    b.push(maskLat ? lat : (lat ? 0 : 1));
    b.push(maskLng ? lng : (lng ? 0 : 1));
    return b;
}
function scale(range, mat){
    if (!range) return mat;
    range--;
    
    var
    hl = mat.length,
    h = hl - 1,
    vec = mat[0],
    wl = vec.length,
    w = wl - 1,
    row;
    
    // both sides
    for(var y=0; y<hl; y++){
        row = mat[y];
        row.push(peer(row[w].slice(), 2, 1));
        row.unshift(peer(row[0].slice(), 2, 0));
    }
    wl = row.length;
    w = wl - 1;
    
    // bottom row
    row = mat[h];
    vec = [peer(row[1].slice(), 0, 0)];
    for(var x=1; x<wl; x++){
        vec.push(peer(row[x].slice(), 0, 2));
    }
    mat.push(vec);
    
    // top row
    row = mat[0];
    vec = [peer(row[1].slice(), 1, 0)];
    for(var x=1; x<wl; x++){
        vec.push(peer(row[x].slice(), 1, 2));
    }
    mat.unshift(vec);
    
    return scale(range, mat);
}
