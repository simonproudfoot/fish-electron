<template>
<div style="position: relative;">
    <video autoplay muted loop :src="require('@/assets/slave.mp4')"></video>
    <div id="containertank">
        <img v-show="!playing && $store.state.fishes.length" class="loading" :src="require('@/assets/loader.svg')" />
    </div>
</div>
</template>

<script>
import * as Three from "three";
import animate from '../functions/animatetank.js'
import {
    ModifierStack,
    Bend,
} from "three.modifiers";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
export default {
    name: "ThreeTest",
    data() {
        return {
            copyMaterial: null,
            colors: ['red', 'green', 'blue', 'default'],
            images: [],
            fishCounter: 0,
            mommyFish: null,
            modifier: [],
            bendSize: 0.4,
            bend: new Bend(0.1, 0.7, 0),
            allFish: [],
            allTextures: [],
            gui: false,
            fishScale: 0.3,
            playing: false,
            startRotation: {
                x: 0,
                y: 0,
                z: 0,
            },
            startPosition: {
                x: 0,
                y: 0,
                z: 0,
            },
            position: {
                x: 0,
                y: 0,
                z: 0,
            },
            camera: null,
            background: null,
            visible: false,
            hidePlay: false,
            clock: new Three.Clock(),
            showFish: "fishObject",
            ready: false,
            fishObject: "",
            scene: "",
            fishObjectUlr: require("@/assets/fish_rigged.gltf"),
            backgroundImage: require("@/assets/underwater.jpg"),
            backFin: "",
            sideFin: "",
            topFin: "",
            swimSpeed: 3,
            sinking: false,
            fins: {
                dorsal: {
                    thumbnail: "dorsal.svg",
                },
                anal: {
                    thumbnail: "anal.svg",
                },
                tail: {
                    thumbnail: "tail.svg",
                },
                body: {
                    thumbnail: "body.svg",
                },
                pectoral: {
                    thumbnail: "pectoral.svg",
                },
                pelvic: {
                    thumbnail: "pelvic.svg",
                },
            },
        };
    },
    computed: {
        score() {
            var correct = 0
            Object.entries(this.fins).forEach((x) => {

                x[0] == x[1].selected ? correct++ : null
            })
            return correct
        }
    },
    watch: {
        fishScale(x) {
            this.fishObject.scale.set(x, x, x);
        },
    },
    methods: {

        convertDecimal(num, double) {
            let decimal = !double ? "0.0" + num : "0.00" + num;
            let converted = parseFloat(decimal);
            let x = converted + converted;
            return x;
        },
        showFin(position) {
            Object.keys(this.fins).forEach((x) => {
                let name = position + "_fin-" + x;
                let active = position + "_fin-" + this.draggingFin;
                //  alert(active)
                if (this.fishObject.getObjectByName(name) && name !== active) {
                    this.fishObject.getObjectByName(name).visible = false;
                } else {
                    this.fishObject.getObjectByName(active).visible = true;
                }
            });
        },

        hideShowAllFins(fishIndex, finsSelected) {
            Object.keys(this.fins).forEach((element) => {
                Object.keys(this.fins).forEach((y) => {
                    var name = "pos-" + element + "_fin-" + y;
                    if (this.allFish[fishIndex].getObjectByName(name)) {
                        this.allFish[fishIndex].getObjectByName(name).visible = false;
                        this.allFish[fishIndex].getObjectByName(name).material.side = Three.DoubleSide
                    }
                    if (this.allFish[fishIndex].getObjectByName(name + '_right')) {
                        this.allFish[fishIndex].getObjectByName(name + '_right').visible = false;
                        this.allFish[fishIndex].getObjectByName(name + '_right').material.side = Three.DoubleSide

                    }
                });
            });
            Object.entries(finsSelected).forEach(x => {
                var active = 'pos-' + x[0] + '_' + 'fin-' + x[1]
                if (this.allFish[fishIndex].getObjectByName(active)) {
                    this.allFish[fishIndex].getObjectByName(active).visible = true;
                }
                if (this.allFish[fishIndex].getObjectByName(active + '_right')) {
                    this.allFish[fishIndex].getObjectByName(active + '_right').visible = true;
                }
            })
        },
        animate,
        async modelLoader(url) {
            const loader = new GLTFLoader();
            return new Promise((resolve, reject) => {
                loader.load(this.fishObjectUlr, data => resolve(data), null, reject);
                Three.Cache.enabled = true
            });
        },
        async init() {
            let containertank = document.getElementById("containertank");
            // camera
            this.camera = new Three.PerspectiveCamera(10, 1920 / 1080, 10, 800); // last is depth
            this.camera.position.set(400, 0, 410); // 450
            this.scene = new Three.Scene();
            // background
            this.scene.background = null
            // LIGHT
            const light = new Three.HemisphereLight(0x36d7ff, 0x09ba00, 1);
            light.groundColor.setHex(0x3eba00);
            light.color.setHex(0x00f5dc);
            this.scene.add(light);

            const dirLight = new Three.DirectionalLight(0xffffff, 1);
            dirLight.color.setHex(0xffffff);
            dirLight.position.set(-1, 1.75, 10);
            dirLight.position.multiplyScalar(30);
            this.scene.add(dirLight);

            const near = 1;
            const far = 800;
            const color = '#2a8f99';
            this.scene.fog = new Three.Fog(color, near, far);
            const gltfData = await this.modelLoader()
            this.mommyFish = gltfData.scene

            if (this.$store.state.fishes.length) {
                this.$store.state.fishes.slice().reverse().forEach((fish, i) => {

                    var copyMaterial = this.mommyFish.getObjectByName('fish').material.clone()
                    copyMaterial.color.setHex(parseInt(fish.color.substr(1), 16))

                    var fishObject = this.mommyFish.clone()

                    // if (i == 0) {
                    //     var bendyBody = this.mommyFish.getObjectByName('fish').clone()

                    //     bendyBody.name = 'fish-bendy'

                    //     console.log(bendyBody)
                    // }

                    console.log('color:' + fish.color)
                    fishObject.getObjectByName('fish').material = copyMaterial

                    Object.assign(fishObject.userData, { movement: fish.movement });
                    Object.assign(fishObject.userData, { updown: fish.updown });
                    Object.assign(fishObject.userData, { score: fish.score });
                    Object.assign(fishObject.userData, { color: fish.color })

                    if (i != 0) {
                        fishObject.scale.set(0.020, 0.020, 0.020)
                        fishObject.position.x = Math.random() * (400 - 0) + 0;
                        fishObject.position.y = Math.random() * (50 - -50) + -50;
                        fishObject.position.z = Math.random() * (80 - -200) + -200;
                    } else {
                        fishObject.scale.set(0.030, 0.030, 0.030)
                        fishObject.position.z = 150
                        fishObject.position.x = 400
                    }

                    this.allFish.push(fishObject);
                    this.scene.add(fishObject)
                    this.hideShowAllFins(i, fish)

                });

                this.allFish[0].name = 'mainFish'
                var mainBody = this.scene.getObjectByName('mainFish').children[3]
                this.modifier = new ModifierStack(mainBody);
                this.modifier.addModifier(this.bend);

                console.log('count:' + this.allFish.length)

            }

            // RENDER
            if (containertank) {
                this.renderer = new Three.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
                this.renderer.setSize(containertank.clientWidth, containertank.clientHeight);
                this.renderer.outputEncoding = Three.sRGBEncoding;
                this.renderer.setClearColor(0x000000, 0); // the default
                containertank.appendChild(this.renderer.domElement);
            }

            return true

        },
    },
    async mounted() {
        await this.init()
        this.playing = true
        this.ready = true
        this.animate()
    }
};
</script>

<style scoped>
video,
.videoLoading {
    position: absolute;
    width: 1920px;
    height: 1080px;
    top: 0;
    left: 0;
    z-index: -1;
    display: block;
    background-color: #40a5b1;
}

.videoLoading span {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

footer {
    background-color: #a0d3d796;
}

.infoBox button {
    background-color: red;
    display: block;
    width: 100%;
    padding: 1em;
    color: #fff;
    border: none !important;
}

#containertank {
    position: relative;
    width: 1920px;
    height: 1080px;
}

.controls {
    position: fixed;
    bottom: 0;
    left: 0;
    background-color: black;
    color: #fff;
    padding: 10px;
    width: 100%;
}

.inactive {
    opacity: 0.3;
    pointer-events: none;
}

.infoBox {
    position: fixed;
    right: 5px;
    top: 5px;
    background-color: #fff;
    padding: 1em;
    text-align: left;
    width: 250px;
}

.active {
    cursor: none;
    opacity: 0.3;
}

.guide {
    position: fixed;
    height: auto;
    top: 10px;
    right: 10px;
    text-align: right;
    background-color: #fff;
    padding: 1em;
    width: 200px;
}

footer {
    position: absolute;
    bottom: 96px;
    width: 100%;
    display: flex;
    width: 1624px;
    height: 305px;
    border-radius: 79px;
    padding-top: 4rem;
    margin: auto;
    left: 0;
    right: 0;
}

.test {
    position: absolute;
    bottom: -50px;
    width: 200px;
    left: 50%;
    transform: translateX(-50%);
}

.fin p {
    margin: 0;
}

.fin {
    display: inline-block;
    vertical-align: bottom;
    cursor: pointer;
    width: 260px;
    height: 232px;
}

.fin__select img {
    position: absolute;
    left: -5%;
    width: 110%;
    top: -4%;
    height: 116%;
    margin: auto;
}

.fin__select {
    width: 172px;
    height: 172px;
    display: inline-block;
    background-color: #e1f6f5;
    box-shadow: 0px 5px 4px 0px #408e9a;
    border-radius: 50px;
    position: relative;
}

.finDrop {
    transition-duration: 0.5s;
    position: absolute;
    border: #45b6c3 2px solid;
    border-radius: 25px;
    z-index: 999;
    width: 100px;
    height: 100px;
    display: inline-block;
    background-color: #e1f6f5a9;
    box-shadow: 0px 5px 4px 0px #408e9a;
    border-radius: 20px;
}

.finDrop.dorsal {
    top: 148px;
    right: 845px;
}

.finDrop.pectoral {
    top: 297px;
    right: 776px;
}

.finDrop.tail {
    top: 275px;
    left: 500px;
}

.finDrop.anal {
    top: 345px;
    left: 679px;
}

.finDrop.body {
    top: 195px;
    left: 679px;
}

.finDrop.pelvic {
    top: 425px;
    left: 1071px;
    z-index: 0;
}

.fin-pelvic,
.fin-anal,
.fin-body {
    opacity: 0.5;
    pointer-events: none;
}

h3 {
    vertical-align: middle;
    line-height: 40px;
    display: inline-flex;
}

h3 img {
    margin-right: 0.5em;
}

.fade-enter-active,
.fade-leave-active {
    transition: bottom 4.5s;
}

.fade-enter,
.fade-leave-to

/* .fade-leave-active below version 2.1.8 */
    {
    opacity: 0;
}
</style>
