"use client";

import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import Trading from "./components/Trading";
import "./index.css";
import Earn from "./pages/Earn";
import Tournaments from "./pages/Tournaments";
import Layout from "./Layout/Public";

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/" replace />} />
          <Route path="/" index element={<Trading />} />
          <Route path="/earn" element={<Earn />} />
          <Route path="/tournaments" element={<Tournaments />} />
        </Routes>
      </Layout>
    </Router>
  );
}
