import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { Buffer } from "buffer";
import loader from "../assets/loader.gif";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { setAvatarRoute } from "../utils/APIRoutes";
export default function SetAvatar() {
  const api = `https://api.multiavatar.com/4645646`;
  const navigate = useNavigate();
  const [avatars, setAvatars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState(undefined);
  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  useEffect(async () => {
    if (!localStorage.getItem("user")) navigate("/login");
  }, []);

  const setProfilePicture = async () => {
    if (selectedAvatar === undefined) {
      toast.error("Please select an avatar", toastOptions);
    } else {
      const user = await JSON.parse(localStorage.getItem("user"));
      console.log("user", user);

      const { data } = await axios.post(`${setAvatarRoute}/${user.id}`, {
        image: avatars[selectedAvatar],
      });

      if (data.isSet) {
        user.isAvatarImageSet = true;
        user.avatarImage = data.image;
        localStorage.setItem("user", JSON.stringify(user));
        navigate("/");
      } else {
        toast.error("Error setting avatar. Please try again.", toastOptions);
      }
    }
  };

  useEffect(async () => {
    const data = [];
    for (let i = 0; i < 4; i++) {
      const image = await axios.get(
        `${api}/${Math.round(Math.random() * 1000)}`
      );
      const buffer = new Buffer(image.data);
      data.push(buffer.toString("base64"));
    }
    setAvatars(data);
    setIsLoading(false);
  }, []);
  return (
    <>
      {isLoading ? (
        <div className="flex flex-col items-center justify-center gap-12 bg-[#D5ED9F] h-screen w-screen">
          <img src={loader} alt="loader" className="max-w-full" />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-12 bg-[#D5ED9F] h-screen w-screen">
          <div className="text-[#FF9100]">
            <h1 className="text-2xl font-bold">
              Pick an Avatar as your profile picture
            </h1>
          </div>
          <div className="flex gap-8">
            {avatars.map((avatar, index) => (
              <div
                key={avatar}
                className={`border-4 rounded-full p-1 flex items-center justify-center transition-all duration-500 ${
                  selectedAvatar === index
                    ? "border-[#00712D]"
                    : "border-transparent"
                }`}
                onClick={() => setSelectedAvatar(index)}
              >
                <img
                  src={`data:image/svg+xml;base64,${avatar}`}
                  alt="avatar"
                  className="h-24 transition-all duration-500"
                />
              </div>
            ))}
          </div>
          <button
            onClick={setProfilePicture}
            className="bg-[#FF9100] text-white py-3 px-6 rounded-md font-bold text-lg uppercase hover:bg-[#e68000] transition-colors duration-300"
          >
            Set as Profile Picture
          </button>
          <ToastContainer />
        </div>
      )}
    </>
  );
}
