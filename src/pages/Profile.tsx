import { useState, useEffect } from "react";
import { User, Shield, Key, Calendar, Clock, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { UserService } from "../api/services";

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await UserService.getMe();
        setUser(data);
      } catch (error) {
        console.error("Failed to load profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  if (!user) {
    return <div className="text-center p-8 text-slate-500">Failed to load profile data.</div>;
  }

  const formatDate = (date: string) => new Date(date).toLocaleString();
  const permissions = user.permissions?.installed_apps || user.permissions || {};

  return (
    <div className="max-w-5xl mx-auto p-8 animate-fade-in">
      <h1 className="text-3xl font-bold mb-8 dark:text-white flex items-center gap-3">
        <User className="text-blue-600" size={32} /> My Profile
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Identity & Security */}
        <div className="space-y-8">
          {/* Identity Card */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-center">
            <div className="h-24 w-24 bg-blue-600/10 rounded-full flex items-center justify-center text-blue-600 font-bold text-4xl uppercase mx-auto mb-4">
              {user.username.substring(0, 2)}
            </div>
            <h2 className="text-2xl font-bold dark:text-white">@{user.username}</h2>
            <p className="text-sm text-slate-500 mb-6 font-mono break-all">{user.id}</p>
            
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${user.is_active ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
              {user.is_active ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
              {user.is_active ? 'Account Active' : 'Account Disabled'}
            </div>
          </div>

          {/* Security Card */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="font-bold flex items-center gap-2 dark:text-white mb-4"><Key size={20} className="text-amber-500"/> Security</h3>
            <button 
              onClick={() => setShowPasswordModal(true)}
              className="w-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white py-3 rounded-xl font-bold transition-colors"
            >
              Change Password
            </button>
          </div>
        </div>

        {/* Right Column: Details & Permissions */}
        <div className="md:col-span-2 space-y-8">
          
          {/* Account Details */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="font-bold flex items-center gap-2 dark:text-white mb-6"><Calendar size={20} className="text-blue-500"/> Account Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-slate-500 mb-1 flex items-center gap-2"><Calendar size={14}/> Member Since</p>
                <p className="font-medium dark:text-white">{formatDate(user.created_at)}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1 flex items-center gap-2"><Clock size={14}/> Last Updated</p>
                <p className="font-medium dark:text-white">{formatDate(user.updated_at)}</p>
              </div>
              <div className="sm:col-span-2 border-t dark:border-slate-800 pt-4 mt-2">
                <p className="text-sm text-slate-500 mb-1 flex items-center gap-2"><Clock size={14}/> Last Login</p>
                <p className="font-medium dark:text-white">{user.last_login_at ? formatDate(user.last_login_at) : 'First Login'}</p>
              </div>
            </div>
          </div>

          {/* Read-Only Permissions List */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="font-bold flex items-center gap-2 dark:text-white mb-6"><Shield size={20} className="text-emerald-500"/> My Permissions</h3>
            
            {Object.keys(permissions).length === 0 ? (
              <p className="text-slate-500 text-sm italic">No special permissions assigned.</p>
            ) : (
              <div className="space-y-4">
                {Object.entries(permissions).map(([app, actions]: [string, any]) => (
                  <div key={app} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 gap-3">
                    <span className="font-bold capitalize dark:text-white">{app}</span>
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(actions) && actions.map((action: string) => (
                        <span key={action} className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 font-medium">
                          {action}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}