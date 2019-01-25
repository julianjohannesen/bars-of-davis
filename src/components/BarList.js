import React, { Component } from 'react';
import uuid from 'uuid/v4';

export default class BarList extends Component {
    render() {

        const itemStyle = {
            padding: "0.5em",
            border: "1px solid #242f3e",
            borderBottom: "none",
        }

        return (
            <section id="barList" className="section column is-narrow" style={{ padding: "0", }}>
                <ul className="menu-list">
                    {this.props.barMarkers.map((marker)=> (
                        <li className="menu-item" key={uuid()} style={itemStyle}>
                            <h3>{marker.barData.venue.name}</h3>
                        </li>
                    ))}

                </ul>
            </section>
        )
    }
}
