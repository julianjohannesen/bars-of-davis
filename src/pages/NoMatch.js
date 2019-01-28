import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class NoMatch extends Component {

    render() {
        return (
            <div style={{margin: "2em"}}>
                <h3>
                    The URL you entered (<code>{this.props.location.pathname}</code>) was not found.
                </h3>
                <Link to="/" >Home</Link>
            </div>
        )
    }
}