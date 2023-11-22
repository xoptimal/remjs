import {Form, Input, Modal, ModalProps, Select} from "antd";


export default function CanvasModal(props: ModalProps) {

    const {onCancel, open} = props;

    const onFinish = (values: any) => {
        console.log('onFinish')
    }

    const onOk = (values: any) => {
        console.log('111')
    }

    return <Modal title={"新建画布"}
                  onCancel={onCancel}
                  open={open}
                  okButtonProps={{htmlType: 'submit'}}>
        <Form labelCol={{span: 3}} onFinish={onFinish}>
            <Form.Item label={"预设"}><Select/></Form.Item>
            <Form.Item label={"长"}><Input/></Form.Item>
            <Form.Item label={"宽"}><Input/></Form.Item>
            <Form.Item label={"背景色"}><Input/></Form.Item>
        </Form>
    </Modal>

}