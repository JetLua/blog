<template>
  <section class="page">
    <article>
      <h1>碰撞检测 - GJK(1)</h1>
      <p>作者：<a href="https://github.com/JetLua">JetLu</a></p>
      <h3>楔子</h3>
      <blockquote>《花里胡哨的前端》第二期，来聊聊碰撞的二三事。</blockquote>
      <p>现实世界里我们对于是否碰撞的判断可以说极其容易而且准确，比如下图。在二进制的世界里，一切就没这么直观了。</p>
      <img src="static/images/gjk/1.jpg" alt="">

      <h3>GJK(Gilbert-Johnson-Keerthi Distance Algorithm)</h3>
      <p><code>GJK</code> 就是此次要实现的碰撞检测算法。如果对碰撞算法有过了解的话，大概率听过另一个碰撞检测算法 <code>SAT(Separating Axis Theorem)。</code></p>
      <p><code>GJK</code> 相较于 <code>SAT</code> 有什么优点吗？</p>
      <ul>
        <li><strong>快</strong></li>
        <li><strong>简单</strong></li>
      </ul>
      <p>实际上就我目前了解的碰撞检测算法，应用对象都是<strong>凸多边形</strong>(<code>Convex polygon</code>)。如果不是凸多边形，问题也不大，可以事先分割。</p>
      <p>游戏里对于不规则物体，我们通常都是借助工具生成顶点数据。此时生成的数据通常都是处理过的(凹多边形被分解)，如果你想了解更多关于凹多边形分解的知识，可以参考这两个库：<a href="https://github.com/schteppe/poly-decomp.js">poly-decomp.js</a>，<a href="https://github.com/mapbox/earcut">earcut</a>。</p>
      <img src="static/images/gjk/2.png" alt="">

      <h3>Minkowski Difference</h3>
      <blockquote>由于不知道 <code>Min</code> 到底是“明”还是“闵”，所以下面都用 <code>MD</code> 表示了。</blockquote>
      <p><code>MD</code> 是 <code>GJK</code> 算法的理论基础。那么到底什么是 <code>MD</code> ？</p>
      <p>假设有两个凸多边形：</p>
      <pre><code v-text="snippets[0]" class="lang-js"></code></pre>
      <p>那么它们的位置看起应该像下图这样。</p>
      <img src="static/images/gjk/3.png" alt="">
      <p><code>MD</code> 就是 <code>s1</code> 与 <code>s2</code> 所有点的差形成的集合。</p>
      <pre><code v-text="snippets[1]" class="lang-js"></code></pre>
      <pre><code v-text="snippets[2]" class="lang-js"></code></pre>
      <p>这些点的布局如下图所示：</p>
      <img src="static/images/gjk/4.png" alt="">
      <p>关键的地方来了。首先要介绍一个新的概念叫 <code>Convex Hull</code>。</p>
      <p><code>Convex hull</code> 是包含点集的最小凸多边形。拿上面的例子来说：</p>
      <img src="static/images/gjk/5.png" alt="">
      <p><strong>铺垫了这么久，现在可以说结论了。</strong></p>
      <p>我们把 <code>s1 - s2</code> 点集形成的 <code>Convex hull</code> 命名为 <code>s3</code>。<strong>如果 <code>s3</code> 包含点 <code>(0, 0)</code>，那么 <code>s1</code> 和 <code>s2</code> 发生碰撞</strong>。</p>
      <p>有没有觉得很简单？对，原理就是这么简单。</p>
      <p>至于怎么算出点集的 <code>Convex hull</code>，翻译自<a href="https://en.wikipedia.org/wiki/Gift_wrapping_algorithm">维基百科</a>的 <code>Gift wrapping algorithm</code> 。</p>
      <pre><code v-text="snippets[3]" class="lang-js"></code></pre>
      <p><code>Gift wrapping algorithm</code> 是获取 <code>Convex hull</code> 的一种算法，不是效率最高的但应该是最易懂的。</p>
      <p>最后就是判断点是否在多边形内的算法了，可以看我之前的<a href="https://mp.weixin.qq.com/s?__biz=MzA5MTg4MTY0MQ==&mid=2651494185&idx=1&sn=0f944a60ccd212a0b125207eb0e32187">文章</a>。</p>

      <h3>交互示例</h3>
      <iframe src="/#/collisionDetection/GJK/1/demo" frameborder="0"></iframe>

      <h3>思考</h3>
      <p>有小伙伴不禁要问：这样的嵌套循环真的比 <code>SAT</code> 快？确实，上面的实现并不是真正意义上的 <code>GJK</code> 算法。但是核心思想是一样的：</p>
      <p><strong>如果两个凸多边形的 <code>Minkowski Difference</code> 所形成的 <code>Convex hull</code> 包含点 <code>(0, 0)</code>，那么这两个凸多边形相交。</strong></p>
      <p>怎么优化这个实现呢？</p>
      <p>我们并不需要计算两个凸多边形所有点的 <code>Minkowski Difference</code>。还是文章开始的例子：</p>
      <img src="static/images/gjk/6.png" alt="">
      <p>我们只需要尽早的从已知的条件里判断出是否包含原点即可。</p>
      <p>比如：如果获取到的第一个点刚好是原点，说明相交停止循环，否则继续获取下一个点，如果原点在两点的连线上，说明相交停止循环，否则继续获取下一个点。</p>
      <p>真正的 <code>GJK</code> 算法用了一个很取巧的方式来减少循环次数，而且效果很理想。当然这也是下篇文章里的内容了。</p>
      <p>感兴趣的小伙伴也可以从下面的参考资料里先尝试一波。</p>
      <h3>参考资料</h3>
      <ul>
        <li><a href="https://blog.hamaluik.ca/posts/building-a-collision-engine-part-1-2d-gjk-collision-detection/">https://blog.hamaluik.ca/posts/building-a-collision-engine-part-1-2d-gjk-collision-detection/</a></li>
        <li><a href="http://www.dyn4j.org/2010/04/gjk-gilbert-johnson-keerthi/">http://www.dyn4j.org/2010/04/gjk-gilbert-johnson-keerthi/</a></li>
        <li><a href="https://cse442-17f.github.io/Gilbert-Johnson-Keerthi-Distance-Algorithm/">https://cse442-17f.github.io/Gilbert-Johnson-Keerthi-Distance-Algorithm/</a></li>
      </ul>
      <img class="qr" src="/static/images/qr.jpg" alt="">
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