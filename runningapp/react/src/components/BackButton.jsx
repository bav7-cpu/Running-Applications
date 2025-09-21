import React from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { BsArrowLeft } from "react-icons/bs";

/**
 * helper class to help with navigation, 
 * a back button
 * allows for consistency to be considered throughout the whole application
 */

function BackButton({ to, label }) {
	const navigate = useNavigate(); //redirection

	return (
		<Button
			variant="outline-dark"
			onClick={() => navigate(to)}
			/** gap-2 adds spacing 
			 * w-100 uses the full width for the user, linking with accessibility
			 * w-md-auto reverts the button's width to auto when the Bs md breakpoint is reached
			 * Focusing on aesthetic design (heuritsic)			
			*/
			className="d-flex align-items-center gap-2 w-100 w-md-auto"
			aria-label={label}
		>
			{/* left arrow icon and label lets the user receive clear feedback*/}
			<BsArrowLeft /> {label}
		</Button>
	);
}

export default BackButton;
