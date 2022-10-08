import React from 'react';
import { Link } from "react-router-dom";
import { Buffer } from "buffer";

function CommentCard({ comment }) {
    return (
        <div>
            <Link to={`/comments/${comment.id}`}>
                <div>{comment.content}</div>
                <div>{comment.author.login}</div>
                <div>
                    {comment.images.map((image) => {
                        let src = 'data:image/png;base64,' + Buffer.from(image.image, "binary").toString("base64");
                        return (
                            <div key={image.id} style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                width: "50px",
                                height: "50px",
                                overflow: "hidden"
                            }}>
                                <img src={src} alt="comment" style={{width: "auto",
                                                                        height: "100%"}} />
                            </div>
                        );
                    })}
                </div>
            </Link>
            <hr/>
        </div>
    );
}

export default CommentCard;

