import React, { useState } from 'react';
import { getSrc } from "../tools/tools_func";

function Slider({ images, curIndex, setCurIndex, setIsSliderOpen }) {
    return (
        <>
            <div className="popup_background" onClick={() => {setIsSliderOpen(false)}} />
            <div className="slider_container">
                <div className="slider_control" onClick={goLeft}>
                    <iconify-icon icon="bx:left-arrow"/>
                </div>
                <div className='user_icon_outer slider_image_outer'>
                    <img src={getSrc(images[curIndex].image)} alt="post" />
                </div>
                <div className="slider_control" onClick={goRight}>
                    <iconify-icon icon="bx:right-arrow"/>
                </div>
            </div>
        </>
    );

    function goLeft() {
        if (curIndex == 0) {
            setCurIndex(images.length - 1);
        }
        else {
            setCurIndex(curIndex - 1);
        }
    }

    function goRight() {
        if (curIndex == images.length - 1) {
            setCurIndex(0);
        }
        else {
            setCurIndex(curIndex + 1);
        }
    }
}

function PostImages({ images }) {
    const maxImages = 2;
    const [isSliderOpen, setIsSliderOpen] = useState(false);
    const [curIndex, setCurIndex] = useState(0);

    return (
        <div className='post_images_container'>
            {images.map((image, index) => {
                if (index < maxImages) {
                    return (
                        <div key={image.id} className="user_icon_outer post_images_outer"
                            onClick={() => {openSlider(index)}} >
                            <img src={getSrc(image.image)} alt="post" />
                        </div>
                    );
                }
                else if (index === maxImages) {
                    return (
                        <div key={image.id} className="user_icon_outer post_images_outer last"
                            data-content={getDataContent()} >
                            <img src={getSrc(image.image)} alt="post" />
                        </div>
                    );
                }
            })}
            {
                isSliderOpen &&
                <Slider images={images} curIndex={curIndex} setCurIndex={setCurIndex} setIsSliderOpen={setIsSliderOpen} />
            }
        </div> 
    );

    function getDataContent() {
        return `${images.length - maxImages} more images`;
    }

    function openSlider(index) {
        setIsSliderOpen(true);
        setCurIndex(index);
    }
}

export default PostImages;

