import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Robot from "../assets/robot.gif";
export default function Welcome() {
  const [userName, setUserName] = useState("");
  useEffect(async () => {
    setUserName(await JSON.parse(localStorage.getItem("user")).username);
  }, []);
  return (
    <div className="flex flex-col items-center justify-center ">
      <img src={Robot} alt="" className="h-80" />
      <h1 className="text-2xl font-bold">
        Welcome, <span className="text-[#4e0eff]">{userName}!</span>
      </h1>
      <h3 className="text-lg mt-2">Please select a chat to start messaging.</h3>
    </div>
  );
}
