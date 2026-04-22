import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    try {
      const token = searchParams.get("token");
      const encodedUser = searchParams.get("user");

      if (!token || !encodedUser) {
        throw new Error("Missing token or user data");
      }

      // Decode user data from base64
      const userData = JSON.parse(
        atob(encodedUser)
      );

      // Store in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));

      // Redirect to dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error("Auth callback error:", error);
      // Redirect to login on error
      navigate("/login?error=auth_failed");
    }
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Completing login...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
