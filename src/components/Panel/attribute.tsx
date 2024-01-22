import { Col, Row } from "antd";
import InputItem from "../InputItem";


type AttributeType = {
    placeholder: string,
    tailwindPrefix: string,
    styleKey: string,
}

interface AttributePanelProps {
    attributes: AttributeType[]
}

export default function AttributePanel(props: AttributePanelProps) {

    const {attributes = []} = props;

    return <Row gutter={[12, 12]}>
    {attributes.map((item, index) => {
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
}