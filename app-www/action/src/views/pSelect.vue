<template>
  <div class="cr1" style="padding-top: 15px" >

    <mu-list v-for="(item, idx) in layout" :key="idx" style="padding-bottom: 10px;padding-top: 0">
      <mu-list-item>
        <mu-list-item-action style="margin-right: 10px;font-size: 16px"><span style="writing-mode: vertical-lr;border: 1px solid #e6e3e3;display: inline-block;
    padding: 5px 0;">{{item.title}}</span></mu-list-item-action>
        <mu-list-item-content>
          <!-- 便捷操作按钮 -->
          <mu-list-item-title style="height: auto;    white-space: normal;">
            <span
              class="type-nav"
              :class="{'currentType': toolSels[idx] === o}"
              v-for="(o, j) in tools[idx]"
              :key="j"
              @touchstart="toolSel(idx, item.title, o, item.balls)"
            ><i style="font-style: normal">{{o}}</i>
              </span>
          </mu-list-item-title>
          <!-- 投注数字 -->
          <mu-list-item-sub-title style="height: auto; white-space: normal; margin-bottom: 10px;">
            <template v-if="item.balls.length == 10">
              <p style="margin-bottom: 0">
                <template v-for="(n, j) in item.balls.slice(0,5)">

                 <span
                   class="type-nav-number"
                   :key="j"
                   :class="{'currentType1': numbers[idx][n] === 1 }"
                   @touchstart="clickNumber(idx, item.title, item.values ? item.values[j] : n)"
                 >{{n}}</span>



                </template>
              </p>   <p style="margin-bottom: 0;margin-top: 0">
                <template v-for="(n, j) in item.balls.slice(5,10)">

                 <span
                   class="type-nav-number"
                   style="margin-bottom: 0"
                   :key="j"
                   :class="{'currentType1': numbers[idx][n] === 1 }"
                   @touchstart="clickNumber(idx, item.title, item.values ? item.values[j] : n)"
                 >{{n}}</span>



                </template>
              </p>


            </template>
            <template v-else>
              <template v-for="(n, j) in item.balls">

                 <span
                   class="type-nav-number"
                   :key="j"
                   :class="{'currentType1': numbers[idx][n] === 1 }"
                   @touchstart="clickNumber(idx, item.title, item.values ? item.values[j] : n)"
                 >{{n}}</span>



              </template>
            </template>

          </mu-list-item-sub-title>
        </mu-list-item-content>
      </mu-list-item>
      <mu-divider ></mu-divider>
    </mu-list>
  </div>
</template>
<script>
import { GAMES } from "@/assets/js/game/method";

function toDict(ary, v) {
  return ary.reduce((a, b) => {
    a[b] = v || 1;
    return a;
  }, {});
}

import { InlineXNumber } from "vux";
export default {
  name: "pSelect",
  props: ["lottery", "method"],
  model:{
    prop: 'method'
  },
  components: {
    InlineXNumber
  },
  data() {
    return {
      layout: {},
      // 已选号码
      numbers: [],
      tools: [],
      toolSels: [],
      game: this.lottery.shortName,
    };
  },
  mounted() {
    this.update();
  },
  watch: {
    method: function (v) {
      this.update();
    }
  },
  methods: {
    init: function() {
      this.numbers = this.layout.map(d => {
        return {};
      });
      this.toolSels = this.layout.map(d => "");
    },
    update: function () {
      let type = parseInt(this.lottery.type) - 1;
      this.layout = GAMES[type].method[this.method].select.layout;

      this.tools = this.layout.map(d => {
        let t = ["全"];
        if (d.tools == "full") t = t.concat(["大", "小"]);
        if (d.tools != "min") t = t.concat(["单", "双"]);
        t.push("清");
        return t;
      });
      this.init();
    },
    // 工具
    toolSel(index, title, n, balls) {
      this.toolSels[index] = n;
      let se = [];
      if (n == "全") {
        se = balls;
      } else if (n == "大") {
        se = balls.filter(function(a) {
          return parseInt(a) >= balls[Math.ceil(balls.length / 2)];
        });
      } else if (n == "小") {
        se = balls.filter(function(a) {
          return parseInt(a) < balls[Math.ceil(balls.length / 2)];
        });
      } else if (n == "单") {
        se = balls.filter(function(a) {
          return parseInt(a) % 2 !== 0;
        });
      } else if (n == "双") {
        se = balls.filter(function(a) {
          return parseInt(a) % 2 == 0;
        });
      } else if (n == "清") {
        se = [];
      } else if (n === "") {
        se.push(balls);
      }
      this.$set(this.numbers, index, toDict(se));
      this.$emit("changeNumber", this.numbers);
    },
    clickNumber(index, title, ball) {
      // 已存在，则取消
      this.$set(this.toolSels, index, "");
      this.numbers[index][ball] = this.numbers[index][ball] ? 0 : 1;
      this.$emit("changeNumber", this.numbers);
    }
  }
};
</script>
<style scoped>
.form-title {
  margin: 0;
  text-align: center;
  border-top: 1px solid #b2b2b2;
  padding: 10px 0px;
  background: #fff;
}

.play-title {
  background: #9cc1de;
  color: #fff;
  padding: 10px;
}
.vux-x-icon {
  fill: #fff;
}
.mu-dialog {
  font-size: 14px;
}
.play-game-tab {
  overflow-x: auto;
  width: 80%;
  float: left;
}
.play-game-nav .iconfont {
  float: right;
}
.type-nav {
  display: inline-block;
  margin-bottom: 5px;
  font-size: 16px;
  border: 1px solid #03A9F4;
  padding: 2px 10px;
  border-radius: 5px;
  margin-right: 6px;
  color: #03A9F4;
}
.type-nav-number {
  border: 1px solid #e6e3e3;
  display: inline-block;
  border-radius: 50%;
  margin-right: 5px;
  margin-bottom: 10px;
  font-size: 20px;
  width: 40px;
  height: 40px;
  text-align: center;
  line-height: 40px;

}
@media screen and (max-width: 330px) {
  .type-nav-number {
    width: 36px;
    height: 36px;
    line-height: 36px;
  }
  .type-nav{
    font-size: 14px;
    padding: 2px 7px;
  }

}
.currentType {
  background-color: #60b1dd;
  color: #fff;
}
.currentType1 {
  background-color: #60b1dd;
  color: #fff;
}
.play-game-nav {
  padding: 0px 10px;
  border-bottom: 1px solid #e1e2e4;
  background-color: #fafafa;
}
.compute-li {
  text-align: center;
  border-bottom: 1px solid #e1e2e4;
  padding: 15px 0px;
}
/*.play-game-nav .mu-tab{
  min-width: auto;
}*/
</style>
