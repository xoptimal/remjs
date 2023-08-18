// @ts-ignore

type ThemeItem = {
  colors?: { label: string; value: string }[];
};

type ThemeType = {
  //  默认
  light?: ThemeItem;
  //  暗黑
  dark?: ThemeItem;
  //  字体加粗
  weightItems: Record<string, string>;
  //  字体大小
  sizeItems: Record<string, string>;
  //  行间距
  leadingItems: Record<string, string>;
  //  字间距
  letterSpacingItems: Record<string, string>;
  //  字体颜色
  colors: Record<string, string>;
  //  边框样式
  borderItems: Record<string, string>;
  roundedItems: Record<string, string>;
};

const defaultTheme: ThemeType = {
  weightItems: {
    "font-thin": "font-thin",
    "font-extralight": "extralight",
    "font-light": "light",
    "font-normal": "normal",
    "font-medium": "medium",
    "font-semibold": "semibold",
    "font-bold": "bold",
    "font-extrabold": "extrabold",
    "font-black": "black",
  },
  sizeItems: {
    "text-xs": "xs",
    "text-sm": "sm",
    "text-base": "base",
    "text-lg": "lg",
    "text-xl": "xl",
    "text-2xl": "2xl",
    "text-3xl": "3xl",
    "text-4xl": "4xl",
    "text-5xl": "5xl",
    "text-6xl": "6xl",
    "text-7xl": "7xl",
    "text-8xl": "8xl",
    "text-9xl": "9xl",
  },
  letterSpacingItems: {
    "tracking-tighter": "tighter",
    "tracking-tight": "tight",
    "tracking-normal": "normal",
    "tracking-wide": "wide",
    "tracking-wider": "wider",
    "tracking-widest": "widest",
  },
  leadingItems: {
    "leading-3": "3",
    "leading-4": "4",
    "leading-5": "5",
    "leading-6": "6",
    "leading-7": "7",
    "leading-8": "8",
    "leading-9": "9",
    "leading-10": "10",
    "leading-none": "none",
    "leading-tight": "tight",
    "leading-snug": "snug",
    "leading-normal": "normal",
    "leading-relaxed": "relaxed",
    "leading-loose": "loose",
  },
  colors: {},
  borderItems: {
    "border-solid": "solid",
    "border-dashed": "dashed",
    "border-dotted": "dotted",
    "border-double": "double",
    "border-hidden": "hidden",
    "border-none": "none",
  },
  roundedItems: {
    rounded: "rounded",
    "rounded-md": "md",
    "rounded-lg": "lg",
    "rounded-full": "full",
    "rounded-t-lg": "t-lg",
    "rounded-r-lg": "r-lg",
    "rounded-b-lg": "b-lg",
    "rounded-l-lg": "l-lg",
    "rounded-tl-lg": "tl-lg",
    "rounded-tr-lg": "tr-lg",
    "rounded-br-lg": "br-lg",
    "rounded-bl-lg": "bl-lg",
  },
};

export const createColorItems = (tailwindPrefix: string) => {
  const temp: Record<string, string> = {};
  for (const [key, value] of Object.entries(defaultTheme.colors)) {
    temp[`${tailwindPrefix}-${key}`] = value;
  }
  return temp;
};

export default defaultTheme;
