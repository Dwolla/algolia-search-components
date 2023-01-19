import pkg from "./package.json" assert { type: "json" };
import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "rollup-plugin-typescript2";
import terser from "@rollup/plugin-terser";
import external from "rollup-plugin-peer-deps-external";
import postcss from "rollup-plugin-postcss";
import dts from "rollup-plugin-dts";

export default [
  {
    input: "src/index.ts",
    output: [
      {
        file: pkg.main,
        format: "cjs"
      },
      {
        file: pkg.module,
        format: "es"
      }
    ],
    plugins: [
      external(),
      nodeResolve(),
      commonjs(),
      typescript({
        exclude: ["**/stories/**"],
        tsconfig: "./tsconfig.json",
        tsconfigOverride: {
          compilerOptions: {
            declaration: false,
            emitDeclarationOnly: false
          }
        }
      }),
      postcss(),
      terser()
    ]
  },
  {
    input: "build/types/index.d.ts",
    output: [
      {
        file: pkg.types,
        format: "es"
      }
    ],
    external: [/\.scss$/],
    plugins: [dts()]
  }
];
