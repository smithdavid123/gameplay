<template>
  <div class="module-pageLoader">
    <div
      v-for="i in lines"
      :key="i"
      class="loader-line"
    />
  </div>
</template>

<script>
export default {
    name: 'PageLoader',
    props: {
        lines: {
            type: Number,
            default: 4
        }
    }
};
</script>
