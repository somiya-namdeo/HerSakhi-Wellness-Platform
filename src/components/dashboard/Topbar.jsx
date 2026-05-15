import { Bell, User as UserIcon } from 'lucide-react'

const Topbar = () => {
  return (
    <div className="w-full h-24 px-6 lg:px-10 flex items-center justify-between z-30 sticky top-0 bg-background/80 backdrop-blur-md">
      <div className="ml-14 lg:ml-0">
        <h1 className="text-2xl font-poppins font-bold text-dark">Dashboard</h1>
      </div>
      
      <div className="flex items-center gap-4 sm:gap-6">
        <button className="relative p-2 text-gray-500 hover:text-primary transition-colors bg-white lg:bg-transparent rounded-full shadow-sm lg:shadow-none">
          <Bell size={24} />
          <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
        </button>
        
        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white shadow-md cursor-pointer transform hover:scale-105 transition-transform">
          <UserIcon size={20} />
        </div>
      </div>
    </div>
  )
}

export default Topbar
