var Pencil, ToolWithStroke, createShape,


ToolWithStroke = LC.ToolWithStroke;

createShape = LC.createShape;



  function Pencil() {
    return Pencil.__super__.constructor.apply(this, arguments);
  }

  Pencil.prototype.name = 'Pencil';

  Pencil.prototype.iconName = 'pencil';

  /**
   * ~60 points per second
   */
  Pencil.prototype.eventTimeThreshold = 16.6;
  Pencil.prototype.setMSPaint = function(msPaint){
    this.msPaint = msPaint;
  }
  Pencil.prototype.begin = function(x, y, lc) {
    this.color = lc.getColor('primary');
        console.log("?");
    this.currentShape = this.makeShape();
    this.currentShape.addPoint(this.makePoint(x, y, lc));
    return this.lastEventTime = Date.now();
  };

  Pencil.prototype["continue"] = function(x, y, lc) {
    var timeDiff;
    timeDiff = Date.now() - this.lastEventTime;
    if (timeDiff > this.eventTimeThreshold) {
      this.lastEventTime += timeDiff;
      this.currentShape.addPoint(this.makePoint(x, y, lc));
      return lc.drawShapeInProgress(this.currentShape);
    }
  };

  Pencil.prototype.end = function(x, y, lc) {
    var shapeData = {
      strokeWidth: this.strokeWidth,
      color: this.color,
    };
    var lp = [];
    for(var i = 0; i < this.currentShape.points.length(); i++){
      console.log("Hey!");
    }

    lc.saveShape(this.currentShape);
    return this.currentShape = void 0;
  };

  Pencil.prototype.makePoint = function(x, y, lc) {
    return createShape('Point', {
      x: x,
      y: y,
      size: this.strokeWidth,
      color: this.color
    });
  };

  Pencil.prototype.makeShape = function() {
    return createShape('LinePath');
  };

