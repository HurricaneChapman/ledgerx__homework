import React, { Component } from 'react';
import sty from './Layout.scss';

class Layout extends Component {
    render () {
        const {
            props: {
                children
            }
        } = this;

        return (
            <div className={sty.container}>
                { children }
            </div>
        )
    }
}

export default Layout;
