
import React, { useState } from 'react';

const ChatNote: React.FC = () => {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('Ask me anything about Romendra!');
  const [loading, setLoading] = useState(false);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    setResponse('Writing...');
    
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      });
      if (!res.ok) {
        throw new Error('API error');
      }
      const data = await res.json();
      setResponse(data.text || "I'm a bit stuck, try asking again!");
    } catch (err) {
      setResponse("My pen ran out of ink! (API Error)");
    } finally {
      setLoading(false);
      setInput('');
    }
  };

  return (
    <div className="sticky-note p-6 w-full max-w-sm lg:max-w-none mx-auto mb-10 transform -rotate-1 hover:rotate-0 transition-transform duration-300 sketch-border border-yellow-300">
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 tape-piece opacity-60 rotate-2"></div>
      <h4 className="font-handwriting-header text-xl font-bold mb-2">Quick Note:</h4>
      <p className="text-sm italic mb-4 min-h-[60px] text-gray-700 leading-tight">"{response}"</p>
      
      <form onSubmit={handleAsk} className="relative">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type here..."
          className="w-full bg-transparent border-b border-yellow-600 focus:outline-none text-sm py-1 font-handwriting-accent"
          disabled={loading}
        />
        <button 
          type="submit" 
          disabled={loading}
          className="absolute right-0 bottom-1 text-xs uppercase font-bold tracking-tighter opacity-50 hover:opacity-100"
        >
          {loading ? '...' : 'Ask'}
        </button>
      </form>
    </div>
  );
};

export default ChatNote;
