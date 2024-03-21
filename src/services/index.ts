import axios, { type AxiosResponse } from "axios";
import { collection, getDocs, setDoc, doc, addDoc } from "firebase/firestore";
import { db } from "@/utils/firebase";

export interface Hospital {
  id: string;
  name: string;
  address: string;
  phoneNumber: string;
  email?: string;
  state: string;
  provider: string;
  userId: string;
}

export const getAllHospitals = async () => {
  const querySnapshot = await getDocs(collection(db, "hospitals"));
  querySnapshot.forEach((doc) => {
    console.log(doc.id, " => ", doc.data());
  });
};

export const createHospital = async (data: Hospital) => {
  try {
    await setDoc(doc(db, "hospitals", data.userId), data);
  } catch (error) {
    console.log(error);
  }
};

export const createUser = async (data: {
  userId: string;
  firstName: string;
  lastName: string;
}) => {
  try {
    await setDoc(doc(db, "users", data.userId), { ...data, hospitals: {} });
  } catch (error) {
    console.log(error);
  }
};