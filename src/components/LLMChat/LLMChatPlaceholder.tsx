import React from "react";

const LLMChatPlaceholder: React.FC = () => {
  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] p-4 bg-gray-100 dark:bg-gray-800 transition-colors duration-500">
      <div className="flex-grow overflow-y-auto mb-4">
        {/* Here, you can add chat messages or other content in the future */}
      </div>
      <input
        type="text"
        placeholder="Type a message..."
        autoCorrect="off"
        className="w-full max-w-[calc(100vw-2.5rem)] min-w-[350px] px-2 py-2 text-black bg-gray-200 rounded-md placeholder-gray-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 transition-colors duration-500"
      />
    </div>
  );
};

export default LLMChatPlaceholder;
