"use client";
import Link from "next/link";
import React, { useEffect, useRef } from "react";
import { Button } from "../ui/button";

const HeroSection = () => {

  return (
    <section className="pt-40 pb-20 px-4 ">
    <div className="container mx-auto text-center h-screen">
      <h1 className="text-5xl md:text-8xl lg:text-[105px] pb-6 gradient-title">
        Manage Your Finances <br /> with Intelligence
      </h1>
      <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
        An AI-powered financial management platform that helps you track,
        analyze, and optimize your spending with real-time insights.
      </p>
      <div className="flex justify-center space-x-4">
        <Link href="/dashboard">
          <Button size="lg" className="px-8">
            Get Started
          </Button>
        </Link>
        <Link href="https://www.youtube.com/roadsidecoder">
          <Button size="lg" variant="outline" className="px-8">
            Watch Demo
          </Button>
        </Link>
      </div>

    </div>
  </section>
  );
};

export default HeroSection;
