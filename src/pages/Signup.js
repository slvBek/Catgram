import React, { useState, useContext, useEffect } from "react";
import { useHistory, Link } from "react-router-dom";
import FirebaseContext from "../context/firebase";
import * as ROUTES from "../constants/routes";
import { doesUsernameExist } from "../services/firebase";
import iPhonePic from "../assets/iphone-with-pets.png";
import logo from "../assets/logo.png";
import facebookIcon from "../assets/facebookWhite.png"
import bekIcon from "../assets/lapkaa.jpg";
import "./cat.sass";
import "./auth_css/Signup.css"
import Skeleton from "react-loading-skeleton";

export default function Signup() {
  const history = useHistory();
  const { firebase } = useContext(FirebaseContext);
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const isInvalid = password === "" || emailAddress === "";

  const handleSignup = async (e) => {
    e.preventDefault();

    const usernameExists = await doesUsernameExist(username);
    if (!usernameExists) {
      try {
        const createdUserResult = await firebase
          .auth()
          .createUserWithEmailAndPassword(emailAddress.trim(), password);

        await createdUserResult.user.updateProfile({
          displayName: username,
        });
        var newDocRef = await firebase.firestore().collection("users").doc();
        newDocRef.set({
          avatar: `https://firebasestorage.googleapis.com/v0/b/catgram-bek-d78f8.appspot.com/o/no-img.png?alt=media`,
          userId: createdUserResult.user.uid,
          username: username,
          fullName,
          emailAddress: emailAddress.toLowerCase(),
          following: [],
          dateCreated: Date.now(),
          docId: newDocRef.id,
        });
        history.push(ROUTES.DASHBOARD);
      } catch (error) {
        setFullName("");
        setEmailAddress("");
        setPassword("");
        setError(error.message);
      }
    } else {
      setError("That username is already taken");
    }
  };

  useEffect(() => {
    document.title = "Sign-up - Catgram";
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
            <img src={logo} alt="igLogo" className="mt-1 w-6/12 mb-1" /> 
          </h1>
          <h2>
            Sign up to see photos and videos from your friends.
          </h2>
          <div className="register__facebook_login">
            <img src={facebookIcon} alt="Facebook icon" />
              Log in with Facebook
          </div>
          <div className="register__seperator">
            <h2>OR</h2>
          </div>
          {error && <p className="mb-4 text-xs text-red-primary">{error}</p>}
          {!handleSignup ?(
            <>
              <Skeleton count={4} width={500} height={500} className="mt-6" />
            </>
          ) : (
            isInvalid
          )}
          <form onSubmit={handleSignup} method="POST">
            <input
              aria-label="Enter your username"
              type="test"
              placeholder="Username"
              className="test-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border border-gray-primary rounded mb-2"
              onChange={({ target }) => setUsername(target.value)}
              value={username}
            />
            <input
              aria-label="Enter your full name"
              type="test"
              placeholder="Full name"
              className="test-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border border-gray-primary rounded mb-2"
              onChange={({ target }) => setFullName(target.value)}
              value={fullName}
            />
            <input
              aria-label="Enter your email address"
              type="test"
              placeholder="Email address"
              className="test-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border border-gray-primary rounded mb-2"
              onChange={({ target }) => setEmailAddress(target.value)}
              value={emailAddress}
            />
            <input
              aria-label="Enter your password"
              type="password"
              placeholder="Password"
              className="test-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border border-gray-primary rounded mb-2"
              onChange={({ target }) => setPassword(target.value)}
              value={password}
            />
            <div className="register__terms mb-2">
              <p>
                People who use our service may have uploaded your contact information to Catgram. <span>Learn More</span>
              </p>
              <p>
                By signing up, you agree to our <span>Terms</span> , <span>Privacy Policy</span> and <span>Cookies Policy</span> .
              </p>
            </div>
            <button
              disabled={isInvalid}
              type="submit"
              className={`bg-blue-primary text-white w-full rounded h-8 font-bold ${
                isInvalid && "opacity-50"
              }`}
            >
              Sign-up
            </button>
          </form>
        </div>
        <div className="pasti flex justify-center items-center flex-col w-full bg-white p-4 border border-gray-primary">
          <p className="text-sm">
            Already have an account?{` `}
            <Link to={ROUTES.LOGIN} className="font-bold text-blue-primary">
              Login
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
  </div>
  </div>
  </>
  );
}
