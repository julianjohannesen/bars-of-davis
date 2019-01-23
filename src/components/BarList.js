import React, { Component } from 'react';
import uuid from 'uuid/v4';
import Bar from './Bar.js';

export default class BarList extends Component {

    renderBars = () => {
        console.log("renderBars is getting called. this is the marker: ", this.props.barMarkers)
        this.props.barMarkers.map( (marker) => marker.visible ? <Bar key={uuid()} barMarker={marker}  /> : null)
    }

    render() {
        
        return (
            <section id="barList" className="section column is-narrow" style={{padding:"0",}}>
                <ul className="menu-list">
                    {this.renderBars()}
                </ul>
            </section>
        )
    }
}
