'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { FeedbackModal, FeedbackType, FeedbackVariant } from '@/components/ui/FeedbackModal';

export interface FeedbackOptions {
  type?: FeedbackType;
  variant?: FeedbackVariant;
  title: string;
  message: string;
  subMessage?: string;
  primaryBtnText?: string;
  secondaryBtnText?: string;
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
  autoCloseMs?: number;
}

interface FeedbackContextType {
  showFeedback: (options: FeedbackOptions) => void;
  showSuccess: (options: Omit<FeedbackOptions, 'type'>) => void;
  showError: (options: Omit<FeedbackOptions, 'type'>) => void;
  closeFeedback: () => void;
}

const FeedbackContext = createContext<FeedbackContextType | undefined>(undefined);

export const FeedbackProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    options: FeedbackOptions;
  }>({
    isOpen: false,
    options: {
      type: 'success',
      variant: 'minimal',
      title: '',
      message: '',
    },
  });

  const closeFeedback = useCallback(() => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const showFeedback = useCallback((options: FeedbackOptions) => {
    setModalState({
      isOpen: true,
      options: {
        type: 'success',
        variant: 'minimal',
        ...options,
      },
    });
  }, []);

  const showSuccess = useCallback(
    (options: Omit<FeedbackOptions, 'type'>) => {
      showFeedback({ ...options, type: 'success' });
    },
    [showFeedback]
  );

  const showError = useCallback(
    (options: Omit<FeedbackOptions, 'type'>) => {
      showFeedback({ ...options, type: 'error' });
    },
    [showFeedback]
  );

  return (
    <FeedbackContext.Provider
      value={{ showFeedback, showSuccess, showError, closeFeedback }}
    >
      {children}
      <FeedbackModal
        isOpen={modalState.isOpen}
        type={modalState.options.type}
        variant={modalState.options.variant}
        title={modalState.options.title}
        message={modalState.options.message}
        subMessage={modalState.options.subMessage}
        primaryBtnText={modalState.options.primaryBtnText}
        secondaryBtnText={modalState.options.secondaryBtnText}
        onPrimaryClick={() => {
          if (modalState.options.onPrimaryClick) {
            modalState.options.onPrimaryClick();
          }
          closeFeedback();
        }}
        onSecondaryClick={() => {
          if (modalState.options.onSecondaryClick) {
            modalState.options.onSecondaryClick();
          }
          closeFeedback();
        }}
        onClose={closeFeedback}
        autoCloseMs={modalState.options.autoCloseMs}
      />
    </FeedbackContext.Provider>
  );
};

export const useFeedbackModal = (): FeedbackContextType => {
  const context = useContext(FeedbackContext);
  if (!context) {
    throw new Error('useFeedbackModal must be used within a FeedbackProvider');
  }
  return context;
};
