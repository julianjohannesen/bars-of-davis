import React, { Component } from 'react';
import BarList from './BarList.js';

export default class Mapx extends Component {

	render() {
		// removed barDetails
		const {barMarkers, showListings, hideListings, toggleDrawing, zoomToArea, searchWithinTime} = this.props;

		return (
			<main id="main">
				<section id="tools">
					<div className="form-container">
						<div className="field has-addons" style={{ marginRight: "1em" }}>
							<div className="control">
								<button className="button" id="show-listings" onClick={showListings} >Show</button>
							</div>

							<div className="control">
								<button className="button" id="hide-listings" onClick={hideListings} >Hide</button>
							</div>
						</div>

						<div className="field" style={{ marginRight: "1em" }}>
							<div className="control">
								<button className="button" id="toggle-drawing" onClick={toggleDrawing} >Drawing Tools</button>
							</div>
						</div>

						<div className="field has-addons" style={{ marginRight: "1em" }}>
							<div className="control">
								<input className="input" id="zoom-to-area-text" title="Enter a street address and click zoom to zoom to area" type="text" placeholder="Enter street address" />
							</div>

							<div className="control">
								<button className="button" id="zoom-to-area" onClick={zoomToArea} >Zoom</button>
							</div>
						</div>

						<div className="field">
							<div className="control">
								<p className="text text-margin">Within a </p>
							</div>
						</div>
						<div className="field has-addons">
							<div className="select control">
								<select className="" id="max-duration" style={{ borderTopRightRadius: "0", borderBottomRightRadius: "0" }}>
									<option value="10">10 min</option>
									<option value="15">15 min</option>
									<option value="30">30 min</option>
									<option value="60">1 hour</option>
								</select>
							</div>
							<div className="select control">
								<select className="" defaultValue="WALKING" id="mode" style={{ borderTopLeftRadius: "0", borderBottomLeftRadius: "0" }}>
									<option value="DRIVING">drive</option>
									<option value="WALKING">walk</option>
									<option value="BICYCLING">bike</option>
									<option value="TRANSIT">transit</option>
								</select>
							</div>
						</div>
						<div className="field">
							<div className="control">
								<p className="text text-margin"> of </p>
							</div>
						</div>

						<div className="field has-addons">
							<div className="control">
								<input className="input" id="search-within-time-text" title="After selecting a length of time and mode of travel, enter a starting address to find venues that can reached in the time indicated, by the mode of travel indicated." type="text" placeholder="Enter street address" />
							</div>

							<div className="control">
								<button className="button" id="search-within-time" onClick={searchWithinTime} >Go</button>
							</div>
						</div>
					</div>
				</section>
				
				<BarList 
					// barDetails={barDetails}
					barMarkers={barMarkers} 
					listClick={this.props.listClick}
				/>
				<section className="" id="map">
				</section>
				
			</main>
		)
	}
}
