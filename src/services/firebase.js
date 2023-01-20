import { firebase, FieldValue } from "../lib/firebase";

export async function doesUsernameExist(username) {
  const result = await firebase
    .firestore()
    .collection("users")
    .where("username", "==", username)
    .get();

  return result.docs.length > 0;
}

export async function getUserByUsername(username) {
  const result = await firebase
    .firestore()
    .collection("users")
    .where("username", "==", username)
    .get();

  return result.docs.map((item) => ({
    ...item.data(),
    docId: item.id,
  }));
}

export async function getPostByDocId(docId) {
  const result = await firebase
    .firestore()
    .collection("photos")
    .where("docId", "==", docId)
    .get();

  return result.docs.map((item) => ({
    ...item.data(),
    docId: item.id,
  }));
}

export async function getUserByUserId(userId) {
  const result = await firebase
    .firestore()
    .collection("users")
    .where("userId", "==", userId)
    .get();

  return result.docs.map((item) => ({
    ...item.data(),
    docId: item.id,
  }));
}

export async function getSuggestedProfiles(userId, following) {
  const result = await firebase.firestore().collection("users").limit(10).get();

  return result.docs
    .map((user) => ({ ...user.data(), docId: user.id }))
    .filter(
      (profile) =>
        profile.userId !== userId && !following.includes(profile.userId)
    );
}

export async function updateLoggedInUserFollowing(
  loggedInUserDocId,
  profileId,
  isFollowingProfile
) {
  return firebase
    .firestore()
    .collection("users")
    .doc(loggedInUserDocId)
    .update({
      following: isFollowingProfile
        ? FieldValue.arrayRemove(profileId)
        : FieldValue.arrayUnion(profileId),
    });
}

export async function updateFollowedUserFollowers(
  profileDocId, 
  loggedInUserDocId, 
  isFollowingProfile 
) {
  return firebase
    .firestore()
    .collection("users")
    .doc(profileDocId)
    .update({
      followers: isFollowingProfile
        ? FieldValue.arrayRemove(loggedInUserDocId)
        : FieldValue.arrayUnion(loggedInUserDocId),
    });
}

export async function getPhotos(userId, following, username) {
  const fetchFollowingPhotos = await new Promise((res) => {
    let batches = [];

    while (following.length) {
      const collectionPath = firebase.firestore().collection("photos");
      const batch = following.splice(0, 10);

      batches.push(
        new Promise((response) => {
          collectionPath
            .where("userId", "in", [...batch])
            .get()
            .then((results) =>
              response(
                results.docs.map((result) => ({
                  ...result.data(),
                  docId: result.id,
                }))
              )
            );
        })
      );
    }
    Promise.all(batches).then((content) => {
      console.log(content);
      res(content.flat());
    });
  });

  const userFollowedPhotosWithUserDetails = await Promise.all(
    await fetchFollowingPhotos.map(async (photo) => {
      let userLikedPhoto = false;
      if (photo.likes.includes(userId)) {
        userLikedPhoto = true;
      }
      const user = await getUserByUserId(photo.userId);
      const { username } = user[0];
      return { username, ...photo, userLikedPhoto };
    })
  );

  const fetchUserPhotos = await firebase
    .firestore()
    .collection("photos")
    .where("username", "==", username)
    .get();

  const userPhotos = fetchUserPhotos.docs.map((photo) => ({
    ...photo.data(),
    docId: photo.id,
  }));

  const userPhotosWithUserDetails = await Promise.all(
    userPhotos.map(async (photo) => {
      let userLikedPhoto = false;
      if (photo.likes.includes(userId)) {
        userLikedPhoto = true;
      }
      const user = await getUserByUserId(photo.userId);
      const { username } = user[0];
      return { username, ...photo, userLikedPhoto };
    })
  );

  const photosWithUserDetails = [
    ...userFollowedPhotosWithUserDetails,
    ...userPhotosWithUserDetails,
  ];

  photosWithUserDetails.sort((a, b) => b.dateCreated - a.dateCreated);

  return photosWithUserDetails;
}

export async function getFollowingOrFollowers(users) {
  if (users.length <= 10) {
    const fetchFollowing = await firebase
      .firestore()
      .collection("users")
      .where("userId", "in", users)
      .get();

    const followingResults = fetchFollowing.docs.map((user) => ({
      ...user.data(),
    }));

    return followingResults;
  } else {
    return new Promise((res) => {
      let batches = [];

      while (users.length) {
        const collectionPath = firebase.firestore().collection("users");
        const batch = users.splice(0, 10);

        batches.push(
          new Promise((response) => {
            collectionPath
              .where("userId", "in", [...batch])
              .get()
              .then((results) =>
                response(results.docs.map((result) => ({ ...result.data() })))
              );
          })
        );
      }

      Promise.all(batches).then((content) => {
        res(content.flat());
      });
    });
  }
}

export async function getUserPhotosByUsername(username) {
  const [user] = await getUserByUsername(username);
  const result = await firebase
    .firestore()
    .collection("photos")
    .where("userId", "==", user.userId)
    .get();

  return result.docs.map((item) => ({
    ...item.data(),
    docId: item.id,
    username: username,
  }));
}

export async function isUserFollowingProfile(
  loggedInUserUsername,
  profileUserId
) {
  const result = await firebase
    .firestore()
    .collection("users")
    .where("username", "==", loggedInUserUsername) 
    .where("following", "array-contains", profileUserId)
    .get();

  const [response = {}] = result.docs.map((item) => ({
    ...item.data(),
    docId: item.id,
  }));

  return response.userId;
}

export async function toggleFollow(
  isFollowingProfile,
  activeUserDocId,
  profileDocId,
  profileUserId,
  followingUserID
) {
  await updateLoggedInUserFollowing(
    activeUserDocId, 
    profileUserId, 
    isFollowingProfile 
  );
  await updateFollowedUserFollowers(
    profileDocId, 
    followingUserID, 
    isFollowingProfile 
  );
}

export async function updateUserAvatar(userInfo, image, fileName) {
  const oldImageName = userInfo.avatarStorageName;
  const newImageName = `${Math.round(Math.random() * 1000000)}.${fileName}`;
  var newDocRef = firebase.firestore().collection("users").doc(userInfo.docId);

  newDocRef.update({
    avatar: `https://firebasestorage.googleapis.com/v0/b/catgram-bek-d78f8.appspot.com/o/${newImageName}?alt=media`,
    avatarStorageName: `${newImageName}`,
  });

  const storageRef = firebase.storage().ref();
  const fileRef = storageRef.child(newImageName);
  fileRef.putString(image, "data_url");

  var deleteRef = storageRef.child(`${oldImageName}`);

  if (oldImageName !== "no-img.png") {
    deleteRef
      .delete()
      .then(function () {
        console.log("file successfully deleted");
      })
      .catch(function (error) {
        console.log(error);
      });
  }
}

export async function submitPost(userInfo, selectedImage, caption, fileName) {
  const newImageName = `${Math.round(Math.random() * 1000000)}.${fileName}`;
  var newDocRef = firebase.firestore().collection("photos").doc();

  console.log("fileName", fileName);
  newDocRef.set({
    caption: caption,
    comments: [],
    likes: [],
    docId: newDocRef.id,
    userId: userInfo.userId,
    username: userInfo.username,
    dateCreated: Date.now(),
    imageSrc: `https://firebasestorage.googleapis.com/v0/b/catgram-bek-d78f8.appspot.com/o/${newImageName}?alt=media`,
    photoStorageName: newImageName,
  });

  const storageRef = firebase.storage().ref();
  const fileRef = storageRef.child(newImageName);
  fileRef.putString(selectedImage, "data_url");

}

export async function getPostInfoByDocId(docId, userId) {
  const photosByDocId = await firebase
    .firestore()
    .collection("photos")
    .where("docId", "==", docId)
    .get();

  const cleanPhotosByDocId = photosByDocId.docs.map((item) => ({
    ...item.data(),
    docId: item.id,
  }));

  const result = await Promise.all(
    cleanPhotosByDocId.map(async (photo) => {
      let userLikedPhoto = false;
      if (photo.likes.includes(userId)) {
        userLikedPhoto = true;
      }
      const user = await getUserByUserId(photo.userId);
      const { username } = user[0];
      return { username, ...photo, userLikedPhoto };
    })
  );

  return result;
}

export async function deletePostById(docId, photoStorageName) {

  const photoToDeleteInfo = await firebase
    .firestore()
    .collection("photos")
    .doc(docId)
    .get();

  const comments = await photoToDeleteInfo.data().comments;
  const likes = await photoToDeleteInfo.data().likes;

  if (likes !== undefined) {
    for (let i = 0; i < likes.length; i++) {
      const user = await getUserByUserId(likes[i]);
      await firebase
        .firestore()
        .collection("users")
        .doc(user[0].docId)
        .update({
          likes: FieldValue.arrayRemove(docId),
        });
    }
  }

  if (comments !== undefined) {
    for (let i = 0; i < comments.length; i++) {
      const commentId = comments[i].commentId;
      let userToUpdateComments = await firebase
        .firestore()
        .collection("users")
        .doc(comments[i].userDocId)
        .get();

      userToUpdateComments = userToUpdateComments.data();

      const userFilteredCommentsArray = userToUpdateComments.comments.filter(
        (p) => p.commentId !== commentId
      );

      await firebase
        .firestore()
        .collection("users")
        .doc(comments[i].userDocId)
        .set(
          {
            comments: userFilteredCommentsArray,
          },
          { merge: true }
        );
    }
  }

  await firebase
    .firestore()
    .collection("photos")
    .doc(docId)
    .delete()
    .then(() => {
      console.log("Document successfully deleted!");
    })
    .catch((error) => {
      console.error("Error removing document: ", error);
    });

  const storageRef = firebase.storage().ref();
  var deleteRef = storageRef.child(`${photoStorageName}`);

  if (photoStorageName !== "no-img.png") {
    deleteRef
      .delete()
      .then(function () {
        console.log("file successfully deleted");
      })
      .catch(function (error) {
        console.log(error);
      });
  }
}

export async function deleteCommentByCommentId(
  docId,
  allComments,
  commentId,
  userInfo
) {
  const filteredCommentsArray = allComments.filter(
    (p) => p.commentId !== commentId
  );

  firebase.firestore().collection("photos").doc(docId).set(
    {
      comments: filteredCommentsArray,
    },
    { merge: true }
  );

  const userFilteredCommentsArray = userInfo.comments.filter(
    (p) => p.commentId !== commentId
  );

  firebase.firestore().collection("users").doc(userInfo.docId).set(
    {
      comments: userFilteredCommentsArray,
    },
    { merge: true }
  );
}

export async function deleteProfile(userInfo) {
  const { userId, following, followers, docId, comments, likes } = userInfo;

  if (following !== undefined) {
    for (let i = 0; i < following.length; i++) {
      let followerToRemove = await firebase
        .firestore()
        .collection("users")
        .where("userId", "==", following[i])
        .get();

      followerToRemove = followerToRemove.docs.map((item) => ({
        ...item.data(),
        docId: item.id,
      }));

      firebase
        .firestore()
        .collection("users")
        .doc(followerToRemove[0].docId)
        .update({
          followers: FieldValue.arrayRemove(userId),
        });
    }
  }

  if (followers !== undefined) {
    for (let i = 0; i < followers.length; i++) {
      let followerToRemove = await firebase
        .firestore()
        .collection("users")
        .where("userId", "==", followers[i])
        .get();

      followerToRemove = followerToRemove.docs.map((item) => ({
        ...item.data(),
        docId: item.id,
      }));

      firebase
        .firestore()
        .collection("users")
        .doc(followerToRemove[0].docId)
        .update({
          following: FieldValue.arrayRemove(userId),
        });
    }
  }

  if (comments !== undefined) {
    for (let i = 0; i < comments.length; i++) {
      let photoDocId = comments[i].photoDocId;
      let commentId = comments[i].commentId;
      let postInfo = await getPostInfoByDocId(photoDocId, userId);
      let allComments = postInfo[0].comments;
      deleteCommentByCommentId(photoDocId, allComments, commentId, userInfo);
    }
  }

  if (likes !== undefined) {
    for (let i = 0; i < likes.length; i++) {
      await firebase
        .firestore()
        .collection("photos")
        .doc(likes[i])
        .update({
          likes: FieldValue.arrayRemove(userId),
        });

      await firebase
        .firestore()
        .collection("users")
        .doc(docId)
        .update({
          likes: FieldValue.arrayRemove(likes[i]),
        });
    }
  }

  let userPhotos = await firebase
    .firestore()
    .collection("photos")
    .where("userId", "==", userId)
    .get();

  userPhotos = userPhotos.docs.map((item) => ({
    ...item.data(),
    docId: item.id,
  }));

  for (let i = 0; i < userPhotos.length; i++) {
    let photoStorageName = userPhotos[i].photoStorageName;
    let docId = userPhotos[i].docId;
    deletePostById(docId, photoStorageName);
  }

  const user = firebase.auth().currentUser;
  user
    .delete()
    .then(() => {
      console.log("deleted from auth");
    })
    .catch((error) => {
      console.log(error);
    });

  await firebase.firestore().collection("users").doc(docId).delete();

  firebase.auth().signOut();
}
