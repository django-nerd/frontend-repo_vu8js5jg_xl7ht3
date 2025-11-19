import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import CircleCard from './CircleCard'
import { fetchJSON } from '../utils/api'

export default function JourneyBuilder() {
  const [circles, setCircles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [mood, setMood] = useState('curious')
  const [interest, setInterest] = useState('literature')
  const [intensity, setIntensity] = useState(5)

  const [journey, setJourney] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchJSON('/api/inferno/circles', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        })
        setCircles(data)
      } catch (e) {
        setError('Failed to fetch circles')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const buildJourney = async () => {
    setSubmitting(true)
    try {
      const data = await fetchJSON('/api/inferno/journey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mood, interest, intensity })
      })
      setJourney(data)
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
    } catch (e) {
      setError('Failed to build journey')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div className="text-center text-white/70 p-10">Loading the circles…</div>
  if (error) return <div className="text-center text-rose-300 p-10">{error}</div>

  return (
    <section className="relative py-12 md:py-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-10 items-start">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white">Choose your lens</h2>
            <p className="text-white/70 mt-2">Your descent adapts to your state of mind.</p>

            <div className="mt-6 grid gap-5">
              <div className="grid grid-cols-2 gap-3">
                {['curious','somber','reflective','adventurous'].map(m => (
                  <button
                    key={m}
                    onClick={() => setMood(m)}
                    className={`px-4 py-2 rounded-xl border transition ${mood===m?'bg-white/10 border-rose-400/60 text-white':'border-white/10 text-white/70 hover:border-white/20'}`}
                  >{m}</button>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-3">
                {['literature','psychology','myth','morality','aesthetics'].map(i => (
                  <button
                    key={i}
                    onClick={() => setInterest(i)}
                    className={`px-4 py-2 rounded-xl border transition ${interest===i?'bg-white/10 border-rose-400/60 text-white':'border-white/10 text-white/70 hover:border-white/20'}`}
                  >{i}</button>
                ))}
              </div>

              <div>
                <div className="flex items-center justify-between text-white/70 mb-2">
                  <span>Intensity</span>
                  <span className="font-semibold text-white">{intensity}</span>
                </div>
                <input type="range" min="1" max="10" value={intensity} onChange={e=>setIntensity(parseInt(e.target.value))} className="w-full accent-rose-400" />
              </div>

              <button onClick={buildJourney} disabled={submitting} className="px-5 py-3 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-semibold disabled:opacity-60">
                {submitting? 'Weaving your path…' : 'Begin descent'}
              </button>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {circles.map(c => (
              <CircleCard key={c.id} circle={c} onSelect={()=>{}} active={false} />
            ))}
          </div>
        </div>

        <AnimatePresence>
          {journey && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-12 border border-white/10 rounded-2xl p-6 bg-white/5"
            >
              <h3 className="text-2xl font-bold text-white mb-4">{journey.title}</h3>
              <ol className="space-y-4">
                {journey.path.map((stop, idx) => (
                  <li key={idx} className="p-4 rounded-xl bg-black/20 border border-white/10">
                    <div className="text-white font-semibold">{stop.title}</div>
                    <div className="text-white/70 mt-1">{stop.takeaway}</div>
                  </li>
                ))}
              </ol>
              <p className="text-white/70 mt-6">{journey.note}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
