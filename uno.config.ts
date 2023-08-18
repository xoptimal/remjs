import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetUno,
  transformerCompileClass,
  transformerDirectives,
  transformerVariantGroup,
} from "unocss";
import transformerAttributifyJsx from "@unocss/transformer-attributify-jsx-babel";

export default defineConfig({
  rules: [],
  presets: [presetUno(), presetAttributify(), presetIcons()],
  transformers: [
    // @ts-ignore
    transformerAttributifyJsx(),
    transformerCompileClass(),
    transformerVariantGroup(),
    transformerDirectives(),
  ],
});
