import React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { BsQuestionCircle } from 'react-icons/bs';

/**
 * help user guidance with what the purpose of a certain page is
 * links with help and documentation heuristic
 */

const HelpTooltip = ({ message }) => (
	<OverlayTrigger
		placement="right"
		overlay={<Tooltip>{message}</Tooltip>}
		>
				<span
					className="ms-2 text-info"
					style={{ cursor: "pointer" }}
//lets tooltip to be accessesd by pressing tab, 
//without this the non-function requirement wouldn't have been met
//also readers are made aware that it is a button
					role="button"
					tabIndex="0" //auto applies blackoutline, links to accessibility/feedback

				> <BsQuestionCircle />
		</span>
	</OverlayTrigger>
);

export default HelpTooltip;
