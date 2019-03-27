/**
 * Created by panca on 16/9/6.
 * URL
 */
import React from 'react';

let baseUrl = "";

class URLClass extends React.Component{

    get getBaseUrl(){return baseUrl}

    //登录
    get getLoginInfo() { return (baseUrl + '/j_spring_security_check') }

}   

let URL = new URLClass();

export default URL;
