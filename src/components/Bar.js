import React, { Component } from 'react'

export default class Bar extends Component {
    render() {

        const bar = this.props.bar;
        console.log(bar);

        return (
            <li className="menu-item">
                <h3 className="heading is-size-5">{bar.venue.name}</h3>
                <p>{bar.venue.location.address}</p>
                <p>{}</p>
                <p>{}</p>
            </li>
        )
    }
}
