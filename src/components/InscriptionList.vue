<template>
  <div class="inscription-list">
    <div
        v-for="(inscription, index) in inscriptions"
        :key="index"
        class="inscription-list__item"
        @click="onItemClick(inscription)"
    >
      <div v-html="inscription.svg" class="inscription-list__item-icon" :ref="setSvgRef"></div>
      <button @click.stop="createGif(index)">Create GIF</button>

      <div class="inscription-list__item-info">
        <div class="inscription-list__item-title">
          {{ (inscription.seed.isDynamic ? (inscription.seed.seed < 3000 ?'Dynamic Egg': 'Dynamic Froggi') :(inscription.seed.seed < 3000 ?'Stable Egg': 'Stable Froggi')) }}
           {{formatNumberWithComma(inscription.seed.seed)}}
        </div>
        <a
            :href="`https://basescan.org/address/${inscription.seed.owner}`"
            target="_blank"
            class="inscription-list__item-description"
            @click.stop
        >{{ inscription.seed.owner }}</a>
      </div>
    </div>

    <template v-if="isLoading">
      <div v-for="_ in 4" class="inscription-list__item --loading">
        <UniversalImage src="/images/froggi/logo.png" class="inscription-list__item-icon" />

        <div class="inscription-list__item-info">
          <div class="inscription-list__item-title">Froggi</div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import html2canvas from 'html2canvas';
import GIF from 'gif.js.optimized';
import { useLayoutStore } from '@/stores'
import { formatNumberWithComma } from '@/utils/number'

defineProps({
  isLoading: {
    type: Boolean,
    default: true,
  },

  inscriptions: {
    type: Array,
    required: true,
  },
})

const layoutStore = useLayoutStore()
const svgElements = ref([]);

function setSvgRef(el) {
  if (el) {
    svgElements.value.push(el);
  }
}


onMounted(() => {
  svgElements.value = svgElements.value.filter(el => el); // Filter out undefined elements
});

const createGif = async (index) => {
  const svgElement = svgElements.value[index];
  if (!svgElement) {
    console.error('SVG element not found for index', index);
    return;
  }

  const gif = new GIF({
    workers: 2,
    quality: 10,
    workerScript: 'node_modules/gif.js.optimized/dist/gif.worker.js'
  });

  let intervalId = null;
  let duration = 1000; // Total duration in milliseconds
  let interval = 100; // Interval at which to capture frames

  // Function to capture a frame
  const captureFrame = async () => {
    const canvas = await html2canvas(svgElement);
    gif.addFrame(canvas, { delay: interval });
  };

  // Start capturing frames
  intervalId = setInterval(async () => {
    await captureFrame();
  }, interval);

  // Stop capturing after the specified duration
  setTimeout(() => {
    clearInterval(intervalId);
    gif.on('finished', function(blob) {
      console.log(blob)
      window.open(URL.createObjectURL(blob));
    });
    gif.render();
  }, duration);
};

function onItemClick(item) {
  layoutStore.openModal('Info', { item })
}
</script>

<style scoped lang="sass">
.inscription-list
  display: grid
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr
  grid-gap: 24px

  &__item
    position: relative
    display: flex
    flex-direction: column
    cursor: pointer
    width: 100%
    overflow: hidden
    background-color: $mainColor
    border: 1px solid $borderColor
    transition: transform 350ms ease
    animation: fadeIn 350ms ease

    &:hover
      transform: scale(1.02)

    &-icon
      height: auto
      width: 100%
      object-fit: cover
      position: relative

    &-info
      padding: 16px
      display: flex
      flex-direction: column
      gap: 8px

    &-title
      font-weight: 500
      font-size: 20px

    &-description
      color: grey
      word-break: break-all

    &.--loading
      &:after
        content: ''
        position: absolute
        width: 100%
        height: 100%
        top: 0
        left: 0
        background-color: #dddddd

      &:hover
        transform: none

      .inscription-list__item-icon
        width: 100%
        height: 100%

  @media screen and (max-width: $breakpointTablet)
    grid-template-columns: 1fr 1fr 1fr

  @media screen and (max-width: $breakpointMobile)
    grid-template-columns: 1fr 1fr
    grid-gap: 16px

    &__item
      &-description
        font-size: 14px
</style>