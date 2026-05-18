import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, ChevronLeft, HelpCircle } from 'lucide-react'
import { motion } from 'framer-motion'

import Sidebar from '../components/dashboard/Sidebar'
import Topbar from '../components/dashboard/Topbar'

import { mythBusters } from '../data/mythBusters'
import MythCard from '../components/health/MythCard'
import CategoryFilter from '../components/health/CategoryFilter'

const MythBusters = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  // Get unique categories dynamically
  const categories = ['All', ...new Set(mythBusters.map(m => m.category))]

  // Filter myths dynamically
  const filteredMyths = mythBusters.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory
    
    const query = searchQuery.toLowerCase().trim()
    const matchesSearch = !query ||
                          item.myth.toLowerCase().includes(query) ||
                          item.fact.toLowerCase().includes(query) ||
                          item.explanation.toLowerCase().includes(query) ||
                          (item.tags && item.tags.some(t => t.toLowerCase().includes(query)))
                          
    return matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-screen bg-[#fdf7fb] flex font-inter">
      <Sidebar />
      
      <div className="flex-1 lg:ml-72 flex flex-col min-w-0">
        <Topbar title="Myth Busters" />
        
        <main className="flex-1 p-6 lg:p-10 max-w-[1400px] mx-auto w-full">
          
          {/* Back button and page title */}
          <div className="mb-6 flex items-center gap-3">
            <button 
              onClick={() => navigate('/health-tips')}
              className="w-10 h-10 rounded-2xl bg-white border border-pink-100 flex items-center justify-center text-gray-500 hover:text-[#8b5cf6] hover:border-[#8b5cf6]/30 transition-all shadow-sm"
              title="Back to Health Tips"
            >
              <ChevronLeft size={18} />
            </button>
            <div>
              <h2 className="text-xl font-poppins font-bold text-[#2d1b45] flex items-center gap-2">
                <HelpCircle size={20} className="text-[#8b5cf6]" />
                Period Myth Busters
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Debunking misconceptions with medical facts and science
              </p>
            </div>
          </div>

          {/* Stats Bar & Search */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 bg-white p-6 rounded-[2rem] border border-pink-100/30 shadow-sm">
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                Total Myths Debunked
              </span>
              <p className="text-2xl font-poppins font-bold text-[#2d1b45] mt-1">
                {filteredMyths.length} <span className="text-sm font-normal text-gray-400">showing of {mythBusters.length} myths</span>
              </p>
            </div>
            
            {/* Search Input */}
            <div className="relative w-full md:max-w-xs">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 pointer-events-none">
                <Search size={16} />
              </span>
              <input 
                type="text"
                placeholder="Search myths, facts, tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-2xl border border-pink-200 focus:outline-none focus:border-[#8b5cf6] bg-[#fdf7fb] text-[#2d1b45]"
              />
            </div>
          </div>

          {/* Category Filter Tab list */}
          <CategoryFilter 
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />

          {/* Myths Grid list */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {filteredMyths.length > 0 ? (
              filteredMyths.map((item, index) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: Math.min(index * 0.02, 0.4) }}
                >
                  <MythCard mythItem={item} />
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-gray-400 text-sm bg-white rounded-3xl border border-pink-100/30">
                No myth busters found matching your search criteria.
              </div>
            )}
          </div>

        </main>
      </div>
    </div>
  )
}

export default MythBusters
