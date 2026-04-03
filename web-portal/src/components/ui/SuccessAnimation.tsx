"use client";

import React from 'react';
import dynamic from 'next/dynamic';
import successData from '@/assets/animations/success.json';

const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

export function SuccessAnimation({ onComplete }: { onComplete?: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div className="w-[300px] h-[300px]">
        <Lottie
          animationData={successData}
          loop={false}
          autoplay={true}
          onComplete={onComplete}
        />
      </div>
    </div>
  );
}
