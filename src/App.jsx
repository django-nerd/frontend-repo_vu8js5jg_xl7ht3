import Hero from './components/Hero'
import JourneyBuilder from './components/JourneyBuilder'
import Footer from './components/Footer'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b0b10] via-[#120b10] to-[#0b0b10] relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(244,63,94,0.08),transparent_40%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_90%,rgba(59,130,246,0.06),transparent_40%)]" />

      <div className="relative">
        <Hero />
        <JourneyBuilder />
        <Footer />
      </div>
    </div>
  )
}

export default App
