import React, { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useQuery } from 'react-query'
import { itemsAPI } from '../services/api'
import { useAuthStore } from '../store/authStore'

const ItemDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [currentImage, setCurrentImage] = useState(0)
  const [showImageModal, setShowImageModal] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [isFavorited, setIsFavorited] = useState(false)

  const { data: item, isLoading } = useQuery(
    ['item', id],
    () => itemsAPI.getItem(id),
    {
      select: (response) => response.data,
      onSuccess: (data) => {
        setIsFavorited(data.is_favorited || false)
      }
    }
  )

  const { data: relatedItems } = useQuery(
    ['relatedItems', item?.category?.id],
    () => itemsAPI.getItems({ 
      category: item?.category?.id, 
      exclude: id,
      limit: 3,
      status: 'active',
      admin_approved: true
    }),
    {
      enabled: !!item?.category?.id,
      select: (response) => response.data?.results || [],
    }
  )

  const handleToggleFavorite = async () => {
    if (!user) {
      navigate('/login')
      return
    }

    try {
      const response = await itemsAPI.toggleFavorite(id)
      setIsFavorited(response.data.favorited)
    } catch (error) {
      console.error('Error toggling favorite:', error)
    }
  }

  const handleContactSeller = () => {
    if (!user) {
      navigate('/login')
      return
    }
    navigate(`/inbox/new/${id}`)
  }

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-4">
            <div className="bg-gray-300 h-96 lg:h-[500px] rounded-2xl"></div>
            <div className="flex space-x-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-gray-300 w-20 h-20 rounded-lg"></div>
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-gray-300 h-8 rounded w-3/4"></div>
            <div className="bg-gray-300 h-4 rounded w-1/2"></div>
            <div className="bg-gray-300 h-20 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!item) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Item not found</h2>
        <Link to="/marketplace" className="btn-primary">
          Back to Marketplace
        </Link>
      </div>
    )
  }

  const images = item.get_all_images || [item.image].filter(Boolean)
  const isOwner = user?.id === item.created_by?.id

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-500">
        <Link to="/" className="hover:text-primary-600 transition-colors duration-200">Home</Link>
        <i className="fas fa-chevron-right text-xs"></i>
        <Link to="/marketplace" className="hover:text-primary-600 transition-colors duration-200">Browse</Link>
        <i className="fas fa-chevron-right text-xs"></i>
        <span className="text-gray-900">{item.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="relative group">
            <img
              src={images[currentImage] || 'https://via.placeholder.com/500x400'}
              alt={item.name}
              className="w-full h-96 lg:h-[500px] object-cover rounded-2xl cursor-zoom-in"
              onClick={() => setShowImageModal(true)}
            />
            
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setCurrentImage(currentImage > 0 ? currentImage - 1 : images.length - 1)}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200"
                >
                  <i className="fas fa-chevron-left"></i>
                </button>
                <button
                  onClick={() => setCurrentImage(currentImage < images.length - 1 ? currentImage + 1 : 0)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200"
                >
                  <i className="fas fa-chevron-right"></i>
                </button>
              </>
            )}
            
            <div className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <i className="fas fa-search-plus"></i>
            </div>
          </div>
          
          {/* Thumbnail Gallery */}
          {images.length > 1 && (
            <div className="flex space-x-2 overflow-x-auto">
              {images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${item.name} ${index + 1}`}
                  className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 transition-all duration-200 ${
                    currentImage === index ? 'border-primary-500' : 'border-transparent hover:border-gray-300'
                  }`}
                  onClick={() => setCurrentImage(index)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Item Details */}
        <div className="space-y-6">
          {/* Header */}
          <div>
            <div className="flex items-start justify-between mb-2">
              <h1 className="text-3xl font-bold text-gray-900">{item.name}</h1>
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-600 hover:text-primary-600 transition-colors duration-200">
                  <i className="fas fa-share-alt"></i>
                </button>
                <button 
                  onClick={handleToggleFavorite}
                  className={`p-2 transition-colors duration-200 ${
                    isFavorited ? 'text-red-500 hover:text-red-600' : 'text-gray-600 hover:text-red-500'
                  }`}
                >
                  <i className={`fas fa-heart ${isFavorited ? 'text-red-500' : ''}`}></i>
                </button>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
              <div className="flex items-center space-x-1">
                <i className="fas fa-eye"></i>
                <span>{item.views || 0} views</span>
              </div>
              <div className="flex items-center space-x-1">
                <i className="fas fa-clock"></i>
                <span>Listed {new Date(item.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-1">
                <i className="fas fa-map-marker-alt"></i>
                <span>{item.location}</span>
              </div>
            </div>
            
            {/* Rating */}
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex items-center space-x-1 text-yellow-500">
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star-half-alt"></i>
              </div>
              <span className="text-sm text-gray-600">(4.8 out of 5)</span>
              <a href="#reviews" className="text-sm text-primary-600 hover:text-primary-700">23 reviews</a>
            </div>
          </div>

          {/* Price */}
          <div className="bg-gray-50 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-3xl font-bold text-primary-600">KSh {item.price}</span>
                <span className={`px-2 py-1 rounded-full text-sm font-medium ml-2 ${
                  item.condition === 'new' ? 'bg-green-100 text-green-800' :
                  item.condition === 'like_new' ? 'bg-blue-100 text-blue-800' :
                  item.condition === 'excellent' ? 'bg-purple-100 text-purple-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {item.condition?.replace('_', ' ') || 'Good'}
                </span>
              </div>
            </div>
            
            {/* Quantity */}
            <div className="flex items-center space-x-4 mb-4">
              <label className="text-sm font-medium text-gray-700">Quantity:</label>
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-gray-100 transition-colors duration-200"
                >
                  <i className="fas fa-minus text-sm"></i>
                </button>
                <span className="px-4 py-2 border-x border-gray-300">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 hover:bg-gray-100 transition-colors duration-200"
                >
                  <i className="fas fa-plus text-sm"></i>
                </button>
              </div>
              <span className="text-sm text-gray-500">Available</span>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            {isOwner ? (
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
                <div className="flex items-center mb-3">
                  <i className="fas fa-info-circle text-blue-600 mr-2"></i>
                  <span className="font-semibold text-blue-900">This is your listing</span>
                </div>
                <div className="flex space-x-3">
                  <Link to={`/items/${item.id}/edit`} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl font-semibold text-center transition-colors duration-200">
                    <i className="fas fa-edit mr-2"></i>Edit Listing
                  </Link>
                  <button 
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this item?')) {
                        // Handle delete
                        navigate('/dashboard')
                      }
                    }}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-xl font-semibold transition-colors duration-200"
                  >
                    <i className="fas fa-trash mr-2"></i>Delete
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex space-x-3">
                  <button 
                    onClick={handleContactSeller}
                    className="flex-1 btn-primary"
                  >
                    <i className="fas fa-comments mr-2"></i>Contact Seller
                  </button>
                  <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105">
                    <i className="fas fa-shopping-cart mr-2"></i>Buy Now
                  </button>
                </div>
                <button 
                  onClick={handleToggleFavorite}
                  className={`w-full py-3 px-6 rounded-xl font-semibold transition-colors duration-200 ${
                    isFavorited 
                      ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                      : 'btn-secondary'
                  }`}
                >
                  <i className="fas fa-heart mr-2"></i>Add to Wishlist
                </button>
              </>
            )}
          </div>

          {/* Seller Info */}
          <div className="card border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Seller Information</h3>
            <div className="flex items-center space-x-4">
              {item.created_by?.profile?.profile_picture ? (
                <img 
                  src={item.created_by.profile.profile_picture} 
                  alt={item.created_by.username}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">{item.created_by?.username?.[0]?.toUpperCase()}</span>
                </div>
              )}
              <div className="flex-1">
                <div className="font-semibold text-gray-900">
                  {item.created_by?.profile?.display_name || item.created_by?.username}
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <i className="fas fa-star text-yellow-500"></i>
                    <span>{item.created_by?.profile?.rating || '4.9'} ({item.created_by?.profile?.total_reviews || 0} reviews)</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <i className="fas fa-clock"></i>
                    <span>Usually responds within 1 hour</span>
                  </div>
                  {item.created_by?.profile?.is_verified && (
                    <div className="flex items-center space-x-1">
                      <i className="fas fa-check-circle text-green-500"></i>
                      <span className="text-green-600">Verified</span>
                    </div>
                  )}
                </div>
              </div>
              <button className="btn-secondary">
                View Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Description & Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Description */}
          <div className="card p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Description</h2>
            {item.description ? (
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{item.description}</p>
              </div>
            ) : (
              <p className="text-gray-500 italic">No description provided by the seller.</p>
            )}
          </div>

          {/* Specifications */}
          <div className="card p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Specifications</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-gray-600">Category</span>
                <span className="font-medium text-gray-900">{item.category?.name}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-gray-600">Condition</span>
                <span className="font-medium text-gray-900">{item.condition?.replace('_', ' ') || 'Good'}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-gray-600">Location</span>
                <span className="font-medium text-gray-900">{item.location}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-gray-600">Availability</span>
                <span className={`font-medium ${
                  item.status === 'active' ? 'text-green-600' : 
                  item.status === 'sold' ? 'text-red-600' : 
                  'text-yellow-600'
                }`}>
                  {item.status === 'active' ? 'Available' : 
                   item.status === 'sold' ? 'Sold' : 
                   item.status}
                </span>
              </div>
              {item.delivery_available && (
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">Delivery</span>
                  <span className="font-medium text-green-600">Available</span>
                </div>
              )}
              {item.pickup_available && (
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">Pickup</span>
                  <span className="font-medium text-green-600">Available</span>
                </div>
              )}
              {item.is_negotiable && (
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">Price</span>
                  <span className="font-medium text-blue-600">Negotiable</span>
                </div>
              )}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Shipping Info */}
          <div className="card p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
              <i className="fas fa-shipping-fast text-primary-600 mr-2"></i>
              Shipping & Delivery
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery Available</span>
                <span className={`font-medium ${item.delivery_available ? 'text-green-600' : 'text-gray-900'}`}>
                  {item.delivery_available ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Pickup Available</span>
                <span className={`font-medium ${item.pickup_available ? 'text-green-600' : 'text-gray-900'}`}>
                  {item.pickup_available ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Negotiable</span>
                <span className={`font-medium ${item.is_negotiable ? 'text-blue-600' : 'text-gray-900'}`}>
                  {item.is_negotiable ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          </div>

          {/* Trust & Safety */}
          <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
            <h3 className="font-semibold text-green-900 mb-3 flex items-center">
              <i className="fas fa-shield-alt mr-2"></i>
              Trust & Safety
            </h3>
            <ul className="space-y-2 text-sm text-green-800">
              <li className="flex items-center space-x-2">
                <i className="fas fa-check text-green-600"></i>
                <span>{item.created_by?.profile?.is_verified ? 'Verified seller identity' : 'Seller identity pending verification'}</span>
              </li>
              <li className="flex items-center space-x-2">
                <i className="fas fa-check text-green-600"></i>
                <span>Secure payment processing</span>
              </li>
              <li className="flex items-center space-x-2">
                <i className="fas fa-check text-green-600"></i>
                <span>Buyer protection guarantee</span>
              </li>
            </ul>
          </div>

          {/* Similar Items */}
          {relatedItems && relatedItems.length > 0 && (
            <div className="card p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Similar Items</h3>
              <div className="space-y-4">
                {relatedItems.map((relatedItem) => (
                  <Link
                    key={relatedItem.id}
                    to={`/items/${relatedItem.id}`}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    <img 
                      src={relatedItem.image || 'https://images.pexels.com/photos/276517/pexels-photo-276517.jpeg?auto=compress&cs=tinysrgb&w=100'} 
                      alt={relatedItem.name} 
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate">{relatedItem.name}</h4>
                      <p className="text-sm text-primary-600 font-semibold">KSh {relatedItem.price}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Image Modal */}
      {showImageModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
          onClick={() => setShowImageModal(false)}
        >
          <div className="relative max-w-4xl max-h-full p-4">
            <img
              src={images[currentImage]}
              alt={item.name}
              className="max-w-full max-h-full object-contain"
            />
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 text-2xl"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ItemDetail