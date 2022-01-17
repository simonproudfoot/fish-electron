<template>
<div class="infowindow">
    <div class="infowindow__content">
        <img class="close" :src="require('@/assets/button-close.svg')" @click="$store.commit('SET_HOWTO', '')" />
        <div class="infowindow__content__box">
            <h1>How to</h1>
            <h1>Play</h1>
            <div style="margin-top: 50px">
                <p style="margin-top: 0">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas efficitur magna at odio maximus ultricies.</p>
            </div>
        </div>
        <img :src="require('@/assets/howto.gif')">
    </div>

</div>
</template>

<script>
export default {
    props: ['fin'],
    data() {
        return {
            content: {
                // force - the less it is, the more control it has. 
                // put 4 for average/no difference
                dorsal: {

                    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas efficitur magna at odio maximus ultricies.'

                },
                anal: {

                    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas efficitur magna at odio maximus ultricies.'

                },
                tail: {

                    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas efficitur magna at odio maximus ultricies.'

                },
                body: {

                    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas efficitur magna at odio maximus ultricies.'

                },
                pectoral: {
                    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas efficitur magna at odio maximus ultricies.'

                },
                pelvic: {

                    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas efficitur magna at odio maximus ultricies.'

                },

            }
        }
    }
}
</script>

<style scoped>
.infowindow {
    position: absolute;
    top: 0;
    width: 1920px;
    height: 1080px;
    background-color: #688790d6;
    z-index: 9999;

}

.infowindow video {
    width: 100%;
    height: auto;
}

.infowindow__content {
    position: absolute;
    background-color: #b4c7ca;
    top: 124px;
    left: 227px;
    width: 1512px;
    height: 826px;
    background-image: url('../assets/touchscreen_background.jpg');
}

.infowindow__content__box {
    text-align: left;
    border-radius: 0px 0px 20px 20px;
    top: 0;
    color: #fff;
    position: absolute;
    left: 100px;
    width: 410px;
    padding: 5em 2em;
    box-sizing: bounding-box;
    font: normal normal normal 24px/32px 'Gilroy-regular';
    background-color: #06909C;

}

.close {
    z-index: 1000;
    position: absolute;
    width: 80px;
    height: 80px;
    top: 20px;
    right: 20px;

}

.flex {
    display: flex;
    text-align: left;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: flex-start;
}

h1 {
    top: 216px;
    left: 353px;
    width: 326px;
    height: 85px;
    font: var(--unnamed-font-style-normal) normal var(--unnamed-font-weight-normal) 85px/91px var(--unnamed-font-family-gilroy-bold);
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
</style>
