import React from 'react';
import { Modal, Button } from 'react-bootstrap';

/**
 * shows popup confirmation box, again this is for consistency across the application 
 * and confirmation for the user prior to commiting an action
 */

const ConfirmModal = ({ show, onHide, onConfirm, message }) => (
	<Modal show={show} onHide={onHide} centered>
		<Modal.Header closeButton>
			<Modal.Title>Confirm Action</Modal.Title>
		</Modal.Header>
		<Modal.Body>{message}</Modal.Body>
		<Modal.Footer>
			<Button variant="primary" onClick={onConfirm}>Yes</Button>
			<Button variant="danger" onClick={onHide}>Cancel</Button>
		</Modal.Footer>
	</Modal>
);

export default ConfirmModal;
