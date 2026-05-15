const DangerZone = () => {
  return (
    <div className="bg-white rounded-[2rem] p-6 lg:p-8 shadow-sm border border-red-200">
      <h3 className="font-poppins font-semibold text-xl text-dark mb-2">Danger Zone</h3>
      <p className="text-sm text-gray-500 mb-6">These actions are irreversible. Please proceed with caution.</p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <button className="px-6 py-3 rounded-2xl border border-[#a78bfa]/50 text-[#a78bfa] font-semibold text-sm hover:bg-[#a78bfa] hover:text-white transition-colors">
          Export Data
        </button>
        <button className="px-6 py-3 rounded-2xl border border-red-200 text-red-500 font-semibold text-sm hover:bg-red-50 transition-colors">
          Delete Account
        </button>
      </div>
    </div>
  )
}

export default DangerZone
