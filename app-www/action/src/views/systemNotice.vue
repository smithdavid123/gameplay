<template>
  <div>
    <mu-appbar class=" header" color="primary">
      <mu-button slot="left" icon to="/person">
        <i class="iconfont">&#xe604;</i>
      </mu-button>
      <p class="tc">系统公告</p>

      <mu-button slot="right" icon >
        <i class="iconfont" style="display: none">&#xe604;</i>
      </mu-button>

    </mu-appbar>
    <div class="content">
      <div>
        <mu-expansion-panel v-for="item in prizeList">
          <div slot="header" class=""><i v-if="item.status" class="iconfont cr5">&#xe628;</i>{{item.title}}</div>

          <p v-html="item.content" class="cr1"></p>

          <p slot="action" style="text-align: left;width: 100%;margin: 0" class="cr2">{{item.time}}</p>
        </mu-expansion-panel>

      </div>

    </div>

  </div>
</template>
<script>
  import  {listNotice} from  '@/api/login'

  export default {
    name: 'systemNotice',
    data() {
      return {
        prizeList:[]

      }
    },
    created(){
      this.getList()
    },
    methods:{
      getList(){
        listNotice({content:true}).then((response)=>{

          this.prizeList=response;
          console.log(this.prizeList)
        })
      },

    }
  }
</script>
