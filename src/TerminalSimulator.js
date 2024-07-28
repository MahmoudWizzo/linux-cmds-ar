import React, { useState, useRef, useEffect } from 'react';

const TerminalSimulator = ({ commands }) => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState(['مرحبًا بك في محاكي الطرفية! اكتب الأمر وانقر Enter.']);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleInputSubmit = (e) => {
    e.preventDefault();
    const trimmedInput = input.trim();
    const matchedCommand = commands.find(cmd => trimmedInput.startsWith(cmd.name));

    if (matchedCommand) {
      setOutput([...output, `$ ${trimmedInput}`, matchedCommand.description, `مثال: ${matchedCommand.example}`]);
    } else if (trimmedInput === 'clear') {
      setOutput([]);
    } else {
      setOutput([...output, `$ ${trimmedInput}`, 'الأمر غير معروف. جرب أمرًا آخر.']);
    }

    setInput('');
  };

  return (
    <div className="bg-black text-green-500 p-4 rounded-lg font-mono">
      <div className="mb-4 h-64 overflow-y-auto">
        {output.map((line, index) => (
          <div key={index}>{line}</div>
        ))}
      </div>
      <form onSubmit={handleInputSubmit} className="flex">
        <span className="ml-2">$</span>
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          className="flex-grow bg-transparent outline-none"
          ref={inputRef}
        />
      </form>
    </div>
  );
};

export default TerminalSimulator;