import { Link } from 'react-router-dom';
import { ChatInterface } from '../components/ChatInterface';
import { ArrowLeft } from 'lucide-react';

export default function Chat() {
  return (
    <div className="h-screen w-full bg-[#000000] flex flex-col">
      {/* Header */}
      <header className="bg-[#17181c] border-b border-[#061622]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="p-2 rounded-lg hover:bg-[#061622] transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-[#e7e9ea]" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-[#e7e9ea]">Chat with Assistant</h1>
              <p className="text-sm text-[#72767a]">Ask me about deals, orders, payments, or anything else</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Link
              to="/admin"
              className="px-4 py-2 rounded-lg bg-[#000000] text-[#e7e9ea] hover:bg-[#061622] transition-colors font-medium border border-[#061622]"
            >
              Admin
            </Link>
            <Link
              to="/"
              className="px-4 py-2 rounded-lg bg-[#1c9cf0] text-white hover:bg-[#1a8cd8] transition-colors font-medium"
            >
              Home
            </Link>
          </div>
        </div>
      </header>

      {/* Chat Container */}
      <div className="flex-1 flex flex-col max-w-7xl w-full mx-auto px-6 py-6 min-h-0">
        <div className="flex-1 flex flex-col min-h-0">
          <ChatInterface />
        </div>
      </div>
    </div>
  );
}
