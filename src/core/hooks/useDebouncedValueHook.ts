import { useDebounce } from "ahooks";
import { useContext, useEffect, useState } from "react";
import NodeContext from "../context";

export function checkValue(value: string) {
  if (!isNaN(parseFloat(value))) {
    return true;
  } else {
    return value.lastIndexOf("px") > -1 || value.lastIndexOf("rem") > -1;
  }
}

export function checkClassName({
  className,
  tailwindPrefix,
  matchValue,
}: {
  className: string;
  tailwindPrefix: string;
  parentTailwindPrefix?: string;
  matchValue?: any;
}) {
  if (className.indexOf(`${tailwindPrefix}-`) > -1) {
    if (matchValue) {
      return matchValue(formatTailwindValue(className), tailwindPrefix);
    }
    return (
      className.lastIndexOf("[") > -1 &&
      className.lastIndexOf("]") > -1 &&
      checkValue(formatTailwindValue(className))
    );
  }

  return false;
}

export function formatTailwindValue(className: string) {
  return className.substring(className.indexOf("[") + 1, className.length - 1);
}

export default function useDebouncedValueHook(props: any) {
  const {
    tailwindPrefix,
    items = [],
    matchValue,
    parentTailwindPrefix,
  } = props;

  const [value, setValue] = useState<any>("");
  const debouncedValue = useDebounce(value, { wait: 500 });
  const { target, onChange } = useContext(NodeContext);

  useEffect(() => {
    if (target) {
      let findIndex = target.className.findIndex(
        (className) =>
          className === debouncedValue ||
          className === `${tailwindPrefix}-[${debouncedValue}]` ||
          className === `${parentTailwindPrefix}-[${debouncedValue}]`
      );

      if (findIndex == -1 && debouncedValue.length > 0) {
        let className;
        const mutuallyExclusives = target.className
          .filter((className) =>
            checkClassName({
              className,
              tailwindPrefix,
              matchValue,
            })
          )
          .concat(Object.keys(items));

        if (debouncedValue.length > 0) {
          if (items[debouncedValue]) {
            //  录入的是常量
            className = debouncedValue;
          } else if (
            !matchValue ||
            matchValue(debouncedValue, tailwindPrefix)
          ) {
            className = `${tailwindPrefix}-[${debouncedValue}]`;
          }
        }
        onChange({ className, mutuallyExclusives });
      }
    }
  }, [debouncedValue]);

  useEffect(() => {
    let value = "";
    if (target) {
      let findIndex = target.className.findIndex(
        (className) => items[className]
      );
      if (findIndex > -1) {
        value = target.className[findIndex];
      } else {
        findIndex = target.className.findIndex((className) =>
          checkClassName({
            className,
            tailwindPrefix,
            matchValue,
          })
        );

        if (findIndex === -1 && parentTailwindPrefix) {
          findIndex = target.className.findIndex((className) =>
            checkClassName({
              className,
              tailwindPrefix: parentTailwindPrefix,
              matchValue,
            })
          );
        }

        if (findIndex > -1) {
          value = target.className[findIndex];
          //  格式化
          value = formatTailwindValue(value);
        }
      }
    }
    setValue(value);
  }, [target]);

  const handleInput = (event: any) => {
    setValue(typeof event === "string" ? event : event.target.value);
  };

  return [value, handleInput];
}
