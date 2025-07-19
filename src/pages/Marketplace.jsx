import React, { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useQuery } from 'react-query'
import { itemsAPI, categoriesAPI } from '../services/api'

const Marketplace = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [viewMode, setViewMode] = useState('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const query = searchParams.get('query') || ''
  const category = searchParams.get('category') || ''
  const page = searchParams.get('page') || 1

  useEffect(() => {
    setSearchQuery(query)
  }, [query])

  const { data: items, isLoading: itemsLoading } = useQuery(
    ['items', { query, category, page }],
    () => itemsAPI.getItems({ 
      search: query, 
      category: category,
      page: page,
      status: 'active',
      admin_approved: true
    }),
    {
      select: (response) => response.data,
      keepPreviousData: true,
    }
  )

  const { data: categories, isLoading: categoriesLoading } = useQuery(
    'categories',
    categoriesAPI.getCategories,
    {
      select: (response) => response.data,
      staleTime: 5 * 60 * 1000,
    }
  )

  const handleSearch = (e) => {
    e.preventDefault()
    const newParams = new URLSearchParams(searchParams)
    if (searchQuery.trim()) {
      newParams.set('query', searchQuery.trim())
    } else {
      newParams.delete('query')
    }
    newParams.delete('page')
    setSearchParams(newParams)
  }

  const handleCategoryFilter = (categorySlug) => {
    const newParams = new URLSearchParams(searchParams)
    if (categorySlug) {
      newParams.set('category', categorySlug)
    } else {
      newParams.delete('category')
    }
    newParams.delete('page')
    setSearchParams(newParams)
  }

  const clearFilters = () => {
    setSearchParams({})
    setSearchQuery('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Enhanced Hero Search Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary-600 via-primary-700 to-purple-700 text-white mb-8">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-8">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              Discover Amazing <span className="text-yellow-300">Products</span>
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Find exactly what you're looking for from our community of trusted sellers
            </p>
          </div>
          
          {/* Enhanced Search Bar */}
          <form onSubmit={handleSearch} className="max-w-4xl mx-auto">
            <div className="flex items-center bg-white rounded-2xl shadow-2xl p-2">
              <div className="flex-1 relative">
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for products, brands, or categories..."
                  className="w-full pl-12 pr-4 py-4 text-gray-900 text-lg rounded-xl focus:outline-none"
                />
                <i className="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl"></i>
              </div>
              <button 
                type="submit" 
                className="bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-200 transform hover:scale-105"
              >
                Search
              </button>
            </div>
          </form>
          
          {/* Quick Categories */}
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            {categories?.slice(0, 6).map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryFilter(cat.slug)}
                className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 transform hover:scale-105"
              >
                <i className={`${cat.icon} mr-2`}></i>
                {cat.name}
              </button>
            ))}
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-8">
          {/* Enhanced Sidebar Filters */}
          <div className={`w-full lg:w-1/4 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="sticky top-24 space-y-6">
              {/* Filter Header */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-6 flex items-center text-lg">
                  <i className="fas fa-filter text-primary-600 mr-3"></i>
                  Smart Filters
                </h3>
                
                {/* Categories */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                    <i className="fas fa-tags text-primary-500 mr-2"></i>
                    Categories
                  </h4>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    <button
                      onClick={() => handleCategoryFilter('')}
                      className={`w-full text-left flex items-center justify-between p-3 rounded-xl transition-all duration-200 ${
                        !category 
                          ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg' 
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <span className="font-medium">All Categories</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        !category ? 'bg-white/20' : 'bg-gray-200'
                      }`}>
                        {items?.count || 0}
                      </span>
                    </button>
                    {!categoriesLoading && categories?.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => handleCategoryFilter(cat.slug)}
                        className={`w-full text-left flex items-center justify-between p-3 rounded-xl transition-all duration-200 ${
                          category === cat.slug 
                            ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg' 
                            : 'hover:bg-gray-50 text-gray-700'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <i className={`${cat.icon || 'fas fa-tag'} ${
                            category === cat.slug ? 'text-white' : 'text-primary-500'
                          }`}></i>
                          <span className="font-medium">{cat.name}</span>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          category === cat.slug ? 'bg-white/20' : 'bg-gray-200'
                        }`}>
                          {cat.items_count || 0}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Price Range */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                    <i className="fas fa-dollar-sign text-green-500 mr-2"></i>
                    Price Range
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <input 
                        type="number" 
                        placeholder="Min" 
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                      <span className="text-gray-500 font-medium">-</span>
                      <input 
                        type="number" 
                        placeholder="Max" 
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                    <button className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105">
                      Apply Range
                    </button>
                  </div>
                </div>
                
                {/* Condition Filter */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                    <i className="fas fa-star text-yellow-500 mr-2"></i>
                    Condition
                  </h4>
                  <div className="space-y-2">
                    {[
                      { value: 'new', label: 'Brand New', color: 'text-green-600' },
                      { value: 'like_new', label: 'Like New', color: 'text-blue-600' },
                      { value: 'excellent', label: 'Excellent', color: 'text-purple-600' },
                      { value: 'good', label: 'Good', color: 'text-orange-600' },
                    ].map((condition) => (
                      <label key={condition.value} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-150">
                        <input 
                          type="checkbox" 
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className={`text-sm font-medium ${condition.color}`}>
                          {condition.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
                
                {/* Clear Filters */}
                <button
                  onClick={clearFilters}
                  className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  <i className="fas fa-times mr-2"></i>Clear All Filters
                </button>
              </div>
              
              {/* Featured Deals */}
              <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl p-6 text-white shadow-lg">
                <h4 className="font-bold text-lg mb-3 flex items-center">
                  <i className="fas fa-fire mr-2"></i>
                  Hot Deals
                </h4>
                <p className="text-sm mb-4 text-yellow-100">
                  Don't miss out on these limited-time offers!
                </p>
                <button className="bg-white text-orange-600 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-gray-100 transition-colors duration-200">
                  View Deals
                </button>
              </div>
            </div>
          </div>

          {/* Enhanced Main Product Grid */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <div>
                    <span className="text-2xl font-bold text-gray-900">
                      {items?.count || 0} Products
                    </span>
                    {query && (
                      <p className="text-gray-600 mt-1">
                        Results for "<span className="font-semibold text-primary-600">{query}</span>"
                      </p>
                    )}
                  </div>
                  <div className="hidden md:flex items-center space-x-2 text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
                    <i className="fas fa-clock text-green-500"></i>
                    <span>Updated 2 minutes ago</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <select className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white shadow-sm">
                    <option>Best Match</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                    <option>Newest First</option>
                    <option>Most Popular</option>
                  </select>
                  
                  <div className="flex items-center bg-gray-100 rounded-xl p-1 shadow-sm">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-3 rounded-lg transition-all duration-200 ${
                        viewMode === 'grid' 
                          ? 'bg-white shadow-md text-primary-600' 
                          : 'text-gray-600 hover:text-primary-600'
                      }`}
                    >
                      <i className="fas fa-th"></i>
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-3 rounded-lg transition-all duration-200 ${
                        viewMode === 'list' 
                          ? 'bg-white shadow-md text-primary-600' 
                          : 'text-gray-600 hover:text-primary-600'
                      }`}
                    >
                      <i className="fas fa-list"></i>
                    </button>
                  </div>
                  
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-xl font-medium transition-colors duration-200"
                  >
                    <i className="fas fa-filter mr-2"></i>Filters
                  </button>
                </div>
              </div>
            </div>

            {/* Product Grid */}
            {itemsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl shadow-lg p-4 animate-pulse">
                    <div className="bg-gray-300 h-48 rounded-xl mb-4"></div>
                    <div className="bg-gray-300 h-4 rounded mb-2"></div>
                    <div className="bg-gray-300 h-4 rounded w-2/3 mb-2"></div>
                    <div className="bg-gray-300 h-6 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {items?.results?.map((item) => (
                  <div key={item.id} className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-gray-100">
                    <div className="relative overflow-hidden">
                      <img
                        src={item.image || 'https://images.pexels.com/photos/276517/pexels-photo-276517.jpeg?auto=compress&cs=tinysrgb&w=400'}
                        alt={item.name}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      
                      {/* Status Badge */}
                      <div className="absolute top-3 left-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-lg ${
                          item.status === 'active' ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' : 
                          item.status === 'sold' ? 'bg-gradient-to-r from-red-500 to-red-600 text-white' : 
                          'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white'
                        }`}>
                          {item.status === 'active' ? 'Available' : 
                           item.status === 'sold' ? 'Sold' : 
                           item.status}
                        </span>
                      </div>
                      
                      {/* Favorite Button */}
                      <div className="absolute top-3 right-3">
                        <button className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-600 hover:text-red-500 transition-all duration-200 shadow-lg hover:scale-110">
                          <i className="fas fa-heart"></i>
                        </button>
                      </div>
                      
                      {/* Quick View Overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                        <Link 
                          to={`/items/${item.id}`}
                          className="bg-white text-gray-900 px-6 py-3 rounded-xl font-bold opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                          <i className="fas fa-eye mr-2"></i>
                          Quick View
                        </Link>
                      </div>
                    </div>
                    
                    <div className="p-5">
                      {/* Title and Rating */}
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-200 line-clamp-2 text-lg">
                          {item.name}
                        </h3>
                        <div className="flex items-center space-x-1 text-yellow-500 ml-2">
                          <i className="fas fa-star text-sm"></i>
                          <span className="text-xs text-gray-600 font-medium">4.8</span>
                        </div>
                      </div>
                      
                      {/* Description */}
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                        {item.description || "High-quality product with excellent features and great value for money."}
                      </p>
                      
                      {/* Price and Seller */}
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <span className="text-2xl font-bold text-primary-600">KSh {item.price}</span>
                          <div className="flex items-center space-x-1 text-xs text-gray-500 mt-1">
                            <i className="fas fa-user"></i>
                            <span className="font-medium">{item.created_by?.username}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-1 text-xs text-gray-500">
                            <i className="fas fa-eye"></i>
                            <span>{item.views || 0}</span>
                          </div>
                          <div className="flex items-center space-x-1 text-xs text-gray-500 mt-1">
                            <i className="fas fa-clock"></i>
                            <span>{new Date(item.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex space-x-2">
                        <Link
                          to={`/items/${item.id}`}
                          className="flex-1 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white py-3 px-4 rounded-xl font-bold text-center transition-all duration-200 transform hover:scale-105 shadow-lg"
                        >
                          View Details
                        </Link>
                        <button className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center">
                          <i className="fas fa-comments"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {items?.results?.map((item) => (
                  <div key={item.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100">
                    <div className="flex items-center space-x-6">
                      <div className="flex-shrink-0">
                        <img
                          src={item.image || 'https://images.pexels.com/photos/276517/pexels-photo-276517.jpeg?auto=compress&cs=tinysrgb&w=150'}
                          alt={item.name}
                          className="w-32 h-32 object-cover rounded-xl shadow-md"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900 hover:text-primary-600 transition-colors duration-200 mb-2">
                              <Link to={`/items/${item.id}`}>{item.name}</Link>
                            </h3>
                            <p className="text-gray-600 mb-3 line-clamp-2 leading-relaxed">
                              {item.description || "High-quality product with excellent features and great value for money."}
                            </p>
                            
                            <div className="flex items-center space-x-6 text-sm text-gray-500">
                              <div className="flex items-center space-x-2">
                                <i className="fas fa-user text-primary-500"></i>
                                <span className="font-medium">{item.created_by?.username}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <i className="fas fa-clock text-green-500"></i>
                                <span>{new Date(item.created_at).toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <i className="fas fa-eye text-blue-500"></i>
                                <span>{item.views || 0} views</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-col items-end space-y-3 ml-6">
                            <span className="text-3xl font-bold text-primary-600">KSh {item.price}</span>
                            <div className="flex items-center space-x-2">
                              <button className="w-10 h-10 bg-gray-100 hover:bg-red-100 rounded-full flex items-center justify-center text-gray-600 hover:text-red-500 transition-all duration-200">
                                <i className="fas fa-heart"></i>
                              </button>
                              <Link
                                to={`/items/${item.id}`}
                                className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white px-6 py-3 rounded-xl font-bold transition-all duration-200 transform hover:scale-105 shadow-lg"
                              >
                                View Details
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Enhanced Empty State */}
            {!itemsLoading && (!items?.results || items.results.length === 0) && (
              <div className="text-center py-20">
                <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <i className="fas fa-search text-gray-400 text-4xl"></i>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">No products found</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  We couldn't find any products matching your criteria. Try adjusting your search or browse all categories.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={clearFilters}
                    className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white px-8 py-3 rounded-xl font-bold transition-all duration-200 transform hover:scale-105 shadow-lg"
                  >
                    Browse All Products
                  </button>
                  <Link
                    to="/items/new"
                    className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-3 rounded-xl font-bold transition-all duration-200 transform hover:scale-105 shadow-lg"
                  >
                    <i className="fas fa-plus mr-2"></i>
                    List Your Product
                  </Link>
                </div>
              </div>
            )}

            {/* Enhanced Pagination */}
            {items?.results && items.results.length > 0 && items.total_pages > 1 && (
              <div className="flex items-center justify-center mt-12">
                <nav className="flex items-center space-x-2 bg-white rounded-2xl shadow-lg p-2">
                  {items.current_page > 1 && (
                    <button
                      onClick={() => {
                        const newParams = new URLSearchParams(searchParams)
                        newParams.set('page', items.current_page - 1)
                        setSearchParams(newParams)
                      }}
                      className="px-4 py-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all duration-200"
                    >
                      <i className="fas fa-chevron-left mr-1"></i>
                      Previous
                    </button>
                  )}
                  
                  {Array.from({ length: Math.min(5, items.total_pages) }, (_, i) => {
                    const pageNum = i + 1
                    return (
                      <button
                        key={pageNum}
                        onClick={() => {
                          const newParams = new URLSearchParams(searchParams)
                          newParams.set('page', pageNum)
                          setSearchParams(newParams)
                        }}
                        className={`px-4 py-2 rounded-xl font-bold transition-all duration-200 ${
                          pageNum === items.current_page
                            ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {pageNum}
                      </button>
                    )
                  })}
                  
                  {items.current_page < items.total_pages && (
                    <button
                      onClick={() => {
                        const newParams = new URLSearchParams(searchParams)
                        newParams.set('page', items.current_page + 1)
                        setSearchParams(newParams)
                      }}
                      className="px-4 py-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all duration-200"
                    >
                      Next
                      <i className="fas fa-chevron-right ml-1"></i>
                    </button>
                  )}
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Floating Action Button */}
      <Link
        to="/items/new"
        className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-full shadow-2xl flex items-center justify-center transition-all duration-200 transform hover:scale-110 z-40"
      >
        <i className="fas fa-plus text-xl"></i>
      </Link>
    </div>
  )
}

export default Marketplace