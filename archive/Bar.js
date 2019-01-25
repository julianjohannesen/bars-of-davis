import React, { Component } from 'react'

export default class Bar extends Component {

    render() {

        const itemStyle = {
            padding: "0.5em",
            border: "1px solid #242f3e",
            borderBottom: "none",
        }
        const barMarker = this.props.barMarker;

        return (
            <li className="menu-item" style={itemStyle}>
                <h3>{/*barMarker.barData.venue.name*/}</h3>
                <p>blah</p>
            </li>
        )
    }
}
