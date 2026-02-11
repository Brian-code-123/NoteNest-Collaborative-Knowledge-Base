"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Play, Users, Folder, Search, Image as ImageIcon } from "lucide-react";

// Floating Card Component for 3D effect
const FloatingCard = ({ children, className, delay = 0, xOffset = 0, yOffset = 0, rotate = 0 }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20, rotate: rotate - 5 }}
    animate={{ 
      opacity: 1, 
      y: [0, -10, 0], 
      rotate: rotate 
    }}
    transition={{ 
      opacity: { duration: 0.5, delay },
      y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: delay * 0.5 },
      rotate: { duration: 0.5, delay }
    }}
    className={`absolute shadow-2xl rounded-3xl border border-white/20 backdrop-blur-sm ${className}`}
    style={{ transform: `translate(${xOffset}px, ${yOffset}px) rotate(${rotate}deg)` }}
  >
    {children}
  </motion.div>
);

const Hero = () => {
  return (
    <section className="relative min-h-[100vh] flex items-center pt-32 pb-20 overflow-hidden bg-[#F3F0E6] text-[#1A1A1A]">
      
      {/* Background Decorative Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        {/* Warm yellow glow top right */}
        <div className="absolute top-[-10%] right-[-5%] w-[40vw] h-[40vw] rounded-full bg-[#FFD93D]/20 blur-[120px]" />
        {/* Soft orange glow bottom left */}
        <div className="absolute bottom-[-10%] left-[-10%] w-[30vw] h-[30vw] rounded-full bg-[#FF6B6B]/10 blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative w-full z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left: Text Content */}
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center space-x-2 bg-white px-4 py-1.5 rounded-full shadow-sm mb-8 border border-black/5"
            >
              <span className="flex h-2 w-2 rounded-full bg-[#FF6B6B] animate-pulse" />
              <span className="text-sm font-bold tracking-wide uppercase text-[#1A1A1A]">MIT License • Open Source</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.8, ease: "easeOut" }}
              className="text-5xl md:text-7xl font-serif font-black text-[#1A1A1A] leading-[1.1] mb-8 tracking-tight"
            >
              Collaborative <br />
              Knowledge Base <br />
              <span className="relative inline-block z-10">
                for Teams.
                <svg className="absolute w-[110%] h-4 -bottom-1 -left-2 text-[#FFD93D] -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 15 100 5" stroke="currentColor" strokeWidth="12" fill="none" opacity="0.8" />
                </svg>
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-lg md:text-xl text-[#1A1A1A]/80 mb-10 max-w-lg mx-auto lg:mx-0 leading-relaxed font-medium"
            >
              NoteNest is an open-source, team-based knowledge base that allows users to create, organize, and collaborate on notes and documentation in real time.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }} 
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
               <Link
                href="/dashboard"
                className="group inline-flex items-center justify-center pl-8 pr-2 py-3 text-xl font-bold text-white bg-[#1A1A1A] rounded-full hover:bg-black hover:scale-105 transition-all duration-300 shadow-xl z-20"
              >
                Start Writing
                <div className="ml-6 w-14 h-14 bg-white text-black rounded-full flex items-center justify-center group-hover:rotate-45 transition-transform duration-300">
                   <ArrowRight className="w-6 h-6" />
                </div>
              </Link>
            </motion.div>

            <div className="mt-16 flex items-center justify-center lg:justify-start gap-4">
              <div className="flex -space-x-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-12 h-12 rounded-full border-4 border-[#F3F0E6] bg-gray-200 flex items-center justify-center text-xs font-bold bg-white text-black shadow-md relative z-0 hover:z-10 hover:scale-110 transition-transform">
                     <ImageIcon className="w-5 h-5 opacity-50" />
                  </div>
                ))}
              </div>
              <p className="text-base font-bold text-[#1A1A1A]">
                Trusted by 4,000+ teams
              </p>
            </div>
          </div>

          {/* Right: Visual Reference Implementation (The "Phones") */}
          <div className="relative h-[600px] lg:h-[700px] w-full hidden lg:block perspective-1000">
             
             {/* Center Card - "Shared to" (Beige/White) */}
             <FloatingCard 
                className="w-[20rem] xl:w-[22rem] bg-[#FDFBF7] p-8 z-20 left-10 lg:left-20 top-10 text-[#1A1A1A] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)]" 
                rotate={-2}
                yOffset={-20}
             >
                <div className="flex justify-between items-center mb-10">
                   <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center bg-white hover:bg-gray-50 cursor-pointer">←</div>
                   <div className="flex -space-x-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 border-2 border-white" />
                      <div className="w-10 h-10 rounded-full bg-green-100 border-2 border-white" />
                      <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center text-xs border-2 border-white">+3</div>
                   </div>
                </div>
                <h3 className="text-5xl font-serif font-bold mb-6 leading-[0.9]">Real-time<br/>Collab<br/>Engine</h3>
                <p className="text-sm text-[#1A1A1A]/60 mb-8 leading-relaxed font-medium">
                   Create, organize, and collaborate on documentation in real-time.
                </p>
                <div className="flex gap-3 mb-12">
                   <button className="w-14 h-14 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center text-2xl hover:scale-110 transition-transform shadow-lg">+</button>
                   <button className="w-14 h-14 rounded-full bg-[#EAE8DD] flex items-center justify-center hover:bg-[#E0DECD] transition-colors"><ImageIcon className="w-6 h-6 opacity-50" /></button>
                   <button className="w-14 h-14 rounded-full bg-[#EAE8DD] flex items-center justify-center hover:bg-[#E0DECD] transition-colors"><Folder className="w-6 h-6 opacity-50" /></button>
                </div>
                <div className="border-t-2 border-dashed border-gray-200 pt-6">
                   <p className="font-bold text-sm mb-3">Status:</p>
                   <div className="inline-block px-6 py-3 border-2 border-[#1A1A1A] rounded-[2rem_1rem_2rem_0.5rem] text-lg font-handwritten font-bold transform -rotate-1 hover:rotate-0 transition-transform cursor-cell bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                      Syncing...
                   </div>
                </div>
             </FloatingCard>

             {/* Bottom Left Card - "Dark Mode" (Black) */}
             <FloatingCard 
                className="w-72 bg-[#0F0F0F] text-white p-6 z-30 left-0 bottom-32 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)] border-none" 
                rotate={6} 
                delay={0.2}
                xOffset={-40}
             >
                <div className="flex justify-between items-start mb-6">
                   <div>
                     <h3 className="text-4xl font-serif mb-1 tracking-tight">My<br/>Notes</h3>
                   </div>
                   <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 cursor-pointer transition-colors">::</div>
                </div>
                <div className="flex gap-2 mb-8 text-xs font-bold">
                   <span className="px-4 py-1.5 rounded-full border border-white bg-white text-black">All 23</span>
                   <span className="px-4 py-1.5 rounded-full border border-white/20 text-white/60 hover:border-white/40 cursor-pointer transition-colors">Important</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                   <div className="bg-[#FF6B6B] text-[#1A1A1A] p-4 rounded-[1.5rem] h-44 flex flex-col justify-between hover:scale-[1.02] transition-transform cursor-pointer">
                     <div className="font-bold text-base leading-tight">Plan for<br/>The Day</div>
                     <div className="space-y-3">
                        <div className="flex items-center gap-2 text-xs font-bold"><div className="w-4 h-4 rounded-full bg-[#1A1A1A]/20 flex items-center justify-center">✓</div> Gym</div>
                        <div className="flex items-center gap-2 text-xs font-bold opaciy-60"><div className="w-4 h-4 rounded-full border border-[#1A1A1A]/40" /> Invest</div>
                     </div>
                   </div>
                   <div className="bg-[#FFD93D] text-[#1A1A1A] p-4 rounded-[1.5rem] h-44 relative overflow-hidden hover:scale-[1.02] transition-transform cursor-pointer">
                      <div className="font-bold text-base mb-1">Image<br/>Notes</div>
                      <div className="text-[10px] uppercase tracking-wide opacity-60 font-bold">Update 2h ago</div>
                      <div className="absolute bottom-0 right-0 w-20 h-20 bg-[#1A1A1A] rounded-tl-[2rem] flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-white/50" />
                      </div>
                   </div>
                </div>
             </FloatingCard>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
