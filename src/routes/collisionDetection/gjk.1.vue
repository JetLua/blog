<template>
  <section class="page">
    <article>
      <h1>碰撞检测 - GJK(1)</h1>
      <p>作者：<a href="https://github.com/JetLua">JetLu</a></p>
      <h3>楔子</h3>
      <blockquote>《花里胡哨的前端》第二期，来聊聊碰撞的二三事。</blockquote>
      <p>现实世界里我们对于是否碰撞的判断可以说极其容易而且准确，比如下图。在二进制的世界里，计算机只能将物体坐标带入算法，通过返回结果去判断两个物体是否发生碰撞。听起来很复杂？没有任何头绪？没关系，下面进入正题。</p>
      <img src="static/images/collisionDetection/gjk/1.jpg" alt="">

      <h3>GJK(Gilbert-Johnson-Keerthi Distance Algorithm)</h3>
      <p><code>GJK</code> 就是此次要实现的碰撞检测算法。如果对碰撞算法有过了解的话，大概率听过另一个碰撞检测算法 <code>SAT(Separating Axis Theorem)。</code></p>
      <p><code>GJK</code> 相较于 <code>SAT</code> 有什么优点吗？</p>
      <ul>
        <li><strong>快</strong></li>
        <li><strong>简单</strong></li>
      </ul>
      <p>实际上就我目前了解的碰撞检测算法，应用对象都是凸多边形(<code>Convex polygon</code>)。如果不是凸多边形，问题也不大，可以事先分割。</p>
      <p>游戏里对于不规则物体，我们通常都是借助工具生成顶点数据。此时生成的数据通常都是处理过的(凹多边形被分解)，如果你想了解更多关于凹多边形分解的知识，可以参考这两个库：<a href="https://github.com/schteppe/poly-decomp.js">poly-decomp.js</a>，<a href="https://github.com/mapbox/earcut">earcut</a>。</p>
      <img src="static/images/collisionDetection/gjk/2.png" alt="">

      <h3>Minkowski Difference</h3>
      <blockquote>由于不知道 <code>Min</code> 到底是“明”还是“闵”，所以下面都用 <code>MD</code> 表示了。</blockquote>
      <p>那么到底什么是 <code>MD</code> ？</p>
      <p>假设有两个凸多边形：</p>
      <pre><code v-text="snippets[0]" class="lang-js"></code></pre>
      <p>那么它们的位置看起应该像下图一样。</p>
      <img src="static/images/collisionDetection/gjk/3.png" alt="">
      <p><code>MD</code> 就是 <code>s1</code> 与 <code>s2</code> 所有点的差。</p>
      <pre><code v-text="snippets[1]" class="lang-js"></code></pre>
      <pre><code v-text="snippets[2]" class="lang-js"></code></pre>
      <p>这些点的布局如下图所示：</p>
      <img src="static/images/collisionDetection/gjk/4.png" alt="">
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