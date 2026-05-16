const DangerZone = ({ user }) => {
  const handleExport = () => {
    const data = {
      profile: user,
      settings: {
        notifications: localStorage.getItem('hersakhi_notifications'),
        darkMode: localStorage.getItem('hersakhi_darkMode')
      },
      export_date: new Date().toISOString()
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `hersakhi_data_${user?.full_name?.replace(/\s+/g, '_').toLowerCase() || 'user'}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleDelete = () => {
    alert("Account deletion will be added later for safety.")
  }

  return (
    <div className="bg-white rounded-[2rem] p-6 lg:p-8 shadow-sm border border-red-100">
      <h3 className="font-poppins font-semibold text-xl text-dark mb-2">Danger Zone</h3>
      <p className="text-sm text-gray-500 mb-6">These actions are irreversible. Please proceed with caution.</p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <button 
          onClick={handleExport}
          className="px-6 py-3 rounded-2xl border border-primary/30 text-primary font-semibold text-sm hover:bg-primary hover:text-white transition-colors"
        >
          Export Data
        </button>
        <button 
          onClick={handleDelete}
          className="px-6 py-3 rounded-2xl border border-red-200 text-red-500 font-semibold text-sm hover:bg-red-50 transition-colors"
        >
          Delete Account
        </button>
      </div>
    </div>
  )
}

export default DangerZone
