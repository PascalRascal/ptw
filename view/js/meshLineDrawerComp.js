var enterVR;
var enteredVR = false;
var firebaseInit = false;


AFRAME.registerComponent('testing', {
  schema: {
    color: { default: '#000' },
    lineWidth: { default: 5 },
    lineWidthStyler: { default: '1' }
    /*
    path: {
      default: [
        { x: -0.5, y: 0, z: 0 },
        { x: 0.5, y: 0, z: 0 }
      ],
      // Deserialize path in the form of comma-separated vec3s: `0 0 0, 1 1 1, 2 0 3`.
      parse: function (value) {
        return value.split(',').map(AFRAME.utils.coordinates.parse);
      },
      // Serialize array of vec3s in case someone does setAttribute('line', 'path', [...]).
      stringify: function (data) {
        return data.map(AFRAME.utils.coordinates.stringify).join(',');
      }
    }
    */
  },

  init: function () {
    console.log("Initiated meshline!");
    this.resolution = new THREE.Vector2(window.innerWidth, window.innerHeight);
    this.linePosition = new THREE.Vector3(0, 0, 0);
    this.lineInitiated = false;
    this.xoff = Math.random() * 100;
    this.yoff = Math.random() * 100;
    this.coords = { x: 0, y: 0, z: 0 };
    this.tweenX = new TWEEN.Tween(this.linePosition);
    this.tweenY = new TWEEN.Tween(this.linePosition);
    this.tweenZ = new TWEEN.Tween(this.linePosition);
    this.linePosition.isDoneX = true;
    this.linePosition.isDoneY = true;
    this.linePosition.isDoneZ = true;
    this.sphereTimeTrack = -1;
    this.sphereDirection = 1;
    this.state = 'waiting';
    this.msPaintVR;
    this.uninitiatedDrawingLines = [];
    this.drawingLines = [];

    var sceneEl = this.el.sceneEl;
    console.log('initiated');
    sceneEl.addEventListener('render-target-loaded', this.do_update.bind(this));
    sceneEl.addEventListener('render-target-loaded', this.addlisteners.bind(this));




  },

  createMeshLine: function(strokeData, color, lineWidth){
    var options = {};
    options.color = color;
    options.lineWidth = lineWidth;
    this.uninitiatedDrawingLines.push(new DrawingLine(strokeData, this.el, options));
  },
  removeLine: function(id){
    
  },

  addlisteners: function () {

    //var canvas = this.el.sceneEl.canvas;

    // canvas does not fire resize events, need window
    //window.addEventListener( 'resize', this.do_update.bind (this) );

    //console.log( canvas );
    //this.do_update() ;

  },

  do_update: function () {

    var canvas = this.el.sceneEl.canvas;
    this.resolution.set(canvas.width, canvas.height);
    console.log(this.resolution);
    this.update();

  },

  update: function () {
    //cannot use canvas here because it is not created yet at init time
    console.log("canvas res:");
    console.log(this.resolution);
    if (!this.lineInitated) {
      for(var i = 0; i < this.drawingLines.length; i++){
        this.drawingLines[i].initiateLine();
      }
    }
    this.index = 0;
    this.velocity = new THREE.Vector3(-1, -2, 1);



  },
  tick(t, deltaT) {
    while(this.uninitiatedDrawingLines.length != 0){
      var lmesh = this.uninitiatedDrawingLines.pop();
      lmesh.initiateLine();
      this.drawingLines.push(lmesh);
    }
    if (this.state == 'waiting') {
      for(var i = 0; i < this.drawingLines.length; i++){
        //this.drawingLines[i].traceSphere(deltaT, Math.floor(1 + Math.random() * 3));
        this.drawingLines[i].drawShapeComplete();

      }  
    }
    if(enteredVR && !firebaseInit){
      firebaseInit = true;
      console.log('Entered VR');
      var options = {
        did: 300,
        meme: 'fuckOff',
        meshLineMaker: this
      }
      this.msPaintVR = new MSPaintVR(options)
      this.msPaintVR.init();
      console.log(this.msPaintVR);
    }


  },

  remove: function () {
    this.el.removeObject3D('mesh');
  },
  

});

AFRAME.registerComponent('testyo', {
  init: function(){
    console.log('test Component')
  }
})

console.log("Did I miss somethjing?");
function traceSphere(time, radius) {
  var t = time;
  var r = radius;

}





function DrawingLine(drawingData, object3D, options) {
  this.options = options;
  this.resolution = new THREE.Vector2(window.innerWidth, window.innerHeight);
  this.linePosition = new THREE.Vector3(0, 0, 0);
  this.lineInitiated = false;
  this.xoff = Math.random() * 100;
  this.yoff = Math.random() * 100;
  this.coords = { x: 0, y: 0, z: 0 };
  this.tweenX = new TWEEN.Tween(this.linePosition);
  this.tweenY = new TWEEN.Tween(this.linePosition);
  this.tweenZ = new TWEEN.Tween(this.linePosition);
  this.linePosition.isDoneX = false;
  this.linePosition.isDoneY = false;
  this.linePosition.isDoneZ = false;
  this.sphereTimeTrack = -1;
  this.sphereDirection = 1;
  this.state = 'waiting';
  this.drawingData = drawingData;
  this.el = object3D;
  this.color = options.color;
  this.lineWidth = options.lineWidth;
  this.index = 0;
  this.xShift = 10;
  this.yShift = 150;

}

DrawingLine.prototype.initiateLine = function () {
  
  
  var material = new MeshLineMaterial({
    color: new THREE.Color(this.color),
    resolution: this.resolution,
    sizeAttenuation: 0,
    lineWidth: this.lineWidth,
    opacity: 1,
    near: 0.001,
    far: 100000,
    depthTest: true,
    blending: THREE.AdditiveBlending,
    transparent: false,
    side: THREE.DoubleSide,

    //near: 0.1,
    //far: 1000
  });

  var geometry = new THREE.Geometry();

  for (var i = 0; i < this.drawingData.length; i++) {
    geometry.vertices.push(this.linePosition.clone());
  }
  /*
  this.data.path.forEach(function (vec3) {
    geometry.vertices.push(
      new THREE.Vector3(vec3.x, vec3.y, vec3.z)
    );
  });
  */

  var widthFn = new Function('p', 'return ' + '1');
  this.line = new MeshLine();
  this.line.setGeometry(geometry, widthFn);
  var lineMesh = new THREE.Mesh(this.line.geometry, material);
  lineMesh.frustumCulled = false;
  //This is really stupid
  this.id = Math.floor((Math.random() * 100000000000)).toString();
  this.el.setObject3D(this.id, lineMesh);
  console.log("geometry set BITCH");
  this.lineInitiated = true;
  this.linePosition.isMovingToPosition = false;
  this.velocity = new THREE.Vector3(-1, -2, 1);
}

DrawingLine.prototype.wander = function () {
  var timeToComplete = 1000 + Math.floor(Math.random() * 4000);
  var angle = Math.random() * Math.PI * 2;
  var radius = Math.random() * 10;
  var randomX = Math.cos(angle) * Math.sqrt(100 - Math.pow(radius, 2));
  var randomY = Math.sin(angle) * Math.sqrt(100 - Math.pow(radius, 2));
  var coinFlip = Math.random();
  var negative = 1;
  if (coinFlip < 0.5) {
    negative = -1;
  } else {
    negative = 1;
  }
  var easings = [
    TWEEN.Easing.Quartic.In,
    TWEEN.Easing.Quartic.InOut,
    TWEEN.Easing.Linear.None,
    TWEEN.Easing.Quintic.In,
    TWEEN.Easing.Circular.In,
    TWEEN.Easing.Circular.Out,
    TWEEN.Easing.Circular.InOut,
    TWEEN.Easing.Quadratic.In,
    TWEEN.Easing.Quadratic.Out
  ]
  var easingX = easings[Math.floor(Math.random() * easings.length)]
  var easingY = easings[Math.floor(Math.random() * easings.length)]
  var easingZ = easings[Math.floor(Math.random() * easings.length)]

  var randomEasing
  var randomZ = negative * radius;
  this.linePosition.isDoneX = false;
  this.linePosition.isDoneY = false;
  this.linePosition.isDoneZ = false;
  this.tweenX
    .to({ x: randomX }, timeToComplete)
    .easing(easingX)
    .onComplete(function () {
      this.isDoneX = true;
    });
  this.tweenY
    .to({ y: randomY }, timeToComplete)
    .easing(easingY)
    .onComplete(function () {
      this.isDoneY = true;
    });
  this.tweenZ
    .to({ z: randomZ }, timeToComplete)
    .easing(easingZ)
    .onComplete(function () {
      this.isDoneZ = true;
    });
  this.tweenX.start();
  this.tweenY.start();
  this.tweenZ.start();
  console.log(this.tweenX);
  this.wandering = true;

}

/**
 * Traces out a sphere with the radius, needs deltaT (time between calls);
 */
DrawingLine.prototype.traceSphere = function (time, radius) {
  this.sphereTimeTrack += this.sphereDirection * time / 10000;
  if (this.sphereTimeTrack > 1 || this.sphereTimeTrack < -1) {
    var coinflip = Math.floor(Math.random() * 2);
    if (coinflip == 0) {
      this.sphereDirection = 1;
    } else {
      this.sphereDirection = -1;
    }
    this.sphereTimeTrack = this.sphereDirection * -1;
  }

  var spirals = 20;
  var t = this.sphereTimeTrack;
  var r = radius;
  var uT = r * t;
  var aT = spirals * Math.PI * t;
  var newX = Math.sqrt(Math.pow(r, 2) - Math.pow(uT, 2)) * Math.cos(aT);
  var newZ = Math.sqrt(Math.pow(r, 2) - Math.pow(uT, 2)) * Math.sin(aT);
  var newY = uT;
  this.linePosition.set(newX, newY + 2, newZ);
  this.line.advance(this.linePosition);

}
/**
 * Move the head of the line to the first position of its shape
 */
DrawingLine.prototype.firstShapePosition = function(){
  var timeToComplete = 10000 + Math.floor(Math.random() * 5000);
  var easings = [
    TWEEN.Easing.Quartic.In,
    TWEEN.Easing.Quartic.InOut,
    TWEEN.Easing.Linear.None,
    TWEEN.Easing.Quintic.In,
    TWEEN.Easing.Circular.In,
    TWEEN.Easing.Circular.Out,
    TWEEN.Easing.Circular.InOut,
    TWEEN.Easing.Quadratic.In,
    TWEEN.Easing.Quadratic.Out
  ]
  var easingX = easings[Math.floor(Math.random() * easings.length)]
  var easingY = easings[Math.floor(Math.random() * easings.length)]
  var easingZ = easings[Math.floor(Math.random() * easings.length)]

  this.linePosition.isDoneX = false;
  this.linePosition.isDoneY = false;
  this.linePosition.isDoneZ = false;
  var length = 800;
  var radius = length / (2 * Math.PI)

  var newX = this.drawingData[this.index][0];
    var newY = this.drawingData[this.index][1];
    var newZ = this.drawingData[this.index][2];
  this.tweenX
    .to({ x: newX}, timeToComplete)
    .easing(easingX)
    .onComplete(function () {
      this.isDoneX = true;
    });
  this.tweenY
    .to({ y: newY}, timeToComplete)
    .easing(easingY)
    .onComplete(function () {
      this.isDoneY = true;
    });
  this.tweenZ
    .to({ z: newZ }, timeToComplete)
    .easing(easingZ)
    .onComplete(function () {
      this.isDoneZ = true;
    });
  this.tweenX.start();
  this.tweenY.start();
  this.tweenZ.start();
  console.log(this.tweenX);
  this.wandering = true;

}

DrawingLine.prototype.drawShape = function(){
  var length = 800;
  var radius = length / (2 * Math.PI)
  if(this.index >= this.drawingData.length){

  }else{
    var newX = this.drawingData[this.index][0];
    var newY = this.drawingData[this.index][1];
    var newZ = this.drawingData[this.index][2];
    this.index++;
    this.linePosition.set(newX, newY, newZ);
    
  }
}

DrawingLine.prototype.drawShapeComplete = function() {
  if(this.linePosition.isDoneX && this.linePosition.isDoneY && this.linePosition.isDoneZ){
    this.drawShape();
  }else if(!this.linePosition.isMovingToPosition){
    this.linePosition.isMovingToPosition = true;
    this.firstShapePosition();
  }
  if(this.index < this.drawingData.length){
    this.line.advance(this.linePosition);
  }



}

DrawingLine.prototype.remove = function () {
  this.el.removeObject3D(this.id);
}
