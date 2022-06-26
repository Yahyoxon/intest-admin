import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import cx from "classnames";
import PropTypes from 'prop-types';

import {Icon} from "components";
import "./style.scss";

const modalRoot = document.getElementById('old-modal-root');

class Modal extends Component {
    constructor(props) {
        super(props);
        this.el = document.createElement('div');
    }

    static propTypes = {
        size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
        toggle: PropTypes.bool,
        className: PropTypes.string,
        okText: PropTypes.string,
        cancelText: PropTypes.string,
        alignBtns: PropTypes.oneOf(['left', 'right', 'center']),
        alignExitBtn: PropTypes.oneOf(['left', 'right']),
        exitBtn: PropTypes.bool,
        backdrop: PropTypes.bool,
        header: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.node
        ]),
        children: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.node
        ]),
        footer: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.node
        ]),
        onOk: PropTypes.func,
        setToggle: PropTypes.func
    };

    static defaultProps = {
        size: 'md',
        exitBtn: false,
        backdrop: true,
        alignBtns: 'right',
        alignExitBtn: 'right'
    };

    componentDidMount() {
        modalRoot.appendChild(this.el);

        if (this.props.toggle)
            document.body.className = `main overflow-y-hidden`;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.toggle !== this.props.toggle){
            if (this.props.toggle)
                document.body.className = `main ${
                    this.props.toggle ? "overflow-y-hidden" : ""
                }`;
            else document.body.className = `main`;
        }
    }

    componentWillUnmount() {
        modalRoot.removeChild(this.el);
    }

    render() {

        const {
            size,
            toggle,
            className,
            okText,
            cancelText,
            alignBtns,
            alignExitBtn,
            exitBtn,
            backdrop,
            header,
            children,
            footer,
            onOk,
            setToggle,
            ...otherProps
        } = this.props;

        const classNames = cx(
            `modal-old ${!backdrop ? "modal-static" : ""}`,
            toggle ? "show" : "",
            className && className
        );

        return ReactDOM.createPortal(
            <div className={classNames} {...otherProps}>
                <div
                    className="modal-overlap"
                    onClick={()=> {
                        if(backdrop){
                            setToggle(false)
                        }else {

                        }
                    }}
                />
                <div
                    className={`modal-dialog ${
                        size === "md" ? "" : `modal-${size}`
                    }`}>
                    <div className="modal-content">
                        {(header || exitBtn) && (
                            <div
                                className="modal-header"
                                style={{ display: `${header ? "flex" : "block"}` }}>
                                {typeof header === "string" ? (
                                    <h2 className="font-medium text-base mr-auto">
                                        {header}
                                    </h2>
                                ) : (
                                    <div className="mr-auto">{header}</div>
                                )}
                                {exitBtn && (
                                    <div className={`text-${alignExitBtn} cursor-pointer`}>
                                        <Icon
                                            name="x"
                                            className="w-6 h-6 text-gray-500"
                                            onClick={() => setToggle(false)}
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                        <div className="modal-body">{children}</div>
                        {(footer || okText || cancelText) && (
                            <div className="modal-footer">
                                {footer ? (
                                    <>{footer}</>
                                ) : (
                                    <div className={`text-${alignBtns}`}>
                                        {cancelText && (
                                            <button
                                                type="button"
                                                className="btn btn-outline-secondary w-24 dark:border-dark-5 dark:text-gray-300 mr-3"
                                                onClick={() => setToggle(false)}>
                                                {cancelText}
                                            </button>
                                        )}
                                        {okText && (
                                            <button
                                                type="button"
                                                className={`btn w-24 btn-primary`}
                                                onClick={onOk}>
                                                {okText}
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>,
            this.el
        );
    }
}

export default Modal;
