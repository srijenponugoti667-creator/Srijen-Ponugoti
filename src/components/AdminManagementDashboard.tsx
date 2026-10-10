import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { FinancialDashboard } from './admin/FinancialDashboard';
import { SubscriptionManagement } from './admin/SubscriptionManagement';
import {
  ShieldCheck,
  UserPlus,
  CheckCircle2,
  XCircle,
  Trash2,
  Users,
  RotateCcw,
  Lock,
  ExternalLink,
  RefreshCw,
  Award,
  AlertTriangle,
  KeyRound,
  Mail,
  LogOut,
  Scale
} from 'lucide-react';

interface LawyerVerificationRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  barCouncilNumber: string;
  stateBarCouncil: string;
  location: string;
  experienceYears: number;
  isVerified: boolean;
  verificationStatus: 'pending' | 'approved' | 'rejected' | 'verified';
  verifiedBy: string | null;
  verifiedAt: string | null;
}

interface TeamMemberRecord {
  email: string;
  name: string;
  role: 'admin' | 'team_member';
  addedAt: string;
}

interface AdminManagementDashboardProps {
  currentUser: User;
  onStaffLoginSuccess?: (user: User) => void;
  onExitPortal?: () => void;
}

export const AdminManagementDashboard: React.FC<AdminManagementDashboardProps> = ({
  currentUser,
  onStaffLoginSuccess,
  onExitPortal
}) => {
  const [staffUser, setStaffUser] = useState<User | null>(() => {
    if (currentUser.role === 'admin' || currentUser.role === 'team_member') {
      return currentUser;
    }
    return null;
  });

  // Standalone Portal Login Form State
  const [loginEmail, setLoginEmail] = useState('srijenponugoti667@gmail.com');
  const [loginPassword, setLoginPassword] = useState('');
  const [isSettingFirstPassword, setIsSettingFirstPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Dashboard State
  const [lawyers, setLawyers] = useState<LawyerVerificationRecord[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMemberRecord[]>([]);
  const [newTeamEmail, setNewTeamEmail] = useState('');
  const [newTeamName, setNewTeamName] = useState('');
  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [activeFilter, setActiveFilter] = useState<'pending' | 'approved' | 'all' | 'financial' | 'subscriptions'>('pending');

  // Secondary Password Confirmation State for Sensitive Actions
  const [reauthPassword, setReauthPassword] = useState('');
  const [pendingAction, setPendingAction] = useState<{
    label: string;
    action: () => Promise<void>;
  } | null>(null);

  useEffect(() => {
    if (currentUser.role === 'admin' || currentUser.role === 'team_member') {
      setStaffUser(currentUser);
    }
  }, [currentUser]);

  const isAuthorized = Boolean(
    staffUser && (staffUser.role === 'admin' || staffUser.role === 'team_member')
  );
  const isSuperAdmin = Boolean(
    staffUser &&
      (staffUser.role === 'admin' ||
        staffUser.email?.toLowerCase() === 'srijenponugoti667@gmail.com')
  );

  const fetchOverview = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/overview');
      const data = await res.json();
      if (res.ok) {
        setLawyers(data.lawyers || []);
        setTeamMembers(data.teamMembers || []);
      }
    } catch (err) {
      console.error('Failed to fetch admin overview:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthorized) {
      fetchOverview();
    }
  }, [isAuthorized]);

  const showBanner = (type: 'success' | 'error', text: string) => {
    setStatusMsg({ type, text });
    setTimeout(() => setStatusMsg(null), 5000);
  };

  const handlePortalLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    const cleanEmail = loginEmail.trim().toLowerCase();
    if (!cleanEmail || !loginPassword || loginPassword.length < 6) {
      setLoginError('Please enter a valid email and a password of at least 6 characters.');
      return;
    }

    try {
      setLoginLoading(true);
      const res = await fetch('/api/auth/staff-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: cleanEmail,
          password: loginPassword,
          isSettingPassword: isSettingFirstPassword
        })
      });
      const data = await res.json();
      if (!res.ok || !data.user) {
        setLoginError(data.error || 'Authentication failed.');
        return;
      }

      setStaffUser(data.user);
      setLoginPassword('');
      if (onStaffLoginSuccess) {
        onStaffLoginSuccess(data.user);
      }
    } catch (err) {
      setLoginError('Network error while signing in to Admin Portal.');
    } finally {
      setLoginLoading(false);
    }
  };

  // Server-side secondary password re-authentication for sensitive actions
  const verifySecondaryPassword = async (): Promise<boolean> => {
    if (!staffUser?.email || !reauthPassword) {
      showBanner('error', 'Please enter your password to confirm.');
      return false;
    }
    try {
      const res = await fetch('/api/auth/staff-reauth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: staffUser.email,
          password: reauthPassword
        })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        showBanner('error', data.error || 'Incorrect password. Action cancelled.');
        return false;
      }
      return true;
    } catch (err) {
      showBanner('error', 'Failed to verify password.');
      return false;
    }
  };

  const handleLawyerAction = async (
    lawyerId: string,
    action: 'approve' | 'reject' | 'revoke',
    currentlyVerified: boolean
  ) => {
    if (!staffUser) return;
    if (!isSuperAdmin && currentlyVerified && (action === 'revoke' || action === 'reject')) {
      showBanner(
        'error',
        'Hierarchy Restriction: Team members cannot undo an approved lawyer. Only Srijen (Super Admin) can revoke a mistaken approval.'
      );
      return;
    }

    const execute = async () => {
      try {
        const res = await fetch(`/api/admin/lawyers/${encodeURIComponent(lawyerId)}/verify-action`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action,
            actorEmail: staffUser.email,
            actorRole: staffUser.role
          })
        });
        const data = await res.json();
        if (!res.ok) {
          showBanner('error', data.error || 'Action failed.');
          return;
        }
        showBanner('success', data.message || 'Status updated successfully.');
        fetchOverview();
      } catch (err) {
        showBanner('error', 'Network error while updating lawyer verification.');
      }
    };

    if (action === 'revoke') {
      setPendingAction({
        label: 'Revoke Mistaken Lawyer Approval',
        action: execute
      });
    } else {
      await execute();
    }
  };

  const handleAddTeamMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSuperAdmin || !staffUser) return;
    const targetEmail = newTeamEmail.trim();
    const targetName = newTeamName.trim();
    if (!targetEmail) return;

    setPendingAction({
      label: `Authorize Team Member (${targetEmail})`,
      action: async () => {
        try {
          const res = await fetch('/api/admin/team', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: targetEmail,
              name: targetName,
              adminEmail: staffUser.email || 'srijenponugoti667@gmail.com'
            })
          });
          const data = await res.json();
          if (!res.ok) {
            showBanner('error', data.error || 'Could not add team member.');
            return;
          }
          setTeamMembers(data.teamMembers || []);
          setNewTeamEmail('');
          setNewTeamName('');
          showBanner(
            'success',
            `Added ${targetEmail}! They can now open /admin-portal and set their password.`
          );
        } catch (err) {
          showBanner('error', 'Network error while adding team member.');
        }
      }
    });
  };

  const handleRemoveTeamMember = async (email: string) => {
    if (!isSuperAdmin || !staffUser) return;
    setPendingAction({
      label: `Remove Team Member (${email})`,
      action: async () => {
        try {
          const res = await fetch(
            `/api/admin/team/${encodeURIComponent(email)}?adminEmail=${encodeURIComponent(
              staffUser.email || 'srijenponugoti667@gmail.com'
            )}`,
            { method: 'DELETE' }
          );
          const data = await res.json();
          if (res.ok) {
            setTeamMembers(data.teamMembers || []);
            showBanner('success', `Removed ${email} from the verification team.`);
          } else {
            showBanner('error', data.error || 'Could not remove team member.');
          }
        } catch (err) {
          showBanner('error', 'Failed to remove team member.');
        }
      }
    });
  };

  // 1. STANDALONE PRIVATE LOGIN SCREEN WHEN VISITING /admin-portal
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-3xl bg-white border border-slate-200 shadow-2xl overflow-hidden text-slate-900">
          <div className="px-6 py-5 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-red-900/80 border border-red-700 flex items-center justify-center text-red-200">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-lg font-bold font-cinzel">JusticeBridge Admin Portal</h1>
                <p className="text-[11px] text-amber-300">Private Staff & Verification Desk</p>
              </div>
            </div>
          </div>

          <form onSubmit={handlePortalLogin} className="p-6 space-y-4">
            {loginError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
                {loginError}
              </div>
            )}

            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs">
              <div className="flex items-center space-x-2 text-red-900 font-extrabold mb-1">
                <ShieldCheck className="w-4 h-4 text-red-700" />
                <span>Restricted Staff Access Only</span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Enter your authorized Admin or Team email and password. First-time logins will automatically set and encrypt your password.
              </p>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-xs">
              <span className="font-semibold text-slate-700">
                {isSettingFirstPassword ? 'First-Time Password Setup' : 'Staff Sign In'}
              </span>
              <button
                type="button"
                onClick={() => {
                  setIsSettingFirstPassword(!isSettingFirstPassword);
                  setLoginError(null);
                }}
                className="px-2.5 py-1 rounded-lg bg-white border border-slate-300 text-red-700 font-bold hover:bg-slate-50 cursor-pointer"
              >
                {isSettingFirstPassword ? 'Switch to Sign In' : 'First time? Set Password'}
              </button>
            </div>

            <div>
              <label className="text-xs text-slate-700 font-semibold block mb-1">
                Admin or Team Member Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="srijenponugoti667@gmail.com"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs focus:ring-2 focus:ring-red-700 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-700 font-semibold block mb-1">
                {isSettingFirstPassword ? 'Create Secret Password (min 6 chars)' : 'Enter Password'}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs focus:ring-2 focus:ring-red-700 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3.5 rounded-xl bg-red-700 hover:bg-red-800 text-white font-bold text-xs shadow-md flex items-center justify-center space-x-2 cursor-pointer transition"
            >
              <KeyRound className="w-4 h-4" />
              <span>
                {loginLoading
                  ? 'Verifying Credentials...'
                  : isSettingFirstPassword
                    ? 'Save Password & Enter Admin Portal'
                    : 'Sign In to Admin Portal'}
              </span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  const pendingLawyers = lawyers.filter((l) => !l.isVerified);
  const approvedLawyers = lawyers.filter((l) => l.isVerified);
  const displayedLawyers =
    activeFilter === 'pending'
      ? pendingLawyers
      : activeFilter === 'approved'
        ? approvedLawyers
        : lawyers;

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Secondary Password Confirmation Modal for Sensitive Actions */}
        {pendingAction && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-white p-6 rounded-3xl w-full max-w-sm shadow-2xl border border-slate-200">
              <h3 className="font-bold text-slate-900 mb-1 flex items-center gap-2">
                <Lock className="w-4 h-4 text-red-700" /> Secondary Password Check
              </h3>
              <p className="text-xs text-slate-600 mb-3">
                Confirm your password to execute: <strong>{pendingAction.label}</strong>
              </p>
              <input
                type="password"
                value={reauthPassword}
                onChange={(e) => setReauthPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 mb-4 border border-slate-300 rounded-xl bg-slate-50 text-xs"
                placeholder="Enter your password"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setPendingAction(null);
                    setReauthPassword('');
                  }}
                  className="flex-1 py-2.5 bg-slate-200 hover:bg-slate-300 rounded-xl font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    if (await verifySecondaryPassword()) {
                      await pendingAction.action();
                      setPendingAction(null);
                      setReauthPassword('');
                    }
                  }}
                  className="flex-1 py-2.5 bg-red-700 hover:bg-red-800 text-white rounded-xl font-bold text-xs cursor-pointer"
                >
                  Confirm & Execute
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Top Header Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xl mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-900/60 border border-red-700 text-red-200 text-xs font-bold mb-2">
              <ShieldCheck className="w-4 h-4 text-red-400" />
              <span>
                {isSuperAdmin
                  ? 'SUPER ADMIN PORTAL (Full Approve + Revoke + Unlimited Team Control)'
                  : 'TEAM VERIFICATION PORTAL (Approve / Verify Authority)'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-cinzel">
              JusticeBridge Private Verification Desk
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Logged in as: <strong className="text-amber-300">{staffUser?.email}</strong> (
              {isSuperAdmin ? 'Founder / Super Admin' : 'Verification Team Member'})
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start md:self-center">
            <button
              onClick={fetchOverview}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-white cursor-pointer transition"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh Queue</span>
            </button>
            <button
              onClick={() => {
                setStaffUser(null);
                if (onExitPortal) onExitPortal();
              }}
              className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-red-900/70 hover:bg-red-800 border border-red-700 text-xs font-bold text-white cursor-pointer transition"
            >
              <LogOut className="w-4 h-4" />
              <span>Lock / Sign Out</span>
            </button>
          </div>
        </div>

        {statusMsg && (
          <div
            className={`p-4 mb-6 rounded-2xl border text-xs font-bold flex items-center space-x-2.5 ${
              statusMsg.type === 'success'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                : 'bg-rose-50 border-rose-300 text-rose-900'
            }`}
          >
            {statusMsg.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            )}
            <span>{statusMsg.text}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT 2 COLUMNS: LAWYER VERIFICATION QUEUE & MISTAKE RECOVERY */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setActiveFilter('pending')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition ${
                    activeFilter === 'pending'
                      ? 'bg-amber-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Pending Verification ({pendingLawyers.length})
                </button>
                <button
                  onClick={() => setActiveFilter('approved')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition ${
                    activeFilter === 'approved'
                      ? 'bg-emerald-700 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Approved Lawyers ({approvedLawyers.length})
                </button>
                <button
                  onClick={() => setActiveFilter('all')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition ${
                    activeFilter === 'all'
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  All ({lawyers.length})
                </button>
                <button
                  onClick={() => setActiveFilter('financial')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition ${
                    activeFilter === 'financial'
                      ? 'bg-blue-700 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Financial Dashboard
                </button>
                <button
                  onClick={() => setActiveFilter('subscriptions')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition ${
                    activeFilter === 'subscriptions'
                      ? 'bg-indigo-700 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Subscription Management
                </button>
              </div>

              <a
                href="https://www.barcouncilofindia.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 text-xs font-bold text-red-700 hover:text-red-800"
              >
                <span>Open Official BCI Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {activeFilter === 'financial' ? (
              <FinancialDashboard
                isAdmin={true}
                userId={staffUser?.id || ''}
                currentUser={staffUser!}
              />
            ) : activeFilter === 'subscriptions' ? (
              <SubscriptionManagement currentUser={staffUser!} />
            ) : displayedLawyers.length === 0 ? (
              <div className="p-12 rounded-3xl bg-white border border-slate-200 text-center">
                <Award className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-900">
                  {activeFilter === 'pending'
                    ? 'No Pending Advocate Verifications'
                    : 'No Advocates Found in This Filter'}
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                  When an advocate registers or submits their Bar Council number on JusticeBridge, they will appear right here for your team to manually verify.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {displayedLawyers.map((lawyer) => (
                  <div
                    key={lawyer.id}
                    className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2 flex-wrap">
                        <h3 className="text-base font-bold text-slate-900">{lawyer.name}</h3>
                        {lawyer.isVerified ? (
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-[11px] font-bold">
                            ✓ Approved & Verified
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 text-[11px] font-bold">
                            ⏳ Pending Manual Check
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-slate-600 space-y-0.5">
                        <p>
                          <strong>Bar Council No:</strong>{' '}
                          <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                            {lawyer.barCouncilNumber}
                          </span>{' '}
                          • <strong>State Bar:</strong> {lawyer.stateBarCouncil}
                        </p>
                        <p>
                          <strong>Email:</strong> {lawyer.email || 'N/A'} • <strong>Phone:</strong>{' '}
                          {lawyer.phone || 'N/A'} • <strong>Experience:</strong>{' '}
                          {lawyer.experienceYears} yrs
                        </p>
                        {lawyer.verifiedBy && (
                          <p className="text-[11px] text-slate-500 pt-1">
                            Last action by: <strong>{lawyer.verifiedBy}</strong>
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons with Hierarchy Enforcement */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {!lawyer.isVerified ? (
                        <>
                          <button
                            onClick={() => handleLawyerAction(lawyer.id, 'approve', false)}
                            className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs cursor-pointer transition"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => handleLawyerAction(lawyer.id, 'reject', false)}
                            className="flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-800 border border-rose-300 text-xs font-bold cursor-pointer transition"
                          >
                            <XCircle className="w-4 h-4" />
                            <span>Reject</span>
                          </button>
                        </>
                      ) : isSuperAdmin ? (
                        <button
                          onClick={() => handleLawyerAction(lawyer.id, 'revoke', true)}
                          className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-red-700 hover:bg-red-800 text-white text-xs font-bold shadow-xs cursor-pointer transition"
                          title="Super Admin Only: Undo mistaken approval"
                        >
                          <RotateCcw className="w-4 h-4" />
                          <span>Revoke Mistaken Approval</span>
                        </button>
                      ) : (
                        <div className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-500 text-[11px] font-semibold">
                          <Lock className="w-3.5 h-3.5 text-slate-400" />
                          <span>Approved (Only Admin Can Undo)</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>

          {/* RIGHT COLUMN: TEAM ACCESS MANAGEMENT (UNLIMITED TEAM MEMBERS) */}
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs">
              <div className="flex items-center space-x-2 mb-2">
                <Users className="w-5 h-5 text-red-700" />
                <h2 className="text-lg font-bold text-slate-900 font-cinzel">
                  Verification Team ({teamMembers.length})
                </h2>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                You can add or remove <strong>as many team members as you wish</strong> (no limit). Team members can approve lawyers, but only you can revoke an approval.
              </p>

              {isSuperAdmin && (
                <form
                  onSubmit={handleAddTeamMember}
                  className="space-y-3 mb-6 p-4 rounded-2xl bg-slate-50 border border-slate-200"
                >
                  <h3 className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
                    <UserPlus className="w-3.5 h-3.5 text-red-700" />
                    <span>Add New Team Member</span>
                  </h3>
                  <input
                    type="text"
                    value={newTeamName}
                    onChange={(e) => setNewTeamName(e.target.value)}
                    placeholder="Colleague Name (e.g. Rahul)"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900"
                  />
                  <input
                    type="email"
                    required
                    value={newTeamEmail}
                    onChange={(e) => setNewTeamEmail(e.target.value)}
                    placeholder="Colleague Email (e.g. friend@gmail.com)"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900"
                  />
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer transition"
                  >
                    Authorize Team Member Email
                  </button>
                </form>
              )}

              <div className="space-y-2.5">
                {teamMembers.map((member) => (
                  <div
                    key={member.email}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">{member.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{member.email}</p>
                    </div>
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          member.role === 'admin'
                            ? 'bg-red-100 text-red-800 border border-red-300'
                            : 'bg-blue-100 text-blue-800 border border-blue-300'
                        }`}
                      >
                        {member.role === 'admin' ? 'Super Admin' : 'Team'}
                      </span>
                      {isSuperAdmin && member.role !== 'admin' && (
                        <button
                          onClick={() => handleRemoveTeamMember(member.email)}
                          className="p-1.5 rounded-lg hover:bg-rose-100 text-slate-400 hover:text-rose-700 cursor-pointer"
                          title="Remove team member"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
