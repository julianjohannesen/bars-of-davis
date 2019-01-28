import React, { Component } from 'react';
import uuid from 'uuid/v4';

export default class BarList extends Component {
    render() {

        const ulStyle = {
            overflowY: "scroll",
            height: "calc(100% - 3rem)",
            width: "28vw",
        }

        const itemStyle = {
            padding: "0.5em",
            border: "1px solid #242f3e",
            borderBottom: "none",
            borderRight: "none",
        }

        return (
            <section id="barList" className="section column is-narrow" style={{ padding: "0", }}>
                <h2 className="heading is-size-4">Local Bars</h2>
                <ul className="menu-list" id="barList" onClick={this.props.listClick} style={ulStyle}>
                    {this.props.barMarkers.map((marker) => {
                        return marker.visible ? (
                            <li className="menu-item" key={uuid()} style={itemStyle}>
                                <h3 id={marker.barData.venue.id}>{marker.barData.venue.name}</h3>
                            </li>
                        ) : null;
                    })}

                </ul>
            </section>
        )
    }
}
