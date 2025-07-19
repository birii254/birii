import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, Transition } from '@headlessui/react'

const Navigation = ({ user, isAuthenticated, onLogout, mobileMenuOpen, setMobileMenuOpen }) => {
  const [categoriesOpen, setCategoriesOpen] = useState(false)

  const categories = [
    { name: 'Electronics & Appliances', icon: 'fas fa-laptop', href: '/marketplace?category=electronics' },
    { name: 'Fashion & Beauty', icon: 'fas fa-tshirt', href: '/marketplace?category=fashion' },
    { name: 'Home & Furniture', icon: 'fas fa-couch', href: '/marketplace?category=furniture' },
    { name: 'Vehicles & Auto Parts', icon: 'fas fa-car', href: '/marketplace?category=automotive' },
    { name: 'Property & Real Estate', icon: 'fas fa-home', href: '/marketplace?category=property' },
    { name: 'Jobs & Services', icon: 'fas fa-briefcase', href: '/marketplace?category=services' },
    { name: 'Agriculture & Food', icon: 'fas fa-seedling', href: '/marketplace?category=agriculture' },
    { name: 'Health & Wellness', icon: 'fas fa-heartbeat', href: '/marketplace?category=health' },
    { name: 'Kids & Baby', icon: 'fas fa-baby', href: '/marketplace?category=kids' },
    { name: 'Education & Training', icon: 'fas fa-graduation-cap', href: '/marketplace?category=education' },
    { name: 'Events & Entertainment', icon: 'fas fa-music', href: '/marketplace?category=events' },
    { name: 'Others', icon: 'fas fa-ellipsis-h', href: '/marketplace?category=others' },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="w-10 h-10 matrix-gradient rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                <i className="fas fa-cube text-white text-lg"></i>
              </div>
              <span className="text-2xl font-bold gradient-text">Matrix</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link to="/marketplace" className="text-gray-700 hover:text-matrix-600 font-medium transition-colors duration-200 flex items-center space-x-1">
              <i className="fas fa-search text-sm"></i>
              <span>Browse</span>
            </Link>
            <Link to="/items/new" className="text-gray-700 hover:text-matrix-600 font-medium transition-colors duration-200 flex items-center space-x-1">
              <i className="fas fa-plus text-sm"></i>
              <span>Sell</span>
            </Link>
            <Link to="/featured" className="text-gray-700 hover:text-matrix-600 font-medium transition-colors duration-200 flex items-center space-x-1">
              <i className="fas fa-star text-sm"></i>
              <span>Featured</span>
            </Link>
            <Link to="/help-center" className="text-gray-700 hover:text-matrix-600 font-medium transition-colors duration-200 flex items-center space-x-1">
              <i className="fas fa-question-circle text-sm"></i>
              <span>Help</span>
            </Link>
            
            {/* Categories Dropdown */}
            <div className="relative">
              <button
                onClick={() => setCategoriesOpen(!categoriesOpen)}
                className="text-gray-700 hover:text-matrix-600 font-medium transition-colors duration-200 flex items-center space-x-1"
              >
                <i className="fas fa-th-large text-sm"></i>
                <span>Categories</span>
                <i className={`fas fa-chevron-down text-xs transition-transform duration-200 ${categoriesOpen ? 'rotate-180' : ''}`}></i>
              </button>
              
              {categoriesOpen && (
                <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50 max-h-96 overflow-y-auto">
                  <div className="grid grid-cols-2 gap-1 p-2">
                    {categories.map((category, index) => (
                      <Link
                        key={index}
                        to={category.href}
                        onClick={() => setCategoriesOpen(false)}
                        className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-150"
                      >
                        <i className={`${category.icon} text-matrix-500 w-5`}></i> {category.name}
                      </Link>
                    ))}
                  </div>
                  <div className="border-t border-gray-100 mt-2 pt-2">
                    <Link
                      to="/marketplace"
                      onClick={() => setCategoriesOpen(false)}
                      className="block px-4 py-2 text-sm text-matrix-600 hover:bg-matrix-50 font-medium"
                    >
                      View All Categories →
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {isAuthenticated && user ? (
              <>
                {/* Notifications */}
                <button className="relative p-2 text-gray-600 hover:text-matrix-600 transition-colors duration-200">
                  <i className="fas fa-bell text-lg"></i>
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse-slow">3</span>
                </button>

                {/* Messages */}
                <Link to="/inbox" className="relative p-2 text-gray-600 hover:text-matrix-600 transition-colors duration-200">
                  <i className="fas fa-envelope text-lg"></i>
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-matrix-500 text-white text-xs rounded-full flex items-center justify-center">2</span>
                </Link>

                {/* User Menu */}
                <Menu as="div" className="relative">
                  <Menu.Button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                    {user?.profile_picture ? (
                      <img src={user.profile_picture} alt="Profile" className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                      <div className="w-8 h-8 matrix-gradient rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-semibold">{user?.username?.[0]?.toUpperCase()}</span>
                      </div>
                    )}
                    <i className="fas fa-chevron-down text-xs text-gray-500"></i>
                  </Menu.Button>
                  
                  <Transition
                    enter="transition ease-out duration-200"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to="/dashboard"
                            className={`block px-4 py-2 text-sm ${active ? 'bg-gray-50' : ''} text-gray-700 transition-colors duration-150`}
                          >
                            <i className="fas fa-tachometer-alt text-matrix-500 w-5"></i> Dashboard
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to="/profile"
                            className={`block px-4 py-2 text-sm ${active ? 'bg-gray-50' : ''} text-gray-700 transition-colors duration-150`}
                          >
                            <i className="fas fa-user text-matrix-500 w-5"></i> Profile
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to="/favorites"
                            className={`block px-4 py-2 text-sm ${active ? 'bg-gray-50' : ''} text-gray-700 transition-colors duration-150`}
                          >
                            <i className="fas fa-heart text-matrix-500 w-5"></i> Favorites
                          </Link>
                        )}
                      </Menu.Item>
                      {user?.is_staff && (
                        <>
                          <hr className="my-2" />
                          <Menu.Item>
                            {({ active }) => (
                              <a
                                href="/admin/"
                                className={`block px-4 py-2 text-sm ${active ? 'bg-blue-50' : ''} text-blue-600 transition-colors duration-150`}
                              >
                                <i className="fas fa-shield-alt text-blue-500 w-5"></i> Admin Panel
                              </a>
                            )}
                          </Menu.Item>
                        </>
                      )}
                      <hr className="my-2" />
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={onLogout}
                            className={`block w-full text-left px-4 py-2 text-sm ${active ? 'bg-red-50' : ''} text-red-600 transition-colors duration-150`}
                          >
                            <i className="fas fa-sign-out-alt text-red-500 w-5"></i> Logout
                          </button>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-matrix-600 font-medium transition-colors duration-200">
                  Login
                </Link>
                <Link to="/signup" className="matrix-gradient hover:opacity-90 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105">
                  Sign Up
                </Link>
              </>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-600 hover:text-matrix-600 transition-colors duration-200"
            >
              <i className="fas fa-bars text-lg"></i>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navigation