import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import ChatInput from "./ChatInput";
import Logout from "./Logout";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { sendMessageRoute, recieveMessageRoute } from "../utils/APIRoutes";
import { io } from "socket.io-client";
import { host } from "../utils/APIRoutes";
import { debounce } from "lodash";

export default function ChatContainer({ currentChat, socket }) {
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef();
  const [arrivalMessage, setArrivalMessage] = useState(null);
  // const socket = useRef();
  const [isTyping, setIsTyping] = useState(false);

  const handleKeyDown = async () => {
    const data = await JSON.parse(localStorage.getItem("user"));

    if (!isTyping) {
      currentChat.id == data.id && setIsTyping(true);
      socket.current.emit("typing-msg", {
        from: data.id,
        to: currentChat.id,
        typing: true,
      });
    }

    debouncedStopTyping(data.id);
  };

  const stopTyping = async (userId) => {
    const data = await JSON.parse(localStorage.getItem("user"));

    setIsTyping(false);
    socket.current.emit("typing-msg", {
      from: data.id,
      to: currentChat.id,
      typing: false,
    });
  };

  // Create a debounced version of stopTyping
  const debouncedStopTyping = useRef(
    debounce((userId) => stopTyping(userId), 1000)
  ).current;

  useEffect(() => {
    // Add event listeners for keydown
    window.addEventListener("keydown", handleKeyDown);

    // Cleanup event listeners on component unmount
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      debouncedStopTyping.cancel(); // Cancel any pending debounced calls on unmount
    };
  }, []);

  useEffect(async () => {
    const data = await JSON.parse(localStorage.getItem("user"));
    try {
      const response = await axios.post(recieveMessageRoute, {
        from: data.id,
        to: currentChat.id,
      });
      setMessages(response.data);
    } catch (error) {
      console.log(" chatCont error", error);
    }
  }, [currentChat]);

  useEffect(() => {
    const getCurrentChat = async () => {
      if (currentChat) {
        await JSON.parse(localStorage.getItem("user")).id;
      }
    };
    getCurrentChat();
  }, [currentChat]);

  const handleSendMsg = async (msg) => {
    const data = await JSON.parse(localStorage.getItem("user"));
    socket.current.emit("send-msg", {
      to: currentChat.id,
      from: data.id,
      msg,
    });
    await axios.post(sendMessageRoute, {
      from: data.id,
      to: currentChat.id,
      message: msg,
    });
    const msgs = [...messages];
    msgs.push({ fromSelf: true, message: msg });
    setMessages(msgs);
  };

  useEffect(async () => {
    if (socket.current) {
      const data = await JSON.parse(localStorage.getItem("user"));
      socket.current.on("msg-recieve", (msg) => {
        console.log("msg recieve", msg);
        setArrivalMessage({ fromSelf: false, message: msg });
      });

      socket.current.on("send-typing", (msg) => {
        console.log("typing msg", msg);

        if (data && data.id === msg.to) {
          setIsTyping(msg.typing);
        }
      });
    }
  }, []);

  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-full w-full overflow-hidden bg-[#f3f4f6]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-[#f3f4f6] border-b border-gray-200">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12">
            {currentChat.avatarImage && (
              <img
                src={`data:image/svg+xml;base64,${currentChat.avatarImage}`}
                alt="avatar"
                className="w-full h-full object-cover rounded-full"
              />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">{currentChat.username}</h3>
              <div
                className={`w-2.5 h-2.5 rounded-full ${
                  currentChat.isOnline ? "bg-green-500" : "bg-red-500"
                }`}
              ></div>
            </div>
            <h3 className="text-sm text-gray-600">
              {isTyping ? "Typing..." : ""}
            </h3>
          </div>
        </div>
        <Logout />
      </div>

      {/* Messages Section */}
      <div className="flex-1 p-4 overflow-auto bg-white scrollbar-hide">
        {messages.map((message) => (
          <div
            key={uuidv4()}
            className={`flex mb-2 ${
              message.fromSelf ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[70%] p-3 rounded-lg ${
                message.fromSelf
                  ? "bg-[#ef6144] text-[#FFFBE6]"
                  : "bg-[#e5e7eb] text-black"
              }`}
            >
              <p className="text-base break-words">{message.message}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Chat Input */}
      <ChatInput handleSendMsg={handleSendMsg} />
    </div>
  );
}
