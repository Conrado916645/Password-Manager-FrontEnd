import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Search, Loader2, AlertCircle } from "lucide-react";
import {
  UserRegistrationService,
  InstalledAppsService,
} from "../api/services";

export default function Register() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [availableApps, setAvailableApps] = useState<
    Record<string, string[]>
  >({});

  const [permissions, setPermissions] = useState<
    Record<string, string[]>
  >({});

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirm_password: "",
  });

  const [error, setError] = useState<string | null>(null);

  // ======================
  // LOAD INSTALLED APPS
  // ======================
  useEffect(() => {
    InstalledAppsService.getInstalledApps()
      .then((res: any) => {
        const apps = res?.installed_apps ?? res ?? {};
        setAvailableApps(apps);
      })
      .catch((err) => {
        console.error("Failed to load apps:", err);
        setError("Could not load application registry.");
      })
      .finally(() => setLoading(false));
  }, []);

  // ======================
  // FILTER APPS
  // ======================
  const filteredApps = useMemo(() => {
    return Object.entries(availableApps).filter(([app]) =>
      app.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, availableApps]);

  // ======================
  // TOGGLE PERMISSION
  // ======================
  const togglePermission = (app: string, action: string) => {
    setPermissions((prev) => {
      const current = prev[app] || [];

      const updated = current.includes(action)
        ? current.filter((a) => a !== action)
        : [...current, action];

      const newState = { ...prev, [app]: updated };

      if (updated.length === 0) {
        delete newState[app];
      }

      return newState;
    });
  };

  // ======================
  // VALIDATION STATE
  // ======================
  const isInvalid =
    !formData.username ||
    !formData.password ||
    !formData.confirm_password ||
    formData.password !== formData.confirm_password;

  // ======================
  // REGISTER HANDLER
  // ======================
  const handleRegister = async () => {
    setError(null);

    if (!formData.username || !formData.password || !formData.confirm_password) {
      setError("All fields are required.");
      return;
    }

    if (formData.password !== formData.confirm_password) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await UserRegistrationService.registerUser({
        username: formData.username,
        password: formData.password,
        confirm_password: formData.confirm_password,
        permissions,
      });

      navigate("/users");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Registration failed.");
    }
  };

  // ======================
  // LOADING STATE
  // ======================
  if (loading)
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-[#0A0F1D]">
        <Loader2 className="animate-spin text-blue-500" size={32} />
      </div>
    );

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 dark:bg-[#0A0F1D]">
      <div className="w-full max-w-2xl bg-white dark:bg-[#111620] p-12 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl">

        <h1 className="text-3xl font-bold text-center mb-2">
          Account Registration
        </h1>

        <p className="text-center text-slate-500 mb-8">
          Provision new infrastructure access.
        </p>

        {/* ERROR */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-500 text-sm flex items-center gap-2">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        {/* INPUTS */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <input
            placeholder="Username"
            className="col-span-2 p-3 bg-slate-50 dark:bg-[#0A0F1D] border rounded-xl"
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
          />

          <input
            type="password"
            placeholder="Password"
            className="p-3 bg-slate-50 dark:bg-[#0A0F1D] border rounded-xl"
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />

          <input
            type="password"
            placeholder="Confirm"
            className="p-3 bg-slate-50 dark:bg-[#0A0F1D] border rounded-xl"
            onChange={(e) =>
              setFormData({ ...formData, confirm_password: e.target.value })
            }
          />
        </div>

        {/* ASSIGNED ACCESS PREVIEW */}
        {Object.keys(permissions).length > 0 && (
          <div className="mb-6 p-4 rounded-xl border border-blue-500/30 bg-blue-500/5">
            <h3 className="text-sm font-bold mb-2 text-blue-500">
              Assigned App Access
            </h3>

            {Object.entries(permissions).map(([app, actions]) => (
              <div key={app} className="text-xs">
                <span className="font-bold capitalize">{app}:</span>{" "}
                <span className="text-slate-400">
                  {actions.join(", ")}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* SEARCH */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-3 text-slate-400" size={16} />
          <input
            placeholder="Search apps..."
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 p-2.5 border rounded-xl text-sm"
          />
        </div>

        {/* APPS LIST */}
        <div className="h-[320px] overflow-y-auto space-y-3 pr-2">
          {filteredApps.map(([app, actions]) => (
            <div
              key={app}
              className={`p-4 rounded-2xl border ${
                permissions[app]
                  ? "bg-blue-500/5 border-blue-500/30"
                  : "bg-slate-50 dark:bg-[#0A0F1D] border-slate-200"
              }`}
            >
              <h4 className="font-bold capitalize text-sm mb-3">{app}</h4>

              <div className="flex gap-2 flex-wrap">
                {actions.map((action) => (
                  <button
                    key={action}
                    type="button"
                    onClick={() => togglePermission(app, action)}
                    className={`px-3 py-1 text-[10px] font-bold uppercase rounded-full border ${
                      permissions[app]?.includes(action)
                        ? "bg-blue-600 text-white border-blue-600"
                        : "border-slate-700 text-slate-500"
                    }`}
                  >
                    {action}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* SUBMIT */}
        <button
          onClick={handleRegister}
          disabled={isInvalid}
          className={`w-full mt-6 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
            isInvalid
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          Create Account <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}