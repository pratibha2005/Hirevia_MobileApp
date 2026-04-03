"use client";

import React from 'react';
import dynamic from 'next/dynamic';
import emptyData from '@/assets/animations/empty-state.json';

const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

export function EmptyStateAnimation() {
  return (
    <div className="w-full flex items-center justify-center opacity-70" style={{ height: 200 }}>
      <Lottie
        animationData={emptyData}
        loop={true}
        autoplay={true}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}
