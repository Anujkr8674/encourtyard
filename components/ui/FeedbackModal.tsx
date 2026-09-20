'use client';

import React from 'react';
import {
  Check,
  X,
  AlertTriangle,
  FileCheck,
  FileX,
  Clock,
  UserCheck,
  Sparkles,
  ShieldCheck,
  RotateCcw,
  LogIn,
  Home,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export type FeedbackType = 'success' | 'error';
export type FeedbackVariant =
  | 'minimal'
  | 'cta'
  | 'file'
  | 'account'
  | 'session'
  | 'warning'
  | 'delete';

export interface FeedbackModalProps {
  isOpen: boolean;
  type?: FeedbackType;
  variant?: FeedbackVariant;
  title: string;
  message: string;
  subMessage?: string;
  primaryBtnText?: string;
  secondaryBtnText?: string;
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
  onClose: () => void;
  autoCloseMs?: number;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  type = 'success',
  variant = 'minimal',
  title,
  message,
  subMessage,
  primaryBtnText,
  secondaryBtnText,
  onPrimaryClick,
  onSecondaryClick,
  onClose,
  autoCloseMs,
}) => {
  // Auto-close handler if specified
  React.useEffect(() => {
    if (!isOpen || !autoCloseMs) return;
    const timer = setTimeout(() => {
      onClose();
    }, autoCloseMs);
    return () => clearTimeout(timer);
  }, [isOpen, autoCloseMs, onClose]);

  if (!isOpen) return null;

  const isSuccess = type === 'success';

  // Default button texts if not supplied
  const defaultPrimaryText = isSuccess ? 'Okay' : 'Try Again';
  const effectivePrimaryText = primaryBtnText || defaultPrimaryText;

  const handlePrimary = () => {
    if (onPrimaryClick) {
      onPrimaryClick();
    } else {
      onClose();
    }
  };

  const handleSecondary = () => {
    if (onSecondaryClick) {
      onSecondaryClick();
    } else {
      onClose();
    }
  };

  // Render Icon according to Type and Variant matching the design image
  const renderIcon = () => {
    if (isSuccess) {
      switch (variant) {
        case 'cta':
        case 'account':
          return (
            <div className="relative w-20 h-20 mx-auto mb-5 flex items-center justify-center">
              {/* Festive Celebration Ray Accents */}
              <svg
                className="absolute inset-0 w-full h-full text-emerald-500 animate-spin-slow pointer-events-none"
                viewBox="0 0 100 100"
                fill="none"
              >
                <path d="M50 10V2" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                <path d="M50 98V90" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                <path d="M10 50H2" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                <path d="M98 50H90" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                <path d="M22 22L16 16" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                <path d="M84 84L78 78" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                <path d="M22 78L16 84" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                <path d="M84 16L78 22" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
              {/* Center Green Badge */}
              <div className="w-16 h-16 rounded-full bg-[#10B981] text-white flex items-center justify-center shadow-[0_0_25px_rgba(16,185,129,0.4)] animate-scaleUp">
                <Check className="w-9 h-9 stroke-[3]" />
              </div>
            </div>
          );

        case 'file':
          return (
            <div className="w-18 h-18 rounded-full bg-emerald-50 border-2 border-emerald-100 text-[#10B981] flex items-center justify-center mx-auto mb-5 shadow-sm relative">
              <FileCheck className="w-9 h-9 text-[#10B981]" />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#10B981] text-white flex items-center justify-center border-2 border-white">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
            </div>
          );

        case 'minimal':
        default:
          return (
            <div className="w-18 h-18 rounded-full bg-emerald-50 border-2 border-emerald-100 text-[#10B981] flex items-center justify-center mx-auto mb-5 shadow-sm">
              <Check className="w-9 h-9 stroke-[2.8]" />
            </div>
          );
      }
    } else {
      // Error Modals
      switch (variant) {
        case 'cta':
        case 'warning':
          return (
            <div className="relative w-20 h-20 mx-auto mb-5 flex items-center justify-center">
              {/* Warning Accent Rays */}
              <svg
                className="absolute inset-0 w-full h-full text-red-400 pointer-events-none"
                viewBox="0 0 100 100"
                fill="none"
              >
                <path d="M50 12V4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M20 25L14 19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M80 25L86 19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
              {/* Red Warning Triangle Badge */}
              <div className="w-16 h-16 rounded-full bg-red-50 border-2 border-red-200 text-[#DC2626] flex items-center justify-center shadow-[0_0_20px_rgba(220,38,38,0.2)] animate-scaleUp">
                <AlertTriangle className="w-8 h-8 text-[#DC2626]" />
              </div>
            </div>
          );

        case 'file':
          return (
            <div className="w-18 h-18 rounded-full bg-red-50 border-2 border-red-100 text-[#DC2626] flex items-center justify-center mx-auto mb-5 shadow-sm relative">
              <FileX className="w-9 h-9 text-[#DC2626]" />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#DC2626] text-white flex items-center justify-center border-2 border-white">
                <X className="w-3.5 h-3.5 stroke-[3]" />
              </div>
            </div>
          );

        case 'session':
          return (
            <div className="w-18 h-18 rounded-full bg-red-50 border-2 border-red-100 text-[#DC2626] flex items-center justify-center mx-auto mb-5 shadow-sm">
              <Clock className="w-9 h-9 text-[#DC2626]" />
            </div>
          );

        case 'minimal':
        default:
          return (
            <div className="w-18 h-18 rounded-full bg-red-50 border-2 border-red-100 text-[#DC2626] flex items-center justify-center mx-auto mb-5 shadow-sm">
              <X className="w-9 h-9 stroke-[2.8]" />
            </div>
          );
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs animate-fadeIn"
        onClick={onClose}
      />

      {/* Modal Dialog Card */}
      <div className="relative z-10 w-full max-w-sm sm:max-w-md bg-white rounded-3xl border border-[#E0DCD3] shadow-2xl p-6 sm:p-8 text-center animate-scaleUp font-sans">
        {/* Top-Right Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4.5 right-4.5 p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Center Icon Badge */}
        {renderIcon()}

        {/* Title / Heading */}
        <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#181F18] tracking-tight mb-2">
          {title}
        </h3>

        {/* Message / Description */}
        <p className="text-sm text-[#5C665C] leading-relaxed mb-6">
          {message}
        </p>

        {/* Optional Subtext */}
        {subMessage && (
          <p className="text-xs text-[#8A968A] -mt-4 mb-6 leading-relaxed">
            {subMessage}
          </p>
        )}

        {/* Action Buttons */}
        <div className="space-y-2.5">
          {/* Primary Action Button */}
          <button
            type="button"
            onClick={handlePrimary}
            className={`w-full py-3.5 px-6 rounded-2xl font-bold text-sm shadow-md hover:shadow-lg transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2 ${
              isSuccess
                ? 'bg-[#2E7D32] hover:bg-[#1E5C23] text-white shadow-emerald-900/10'
                : 'bg-[#DC2626] hover:bg-[#B91C1C] text-white shadow-red-900/10'
            }`}
          >
            <span>{effectivePrimaryText}</span>
          </button>

          {/* Secondary Action Button (Optional) */}
          {secondaryBtnText && (
            <button
              type="button"
              onClick={handleSecondary}
              className="w-full py-3 px-6 rounded-2xl bg-[#FAF9F5] hover:bg-[#EAE5DC] text-[#181F18] border border-[#E0DCD3] hover:border-[#181F18]/40 font-bold text-sm transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2"
            >
              <span>{secondaryBtnText}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
