import React, { useEffect, useState } from 'react';
import { Card, List, Avatar } from 'antd';
import api from '../../components/config/api';



interface Comment {
    id: number; // Unique identifier for the comment
    username: string; // User's name
    rating: number; // Rating (stars)
    date: string; // Date of the comment
    content: string; // Comment content
    images: string[]; // Array of image URLs
    likes: number; // Number of likes
}

const ShowRatings: React.FC = () => {
    const [comments, setComments] = useState<Comment[]>([]);

    const fetchComments = async () => {
        try {
            const response = await api.get('comments'); // Adjust the endpoint to match your API
            console.log(response.data);
            setComments(response.data);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchComments();
    }, []);

    return (
        <Card title="Comments" style={{ width: 600, margin: 'auto' }}>
            <List
                itemLayout="vertical"
                dataSource={comments}
                renderItem={(item) => (
                    <List.Item key={item.id}>
                        <List.Item.Meta
                            avatar={<Avatar>{item.username.charAt(0)}</Avatar>} // Display first letter of username
                            title={
                                <span>
                                    {item.username} <span>⭐ {item.rating}</span>
                                </span>
                            }
                            description={`${item.date} | Likes: ${item.likes}`}
                        />
                        <p>{item.content}</p>
                        {item.images && item.images.length > 0 && (
                            <div>
                                {item.images.map((img, index) => (
                                    <img key={index} src={img} alt={`comment-image-${index}`} style={{ width: 100, marginRight: 10 }} />
                                ))}
                            </div>
                        )}
                    </List.Item>
                )}
            />
        </Card>
    );
};

export default ShowRatings;
