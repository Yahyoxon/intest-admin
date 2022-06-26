import React from 'react';
import {ReactComponent as CloseIcon} from "./closeIcon.svg"
import get from "lodash/get";
import {helpers} from "services";
import "./style.scss";

const File = ({item, isDoc, deleteHandler = () => {}}) => {
    const src = get(item, 'thumbnails.small.src')
    const description = get(item, 'description')
    const ext = get(item, 'ext');
    const size = get(item, 'size');

    return isDoc ? (
        <div className="mb-5 mr-5 cursor-pointer zoom-in rounded-md">
            <div className="file-preview rounded-md">
               <div className="file-preview__ext rounded-md">
                   {ext}
               </div>
                <div>
                    <div className="file-preview__title">
                        {description}
                    </div>
                    <div className="file-preview__size">
                        {helpers.formatBytes(size)}
                    </div>
                </div>
            </div>
            <div
                onClick={() => deleteHandler(item)}
                className="tooltip w-5 h-5 flex items-center justify-center absolute rounded-full text-white bg-theme-24 right-0 top-0 -mr-2 -mt-2">
                <CloseIcon/>
            </div>
        </div>
    ) : (
        <div className="w-24 h-24 relative image-fit mb-5 mr-5 cursor-pointer zoom-in">
            <img className="rounded-md" alt={description} src={src}/>
            <div
                onClick={() => deleteHandler(item)}
                className="tooltip w-5 h-5 flex items-center justify-center absolute rounded-full text-white bg-theme-24 right-0 top-0 -mr-2 -mt-2">
                <CloseIcon/>
            </div>
        </div>
    )

};

export default File;
