let canvas = document.getElementById("myCanvas");
let context = canvas.getContext("2d");
let btnExport = document.querySelector("#export");
let html = document.querySelector("html");
let root = new HTMLNode(null, new Point(0, 0), new Size(50, 50), html);
let dom = new Dom(root, canvas, context);
dom.draw();

let cursor = new Cursor(dom, canvas);

canvas.onmousedown = function(event) {
    cursor.onMouseDown(event);
}

canvas.onclick = function(event) {
    cursor.onClick(event);
}

canvas.ondblclick = function(event) {
    cursor.onDoubleClick(event);
}

canvas.onmousemove = function(event) {
    cursor.onMove(event);
}

canvas.onmouseup = function(event) {
    cursor.onMouseUp();
}

btnExport.onclick = function() {
    let a = document.createElement("a");
    document.body.appendChild(a);
    a.href = canvas.toDataURL("image/png");
    a.download = "canvas-image.png";
    a.click();
    document.body.removeChild(a);
}
