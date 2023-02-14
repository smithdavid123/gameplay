<template>
  <div
    v-if="show"
    class="module-alarm"
  >
    <div
      class="dismiss"
      @click="show = false"
    >
      <svg-icon
        icon-class="stop"
        class-name="stop-icon"
      />
    </div>
    <div class="illustration">
      <svg-icon
        icon-class="alarm"
        class-name="alarm-icon"
      />
    </div>
    <div class="text">
      <div class="title">
        温馨提示
      </div>
      <div class="text">
        <a>风控审核: <span class="audit">{{ auditCount.risk }}</span>笔</a><br>
        <a>提现审核: <span class="audit">{{ auditCount.finance }}</span>笔</a><br>
        <a>充值审核: <span class="audit">{{ auditCount.recharge }}</span>笔</a>
        <audio
          ref="audio"
          style="display: none;"
        >
          <source
            src="/static/media/notificationSound.wav"
            type="audio/wav"
          >
        </audio>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      show: false,
      auditCount: {
        risk: 0,
        finance: 0,
        recharge: 0
      }
    };
  },
  mounted() {
    this.timer = setInterval(() => {
      this.statAudit();
      this.$nextTick(_=> {
        this.show && this.$refs.audio.play();
      });
      setTimeout(() => {
        this.show = false;
      }, 5e3);
    }, 8e3);
  },
  beforeDestroy() {
    if (this.timer) clearInterval(this.timer);
  },
  methods: {
    // 审核统计
    async statAudit() {
      const {
        data
      } = await this.$api.statAudit();
      const { count, ...auditCount } = data;
      this.auditCount = auditCount;
      this.show = !!count;
    }
  }
};
</script>

<style lang="scss" scoped>
  .module-alarm {
    width: 300px;
    height: auto;
    z-index: 9000;
    position: fixed;
    right: 20px;
    bottom: 0;
    box-shadow: 3px 3px 10px 2px #5a5656;
    padding: 13px;
    margin: 0.5rem 0 1rem 0;
    border-radius: 2px;
    background: linear-gradient(225deg, #0073b7, #000000);
    transition: opacity 2s ease-in;
    opacity: 0.9;

    .dismiss {
      top: 1px;
      right: 1px;
      width: 40px;
      height: 40px;
      color: #fff !important;
      text-align: center;
      line-height: 40px;
      overflow: hidden;
      position: absolute;
      /* background-color: #B8B8B8; */
      border-radius: 50%;
      cursor: pointer;
      .stop-icon {
        font-size: 20px;
      }
    }

    .illustration {
      margin-top: 20px;
      float: left;
      width: 70px;
      height: 70px;

      .alarm-icon {
        font-size: 50px;
        color: #fff;
        animation: wrench 2.5s ease infinite;
      }
    }

    .text {
      .title {
        font-size: 18px;
        font-weight: bold;
        color: white;
        letter-spacing: 1px;
      }

      .text>a {
        color: white;
        letter-spacing: 1px;
        cursor: pointer;
      }

      .audit {
        color: #ff7936;
        font-weight: bold;
        font-size: 120%;
      }
    }
  }

  /* WRENCHING */
  @keyframes wrench {
    0% {
      transform: rotate(-12deg)
    }

    8% {
      transform: rotate(12deg)
    }

    10% {
      transform: rotate(24deg)
    }

    18% {
      transform: rotate(-24deg)
    }

    20% {
      transform: rotate(-24deg)
    }

    28% {
      transform: rotate(24deg)
    }

    30% {
      transform: rotate(24deg)
    }

    38% {
      transform: rotate(-24deg)
    }

    40% {
      transform: rotate(-24deg)
    }

    48% {
      transform: rotate(24deg)
    }

    50% {
      transform: rotate(24deg)
    }

    58% {
      transform: rotate(-24deg)
    }

    60% {
      transform: rotate(-24deg)
    }

    68% {
      transform: rotate(24deg)
    }

    75%,
    100% {
      transform: rotate(0deg)
    }
  }

  .faa-wrench.animated,
  .faa-wrench.animated-hover:hover,
  .faa-parent.animated-hover:hover>.faa-wrench {
    animation: wrench 2.5s ease infinite;
    transform-origin-x: 90%;
    transform-origin-y: 35%;
    transform-origin-z: initial;
  }

  .faa-wrench.animated.faa-fast,
  .faa-wrench.animated-hover.faa-fast:hover,
  .faa-parent.animated-hover:hover>.faa-wrench.faa-fast {
    animation: wrench 1.2s ease infinite;
  }

  .faa-wrench.animated.faa-slow,
  .faa-wrench.animated-hover.faa-slow:hover,
  .faa-parent.animated-hover:hover>.faa-wrench.faa-slow {
    animation: wrench 3.7s ease infinite;
  }
</style>