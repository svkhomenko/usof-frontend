import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setPage } from '../store/slices/searchParametersSlice';
import "../style.css";

function PageIndexContainer(props) {
    const dispatch = useDispatch();
    const searchParameters = useSelector((state) => state.searchParameters);

    const [pagesArr, setPagesArr] = useState(getPagesArr());

    useEffect(() => {
        setPagesArr(getPagesArr());
    }, [searchParameters.page, props.numberOfPages]);
    
    return (
        <div className="page_index_container">
            Page
            {pagesArr.map((index) => {
                if (index > 0) {
                    return (
                        <span key={index}
                            className={index == searchParameters.page ? "page_index active" : "page_index"}
                            onClick={() => {dispatch(setPage({ page: index }))}}>
                            {index}
                        </span>
                    );
                }
                else {
                    return (
                        <div key={index} className="page_index_reduction_outer">
                            <div className="page_index_reduction" />
                            <div className="page_index_reduction" />
                            <div className="page_index_reduction" />
                        </div>
                    );
                }
            })}
        </div>
    );

    function getPagesArr() {
        let tempPagesArr = [];
        let curPage = searchParameters.page;
        let numberOfPages = +props.numberOfPages;

        if (numberOfPages <= 3) {
            for (let i = 1; i <= numberOfPages; i++) {
                tempPagesArr.push(i);
            }
        }
        else if (curPage - 2 <= 0) {
            tempPagesArr = [1, 2, 3, -1, numberOfPages];
        }
        else if (curPage + 2 > numberOfPages) {
            tempPagesArr = [1, -1, numberOfPages - 2, numberOfPages - 1, numberOfPages];
        }
        else {
            tempPagesArr = [1, -1, curPage - 1, curPage, curPage + 1, -2, numberOfPages];
        }

        return tempPagesArr;
    }
}

// function PageIndexContainer(props) {
//     const [pagesArr, setPagesArr] = useState(getPagesArr());

//     useEffect(() => {
//         setPagesArr(getPagesArr());
//     }, [props.curPage, props.numberOfPages]);
    
//     return (
//         <div className="page_index_container">
//             Page
//             {pagesArr.map((index) => {
//                 if (index > 0) {
//                     return (
//                         <span key={index}
//                             className={index == props.curPage ? "page_index active" : "page_index"}
//                             onClick={() => {props.funcSetCurPage(index)}}>
//                             {index}
//                         </span>
//                     );
//                 }
//                 else {
//                     return (
//                         <div key={index} className="page_index_reduction_outer">
//                             <div className="page_index_reduction" />
//                             <div className="page_index_reduction" />
//                             <div className="page_index_reduction" />
//                         </div>
//                     );
//                 }
//             })}
//         </div>
//     );

//     function getPagesArr() {
//         let tempPagesArr = [];
//         let curPage = +props.curPage;
//         let numberOfPages = +props.numberOfPages;

//         if (numberOfPages <= 3) {
//             for (let i = 1; i <= numberOfPages; i++) {
//                 tempPagesArr.push(i);
//             }
//         }
//         else if (curPage - 2 <= 0) {
//             tempPagesArr = [1, 2, 3, -1, numberOfPages];
//         }
//         else if (curPage + 2 > numberOfPages) {
//             tempPagesArr = [1, -1, numberOfPages - 2, numberOfPages - 1, numberOfPages];
//         }
//         else {
//             tempPagesArr = [1, -1, curPage - 1, curPage, curPage + 1, -2, numberOfPages];
//         }

//         return tempPagesArr;
//     }
// }

export default PageIndexContainer;

