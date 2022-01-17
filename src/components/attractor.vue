<template>
<main>
    <video muted autoplay :src="require('@/assets/attractor.mp4')"></video>
    <div class="button green start" @click="$store.commit('SET_VIEW', 'creator')" style="width: 260px; height: 114px; line-height: 117px; font-size: 53px; padding: 0;">
 Start
        </div>
</main>
</template>

<script>
export default {

}
</script>

<style>
main {
    background-size: cover;
    background-repeat: no-repeat;
    position: relative;
    width: 1920px;
    height: 1080px;
    background-color: #06909c;
}

.start {
    position: absolute !important;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
</style>
