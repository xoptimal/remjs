import { ClassValue, clsx } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return inputs.join(" ");
}
