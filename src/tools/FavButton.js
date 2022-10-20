import React from "react";

function FavButton({ isFav, handleFavClick, isActive }) {
    let clss = 'like_outer fav_outer';
    if (!isActive) {
        clss += ' inactive';
    }

    let clickHandler = (e) => {e.preventDefault();};
    if (isActive) {
        clickHandler = (e) => {
            e.preventDefault();
            handleFavClick();
        };
    }
    
    if (isFav) {
        return (
            <span className={clss} onClick={clickHandler}>
                <iconify-icon icon="bi:bookmark-fill" />
            </span> 
        );
    }
    else {
        return (
            <span className={clss} onClick={clickHandler}>
                <iconify-icon icon="bi:bookmark" />
            </span> 
        );
    }
}

export default FavButton;

