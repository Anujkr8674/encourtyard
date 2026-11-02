'use client';

import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  CheckCircle2,
  Sparkles,
  Send,
  AlertCircle,
  Loader2,
  Calendar,
  Building2,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface FormState {
  fullName: string;
  email: string;
  phone: string;
  company: string;
  spaceInterest: string;
  tourDate: string;
  message: string;
}

interface SubmittedData {
  inquiryId: string;
  fullName: string;
  email: string;
  spaceInterest: string;
  tourDate?: string;
  company?: string;
}

const SPACE_LABELS: Record<string, string> = {
  'private-office': 'Private Office',
  'shared-office': 'Shared Office',
  'meeting-room': 'Meeting Room',
  'conference-hall': 'Conference Hall',
  'day-pass': 'Day Pass',
  'podcast-office': 'Podcast Office',
  'others': 'Other / Custom Inquiries',
};

export const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState<FormState>({
    fullName: '',
    email: '',
    phone: '',
    company: '',
    spaceInterest: 'private-office',
    tourDate: '',
    message: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState<SubmittedData | null>(null);

  // Today's date string in YYYY-MM-DD for native date min validation
  const todayIso = new Date().toISOString().split('T')[0];

  const validateField = (name: keyof FormState, value: string): string => {
    switch (name) {
      case 'fullName':
        if (!value.trim()) return 'Your full name is required.';
        if (value.trim().length < 2) return 'Full name must be at least 2 characters.';
        return '';
      case 'email':
        if (!value.trim()) return 'Work email address is required.';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
          return 'Please enter a valid email address (e.g. name@company.com).';
        }
        return '';
      case 'phone':
        if (!value.trim()) return 'Contact phone number is required.';
        const digits = value.replace(/\D/g, '');
        if (digits.length < 7) {
          return 'Please enter a valid phone number with at least 7 digits.';
        }
        return '';
      case 'tourDate':
        if (value) {
          const selected = new Date(value);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          if (selected < today) {
            return 'Preferred tour date cannot be in the past.';
          }
        }
        return '';
      case 'message':
        if (!value.trim()) return 'Please tell us about your space needs or inquiry.';
        if (value.trim().length < 10) {
          return 'Please share a few more details (minimum 10 characters).';
        }
        return '';
      default:
        return '';
    }
  };

  const validateAll = (): Record<string, string> => {
    const newErrors: Record<string, string> = {};
    (Object.keys(formData) as Array<keyof FormState>).forEach((field) => {
      const err = validateField(field, formData[field]);
      if (err) newErrors[field] = err;
    });
    return newErrors;
  };

  const handleChange = (name: keyof FormState, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (serverError) setServerError(null);

    // If already touched, validate on the fly
    if (touched[name]) {
      const err = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: err }));
    }
  };

  const handleBlur = (name: keyof FormState) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    const err = validateField(name, formData[name]);
    setErrors((prev) => ({ ...prev, [name]: err }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    const allTouched: Record<string, boolean> = {
      fullName: true,
      email: true,
      phone: true,
      company: true,
      spaceInterest: true,
      tourDate: true,
      message: true,
    };
    setTouched(allTouched);

    const validationErrors = validateAll();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      // Focus first error element
      const firstErrorField = Object.keys(validationErrors)[0];
      const element = document.getElementById(`field-${firstErrorField}`);
      if (element) {
        element.focus();
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsSubmitting(true);
    setServerError(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          company: formData.company || null,
          spaceInterest: formData.spaceInterest,
          tourDate: formData.tourDate || null,
          message: formData.message,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit inquiry. Please try again.');
      }

      setSubmittedData({
        inquiryId: data.inquiryId || data.inquiry?.id || 'INQ-' + Date.now().toString().slice(-6),
        fullName: formData.fullName,
        email: formData.email,
        spaceInterest: formData.spaceInterest,
        tourDate: formData.tourDate,
        company: formData.company,
      });
      setSubmitted(true);
    } catch (err: any) {
      console.error('Contact form submission error:', err);
      setServerError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      company: '',
      spaceInterest: 'private-office',
      tourDate: '',
      message: ''
    });
    setErrors({});
    setTouched({});
    setServerError(null);
    setSubmitted(false);
    setSubmittedData(null);
  };

  return (
    <div id="visit-form" className="scroll-mt-24">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* Left Column: Direct Contact & Concierge Information */}
        <div className="lg:col-span-5 bg-[#263626] text-white p-8 sm:p-10 rounded-2xl shadow-warm border border-[#3A4D3A] space-y-8">
          <div>
            <span className="text-xs uppercase font-mono tracking-widest text-[#A3BFA3] block mb-2 font-semibold">
              Concierge & Private Tours
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white leading-tight">
              Get in touch or visit our courtyard.
            </h3>
            <p className="text-sm text-[#C5D5C5] mt-3 leading-relaxed">
              Whether you are looking for an executive suite for your expanding team or want to host a keynote in our Glass Pavilion, our hospitality team is here to assist.
            </p>
          </div>

          <div className="space-y-5 text-sm text-[#E3EBE3]">
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-lg bg-[#1A261A] flex items-center justify-center text-[#4ADE80] shrink-0 border border-[#3A4D3A]">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs text-[#A3BFA3] uppercase tracking-wider block font-semibold">
                  Physical Address
                </span>
                <span className="font-medium">H.No. 6-2-981, Flat No. 101, Maruthi Plaza</span>
                <div className="text-xs text-[#A3B0A3]">Shadan College Road, Above Axis Bank, Khairtabad, Hyderabad - 500004, Telangana</div>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-lg bg-[#1A261A] flex items-center justify-center text-[#4ADE80] shrink-0 border border-[#3A4D3A]">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs text-[#A3BFA3] uppercase tracking-wider block font-semibold">
                  Direct Telephone
                </span>
                <a href="tel:+919908209993" className="font-medium hover:underline text-white">
                  +91 99082 09993
                </a>
                <div className="text-xs text-[#A3B0A3]">Mon–Sat from 9:00 AM to 7:00 PM</div>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-lg bg-[#1A261A] flex items-center justify-center text-[#4ADE80] shrink-0 border border-[#3A4D3A]">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs text-[#A3BFA3] uppercase tracking-wider block font-semibold">
                  Email Concierge
                </span>
                <a href="mailto:info@encourtyard.com" className="font-medium hover:underline text-white">
                  info@encourtyard.com
                </a>
                <div className="text-xs text-[#A3B0A3]">Inquiries answered within 2 hours</div>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-lg bg-[#1A261A] flex items-center justify-center text-[#4ADE80] shrink-0 border border-[#3A4D3A]">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs text-[#A3BFA3] uppercase tracking-wider block font-semibold">
                  Operating Hours
                </span>
                <span className="font-medium">24/7 Access for EnCourtyard Members</span>
                <div className="text-xs text-[#A3B0A3]">Reception & Public Tours: Weekdays 8am–6pm</div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#3A4D3A] text-xs text-[#A3BFA3] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#4ADE80]" />
            <span>Complimentary barista coffee during all scheduled private tours</span>
          </div>
        </div>

        {/* Right Column: Contact & Tour Form UI */}
        <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-2xl shadow-warm border border-[#E5E1D8]">
          {submitted && submittedData ? (
            <div className="py-8 text-center space-y-6 animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-[#EAF5EA] text-[#2E7D32] flex items-center justify-center mx-auto border border-[#C8E6C9] shadow-sm">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              
              <div>
                <span className="inline-block px-3 py-1 bg-[#EAF5EA] text-[#2E7D32] rounded-full text-xs font-mono font-bold tracking-wider mb-2">
                  CONFIRMATION #{submittedData.inquiryId.slice(0, 8).toUpperCase()}
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#181F18]">
                  Thank You, {submittedData.fullName}!
                </h3>
                <p className="text-sm text-[#5C665C] max-w-md mx-auto mt-2 leading-relaxed">
                  Your inquiry and walkthrough request have been logged directly with our concierge team and saved in the management dashboard.
                </p>
              </div>

              {/* Inquiry summary card */}
              <div className="max-w-md mx-auto bg-[#FAF9F5] border border-[#E5E1D8] rounded-xl p-4 text-left text-xs space-y-2 text-[#465246]">
                <div className="flex justify-between items-center pb-2 border-b border-[#E5E1D8]">
                  <span className="text-[#738273]">Space Interest</span>
                  <span className="font-semibold text-[#181F18]">{SPACE_LABELS[submittedData.spaceInterest] || submittedData.spaceInterest}</span>
                </div>
                {submittedData.tourDate && (
                  <div className="flex justify-between items-center pb-2 border-b border-[#E5E1D8]">
                    <span className="text-[#738273]">Preferred Tour Date</span>
                    <span className="font-semibold text-[#181F18]">{submittedData.tourDate}</span>
                  </div>
                )}
                <div className="flex justify-between items-center pb-2 border-b border-[#E5E1D8]">
                  <span className="text-[#738273]">Contact Email</span>
                  <span className="font-semibold text-[#181F18]">{submittedData.email}</span>
                </div>
                {submittedData.company && (
                  <div className="flex justify-between items-center">
                    <span className="text-[#738273]">Organization</span>
                    <span className="font-semibold text-[#181F18]">{submittedData.company}</span>
                  </div>
                )}
              </div>

              <div className="pt-2">
                <Button
                  variant="secondary"
                  size="md"
                  onClick={handleReset}
                  className="font-medium"
                >
                  Send Another Inquiry
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              <div>
                <h4 className="font-serif text-2xl font-bold text-[#181F18] mb-1">
                  Schedule a Tour or Inquire
                </h4>
                <p className="text-xs sm:text-sm text-[#5C665C]">
                  Complete the details below to arrange a personal visit or request customized space terms.
                </p>
              </div>

              {/* Server-level error notification */}
              {serverError && (
                <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2.5 animate-fadeIn">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">Submission Error</span>
                    <span>{serverError}</span>
                  </div>
                </div>
              )}

              {/* Row 1: Full Name & Work Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="field-fullName" className="block text-xs font-semibold uppercase tracking-wider text-[#5C665C] mb-1.5">
                    Your Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="field-fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => handleChange('fullName', e.target.value)}
                    onBlur={() => handleBlur('fullName')}
                    placeholder="Marcus Lindqvist"
                    disabled={isSubmitting}
                    className={`w-full px-3.5 py-2.5 bg-[#FAF9F5] border rounded-md text-sm text-[#181F18] transition-colors focus:bg-white focus:outline-none ${
                      touched.fullName && errors.fullName
                        ? 'border-red-500 focus:border-red-600 focus:ring-1 focus:ring-red-500/20'
                        : 'border-[#E5E1D8] focus:border-[#263626] focus:ring-1 focus:ring-[#263626]'
                    }`}
                  />
                  {touched.fullName && errors.fullName && (
                    <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1 font-medium animate-fadeIn">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.fullName}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="field-email" className="block text-xs font-semibold uppercase tracking-wider text-[#5C665C] mb-1.5">
                    Work Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="field-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    onBlur={() => handleBlur('email')}
                    placeholder="marcus@company.com"
                    disabled={isSubmitting}
                    className={`w-full px-3.5 py-2.5 bg-[#FAF9F5] border rounded-md text-sm text-[#181F18] transition-colors focus:bg-white focus:outline-none ${
                      touched.email && errors.email
                        ? 'border-red-500 focus:border-red-600 focus:ring-1 focus:ring-red-500/20'
                        : 'border-[#E5E1D8] focus:border-[#263626] focus:ring-1 focus:ring-[#263626]'
                    }`}
                  />
                  {touched.email && errors.email && (
                    <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1 font-medium animate-fadeIn">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.email}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Row 2: Phone Number & Company */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="field-phone" className="block text-xs font-semibold uppercase tracking-wider text-[#5C665C] mb-1.5">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="field-phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    onBlur={() => handleBlur('phone')}
                    placeholder="+91 99082 09993"
                    disabled={isSubmitting}
                    className={`w-full px-3.5 py-2.5 bg-[#FAF9F5] border rounded-md text-sm text-[#181F18] transition-colors focus:bg-white focus:outline-none ${
                      touched.phone && errors.phone
                        ? 'border-red-500 focus:border-red-600 focus:ring-1 focus:ring-red-500/20'
                        : 'border-[#E5E1D8] focus:border-[#263626] focus:ring-1 focus:ring-[#263626]'
                    }`}
                  />
                  {touched.phone && errors.phone && (
                    <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1 font-medium animate-fadeIn">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.phone}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="field-company" className="block text-xs font-semibold uppercase tracking-wider text-[#5C665C] mb-1.5">
                    Company / Brand Name <span className="text-[#889988] text-[10px] font-normal normal-case">(Optional)</span>
                  </label>
                  <input
                    id="field-company"
                    type="text"
                    value={formData.company}
                    onChange={(e) => handleChange('company', e.target.value)}
                    placeholder="Studio Lindqvist & Co"
                    disabled={isSubmitting}
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#E5E1D8] rounded-md text-sm text-[#181F18] focus:bg-white focus:outline-none focus:border-[#263626] focus:ring-1 focus:ring-[#263626]"
                  />
                </div>
              </div>

              {/* Row 3: Space of Interest & Preferred Tour Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="field-spaceInterest" className="block text-xs font-semibold uppercase tracking-wider text-[#5C665C] mb-1.5">
                    Space of Interest
                  </label>
                  <select
                    id="field-spaceInterest"
                    value={formData.spaceInterest}
                    onChange={(e) => handleChange('spaceInterest', e.target.value)}
                    disabled={isSubmitting}
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#E5E1D8] rounded-md text-sm text-[#181F18] focus:bg-white focus:outline-none focus:border-[#263626] focus:ring-1 focus:ring-[#263626] cursor-pointer"
                  >
                    <option value="private-office">Private Office</option>
                    <option value="shared-office">Shared Office</option>
                    <option value="meeting-room">Meeting Rooms</option>
                    <option value="conference-hall">Conference Hall</option>
                    <option value="day-pass">Day Pass</option>
                    <option value="podcast-office">Podcast Office</option>
                    <option value="others">Others / Custom</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="field-tourDate" className="block text-xs font-semibold uppercase tracking-wider text-[#5C665C] mb-1.5">
                    Preferred Tour Date <span className="text-[#889988] text-[10px] font-normal normal-case">(Optional)</span>
                  </label>
                  <input
                    id="field-tourDate"
                    type="date"
                    min={todayIso}
                    value={formData.tourDate}
                    onChange={(e) => handleChange('tourDate', e.target.value)}
                    onBlur={() => handleBlur('tourDate')}
                    disabled={isSubmitting}
                    className={`w-full px-3.5 py-2.5 bg-[#FAF9F5] border rounded-md text-sm text-[#181F18] transition-colors focus:bg-white focus:outline-none cursor-pointer ${
                      touched.tourDate && errors.tourDate
                        ? 'border-red-500 focus:border-red-600 focus:ring-1 focus:ring-red-500/20'
                        : 'border-[#E5E1D8] focus:border-[#263626] focus:ring-1 focus:ring-[#263626]'
                    }`}
                  />
                  {touched.tourDate && errors.tourDate && (
                    <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1 font-medium animate-fadeIn">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.tourDate}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Row 4: Message / Space Needs */}
              <div>
                <label htmlFor="field-message" className="block text-xs font-semibold uppercase tracking-wider text-[#5C665C] mb-1.5">
                  How can we help your team? <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="field-message"
                  rows={4}
                  value={formData.message}
                  onChange={(e) => handleChange('message', e.target.value)}
                  onBlur={() => handleBlur('message')}
                  disabled={isSubmitting}
                  placeholder="Share details about your team size, expected move-in timeline, acoustic requirements, or specific questions..."
                  className={`w-full px-3.5 py-2.5 bg-[#FAF9F5] border rounded-md text-sm text-[#181F18] transition-colors focus:bg-white focus:outline-none ${
                    touched.message && errors.message
                      ? 'border-red-500 focus:border-red-600 focus:ring-1 focus:ring-red-500/20'
                      : 'border-[#E5E1D8] focus:border-[#263626] focus:ring-1 focus:ring-[#263626]'
                  }`}
                />
                {touched.message && errors.message && (
                  <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1 font-medium animate-fadeIn">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.message}</span>
                  </p>
                )}
              </div>

              {/* Submit Button & Subtext */}
              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed"
                  icon={isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                >
                  {isSubmitting ? 'Submitting Inquiry & Saving...' : 'Send Inquiry & Book Walkthrough'}
                </Button>
                <p className="text-[11px] text-[#738273] text-center mt-2.5">
                  Encrypted & secure · Submissions saved directly to concierge dashboard · Response within 2 hours
                </p>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
