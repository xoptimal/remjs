import ColorSelect from "@/components/ColorSelect";
import React, { useState } from "react";
import theme from "@/core/utils/theme";
import { Button, Col, ColorPicker, Input, Row, Upload } from "antd";
import RemDropdown from "@/components/DropDown";
import { ChevronDown } from "lucide-react";
import useDebouncedValueHook from "@/core/hooks/useDebouncedValueHook";
import { UploadOutlined } from "@ant-design/icons";

const tailwindPrefix = "bg";

const colorItems = (() => {
  const temp: Record<string, string> = {};
  for (const [key, value] of Object.entries(theme.colors)) {
    temp[`${tailwindPrefix}-${key}`] = value;
  }
  return temp;
})();

const matchValue = (value: string) =>
  /^#[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/.test(value);
export default function BackgroundPanel(props: any) {
  // // const { items = [], tailwindPrefix, defaultColor = "#000000" } = props;
  // //
  // // const [value, setValue] = useDebouncedValueHook({
  // //   tailwindPrefix,
  // //   items,
  // //   matchValue,
  // // });
  //
  // // const [url, setUrl] = useState<string>("");
  // //
  // // const onChange = (e: any) => {
  // //   const file = e.target.files[0];
  // //   const reader = new FileReader();
  // //   reader.readAsDataURL(file);
  // //   reader.onload = function () {
  // //     const result = reader.result;
  // //
  // //     console.log(result);
  // //
  // //     // img.src = result;
  // //   };
  // //   console.log(file.path);
  //
  //   // const reader = new FileReader();
  //   // reader.readAsDataURL(file);
  //   // reader.onload = (e) => {
  //   //   const result = e.target?.result;
  //   //   if (result) {
  //   //     setValue(result as string);
  //   //   }
  //   // };
  //   // reader.onerror = (error) => {
  //   //   console.log("Error: ", error);
  //   // };
  //   // e.target.value = "";
  //   // e.preventDefault();
  //   // e.stopPropagation();
  //   return false;
  // };
  //
  // console.log("url", url);

  return (
    <Row gutter={[0, 12]}>
      <Col span={24}>
        <ColorSelect items={colorItems} tailwindPrefix={tailwindPrefix} />
      </Col>

      {/* <Col span={24}>
        <Button
          className={"p-0 pr-[14px] w-full flex items-center justify-between"}
        >
          <div className={"flex items-center justify-between"}>
            <div
              className={`w-[77px] h-[30px] rounded-l-[6px] border-r-[1px] border-[#d9d9d9] bg-cover bg-center ${url}`}
            >
              <input
                type={"file"}
                accept="image/*"
                onChange={onChange}
                className={`opacity-0 absolute left-0 top-0 w-full h-full`}
              />
              <UploadOutlined />
            </div>

            <Input
              bordered={false}
              value={value}
              onChange={setValue}
              className={"flex-1"}
              placeholder={"选择图片"}
            />
          </div>

          <RemDropdown
            items={items}
            tailwindPrefix={tailwindPrefix}
            value={value}
            setValue={setValue}
          >
            <ChevronDown className={"cursor-pointer w-[12.96px]"} size={16} />
          </RemDropdown>
        </Button>
      </Col>*/}
    </Row>
  );
}
