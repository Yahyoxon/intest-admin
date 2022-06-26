import React, { useState } from "react";
import Dropzone from "react-dropzone";
import PropTypes from "prop-types";
import { get } from "lodash";
import { useDispatch } from "react-redux";
import SystemActions from "store/actions/system";
import {useNotification} from 'hooks'

const UploadFile = ({
    type,
    isMulti,
    disabled,
    fileNumber,
    maxSize,
    minSize,
    successCb = () => {
    },
    errorCb = () => {
    },
    onLoading = () => {
    },
    cancel = false,
    children
}) => {
    const dispatch = useDispatch();
    const { notification } = useNotification();

    const getAcceptType = () => {
        switch (type) {
            case "doc":
                return ".pdf,.doc,.docx,.xls,.xlsx,.txt";
            case "photo":
                return "image/*";
            case "pdf":
                return ".pdf";
            case "copy":
                return ".pdf,.jpeg,.png,.jpg";
            case "archive":
                return ".zip,.rar";
            case "all":
                return ".jpeg,.jpg,.svg,.png,.doc,.docx,.xls,.xlsx,.pdf,.zip,.rar,.mp4,.avi,.bmp,.mov,.qt,.mkv,.mpeg2,.mpeg4,.mxf,.mts";
            default:
                return "";
        }
    };

    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setErrors] = useState({
        messageAccept: null,
        messageSize: null
    });

    const handleDrop = files => {
        if (files) {
            const fileName = get(files, `[0].name`);
            const extension = fileName.split(".");
            setErrors({ messageAccept: null, messageSize: null });
            setLoading(true);

            let formData = new FormData();
            files.forEach((file, i) => formData.append(`files[${i}]`, file));

            const cb = {
                success: data => {
                    setFile(data);
                    setLoading(false);
                    successCb(data);
                },
                failure: error => {
                    setLoading(false);
                    errorCb(error);
                },
                finally: () => {
                }
            };
            const loadingFunc = (total, loaded) => {
                onLoading(total, loaded, extension[extension.length - 1], files);
            };

            dispatch(SystemActions.UploadFile({ files: formData, cb, load: loadingFunc, cancel }));
        }
    };

    return (
        <Dropzone
            accept={getAcceptType()}
            multiple={isMulti}
            disabled={disabled}
            maxFiles={fileNumber}
            onDropAccepted={handleDrop}
            onDropRejected={errors => {
                let errorMessage = get(errors, "[0].errors[0].message");
                if (errors.length > fileNumber) {
                    errorMessage = `Too many files! Max files count - ${fileNumber}`;
                }
                notification(errorMessage, {
                    type: "danger"
                });
            }}
            maxSize={maxSize}
            minSize={minSize}>
            {({ getRootProps, getInputProps }) => (
                <div className="file__upload" {...getRootProps()}>
                    {children({
                        file,
                        loading,
                        error
                    })}
                    <input {...getInputProps()} id="file" />
                </div>
            )}
        </Dropzone>
    );
};

UploadFile.propTypes = {
    type: PropTypes.oneOf(["all", "doc", "photo", "archive", "pdf", "copy"]).isRequired,
    isMulti: PropTypes.bool,
    disabled: PropTypes.bool,
    fileNumber: PropTypes.number,
    minSize: PropTypes.number,
    maxSize: PropTypes.number
};

UploadFile.defaultProps = {
    type: "all",
    isMulti: false,
    disabled: false,
    fileNumber: 1,
    minSize: 0,
    maxSize: Infinity
};

export default UploadFile;
