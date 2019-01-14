import React from 'react';
import Hero from 'react-bulma-components/lib/components/hero';
import Container from 'react-bulma-components/lib/components/container';
import Heading from 'react-bulma-components/lib/components/heading';

export default function Headerx() {
	return (
		<Hero renderAs="header" color="primary">
			<Hero.Body>
				<Container>
					<Heading>The Bars of Magoun Square</Heading>
					<Heading subtitle size={3}>An Epicurean's Guide to Magoun Square Bars, Pubs, and Breweries</Heading>
				</Container>
			</Hero.Body>
		</Hero>
	)
}
