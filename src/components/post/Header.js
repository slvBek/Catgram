import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { getUserByUserId, deletePostById } from "../../services/firebase";
import * as ROUTES from "../../constants/routes";
import { useHistory } from "react-router-dom";
import useUser from "../../hooks/use-user";

export default function Header({
  userId,
  docId,
  photoStorageName,
  page,
  home,
}) {
  const [postUser, setPostUser] = useState("");
  const [deletePostButton, setDeletePostButton] = useState(false);
  const { userInfo } = useUser();
  const history = useHistory();

  useEffect(() => {
    async function checkUserExists() {
      const [doesUserExist] = await getUserByUserId(userId);
      if (doesUserExist.userId) {
        setPostUser(doesUserExist);
      } else {
        history.push(ROUTES.NOT_FOUND);
      }
    }

    checkUserExists();
  }, [userId, history]);

  const handleX = () => {
    setDeletePostButton(!deletePostButton);
  };

  const handleDelete = () => {
    deletePostById(docId, photoStorageName);
    setTimeout(function () {
      history.push("/");
    }, 500);
  };

  return (
    <div className="flex border-b border-gray-primary h-4 p-4 py-8">
      <div className="flex items-center justify-between w-full">
        <Link to={`/p/${postUser.username}`} className="flex items-center">
          <img
            src={postUser.avatar}
            className="rounded-full h-8 w-8 flex mr-3 object-cover"
            alt={`${postUser.username} avi`}
          />
          <p className="font-bold">{postUser.username}</p>
        </Link>
        <div className="flex justify-center items-center">
          {deletePostButton && (
            <button
              onClick={handleDelete}
              className="hover:bg-red-primary hover:text-white font-bold h-5/6 px-2 py-1 rounded mr-6 duration-150"
              title="confirm delete"
            >
              delete?
            </button>
          )}
          {userInfo.userId === postUser.userId &&
            page === "post" &&
            home !== true && (
              <button
                className={`relative font-bold text-4xl hover:text-red-primary mr-2 h-12 cursor-pointer duration-150 ${
                  deletePostButton
                    ? `hover:text-green-primary`
                    : `hover:text-red-primary`
                }`}
                onClick={handleX}
                title={deletePostButton ? "cancel delete" : "delete your post"}
              >
                <span className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  ×
                </span>
              </button>
            )}
        </div>
      </div>
    </div>
  );
}

Header.propTypes = {
  username: PropTypes.string,
  docId: PropTypes.string,
  photoStorageName: PropTypes.string.isRequired,
  page: PropTypes.string.isRequired,
};
