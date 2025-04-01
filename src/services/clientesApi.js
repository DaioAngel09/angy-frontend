import { db } from "../config/firebaseConfig";
import { collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";

// 🔹 Buscar clientes
export const getClientes = async () => {
  const querySnapshot = await getDocs(collection(db, "clientes"));
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// 🔹 Adicionar cliente
export const adicionarCliente = async (cliente) => {
  const docRef = await addDoc(collection(db, "clientes"), cliente);
  return { id: docRef.id, ...cliente };
};

// 🔹 Remover cliente
export const removerCliente = async (id) => {
  await deleteDoc(doc(db, "clientes", id));
};
