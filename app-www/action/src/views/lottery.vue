<template>
  <div  style="height: 100%;overflow-y: auto">

      <mu-container ref="container" class="demo-loadmore-content">
        <mu-load-more @refresh="refresh" :refreshing="refreshing" :loading="loading" @load="load">
          <mu-list v-for="(item,index) in  list" class="code-list" :class="{'firstList':index==0}">

              <p class="f16">第{{item.issue}}期  开奖号码：</p>
              <div ><span v-for="j in item.code.split(',')" class="code-span">{{j}}</span></div>


          </mu-list>
        </mu-load-more>
      </mu-container>



  </div>

</template>
<script>
  import  {staticOpenCode} from '@/api/login'
  export  default {
    name:'lottery',
    data(){

      return {

        refreshing: false,
        loading: false,
        query:{
          name:this.$route.query.name,
          history:true
        },
        list:[],
        timerList:null

      }

    },
    props: {

      'titleName':String,

    },
    created(){

        if(this.titleName){
        this.query.name = this.titleName
        }
      this.getList()
    },
    mounted(){
      this.$nextTick(function () {
        this.timerList=setInterval(this.listTimer, 10000);
      })
    },
    methods:{


      //开奖
      getList(flag){
        console.log(11)
        if(flag){this.list = []}
        staticOpenCode(this.query).then(res=>{
          this.list= this.list.concat(res)
        })
      },
      listTimer(){
        this.refreshing = false;
        this.query.page = 0
        this.list = []
        this.getList()
      },
      refresh () {

        this.refreshing = true;
        this.$refs.container.scrollTop = 0;
        setTimeout(() => {
          this.refreshing = false;
          this.query.page = 0
          this.list = []
          this.getList()
        }, 2000)
      },
      load () {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          this.query.page+=1
          this.getList()
        }, 2000)
      },
    },

    destroyed(){
      if(this.timerList) { //如果定时器在运行则关闭
        clearInterval(this.timerList);
      }
    }
  }
</script>
<style scoped>


  .code-list{
    padding: 10px 0px;
    border-bottom: 1px solid #e3eaef;

  }
  .code-span{
    display: inline-block;
    width: 26px;
    height: 26px;
    background-color: #a77172;
    color: #fff;
    text-align: center;
    line-height: 26px;
    margin-left: 10px;
    border-radius: 50%;
  }
  .firstList{
   color: #ff4b2b;
  }
  .firstList .code-span{
    background-color: #ff4b2b;
  }
</style>
