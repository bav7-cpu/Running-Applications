import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { BsHouse, BsCalendar, BsBullseye, BsPlusCircle, BsPerson } from 'react-icons/bs';

/**
 * navigation bar at the top of each page throughout the app
 * preventing the user to hav eto recall, there are small icons as well
 */

function AppNavbar() {
	return (
		<Navbar expand="lg" className="mb-4" style={{ backgroundColor: 'var(--primary-color)' }}>
			<Container fluid className="px-4">

				{/* Toggle for mobile responsiveness */}
				<Navbar.Toggle aria-controls="main-navbar" className="bg-light" />
				<Navbar.Collapse id="main-navbar">

					{/* Links to all the relevent pages
						with homepage on the left, runtracker central
						and the other pages towards the right side */}
					<div className="d-flex flex-column flex-lg-row align-items-center justify-content-between w-100">

						<Nav className="flex-row flex-lg-row mb-2 mb-lg-0" style={{ gap: '1rem' }}>
							<Nav.Link
								as={Link}
								to="/home"
								style={{ color: '#ffffff', textAlign: 'center' }}
								className="mx-3"
							>
								<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
									<BsHouse size={20} />
									<span style={{ fontSize: '0.85rem' }}>Homepage</span>
								</div>
							</Nav.Link>
						</Nav>

						<Navbar.Brand
							style={{
								color: '#ffffff',
								fontSize: '1.5rem',
								fontWeight: 'bold',
								textAlign: 'center',
								flexGrow: 1,
							}}
							className="text-center my-2 my-lg-0"
						>
							RunTracker
						</Navbar.Brand>

						<Nav className="flex-row flex-lg-row justify-content-end" style={{ gap: '1rem' }}>
							<Nav.Link
								as={Link}
								to="/calendar"
								style={{ color: '#ffffff', textAlign: 'center' }}
								className="mx-3"
							>
								<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
									<BsCalendar size={20} />
									<span style={{ fontSize: '0.85rem' }}>Run Calendar</span>
								</div>
							</Nav.Link>

							<Nav.Link
								as={Link}
								to="/addrun"
								style={{ color: '#ffffff', textAlign: 'center' }}
								className="mx-3"
							>
								<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
									<BsPlusCircle size={20} />
									<span style={{ fontSize: '0.85rem' }}>Add Run</span>
								</div>
							</Nav.Link>

							<Nav.Link
								as={Link}
								to="/addgoal"
								style={{ color: '#ffffff', textAlign: 'center' }}
								className="mx-3"
							>
								<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
									<BsBullseye size={20} />
									<span style={{ fontSize: '0.85rem' }}>Add Goal</span>
								</div>
							</Nav.Link>

							<Nav.Link
								as={Link}
								to="/profile"
								style={{ color: '#ffffff', textAlign: 'center' }}
								className="mx-3"
							>
								<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
									<BsPerson size={20} />
									<span style={{ fontSize: '0.85rem' }}>Profile</span>
								</div>
							</Nav.Link>
						</Nav>

					</div>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
}

export default AppNavbar;