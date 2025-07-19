import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useQuery } from 'react-query'
import { categoriesAPI, itemsAPI } from '../services/api'
import { useAuthStore } from '../store/authStore'

const NewItem = () => {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedImages, setSelectedImages] = useState([])

  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    defaultValues: {
      condition: 'good',
      delivery_available: false,
      pickup_available: true,
      is_negotiable: true,
    }
  })

  // Fetch categories
  const { data: categories, isLoading: categoriesLoading } = useQuery(
    'categories',
    categoriesAPI.getCategories,
    {
      select: (response) => response.data,
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    }
  )

  const onSubmit = async (data) => {
    if (!user) {
      navigate('/login')
      return
    }

    setIsSubmitting(true)
    try {
      const formData = new FormData()
      
      // Add form fields
      Object.keys(data).forEach(key => {
        if (key.startsWith('image') && data[key]?.[0]) {
          formData.append(key, data[key][0])
        } else if (data[key] !== null && data[key] !== undefined) {
          formData.append(key, data[key])
        }
      })

      const response = await itemsAPI.createItem(formData)
      navigate(`/items/${response.data.id}`)
    } catch (error) {
      console.error('Error creating item:', error)
      alert('Failed to create item. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleImageChange = (e, index) => {
    const file = e.target.files[0]
    if (file) {
      const newImages = [...selectedImages]
      newImages[index] = URL.createObjectURL(file)
      setSelectedImages(newImages)
    }
  }

  if (!user) {
    navigate('/login')
    return null
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Listing</h1>
        <p className="text-gray-600">Fill in the details below to list your item</p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl shadow-sm p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              <i className="fas fa-camera text-primary-600 mr-2"></i>
              Item Photos
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[0, 1, 2, 3, 4].map((index) => (
                <div key={index} className="relative">
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-primary-400 transition-colors duration-200 h-32 flex items-center justify-center">
                    {selectedImages[index] ? (
                      <img
                        src={selectedImages[index]}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <div className="text-gray-400">
                        <i className="fas fa-plus text-2xl mb-2"></i>
                        <p className="text-xs">Add Photo</p>
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    {...register(index === 0 ? 'image' : `image_${index + 1}`)}
                    onChange={(e) => handleImageChange(e, index)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">PNG, JPG, GIF up to 10MB each. First image will be the main photo.</p>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              <i className="fas fa-tag text-primary-600 mr-2"></i>
              Category *
            </label>
            <select
              {...register('category', { required: 'Please select a category' })}
              className="input-field"
              disabled={categoriesLoading}
            >
              <option value="">Select a category</option>
              {categories?.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {categoriesLoading && (
              <p className="mt-1 text-sm text-gray-500">Loading categories...</p>
            )}
            {errors.category && (
              <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
            )}
            {!categoriesLoading && (!categories || categories.length === 0) && (
              <p className="mt-1 text-sm text-red-600">No categories available. Please try refreshing the page.</p>
            )}
          </div>

          {/* Item Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              <i className="fas fa-box text-primary-600 mr-2"></i>
              Item Name *
            </label>
            <input
              type="text"
              {...register('name', { required: 'Item name is required' })}
              className="input-field"
              placeholder="Enter item name..."
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              <i className="fas fa-align-left text-primary-600 mr-2"></i>
              Description
            </label>
            <textarea
              {...register('description')}
              rows={6}
              className="input-field"
              placeholder="Describe your item in detail..."
            />
            <p className="text-xs text-gray-500 mt-2">Provide detailed information about your item's condition, features, and any relevant details.</p>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              <i className="fas fa-map-marker-alt text-primary-600 mr-2"></i>
              Location *
            </label>
            <input
              type="text"
              {...register('location', { required: 'Location is required' })}
              className="input-field"
              placeholder="Enter your location..."
            />
            {errors.location && (
              <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
            )}
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              <i className="fas fa-dollar-sign text-primary-600 mr-2"></i>
              Price (KSh) *
            </label>
            <div className="relative">
              <span className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">KSh</span>
              <input
                type="number"
                step="0.01"
                min="0"
                {...register('price', { 
                  required: 'Price is required',
                  min: { value: 0, message: 'Price must be positive' }
                })}
                className="input-field pl-16"
                placeholder="0.00"
              />
            </div>
            {errors.price && (
              <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
            )}
          </div>

          {/* Condition */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              <i className="fas fa-star text-primary-600 mr-2"></i>
              Condition
            </label>
            <select {...register('condition')} className="input-field">
              <option value="new">Brand New</option>
              <option value="like_new">Like New</option>
              <option value="excellent">Excellent</option>
              <option value="good">Good</option>
              <option value="fair">Fair</option>
              <option value="poor">Poor</option>
            </select>
          </div>

          {/* Options */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Delivery & Pickup Options</h3>
            
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                {...register('delivery_available')}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <label className="text-sm text-gray-700">Delivery available</label>
            </div>
            
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                {...register('pickup_available')}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <label className="text-sm text-gray-700">Pickup available</label>
            </div>
            
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                {...register('is_negotiable')}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <label className="text-sm text-gray-700">Price is negotiable</label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200"
            >
              <i className="fas fa-arrow-left mr-2"></i>
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <i className="fas fa-check"></i>
                  <span>List Item</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Tips */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-2xl p-6">
        <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
          <i className="fas fa-lightbulb mr-2"></i>
          Tips for a Great Listing
        </h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li className="flex items-start space-x-2">
            <i className="fas fa-check text-blue-600 mt-0.5"></i>
            <span>Use high-quality, well-lit photos from multiple angles</span>
          </li>
          <li className="flex items-start space-x-2">
            <i className="fas fa-check text-blue-600 mt-0.5"></i>
            <span>Write a detailed, honest description of the item's condition</span>
          </li>
          <li className="flex items-start space-x-2">
            <i className="fas fa-check text-blue-600 mt-0.5"></i>
            <span>Research similar items to set a competitive price</span>
          </li>
          <li className="flex items-start space-x-2">
            <i className="fas fa-check text-blue-600 mt-0.5"></i>
            <span>Respond quickly to buyer inquiries to build trust</span>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default NewItem