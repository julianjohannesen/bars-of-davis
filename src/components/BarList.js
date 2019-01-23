import React, { Component } from 'react';
import uuid from 'uuid/v4';
import Bar from './Bar.js';

export default class BarList extends Component {

    render() {
        
        return (
            <section id="barList" className="section column is-narrow">
                <section id="filter" className="">
                    <p>Filter</p>
                </section>
                <ul className="menu-list">
                    {this.props.bars.map( (bar) => {
                        return <Bar key={uuid()} bar={bar} />
                    })}
                </ul>
            </section>
        )
    }
}
