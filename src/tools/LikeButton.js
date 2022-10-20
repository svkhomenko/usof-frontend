import React from "react";
import { LIKE, DISLIKE, UPDATE, DELETE } from "../const";

// function LikeButton({ isLiked, handleLikeClick }) {
//     if (isLiked) {
//         return (
//             <span className="like_outer" onClick={handleLikeClick}>
//                 <span className="iconify" data-icon="ant-design:heart-filled" />
//             </span> 
//         );
//     }
//     else {
//         return (
//             <div className="like_outer" onClick={handleLikeClick}>
//                 <span className="iconify" data-icon="ant-design:heart-outlined" />
//             </div> 
//         );
//     }
// }

// function LikeButton({ isLiked, handleLikeClick, isActive }) {
    // if (isLiked) {
    //     if (isLiked.type === 'like') {
    //         return (
    //             <div>
    //                 <span className="like_outer" onClick={handleLikeClick.bind(null, event, LIKE, DELETE)}>
    //                     <iconify-icon icon="ant-design:like-filled" />
    //                 </span> 
    //                 <div className="like_outer" onClick={handleLikeClick.bind(null, event, DISLIKE, UPDATE)}>
    //                     <iconify-icon icon="ant-design:dislike-outlined" />
    //                 </div> 
    //             </div>
    //         );
    //     }
    //     else {
    //         return (
    //             <div>
    //                 <div className="like_outer" onClick={handleLikeClick.bind(null, event, LIKE, UPDATE)}>
    //                     <iconify-icon icon="ant-design:like-outlined" />
    //                 </div> 
    //                 <div className="like_outer" onClick={handleLikeClick.bind(null, event, DISLIKE, DELETE)}>
    //                     <iconify-icon icon="ant-design:dislike-filled" />
    //                 </div> 
    //             </div>
    //         );
    //     }
    // }
    // else {
    //     return (
    //         <div>
    //             <div className="like_outer" onClick={handleLikeClick.bind(null, event, LIKE, UPDATE)}>
    //                 <iconify-icon icon="ant-design:like-outlined" />
    //             </div> 
    //             <div className="like_outer" onClick={handleLikeClick.bind(null, event, DISLIKE, UPDATE)}>
    //                 <iconify-icon icon="ant-design:dislike-outlined" />
    //             </div> 
    //         </div>
    //     );
    // }
// }

function LikeButton({ isLiked, handleLikeClick, isActive }) {
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
                    <span className={clss} onClick={(e) => {clickHandler(e, LIKE, DELETE);}}>
                        <iconify-icon icon="ant-design:like-filled" />
                    </span> 
                    <span className={clss} onClick={(e) => {clickHandler(e, DISLIKE, UPDATE);}}>
                        <iconify-icon icon="ant-design:dislike-outlined" />
                    </span> 
                </span>
            );
        }
        else {
            return (
                <span className="like_container">
                    <span className={clss} onClick={(e) => {clickHandler(e, LIKE, UPDATE);}}>
                        <iconify-icon icon="ant-design:like-outlined" />
                    </span> 
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
                <span className={clss} onClick={(e) => {clickHandler(e, LIKE, UPDATE);}}>
                    <iconify-icon icon="ant-design:like-outlined" />
                </span> 
                <span className={clss} onClick={(e) => {clickHandler(e, DISLIKE, UPDATE);}}>
                    <iconify-icon icon="ant-design:dislike-outlined" />
                </span> 
            </span>
        );
    }
}

export default LikeButton;

