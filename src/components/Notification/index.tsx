import React from "react";
import { List } from "antd";

interface Notification {
  id: string;
  message: string;
  badge?: string;
  body?: string;
}

interface NotificationProps {
  notifications: Notification[];
}

const Notification: React.FC<NotificationProps> = ({ notifications }) => {
  return (
    <div>
      <h2>Notifications</h2>
      <List
        dataSource={notifications}
        renderItem={(item) => (
          <List.Item key={item.id}>
            <strong>{item.message}</strong>
            {item.body && <p>{item.body}</p>}
          </List.Item>
        )}
      />
    </div>
  );
};

export default Notification;
