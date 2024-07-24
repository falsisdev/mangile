import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import { getCountFromServer } from "firebase/firestore";
import { ref, onUnmounted } from "vue";
//import { getAnalytics } from "firebase/analytics";

const config = {
  apiKey: import.meta.env.VITE_FIREBASEAPIKEY,
  authDomain: import.meta.env.VITE_FIREBASEAUTHDOMAIN,
  projectId: "mangile-2229f",
  storageBucket: import.meta.env.VITE_STORAGEBUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGINGSENDERID,
  appId: import.meta.env.VITE_APPID,
};

const firebaseApp = firebase.initializeApp(config);
const db = firebaseApp.firestore();
const usersCollection = db.collection("users");
const mangasCollection = db.collection("mangas");
const lastsCollection = db.collection("lastchapters");

export const addManga = async (data, mangadexID) => {
  await setDoc(doc(db, "mangas", mangadexID), data);
  return;
};

export const getManga = async (mangadexID) => {
  const manga = await mangasCollection.doc(mangadexID).get();
  return manga.exists ? manga.data() : null;
};

export const getMangaCount = async () => {
  const res = await getCountFromServer(mangasCollection);
  return res;
};

export const getUsersCount = async () => {
  const res = await getCountFromServer(usersCollection);
  return res;
};

export const getUploadedChaptersCount = async () => {
  const res = await getCountFromServer(lastsCollection);
  return res;
};

export const getLastTen = async () => {
  const lastTen = await mangasCollection.get();
  let array = new Array();
  for (let i of lastTen.docs.reverse()) {
    if (lastTen.docs.reverse().indexOf(i) <= 19) {
      array.push(i.id);
    }
  }
  return array;
};

export const getLastChapters = async () => {
  const lasts = await lastsCollection.get();
  let array = new Array();
  for (let i of lasts.docs.reverse()) {
    if (lasts.docs.reverse().indexOf(i) <= 19) {
      array.push(i.id);
    }
  }
  return array;
};

export const getLastChapter = async (firebaseid) => {
  const chapter = await lastsCollection.doc(firebaseid).get();
  return chapter.exists ? chapter.data() : null;
};

export const getVol = async (mangadexID, vol) => {
  const volume = await mangasCollection
    .doc(mangadexID)
    .collection("volumes")
    .doc(String(vol))
    .get();
  return volume.exists ? volume.data() : null;
};

export const editManga = (mangadexID, newData) => {
  return mangasCollection.doc(mangadexID).update(newData);
};

export const deleteManga = (mangadexID) => {
  return mangasCollection.doc(mangadexID).delete();
};

export const createUser = async (user) => {
  let a = usersCollection.add(user);
  await usersCollection
    .doc(await getIDByEmail(user.email))
    .collection("library")
    .doc("bookcase")
    .set({
      completed: [],
      dropped: [],
      onhold: [],
      plantoread: [],
      reading: [],
      rereading: [],
    });
  await usersCollection
    .doc(await getIDByEmail(user.email))
    .collection("library")
    .doc("collection")
    .set({
      lists: [],
    });
  return a;
};

export const removeMangaFromBC = async (userid, mangaid, status) => {
  //status denilen şey manganın kitaplıkta hangi durumda bulunduğu; reading, onhold, dropped gibi...
  let bc = (
    await usersCollection
      .doc(userid)
      .collection("library")
      .doc("bookcase")
      .get()
  ).data();
  let bcnew = bc[status].splice(bc[status].indexOf(mangaid), 1);
  await usersCollection
    .doc(userid)
    .collection("library")
    .doc("bookcase")
    .update(bc);
};

export const addMangaToBC = async (userid, mangaid, status) => {
  //status denilen şey manganın kitaplıkta hangi durumda bulunacağı; reading, onhold, dropped gibi...
  if (status == null) window.location.reload();
  let bc = (
    await usersCollection
      .doc(userid)
      .collection("library")
      .doc("bookcase")
      .get()
  ).data();
  let bcnew = bc[status].push(mangaid);
  await usersCollection
    .doc(userid)
    .collection("library")
    .doc("bookcase")
    .update(bc);
};

//aşağıdaki fonksiyonda arrayin sıralaması konusunda sorun bulunuyor, çözülecek
export const checkMangaInBC = async (userid, mangaid) => {
  let bc = (
    await usersCollection
      .doc(userid)
      .collection("library")
      .doc("bookcase")
      .get()
  ).data();
  let i = Object.values(bc).findIndex((index) =>
    Object.values(bc).some((x) => x.includes(mangaid)) ? index : false
  );
  let ind = i == -1;
  let st = ind ? false : Object.keys(bc)[i];
  return [Object.values(bc).some((array) => array.includes(mangaid)), st];
};

export const getUser = async (email) => {
  const user = await usersCollection.where("email", "==", String(email)).get();
  return user.empty
    ? null
    : (await usersCollection.doc(user.docs[0].id).get()).data();
};

export const getBookCaseById = async (id) => {
  return (
    await usersCollection.doc(id).collection("library").doc("bookcase").get()
  ).data();
};

export const getIDByEmail = async (email) => {
  const user = await usersCollection.where("email", "==", String(email)).get();
  return user.empty ? null : user.docs[0].id;
};

export const getUserByID = async (id) => {
  const user = await usersCollection.doc(id).get();
  return user.exists ? user.data() : null;
};

export const checkUser = async (form) => {
  const user = await usersCollection
    .where("email", "==", String(form.email))
    .get();
  if (user.empty == true) {
    return true;
  } else if (
    form.password ==
    atob((await usersCollection.doc(user.docs[0].id).get()).data().password)
  ) {
    return false;
  } else {
    return true;
  }
};

export const updateUser = (id, user) => {
  return usersCollection.doc(id).update(user);
};

export const deleteUser = (id) => {
  return usersCollection.doc(id).delete();
};

export const useLoadUsers = () => {
  const users = ref([]);
  const close = usersCollection.onSnapshot((snapshot) => {
    users.value = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  });
  onUnmounted(close);
  return users;
};
