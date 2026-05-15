import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Features from '../components/Features'
import ChatbotPreview from '../components/ChatbotPreview'
import HowItWorks from '../components/HowItWorks'
import CTA from '../components/CTA'
import Footer from '../components/Footer'

const Home = () => {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Features />
        <ChatbotPreview />
        <HowItWorks />
        <CTA />
      </main>
      <Footer />
    </>
  )
}

export default Home
