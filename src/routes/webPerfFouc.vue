<template>
  <section class="page">
    <article>
      <h1>Web性能优化：FOUC</h1>
      <p>作者：<a href="https://blog.gerald.top/posts/web-perf-fouc/">Gerald Liu</a></p>
      <h3>背景</h3>
      <p><code>FOUC</code>，也就是 <code>flash of unstyled content</code>，指的是网页渲染时，外部样式还没加载好，就以浏览器默认样式短暂地展示了部分内容，等到外部样式加载完成，又恢复正常的这个页面闪烁的过程。</p>

      <p>看到网上有的文章说现代浏览器已经不需要关注 <code>FOUC</code> 的问题了，这其实是不对的，虽然现代浏览器针对首次绘制做了一些优化，但是代码上的不合理依然可以导致 <code>FOUC</code> 出现。</p>

      <p>在这个 <code>SPA</code> 盛行的时代，大部分情况下 <code>FOUC</code> 都不那么容易引起重视，但是有些时候，<code>FOUC</code> 带来的影响仍然是不可忽视的。 举个例子，想象一下，你在黑暗的环境下使用了一个黑暗的主题，打开了一个深色主题的页面，本来是很和谐的，却因为 <code>FOUC</code> 每次都会先在默认的白色背景下闪烁一下，非常影响体验。</p>

      <h3>原因分析</h3>
      <p>要了解 <code>FOUC</code> 的原因，首先我们要了解一下浏览器渲染的原理。</p>
      <h4>浏览器的渲染流程</h4>
      <img src="static/images/webPerfFouc/1.svg" alt="">
      <p>值得注意的是，整个渲染过程是同步进行的。也就是说，浏览器一边解析 <code>HTML</code>，一边构建渲染树，构建一部分，就会把当前已有的元素渲染出来。如果这个时候外部样式并没有加载完成，渲染出来的就是浏览器默认样式了。</p>
      <h4>脚本和样式的执行顺序</h4>

      <ul>
        <li>
          <p><strong><code>JavaScript</code> 会阻塞解析（parser blocking）</strong></p>
          <p>浏览器中的 <code>JavaScript</code> 是在一个线程中执行的，所有的 <code>&lt;script&gt;</pre></code> 都是依次同步执行的。当浏览器解析到一个 <code>&lt;script&gt;</code> 并开始执行时，就会阻塞后面所有的 <code>DOM</code> 构建和渲染。</p>
          <blockquote>一般来说，现代浏览器在阻塞渲染的时候，都会提前加载所需的静态资源，如 <code>CSS</code> 和 <code>JavaScript</code> 脚本，但是此时并不会执行。</blockquote>
        </li>
        <li>
          <p><strong><code>CSS</code> 会阻塞渲染（render blocking）</strong></p>

          <p>当一个 <code>CSS</code> 尚未加载完成时，浏览器会继续解析和构建 <code>DOM</code>，但是并不会渲染，因为渲染需要的渲染树是由 <code>DOM</code> 和 <code>CSSOM</code> 共同构建而成的。因此，这个时候页面的渲染会被阻塞，直到 <code>CSS</code> 加载完成。</p>
        </li>
      </ul>

      <h4>性能指标</h4>
      <ul>
        <li><strong>首次绘制（FP，First paint）</strong>，表示浏览器渲染任何在视觉上不同于导航前屏幕内容之内容的时间点。</li>
        <li><strong>首次内容绘制（FCP，First contentful paint）</strong>，表示浏览器开始渲染 <code>DOM</code> 内容的时间点。</li>
      </ul>
      <p>一般来说，如果 <code>FP</code> 和 <code>FCP</code> 同时发生，页面就不会出现闪烁。当然也有例外，如果 <code>FCP</code> 发生的时候，所需的样式依然没有加载完成，那么 <code>FOUC</code> 依然会出现，这种情况一般发生于，<code>CSS</code> 不是通过 <code>&lt;link&gt;</code> 标签加载的，而是使用 <code>JavaScript</code> 动态插入的。</p>

      <p><code>FP</code> 和 <code>FCP</code> 发生的时机可以通过 <code>Chrome</code> 的 <code>performance</code> 来观察：</p>
      <img src="static/images/webPerfFouc/2.png" alt="">
      <p>这里的 <code>DCL</code> 是 <code>DOMContentLoaded</code> 事件，其他的节点这里就不详细展开了。</p>

      <h4>绘制的时机</h4>
      <p>前面已经说过，浏览器的解析和渲染是同步进行的，只要有合适的 <code>DOM</code> 和 <code>CSSOM</code> 构建成了渲染树，就会渲染出来，触发浏览器绘制。这个过程都是在一个线程中进行，为了优化性能，同步的操作会被合并，只有当所有的同步操作完成后，构建的渲染树才会被渲染。</p>

      <ul>
        <li>
          <p>一个简单的例子：</p>
          <p>对于一个简单 <code>HTML</code> 页面，当 <code>CSS</code> 加载完成，且所有的 <code>DOM</code> 都同步解析完成，才会触发第一次渲染。也就是说，<code>FP</code> 紧跟在 <code>DCL</code> 后发生。</p>
          <pre><code v-text="snippets[0]" class="lang-html"></code></pre>
          <img src="static/images/webPerfFouc/3.png" alt="">
          <p>当 <code>JavaScript</code> 加入之后，就变得不一样了。</p>
        </li>

        <li>
          <p>当浏览器开始执行一个 <code>&lt;script&gt;</code> 时，<code>DOM</code> 的构建会停下来，因为我们的脚本很可能对当前的 <code>DOM</code> 进行查询和操作。所以这个时候，就会将已经构建好的渲染树先渲染出来。</p>
          <pre><code v-text="snippets[1]" class="lang-html"></code></pre>
          <img src="static/images/webPerfFouc/4.png" alt="">
          <p>值得一提的是，如果 <code>DOM</code> 树的内容为空，浏览器会直接跳过本次渲染。</p>

          <p>所以对于 <code>SPA</code>，更好的做法是在脚本中去动态创建顶层的容器，而不是写到 <code>HTML</code> 中。如果是在 <code>HTML</code> 先写一个 <code>loading</code> 动画提升体验就另说了。</p>
        </li>

        <li>
          <p>如果 <code>JavaScript</code> 触发了<strong>强制</strong><code> paint </code>/ <code>reflow</code>，就会产生更多的绘制，即使 <code>&lt;script&gt;</code> 之前的 <code>DOM</code> 树为空，也有可能使 <code>FP</code> 提前。</p>
        </li>

        <li>
          <p>多个 <code>&lt;script&gt;</code> 标签放在 <code>&lt;body&gt;</code> 中，会多次触发 <code>paint</code> 。原因和上面说过的一样，每次执行一个 <code>&lt;script&gt;</code> 的时候，浏览器都会暂停 <code>DOM</code> 树的构建，先把当前的渲染树渲染出来。所以如果前面的 <code>&lt;script&gt;</code> 创建了 <code>DOM</code> 元素，后面的 <code>&lt;script&gt;</code> 执行前一定会先触发 <code>paint</code>，如果这时发生样式的变化，就会出现 <code>FOUC</code>。</p>
          <pre><code v-text="snippets[2]" class="lang-html"></code></pre>
          <img src="static/images/webPerfFouc/5.png" alt="">
          <P>可以看到，这里的三个 <code>&lt;script&gt;</code> 标签导致了额外的三次 <code>reflow</code> / <code>paint</code>。</P>
          <P>这个问题不容忽视，因为有时候费了很大劲做的优化，一次 <code>Webpack</code> 打包就可以让你前功尽弃。比如使用了 <code>svg-sprite-loader</code> 之后，把 <code>SVG</code> 图标资源打包到 <code>vendor.js</code> 中，会得到：</P>
          <pre><code v-text="snippets[3]" class="lang-html"></code></pre>
          <p>在 <code>vendor.js</code> 执行的时候，<code>svg-sprite-loader</code> 会向 <code>&lt;body&gt;</code> 上插入一个大的 <code>&lt;svg&gt;</code>。再到 <code>app.js</code> 执行的时候，就会闪烁了。</p>
        </li>
      </ul>

      <h3>解决方案</h3>
      <p>了解了浏览器绘制的时机，<code>FOUC</code> 的问题就可以迎刃而解了。这里主要针对 <code>SPA</code> 页面，毕竟对 <code>SSR</code> 的页面来说，<code>FOUC</code> 或许不是一个大问题。</p>

      <ul>
        <li>将 <code>JavaScript</code> 资源尽量放到 <code>&lt;head&gt;</code> 中，只保留最后一个包含主逻辑的脚本在 <code>&lt;body&gt;</code> 中，因为它很可能要往 <code>&lt;body&gt;</code> 上挂载元素。这可以解决上面提到的 <code>&lt;script&gt;</code> 标签导致的多次渲染问题。</li>
        <li>第一次渲染，不论是 <code>Vue</code>、<code>React</code> 还是 <code>VanillaJS</code>，一定要同步放到主逻辑中，确保发生在 <code>DCL</code> 之前。</li>
        <li>避免对 <code>DOM</code> 进行不必要的读操作，因为他们会带来的额外的绘制。</li>
      </ul>

      <h3>参考资料</h3>
      <ul>
        <li><a href="https://www.html5rocks.com/en/tutorials/internals/howbrowserswork/">https://www.html5rocks.com/en/tutorials/internals/howbrowserswork/</a></li>
        <li><a href="https://developers.google.com/web/fundamentals/performance/user-centric-performance-metrics">https://developers.google.com/web/fundamentals/performance/user-centric-performance-metrics</a></li>
        <li><a href="https://developers.google.com/web/fundamentals/performance/critical-rendering-path/analyzing-crp">https://developers.google.com/web/fundamentals/performance/critical-rendering-path/analyzing-crp</a></li>
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