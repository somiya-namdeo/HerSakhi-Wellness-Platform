import ArticleCard from './ArticleCard'
import { motion } from 'framer-motion'

const FeaturedArticles = () => {
  const articles = [
    {
      title: "Understanding Your Menstrual Cycle",
      category: "Menstrual Health",
      readTime: "5 min read",
      description: "A comprehensive guide to the four phases of your cycle and what to expect."
    },
    {
      title: "Best Foods During Your Period",
      category: "Nutrition",
      readTime: "4 min read",
      description: "Nutrient-rich foods that can help reduce cramps and boost energy levels."
    },
    {
      title: "Managing PMS & Mood Swings",
      category: "Mental Health",
      readTime: "6 min read",
      description: "Evidence-based strategies to handle emotional changes during your cycle."
    },
    {
      title: "Yoga Poses for Period Pain",
      category: "Exercise",
      readTime: "7 min read",
      description: "Gentle yoga sequences to relieve cramps and promote relaxation."
    },
    {
      title: "PCOS: Symptoms and Management",
      category: "PCOS",
      readTime: "8 min read",
      description: "Understanding Polycystic Ovary Syndrome and how to manage it naturally."
    },
    {
      title: "Period Product Guide",
      category: "Hygiene",
      readTime: "5 min read",
      description: "Compare pads, tampons, cups, and period underwear to find what works for you."
    }
  ]

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-poppins font-bold text-dark mb-8">Featured Articles</h2>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {articles.map((article, index) => (
          <ArticleCard key={index} article={article} />
        ))}
      </motion.div>
    </div>
  )
}

export default FeaturedArticles
