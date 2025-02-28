import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { confirmSignUp, signIn } from "../utils/authService";

const ConfirmUserPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || "");
  const [confirmationCode, setConfirmationCode] = useState("");
  const [password, setPassword] = useState(location.state?.password || "");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await confirmSignUp(email, confirmationCode);
      const session = await signIn(email, password);
      if (session && session.AccessToken) {
        sessionStorage.setItem("accessToken", session.AccessToken);
        alert("Account confirmed and signed in successfully!");
        navigate("/home");
      }
    } catch (error) {
      alert(`Failed to confirm account or sign in: ${error}`);
    }
  };

  return (
    <div className="bg-zinc-900 w-full flex items-center justify-center min-h-screen">
      <div className="bg-zinc-800 p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-gray-200 text-2xl font-bold mb-6 text-center">
          Confirm Account
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              className="inputText w-full p-3 rounded bg-zinc-700 text-gray-200 placeholder-gray-400"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
          </div>
          <div>
            <input
              className="inputText w-full p-3 rounded bg-zinc-700 text-gray-200 placeholder-gray-400"
              type="text"
              value={confirmationCode}
              onChange={(e) => setConfirmationCode(e.target.value)}
              placeholder="Confirmation Code"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-gray-600 text-gray-200 py-2 px-4 rounded w-full"
          >
            Confirm Account
          </button>
        </form>
      </div>
    </div>
  );
};

export default ConfirmUserPage;
