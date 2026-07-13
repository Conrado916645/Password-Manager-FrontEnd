import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Lock, ArrowRight, AlertCircle, Loader2 } from "lucide-react";
import { AuthService } from "../api/services";
import TOTPEntryModel from "../components/TOTPEntryModal";

export default function Login() {
  const navigate = useNavigate();

  // Standard Login State
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // MFA State
  const [showMfa, setShowMfa] = useState(false);
  const [mfaToken, setMfaToken] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Assuming AuthService.login returns the API response data
      const response = await AuthService.login(credentials);

      // Check if the backend returned an MFA token instead of an access token
      if (response && response.mfa_token) {
        setMfaToken(response.mfa_token); // Store the temp token
        setShowMfa(true); // Trigger the TOTP modal
      } else {
        // Standard login successful (no MFA enabled for this user)
        navigate("/home");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.detail ||
          "Invalid username or password. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  // Handler for when the user submits the 6-digit code inside the Modal
  const handleMfaVerify = async (code: string) => {
    // Calling the new verify method inside your AuthService
    await AuthService.verifyMfa({ mfa_token: mfaToken, code: code });

    // If it doesn't throw an error, MFA succeeded!
    setShowMfa(false);
    navigate("/home");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 dark:bg-[#0A0F1D] text-slate-900 dark:text-white transition-colors duration-300">
      <div className="w-full max-w-md bg-white dark:bg-[#111620] p-10 lg:p-12 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl dark:shadow-2xl transition-colors duration-300">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Welcome Back
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Sign in to access Infra-Sentinel.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {error && (
            <div className="flex items-center gap-3 p-4 text-sm text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800/50">
              <AlertCircle size={18} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label
              htmlFor="username"
              className="text-xs font-bold text-slate-600 dark:text-slate-500 uppercase tracking-wider"
            >
              Username
            </label>
            <div className="relative">
              <User
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                size={20}
              />
              <input
                type="text"
                id="username"
                name="username"
                required
                value={credentials.username}
                onChange={handleChange}
                placeholder="admin_user"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-[#0A0F1D] border border-slate-300 dark:border-slate-800 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-900 dark:text-white transition-all"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="text-xs font-bold text-slate-600 dark:text-slate-500 uppercase tracking-wider"
              >
                Password
              </label>
            </div>
            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                size={20}
              />
              <input
                type="password"
                id="password"
                name="password"
                required
                value={credentials.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-[#0A0F1D] border border-slate-300 dark:border-slate-800 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-900 dark:text-white transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold transition-all disabled:opacity-70 disabled:cursor-not-allowed group"
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <>
                Sign In
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </>
            )}
          </button>
        </form>
      </div>

      {/* MFA Modal Rendered Conditionally */}
      {showMfa && (
        <TOTPEntryModel
          onClose={() => {
            setShowMfa(false);
            setMfaToken("");
          }}
          onSuccess={handleMfaVerify}
        />
      )}
    </div>
  );
}
