import React, { useState } from "react";
import { BsEmojiSmileFill } from "react-icons/bs";
import { IoMdSend } from "react-icons/io";
import styled from "styled-components";
import Picker from "emoji-picker-react";

export default function ChatInput({ handleSendMsg }) {
  const [msg, setMsg] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const handleEmojiPickerhideShow = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleEmojiClick = (event, emojiObject) => {
    let message = msg;
    message += emojiObject.emoji;
    setMsg(message);
  };

  const sendChat = (event) => {
    event.preventDefault();
    if (msg.length > 0) {
      handleSendMsg(msg);
      setMsg("");
    }
  };
  
  return (
    <div className="flex items-center bg-white px-8 py-4 gap-4 border-t">
    <div className="flex items-center gap-4">
      <div className="relative">
        <BsEmojiSmileFill 
          onClick={handleEmojiPickerhideShow} 
          className="text-yellow-400 text-xl cursor-pointer" 
        />
        {showEmojiPicker && (
          <Picker 
            onEmojiClick={handleEmojiClick} 
            className="absolute top-[-350px] bg-[#080420] shadow-lg border-[#9a86f3]" 
          />
        )}
      </div>
    </div>
    <form 
      className="flex items-center gap-4 w-full rounded-full bg-[#ffffff34] p-2"
      onSubmit={(event) => sendChat(event)}
    >
      <input
        type="text"
        placeholder="type your message here"
        onChange={(e) => setMsg(e.target.value)}
        value={msg}
        className="w-full h-12 bg-[#f3f4f6] text-stone-600 border pl-4 text-lg focus:outline-none rounded-lg "
      />
      <button
        type="submit"
        className="flex items-center justify-center  border-none bg-[#9a86f3] p-2 rounded-full border-none hover:bg-[#8a7ff5]"
      >
        <IoMdSend className="text-white text-xl" />
      </button>
    </form>
  </div>
  );
}
