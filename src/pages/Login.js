import React, { useState, useContext, useEffect } from "react";
import { useHistory, Link } from "react-router-dom";
import FirebaseContext from "../context/firebase";
import * as ROUTES from "../constants/routes";
import iPhonePic from "../assets/iphone-with-pets.png";
import logo from "../assets/logo.png";
import facebookIcon from '../assets/Facebook.png'
import bekIcon from "../assets/lapkaa.jpg";
import "./cat.sass";
import "./auth_css/Login.css";
import Skeleton from "react-loading-skeleton";


export default function Login() {
  const history = useHistory();
  const { firebase } = useContext(FirebaseContext);
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const isInvalid = password === "" || emailAddress === "";

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await firebase
        .auth()
        .signInWithEmailAndPassword(emailAddress.trim(), password);
      history.push(ROUTES.DASHBOARD);
    } catch (error) {
      setEmailAddress("");
      setPassword("");
      setError(error.message);
    }
  };

  useEffect(() => {
    document.title = "Login - Catgram";
  }, []);

  return (
    <>
    <div className="sss">
    <img src={bekIcon} alt=""/>
    <div className="container flex mx-auto max-w-screen-md items-center h-screen">
      <div className="hidden lg:flex w-1/2 justify-end">
        <img src={iPhonePic} className="max-h-120" alt="iphone with ig app" />
      </div>
      <div className="flex flex-col p-3 lg:p-0 lg:w-1/2">
        <div className="flex flex-col items-center bg-white p-4 border border-gray-primary mb-4">
          <h1 className="flex justify-center w-full">
            <img src={logo} alt="igLogo" className="mt-2 w-6/12 mb-4" />
          </h1>
          {error && <p className="mb-4 text-xs text-red-primary">{error}</p>}
          {!handleLogin ?(
            <>
            <Skeleton count={4} width={500} height={500} className="mt-6" />
          </>
          ) : (
            isInvalid
          )}
          <form onSubmit={handleLogin} method="POST">
            <input
              aria-label="Enter your email address"
              type="test"
              placeholder="Email address"
              className="test-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border border-gray-primary rounded mb-2"
              onChange={({ target }) => setEmailAddress(target.value)}
            />
            <input
              aria-label="Enter your password"
              type="password"
              placeholder="Password"
              className="test-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border border-gray-primary rounded mb-2"
              onChange={({ target }) => setPassword(target.value)}
            />
            <button
              disabled={isInvalid}
              type="submit"
              className={`bg-blue-primary text-white w-full rounded h-8 font-bold ${
                isInvalid && "opacity-50"
              }`}
            >
              Login
            </button>
            <div className="seperator">
              <div></div>
                <div className="seperator-text">OR</div>
              <div></div>
            </div>
            <button className='facebook-login'>
              <img src={facebookIcon} alt='Facebook icon'/>
              <span>Log in with Facebook</span>
            </button>
            <div className="password">
              <Link to="/reset-password">
              Forgot password?
            </Link>
            </div>
          </form>
        </div>
        <div className="flex justify-center items-center flex-col w-full bg-white p-4 border border-gray-primary">
          <p className="text-sm">
            Don't have an account?{` `}
            <Link to={ROUTES.SIGN_UP} className="font-bold text-blue-primary">
              Sign-up
            </Link>
          </p>
        </div>
      </div>
    </div>
    <div className="cont">
      <div className="cat">
        <img src="https://i.imgur.com/92xq9Sn.png" alt="" />
      </div>
    </div>
  <div className="lapkaimage">
    <img src={bekIcon} alt=""/>
  </div></div>
    </>
  );
}