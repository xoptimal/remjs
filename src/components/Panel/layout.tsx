
import InputItem from "@/components/InputItem";
import { IconItem } from "@/components/Panel/typography";
import { Button, Col, Row } from "antd";
import {
  AlignCenterHorizontal,
  AlignEndHorizontal,
  AlignHorizontalJustifyCenter,
  AlignHorizontalJustifyEnd,
  AlignHorizontalJustifyStart,
  AlignStartHorizontal
} from "lucide-react";
import InputItemToDom from "../InputItem/InputItemToElement";

const textStyles: any[] = [
  {
    placeholder: "WIDTH",
    tailwindPrefix: "w",
    styleKey: "width",
  },
  {
    placeholder: "HEIGHT",
    tailwindPrefix: "h",
    styleKey: "height",
  },
  {
    placeholder: "MAX WIDTH",
    tailwindPrefix: "max-w",
  },
  {
    placeholder: "MAX HEIGHT",
    tailwindPrefix: "max-h",
  },
  {
    placeholder: "MIN WIDTH",
    tailwindPrefix: "min-w",
  },
  {
    placeholder: "MIN HEIGHT",
    tailwindPrefix: "min-h",
  },
];

const layoutStyles: any[] = [
  {
    icon: <AlignStartHorizontal />,
    className: ["flex", "items-start"],
    mutuallyExclusives: ["items-center", "items-end"],
  },
  {
    icon: <AlignCenterHorizontal />,
    className: ["flex", "items-center"],
    mutuallyExclusives: ["items-start", "items-end"],
  },
  {
    icon: <AlignEndHorizontal />,
    className: ["flex", "items-end"],
    mutuallyExclusives: ["items-start", "items-center"],
  },
  {
    icon: <AlignHorizontalJustifyStart />,
    className: ["flex", "justify-start"],
    mutuallyExclusives: ["justify-end", "justify-center"],
  },
  {
    icon: <AlignHorizontalJustifyCenter />,
    className: ["flex", "justify-center"],
    mutuallyExclusives: ["justify-start", "justify-end"],
  },
  {
    icon: <AlignHorizontalJustifyEnd />,
    className: ["flex", "justify-end"],
    mutuallyExclusives: ["justify-start", "justify-center"],
  },
];

export default function Layout() {
  return (
    <Row gutter={[12, 12]}>
      <Col span={24}>
        <Button.Group className={"w-full"}>
          {layoutStyles.map(IconItem)}
        </Button.Group>
      </Col>
      {textStyles.map((item, index) => {
        if (item.tailwindPrefix === "h" || item.tailwindPrefix === "w") {
          return (
            <Col span={12} key={item.tailwindPrefix}>
              <InputItemToDom
                styleKey={item.styleKey}
                placeholder={item.placeholder}
              />
            </Col>
          );
        }

        return (
          <Col span={12} key={item.tailwindPrefix}>
            <InputItem
              tailwindPrefix={item.tailwindPrefix}
              placeholder={item.placeholder}
            />
          </Col>
        );
      })}
    </Row>
  );
}
