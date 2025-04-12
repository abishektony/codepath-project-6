// src/components/Sidebar.jsx
import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <nav style={{ padding: "10px 0" }}>
      <Link to="/" style={{ color: "white", marginRight: "20px" }}>
        Home
      </Link>
    </nav>
  );
}
