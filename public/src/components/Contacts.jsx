import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Logo from "../assets/logo.svg";

export default function Contacts({ contacts, changeChat }) {
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentUserImage, setCurrentUserImage] = useState(undefined);
  const [currentSelected, setCurrentSelected] = useState(undefined);
  useEffect(async () => {
    const data = await JSON.parse(localStorage.getItem("user"));
    setCurrentUserName(data.username);
    setCurrentUserImage(data.avatarImage);
  }, []);
  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(index);
    changeChat(contact);
  };
  return (
    <>
      {currentUserImage && (
        <div className="h-full flex flex-col bg-white border-r overflow-y-hidden">
          <div className="p-2 bg-[#f9fafb] border border-[#e5e7eb] w-full">
            <input
              type="text"
              placeholder="Search..."
              className="w-full p-2 border border-[#e5e7eb] rounded-md text-gray-700  focus:outline-none"
            />
          </div>
          <div className="flex flex-col items-center overflow-auto gap-2 p-2 scrollbar-hide ">
            {contacts.map((contact, index) => (
              <div
                key={contact.id}
                className={`flex gap-4 border items-center p-2 rounded-sm transition duration-500 cursor-pointer w-full ${
                  index === currentSelected ? "bg-[#e5e7eb]" : "bg-[#f9fafb]"
                }`}
                onClick={() => changeCurrentChat(index, contact)}
              >
                <div className="flex-shrink-0">
                  <img
                    src={`data:image/svg+xml;base64,${contact.avatarImage}`}
                    alt=""
                    className="h-12"
                  />
                </div>
                <div>
                  <h3 className="">{contact.username}</h3>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-8 bg-[#e5e7eb] p-2 h-1/4">
            <div className="flex-shrink-0">
              <img
                src={`data:image/svg+xml;base64,${currentUserImage}`}
                alt="avatar"
                className="h-16 max-w-full"
              />
            </div>
            <div>
              <h2 className=" text-black text-lg">{currentUserName}</h2>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
