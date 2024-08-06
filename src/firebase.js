/////////////////////////////////////////////////////////////////////////////////
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/storage";
import { getCountFromServer } from "firebase/firestore";
import bcrypt from "bcryptjs";
/////////////////////////////////////////////////////////////////////////////////
const config = {
  apiKey: import.meta.env.VITE_FIREBASEAPIKEY,
  authDomain: import.meta.env.VITE_FIREBASEAUTHDOMAIN,
  projectId: "mangile-2229f",
  storageBucket: import.meta.env.VITE_STORAGEBUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGINGSENDERID,
  appId: import.meta.env.VITE_APPID,
};
/////////////////////////////////////////////////////////////////////////////////
const firebaseApp = firebase.initializeApp(config);
const db = firebaseApp.firestore();
const usersCollection = db.collection("users");
const mangasCollection = db.collection("mangas");
const lastsCollection = db.collection("lastchapters");
const scansCollection = db.collection("scans");
/////////////////////////////////////////////////////////////////////////////////
export const getBookCaseById = async (id) => {
  return (
    await usersCollection.doc(id).collection("library").doc("bookcase").get()
  ).data();
};
/* ------------------------------------------- */
export const getCollectionById = async (id) => {
  return (
    await usersCollection.doc(id).collection("library").doc("collection").get()
  ).data();
};
/* ------------------------------------------- */
/*
export const useLoadUsers = () => {
  const users = ref([]);
  const close = usersCollection.onSnapshot((snapshot) => {
    users.value = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  });
  onUnmounted(close);
  return users;
};
*/
///////////////////////// ---- SCANS FONKSİYONLARI ---- /////////////////////////
export const getScan = async (name) => {
  const scan = await scansCollection.doc(name).get();
  return scan.exists ? scan.data() : null;
};
///////////////////////// ---- SCANS FONKSİYONLARI ---- /////////////////////////
///////////////////////// ---- MANGA FONKSİYONLARI ---- /////////////////////////
export const addManga = async (data, mangadexID) => {
  await setDoc(doc(db, "mangas", mangadexID), data);
  return;
};
/* ------------------------------------------- */
export const getManga = async (mangadexID) => {
  const manga = await mangasCollection.doc(mangadexID).get();
  return manga.exists ? manga.data() : null;
};
/* ------------------------------------------- */
export const getMangaCount = async () => {
  const res = await getCountFromServer(mangasCollection);
  return res;
};
/* ------------------------------------------- */
export const getVol = async (mangadexID, vol) => {
  const volume = await mangasCollection
    .doc(mangadexID)
    .collection("volumes")
    .doc(String(vol))
    .get();
  return volume.exists ? volume.data() : null;
};
/* ------------------------------------------- */
export const editManga = (mangadexID, newData) => {
  return mangasCollection.doc(mangadexID).update(newData);
};
/* ------------------------------------------- */
export const deleteManga = (mangadexID) => {
  return mangasCollection.doc(mangadexID).delete();
};
/* ------------------------------------------- */
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
/* ------------------------------------------- */
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
  bc[status].push(mangaid);
  await usersCollection
    .doc(userid)
    .collection("library")
    .doc("bookcase")
    .update(bc);
};
/* ------------------------------------------- */
export const checkMangaInBC = async (userid, mangaid) => {
  //bu fonksiyonda arrayin sıralaması konusunda sorun bulunuyor, çözülecek
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
/* ------------------------------------------- */
export const checkMangaExists = async (mangaid) => {
  return (await mangasCollection.doc(mangaid).get()).data();
};
///////////////////////// ---- MANGA FONKSİYONLARI ---- /////////////////////////
///////////////////////// ---- LASTUPLOADS FONKSİYONLARI ---- /////////////////////////
export const getUploadedChaptersCount = async () => {
  const res = await getCountFromServer(lastsCollection);
  return res;
};
/* ------------------------------------------- */
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
/* ------------------------------------------- */
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
/* ------------------------------------------- */
export const getLastChapter = async (firebaseid) => {
  const chapter = await lastsCollection.doc(firebaseid).get();
  return chapter.exists ? chapter.data() : null;
};
///////////////////////// ---- LASTUPLOADS FONKSİYONLARI ---- /////////////////////////
///////////////////////// ---- FAVORILER FONKSİYONLARI ---- /////////////////////////
export const getFavoriteMangas = async (userid) => {
  const mangasSnapshot = await usersCollection
    .doc(userid)
    .collection("library")
    .doc("favorites")
    .get();
  const mangas = mangasSnapshot.data().mangas;
  let favmangas = [];
  for (let mangaRef of mangas) {
    const mangaDoc = await mangaRef.get(); // Belge referansını al ve verisini çek
    favmangas.push(mangaDoc.data());
  }
  return favmangas;
};
/* ------------------------------------------- */
export const likeManga = async (userid, mangaid) => {
  const mangasSnapshot = await usersCollection
    .doc(userid)
    .collection("library")
    .doc("favorites")
    .get();
  const mangas = mangasSnapshot.data().mangas;
  mangas.push(db.doc(`/mangas/${mangaid}`));
  await usersCollection
    .doc(userid)
    .collection("library")
    .doc("favorites")
    .update({
      chapters: mangasSnapshot.data().chapters,
      mangas: mangas,
      panels: mangasSnapshot.data().panels,
    });
};
/* ------------------------------------------- */
export const unlikeManga = async (userid, mangaid) => {
  const mangasSnapshot = await usersCollection
    .doc(userid)
    .collection("library")
    .doc("favorites")
    .get();
  let mangas = mangasSnapshot.data().mangas;
  mangas.splice(
    mangas.indexOf(mangas.find((x) => x == db.doc(`/mangas/${mangaid}`))),
    1
  );
  await usersCollection
    .doc(userid)
    .collection("library")
    .doc("favorites")
    .update({
      chapters: mangasSnapshot.data().chapters,
      mangas: mangas,
      panels: mangasSnapshot.data().panels,
    });
};
/* ------------------------------------------- */
export const checkMangaInFavorites = async (userid, mangaid) => {
  const mangasSnapshot = await usersCollection
    .doc(userid)
    .collection("library")
    .doc("favorites")
    .get();
  const mangas = mangasSnapshot.data().mangas;
  return mangas.some(
    async (x) =>
      (await x.get()).data().mangaid ==
      (await mangasCollection.doc(mangaid).get()).data().mangaid
  );
};
///////////////////////// ---- FAVORILER FONKSİYONLARI ---- /////////////////////////
///////////////////////// ---- KULLANICI FONKSİYONLARI ---- /////////////////////////
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
    .doc("favorites")
    .set({
      chapters: [],
      mangas: [], //güncellenirken türü Referans olarak belirlenmeli ve işaret edilmeli
      panels: [],
    });
  await usersCollection
    .doc(await getIDByEmail(user.email))
    .collection("library")
    .doc("collection")
    .set({
      liked: [],
      lists: [],
    });
  return a;
};
/* ------------------------------------------- */
export const getUser = async (email) => {
  const user = await usersCollection.where("email", "==", String(email)).get();
  return user.empty
    ? null
    : (await usersCollection.doc(user.docs[0].id).get()).data();
};
/* ------------------------------------------- */
export const getUsersCount = async () => {
  const res = await getCountFromServer(usersCollection);
  return res;
};
/* ------------------------------------------- */
export const getIDByEmail = async (email) => {
  const user = await usersCollection.where("email", "==", String(email)).get();
  return user.empty ? null : user.docs[0].id;
};
/* ------------------------------------------- */
export const getUserByID = async (id) => {
  const user = await usersCollection.doc(id).get();
  return user.exists ? user.data() : null;
};
/* ------------------------------------------- */
export const checkUser = async (form) => {
  const user = await usersCollection
    .where("email", "==", String(form.email))
    .get();
  if (user.empty == true) {
    return true;
  } else if (
    (bcrypt.compare(
      form.password,
      (await usersCollection.doc(user.docs[0].id).get()).data().password
    ),
    (err, result) => result)
  ) {
    return false;
  } else {
    return true;
  }
};
/* ------------------------------------------- */
export const updateUser = (id, user) => {
  return usersCollection.doc(id).update(user);
};
/* ------------------------------------------- */
export const deleteUser = (id) => {
  return usersCollection.doc(id).delete();
};
///////////////////////// ---- KULLANICI FONKSİYONLARI ---- /////////////////////////
///////////////////////// ---- LİSTE FONKSİYONLARI ---- /////////////////////////
export const getListsById = async (userid) => {
  return (
    await usersCollection
      .doc(userid)
      .collection("library")
      .doc("collection")
      .get()
  ).data().lists;
};
/* ------------------------------------------- */
export const getUsersLikedList = async (userid, listid) => {
  let col = (
    await usersCollection
      .doc(userid)
      .collection("library")
      .doc("collection")
      .get()
  ).data();
  let list = col["lists"].find((x) => x.id == listid);
  return list;
};
/* ------------------------------------------- */
export const isUserLikedTheList = async (userid, listid) => {
  let col = (
    await usersCollection
      .doc(userid)
      .collection("library")
      .doc("collection")
      .get()
  ).data();
  let list = col["liked"].some((x) => x.listid == listid);
  return list;
};
/* ------------------------------------------- */
export const removeMangaFromList = async (userid, mangaid, listid) => {
  //status denilen şey manganın kitaplıkta hangi durumda bulunduğu; reading, onhold, dropped gibi...
  let col = (
    await usersCollection
      .doc(userid)
      .collection("library")
      .doc("collection")
      .get()
  ).data();
  let colnew = col["lists"]
    .find((x) => x.id == listid)
    ["series"].splice(
      col["lists"].find((x) => x.id == listid)["series"].indexOf(mangaid),
      1
    );
  await usersCollection
    .doc(userid)
    .collection("library")
    .doc("collection")
    .update(col);
};
/* ------------------------------------------- */
export const deleteList = async (userid, listid) => {
  let col = (
    await usersCollection
      .doc(userid)
      .collection("library")
      .doc("collection")
      .get()
  ).data();
  let count = (await usersCollection.doc(userid).get()).data();
  let countnew = (count["lists"] -= 1);
  let colnew = col["lists"].splice(
    col["lists"].indexOf(
      col["lists"].find((x) => x.id == listid),
      1
    )
  );
  await usersCollection
    .doc(userid)
    .collection("library")
    .doc("collection")
    .update(col);
  await usersCollection.doc(userid).update(count);
};
/* ------------------------------------------- */
export const updateList = async (userid, listid, desc, title) => {
  let col = (
    await usersCollection
      .doc(userid)
      .collection("library")
      .doc("collection")
      .get()
  ).data();
  if (desc) col["lists"].find((x) => x.id == listid).title = title;
  if (title) col["lists"].find((x) => x.id == listid).description = desc;
  await usersCollection
    .doc(userid)
    .collection("library")
    .doc("collection")
    .update(col);
};
/* ------------------------------------------- */
export const addMangaToList = async (userid, listid, mangaid) => {
  let col = (
    await usersCollection
      .doc(userid)
      .collection("library")
      .doc("collection")
      .get()
  ).data();
  let seriesnew = col["lists"].find((x) => x.id == listid)["series"][0]
    ? col["lists"].find((x) => x.id == listid)["series"].push(mangaid)
    : (col["lists"].find((x) => x.id == listid)["series"][0] = mangaid);
  await usersCollection
    .doc(userid)
    .collection("library")
    .doc("collection")
    .update(col);
};
/* ------------------------------------------- */
export const getListById = async (userid, listid) => {
  let col = (
    await usersCollection
      .doc(userid)
      .collection("library")
      .doc("collection")
      .get()
  ).data();
  return col["lists"].find((x) => x.id == listid);
};
/* ------------------------------------------- */
export const createList = async (userid, desc, title) => {
  let col = (
    await usersCollection
      .doc(userid)
      .collection("library")
      .doc("collection")
      .get()
  ).data();
  let count = (await usersCollection.doc(userid).get()).data();
  let countnew = (count["lists"] += 1);
  let listnew = col["lists"].push({
    description: desc ? desc : "",
    id: self.crypto.randomUUID(),
    likes: 0,
    series: [null],
    title: title ? title : "Listem",
  });
  await usersCollection
    .doc(userid)
    .collection("library")
    .doc("collection")
    .update(col);
  await usersCollection.doc(userid).update(count);
};
/* ------------------------------------------- */
export const likeList = async (userid, authorid, listid) => {
  let coluser = (
    await usersCollection
      .doc(userid)
      .collection("library")
      .doc("collection")
      .get()
  ).data();
  let colauthor = (
    await usersCollection
      .doc(authorid)
      .collection("library")
      .doc("collection")
      .get()
  ).data();
  colauthor["lists"].find((x) => x.id == listid)["likes"].push(userid);
  coluser["liked"].push([
    {
      userid: authorid,
      listid: listid,
    },
  ]);
  await usersCollection
    .doc(authorid)
    .collection("library")
    .doc("collection")
    .update(colauthor);
  await usersCollection
    .doc(userid)
    .collection("library")
    .doc("collection")
    .update(coluser);
};
/* ------------------------------------------- */
export const unlikeList = async (userid, authorid, listid) => {
  let coluser = (
    await usersCollection
      .doc(userid)
      .collection("library")
      .doc("collection")
      .get()
  ).data();
  let colauthor = (
    await usersCollection
      .doc(authorid)
      .collection("library")
      .doc("collection")
      .get()
  ).data();
  let colauthornew = colauthor["lists"]
    .find((x) => x.id == listid)
    ["likes"].splice(
      colauthor["lists"].find((x) => x.id == listid)["likes"].indexOf(userid),
      1
    );
  let colusernew = coluser["liked"].splice(
    coluser["liked"].indexOf([{ userid: authorid, listid: listid }]),
    1
  );
  await usersCollection
    .doc(authorid)
    .collection("library")
    .doc("collection")
    .update(colauthor);
  await usersCollection
    .doc(userid)
    .collection("library")
    .doc("collection")
    .update(coluser);
};
///////////////////////// ---- LİSTE FONKSİYONLARI ---- /////////////////////////
