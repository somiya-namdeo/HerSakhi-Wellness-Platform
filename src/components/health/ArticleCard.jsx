import { ExternalLink, Clock, Tag } from 'lucide-react'
import { motion } from 'framer-motion'

const ArticleCard = ({ article }) => {
  // Pastel pill color styles based on category
  let pillColor = 'bg-purple-50 text-[#6d28d9] border border-purple-200'
  if (article.category === 'Wellness & Lifestyle') pillColor = 'bg-emerald-50 text-[#047857] border border-emerald-200'
  if (article.category === 'Hormones & Conditions') pillColor = 'bg-pink-50 text-[#be185d] border border-pink-200'
  if (article.category === 'Hygiene & Care') pillColor = 'bg-sky-50 text-[#0369a1] border border-sky-200'
  if (article.category === 'Fitness & Self Care') pillColor = 'bg-amber-50 text-[#b45309] border border-amber-200'
  if (article.category === 'Fertility & Tracking') pillColor = 'bg-indigo-50 text-[#4338ca] border border-indigo-200'

  // Parse markdown link URL and detect domain
  const parseUrl = (urlStr) => {
    if (!urlStr) return { url: '#', domain: 'External Source' }
    
    // Check if it matches markdown link [text](link)
    const mdMatch = urlStr.match(/\[([^\]]+)\]\(([^)]+)\)/)
    let cleanUrl = urlStr
    if (mdMatch) {
      cleanUrl = mdMatch[2]
    } else {
      cleanUrl = urlStr.replace(/[\[\]]/g, '').trim()
    }
    
    try {
      // Handle special empty brackets in URL
      if (!cleanUrl) return { url: '#', domain: 'Medical Resource' }
      
      const urlObj = new URL(cleanUrl)
      let domain = urlObj.hostname.replace('www.', '')
      
      if (domain === 'pmc.ncbi.nlm.nih.gov') return { url: cleanUrl, domain: 'NCBI PMC' }
      if (domain === 'ncbi.nlm.nih.gov') return { url: cleanUrl, domain: 'PubMed / NCBI' }
      if (domain === 'pubmed.ncbi.nlm.nih.gov') return { url: cleanUrl, domain: 'PubMed' }
      if (domain === 'kids.frontiersin.org') return { url: cleanUrl, domain: 'Frontiers for Young Minds' }
      if (domain === 'mdpi.com') return { url: cleanUrl, domain: 'MDPI' }
      if (domain === 'medicalnewstoday.com') return { url: cleanUrl, domain: 'Medical News Today' }
      if (domain === 'womensmentalhealth.org') return { url: cleanUrl, domain: 'MGH Women\'s Mental Health' }
      if (domain === 'sciencedirect.com') return { url: cleanUrl, domain: 'ScienceDirect' }
      if (domain === 'cureus.com') return { url: cleanUrl, domain: 'Cureus Journal' }
      if (domain === 'my.clevelandclinic.org') return { url: cleanUrl, domain: 'Cleveland Clinic' }
      if (domain === 'drlenkliman.com.au') return { url: cleanUrl, domain: 'Dr. Len Kliman' }
      if (domain === 'healthline.com') return { url: cleanUrl, domain: 'Healthline' }
      if (domain === 'webmd.com') return { url: cleanUrl, domain: 'WebMD' }
      if (domain === 'healthdirect.gov.au') return { url: cleanUrl, domain: 'Healthdirect Australia' }
      if (domain === 'mayoclinic.org') return { url: cleanUrl, domain: 'Mayo Clinic' }
      if (domain === 'who.int') return { url: cleanUrl, domain: 'WHO' }
      if (domain === 'thewomens.org.au') return { url: cleanUrl, domain: 'The Women\'s Hospital' }
      if (domain === 'rghospitals.com') return { url: cleanUrl, domain: 'RG Hospitals' }
      if (domain === 'khni.kerry.com') return { url: cleanUrl, domain: 'Kerry Health & Nutrition' }
      if (domain === 'femalehealthawareness.org') return { url: cleanUrl, domain: 'Female Health Awareness' }
      if (domain === 'longdom.org') return { url: cleanUrl, domain: 'Longdom Publishing' }
      if (domain === 'reproductive-health.ed.ac.uk') return { url: cleanUrl, domain: 'University of Edinburgh' }
      if (domain === 'cloudninecare.com') return { url: cleanUrl, domain: 'Cloudnine Hospitals' }
      if (domain === 'cdc.gov') return { url: cleanUrl, domain: 'CDC' }
      if (domain === 'unicef.org') return { url: cleanUrl, domain: 'UNICEF' }
      if (domain === 'nhm.gov.in') return { url: cleanUrl, domain: 'NHM India' }
      if (domain === 'worldbank.org') return { url: cleanUrl, domain: 'World Bank' }
      if (domain === 'hsph.harvard.edu') return { url: cleanUrl, domain: 'Harvard T.H. Chan' }
      if (domain === 'unesco.org') return { url: cleanUrl, domain: 'UNESCO' }
      if (domain === 'plannedparenthood.org') return { url: cleanUrl, domain: 'Planned Parenthood' }
      if (domain === 'opa.hhs.gov') return { url: cleanUrl, domain: 'HHS Office of Population Affairs' }
      if (domain === 'walnuthillobgyn.com') return { url: cleanUrl, domain: 'Walnut Hill OBGYN' }
      if (domain === 'myavni.com') return { url: cleanUrl, domain: 'Avni' }
      
      return { url: cleanUrl, domain: domain.split('.')[0].toUpperCase() }
    } catch (e) {
      return { url: cleanUrl || '#', domain: 'Medical Journal' }
    }
  }

  const { url, domain } = parseUrl(article.url)

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-[2rem] p-6 shadow-sm border border-pink-100/30 flex flex-col justify-between h-full hover:shadow-md transition-shadow"
    >
      <div>
        {/* Category Pill and Read Time */}
        <div className="flex justify-between items-center mb-4">
          <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${pillColor}`}>
            {article.category}
          </span>
          <span className="text-xs text-gray-400 font-medium flex items-center gap-1 shrink-0">
            <Clock size={12} />
            {article.readTime}
          </span>
        </div>
        
        {/* Topic Tag */}
        <span className="text-[10px] font-bold text-[#8b5cf6] uppercase tracking-wider block mb-1">
          {article.topic}
        </span>
        
        {/* Title */}
        <h3 className="font-poppins font-semibold text-sm md:text-base text-[#2d1b45] mb-4 line-clamp-3 leading-snug">
          {article.title}
        </h3>
      </div>
      
      <div>
        {/* Tags Block */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {article.tags && article.tags.map((tag, idx) => (
            <span key={idx} className="text-[9px] bg-gray-50 text-gray-500 px-2 py-0.5 rounded-md font-medium border border-gray-100/50">
              #{tag}
            </span>
          ))}
        </div>
        
        {/* Resource Source Info & External Link Button */}
        <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between mt-auto">
          <div className="text-left">
            <span className="text-[9px] font-bold text-gray-400 uppercase block mb-0.5">Source:</span>
            <span className="text-xs font-semibold text-[#2d1b45] block max-w-[150px] truncate" title={domain}>
              {domain}
            </span>
          </div>

          <a 
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-bold text-xs shadow-soft transition-colors w-full sm:w-auto"
          >
            Read Article
            <ExternalLink size={12} className="shrink-0" />
          </a>
        </div>
      </div>
    </motion.div>
  )
}

export default ArticleCard
