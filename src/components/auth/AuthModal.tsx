import React, { useState } from "react";
import { useMugenzi } from "../../context/MugenziContext";
import { AuthMethod } from "../../types/domain";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { loginWithMethod, userProfile } = useMugenzi();

  const [authMode, setAuthMode] = useState<"signin" | "register">("signin");
  const [phoneNumber, setPhoneNumber] = useState("0788 123 456");
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otpCode, setOtpCode] = useState("");

  if (!isOpen) return null;

  const handleGoogleAuth = () => {
    setIsLoading(true);
    setTimeout(() => {
      loginWithMethod("google", "j.mugisha@gmail.com");
      setIsLoading(false);
      onClose();
    }, 600);
  };

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showOtpInput) {
      setShowOtpInput(true);
    } else {
      setIsLoading(true);
      setTimeout(() => {
        loginWithMethod("phone", `+250 ${phoneNumber}`);
        setIsLoading(false);
        onClose();
      }, 600);
    }
  };

  const handleStandardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      loginWithMethod("email", emailOrPhone || "j.mugisha@gmail.com");
      setIsLoading(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 md:p-8 shadow-2xl relative animate-in fade-in zoom-in-95 border border-[#e1e3e4]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-8 h-8 rounded-full hover:bg-[#f3f4f5] flex items-center justify-center text-[#434653]"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        {/* Brand Header matching Stitch Design */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-14 h-14 bg-[#dae2ff] text-[#00327d] rounded-2xl mx-auto flex items-center justify-center font-black text-xl shadow-sm">
            <span className="material-symbols-outlined text-3xl">explore</span>
          </div>
          <h2 className="font-display font-extrabold text-2xl text-[#00327d]">
            Welcome to Mugenzi
          </h2>
          <p className="text-xs text-[#434653]">
            Your trusted digital companion for everyday Rwandan citizen services.
          </p>
        </div>

        {/* Social Auth Buttons matching Stitch Design */}
        <div className="space-y-3 mb-6">
          {/* Google Button */}
          <button
            onClick={handleGoogleAuth}
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-xl border border-[#e1e3e4] hover:bg-[#f8f9fa] flex items-center justify-center gap-3 text-sm font-semibold text-[#191c1d] transition-all shadow-sm active:scale-95"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Phone SMS Auth with Rwanda +250 */}
          {!showOtpInput ? (
            <button
              onClick={() => setShowOtpInput(true)}
              className="w-full py-3 px-4 rounded-xl bg-[#00327d] hover:bg-[#0047ab] text-white flex items-center justify-center gap-3 text-sm font-semibold transition-all shadow-md shadow-[#00327d]/20 active:scale-95"
            >
              <span className="material-symbols-outlined text-lg">phone_iphone</span>
              <span>Continue with Rwandan Phone Number</span>
            </button>
          ) : (
            <form onSubmit={handlePhoneSubmit} className="space-y-3 p-4 bg-[#f8f9fa] rounded-2xl border border-[#e1e3e4]">
              <div className="text-xs font-bold text-[#00327d] uppercase tracking-wider">
                Rwanda SMS OTP Verification
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#434653] bg-white px-2.5 py-2 rounded-xl border border-[#e1e3e4]">
                  🇷🇼 +250
                </span>
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="788 123 456"
                  className="flex-1 text-sm font-bold p-2 bg-white border border-[#e1e3e4] rounded-xl focus:ring-2 focus:ring-[#00327d] focus:outline-none"
                />
              </div>

              <div>
                <input
                  type="text"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="Enter 6-digit OTP code (e.g. 554921)"
                  className="w-full text-sm font-bold p-2 bg-white border border-[#e1e3e4] rounded-xl focus:ring-2 focus:ring-[#00327d] focus:outline-none text-center tracking-widest"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#00327d] text-white font-bold py-2 rounded-xl text-xs hover:bg-[#0047ab]"
              >
                {isLoading ? "Verifying..." : "Confirm & Sign In"}
              </button>
            </form>
          )}
        </div>

        {/* Divider matching Stitch Design */}
        <div className="relative flex items-center justify-center my-4">
          <div className="border-t border-[#e1e3e4] w-full" />
          <span className="bg-white px-3 text-xs font-semibold text-[#737784] uppercase tracking-wider absolute">
            OR
          </span>
        </div>

        {/* Standard Email / Phone Form */}
        <form onSubmit={handleStandardSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-[#434653] uppercase tracking-wider mb-1">
              Phone or Email
            </label>
            <input
              type="text"
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              placeholder="e.g. 0788123456 or citizen@rwanda.gov"
              className="w-full p-3 bg-[#f8f9fa] border border-[#e1e3e4] rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#00327d] focus:outline-none"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-[#434653] uppercase tracking-wider">
                Password
              </label>
              <a href="#forgot" className="text-xs font-semibold text-[#00327d] hover:underline">
                Forgot password?
              </a>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full p-3 bg-[#f8f9fa] border border-[#e1e3e4] rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#00327d] focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-[#00327d] hover:bg-[#0047ab] text-white rounded-xl font-bold text-sm shadow-md shadow-[#00327d]/20 transition-all active:scale-95"
          >
            {isLoading ? "Signing in..." : authMode === "signin" ? "Sign In" : "Register Citizen Account"}
          </button>
        </form>

        {/* Switch mode */}
        <div className="mt-6 text-center text-xs text-[#434653]">
          {authMode === "signin" ? (
            <span>
              Don't have a Mugenzi account?{" "}
              <button
                onClick={() => setAuthMode("register")}
                className="font-bold text-[#00327d] hover:underline"
              >
                Register
              </button>
            </span>
          ) : (
            <span>
              Already registered?{" "}
              <button
                onClick={() => setAuthMode("signin")}
                className="font-bold text-[#00327d] hover:underline"
              >
                Sign In
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
