import chroma from "chroma-js";
import type { ColorShades } from '../types/color';

export function generateColorShades(baseColor: string): ColorShades {
  // 增加 lighter 的亮度，使用更大的 brighten 参数
  const colors = chroma.scale([chroma(baseColor).brighten(3), baseColor, chroma(baseColor).darken(2)])
    .mode("lab")
    .colors(6);

  return {
    lighter: colors[0],  // 更亮的颜色
    light: colors[1],
    base: colors[2],      // 基础色
    dark: colors[3],
    darker: colors[4],    // 深色
    deepest: colors[5]    // 最深色
  };
}