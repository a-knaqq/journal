import React, { useState } from "react";

const NotificationsPage = () => {
  const [message, setMessage] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const isValidPhone = (number) => /^\+?1?\d{10}$/.test(number.replace(/\D/g, ""));

  const handleSendCode = async () => {
    setError("");
    const cleaned = phoneNumber.replace(/\D/g, "");

    if (!isValidPhone(cleaned)) {
      setError("Enter a valid 10-digit US phone number.");
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/send-verification-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: `+1${cleaned}` }),
      });

      if (!res.ok) throw new Error("Failed to send code");

      setCodeSent(true);
    } catch (err) {
      console.error(err);
      setError("Error sending verification code.");
    }
  };

  const handleVerifyCode = async () => {
    setError("");
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/verify-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: `+1${phoneNumber.replace(/\D/g, "")}`, code: verificationCode }),
      });

      if (!res.ok) throw new Error("Invalid code");

      setIsPhoneVerified(true);
    } catch (err) {
      setError("Verification failed. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!isPhoneVerified) {
      setError("You must verify your phone number first.");
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/notifications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          phoneNumber: `+1${phoneNumber.replace(/\D/g, "")}`,
          scheduledTime: scheduleTime,
        }),
      });

      if (!res.ok) throw new Error("Failed to schedule");

      setSuccess(true);
      setMessage("");
      setScheduleTime("");
    } catch (err) {
      setError("Could not schedule notification.");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="bg-zinc-800 p-6 rounded-xl w-full max-w-md space-y-4 shadow">
        <h1 className="text-2xl font-bold text-center text-yellow-400">Schedule a Notification</h1>

        {/* PHONE INPUT */}
        <label>
          <span className="text-sm">Phone Number</span>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full mt-1 p-2 rounded bg-zinc-700 text-white border border-zinc-600"
            placeholder="e.g. 5551234567"
          />
        </label>

        {!isPhoneVerified && (
          <>
            {!codeSent ? (
              <button
                type="button"
                onClick={handleSendCode}
                className="bg-blue-500 w-full py-2 rounded hover:bg-blue-600"
              >
                Send Verification Code
              </button>
            ) : (
              <>
                <label className="block">
                  <span className="text-sm">Enter 6-digit Code</span>
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    maxLength={6}
                    className="w-full mt-1 p-2 rounded bg-zinc-700 text-white border border-zinc-600"
                  />
                </label>
                <button
                  type="button"
                  onClick={handleVerifyCode}
                  className="bg-green-500 w-full py-2 rounded hover:bg-green-600"
                >
                  Verify Code
                </button>
              </>
            )}
          </>
        )}

        {/* ONLY SHOW REST IF VERIFIED */}
        {isPhoneVerified && (
          <>
            <label>
              <span className="text-sm">Message</span>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                placeholder="What's your reminder?"
                className="w-full mt-1 p-2 rounded bg-zinc-700 text-white border border-zinc-600"
              />
            </label>

            <label>
              <span className="text-sm">Schedule Time</span>
              <input
                type="datetime-local"
                value={scheduleTime}
                onChange={(e) => setScheduleTime(e.target.value)}
                className="w-full mt-1 p-2 rounded bg-zinc-700 text-white border border-zinc-600"
              />
            </label>

            <button
              type="submit"
              className="bg-yellow-500 hover:bg-yellow-600 w-full py-2 rounded text-black font-semibold"
            >
              Schedule Notification
            </button>
          </>
        )}

        {error && <p className="text-red-400 text-sm">{error}</p>}
        {success && <p className="text-green-400 text-sm">Notification scheduled successfully!</p>}
      </form>
    </div>
  );
};

export default NotificationsPage;
