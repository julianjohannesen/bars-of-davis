import React, { Component } from 'react';
import 'assets/css/App.css';
import Headerx from './layout/Headerx.js';
import Mainx from './layout/Mainx.js';
import Footerx from './layout/Footerx.js';

class App extends Component {
	render() {
		return (
			<div className="App">
				<Headerx />
				<Mainx />
				<Footerx />
			</div>
		)
	}
}

export default App;
