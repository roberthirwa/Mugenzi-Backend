import React, { useState, useRef, useEffect } from "react";
import { useMugenzi } from "../../context/MugenziContext";
import { RagResponseCard } from "./RagResponseCard";

export const ChatView: React.FC = () => {
  const {
    chatHistory,
    isAiThinking,
    sendMessageToAI,
    setActiveTab,
  } = useMugenzi();

  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, isAiThinking]);

  const handleSend = async () => {
    if (!inputMessage.trim() || isAiThinking) return;
    const text = inputMessage;
    setInputMessage("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
    await sendMessageToAI(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputResize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputMessage(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
  };

  return (
    <div className="flex flex-col max-w-4xl mx-auto w-full px-4 md:px-8 pt-6 md:pt-10 pb-48 min-h-[calc(100vh-100px)]">
      {/* Top Welcome Section */}
      <div className="max-w-2xl mx-auto text-center space-y-3 mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#dae2ff] text-[#00327d] text-xs font-bold mb-1">
          <span className="material-symbols-outlined text-[16px]">verified_user</span>
          <span>Grounded Rwanda Government RAG</span>
        </div>
        <h1 className="font-display text-3xl md:text-5xl font-bold text-[#00327d] tracking-tight">
          Mwaramutse, Citizen.
        </h1>
        <p className="text-base md:text-lg text-[#434653] max-w-lg mx-auto">
          Your Rwandan digital companion is strictly grounded in official services across IremboGov, RDB, NIDA, RRA, RSSB, and National Land Authority.
        </p>
      </div>

      {/* Conversational Stream & Chat Bubbles */}
      <div className="space-y-4 max-w-3xl mx-auto w-full mb-6">
        {chatHistory.map((msg) => {
          const isUser = msg.sender === "user";
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? "justify-end" : "justify-start"}`}
            >
              {!isUser && (
                <div className="w-9 h-9 rounded-full bg-[#00327d] text-white flex items-center justify-center shrink-0 shadow-sm mt-1">
                  <span className="material-symbols-outlined text-lg">auto_awesome</span>
                </div>
              )}

              <div
                className={`max-w-[92%] sm:max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                  isUser
                    ? "bg-[#00327d] text-white rounded-br-none"
                    : "bg-white text-[#191c1d] rounded-bl-none border border-[#e1e3e4]"
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>

                {/* Grounded RAG Structured Response Card */}
                {!isUser && msg.ragResponse && (
                  <RagResponseCard rag={msg.ragResponse} />
                )}

                <div
                  className={`text-[10px] mt-2 text-right ${
                    isUser ? "text-white/70" : "text-[#737784]"
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>

              {isUser && (
                <div className="w-9 h-9 rounded-full bg-[#dae2ff] text-[#00327d] flex items-center justify-center shrink-0 shadow-sm mt-1 font-bold text-xs">
                  ME
                </div>
              )}
            </div>
          );
        })}

        {isAiThinking && (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#00327d] text-white flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-lg animate-spin">
                autorenew
              </span>
            </div>
            <div className="bg-white border border-[#e1e3e4] p-3 rounded-2xl rounded-bl-none text-xs text-[#434653] flex items-center gap-2">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-[#00327d] rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-[#00327d] rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 bg-[#00327d] rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </div>
              <span>Mugenzi is analyzing problem intent & retrieving verified Rwandan knowledge...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Sticky Bottom Interaction Zone */}
      <div className="fixed bottom-16 md:bottom-6 left-1/2 -translate-x-1/2 w-full max-w-3xl px-4 z-40 space-y-3">
        {/* AI Input Bar */}
        <div className="glass-panel rounded-2xl p-1.5 ambient-shadow ai-input-gradient flex items-center gap-2 border border-white/80 shadow-2xl">
          <button
            onClick={() => setActiveTab("docs")}
            className="w-10 h-10 flex items-center justify-center text-[#737784] hover:text-[#00327d] transition-colors rounded-xl hover:bg-[#f3f4f5]"
            title="Upload Document"
          >
            <span className="material-symbols-outlined">add</span>
          </button>

          <textarea
            ref={textareaRef}
            value={inputMessage}
            onChange={handleInputResize}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent border-none focus:ring-0 text-[#191c1d] placeholder:text-[#737784] text-sm py-2.5 px-2 resize-none max-h-32 focus:outline-none"
            placeholder="Ask Mugenzi anything about Rwandan government procedures..."
            rows={1}
          />

          <div className="flex items-center gap-1 pr-1">
            <button
              onClick={() => {
                sendMessageToAI("What can I do while buying land to avoid fraud/scam?");
              }}
              className="w-9 h-9 flex items-center justify-center text-[#737784] hover:text-[#00327d] transition-colors rounded-xl"
              title="Try sample query"
            >
              <span className="material-symbols-outlined text-xl">psychology</span>
            </button>
            <button
              onClick={handleSend}
              disabled={!inputMessage.trim() || isAiThinking}
              className="w-10 h-10 bg-[#00327d] hover:bg-[#0047ab] text-white rounded-xl flex items-center justify-center shadow-md shadow-[#00327d]/20 active:scale-90 transition-transform disabled:opacity-40"
            >
              <span className="material-symbols-outlined text-xl">send</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
