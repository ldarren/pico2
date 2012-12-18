const
IDS = ['bg', 'fg', 'grid'],
LAYERS = {
    BG: 0,
    FG: 1,
    GRID: 2
};

var
boxes = [],
Box = function(stage){
    this.stage = stage;
    this.layers = [];
    this.mouseButton = 0;

    stage.addEventListener('mousedown', this, false);
    stage.addEventListener('mouseup', this, false);
    stage.addEventListener('mouseover', this, false);
    stage.addEventListener('mouseout', this, false);

    stage.addEventListener("touchstart", this, false);
    stage.addEventListener("touchend", this, false);
    stage.addEventListener("touchcancel", this, false);
    stage.addEventListener("touchleave", this, false);
};

Box.prototype.handleEvent = function(evt){
    var target = evt.target;
    switch(evt.type){
        case 'click':
            var layer = this.layers[LAYERS.FG];
            switch(evt.srcElement.id){
                case 'small pen':
                    layer.changeScale(1);
                    break;
                case 'medium pen':
                    layer.changeScale(2);
                    break;
                case 'large pen':
                    layer.changeScale(3);
                    break;
                    break;
                case 'red':
                    layer.changeColor('#f00');
                    break;
                case 'green':
                    layer.changeColor('#0f0');
                    break;
                case 'blue':
                    layer.changeColor('#00f');
                    break;
                case 'eraser':
                    layer.toggleMode();
                    break;
                case 'clear':
                    layer.clear();
                    break;
                case 'upload':
                    localStorage.setItem('image', layer.save());
                    console.log(layer.save());
                    break;
                case 'download':
                    layer.open(localStorage.getItem('image'));
                    console.log('open', localStorage.getItem('image'));
                    break;
            }
            break;
        case 'mousedown':
            this.mouseButton = evt.which;
            target.addEventListener('mousemove', this, false);
            break;
        case 'mouseup':
            if (this.mouseButton === evt.which) this.mouseButton = 0;
            target.removeEventListener('mousemove', this, false);
            break;
        case 'mouseout':
            this.mouseButton = 0;
            target.removeEventListener('mousemove', this, false);
            break;
        case 'mousemove':
            var
            s = this.stage,
            layer = this.layers[LAYERS.FG];
            layer.drawDot(evt.clientX - s.offsetLeft, evt.clientY - s.offsetTop);
            break;
        case 'mouseover':
            break;
        case 'touchstart':
            if (evt.target.tagName === 'INPUT') break;
            evt.preventDefault();
            this.mouseButton = 1;
            target.addEventListener('touchmove', this, false);
            break;
        case 'touchend':
        case 'touchcancel':
        case 'touchleave':
            if (evt.target.tagName === 'INPUT') break;
            evt.preventDefault();
            this.mouseButton = 0;
            target.removeEventListener('touchmove', this, false);
            break;
        case 'touchmove':
            if (evt.target.tagName === 'INPUT') break;
            evt.preventDefault();
            var
            s = this.stage,
            touches = evt.changedTouches,
            touch = touches[0],
            layer = this.layers[LAYERS.FG];
            layer.drawDot(touch.pageX - s.offsetLeft, touch.pageY - s.offsetTop);
            break;
    }
};

Box.prototype.addLayer = function(id, unit){
    var
    canvas = document.createElement('canvas'),
    l = this.layers,
    s = this.stage;

    s.appendChild(canvas);

    l.push(new Layer(id, canvas, s.offsetLeft, s.offsetTop, s.offsetWidth, s.offsetHeight, l.length, unit));
};

Box.prototype.addHUD = function(id){
    var
    ui = document.createElement('div'),
    s = this.stage,
    style = ui.style;

    style.position = 'absolute';
    style.top = s.offsetTop+'px';
    style.left = s.offsetLeft+'px';
    style.width= s.offsetWidth+'px';
    style.height= s.offsetHeight+'px';
    style.zIndex = 9999;
    ui.setAttribute('id', id);

    s.appendChild(ui);

    ui.appendChild(this.addButton('../img/small_pen.png', 'small pen'));
    ui.appendChild(this.addButton('../img/medium_pen.png', 'medium pen'));
    ui.appendChild(this.addButton('../img/large_pen.png', 'large pen'));
    ui.appendChild(this.addButton('../img/red.png', 'red'));
    ui.appendChild(this.addButton('../img/green.png', 'green'));
    ui.appendChild(this.addButton('../img/blue.png', 'blue'));
    ui.appendChild(this.addButton('../img/eraser.png', 'eraser'));
    ui.appendChild(this.addButton('../img/clear.png', 'clear'));
    ui.appendChild(this.addButton('../img/upload.png', 'upload'));
    ui.appendChild(this.addButton('../img/download.png', 'download'));
};

Box.prototype.addButton = function(src, name){
    var btn = document.createElement('input');
    btn.type = 'image';
    btn.src = src;
    btn.id = name;
    btn.title = name;
    btn.addEventListener('click', this, false);
    return btn;
};

var Layer = function(id, canvas, x, y, width, height, zIndex, unit){
    this.id = id;
    this.width = width || 400;
    this.height = height || 400;
    this.unitSize = unit || 10;
    this.color = '#00f';
    this.scale = 1;
    this.mode = 1;

    var style;
    if (canvas || canvas.getContext) {
        style = canvas.style;
        style.position = 'absolute';
        style.top = y+'px';
        style.left = x+'px';
        style.zIndex = zIndex;
        canvas.setAttribute('id', this.id);
        canvas.setAttribute('width', this.width);
        canvas.setAttribute('height', this.height);
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
    }else{
        console.log('no 2d canvas context');
    }
};

Layer.prototype.save = function(){
    return this.canvas.toDataURL();
};

Layer.prototype.open = function(src){
    var
    me = this,
    img = new Image();

    img.onload = function(){ me.context.drawImage(img, 0, 0); };
    img.src = src;
};

Layer.prototype.drawImage = function(src, cb){
    var
    ctx = this.context,
    img = new Image();

    img.addEventListener('load', function(){
        ctx.drawImage(img, 0, 0);
        if (cb) cb();
    });
    img.src = src;
};

Layer.prototype.drawGrid = function(color){
    var
    context = this.context,
    width = this.width,
    height = this.height,
    gridPixelSize = this.unitSize;

    context.save();
    context.strokeStyle = color;

    var
    count = Math.ceil(height / gridPixelSize),
    gap;

    // horizontal grid lines
    for(var i = 0; i <= count; i++){
        gap = i * gridPixelSize;
        context.beginPath();
        context.moveTo(0, gap);
        context.lineTo(width, gap);
        context.lineWidth = i % 5 ? 0.5 : 2;
        context.closePath();
        context.stroke();
    }

    count = Math.ceil(width/ gridPixelSize);

    // vertical grid lines
    for(var j = 0; j <= count; j++){
        gap = j * gridPixelSize;
        context.beginPath();
        context.moveTo(gap, 0);
        context.lineTo(gap, height);
        context.lineWidth = j % 5 ? 0.5 : 2;
        context.closePath();
        context.stroke();
    }

    context.restore();
}

Layer.prototype.drawDot = function(offsetX, offsetY){
    var
    ctx = this.context,
    penWeight = this.unitSize * this.scale,
    x = Math.floor(offsetX / penWeight),
    y = Math.floor(offsetY / penWeight);
    if (this.mode){
        ctx.fillStyle = this.color;
        ctx.fillRect(x*penWeight, y*penWeight, penWeight, penWeight);
    }else{
        ctx.clearRect(x*penWeight, y*penWeight, penWeight, penWeight);
    }
};

Layer.prototype.changeColor = function(color){
    this.color = color;
};

Layer.prototype.changeScale = function(scale){
    this.scale = scale;
};

Layer.prototype.toggleMode = function(){
    this.mode ^= 1;
};

Layer.prototype.clear = function(){
    this.context.clearRect(0, 0, this.width, this.height);
};

function drawbox(){
    var stages = document.getElementsByClassName('picoStage');

    if (!stages || !stages.length) {
        console.error('stages not found');
        return;
    }

    var stage, canvas, i, l, j, m;

    for (i=0, l=stages.length; i<l; i++){
        stage = stages[i];
        box = new Box(stage);
        for (j=0, m=IDS.length; j<m; j++){
            box.addLayer(IDS[j]);
        }
        box.addHUD('UI');
        boxes.push(box);
    }

    for (i=0, l=boxes.length; i<l; i++){
        layers = boxes[i].layers;
        if (layers && layers.length < LAYERS.GRID) continue;
        layers[LAYERS.GRID].drawGrid('black');
    }
}

window.addEventListener('load', drawbox);
