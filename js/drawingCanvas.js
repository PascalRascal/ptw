var app;
//Button shit
$(document).ready(function () {
    var drawingIdDiv = document.createElement('div');
    var options = {
        
    }
    options.lCanvas = lc;
    app = new MSPaintVR(options);
    drawingIdDiv.innerHTML = app.drawingId;
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

    $(".fa-undo").click(function () {
        lc.undo();
    })
    $(".fa-repeat").click(function () {
        lc.redo();
    })
    $(".fa-search-plus").click(function () {
        lc.zoom(0.1);
    })
    $(".fa-search-minus").click(function () {
        lc.zoom(-0.1);
    })
    $(".size1").click(function () {
        lc.tool.strokeWidth = 2;
    });
    $(".size2").click(function () {
        console.log("click")
        lc.tool.strokeWidth = 5;
    });
    $(".size3").click(function () {
        lc.tool.strokeWidth = 7;
    });
    $(".size4").click(function () {
        lc.tool.strokeWidth = 10;
    });
    $(".size5").click(function () {
        lc.tool.strokeWidth = 15;
    });

    $(".fa-pencil").click(function () {
        lc.setTool(pencilTool);
    })

    $(".fa-arrows").click(function () {
        lc.setTool(panTool);
    })

    $(".clearDrawing").click(function () {
        lc.clear();
        save();
    })

    lc.on('shapeSave', function (e) {
        var shape = e.shape;
        console.log(shape);
        var sID = randId();
        var shapeData = {
            strokeWidth: lc.tool.strokeWidth,
            color: lc.tool.color,
            linePoints2D: [],
            shapeId: sID
        };
        var points = [];
        
        for (var i = 0; i < shape.points.length; i++) {
            shapeData.linePoints2D[i] = [];
            shapeData.linePoints2D[i][0] = shape.points[i].x;
            shapeData.linePoints2D[i][1] = shape.points[i].y;
        }
        
         
        app.push2DShape(shapeData).then(function () {
            removeShape(lc, shape.id);
        })
        
        console.log("shape ended");
    });

});
    Array.prototype.remove = function (from, to) {
        var rest = this.slice((to || from) + 1 || this.length);
        this.length = from < 0 ? this.length + from : from;
        return this.push.apply(this, rest);
    };

    var removeShape = function (lc, udid) {
        var shapes = lc.shapes;
        var shapeRemoved = false;
        for (var i = 0; i < lc.shapes.length && !shapeRemoved; i++) {
            if (lc.shapes[i].id == udid) {
                lc.shapes.remove(i);
                shapeRemoved = true;
                console.log("Shaped Loaded!");
            }
        }
        if(shapeRemoved){
            lc.loadSnapshot(lc.getSnapshot())
        }
    }
    var randId = function() {
    return Math.random().toString(36).substr(2, 12);
}