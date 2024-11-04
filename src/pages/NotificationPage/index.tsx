// NotificationPage.tsx
import React from "react";
import { useNotification } from "../NotificationContext";
import "./index.scss";

const NotificationPage: React.FC = () => {
  const { notifications } = useNotification();

  return (
    <div className="Notification">
      <div className="notification">
        <h1 style={{ marginBottom: "20px" }}>Notification</h1>
        {notifications.map((notification) => (
          <div key={notification.id}>
            <h4>{notification.message}</h4>
            <p>{notification.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationPage;
