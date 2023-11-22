import type { AttributifyAttributes } from "unocss";

declare module "react" {
  interface HTMLAttributes<T> extends AttributifyAttributes {}
}

