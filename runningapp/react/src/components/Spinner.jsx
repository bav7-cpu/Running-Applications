import React from 'react';
import { Spinner as BSpinner } from 'react-bootstrap';
// simple bootstrap spinner implemented when actions are performed
// keeps the user aware of whats going on

const Spinner = () => (
	<div className="text-center mt-4">
		<BSpinner animation="border" />
	</div>
);

export default Spinner;
