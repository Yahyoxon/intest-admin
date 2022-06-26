import React from 'react';
import cx from "classnames";

const Index = ({ items = [], onTabChange = () => {}, className, activeItem }) => {

    const classNames = cx(
        "nav nav-tabs flex-col sm:flex-row justify-center lg:justify-start tab-pane",
        className && className
    );

    return (
        <div className={classNames}>
            {items.map(item => (
                <div className={`py-3 px-3 sm:mr-8 tab-pane__item ${activeItem === item.code ? "--active" : ""}`}
                     key={item.code}
                     onClick={() => {
                         onTabChange(item.code)
                     }}>
                    {item.title}
                </div>
            ))}
        </div>
    );
};

export default Index;
