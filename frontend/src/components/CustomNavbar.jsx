import { Link, useNavigate } from 'react-router-dom';
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  MobileNavHeader,
  MobileNavMenu,
  MobileNavToggle,
  NavbarButton,
} from './ui/resizable-navbar';
import { authService } from '../services/auth';
import { useState } from 'react';

export default function CustomNavbar() {
  const isAuthenticated = authService.isAuthenticated();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = isAuthenticated
    ? [
        { name: 'Home', link: '/' },
        { name: 'Chat', link: '/chat' },
        { name: 'Admin', link: '/admin' },
      ]
    : [
        { name: 'Home', link: '/' },
        { name: 'About', link: '/#about' },
      ];

  const handleLogout = () => {
    authService.logout();
    navigate('/');
    window.location.reload();
  };

  return (
    <Navbar>
      <NavBody>
        <Link to="/" className="relative z-20 mr-4 flex items-center space-x-2 px-2 py-1 text-sm font-normal text-white">
          <div className="flex gap-1">
            <div className="w-2 h-2 rounded bg-green-500"></div>
            <div className="w-2 h-2 rounded bg-blue-500"></div>
            <div className="w-2 h-2 rounded bg-red-500"></div>
            <div className="w-2 h-2 rounded bg-yellow-500"></div>
          </div>
          <span className="font-medium text-white">ChatBot Platform</span>
        </Link>
        <NavItems items={navItems} LinkComponent={Link} />
        <div className="relative z-20 ml-auto flex items-center gap-2">
          {isAuthenticated ? (
            <NavbarButton
              as="button"
              onClick={handleLogout}
              variant="secondary"
              className="text-sm"
            >
              Logout
            </NavbarButton>
          ) : (
            <>
              <NavbarButton
                as={Link}
                to="/login"
                variant="secondary"
                className="text-sm"
              >
                Login
              </NavbarButton>
              <NavbarButton
                as={Link}
                to="/signup"
                variant="primary"
                className="text-sm"
              >
                Get Started
              </NavbarButton>
            </>
          )}
        </div>
      </NavBody>
      <MobileNav>
        <MobileNavHeader>
          <Link to="/" className="relative z-20 flex items-center space-x-2 px-2 py-1 text-sm font-normal text-white">
            <div className="flex gap-1">
              <div className="w-2 h-2 rounded bg-green-500"></div>
              <div className="w-2 h-2 rounded bg-blue-500"></div>
              <div className="w-2 h-2 rounded bg-red-500"></div>
              <div className="w-2 h-2 rounded bg-yellow-500"></div>
            </div>
            <span className="font-medium text-white">ChatBot Platform</span>
          </Link>
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <NavbarButton
                as="button"
                onClick={handleLogout}
                variant="secondary"
                className="text-sm"
              >
                Logout
              </NavbarButton>
            ) : (
              <>
                <NavbarButton
                  as={Link}
                  to="/login"
                  variant="secondary"
                  className="text-sm"
                >
                  Login
                </NavbarButton>
                <NavbarButton
                  as={Link}
                  to="/signup"
                  variant="primary"
                  className="text-sm"
                >
                  Get Started
                </NavbarButton>
              </>
            )}
            <MobileNavToggle
              isOpen={mobileMenuOpen}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            />
          </div>
        </MobileNavHeader>
        <MobileNavMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)}>
          {navItems.map((item, idx) => (
            <Link
              key={idx}
              to={item.link}
              onClick={() => setMobileMenuOpen(false)}
              className="text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 text-lg font-medium"
            >
              {item.name}
            </Link>
          ))}
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
}

