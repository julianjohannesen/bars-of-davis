import React, { Component } from 'react';
import OMS from '../assets/imgs/oms-960x340.jpg';

export default class Hero extends Component {
  render() {
    return (
        <section class="hero">
            <figure class="image">
                <img src={OMS} alt="Olde Magoun's Saloon on a packed night." />
            </figure>
        </section>
    )
  }
}
