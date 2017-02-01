var app;
//Button shit
$(document).ready(function () {
    var placeToAppendID = "#drawingID";
    var drawingIdDiv = document.createElement('div');
    var options = {
        shareDiv: document.getElementById("shareDiv"),
        vrButton: document.getElementById("viewInVR")
    }
    options.lCanvas = lc;
    app = new MSPaintVR(options);
    $( placeToAppendID ).text( app.drawingId );
    document.body.appendChild(drawingIdDiv)
    app.init();
    app.login();
    var pencilTool = new LC.tools.Pencil(lc);
    var panTool = new LC.tools.Pan(lc)
    //Pick some nice colors!
    $("#colorPicker").spectrum({
        color: "#000",
        change: function (color) {
            if (lc) { lc.setColor('primary', color.toHexString()) }
        }
    });

    lc.on('shapeSave', function (e) {
        var shape = e.shape;
        console.log(shape);
        var sID = randId();
        var shapeData = {
            strokeWidth: lc.tool.strokeWidth,
            color: lc.tool.color,
            linePoints2D: [],
            shapeId: sID,
            height: Math.ceil(lc.height),
            width: Math.ceil(lc.width)
        };
        var points = [];
        
        for (var i = 0; i < shape.points.length; i++) {
            shapeData.linePoints2D[i] = [];
            shapeData.linePoints2D[i][0] = shape.points[i].x;
            shapeData.linePoints2D[i][1] = shape.points[i].y;
        }
        
    
        app.push2DShape(shapeData).then(function () {
            
            removeShape(lc, shape.id);
        }).catch(function(reason){
            console.log(reason);
            removeShape(lc, shape.id);
        });
        
        console.log("shape ended");
    });

});
    Array.prototype.remove = function (from, to) {
        var rest = this.slice((to || from) + 1 || this.length);
        this.length = from < 0 ? this.length + from : from;
        return this.push.apply(this, rest);
    };

    var removeShape = function (lc, udid) {
        console.log("remove shape");
        // var shapes = lc.shapes;
        // var shapeRemoved = false;
        // for (var i = 0; i < lc.shapes.length && !shapeRemoved; i++) {
        //     if (lc.shapes[i].id == udid) {
        //         lc.shapes.remove(i);
        //         shapeRemoved = true;
        //         console.log("Shaped Loaded!");
        //     }
        // }
        // if(shapeRemoved){
        //     lc.loadSnapshot(lc.getSnapshot())
        // }
    }
    var randId = function() {
    return Math.random().toString(36).substr(2, 8);
}