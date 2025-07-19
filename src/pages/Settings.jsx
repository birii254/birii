import React, { useState } from 'react'
import { useTheme } from '../components/ThemeProvider'
import { useAuthStore } from '../store/authStore'

const Settings = () => {
  const { theme, setTheme } = useTheme()
  const { user } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)

  const handleThemeChange = async (newTheme) => {
    setIsLoading(true)
    try {
      setTheme(newTheme)
      // You can also save to backend if needed
      setTimeout(() => setIsLoading(false), 500)
    } catch (error) {
      console.error('Error updating theme:', error)
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-1">Manage your account preferences</p>
      </div>

      {/* Theme Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-8 border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Appearance</h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-4">Theme Preference</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => handleThemeChange('light')}
                disabled={isLoading}
                className={`relative cursor-pointer p-6 rounded-xl border-2 transition-all duration-200 ${
                  theme === 'light'
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-primary-300 dark:hover:border-primary-400'
                } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white border border-gray-300 rounded-lg flex items-center justify-center shadow-sm">
                    <i className="fas fa-sun text-yellow-500 text-xl"></i>
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Light Mode</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Clean and bright interface</p>
                  </div>
                </div>
                {theme === 'light' && (
                  <div className="absolute top-3 right-3">
                    <i className="fas fa-check-circle text-primary-500 text-xl"></i>
                  </div>
                )}
              </button>
              
              <button
                onClick={() => handleThemeChange('dark')}
                disabled={isLoading}
                className={`relative cursor-pointer p-6 rounded-xl border-2 transition-all duration-200 ${
                  theme === 'dark'
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-primary-300 dark:hover:border-primary-400'
                } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-800 border border-gray-600 rounded-lg flex items-center justify-center shadow-sm">
                    <i className="fas fa-moon text-blue-400 text-xl"></i>
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Dark Mode</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Easy on the eyes</p>
                  </div>
                </div>
                {theme === 'dark' && (
                  <div className="absolute top-3 right-3">
                    <i className="fas fa-check-circle text-primary-500 text-xl"></i>
                  </div>
                )}
              </button>
            </div>
          </div>
          
          {isLoading && (
            <div className="flex items-center justify-center py-4">
              <i className="fas fa-spinner fa-spin text-primary-600 mr-2"></i>
              <span className="text-gray-600 dark:text-gray-300">Applying theme...</span>
            </div>
          )}
        </div>
      </div>

      {/* Account Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-8 border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Account</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Change Password</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Update your account password</p>
            </div>
            <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200">
              Change
            </button>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Two-Factor Authentication</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Add an extra layer of security</p>
            </div>
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200">
              Enable
            </button>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <div>
              <h3 className="font-semibold text-red-900 dark:text-red-400">Delete Account</h3>
              <p className="text-sm text-red-600 dark:text-red-300">Permanently delete your account and all data</p>
            </div>
            <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200">
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Email Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-8 border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Email Preferences</h2>
        
        <div className="space-y-4">
          <label className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Marketing Emails</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Receive updates about new features and promotions</p>
            </div>
            <input 
              type="checkbox" 
              defaultChecked 
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
          </label>
          
          <label className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Order Updates</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Get notified about your order status</p>
            </div>
            <input 
              type="checkbox" 
              defaultChecked 
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
          </label>
          
          <label className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Security Alerts</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Important security notifications</p>
            </div>
            <input 
              type="checkbox" 
              defaultChecked 
              disabled
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 opacity-50"
            />
          </label>
        </div>
      </div>
    </div>
  )
}

export default Settings