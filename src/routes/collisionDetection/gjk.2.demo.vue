<template>
  <canvas ref="canvas"></canvas>
</template>

<script>
  import run from '../../modules/gjk.2'

  export default {
    mounted() {
      run(this.$refs.canvas)
    }
  }
</script>

<style lang="less" scoped>
  canvas {
    display: block;
    width: 100%;
    height: 100%;
  }
</style>