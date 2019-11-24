<template>
  <section class="page">
    <article>
      <h1>碰撞检测 - GJK(2)</h1>
      <p>作者：<a href="https://github.com/JetLua">JetLu</a></p>
      <blockquote><a href="https://blog.lufei.so/#/collisionDetection/GJK/1">上篇文章</a>的结尾简单描述了优化思路，这篇文章我们来一步步实现这个优化。</blockquote>
      <p>国际惯例先放图。</p>
      <img src="/static/images/gjk2/1.png" alt="">
      <p><code>GJK</code> 是怎么快速判断出这两个图形是否碰撞的呢？</p>
      <img src="/static/images/gjk2/2.png" alt="">

      <h3>Support Function</h3>
      <p><code>Support Function</code> 用来计算凸体在给定方向上的最远点。什么意思呢？</p>
      <img src="/static/images/gjk2/3.png" alt="">
      <details>
        <summary>代码片段</summary>
        <pre><code v-text="snippets[0]" class="lang-js"></code></pre>
      </details>
      <p>图示中的例子带入，可以得到 <code>(9, 6) = (0, 4) - (-9, -2)</code>，正是图二三角形的一个顶点。</p>
      <p>将方向取反再调用 <code>getSupport</code>，我们可以得到 <code>(-1, -2) = (-6, 0) - (-5, 2)</code>，也是图二三角形的一个顶点。</p>
      <p><strong>这样做的意义是什么呢？</strong>因为可以确保我们所取的两个点跨度足够大，有更大的概率包含原点，<strong>减少循环次数。</strong></p>
      <img src="/static/images/gjk2/4.png" alt="">
      <p><strong>那么问题来了：</strong></p>
      <ul>
        <li>
          <p><strong>初始给定的方向是怎么来的？</strong></p>
          <p>随机。更推荐的是凸体中心的差：<code>direction = shapeA.center - shapeB.center</code>。</p>
        </li>
        <li>
          <p><strong>已经获取了两个点，那么第三个点如何确定呢？</strong></p>
          <p>通过 <code>a(9, 6)</code>，<code>b(-1, -2)</code>，可以计算出垂直于向量 <code>ab(-10, -8)</code> 且指向原点方向的向量，这个向量将会作为 <code>direction</code> 来获取第三个点。</p>
          <img src="/static/images/gjk2/5.png" alt="">
          <p>这里要用到<a href="https://en.wikipedia.org/wiki/Cross_product">向量积</a>来计算出 <code>direction</code>。</p>
          <details>
            <summary>代码片段</summary>
            <pre><code v-text="snippets[1]" class="lang-js"></code></pre>
          </details>
            </li>
      </ul>
      <h3>核心算法</h3>
      <p>获取到三个点后，我们需要判断原点的是否在这三个所形成的多边形内。如果在说明碰撞，不在则剔除一个点后继续寻找下一个点。</p>
      <img src="/static/images/gjk2/7.png" alt="">
      <p>上面这种情况：<code>w * AO &gt; 0</code>，说明原点在 <code>AB</code> 外部，则剔除点 <code>C</code> 并以 <code>w</code> 为 <code>direction</code> 继续寻找下一个点。</p>
      <img src="/static/images/gjk2/8.png" alt="">
      <p>上面这种情况：<code>w * AO &lt; 0</code>，说明原点在 <code>AB</code> 内部，则验证剩余的边（<strong>实际上不需要验证所有的边</strong>）。假如我开始获取到的两个点是 <code>B，C</code>，则我们只需要验证 <code>AB，AC</code>，因为原点一定在 <code>BC</code> 内部。</p>
      <p>这里的关键点在于：<strong>如何计算出垂直于 <code>AB</code> 且指向远离点 <code>C</code> 的方向的向量 <code>w</code></strong> ？</p>
      <p>直接贴代码了，毕竟也解释不了为何是这样的运算顺序。</p>
      <details>
        <summary>代码片段</summary>
        <pre><code v-text="snippets[2]" class="lang-js"></code></pre>
      </details>
      <h3>交互示例</h3>
      <p>上面只是介绍了我觉得实现 <code>GJK</code> 算法中比较重要的点。整个流程可能并不够清晰，所以这里附上完整的步骤分解示例。</p>
      <p><a href="/#/collisionDetection/GJK/2/demo" target="_blank">新标签页中打开</a></p>
      <iframe src="/#/collisionDetection/GJK/2/demo" frameborder="0"></iframe>

      <h3>总结</h3>
      <p><code>GJK</code> 算法并不复杂，完整的代码不到 <code>200</code> 行。主要用到的数学知识是<a href="https://en.wikipedia.org/wiki/Dot_product">数量积</a>和<a href="https://en.wikipedia.org/wiki/Cross_product">向量积</a>。</p>
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
          require('@/static/snippets/collisionDetection/gjk.5.txt').default,
          require('@/static/snippets/collisionDetection/gjk.6.txt').default,
          require('@/static/snippets/collisionDetection/gjk.7.txt').default,
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