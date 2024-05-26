import React, {useState, useEffect} from 'react';
import {Form, Input, Button, Select, InputNumber, Space, Checkbox, message} from 'antd';
import {MinusCircleOutlined, PlusOutlined} from '@ant-design/icons';

function QuestionForm({onSave}) {
    const [form] = Form.useForm();
    const [responseType, setResponseType] = useState('');

    useEffect(() => {
        // Automatically set options to an empty array when the type is subjective
        if (responseType === 'subjective') {
            form.setFieldsValue({options: []});
        }
    }, [responseType, form]);

    const onFinish = (values) => {
        // Custom validation for correct options
        const {options} = values;
        console.log(values);
        if (values.responseType === 'single' && options.filter(o => o.isCorrect).length !== 1) {
            message.error('Single choice question must have exactly one correct option.');
            return;
        }
        if (values.responseType === 'multiple' && options.filter(o => o.isCorrect).length < 2) {
            message.error('Multiple choice question must have at least two correct options.');
            return;
        }
        // Ensure options array is included even if it's empty
        if (values.responseType === 'subjective' && !values.options) {
            values.options = [];
        }

        onSave(values);
        form.resetFields();
        setResponseType('');
    };

    const handleRemoveOption = (index, fields, remove) => {
        remove(index);
    };

    return (<Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{responseType: 'subjective', options: []}}
    >
        <Form.Item
            name="responseType"
            label={<span className="font-semibold">Question Type</span>}
            rules={[{required: true}]}
        >
            <Select onChange={setResponseType}>
                <Select.Option value="subjective">Essay (Subjective)</Select.Option>
                <Select.Option value="single">Single Choice</Select.Option>
                <Select.Option value="multiple">Multiple Choice</Select.Option>
            </Select>
        </Form.Item>
        <Form.Item name="questionInfo" label={<span className="font-semibold">Question Content</span>} rules={[{required: true}]}>
            <Input.TextArea/>
        </Form.Item>
        <Form.Item name="marks" label={<span className="font-semibold">Marks</span>} rules={[{required: true}]}>
            <InputNumber min={1}/>
        </Form.Item>
        {(responseType === 'single' || responseType === 'multiple') && (<Form.List name="options">
            {(fields, {add, remove}) => (<>
                {fields.map(({key, name, ...restField}, index) => (
                    <Space key={key} style={{display: 'flex', marginBottom: 8}} align="baseline">
                        <Form.Item
                            {...restField}
                            name={[name, 'value']}
                            rules={[{required: true, message: 'Option text is required'}]}
                            label="Option"
                        >
                            <Input placeholder="Enter option text"/>
                        </Form.Item>
                        <Form.Item
                            {...restField}
                            name={[name, 'isCorrect']}
                            valuePropName="checked"
                            initialValue={false} // Ensure the initial value is explicitly set to false
                            rules={[{
                                required: true, message: 'Correct indicator is required'
                            }]}
                            label="Correct"
                        >
                            <Checkbox/>
                        </Form.Item>
                        <MinusCircleOutlined onClick={() => handleRemoveOption(index, fields, remove)}/>
                    </Space>))}
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined/>}>
                    Add Option
                </Button>
            </>)}
        </Form.List>)}
        <Button type="primary" htmlType="submit" className="w-full main-black-btn mt-8">
            Save Question
        </Button>
    </Form>);
}

export default QuestionForm;
