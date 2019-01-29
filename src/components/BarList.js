import React, { Component } from 'react';
import uuid from 'uuid/v4';

export default class BarList extends Component {
    render() {
        return (
            <section id="list" className="section" style={{ padding: "0", }}>
                <h2 className="heading is-size-4">Local Bars</h2>
                <ul className="menu-list" id="listUl" onClick={this.props.listClick} >
                    {this.props.barMarkers.map((marker) => {
                        return marker.visible ? (
                            <li className="menu-item" key={uuid()} >
                                <h3 id={marker.barData.venue.id}>{marker.barData.venue.name}</h3>
                            </li>
                        ) : null;
                    })}

                </ul>
            </section>
        )
    }
}
