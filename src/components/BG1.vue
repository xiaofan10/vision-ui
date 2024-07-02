<template>
  <div class="layout">
    <div class="index_page">
      <div class="canvas_wrapper" ref="wrapper"></div>
      <ul class="function_list">
        <!-- <li @click={() => MainParticle?.ListenMouseMove()}>ListenMouseMove</li>
        <li @click={() => MainParticle?.StopListenMouseMove()}>StopListenMouseMove</li>
        <li @click={() => MainParticle?.AlignCameraCenter()}>AlignCameraCenter</li>
        <li @click={() => MainParticle?.AlignCameraCenter(true)}>AlignCameraCenter(immediately)</li> -->
      </ul>
    </div>
  </div>
</template>

<script>
import { ParticleSystem, AtmosphereParticle } from "@/THREE/BG1";
import Tween from "@tweenjs/tween.js";

let wrapper = null;

const TurnBasicNum = { firefly: 0.002 };
const al = 1500;

const tween2 = new Tween.Tween(TurnBasicNum).easing(
  Tween.Easing.Exponential.In
);
const tween1 = new Tween.Tween(TurnBasicNum).easing(
  Tween.Easing.Exponential.In
);

const Atomsphere1 = new AtmosphereParticle({
  longestDistance: al,
  particleSum: 500,
  renderUpdate: (Point) => {
    Point.rotation.x -= TurnBasicNum.firefly;
  },
  callback: (Point) => {
    Point.position.z = -1 * al;
  },
  onChangeModel: () => {
    tween2.stop();
    tween1.stop().to({ firefly: 0.04 }, 1500).chain(tween2);
    tween2.to({ firefly: 0.002 }, 1500);
    tween1.start();
  },
});
const Atomsphere2 = new AtmosphereParticle({
  longestDistance: al,
  particleSum: 500,
  renderUpdate: (Point) => {
    Point.rotation.y += TurnBasicNum.firefly;
  },
  callback: (Point) => {
    Point.position.y = -0.2 * al;
    Point.position.z = -1 * al;
  },
});
const Atomsphere3 = new AtmosphereParticle({
  longestDistance: al,
  particleSum: 500,
  renderUpdate: (Point) => {
    Point.rotation.z += TurnBasicNum.firefly / 2;
  },
  callback: (Point) => {
    Point.position.z = -1.2 * al;
  },
});

export default {
  name: "HelloWorld",
  props: {
    models: Array,
    current: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      cur: 0,
    };
  },

  watch: {
    current(val) {
      this.cur = val;
      this.MainParticle.ChangeModel(this.models[val].name);
    },
    models(val) {
      this.MainParticle.updateModels(val);
    },
  },

  mounted() {
    this.cur = this.current;
    wrapper = this.$refs.wrapper;

    if (this.MainParticle == null && wrapper != null) {
      this.MainParticle = new ParticleSystem({
        CanvasWrapper: wrapper,
        Models: this.models,
        addons: [Atomsphere1, Atomsphere2, Atomsphere3],
        onModelsFinishedLoad: () => {
          this.MainParticle?.ListenMouseMove();
        },
      });

      this.$on("change", this.bindOnChange);
    }
  },
  methods: {
    bindOnChange() {
      this.$emit("change", { index: this.cur });
    },
  },
  destroyed() {
    this.$off("change", this.bindOnChange);
    this.MainParticle?.StopListenMouseMove();
    this.MainParticle?.destroy();
  },
};
</script>

<style scoped>
.layout {
  width: 100%;
  height: 100%;
}
.index_page {
  width: 100%;
  height: 100%;
}

.canvas_wrapper {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.list,
.function_list {
  position: fixed;
  right: 0.6rem;
  top: 50%;
  width: fit-content;
  transform: translateY(-50%);
}
li {
  width: fit-content;
  color: #fff;
  font-size: 0.4rem;
  cursor: pointer;
  opacity: 0.8;
}
li:hover {
  opacity: 1;
}

.list {
  right: 0.6rem;
}

.function_list {
  left: 0.6rem;
}
</style>
