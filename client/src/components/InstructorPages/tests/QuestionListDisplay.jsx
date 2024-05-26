import { List, Button, Space, Empty } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

function QuestionListDisplay({ questions, onRemove }) {
  return (
    <div className={"border border-gray-50 shadow-lg rounded-lg p-3"}>
      <List
        dataSource={questions}
        renderItem={(item, index) => (
          <List.Item
            key={index}
            actions={[
              <Button
                icon={<DeleteOutlined />}
                onClick={() => onRemove(index)}
                type="danger"
                shape="circle"
                className={"hover:scale-125"}
              />,
            ]}
          >
            <List.Item.Meta
              title={`Question ${index + 1}`}
              description={`Info: ${item.questionInfo} | Marks: ${item.marks}`}
            />
            {item.options && item.options.length > 0 && (
              <div>
                <strong>Options:</strong>
                <ul>
                  {item.options.map((option, optIndex) => (
                    <li key={optIndex}>
                      {option.value} {option.isCorrect ? "(Correct)" : ""}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </List.Item>
        )}
        locale={{
          emptyText: (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={<span>No questions added yet</span>}
            />
          ),
        }}
      />
    </div>
  );
}

export default QuestionListDisplay;
