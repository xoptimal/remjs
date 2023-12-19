import { ClassValue, clsx } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return inputs.join(" ");
}


export function getAntdSvgIcon(iconName: string) {
  return `/svg/antd/${iconName}.svg`;
}