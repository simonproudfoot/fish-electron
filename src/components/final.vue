<template>
<div class="endscreen">
    <div class="endscreen_back"></div>
    <div class="sea"></div>
    <div class="button green reset shadowed" @click="$store.commit('SET_VIEW', 'attractor')">Start again</div>
    <img :src="require('@/assets/boat.svg')" class="boat" />
    <span class="boatQuote">
        <img class="triangle" :src="require('@/assets/speech-white.svg')" />
        <p style="color: #4BB9B2; margin-bottom: 1em">I’m a Marine Biologist.</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas efficitur magna at odio maximus ultricies.</p>
    </span>
    <template v-for="(fish,i) in species">
        <div class="fish" :style="{top: fish.top+'px', left: fish.left+'px'}" :key="i">
            <span class="infoBox" @click="getFish(i)">
                <img class="triangle" :src="require('@/assets/speech.svg')" />
                <img width="40" height="40" :src="require('@/assets/info-white.svg')" />{{fish.name}}</span>
            <img class="fish_image" :src="require('@/assets/'+fish.img)" />

        </div>
    </template>
    <div class="infowindow" v-if="popup">
        <div class="infowindow__content">
            <img class="close" :src="require('@/assets/button-close.svg')" @click="popup=false" />
            <div class="infowindow__content__box">
                <div style="width: 100%; text-align: left; margin-bottom: 1em">
                    <img :src="require('@/assets/info-white.svg')" style="margin-right: 0.5em; vertical-align: middle; height: 30px; width: 30px;" /> Local fish
                </div>
                <div class="flex">
                    <div style="width: 50%">
                        <h1 class="my-0" style="text-transform: capitalize">{{species[selected].name}}</h1>
                    </div>
                    <div style="width: 50%">
                        <p style="margin-top: 0" v-html="species[selected].content"></p>
                    </div>
                </div>
            </div>
            <img :src="require('@/assets/gifs/'+species[selected].vid)" style="z-index: 1; position: relative;">
        </div>
    </div>
</div>
</template>

<script>
export default {
    methods: {
        getFish(i) {
            this.popup = true
            this.selected = i
        }
    },
    data() {
        return {
            selected: 0,
            popup: false,
            species: [{
                    name: 'Atlantic Mackerel',
                    img: 'mackerel.svg',
                    vid: 'mackeral.gif',
                    top: 587,
                    left: 101,
                    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas efficitur magna at odio maximus ultricies.'
                },
                {
                    name: 'Sea Bass',
                    img: 'bass.svg',
                    vid: 'bass.gif',
                    top: 772,
                    left: 545,
                    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas efficitur magna at odio maximus ultricies.'
                },
                {
                    name: 'Red Gurnard',
                    img: 'gurnard.svg',
                    vid: 'gurnard.gif',
                    top: 568,
                    left: 920,
                    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas efficitur magna at odio maximus ultricies.'
                },
                {
                    name: 'European Plaice',
                    img: 'plaice.svg',
                    vid: 'plaice.gif',
                    top: 688,
                    left: 1395,
                    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas efficitur magna at odio maximus ultricies.'
                }
            ]
        }
    }
}
</script>

<style scoped>
.button {
    z-index: 1000;
}

.reset {
    position: absolute;
    top: 77px;
    left: 1462px;
}

.infowindow {
    position: absolute;
    top: 0;
    width: 1920px;
    height: 1080px;
    background-color: #688790d6;
    z-index: 9999;
}

.infowindow__content {
    position: absolute;
    background-color: #b4c7ca;
    top: 124px;
    left: 227px;
    width: 1512px;
    height: 826px;
}

.infowindow__content__box {
    border-radius: 0px 0px 20px 20px;
    top: 0;
    color: #fff;
    position: absolute;
    left: 20px;
    width: 878px;
    height: 304px;
    padding: 2em;
    box-sizing: bounding-box;
    font: normal normal normal 24px/32px 'Gilroy-regular';
    background-color: #06909C;
}

.close {
    position: absolute;
    width: 80px;
    height: 80px;
    top: 20px;
    right: 20px;
    z-index: 100;
}

.flex {
    display: flex;
    text-align: left;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: flex-start;
}

.infowindow__content {
    background-size: cover;
    background-repeat: no-repeat;
}

.fish_large {
    position: absolute;
    top: 350px;
    width: 500px;
    width: 1021px;
    left: 50%;
    max-height: 426px;
    transform: translateX(-50%);
}

.infoBox img {
    vertical-align: middle;
    margin-right: 10px;
}

.infoBox {
    background-color: #4BB9B2;
    color: #fff;
    width: auto;
    border-radius: 20px;
    padding: 0.9em 1em;
    transform: 0translate(-409px, -20px);
    margin-left: -132px;
    position: absolute;
    top: -100px;
    left: 95px;
    font-size: 23px;
    font-family: "Gilroy-Bold";
    filter: drop-shadow(7px 5px 0px rgba(0, 0, 0, 0.1));
}

.infoBox .triangle {
    position: absolute;
    width: 55px;
    height: 55px;
    bottom: -30px;
    left: 10px;
}

.endscreen_back {
    background-image: url('../assets/touchscreen_background.jpg');
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -2;
}

.endscreen {}

.infowindow__content {
    background-image: url('../assets/touchscreen_background.jpg');

}

.endscreen {
    position: relative;
    width: 1920px;
    height: 1080px;

}

.fish {
    position: absolute;
    width: 284px;
    height: 400px;
    z-index: 100;
}

.fish_image {
    animation: bob 1s infinite;
    animation-direction: alternate-reverse;
    width: 100%;
    height: auto;
}

.fish:nth-of-type(2) {
    animation-delay: 1s;
}

.fish:nth-of-type(4) {
    animation-delay: .4s;
}

.boatQuote .triangle {
    position: absolute;
    width: 65px;
    height: 67px;
    bottom: 30px;
    left: -46px;

    transform: rotate(90deg);
}

.boatQuote {
    position: absolute;
    left: 650px;
    z-index: 100;
    width: 510px;
    top: 100px;
    height: 275px;
    background-color: #fff;
    border-radius: 20px;
    padding: 1.5em;
    box-sizing: border-box;
    text-align: left;
    font-family: 'Gilroy-Bold';
    color: #000;
    animation-delay: 2s;
    animation: popup 0.7s;

}

@keyframes popup {
    0% {
        transform: scale(0.3);
        opacity: 0;
    }

    30% {
        transform: scale(1.9);
        opacity: 1;
    }

    30% {
        transform: scale(1);
    }

}

.boatQuote p {
    font-size: 28px;
    margin: 0;
}

.sea {
    background-image: url('../assets/end.png');

    z-index: 10;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

.boat {
    position: absolute;
    top: 90px;
    z-index: 0;
    left: 147px;
    width: 512px;
    height: 376px;
    animation-direction: alternate-reverse;
    animation: sway 3s infinite;
}

h1 {
    top: 216px;
    left: 353px;
    width: 326px;
    height: 85px;
    letter-spacing: var(--unnamed-character-spacing-0);
    color: var(--unnamed-color-ffffff);
    text-align: left;
    font: normal normal normal 85px/91px Gilroy-Bold;
    letter-spacing: 0px;
    color: #FFFFFF;
    opacity: 1;
    padding: 0;
    margin: 0;
}

@keyframes sway {
    0% {
        transform: rotate(0);
    }

    50% {
        transform: rotate(-10deg);
    }
}

@keyframes bob {
    0% {
        transform: translateY(-20px);
    }

    100% {
        transform: translateY(0);
    }
}
</style>
