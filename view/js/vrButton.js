var scene = document.querySelector('a-scene');

scene.addEventListener('loaded', function(){
  var sceneVRButton = document.querySelector('.a-enter-vr-button').style.opacity = 0;
        // Create WebVR UI Enter VR Button
    var options = {
        color: 'white',
        background: false,
        corners: 'square'
    };
    var enterVR = new webvrui.EnterVRButton(scene.renderer.domElement, options)
            .on("enter", function(){
                enteredVR = true;
                console.log("enter VR")
            })
            .on("exit", function(){
                console.log("exit VR");
            })
            .on("error", function(error){
                document.getElementById("learn-more").style.display = "inline";
                console.error(error)
            })
            .on("hide", function(){
                document.getElementById("ui").style.display = "none";
                // On iOS there is no button to close fullscreen mode, so we need to provide one
                if(enterVR.state == webvrui.State.PRESENTING_FULLSCREEN) document.getElementById("exit").style.display = "initial";
            })
            .on("show", function(){
                document.getElementById("ui").style.display = "inherit";
                document.getElementById("exit").style.display = "none";
            });

    console.log(enterVR);
    // Add button to the #button element
    document.getElementById("button").appendChild(enterVR.domElement);
    document.getElementById("fullscreenLads").addEventListener('click', function(){
      enterVR.requestEnterFullscreen();
    })
})