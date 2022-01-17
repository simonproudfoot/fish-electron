
import * as Three from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
function init() {
    let container = document.getElementById("container");
    // camera
    this.camera = new Three.PerspectiveCamera(10, 1920 / 1080, 10, 1000); // last is depth

    this.camera.position.set(-100, 0, 450); // 450

    this.scene = new Three.Scene();
    // background
    this.scene.background = new Three.Color(0x096ab2);
    // LIGHT
    const ambientLight = new Three.AmbientLight("#fff", 1.3);
    const directionalLight = new Three.DirectionalLight(0xffffff, 0.2);
    const underLight = new Three.DirectionalLight("green", 0.3);
    underLight.position.y = -200;
    //underLight.position.x = 20
    this.scene.add(ambientLight, directionalLight);

    // fog 
    const near = 1;
    const far = 250;
    const color = '#2a8f99';
    this.scene.fog = new Three.Fog(color, near, far);
    //  this.scene.background = new Three.Color(color);

   

    // Load object
    const gltfLoader = new GLTFLoader();
    this.$store.state.fishes.slice().reverse().forEach(fish => {

        gltfLoader.load(this.fishObjectUlr, (gltf) => {
            this.mixer = new Three.AnimationMixer(gltf.scene);
            gltf.animations.forEach((clip) => {
                this.mixer.clipAction(clip).play();
            });
            this.mixer.timeScale = 1;
            gltf.castShadow = false;
            this.allFish.push(gltf.scene);
            var i = this.allFish.length - 1

            this.scene.add(this.allFish[i]);
            this.allFish[i].position.z = 10
            // this.allFish[i].material.depthTest = false;

            this.allFish[i].rotation.y = -1.5
            if (i > 0) {

                var colors = ['red', 'green', 'orange', 'blue']
                var color = colors[(Math.random() * colors.length) | 0]
                this.allFish[i].getObjectByName('body').material.color.set(color);
                console.log(color)
                // this.allFish[i].position.y = 1.5
                //Math.random() * (20 - -10) + -10;

                // this.allFish[i].position.x = 1
                this.allFish[i].position.x = Math.random() * (100 - -100) + -100;
                this.allFish[i].position.y = Math.random() * (10 - -10) + -10;
                this.allFish[i].position.z = Math.random() * (340 - 240) + 240;
                console.log('x:' + this.allFish[i].position.x)
                console.log('y:' + this.allFish[i].position.y)
                console.log('z:' + this.allFish[i].position.z)
                // Math.floor(Math.random() * 350);
                //  let s = Math.random() * (2.5 - -1) + -1;

                //this.allFish[i].scale.set(s, s, s)
                // this.allFish[i].position.z = 10;

                if (i % 2 == 0) {
                    // this.allFish[i].applyMatrix4(new Three.Matrix4().makeScale(1, 1, -1));
                    //   this.allFish[i].rotation.y = 1.5
                }

            } else {
                this.allFish[i].position.z = 350
                this.allFish[i].position.x = -100

            }

            // this.defaultPosition();
            //  this.hideAllFins();
        });
    })

    // RENDER
    this.renderer = new Three.WebGLRenderer({ antialias: true, sortObjects: false });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(this.renderer.domElement);
    setTimeout(() => {
        this.changeSpeed(0);
    }, 1000);
}

module.exports = init;