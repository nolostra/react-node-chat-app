import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import styled from "styled-components";
import { allUsersRoute, host } from "../utils/APIRoutes";
import ChatContainer from "../components/ChatContainer";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";

export default function Chat() {
  const navigate = useNavigate();
  const socket = useRef();
  const [contacts, setContacts] = useState([]);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [currentUser, setCurrentUser] = useState(undefined);
  useEffect(async () => {
    if (!localStorage.getItem("user")) {
      navigate("/login");
    } else {
      setCurrentUser(await JSON.parse(localStorage.getItem("user")));
    }
  }, []);
  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit("add-user", currentUser.id);
    }
  }, [currentUser]);

  useEffect(async () => {
    if (currentUser) {
      if (currentUser.isAvatarImageSet) {
        const data = await axios.get(`${allUsersRoute}/${currentUser.id}`);
        console.log(data.data);
        setContacts(data.data);
      } else {
        navigate("/setAvatar");
      }
    }
  }, [currentUser]);

  useEffect(async () => {
    socket.current = io(host);
    const data = await JSON.parse(localStorage.getItem("user"));
    console.log(data);
    socket.current.emit("user-status", { id: data.id });

    // Cleanup function to send message when the component unmounts
    return () => {
      socket.current.emit("user-status", { id: data.id });
    };
  }, []);
  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };
  return (
    <>
    <div className="flex flex-col justify-center items-center ">
      <div className="h-[100vh] w-[100vw] bg-[#00000076] flex flex-col md:flex-row">
        <div className="flex-none w-full h-full md:w-1/4">
          <Contacts contacts={contacts} changeChat={handleChatChange} />
        </div>
        <div className="flex-grow">
          {currentChat === undefined ? (
            <Welcome />
          ) : (
            <ChatContainer currentChat={currentChat} socket={socket} />
          )}
        </div>
      </div>
    </div>
  </>
  );
}
