<template>
  <div>
    <mu-appbar class=" header" color="primary">
      <mu-button slot="left" icon to="/person">
        <i class="iconfont">&#xe604;</i>
      </mu-button>
      <p class="tc">消息中心</p>

      <mu-button slot="right" flat @click="oppenMessageFull = true" >发消息</mu-button>

    </mu-appbar>
    <div class="content">
      <div>
        <div  class="demo-loadmore-wrap">
          <mu-container ref="container" class="demo-loadmore-content">
            <mu-load-more @refresh="refresh" :refreshing="refreshing" :loading="loading" @load="load">
              <mu-list>
                <mu-data-table :columns="columns"  :data="prizeList">
                  <template slot-scope="scope">

                    <td>{{scope.row.lottery}}</td>
                    <td >{{scope.row.issue}}</td>
                    <td >{{scope.row.money}}</td>
                    <td >{{scope.row.winMoney}}</td>
                    <td >{{scope.row.orderTime}}</td>
                    <td >{{scope.row.method}}</td>
                  </template>

                </mu-data-table>
              </mu-list>
            </mu-load-more>
          </mu-container>
        </div>
      </div>

    </div>
    <mu-dialog width="360" transition="slide-bottom" fullscreen :open.sync="oppenMessageFull">
      <mu-appbar color="primary" >
        <mu-button slot="left" icon @click="oppenMessageFull = false">
          <i class="iconfont">&#xe604;</i>
        </mu-button>
        <p class="tc">发消息</p>

        <mu-button slot="right" flat >发送</mu-button>
      </mu-appbar>
      <mu-tabs :value.sync="active" inverse color="secondary" text-color="rgba(0, 0, 0, .54)"  center>
        <mu-tab>上级</mu-tab>
        <mu-tab>下级</mu-tab>
        <mu-tab>客服</mu-tab>
      </mu-tabs>
      <div class="demo-text" v-if="active === 0">
        <mu-form :model="form" class="mu-demo-form" label-position="top" label-width="100">

          <mu-form-item prop="subject" label="主题">
            <mu-text-field v-model="form.subject"></mu-text-field>
          </mu-form-item>
          <mu-form-item prop="content" label="内容">
            <mu-text-field multi-line :rows="3" :rows-max="6" v-model="form.content"></mu-text-field>
          </mu-form-item>
        </mu-form>
      </div>
      <div class="demo-text" v-if="active === 1">
        <mu-form :model="form1" class="mu-demo-form" label-position="top" label-width="100">
          <mu-form-item prop="name" label="收件人">
            <mu-select v-model="form1.name">
              <mu-option v-for="option,index in options" :key="option" :label="option" :value="option"></mu-option>
            </mu-select>
          </mu-form-item>
          <mu-form-item prop="title" label="主题">
            <mu-text-field v-model="form1.title"></mu-text-field>
          </mu-form-item>
          <mu-form-item prop="content" label="内容">
            <mu-text-field multi-line :rows="3" :rows-max="6" v-model="form1.content"></mu-text-field>
          </mu-form-item>
        </mu-form>
      </div>
      <div class="demo-text" v-if="active === 2">
        <mu-form :model="form2" class="mu-demo-form" label-position="top" label-width="100">

          <mu-form-item prop="title" label="主题">
            <mu-text-field v-model="form2.title"></mu-text-field>
          </mu-form-item>
          <mu-form-item prop="content" label="内容">
            <mu-text-field multi-line :rows="3" :rows-max="6" v-model="form2.content"></mu-text-field>
          </mu-form-item>
        </mu-form>
      </div>

    </mu-dialog>

  </div>
</template>
<script>
  import  {getListMessage,sendMessage} from  '@/api/login'

  export default {
    name: 'message',
    data() {
      return {
        active:0,
        oppenMessageFull:false,
        columns:[
          {title:'日期'},
          {title:'发件人'},
          {title:'主题'},
          {title:'状态'},
          {title:'操作'},
        ],
        prizeList:[],
        param:{
          page: 0,
          size: 10
        },
        refreshing: false,
        loading: false,
        form:{
          subject:'',
          content:''
        },
        options:[],
        form1:{
          name:'',
          title:'',
          content:''
        },
        form2:{
          title:'',
          content:''
        }

      }
    },
    created(){
      this.getList()
    },
    methods:{
      getList(){
        getListMessage({content:true}).then((response)=>{

          this.prizeList=response;
          console.log(this.prizeList)
        })
      },
      save(){
        sendMessage().then(res=>{

        })
      },
      refresh () {

        this.refreshing = true;
        this.$refs.container.scrollTop = 0;
        setTimeout(() => {
          this.refreshing = false;
          this.param.page = 0
          this.prizeList= []
          this.getList()
        }, 2000)
      },
      load () {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          this.param.page+=1
          this.getList()
        }, 2000)
      },

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
