import ColorSelect from "@/components/ColorSelect";
import React from "react";
import theme from "@/utils/theme";
import { Col, Row } from "antd";

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
export default function Background(props: any) {
  return (
    <Row gutter={[0, 12]}>
      <Col span={24}>
        <ColorSelect items={colorItems} tailwindPrefix={tailwindPrefix} />
      </Col>
    </Row>
  );
}
