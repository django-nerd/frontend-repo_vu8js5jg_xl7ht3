import { motion } from 'framer-motion'

export default function CircleCard({ circle, onSelect, active }) {
  return (
    <motion.button
      onClick={() => onSelect(circle)}
      className={`group relative w-full text-left p-5 rounded-2xl border transition ${
        active ? 'border-rose-400/70 bg-rose-400/10 shadow-[0_0_0_2px_rgba(244,63,94,0.15),0_10px_30px_-10px_rgba(244,63,94,0.5)]' : 'border-white/10 hover:border-white/20 hover:bg-white/5'
      }`}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm uppercase tracking-wide text-white/60">{circle.sin}</div>
          <div className="mt-1 text-2xl font-semibold text-white">{circle.name}</div>
        </div>
        <div className="h-10 w-10 rounded-full" style={{ background: circle.color }} />
      </div>
      {circle.quote && (
        <p className="mt-3 text-white/70 italic">“{circle.quote}”</p>
      )}
      <div className="mt-4 flex gap-2 flex-wrap">
        {circle.guardians.map((g, i) => (
          <span key={i} className="text-xs px-2 py-1 rounded-full bg-white/10 text-white/70">{g}</span>
        ))}
      </div>
    </motion.button>
  )
}
