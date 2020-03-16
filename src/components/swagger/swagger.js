import React, { Component } from 'react';
import SwaggerUI from 'swagger-ui-react'
import 'swagger-ui-react/swagger-ui.css'
import './swagger.scss'

export default class Swagger extends Component {
    componentDidMount() {
        window.document.body.setAttribute('style', 'background: #fafafa!important');
    }
    componentWillUnmount() {
        window.document.body.removeAttribute('style');
    }
    render() {
        return <SwaggerUI url={`${process.env.REACT_APP_API_SERVER}/api/swagger.json`} />
    }
}