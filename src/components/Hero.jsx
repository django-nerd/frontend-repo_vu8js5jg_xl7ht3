import { motion } from 'framer-motion'
import React, { Suspense } from 'react'

const Spline = React.lazy(() => import('@splinetool/react-spline'))

function SafeSpline({ scene }) {
  return (
    <Suspense fallback={<div className="w-full h-full" />}> 
      <Spline scene={scene} onError={() => { /* ignore rendering errors */ }} />
    </Suspense>
  )
}

export default function Hero() {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(244,63,94,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(34,197,94,0.08),transparent_40%)]" />
      </div>

      <div className="absolute -right-24 -bottom-48 w-[700px] h-[700px] opacity-30 hidden lg:block">
        <SafeSpline scene="https://prod.spline.design/7oLk0m8-PlaceholderScene/scene.splinecode" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <motion.h1
          className="text-5xl md:text-7xl font-black tracking-tight bg-gradient-to-b from-rose-100 via-rose-50 to-amber-100 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Descend with Grace
        </motion.h1>
        <motion.p
          className="mt-6 text-lg md:text-xl text-rose-100/80 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          A contemplative guide through the Nine Circles — blending poetry, myth, and modern reflection. Choose your mood, pick your focus, and let the journey shape itself.
        </motion.p>
      </div>

      <motion.div
        className="absolute left-1/2 -translate-x-1/2 bottom-10 text-rose-200/70 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        Scroll to begin
      </motion.div>
    </section>
  )
}
