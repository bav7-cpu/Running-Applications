import { Navbar, Nav, Container } from "react-bootstrap";
import { Link } from "react-router-dom";

/**
 * navigation bar at the top of each page throughout the app
 */
function AppNavbar() {

	return (
		<Navbar expand="lg" className="mb-4" style={{ backgroundColor: 'var(--primary-color)' }}>
			<Container fluid className="px-4">
				<Navbar.Toggle aria-controls="main-navbar" className="bg-light" />
				<Navbar.Collapse id="main-navbar">
					<div className="d-flex flex-column flex-lg-row align-items-center justify-content-between w-100">
						<Nav className="flex-row flex-lg-row mb-2 mb-lg-0" style={{ gap: '1rem' }}>
							<Nav.Link as={Link} to="/home" style={{ color: '#ffffff', textAlign: 'center' }} className="mx-3">
								Homepage
							</Nav.Link>
						</Nav>

						<Navbar.Brand className="text-center my-2 my-lg-0" style={{
							color: '#ffffff',
							fontSize: '1.5rem',
							fontWeight: 'bold',
							textAlign: 'center',
							flexGrow: 1,
						}}>
							RunTracker
						</Navbar.Brand>

						<Nav className="flex-row flex-lg-row justify-content-end" style={{ gap: '1rem' }}>
							<Nav.Link as={Link} to="/calendar" style={{ color: '#ffffff', textAlign: 'center' }} className="mx-3">
								Run Calendar
							</Nav.Link>
							<Nav.Link as={Link} to="/addrun" style={{ color: '#ffffff', textAlign: 'center' }} className="mx-3">
								Add Run
							</Nav.Link>
							<Nav.Link as={Link} to="/addgoal" style={{ color: '#ffffff', textAlign: 'center' }} className="mx-3">
								Add Goal
							</Nav.Link>
							<Nav.Link as={Link} to="/profile" style={{ color: '#ffffff', textAlign: 'center' }} className="mx-3">
								Profile
							</Nav.Link>
						</Nav>
					</div>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
}

export default AppNavbar;
