import React from "react";
import useUser from "../../hooks/use-user";
import User from "./User";
import Suggestions from "./Suggestions";

export default function Sidebar() {
  const { userInfo } = useUser();

  return (
    <div className="p-4 flex justify-center col-span-2 lg:block lg:col-span-1 lg:relative mb-24">
      <div className="flex flex-col lg:fixed">
        <User
          username={userInfo.username}
          fullName={userInfo.fullName}
          avatar={userInfo.avatar}
        />
        <Suggestions
          userId={userInfo.userId}
          following={userInfo.following}
          loggedInUserDocId={userInfo.docId}
        />
      </div>
    </div>
  );
}
