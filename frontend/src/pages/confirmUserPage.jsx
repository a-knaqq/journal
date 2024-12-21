import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ConfirmUserPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || "");
  const [confirmationCode, setConfirmationCode] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("https://jbxxsxsgb0.execute-api.us-east-1.amazonaws.com/dev/auth", {
        method: "POST",
        headers: {
          "Content-Type": "*",
          "Accept":"*",
          "Access-Control-Allow-Origin":"*",
        },
        body: JSON.stringify({
          action: "confirmSignUp",
          username: email,
          code: confirmationCode,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to confirm account");
      }

      const result = await response.json();
      alert("Account confirmed successfully!\nSign in on next page.");
      navigate("/login");
    } catch (error) {
      alert(`Failed to confirm account: ${error.message}`);
    }
  };

  return (
    <div className="loginForm">
      <h2>Confirm Account</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            className="inputText"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
        </div>
        <div>
          <input
            className="inputText"
            type="text"
            value={confirmationCode}
            onChange={(e) => setConfirmationCode(e.target.value)}
            placeholder="Confirmation Code"
            required
          />
        </div>
        <button type="submit">Confirm Account</button>
      </form>
    </div>
  );
};

export default ConfirmUserPage;
