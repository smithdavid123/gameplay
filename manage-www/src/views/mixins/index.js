export default {
    watch: {
        '$store.getters.refresh' (curVal, oldVal) {
            this.getList();
        }
    },
    methods: {
        // 校验选择
        checkValidate() {
            if (this.checked.length === 1) {
                return true;
            }
            if (this.checked.length === 0) {
                this.$root.$children[0].message = '请选择记录！';
            }
            if (this.checked.length > 1) {
                this.$root.$children[0].message = '只能选择一条记录！';
            }
            this.$root.$children[0].tipVisible = true;
        },
        // 删除记录
        handleRemove(delApiName) {
            this.$root.$children[0].removeId = this.checked[0].id;
            this.$root.$children[0].delApiName = delApiName;
            this.$root.$children[0].removeVisible = true;
        }
    }
};