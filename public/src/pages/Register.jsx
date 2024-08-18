import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../assets/logo.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { registerRoute } from "../utils/APIRoutes";

export default function Register() {
  const navigate = useNavigate();
  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (localStorage.getItem("user")) {
      navigate("/");
    }
  }, []);

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const handleValidation = () => {
    const { password, confirmPassword, username, email } = values;
    if (password !== confirmPassword) {
      toast.error(
        "Password and confirm password should be same.",
        toastOptions
      );
      return false;
    } else if (username.length < 3) {
      toast.error(
        "Username should be greater than 3 characters.",
        toastOptions
      );
      return false;
    } else if (password.length < 8) {
      toast.error(
        "Password should be equal or greater than 8 characters.",
        toastOptions
      );
      return false;
    } else if (email === "") {
      toast.error("Email is required.", toastOptions);
      return false;
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (handleValidation()) {
      const { email, username, password } = values;
      const { data } = await axios.post(registerRoute, {
        username,
        email,
        password,
      });

      if (data.status === false) {
        toast.error(data.msg, toastOptions);
      }
      if (data.status === true) {
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/");
      }
    }
  };

  return (
    <>
      <div className="h-screen w-screen flex flex-col justify-center items-center bg-[#D5ED9F]">
        <form
          className="flex flex-col gap-6 bg-[#FFFBE6] rounded-lg p-10 shadow-lg"
          onSubmit={(event) => handleSubmit(event)}
        >
          <div className="flex items-center gap-2 justify-center mb-6">
            <h1 className="text-[#FF9100] text-3xl font-bold uppercase">
              CHAT-APP
            </h1>
          </div>
          <input
            type="text"
            placeholder="Username"
            name="username"
            onChange={(e) => handleChange(e)}
            className="bg-transparent p-3 border border-solid border-[#00712D] rounded-md text-[#00712D] w-full text-lg focus:border-[#997af0] outline-none"
          />
          <input
            type="email"
            placeholder="Email"
            name="email"
            onChange={(e) => handleChange(e)}
            className="bg-transparent p-3 border border-solid border-[#00712D] rounded-md text-[#00712D] w-full text-lg focus:border-[#997af0] outline-none"
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={(e) => handleChange(e)}
            className="bg-transparent p-3 border border-solid border-[#00712D] rounded-md text-[#00712D] w-full text-lg focus:border-[#997af0] outline-none"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            onChange={(e) => handleChange(e)}
            className="bg-transparent p-3 border border-solid border-[#00712D] rounded-md text-[#00712D] w-full text-lg focus:border-[#997af0] outline-none"
          />
          <button
            type="submit"
            className="bg-[#00712D] text-white p-3 border-none font-bold cursor-pointer rounded-md text-lg uppercase hover:bg-[#005a1a] transition-colors duration-300"
          >
            Create User
          </button>
          <span className="text-[#00712D] uppercase mt-4">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-[#00712D] no-underline font-bold hover:underline"
            >
              Login.
            </Link>
          </span>
        </form>
      </div>
      <ToastContainer />
    </>
  );
}
