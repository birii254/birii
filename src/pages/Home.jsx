import React from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from 'react-query'
import { itemsAPI, categoriesAPI } from '../services/api'

const Home = () => {
  const { data: items } = useQuery(
    'featuredItems',
    () => itemsAPI.getItems({ featured: true, limit: 6 }),
    {
      select: (response) => response.data,
    }
  )

  const { data: categories } = useQuery(
    'categories',
    categoriesAPI.getCategories,
    {
      select: (response) => response.data,
    }
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-primary-600 via-primary-700 to-matrix-600 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  Connect. Trade. 
                  <span className="gradient-text bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">Succeed.</span>
                </h1>
                <p className="text-xl text-blue-100 leading-relaxed">
                  The world's leading B2B marketplace connecting verified suppliers with global buyers. 
                  Discover quality products, secure transactions, and endless opportunities.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/marketplace" className="bg-white text-primary-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all duration-200 transform hover:scale-105 flex items-center justify-center">
                  <i className="fas fa-search mr-2"></i>
                  Start Buying
                </Link>
                <Link to="/become-supplier" className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-primary-600 transition-all duration-200 transform hover:scale-105 flex items-center justify-center">
                  <i className="fas fa-handshake mr-2"></i>
                  Become a Supplier
                </Link>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 pt-8 border-t border-white/20">
                <div className="text-center">
                  <div className="text-3xl font-bold">50K+</div>
                  <div className="text-blue-200 text-sm">Verified Suppliers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">1M+</div>
                  <div className="text-blue-200 text-sm">Products</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">200+</div>
                  <div className="text-blue-200 text-sm">Countries</div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative z-10">
                <img src="https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800" 
                     alt="Global Trading" 
                     className="rounded-2xl shadow-2xl" />
              </div>
              <div className="absolute -top-4 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse-slow"></div>
              <div className="absolute -bottom-8 -left-4 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse-slow"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Matrix Marketplace?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We provide everything you need for successful B2B trading with security, efficiency, and global reach.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-8 border border-gray-100">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200">
                <i className="fas fa-shield-alt text-blue-600 text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Secure Trading</h3>
              <p className="text-gray-600">Advanced security measures, verified suppliers, and secure payment processing ensure safe transactions.</p>
            </div>
            
            <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-8 border border-gray-100">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200">
                <i className="fas fa-globe text-green-600 text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Global Reach</h3>
              <p className="text-gray-600">Connect with suppliers and buyers from over 200 countries worldwide for unlimited opportunities.</p>
            </div>
            
            <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-8 border border-gray-100">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200">
                <i className="fas fa-chart-line text-purple-600 text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Business Growth</h3>
              <p className="text-gray-600">Powerful analytics, marketing tools, and business insights to help grow your trading business.</p>
            </div>
            
            <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-8 border border-gray-100">
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200">
                <i className="fas fa-headset text-orange-600 text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">24/7 Support</h3>
              <p className="text-gray-600">Round-the-clock customer support in multiple languages to assist with all your trading needs.</p>
            </div>
            
            <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-8 border border-gray-100">
              <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200">
                <i className="fas fa-truck text-red-600 text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Logistics Support</h3>
              <p className="text-gray-600">Comprehensive shipping and logistics solutions to ensure your products reach their destination safely.</p>
            </div>
            
            <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-8 border border-gray-100">
              <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200">
                <i className="fas fa-certificate text-yellow-600 text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Quality Assurance</h3>
              <p className="text-gray-600">Rigorous supplier verification and product quality checks to ensure you get exactly what you order.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Popular Categories</h2>
            <p className="text-xl text-gray-600">Explore millions of products across diverse categories</p>
          </div>
          
              {categories?.slice(0, 5).map((category, index) => {
                const colors = [
                  { bg: 'bg-blue-100', hover: 'group-hover:bg-blue-200', icon: 'text-blue-600' },
                  { bg: 'bg-green-100', hover: 'group-hover:bg-green-200', icon: 'text-green-600' },
                  { bg: 'bg-purple-100', hover: 'group-hover:bg-purple-200', icon: 'text-purple-600' },
                  { bg: 'bg-red-100', hover: 'group-hover:bg-red-200', icon: 'text-red-600' },
                  { bg: 'bg-yellow-100', hover: 'group-hover:bg-yellow-200', icon: 'text-yellow-600' },
                ]
                const color = colors[index % colors.length]
                
                return (
                  <Link 
                    key={category.id}
                    to={`/marketplace?category=${category.slug}`} 
                    className="group bg-gray-50 hover:bg-primary-50 rounded-2xl p-6 text-center transition-all duration-200 hover:shadow-lg"
                  >
                    <div className={`w-16 h-16 ${color.bg} ${color.hover} rounded-2xl flex items-center justify-center mx-auto mb-4 transition-colors duration-200`}>
                      <i className={`${category.icon} ${color.icon} text-2xl`}></i>
                    </div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-primary-600">{category.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{category.items?.length || 0} products</p>
                  </Link>
                )
              })}
              
              <Link to="/marketplace" className="group bg-gray-50 hover:bg-primary-50 rounded-2xl p-6 text-center transition-all duration-200 hover:shadow-lg">
                <div className="w-16 h-16 bg-indigo-100 group-hover:bg-indigo-200 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-colors duration-200">
                  <i className="fas fa-ellipsis-h text-indigo-600 text-2xl"></i>
                </div>
                <h3 className="font-semibold text-gray-900 group-hover:text-primary-600">More</h3>
                <p className="text-sm text-gray-500 mt-1">View All</p>
              </Link>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Items Section */}
      {items && items.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Items</h2>
              <p className="text-xl text-gray-600">Discover the best deals from our community</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {items.map((item) => (
                <div key={item.id} className="group card overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="relative overflow-hidden">
                    <img
                      src={item.image || 'https://images.pexels.com/photos/276517/pexels-photo-276517.jpeg?auto=compress&cs=tinysrgb&w=400'}
                      alt={item.name}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">Featured</span>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors duration-200 mb-2">
                      {item.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {item.description || "No description available"}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-primary-600">KSh {item.price}</span>
                      <Link
                        to={`/items/${item.id}`}
                        className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-matrix-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Trading?</h2>
          <p className="text-xl text-blue-100 mb-8">Join millions of businesses already trading on Matrix Marketplace</p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup" className="bg-white text-primary-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all duration-200 transform hover:scale-105">
              Get Started Free
            </Link>
            <Link to="/contact" className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-primary-600 transition-all duration-200 transform hover:scale-105">
              Contact Sales
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home