<template>
<div class="" style="position: relative">
    <div id="container" style="">
        <img v-show="!fishObject || !ready" class="loading" :src="require('@/assets/loader.svg')" />
        <img v-if="saving" :src="require('@/assets/bubbles.png')" class="bubbles">
        <img v-if="fail" :src="require('@/assets/fail.svg')" class="fail">
        <img v-if="!playing" class="close" :src="require('@/assets/home.svg')" @click="$store.commit('SET_VIEW', 'attractor')" />
        <div v-if="!playing" class="howto button small aqua" @click="$store.commit('SET_HOWTO', true)">Help</div>
        <template v-if="!playing && draggingFin">
            <span v-for="(fin, i) in Object.keys(fins)" :key="i" class="finDrop" :class="fin" :data-fintarget="fin"></span>
            <!-- @dragenter="dEnter($event)" @dragleave="dLeave($event)" @drop="dropFin('pos-' + fin, $event)" -->
        </template>
        <transition name="fade">
            <footer v-if="!playing && ready" class="footer">
                <div v-for="(fin, name, i) in fins" class="fin box" :key="i" :class="'fin-'+name" :data-fin="name">
                    <div class="fin__select" :class="backFin === name ? 'active' : null" :id="name">
                        <img :src="require('@/assets/fins/' + fin.thumbnail)" style="pointer-events: none" :ref="name" />
                    </div>
                    <h3 @click="$store.commit('SET_FININFO', name)">
                        <img :src="require('@/assets/info.svg')" />{{name}}
                        fin
                    </h3>
                </div>
                <div class="button green test" @click="playing = !playing" :class="hidePlay ? 'inactive' : null">Test!</div>
            </footer>
            <footer class="footer--playing" v-if="playing">
                <div class="button orange" v-if="!saving" @click="playing = false, hideAllFins()">Choose different fins</div>
                <div class="button green" v-if="score >2 && !saving" @click="save">Swim!</div>
            </footer>
        </transition>
    </div>
    <fininfo v-if="$store.state.finInfo" />
    <howto v-if="$store.state.howto" />
</div>
</template>

<script>
import * as Three from "three";
import {
    ModifierStack,
    Bend,

} from "three.modifiers";
import fininfo from './fininfo.vue'
import howto from './howto.vue'
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as Hammer from 'hammerjs';
window.Hammer = Hammer.default;
export default {
    name: "ThreeTest",
    components: { fininfo, howto },
    props: ['resetCreator'],
    data() {
        return {
            draggingElement: null,
            colorSected: '',
            fishTexture: {
                image: new Image(),
                finColor: ''
            },

            sideFin: '',
            modifier: '',
            bendSize: 0.4,
            bend: new Bend(0.1, 0.7, 0),
            saving: false,
            fail: false,
            finInfo: '',
            gui: false,
            rotationDirection: {
                x: '',
                y: '',
                z: '',
            },
            fishColor: '',
            draggingFin: "",
            playing: false,

            camera: null,
            visible: false,
            hidePlay: false,
            clock: new Three.Clock(),
            showFish: "fishObject",
            ready: false,
            fishObject: "",
            scene: "",
            fishObjectUlr: require("@/assets/fish_rigged.gltf"),
            backgroundImage: require("@/assets/touchscreen_background.jpg"),
            backFin: "",
            topFin: "",
            swimSpeed: 3,
            sinking: false,
            fins: {
                // force - the less it is, the more control it has. 
                // put 4 for average/no difference
                dorsal: {
                    // if none - roll
                    selected: '',
                    thumbnail: "dorsal.svg",
                    smimWind: 4,
                    roll: 0,
                    updown: 4,
                },
                anal: {
                    // if none - roll
                    selected: '',
                    thumbnail: "anal.svg",
                    smimWind: 4,
                    roll: 0,
                    updown: 4,
                },
                tail: {
                    // Without, stop swim speed
                    selected: '',
                    thumbnail: "tail.svg",
                    smimWind: 4,
                    roll: 4,
                    updown: 4,
                },
                body: {
                    // up speed
                    selected: '',
                    thumbnail: "body.svg",
                    smimWind: 4,
                    roll: 4,
                    updown: 4,
                },
                pectoral: {
                    thumbnail: "pectoral.svg",
                    selected: '',
                    smimWind: 2,
                    roll: 4,
                    updown: 3,
                },
                pelvic: {
                    // roll over without
                    selected: '',
                    thumbnail: "pelvic.svg",
                    smimWind: 2,
                    roll: 0,
                    updown: 4,
                },
            },
            movement: {
                smimWind: 8,
                roll: 8,
                updown: 8,
            }
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

        saving(val) {
            if (val) {
                this.fishObject.visible = false
            }
        },
        'fishObject.rotation.x'(newVal, old) {
            if (newVal > old) {
                this.rotationDirection.x = '+'
            } else {
                this.rotationDirection.x = '-'
            }
        },
        'fishObject.rotation.y'(newVal, old) {
            if (newVal > old) {
                this.rotationDirection.y = '+'
            } else {
                this.rotationDirection.y = '-'
            }
        },
        'fishObject.rotation.z'(newVal, old) {
            if (newVal > old) {
                this.rotationDirection.z = '+'
            } else {
                this.rotationDirection.z = '-'
            }
        },
        playing(x) {
            if (x) {

                //playSound('fss')
                if (this.score > 2) {

                    this.$store.state.sounds.test.loop = true
                    this.$store.state.sounds.test.play()
                } else {
                    this.$store.state.sounds.fail.loop = false

                    this.$store.state.sounds.fail.play()

                    setTimeout(() => {
                        this.fail = true
                    }, 1000);
                }

            } else {
                //  alert
                this.defaultPosition()

                setTimeout(() => {
                    this.movement.roll = 8
                    this.movement.updown = 8
                    this.movement.smimWind = 8
                }, 500);
            }
        },
        // ROLL FINS 
        'fins.dorsal.selected'(val) {
            if (val == 'dorsal') {
                this.movement.roll = this.movement.roll - 3.5
            } else {
                this.movement.roll = this.movement.roll + 5
            }
        },
        'fins.anal.selected'(val) {
            if (val == 'anal') {
                this.movement.roll = this.movement.roll - 3.5
            } else {
                this.movement.roll = this.movement.roll + 5
            }
        },
        'fins.pectoral.selected'(val) {
            if (val == 'pectoral') {
                this.movement.roll = this.movement.roll - 1
            } else {
                this.movement.roll = this.movement.roll + 1
            }
        },
        'fins.tail.selected'(val) {
            if (val == 'tail') {
                this.movement.smimWind = this.movement.smimWind - 5
            } else {
                this.movement.smimWind = this.movement.smimWind + 5
            }
        },
        // UP DOWN FINS
        'fins.pelvic.selected'(val) {
            if (val == 'pelvic') {
                this.movement.updown = 2
            } else {
                this.movement.updown = 5
            }
        },
        movement: {
            deep: true,
            handler(val) {
                if (val.updown > 8) {
                    this.movement.updown = 8
                }
            }
        },

    },
    methods: {

        dropFin(val, element) {
            this.showFin(val);
            this.draggingFin = ''
        },
        closePop() {
            this.finInfo = ''
        },
        save() {
            this.saving = true
            setTimeout(async () => {
                let final = {}
                let i = 0

                Object.entries(this.fins).forEach(x => {
                    let key = x[0]
                    let val = x[1].selected
                    Object.assign(final, {
                        [key]: val
                    });
                })

                Object.assign(final, { color: this.colorSected })
                Object.assign(final, { finColor: this.fishTexture.finColor })
                Object.assign(final, { movement: this.movement })
                Object.assign(final, { score: this.score })
                await this.$store.commit('ADD_FISH', final)
                await this.$store.commit('SET_VIEW', 'attractor')

                localStorage.setItem("previous", JSON.stringify(this.$store.state.fishes));
                this.playing = false
                this.$store.commit('SET_VIEW', 'final')
            }, 1500);

        },

        // Swim animations
        // axis, angle, speed, loop
        sink() {
            this.hidePlay = true;
            this.move("y", -60, 5, false);
            this.rotate("y", 100, 5, false);
            this.rotate("z", 100, 2, false);
            this.rotate("x", 100, 2, false);
            setTimeout(() => {

                this.hidePlay = false;
                this.defaultPosition();
                this.playing = false;
                this.sinking = false;
            }, 5000);
        },
        // movement functions

        convertDecimal(num, double) {
            let decimal = !double ? "0.0" + num : "0.00" + num;
            let converted = parseFloat(decimal);
            let x = converted + converted;
            return x;
        },
        killPosition(rotationPosition, val) {
            rotationPosition == "axis" ?
                (this.fishObject[rotationPosition].val = this.startRotation[val]) :
                (this.fishObject[rotationPosition].val = this.startPosition[val]);
        },
        defaultPosition() {
            this.fishObject.scale ? this.fishObject.scale.set(0.030, 0.030, 0.030) : null
            this.fishObject.position ? this.fishObject.position.set(-0.860, 2.280, 0.030) : null
            this.fishObject.rotation ? this.fishObject.rotation.set(0, 0, 0) : null
        },
        showFin(position) {
            this.fins[position.split('-').pop()].selected = this.draggingFin
            Object.keys(this.fins).forEach((x) => {
                let name = position + "_fin-" + x;
                console.log(name)
                let active = position + "_fin-" + this.draggingFin;
                var right = position + "_fin-" + this.draggingFin + '_right';
                if (this.fishObject.getObjectByName(name) != undefined && name !== active) {
                    this.fishObject.getObjectByName(name).visible = false;
                    if (position.split('-').pop() == 'pectoral' || position.split('-').pop() == 'pelvic') {
                        this.fishObject.getObjectByName(name + '_right').visible = false;
                    }
                } else {
                    this.fishObject.getObjectByName(active).visible = true;
                    this.sideFin = active
                    // show other side
                    if (position.split('-').pop() == 'pectoral' || position.split('-').pop() == 'pelvic') {
                        if (right != undefined) {
                            this.fishObject.getObjectByName(right).visible = true;

                        }
                    }
                }
            });
            this.draggingFin = "";
        },
        resetFins() {
            Object.values(this.fins).forEach(x => x.selected = '')
        },
        hideAllFins() {
            this.resetFins()
            // FINS
            Object.keys(this.fins).forEach((element) => {
                Object.keys(this.fins).forEach((y) => {
                    var name = "pos-" + element + "_fin-" + y;
                    var right = "pos-" + element + "_fin-" + y + '_right';

                    if (this.fishObject.getObjectByName(name)) {
                        this.fishObject.getObjectByName(name).visible = false;
                        this.fishObject.getObjectByName(name).material.side = Three.DoubleSide

                    } else {
                        console.log('missing: ' + name)
                    }
                    if (element == 'pectoral' || element == 'pelvic') {
                        if (this.fishObject.getObjectByName(right)) {
                            this.fishObject.getObjectByName(right).visible = false;
                            this.fishObject.getObjectByName(name).material.side = Three.DoubleSide

                        } else {
                            console.log('missing: ' + right)
                        }
                    }
                });
            });
        },
        animate() {
            let speed = 1
            let move = true

            requestAnimationFrame(this.animate);

            if (this.playing) {

                this.modifier && this.modifier.apply();

                this.bend._force = Math.sin(this.clock.getElapsedTime() * 3) * -0.5 * 0.5 // BEND 
                this.fishObject.getObjectByName('back-fins').rotation.y = Math.sin(this.clock.getElapsedTime() * 3) * 0.600 * -0.750
                // side fin
                if (this.fishObject.getObjectByName(this.sideFin + '_right')) {
                    this.fishObject.getObjectByName(this.sideFin).rotation.y = Math.sin(this.clock.getElapsedTime() * 6) * 0.600 * -0.750
                    this.fishObject.getObjectByName(this.sideFin + '_right').rotation.y = Math.sin(this.clock.getElapsedTime() * 6) * 0.600 * -0.750
                }

                if (this.fishObject.position.y > -18.5) {
                    if (this.score <= 2) {
                        this.fishObject.position.y -= 0.07
                    } else if (this.score > 5) {
                        this.fishObject.position.y = Math.sin(this.clock.getElapsedTime()) * 1
                    } else {
                        this.fishObject.position.y = Math.sin(this.clock.getElapsedTime()) * this.movement.updown / 2
                    }
                    // WINDING
                    if (this.movement.smimWind <= 7) {
                        this.fishObject.rotation.y = Math.sin(this.clock.getElapsedTime()) * this.movement.smimWind / 9
                    } else {
                        this.fishObject.rotation.y += 0.009
                    }
                    // ROLL
                    if (this.movement.roll <= 7) {
                        this.fishObject.rotation.x = this.fishObject.rotation.x = Math.sin(Date.now() * this.convertDecimal(speed * 1.5, true)) * Math.PI * this.movement.roll / 10; // roll
                    } else {
                        this.fishObject.rotation.x += 0.009
                    }
                    // UP DOWN

                }
            } else {
                this.playing = false
                this.fail = false
                // this.defaultPosition()
                this.$store.state.sounds.test.pause()
                this.$store.state.sounds.test.currentTime = 0;
                this.$store.state.sounds.fail.pause()
                this.$store.state.sounds.fail.currentTime = 0;
            }
            if (this.fishObject && this.ready) {
                this.renderer.render(this.scene, this.camera);
            }
        },
        modelLoader(url) {
            const loader = new GLTFLoader();
            return new Promise((resolve, reject) => {
                loader.load(this.fishObjectUlr, data => resolve(data), null, reject);
                Three.Cache.enabled = true
            });
        },
        async init() {
            let container = document.getElementById("container");
            // camera
            this.camera = new Three.PerspectiveCamera(10, 1920 / 1080, 10, 300); // last is depth
            this.camera.position.set(0, -1.21, 239); // 450
            this.scene = new Three.Scene();
            // background
            this.scene.background = new Three.Color(0x096ab2);
            // LIGHTS
            //	const hemiLight = new Three.HemisphereLight( '0453DC', 0x04AF40, 2 );
            const hemiLight = new Three.HemisphereLight(0xffffbb, 0x080820, 1);
            hemiLight.color.setHex(0x70AFE1);
            hemiLight.groundColor.setHex(0x0C9204);
            hemiLight.position.set(0, 50, 0);
            this.scene.add(hemiLight);
            const dirLight = new Three.DirectionalLight(0xffffff, 1);
            dirLight.color.setHex(0xffffff);
            dirLight.position.set(-1, 1.75, 10);
            dirLight.position.multiplyScalar(30);
            this.scene.add(dirLight);

            const loader = new Three.TextureLoader();
            loader.load(this.backgroundImage, (texture) => {
                this.scene.background = texture;
            });
            // Load object
            var gltf = await this.modelLoader()
            Three.Cache.enabled = true
            var colors = ['#fcba03', '#8ffdff', '#c375ff', '#73fdff']
            var color = colors[Math.floor(Math.random() * colors.length)];

            gltf.scene.getObjectByName('fish').material.color.setHex(parseInt(color.substr(1), 16));
            this.colorSected = color

            // if (this.fishTexture.image !== 'default') {
            //     gltf.scene.getObjectByName('fish').material.map.image = this.fishTexture.image
            //     gltf.scene.getObjectByName('fish').material.map.needsUpdate = true;
            // }

            this.fishObject = gltf.scene;
            this.fishObject.getObjectByName('fish').name = 'newFish'
            this.fishObject.castShadow = false; //default is false
            this.fishObject.receiveShadow = false; //default
            this.fishObject.rotation.set(1.600, 0, 0)

            this.scene.add(this.fishObject);
            this.defaultPosition();
            this.hideAllFins();

            this.modifier = new ModifierStack(this.fishObject.getObjectByName("newFish"));
            this.modifier.addModifier(this.bend);

            // RENDER
            this.renderer = new Three.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
            this.renderer.setSize(container.clientWidth, container.clientHeight);
            this.renderer.outputEncoding = Three.sRGBEncoding;
            container.appendChild(this.renderer.domElement);

            return true

        },

        preventDefault(e) {
            e.preventDefault();
        },
        disableScroll() {
            document.body.addEventListener('touchmove', this.preventDefault, { passive: false });
        },

    },
    beforeDestroy() {
        this.scene.remove.apply(this.scene, this.scene.children);
    },

    async mounted() {
        Three.Cache.enabled = true
        await this.init();
        this.ready = true
        this.animate()
        this.disableScroll()
        this.$nextTick(() => {

            var fin = document.getElementsByClassName("fin")
            if (this.ready) {
                Array.from(fin).forEach((el, i) => {

                    Hammer(fin[i]).on('panstart', (event) => {
                        console.log(event.target.id)
                        if (event.target.id != undefined) {
                            //   this.draggingElement = this.$refs[this.draggingFin][0]
                            this.draggingFin = event.target.id
                        }

                    });

                    Hammer(fin[i]).on('pan', (event) => {

                        if (this.draggingFin) {
                            this.draggingElement = this.$refs[this.draggingFin][0].style
                            //    var tStyle = this.$refs[this.draggingFin][0].style

                            if (this.draggingElement) {
                                this.draggingElement.zIndex = '99999'
                                this.draggingElement.position = 'fixed'
                                this.draggingElement.width = '172px'
                                this.draggingElement.height = '172px'
                                this.draggingElement.left = event.center.x - 100 + 'px'
                                this.draggingElement.top = event.center.y - 100 + 'px'
                            }
                        }

                    });
                    Hammer(el).on('panend', (event) => {

                        var targetPosition = document.elementsFromPoint(event.center.x, event.center.y)[0].classList[1]
                        if (this.draggingElement) {
                            this.draggingElement.zIndex = '10'
                            this.draggingElement.position = 'absolute'
                            this.draggingElement.left = '-5%'
                            this.draggingElement.top = '-4%'
                            this.draggingElement.width = '110%'
                            this.draggingElement.height = ''

                        }
                        if (targetPosition != undefined) {
                            this.dropFin('pos-' + targetPosition)
                        }
                        this.draggingElement = null
                        this.draggingFin = null

                    });
                })
            }
        })
    },
};
</script>

<style scoped>
.infoBox button {
    background-color: red;
    display: block;
    width: 100%;
    padding: 1em;
    color: #fff;
    border: none !important;
}

#container {
    position: relative;
    width: 1920px;
    height: 1080px;
    color: #06909c;
    overflow: hidden;
    background-color: #ddf3f5;

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

.footer {
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
    background-color: #a0d3d796;
}

.footer--playing {
    position: absolute;
    bottom: 96px;
    width: 100%;
    display: flex;
    width: 1624px;
    margin: auto;
    left: 0;
    right: 0;
    justify-content: space-between;
}

.howto {
    position: absolute;
    width: 80px;
    height: 80px;
    top: 29px;
    right: 120px;
    font-size: 30px;
}

.home {
    position: absolute;
    width: 80px;
    height: 80px;
    top: 20px;
    right: 20px;

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

    /* max-width: 100px;
        max-height: 100px; */
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
    opacity: 1;
    transition-duration: 0.5s;
    position: absolute;
    z-index: 999;
    width: 120px;
    height: 120px;
    display: inline-block;
    background-image: url('../assets/drop.svg');
    background-size: contain;
    border-radius: 80px;
    animation: pulse 1s infinite;
}

.finDrop.dorsal {
    top: 130px;
    right: 920px;
}

.finDrop.pectoral {
    top: 300px;
    left: 850px;
}

.finDrop.tail {
    top: 284px;
    right: 468px;
}

.finDrop.anal {
    top: 372px;
    right: 600px;
}

.finDrop.body {
    top: 195px;
    right: 600px;
}

.finDrop.pelvic {
    top: 425px;
    left: 800px;
    z-index: 0;
}

/* .fin-pelvic,
.fin-anal,
.fin-body {
    opacity: 0.5;
} */

h3 {
    vertical-align: middle;
    line-height: 40px;
    display: inline-flex;
}

h3 img {
    margin-right: 0.5em;
}

.fail {
    position: absolute;
    top: 300px;
    left: 300px;
    width: 700px;
    transform: translateY(0%);
    opacity: 0;
    animation: fail 3s linear;
}

@keyframes fail {
    0% {
        transform: translateY(55%);
        opacity: 1;
    }

    30% {
        transform: translateY(-40%);
        opacity: 1;
    }

    90% {
        transform: translateY(-100%);
        opacity: 0;
    }
}

@keyframes pulse {
    from {
        transform: scale(0.7);
    }

    to {
        transform: scale(1);

    }
}

.bubbles {
    position: absolute;
    top: 300px;

    right: 0;
    margin: auto;
    left: 0;
    transform: translateX(-50%);
    width: 700px;
    opacity: 0;
    animation: fail 3s linear;
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

.close {
    z-index: 1000;
    position: absolute;
    width: 80px;
    height: 80px;
    top: 20px;
    right: 20px;

}
</style>
