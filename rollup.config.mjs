import path from "path";
import commonjs from "@rollup/plugin-commonjs";
// import ts from 'rollup-plugin-typescript2';
// 将json 文件转换为ES6 模块
import json from "@rollup/plugin-json";
// 在node_模块中查找并绑定第三方依赖项（将第三方依赖打进包里）
import resolve from "@rollup/plugin-node-resolve";
import alias from "@rollup/plugin-alias";
// 将CommonJS模块转换为ES6
// rollup babel插件 兼容新特性
import babel from "rollup-plugin-babel";
// 优化代码
import { terser } from "rollup-plugin-terser";
import vue from "rollup-plugin-vue";
import image from "@rollup/plugin-image";
import copy from "rollup-plugin-copy";
import generatePackageJson from "rollup-plugin-generate-package-json";
import { fileURLToPath } from "url";

const __fileURLToPath = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__fileURLToPath);
// import postCss from 'rollup-plugin-postcss'
// import less from 'rollup-plugin-less'
// import eslint from '@rollup/plugin-eslint'
// 判断是是否为生产环境
// 开发环境or生产环境
const isPro = function () {
  return process.env.NODE_ENV === "production";
};

const config = (input, output, plugins = []) => {
  return {
    input,
    output,
    plugins: [
      vue({
        css: true, // Dynamically inject css as a <style> tag
        compileTemplate: true, // Explicitly convert template to render function
      }),
      resolve({
        extensions: [".mjs", ".js", ".vue", ".json", ".ts"],
      }), //快速查找外部模块
      alias({
        entries: [{ find: "@", replacement: path.resolve(__dirname, "src") }],
      }),
      commonjs(), //将CommonJS转换为ES6模块
      json(), //将json转换为ES6模块
      image(), //处理图片
      babel({
        runtimeHelpers: true,
        exclude: ["node_modules/**", "src/plugins/**.js"],
      }),
      isPro() && terser(),
      // copy({
      //   targets: [{ src: "package.json", dest: "dist/vision" }],
      // }),
      generatePackageJson({
        inputFolder: path.resolve(__dirname, ""),
        outputFolder: path.resolve(__dirname, "dist/vision"),
        baseContents: ({ name, description, version }) => {
          return {
            name,
            description,
            version,
            main: "index.umd.js",
          };
        },
      }),
      ...plugins,
    ],
    external: ["vue", "three", "@tweenjs/tween.js"],
  };
};
const configList = [
  config(path.resolve("./src/index.js"), [
    {
      file: "dist/vision/index.esm.js",
      name: "VisionUI",
      format: "esm",
      exports: "named",
      sourcemap: true,
    },
    {
      file: "dist/vision/index.umd.js",
      name: "VisionUI",
      format: "umd",
      globals: {
        vue: "Vue",
        three: "THREE",
        "@tweenjs/tween.js": "TWEEN",
      },
      exports: "named",
      sourcemap: true,
    },
    {
      file: "dist/vision/index.cjs.js",
      format: "iife",
      name: "VisionUI",
      globals: {
        vue: "Vue",
        three: "THREE",
        "@tweenjs/tween.js": "TWEEN",
      },
      exports: "named",
      sourcemap: true,
    },
  ]),
];
export default configList;
