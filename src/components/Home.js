import React from "react";
import Skeleton from "react-loading-skeleton";
import usePhotos from "../hooks/use-photos";
import Post from "./post/Post";

export default function Home() {
  const { photos } = usePhotos();

  return (
    <div className="container col-span-2" style={{ marginTop: "-17px" }}>
      {!photos ? (
        <>
          <Skeleton count={4} width={500} height={500} className="mt-6" />
        </>
      ) : photos?.length > 0 ? (
        photos.map((content) => (
          <Post key={content.docId} content={content} home={true} />
        ))
      ) : (
        <p className="text-center text-2xl mt-5 lg:pt-20">
          Follow users to see photos!
        </p>
      )}
    </div>
  );
}
