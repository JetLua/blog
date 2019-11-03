<template>
  <section class="page">
    <article>
      <h1>碰撞检测 - GJK(1)</h1>
      <p>作者：JetLu</p>

    </article>
  </section>
</template>

<script>

  export default {

    data() {
      return {
        snippets: [
          require('@/static/snippets/webPerfFouc/1.txt').default,
          require('@/static/snippets/webPerfFouc/2.txt').default,
          require('@/static/snippets/webPerfFouc/3.txt').default,
          require('@/static/snippets/webPerfFouc/4.txt').default,
        ]
      }
    },

    mounted() {
      Prism.highlightAll()
    }
  }
</script>

<style lang="less" scoped>

</style>