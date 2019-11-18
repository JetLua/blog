<template>
  <section class="page">
    <h3>:w:</h3>
    <ul>
      <li v-for="x in articles">
        <router-link :to="x.path" v-text="x.meta.title"></router-link>
      </li>
    </ul>
  </section>
</template>

<script>
  import routes from './index'
  export default {
    data() {
      return {
        articles: routes.filter(item => item.meta?.title)
      }
    }
  }
</script>

<style lang="less" scoped>
  .page {
    padding: 16px 16px 200px;
    max-width: 800px;
    width: 100%;
    margin: auto;
    white-space: normal;
    word-wrap: normal;
    word-break: break-all;

    h3 {
      padding-bottom: 16px;
      margin-bottom: 16px;
      border-bottom: 1px solid #ccc;
      letter-spacing: 2px;
      color: #333;

      &:not(:first-child) {
        margin-top: 32px;
      }
    }

    ul {
      list-style-type: circle;
      padding: 0 0 0 32px;
      margin: 0 0 16px 0;

      li {
        padding: 6px 0;
      }
    }
  }
</style>