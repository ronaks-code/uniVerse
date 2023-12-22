import React, { useState, KeyboardEvent } from "react";
import { FaArrowUp } from "react-icons/fa";

interface Message {
  text: string;
  sender: "user" | "bot";
}

const LLMChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const maxLines = 6;
  const lineHeight = 20; // Adjust this based on your styling

  const sendMessage = () => {
    if (input.trim() !== "") {
      const newUserMessage: Message = { text: input, sender: "user" };
      // Simulate a bot response
      const newBotMessage: Message = { text: `Echo: ${input}`, sender: "bot" };
      setMessages([...messages, newUserMessage, newBotMessage]);
      setInput("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const adjustHeight = (element: HTMLTextAreaElement) => {
    element.style.height = "auto";
    element.style.height = `${Math.min(
      element.scrollHeight,
      lineHeight * maxLines
    )}px`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    adjustHeight(e.target);
  };

  const isInputEmpty = input.trim() === "";

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] p-4 bg-gray-100 dark:bg-gray-800 transition-colors duration-500">
      <div className="flex-grow overflow-y-auto mb-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`p-2 my-1 rounded-md ${
              message.sender === "user"
                ? "bg-blue-300 self-end"
                : "bg-green-300 self-start"
            }`}
          >
            {message.text}
          </div>
        ))}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }}
        className="flex"
      >
        <textarea
          rows={1}
          placeholder="Type a message..."
          autoCorrect="off"
          value={input}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className="flex-grow resize-none overflow-hidden px-2 py-2 text-black bg-gray-200 rounded-md placeholder-gray-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 transition-colors duration-500"
        />
        <button
          type="submit"
          className={`px-4 py-2 ml-2 rounded-md transition-all duration-300 ${
            isInputEmpty
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
          disabled={isInputEmpty}
          title="Send message"
        >
          <FaArrowUp
            className={`${
              isInputEmpty ? "text-gray-600" : "text-white hover:scale-110"
            }`}
          />
        </button>
      </form>
    </div>
  );
};

export default LLMChat;
