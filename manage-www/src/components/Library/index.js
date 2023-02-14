import Vue from 'vue';
import ELEMENT from 'element-ui';
import vueParticleLine from 'vue-particle-line';

import '@/style/element-variables.scss';
import '@/style/element-cover.scss';
import 'vue-particle-line/dist/vue-particle-line.css';

Vue.use(ELEMENT, {
    size: 'medium'
});

Vue.use(vueParticleLine);