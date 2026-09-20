'use client';

import React from 'react';
import { ShieldCheck, ShieldAlert, Key, CheckCircle2, RefreshCw } from 'lucide-react';

export default function AdminLogsPage() {
  const auditLogs = [
    { id: 'LOG-8841', action: 'ADMIN_SESSION_VERIFIED', admin: 'Super Administrator', ip: '127.0.0.1 (LocalHost)', details: 'Admin ID "Admin" authenticated with 30-day JWT persistent cookie', time: 'Just now', severity: 'SUCCESS' },
    { id: 'LOG-8840', action: 'GOOGLE_SMTP_OTP_DISPATCHED', admin: 'System Worker', ip: '127.0.0.1', details: 'Nodemailer sent 6-digit OTP code to rohan.encourtyard@gmail.com', time: '14 mins ago', severity: 'INFO' },
    { id: 'LOG-8839', action: 'PRISMA_DB_SCHEMA_PUSH', admin: 'Prisma CLI', ip: 'Supabase AWS AP-SOUTHEAST-2', details: 'Synced tables: users, otp_verifications, bookings, admin_audit_logs', time: '1 hour ago', severity: 'SUCCESS' },
    { id: 'LOG-8838', action: 'MEMBER_BOOKING_CREATED', admin: 'Elena Rostova', ip: '103.212.44.18', details: 'Reserved The Oak Executive Boardroom for 20 Sep (Booking #BK-991)', time: '2 hours ago', severity: 'INFO' },
    { id: 'LOG-8837', action: 'ADMIN_CREDENTIALS_INITIALIZED', admin: 'Security Guard', ip: '127.0.0.1', details: 'Root master password verified from .env configuration', time: '3 hours ago', severity: 'SUCCESS' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#E3EBE3] text-[#2E7D32] text-xs font-mono font-semibold uppercase tracking-wider mb-1">
          <span>Security & Compliance</span>
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#181F18]">
          System & Security Audit Trail
        </h1>
        <p className="text-xs sm:text-sm text-[#5C665C]">
          Tamper-evident operational trail tracking authentication, OTP dispatches, and database events.
        </p>
      </div>

      <div className="bg-white border border-[#E5E1D8] rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#FAF9F5] border-b border-[#E5E1D8] text-[#6A806A] font-mono uppercase text-[11px]">
                <th className="py-3.5 px-4">Log ID</th>
                <th className="py-3.5 px-4">Event Type</th>
                <th className="py-3.5 px-4">Actor</th>
                <th className="py-3.5 px-4">IP / Source</th>
                <th className="py-3.5 px-4">Audit Details</th>
                <th className="py-3.5 px-4">Timestamp</th>
                <th className="py-3.5 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E1D8]/60">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-[#FAF9F5] transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#181F18]">{log.id}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-[#263626]">{log.action}</td>
                  <td className="py-3.5 px-4 font-medium text-[#181F18]">{log.admin}</td>
                  <td className="py-3.5 px-4 font-mono text-[#5C665C]">{log.ip}</td>
                  <td className="py-3.5 px-4 text-[#181F18] max-w-xs truncate">{log.details}</td>
                  <td className="py-3.5 px-4 text-[#6A806A] font-mono">{log.time}</td>
                  <td className="py-3.5 px-4 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                      log.severity === 'SUCCESS' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-blue-50 text-blue-700 border border-blue-200'
                    }`}>
                      {log.severity}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
