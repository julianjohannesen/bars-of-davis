import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Navbar extends Component {

	state = {
		burgerActive: false,
	}

	toggleBurger = (event) => {
		// This seems roundabout, but it allows you to target multiple burger menus at the same time without knowing the specific id. The target here is the id targeted by the data-target attribute on the burger element
		const target = event.target.dataset.target;
		// And this is the element with that id
		const $target = document.getElementById(target);
		// Now set state on the burgerActive flag to be opposite whatever it currently is (that's the toggle part)
		this.setState({burgerActive: !this.state.burgerActive,});
		// We toggle the classes in the attributes 
	}

	render() {
		return (
			// Bulma.io's suggested navbar structure with some inspiration from Daniel Supernault's 'Band' theme and my own edits to make it React-friendly
			<nav className="navbar is-dark" role="navigation" style={{backgroundColor: "#242f3e"}}>
				<div className="navbar-brand">
					<a className="navbar-item is-size-1" href="/">
						The Bars of Davis Square
					</a>

					<div 
						className= {burgerActive ? "navbar-burger is-active" : "navbar-burger"} 
						data-target="navbarMenu" 
						id="burgerButton"
						onClick={this.toggleBurger}
						role="button" 
						style={{outline: "none"}}
						tabIndex="0"
					>
						<span></span>
						<span></span>
						<span></span>
					</div>
				</div>

				<div id="navbarMenu" className= {burgerActive ? "navbar-menu is-active" : "navbar-menu">
					<div className="navbar-start">
					</div>
					<div className="navbar-end">
						<Link className="navbar-item" to="/">Home</Link>
						<Link className="navbar-item" to="/about">About</Link>
						<div className="navbar-item">
							<div className="field">
								<div className="control">
									<input className="input" onChange={this.props.handleSearch} type="text" placeholder="find a bar" />
								</div>
							</div>
						</div>
					</div>
				</div>
			</nav>
		)
	}
}

