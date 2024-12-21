import { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("https://jbxxsxsgb0.execute-api.us-east-1.amazonaws.com/dev/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          action: "signIn",
          username: email,
          password,
        }),
      });

      if (!response.ok) {
        throw new Error("Sign in failed");
      }

      const session = await response.json();
      console.log("Sign in successful", session);
      if (session && session.AccessToken) {
        sessionStorage.setItem("accessToken", session.AccessToken);
        window.location.href = "/home";
      } else {
        console.error("Session token was not set properly.");
      }
    } catch (error) {
      alert(`Sign in failed: ${error.message}`);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      const response = await fetch("https://jbxxsxsgb0.execute-api.us-east-1.amazonaws.com/dev/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          action: "signUp",
          email,
          password,
        }),
      });

      if (!response.ok) {
        throw new Error("Sign up failed");
      }

      await response.json();
      navigate("/confirm", { state: { email } });
    } catch (error) {
      alert(`Sign up failed: ${error.message}`);
    }
  };

  return (
    <div className="loginForm">
      <h1>Welcome</h1>
      <h4>
        {isSignUp ? "Sign up to create an account" : "Sign in to your account"}
      </h4>
      <form onSubmit={isSignUp ? handleSignUp : handleSignIn}>
        <div>
          <input
            className="inputText"
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
            className="inputText"
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
              className="inputText"
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              required
            />
          </div>
        )}
        <button type="submit">{isSignUp ? "Sign Up" : "Sign In"}</button>
      </form>
      <button type="button" onClick={() => setIsSignUp(!isSignUp)}>
        {isSignUp
          ? "Already have an account? Sign In"
          : "Need an account? Sign Up"}
      </button>
    </div>
  );
};

export default LoginPage;
