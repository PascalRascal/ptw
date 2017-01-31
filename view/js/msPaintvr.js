function MSPaintVR(options) {
    this.uid;
    this.auth = firebase.auth();
    this.db = firebase.database();
    var did = findGetParameter('did');
    this.uid = null;
    this.drawingId = null;
    if(did){
        this.drawingId = did;
        console.log('did lads');
    }else{
        
    }
    if(options.titleDiv){
        this.titleDiv = titleDiv;
    }else{
        this.titleDiv = {};
    }
    if(options.shareDiv){
        this.shareDiv = options.shareDiv;
    }else{
        this.shareDiv = {};
    }
    if(options.authorDiv){
        this.authorDiv = options.authorDiv;
    }
    if (options.meshLineMaker) {
        this.mlMaker = options.meshLineMaker;
    }
    if (options.lCanvas) {
        this.lCanvas = options.lCanvas;
    }
    if(options.vrButton){
        this.vrButton = options.vrButton;
    }
    if(options.editLink){
        this.editLink = options.editLink;
    }
}

MSPaintVR.prototype.showShare = function(){
    this.shareDiv.innerHTML = 'View in VR: ' + window.location.href + '/view/?did=' + this.drawingId;
}
MSPaintVR.prototype.showEditLink = function(){
    //TODO: Replace with acutal URL
    this.editLink.innerHTML = 'https://pascalrascal.github.io/ptw/?did=' + this.drawingId;
}
MSPaintVR.prototype.init = function () {
    //Initiate Authentication and Database
    this.auth = firebase.auth();
    this.db = firebase.database().ref();
    if (this.drawingId) {
        //this.setDrawing(this.drawingId);
    } else {
        var oldId = localStorage.getItem('did');
        if(oldId){
            this.drawingId = oldId
        }
    }
    this.db.child('paintings');

    //Declare All the Cool Events
    this.auth.onAuthStateChanged(this.setUID.bind(this));

    /**
    We can use the .bind on a function to keep the context the same! amAZXING
    **/

}
MSPaintVR.prototype.setUID = function(user){
    if(user){
        this.uid = user.uid
        this.setDrawing(this.drawingId);
    } else{
        this.uid = null;
    }
}
MSPaintVR.prototype.setDrawing = function(drawingId) {
    if(!drawingId){
        console.log('Getting new id!');
        this.drawingId = randId();
        localStorage.setItem('did', this.did);
        this.showShare();
        this.painting = this.db.child('paintings').child(this.drawingId);
        this.painting.child('title').set('Untitled Work');
        this.painting.child('author').set('Anonymous');
        this.painting.child('editable').set(false);
        this.painting.child('uid').set(this.uid);
        this.shapes2D = this.painting.child('shapes2D');
    }else{
        localStorage.setItem('did', drawingId);
        this.showShare();
        this.painting = this.db.child('paintings').child(drawingId);
        this.title = this.painting.child('title');
        this.author = this.painting.child('author');
        this.shapes2D = this.painting.child('shapes2D');
        console.log(this.uid);

    }
    if(this.editLink){
        this.showEditLink();
    }

    if(this.vrButton){
         this.vrButton.setAttribute('href', '/view/?did=' + this.drawingId);
         this.vrButton.classList = 'btn btn-primary btn-lg btn-block';   
    }

     if (this.lCanvas) {
        this.shapes2D.on('child_added', this.draw2DShape.bind(this));
        this.shapes2D.on('child_removed', this.undraw2DShape.bind(this));
    }
    if (this.mlMaker) {
        this.shapes2D.on('child_added', this.draw3DShape.bind(this));
        this.shapes2D.on('child_removed', this.undraw3DShape.bind(this));
    }
}
MSPaintVR.prototype.login = function () {
    this.auth.signInAnonymously().catch(function (error) {
        console.log("errOR");
    });
}
/**
 * 
 * 2D Shape Functions
 **/
MSPaintVR.prototype.push2DShape = function (shape) {
    return this.shapes2D.push(shape);
}
MSPaintVR.prototype.draw2DShape = function (s) {
    var shape = s.val();
    var lc = this.lCanvas;
    //If no drawing exists 
    if(!this.drawingId){
        this.setDrawing();
    }
    /**
     * The promise part is probs unneccessary
     */
    var p1 = new Promise(function (resolve, reject) {
        if (shape.linePoints2D) {
            var newShape = [];
            for (var i = 0; i < shape.linePoints2D.length; i++) {
                newShape.push(LC.createShape('Point', {
                    x: shape.linePoints2D[i][0],
                    y: shape.linePoints2D[i][1],
                    size: shape.strokeWidth,
                    color: shape.color
                }))


            }
            resolve(newShape)
        }
    });
    p1.then(function (shape) {
        var memeShape = LC.createShape('LinePath', { points: shape });
        lc.saveShape(memeShape, false);
    })
    p1.catch(function (reason) {
        console.log(reason);
    });


}

MSPaintVR.prototype.undraw2DShape = function (s) {
    var shape = s.val();
    console.log(shape);
}

/**
 * VR Environment Functions
 * */
MSPaintVR.prototype.draw3DShape = function (s) {
    var shape = s.val();
    /**
     * Todo: Make height+width not bound in stone
     */
    var maxHeight = 200;
    var maxWidth = 800;
    var points = generate3DPoints(shape.linePoints2D, maxWidth, maxHeight);
    this.mlMaker.createMeshLine(points, shape.color, shape.strokeWidth);
}
MSPaintVR.prototype.undraw3DShape = function (s) {
    var shape = s.val();
}
/**
 Thanks for
http://stackoverflow.com/questions/5448545/how-to-retrieve-get-parameters-from-javascript
**/
//what am i gonna do? parse the string myslef? LMFAO
function findGetParameter(parameterName) {
    var result = null,
        tmp = [];
    location.search
        .substr(1)
        .split("&")
        .forEach(function (item) {
            tmp = item.split("=");
            if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
        });
    return result;
}
var randId = function () {
    return Math.random().toString(36).substr(2, 12);
}
var options = {
    did: 212,
    meme: 'fuckOff'
}
var generate2DPoints = function (shape) {
    var newShape = LC.createShape('LinePath')
    for (var i = 0; i < shape.linePoints2D.length; i++) {
        newShape.addPoint(LC.createShape('Point', {
            x: shape.linePoints2D[i][0],
            y: shape.linePoints2D[i][1],
            size: shape.strokeWidth,
            color: shape.color
        }))


    }
    return newShape;
}


var lineCount = 0;
var generate3DPoints = function (points, maxWidth, maxHeight) {
    //TODO: Implement Proper depth for lines on top of each other
    if(points.length){
        var width = maxWidth;
        var height = maxHeight;
        var radius = maxWidth / (2 * Math.PI);
        var points3D = [];
        var spline = new BSpline(points,3);
        var bsplinePoints = [];
        for(var i = 0; i <= 1; i+= 1/(points.length * 4)){
            bsplinePoints.push(spline.calcAt(i));
        }

        for (var i = 0; i < bsplinePoints.length; i++) {
            points3D[i] = [];
            points3D[i][0] = (Math.cos(2 * Math.PI * bsplinePoints[i][0] / width)) * (radius-lineCount);
            points3D[i][1] = (maxHeight / 2 - bsplinePoints[i][1]);
            points3D[i][2] = (Math.sin(2 * Math.PI * bsplinePoints[i][0] / width)) * (radius-lineCount);
        }
        
        return points3D;
    }else{

    }
}