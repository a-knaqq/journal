import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signIn, signUp } from "../utils/authService";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      const session = await signIn(email, password);
      if (session && typeof session.AccessToken !== "undefined") {
        sessionStorage.setItem("accessToken", session.AccessToken);
        window.location.href = "/home";
      } else {
        console.error("Session token was not set properly.");
      }
    } catch (error) {
      alert(`Sign in failed: ${error}`);
    }
  };

  const handleSignUp = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      await signUp(email, password);
      navigate("/confirm", { state: { email, password } });
    } catch (error) {
      alert(`Sign up failed: ${error}`);
    }
  };

  return (
    <div className="bg-zinc-900 w-full flex items-center justify-center min-h-screen">
      <div className="bg-zinc-800 p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-gray-200 text-2xl font-bold mb-4 text-center">
          Welcome
        </h1>
        <h4 className="text-gray-400 text-lg mb-6 text-center">
          {isSignUp
            ? "Sign up to create an account"
            : "Sign in to your account"}
        </h4>
        <form onSubmit={isSignUp ? handleSignUp : handleSignIn} className="space-y-4">
          <div>
            <input
              className="inputText w-full p-3 rounded bg-zinc-700 text-gray-200 placeholder-gray-400"
              id="email"
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
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
          </div>
          {isSignUp && (
            <div>
              <input
                className="inputText w-full p-3 rounded bg-zinc-700 text-gray-200 placeholder-gray-400"
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                required
              />
            </div>
          )}
          <div className="flex items-center justify-center">
            <button
              type="submit"
              className="bg-gray-600 text-gray-200 py-2 px-4 rounded"
            >
              {isSignUp ? "Sign Up" : "Sign In"}
            </button>
          </div>
        </form>
        <button
          type="button"
          className="mt-4 text-sm text-gray-400 hover:text-gray-200 w-full text-center"
          onClick={() => setIsSignUp(!isSignUp)}
        >
          {isSignUp
            ? "Already have an account? Sign In"
            : "Need an account? Sign Up"}
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
