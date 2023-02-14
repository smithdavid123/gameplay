<template>
  <section>
    <module-header />
    <!-- <module-alarm /> -->
    <main>
      <router-view class="module-container" />
    </main>
  </section>
</template>

<script>
import moduleHeader from './modules/header';
// import moduleAlarm from './modules/alarm';

export default {
    name: 'Layout',
    components: {
        moduleHeader,
        // moduleAlarm
    }
};
</script>
