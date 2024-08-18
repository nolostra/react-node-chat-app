import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../assets/logo.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loginRoute } from "../utils/APIRoutes";

export default function Login() {
  const navigate = useNavigate();
  const [values, setValues] = useState({ username: "", password: "" });
  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };
  useEffect(() => {
    if (localStorage.getItem("user")) {
      navigate("/");
    }
  }, [navigate]);

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const validateForm = () => {
    const { username, password } = values;
    if (username === "") {
      toast.error("Email and Password is required.", toastOptions);
      return false;
    } else if (password === "") {
      toast.error("Email and Password is required.", toastOptions);
      return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      const { username, password } = values;
      const { data } = await axios.post(loginRoute, {
        username,
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
            min="3"
            className="bg-transparent p-3 border border-solid border-[#00712D] rounded-md text-[#FF9100] w-full text-lg focus:border-[#FF9100] outline-none"
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={(e) => handleChange(e)}
            className="bg-transparent p-3 border border-solid border-[#00712D] rounded-md text-[#FF9100] w-full text-lg focus:border-[#FF9100] outline-none"
          />
          <button
            type="submit"
            className="bg-[#FF9100] text-white p-3 border-none font-bold cursor-pointer rounded-md text-lg uppercase hover:bg-[#e68000] transition-colors duration-300"
          >
            Log In
          </button>
          <span className="text-[#FF9100] uppercase mt-4">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-[#FF9100] no-underline font-bold hover:underline"
            >
              Create One.
            </Link>
          </span>
        </form>
      </div>
      <ToastContainer />
    </>
  );
}
