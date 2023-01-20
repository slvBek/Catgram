import React, { useState, useEffect, useRef } from "react";
import Header from "../components/Header";
import MobileHeader from "../components/MobileHeader";
import MobileFooter from "../components/Footer";
import PostHeader from "../components/post/Header";
import Actions from "../components/post/Actions";
import Footer from "../components/post/Footer";
import Comments from "../components/post/Comments";
import { useParams, useHistory } from "react-router-dom";
import { getPostInfoByDocId } from "../services/firebase";
import usePhotos from "../hooks/use-photos";
import useUser from "../hooks/use-user";
import "./pages.css";

export default function Post() {
  const { userInfo } = useUser(); 
  const { photos } = usePhotos(); 
  const { docId } = useParams(); 
  const [post, setPost] = useState(null);
  const history = useHistory();
  const commentInput = useRef(null);
  const handleFocus = () => commentInput.current.focus();

  useEffect(() => {
    async function checkUserExists() {
      const [doesPostExist] = await getPostInfoByDocId(docId, userInfo.userId);
      if (doesPostExist) {
        setPost(doesPostExist);
      } else {
        history.push("/not-found");
      }
    }

    checkUserExists();
  }, [docId, history, photos, userInfo.userId]);

  return post?.docId ? (
    <div>
      <Header />
      <MobileHeader />
      <div className="post-desktop">
        <div className="flex">
          <div
            className="h-full mt-6 w-min mx-auto items-center justify-center flex"
            style={{ zIndex: "5" }}
          >
            <div className="flex flex-col lg:flex-row lg:flex-col-2 border border-gray-primary m-auto w-max">
              <div className="">
                <img
                  src={post.imageSrc}
                  alt="post"
                  className="border-r border-gray-primary"
                  style={{ width: "80vh" }}
                />
              </div>
              <div className="relative bg-white" style={{ width: "60vh" }}>
                <PostHeader
                  userId={post.userId}
                  docId={docId}
                  page="post"
                  photoStorageName={post.photoStorageName}
                />
                <Actions
                  docId={post.docId}
                  totalLikes={post.likes.length}
                  likedPhoto={post.userLikedPhoto}
                  handleFocus={handleFocus}
                />
                <Footer username={post.username} caption={post.caption} />
                <Comments
                  docId={post.docId}
                  comments={post.comments}
                  posted={post.dateCreated}
                  commentInput={commentInput}
                  page="post"
                />
              </div>
            </div>
          </div>
          <div
            className="w-screen bg-black-light opacity-40 absolute cursor-pointer"
            style={{ zIndex: "1", height: "calc(100vh - 4rem)" }}
            onClick={() => history.goBack()}
          ></div>
        </div>
      </div>

      <div className="post-mobile">
        <div className="rounded col-span-4 border border-gray-primary bg-white mt-4 mb-2 relative">
          <PostHeader
            userId={post.userId}
            docId={post.docId}
            photoStorageName={post.photoStorageName}
            page="post"
          />
          <div className="">
            <img
              src={post.imageSrc}
              alt="post"
              className="border-r border-gray-primary min-w-full max-w-full"
            />
          </div>

          <Actions
            docId={post.docId}
            totalLikes={post.likes.length}
            likedPhoto={post.userLikedPhoto}
            handleFocus={handleFocus}
          />
          <Footer username={post.username} caption={post.caption} />
          <Comments
            docId={post.docId}
            comments={post.comments}
            posted={post.dateCreated}
            commentInput={commentInput}
            page="post"
          />
        </div>
        <div className="flex justify-center align-center mt-5 mb-24 lg:my-5">
          <button
            className="bg-blue-primary font-bold text-sm rounded text-white w-20 h-8"
            onClick={() => history.goBack()}
          >
            Go Back
          </button>
        </div>
      </div>
      <MobileFooter />
    </div>
  ) : null;
}
