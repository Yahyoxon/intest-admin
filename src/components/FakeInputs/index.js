import React from 'react';

const Index = () => {
    return (
        <div style={{opacity:0,pointerEvents:'none',position: 'absolute',left:'-100%',top:'-100%'}}>
            <input type="text" name={"login"} placeholder="Введите логин"/>
            <input type="text" name={"name"}/>
            <input type="password" name={"password"}/>
        </div>
    );
};

export default Index;