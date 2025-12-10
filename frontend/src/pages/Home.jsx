import { Link } from 'react-router-dom';
import { MessageCircle, Settings, LogIn, UserPlus, ShoppingBag, Package, CreditCard } from 'lucide-react';
import { authService } from '../services/auth';

export default function Home() {
  const isAuthenticated = authService.isAuthenticated();

  return (
    <div className="min-h-screen bg-[#000000] flex flex-col">
      {/* Header */}
      <header className="border-b border-[#17181c] bg-[#000000] sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#1c9cf0] flex items-center justify-center">
              <ShoppingBag className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-[#e7e9ea]">ChatBot Platform</h1>
          </div>
          <div className="flex gap-3">
            {isAuthenticated ? (
              <>
                <Link
                  to="/chat"
                  className="px-4 py-2 rounded-lg bg-[#17181c] text-[#e7e9ea] hover:bg-[#1c9cf0] hover:text-white transition-colors font-medium"
                >
                  Chat
                </Link>
                <Link
                  to="/admin"
                  className="px-4 py-2 rounded-lg bg-[#17181c] text-[#e7e9ea] hover:bg-[#1c9cf0] hover:text-white transition-colors font-medium"
                >
                  Admin
                </Link>
                <button
                  onClick={() => {
                    authService.logout();
                    window.location.href = '/';
                  }}
                  className="px-4 py-2 rounded-lg bg-[#17181c] text-[#e7e9ea] hover:bg-[#17181c] transition-colors font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-lg bg-[#17181c] text-[#e7e9ea] hover:bg-[#1c9cf0] hover:text-white transition-colors font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 rounded-lg bg-[#1c9cf0] text-white hover:bg-[#1a8cd8] transition-colors font-medium font-semibold"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="max-w-5xl w-full">
          {/* Heading */}
          <div className="text-center mb-12">
            <h2 className="text-5xl md:text-6xl font-bold text-[#e7e9ea] mb-4">
              Welcome to ChatBot Platform
            </h2>
            <p className="text-lg text-[#72767a] max-w-2xl mx-auto">
              Chat with AI to explore deals, manage orders, and check payments
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Chat Card */}
            <Link
              to="/chat"
              className="group p-8 rounded-xl bg-[#17181c] border border-[#061622] hover:border-[#1c9cf0] transition-all"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-lg bg-[#1c9cf0] flex items-center justify-center">
                  <MessageCircle className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-[#e7e9ea]">Chat</h3>
              </div>
              <p className="text-[#72767a] leading-relaxed">
                Interact with our AI assistant to discover deals, track orders, and manage your shopping experience.
              </p>
            </Link>

            {/* Admin or Auth Cards */}
            {isAuthenticated ? (
              <Link
                to="/admin"
                className="group p-8 rounded-xl bg-[#17181c] border border-[#061622] hover:border-[#1c9cf0] transition-all"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-[#1c9cf0] flex items-center justify-center">
                    <Settings className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#e7e9ea]">Admin</h3>
                </div>
                <p className="text-[#72767a] leading-relaxed">
                  Manage deals, orders, and payments. Create and update products with our admin panel.
                </p>
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="group p-8 rounded-xl bg-[#17181c] border border-[#061622] hover:border-[#1c9cf0] transition-all"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-[#1c9cf0] flex items-center justify-center">
                      <LogIn className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-[#e7e9ea]">Login</h3>
                  </div>
                  <p className="text-[#72767a] leading-relaxed">
                    Sign in to your account to access personalized deals, order history, and payment information.
                  </p>
                </Link>

                <Link
                  to="/signup"
                  className="group p-8 rounded-xl bg-[#17181c] border-2 border-[#1c9cf0] hover:bg-[#061622] transition-all"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-[#1c9cf0] flex items-center justify-center">
                      <UserPlus className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-[#e7e9ea]">Sign Up</h3>
                  </div>
                  <p className="text-[#72767a] leading-relaxed">
                    Create a new account to start shopping and managing your orders with AI assistance.
                  </p>
                </Link>
              </>
            )}
          </div>

          {/* Quick Features */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-6 rounded-lg bg-[#17181c] border border-[#061622]">
              <Package className="h-6 w-6 text-[#1c9cf0] mx-auto mb-2" />
              <h4 className="text-[#e7e9ea] font-medium mb-1 text-sm">Track Orders</h4>
              <p className="text-[#72767a] text-xs">Real-time updates</p>
            </div>
            <div className="text-center p-6 rounded-lg bg-[#17181c] border border-[#061622]">
              <CreditCard className="h-6 w-6 text-[#1c9cf0] mx-auto mb-2" />
              <h4 className="text-[#e7e9ea] font-medium mb-1 text-sm">Payment Status</h4>
              <p className="text-[#72767a] text-xs">Manage payments</p>
            </div>
            <div className="text-center p-6 rounded-lg bg-[#17181c] border border-[#061622]">
              <ShoppingBag className="h-6 w-6 text-[#1c9cf0] mx-auto mb-2" />
              <h4 className="text-[#e7e9ea] font-medium mb-1 text-sm">Best Deals</h4>
              <p className="text-[#72767a] text-xs">Discover offers</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
