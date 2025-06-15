import React from 'react'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { FiCalendar, FiBell, FiSearch } from 'react-icons/fi'
import { getFullImageUrl } from './utils'

const DashboardHeader = () => {
  const profile = useSelector(state => state.doctor.profile)
  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric' 
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8"
    >
      <div>
        {profile && (
          <motion.div 
            className="mt-2 space-y-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
<p className="text-lg text-gray-700 dark:text-gray-300">
  Welcome back,{" "}
  <span className="font-semibold text-primary-600 dark:text-primary-400">
    {profile.user?.full_name || ` Dr:${profile?.user?.username}`}
  </span>
</p>            <div className="flex items-center gap-3">
              <span className="px-3 py-1.5 text-sm font-medium rounded-full bg-gradient-to-r from-blue-500/10 to-indigo-500/10 text-blue-700 dark:from-blue-400/20 dark:to-indigo-400/20 dark:text-blue-300 border border-blue-100/50 dark:border-blue-700/30 shadow-sm backdrop-blur-sm">
                {profile.specialty || 'Specialty'}
              </span>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {today}
              </span>
            </div>
          </motion.div>
        )}
      </div>

      <div className="flex items-center gap-4">
        <motion.div 
          className="relative"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />
        </motion.div>

        <motion.button
          className="relative p-2 rounded-full text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <FiBell className="w-5 h-5" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </motion.button>

        {profile?.user?.image && (
          <motion.div
            className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary-500"
            whileHover={{ scale: 1.05 }}
          >
            <img 
              src={getFullImageUrl(profile.user.image)} 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

export default DashboardHeader
