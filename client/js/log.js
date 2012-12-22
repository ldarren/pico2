var
logDiv = document.getElementsByClassName('picoLog')[0];
console.log2 = console.log;
console.log = function(){
    var
    args = Array.prototype.slice.call(arguments),
    msg = args.join(' '),
    span = document.createElement('span');

    span.innerHTML = msg;

    logDiv.appendChild(span);
    console.log2(msg);
};
