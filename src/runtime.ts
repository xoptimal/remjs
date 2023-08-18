import init from "@unocss/runtime";
import { presetUno } from "unocss";

init({
  defaults: {
    presets: [presetUno()],
  },
  bypassDefined: true,
});
