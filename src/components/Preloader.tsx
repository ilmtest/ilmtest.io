'use client';

import gsap from 'gsap';
import Image from 'next/image';
import React, { useEffect } from 'react';

const PreLoader: React.FC = () => {
    useEffect(() => {
        const tl = gsap.timeline();

        const preLoaderAnim = () => {
            tl.to('.texts-container', {
                duration: 0,
                ease: 'Power3.easeOut',
                opacity: 1,
            })
                .from('.texts-container span', {
                    delay: 1,
                    duration: 1.5,
                    ease: 'Power3.easeOut',
                    skewY: 10,
                    stagger: 0.4,
                    y: 70,
                })
                .to('.texts-container span', {
                    duration: 1,
                    ease: 'Power3.easeOut',
                    skewY: -20,
                    stagger: 0.2,
                    y: 70,
                })
                .to('body', {
                    css: { overflowY: 'scroll' },
                    duration: 0.01,
                    ease: 'power3.inOut',
                })
                .from('.sub', {
                    duration: 1,
                    ease: 'expo.easeOut',
                    opacity: 0,
                    y: 80,
                })
                .to(
                    '.preloader',
                    {
                        duration: 1.5,
                        ease: 'Power3.easeOut',
                        height: '0vh',
                        onComplete: mobileLanding,
                    },
                    '-=2',
                )
                .to('.preloader', {
                    css: { display: 'none' },
                    duration: 0,
                });
        };

        const mobileLanding = () => {
            if (window.innerWidth < 763) {
                tl.from('.landing__main2', {
                    delay: 0,
                    duration: 1,
                    ease: 'expo.easeOut',
                    opacity: 0,
                    y: 80,
                });
            }
        };

        preLoaderAnim();

        return () => {
            tl.kill();
        };
    }, []);

    return (
        <div
            className="preloader gap-[5px] overflow-hidden text-[14px] sm:gap-[10px] sm:text-[16px] md:text-[18px] lg:text-[20px]"
            style={{
                alignItems: 'center',
                background: '#000000',
                bottom: 0,
                color: '#e5ebf2',
                display: 'flex',
                height: '100vh',
                justifyContent: 'center',
                left: 0,
                overflow: 'hidden !important',
                position: 'fixed',
                right: 0,
                width: '100%',
                zIndex: 55,
            }}
        >
            <div
                className="texts-container w-500 flex h-60 items-center justify-center gap-[5px] overflow-hidden text-[14px] font-bold text-[#e4ded7] opacity-0 sm:gap-[10px] sm:text-[16px] md:text-[18px] lg:text-[20px]"
                style={{
                    height: '60px',
                }}
            >
                <span>IlmTest</span>
                <span> / </span>

                <span className="flex items-center justify-center gap-3">
                    <Image alt="Window icon" aria-hidden height={30} src="/logo.svg" width={30} /> Islām In Its Original
                    Form
                </span>
                <div className="sub hidden"></div>
            </div>
        </div>
    );
};

export default PreLoader;
