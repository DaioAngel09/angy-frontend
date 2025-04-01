import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../config/firebaseConfig"; // 🔹 Certifique-se que está importando corretamente!

// ✅ Obtém o nível de acesso do usuário
export const getUserRole = async (uid) => {
  if (!uid) return null;

  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);

  return userSnap.exists() ? userSnap.data().role : null;
};

// ✅ Monitora usuário autenticado
export const monitorarUsuario = (callback) => {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const role = await getUserRole(user.uid);
      callback({ ...user, role });
    } else {
      callback(null);
    }
  });
};

// ✅ Logout
export const logout = async () => {
  try {
    await signOut(auth);
    localStorage.removeItem("userToken");
    window.location.href = "/"; // Redireciona para a página de login
  } catch (error) {
    console.error("Erro ao fazer logout:", error);
  }
};
