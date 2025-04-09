import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAdminLogin from "../../../hooks/useAdminLogin";


export default function AdminPortal() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { loginAdmin, loading, error } = useAdminLogin();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter all fields", { position: "top-right" });
      return;
    }
    console.log("Attempting admin login with:", { email, password });
    await loginAdmin(email, password);
    // Navigation is handled in the hook
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#31473A]">
      <ToastContainer />
      <div className="bg-[#EEF4F2] rounded-2xl shadow-lg p-8 w-96">
        <h2 className="text-2xl font-semibold text-gray-900 text-left">Ace Brainiac</h2>
        <p className="text-sm text-gray-600 font-semibold text-left">Admin Portal</p>
        
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-700 text-sm font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full px-4 py-2 border rounded-md text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-green-700"
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="block text-gray-700 text-sm font-medium">Password</label>
              <div className="text-sm">
                <Link
                  to="/reset-password"
                  className="text-green-900 font-semibold hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="w-full px-4 py-2 border rounded-md text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-green-700"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#31473A] text-white py-2 rounded-md mt-4 hover:bg-[#4a6a57]"
            disabled={loading}
          >
            {loading ? "Logging in..." : "SUBMIT"}
          </button>
        </form>

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        
        <div className="flex items-center my-4">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-2 text-sm text-gray-500">or</span>
          <hr className="flex-grow border-gray-300" />
        </div>
        
        <div className="text-center text-sm text-gray-600">
          <p>
            <span className="font-semibold">Need help accessing your account?</span>{" "}
            <Link to="/contact-support" className="text-green-900 font-semibold hover:underline">
              Contact IT support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}