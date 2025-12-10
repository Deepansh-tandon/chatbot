import { Link } from 'react-router-dom';
import { BackgroundRippleEffect } from '../components/ui/background-ripple-effect';
import CustomNavbar from '../components/CustomNavbar';
import { authService } from '../services/auth';

export default function Home() {
  const isAuthenticated = authService.isAuthenticated();

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-neutral-950 dark:bg-black">
      {/* Background Ripple Effect */}
      <div className="fixed inset-0 z-0">
        <BackgroundRippleEffect rows={20} cols={50} cellSize={56} />
      </div>
      
      {/* Navbar */}
      <CustomNavbar />

      {/* Main Content */}
      <main className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 pt-24 pb-20">
        <div className="mx-auto max-w-5xl text-center">
          {/* Main Title */}
          <h1 className="mb-6 text-7xl font-bold text-white md:text-8xl lg:text-9xl">
            ChatBot Platform
          </h1>
          
          {/* Tagline */}
          <p className="mb-12 text-lg text-neutral-400 md:text-xl lg:text-2xl">
            Elevate your shopping experience, unlock your potential.
            <br />
            Interactive AI platform designed to help you discover deals, manage orders, and track payments.
          </p>

          {/* CTA Button */}
          <div className="flex items-center justify-center gap-4">
            {isAuthenticated ? (
              <Link
                to="/chat"
                className="px-8 py-4 rounded-md bg-white text-black text-sm font-bold relative cursor-pointer hover:-translate-y-0.5 transition duration-200 inline-block text-center shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
              >
                Go to Chat
              </Link>
            ) : (
              <Link
                to="/signup"
                className="px-8 py-4 rounded-md bg-white text-black text-sm font-bold relative cursor-pointer hover:-translate-y-0.5 transition duration-200 inline-block text-center shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
              >
                Get Started
              </Link>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
