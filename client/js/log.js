var
logDiv = document.getElementsByClassName('picoLog')[0];
console.log2 = console.log;
console.log = function(){
    var
    args = Array.prototype.slice.call(arguments),
    msg = args.join(' '),
    span = document.createElement('span'),
    childCount = logDiv.children.length;

    if (childCount > 20){
        for(var i=0,l=childCount-20; i<l; i++){
            if (logDiv.firstChild) logDiv.removeChild(logDiv.firstChild);
        }
    }

    span.innerHTML = msg;

    logDiv.appendChild(span);
    console.log2(msg);
};
