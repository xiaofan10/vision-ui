<template>
  <div id="app">
    <BG1 :models="models" :current="current" @change="handleChange" />
  </div>
</template>

<script>
import { BG1 } from "vision-design-ui";
// import BG1 from "@/components/BG1.vue";
import GetFlatGeometry from "@/utils/GetFlatGeometry";
import { BufferGeometry, Float32BufferAttribute } from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
function VerticesDuplicateRemove(arr) {
  const set = new Set();
  let t = [];
  for (let i = 0; i < arr.length; i++) {
    t.push(arr[i]);
    if (i % 3 === 2) {
      set.add(t.join(","));
      t = [];
    }
  }
  const res = [];
  set.forEach((val) => {
    res.push(...val.split(",").map((val) => Number(val)));
  });

  return new Float32Array(res);
}
const scaleNum = 600;
let Q = 0;

const Models = [
  {
    name: "cube",
    path: new URL("./assets/models/examples/cube.fbx", import.meta.url).href,
    onLoadComplete(Geometry) {
      const s = 400;
      Geometry.scale(s, s, s);
    },
    loader: {
      loaderInstance: new FBXLoader(),
      load(group) {
        const g = new BufferGeometry();
        let arr = new Float32Array([]);
        for (const i of group.children) {
          arr = new Float32Array([
            ...arr,
            ...i.geometry.attributes.position.array,
          ]);
        }
        g.setAttribute(
          "position",
          new Float32BufferAttribute(VerticesDuplicateRemove(arr), 3)
        );
        return g;
      },
    },
  },
  {
    name: "ball",
    path: new URL("./assets/models/examples/ball.obj", import.meta.url).href,
    onLoadComplete(Geometry) {
      Geometry.scale(scaleNum, scaleNum, scaleNum);
      Geometry.translate(-600, 0, -100);
    },
    onEnterStart() {
      console.log("ball enter start");
    },
    onEnterEnd() {
      console.log("ball enter end");
    },
  },
  {
    name: "wave",
    geometry: GetFlatGeometry(),
    onAnimationFrameUpdate(PerfromPoint, TweenList) {
      const p = PerfromPoint.geometry.getAttribute("position");
      TweenList.forEach((val, i) => {
        if (val.isPlaying === false) {
          p.setY(
            i,
            Math.sin((i + 1 + Q) * 0.3) * 50 +
              Math.sin((i + Q) * 0.5) * 50 -
              500
          );
        }
      });
      Q += 0.08;
      return true;
    },
  },
  {
    name: "cone",
    path: new URL("./assets/models/examples/cone.obj", import.meta.url).href,
    onLoadComplete(Geometry) {
      Geometry.scale(scaleNum, scaleNum, scaleNum);
      Geometry.translate(600, 100, -100);
    },
  },
  {
    name: "ring",
    path: new URL("./assets/models/examples/ring.obj", import.meta.url).href,
    onLoadComplete(Geometry) {
      Geometry.scale(scaleNum, scaleNum, scaleNum);
      Geometry.translate(600, 100, -100);
    },
  },
];

export default {
  name: "App",
  components: {
    BG1,
  },
  data() {
    return {
      models: Models,
      current: 0,
    };
  },
  mounted() {
    window.xxx = this.$THREE;

    setInterval(() => {
      if (this.current > 3) {
        this.current = 0;
      } else {
        this.current += 1;
      }
    }, 4000);
  },
  methods: {
    handleChange() {
      console.log("next", arguments);
    },
  },
};
</script>

<style>
#app {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
}
</style>
