"use client";

import React from 'react';
import dynamic from 'next/dynamic';
import errorData from '@/assets/animations/404-error.json';

const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

export function NotFoundAnimation() {
  return (
    <div className="-mt-16 w-full h-[300px] flex items-center justify-center opacity-80">
      <Lottie
        animationData={errorData}
        loop={true}
        autoplay={true}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}
