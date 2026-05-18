import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, BookOpen, ExternalLink, HelpCircle } from 'lucide-react'
import { motion } from 'framer-motion'

import Sidebar from '../components/dashboard/Sidebar'
import Topbar from '../components/dashboard/Topbar'

import { healthArticles } from '../data/healthArticles'
import ArticleCard from '../components/health/ArticleCard'
import CategoryFilter from '../components/health/CategoryFilter'

const HealthTips = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  // Get unique categories dynamically
  const categories = ['All', ...new Set(healthArticles.map(a => a.category))]

  // Filter articles dynamically based on search query and category
  const filteredArticles = healthArticles.filter(article => {
    const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory
    
    const query = searchQuery.toLowerCase().trim()
    const matchesSearch = !query || 
                          article.title.toLowerCase().includes(query) ||
                          article.topic.toLowerCase().includes(query) ||
                          article.category.toLowerCase().includes(query) ||
                          article.tags.some(t => t.toLowerCase().includes(query))
                          
    return matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-screen bg-[#fdf7fb] flex font-inter">
      <Sidebar />
      
      <div className="flex-1 lg:ml-72 flex flex-col min-w-0">
        <Topbar title="Health & Wellness Tips" />
        
        <main className="flex-1 p-6 lg:p-10 max-w-[1400px] mx-auto w-full">
          
          {/* Header Stats & Search */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <h2 className="text-2xl font-poppins font-bold text-[#2d1b45]">Wellness Knowledge Base</h2>
              <p className="text-sm text-gray-600 mt-1 font-medium">
                Trusted external medical resources
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                Note: Articles open in a new tab
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center w-full md:w-auto">
              {/* Explore Myth Busters Top Button */}
              <button 
                onClick={() => navigate('/myth-busters')}
                className="inline-flex items-center justify-center gap-1.5 py-2.5 px-5 rounded-2xl bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-bold text-sm shadow-soft transition-colors whitespace-nowrap"
              >
                <HelpCircle size={16} />
                Explore Myth Busters
              </button>

              {/* Search Bar */}
              <div className="relative w-full sm:max-w-xs">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 pointer-events-none">
                  <Search size={16} />
                </span>
                <input 
                  type="text"
                  placeholder="Search title, topic, category, tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-2xl border border-pink-200 focus:outline-none focus:border-[#8b5cf6] bg-white text-[#2d1b45]"
                />
              </div>
            </div>
          </div>

          {/* Quick Counter Row */}
          <div className="bg-white rounded-3xl p-5 border border-pink-100/30 shadow-sm flex items-center justify-between mb-8">
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                Total Dynamic Articles
              </span>
              <p className="text-xl font-poppins font-bold text-[#2d1b45] mt-0.5">
                {filteredArticles.length} <span className="text-xs font-medium text-gray-400">showing of {healthArticles.length} curated resources</span>
              </p>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-purple-50 flex items-center justify-center text-[#8b5cf6]">
              <BookOpen size={18} />
            </div>
          </div>

          {/* Category Tabs */}
          <CategoryFilter 
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />

          {/* Articles Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredArticles.length > 0 ? (
              filteredArticles.map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: Math.min(index * 0.03, 0.4) }}
                >
                  <ArticleCard article={article} />
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-gray-400 text-sm bg-white rounded-3xl border border-pink-100/30">
                No health articles match your search or filter criteria.
              </div>
            )}
          </div>

          {/* Myth Busters Navigation Banner */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-[#fdf7fb] border border-pink-100 rounded-[2rem] p-8 lg:p-10 text-center relative overflow-hidden mb-8"
          >
            <div className="max-w-2xl mx-auto relative z-10">
              <span className="text-[10px] font-bold text-[#8b5cf6] uppercase tracking-wider block mb-2">
                Fact Check
              </span>
              <h3 className="font-poppins font-bold text-xl md:text-2xl text-[#2d1b45] mb-2">
                Myth Busters
              </h3>
              <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                Clear common doubts about periods and women’s wellness. Distinguish evidence-based biological facts from long-held taboos.
              </p>
              <button 
                onClick={() => navigate('/myth-busters')}
                className="bg-white border border-pink-200 hover:bg-[#8b5cf6]/10 text-[#8b5cf6] font-bold py-3 px-8 rounded-2xl shadow-soft hover:shadow-md transition-all text-sm inline-flex items-center gap-1.5"
              >
                <HelpCircle size={16} />
                Explore Myths
              </button>
            </div>
            
            {/* Subtle decorative circles */}
            <div className="absolute top-0 left-0 w-24 h-24 bg-pink-100/10 rounded-full blur-xl -translate-x-6 -translate-y-6"></div>
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-purple-100/10 rounded-full blur-xl translate-x-6 translate-y-6"></div>
          </motion.div>

        </main>
      </div>
    </div>
  )
}

export default HealthTips
