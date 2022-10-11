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

function LikeButton({ isLiked, handleLikeClick }) {
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

    if (isLiked) {
        if (isLiked.type === 'like') {
            return (
                <div>
                    <span className="like_outer" onClick={(e) => {e.preventDefault();
                                                                    handleLikeClick(LIKE, DELETE);}}>
                        <iconify-icon icon="ant-design:like-filled" />
                    </span> 
                    <div className="like_outer" onClick={(e) => {e.preventDefault();
                                                                    handleLikeClick(DISLIKE, UPDATE);}}>
                        <iconify-icon icon="ant-design:dislike-outlined" />
                    </div> 
                </div>
            );
        }
        else {
            return (
                <div>
                    <div className="like_outer" onClick={(e) => {e.preventDefault();
                                                                    handleLikeClick(LIKE, UPDATE);}}>
                        <iconify-icon icon="ant-design:like-outlined" />
                    </div> 
                    <div className="like_outer" onClick={(e) => {e.preventDefault();
                                                                    handleLikeClick(DISLIKE, DELETE);}}>
                        <iconify-icon icon="ant-design:dislike-filled" />
                    </div> 
                </div>
            );
        }
    }
    else {
        return (
            <div>
                <div className="like_outer" onClick={(e) => {e.preventDefault();
                                                                    handleLikeClick(LIKE, UPDATE);}}>
                    <iconify-icon icon="ant-design:like-outlined" />
                </div> 
                <div className="like_outer" onClick={(e) => {e.preventDefault();
                                                                    handleLikeClick(DISLIKE, UPDATE);}}>
                    <iconify-icon icon="ant-design:dislike-outlined" />
                </div> 
            </div>
        );
    }
}

export default LikeButton;

