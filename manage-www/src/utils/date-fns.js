import Vue from 'vue';
import { format } from 'date-fns';

Object.defineProperty(Vue.prototype, '$format', {
    value: format
});
