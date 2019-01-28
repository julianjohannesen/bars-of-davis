import React from 'react';
import Footer from 'react-bulma-components/lib/components/footer';
import Container from 'react-bulma-components/lib/components/container';
import Content from 'react-bulma-components/lib/components/content';

export default function Footerx() {
	return (
		<Footer renderAs="footer">
			<Container>
				<Content style={{ textAlign: 'center' }}>
					<p><strong>The Bars of Magoun Square</strong> by <a href="https://github.com/julianjohannesen">Julian Johannesen</a>.</p>
				</Content>
			</Container>
		</Footer>
	)
}
