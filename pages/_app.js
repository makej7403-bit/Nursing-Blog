// pages/_app.js
import "../styles/globals.css";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firebase";
import Layout from "../components/Layout";

export default function MyApp({ Component, pageProps }) {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => setUser(u));
    return () => unsub();
  }, []);
  return (
    <Layout user={user}>
      <Component {...pageProps} user={user} />
    </Layout>
  );
}
