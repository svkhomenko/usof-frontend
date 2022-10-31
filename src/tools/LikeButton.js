import React from "react";
import { LIKE, DISLIKE, UPDATE, DELETE } from "../const";

function LikeButton({ isLiked, handleLikeClick, isActive, likesCount, dislikesCount }) {
    let clss = 'like_outer';
    if (!isActive) {
        clss += ' inactive';
    }

    let clickHandler = (e) => {e.preventDefault();};
    if (isActive) {
        clickHandler = (e, type, action) => {
            e.preventDefault();
            handleLikeClick(type, action);
        };
    }
    
    if (isLiked) {
        if (isLiked.type === 'like') {
            return (
                <span className="like_container">
                    <span className="count">{likesCount}</span>
                    <span className={clss} onClick={(e) => {clickHandler(e, LIKE, DELETE);}}>
                        <iconify-icon icon="ant-design:like-filled" />
                    </span> 
                    <span className="count">{dislikesCount}</span>
                    <span className={clss} onClick={(e) => {clickHandler(e, DISLIKE, UPDATE);}}>
                        <iconify-icon icon="ant-design:dislike-outlined" />
                    </span> 
                </span>
            );
        }
        else {
            return (
                <span className="like_container">
                    <span className="count">{likesCount}</span>
                    <span className={clss} onClick={(e) => {clickHandler(e, LIKE, UPDATE);}}>
                        <iconify-icon icon="ant-design:like-outlined" />
                    </span> 
                    <span className="count">{dislikesCount}</span>
                    <span className={clss} onClick={(e) => {clickHandler(e, DISLIKE, DELETE);}}>
                        <iconify-icon icon="ant-design:dislike-filled" />
                    </span> 
                </span>
            );
        }
    }
    else {
        return (
            <span className="like_container">
                <span className="count">{likesCount}</span>
                <span className={clss} onClick={(e) => {clickHandler(e, LIKE, UPDATE);}}>
                    <iconify-icon icon="ant-design:like-outlined" />
                </span>
                <span className="count">{dislikesCount}</span>
                <span className={clss} onClick={(e) => {clickHandler(e, DISLIKE, UPDATE);}}>
                    <iconify-icon icon="ant-design:dislike-outlined" />
                </span> 
            </span>
        );
    }
}

export default LikeButton;

