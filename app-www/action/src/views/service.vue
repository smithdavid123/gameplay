<template>
  <div style="height: 100%;">

    <div  style="padding: 0;width: 100%;height: 100%">
      <div style="height: 100%;">
        <iframe frameborder=0 name="showHere" scrolling=auto  width="100%" height="100%" :src="url" ></iframe>
      </div>

    </div>

  </div>
</template>
<script>
  import  {getService} from  '@/api/login'

  export default {
    name: 'service',
    data() {
      return {
        url:''

      }
    },
    created(){
      getService().then(res=>{
        this.url = res

      })

    },
    methods:{


    }
  }
</script>
<style scoped>
  .demo-loadmore-wrap {
    width: 100%;
    height: 500px;
    display: flex;
    flex-direction: column;

  }
  .mu-appbar {
    width: 100%;
  }
  .demo-loadmore-content {
    flex: 1;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
  }
</style>
