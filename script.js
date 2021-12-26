var options = ["Beatriz", "Charles", "Diya", "Eric", "Fatima", "Gabriel", "Hanna"];

var startY = 0;
var height = Math.round(500 / options.length);
var pickerTimeout = null;
var pickerTime = 0;
var pickerTimeTotal = 0;
var allHeight = 0;

var ctx;

document.getElementById("picker").addEventListener("click", picker);

function byte2Hex(n) {
    var nybHexString = "0123456789ABCDEF";
    return String(nybHexString.substr((n >> 4) & 0x0F,1)) + nybHexString.substr(n & 0x0F,1);
}

function RGB2Color(r,g,b) {
    return '#' + byte2Hex(r) + byte2Hex(g) + byte2Hex(b);
}

function getColor(item, maxitem) {
    var phase = 0;
    var center = 128;
    var width = 127;
    var frequency = Math.PI*2/maxitem;
    
    red   = Math.sin(frequency*item+2+phase) * width + center;
    green = Math.sin(frequency*item+0+phase) * width + center;
    blue  = Math.sin(frequency*item+4+phase) * width + center;
    
    return RGB2Color(red,green,blue);
}

function drawVerticalRoulette() {
    var canvas = document.getElementById("canvas");
    allHeight = options.length * height;
    canvas.height = allHeight;
    if (canvas.getContext) {
        ctx = canvas.getContext("2d");
        ctx.clearRect(0,0,200,allHeight);

        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.font = 'bold 12px Helvetica, Arial';

        var y1 = startY % allHeight;
        for(var i = 0; i < options.length; i++) {
            ctx.fillStyle = getColor(i, options.length);
            if((y1 + (height * i)) > allHeight) {
                y2 = (y1 + (height * i)) % allHeight;
            } else {
                y2 = y1 + (height * i);
            }
            ctx.fillRect(0, y2, 200, height);
            ctx.save();
            ctx.shadowBlur    = 0;
            ctx.shadowColor   = "rgb(220,220,220)";
            ctx.fillStyle = "black";
            var text = options[i];
            let textWidth = ctx.measureText(text).width;
            ctx.fillText(text, 100 - textWidth / 2, y2 + height / 2 + 5);
            ctx.restore();
            if(y2 + height > allHeight) {
                var diff = (y2 + height) % allHeight;
                ctx.fillStyle = getColor(i, options.length);
                ctx.fillRect(0, (diff - height), 200, height);
                ctx.save();
                ctx.shadowBlur    = 0;
                ctx.shadowColor   = "rgb(220,220,220)";
                ctx.fillStyle = "black";
                var text = options[i];
                ctx.fillText(text, 100 - textWidth / 2, diff - height + height / 2 + 5);
                ctx.restore();
            }
        } 

        //Arrow
        
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.moveTo(0, allHeight / 2 - 15);
        ctx.lineTo(20, allHeight / 2);
        ctx.lineTo(0, allHeight / 2 + 15);
        ctx.fill();
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.moveTo(200, allHeight / 2 - 15);
        ctx.lineTo(180, allHeight / 2);
        ctx.lineTo(200, allHeight / 2 + 15);
        ctx.fill();
    }
}

function picker() {
    pickerStart = Math.random() * 10 + 10; // 10 ~ 19.999999999
    pickerTime = 0;
    startY = 0;
    pickerTimeTotal = Math.random() * 2000 + 5 * 1000; // 4000 ~ 4002.999999999
    rouletteWheel();
}

function rouletteWheel() {
    pickerTime += 30;
    if(pickerTime >= pickerTimeTotal) {
        stopRouletteWheel();
        return;
    }
    //var pickerStep = pickerStart - easeOut(pickerTime, 0, pickerStart, pickerTimeTotal);
    var pickerStep = easeInExpo((pickerTimeTotal - pickerTime) / 3300);
    startY += (pickerStep * 30);
    console.log(startY);
    drawVerticalRoulette();
    pickerTimeout = setTimeout('rouletteWheel()', 30);
}

function stopRouletteWheel() {
    clearTimeout(pickerTimeout);
    var index = Math.floor((options.length * 1.5 - (startY % allHeight) / height) % options.length);
    alert(options[index]);
}

// function easeOut(t, b, c, d) {
// 	var ts = (t/=d)*t;
// 	var tc = ts*t;
// 	return b+c*(tc + -3*ts + 3*t);
// }

function easeInExpo(x) {
    return x === 0 ? 0 : Math.pow(2, 10 * x - 10);
}

drawVerticalRoulette();