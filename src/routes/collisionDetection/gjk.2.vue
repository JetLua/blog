<template>
  <section class="page">
    <article>
      <h1>碰撞检测 - GJK(2)</h1>
      <p>作者：<a href="https://github.com/JetLua">JetLu</a></p>
      <blockquote><a href="https://blog.lufei.so/#/collisionDetection/GJK/1">上篇文章</a>的结尾简单描述了优化思路，这篇文章我们来一步步实现这个优化。</blockquote>

    </article>
  </section>
</template>

<script>
  export default {

    data() {
      return {
        snippets: [
          require('@/static/snippets/collisionDetection/gjk.1.txt').default,
          require('@/static/snippets/collisionDetection/gjk.2.txt').default,
          require('@/static/snippets/collisionDetection/gjk.3.txt').default,
          require('@/static/snippets/collisionDetection/gjk.4.txt').default,
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