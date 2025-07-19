import React from 'react'
import { useQuery } from 'react-query'
import { useForm } from 'react-hook-form'
import { authAPI } from '../services/api'
import { useAuthStore } from '../store/authStore'

const Profile = () => {
  const { user, updateUser } = useAuthStore()
  
  const { data: profile, isLoading } = useQuery(
    'userProfile',
    authAPI.getProfile,
    {
      select: (response) => response.data,
      enabled: !!user,
    }
  )

  const { register, handleSubmit, formState: { errors }, reset } = useForm()

  React.useEffect(() => {
    if (profile) {
      reset({
        first_name: profile.user?.first_name || '',
        last_name: profile.user?.last_name || '',
        email: profile.user?.email || '',
        phone_number: profile.phone_number || '',
        bio: profile.bio || '',
        location: profile.location || '',
        business_name: profile.business_name || '',
        account_type: profile.account_type || 'individual',
        email_notifications: profile.email_notifications,
        sms_notifications: profile.sms_notifications,
        marketing_emails: profile.marketing_emails,
      })
    }
  }, [profile, reset])

  const onSubmit = async (data) => {
    try {
      const formData = new FormData()
      Object.keys(data).forEach(key => {
        if (key === 'profile_picture' && data[key]?.[0]) {
          formData.append(key, data[key][0])
        } else if (data[key] !== null && data[key] !== undefined) {
          formData.append(key, data[key])
        }
      })

      const response = await authAPI.updateProfile(formData)
      updateUser(response.data.user)
      alert('Profile updated successfully!')
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Failed to update profile. Please try again.')
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-32 bg-gray-300 rounded-2xl"></div>
          <div className="h-96 bg-gray-300 rounded-2xl"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="card p-8 mb-8">
        <div className="flex items-center space-x-6">
          {profile?.profile_picture ? (
            <img src={profile.profile_picture} alt="Profile" className="w-24 h-24 rounded-full object-cover" />
          ) : (
            <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center">
              <span className="text-white text-3xl font-bold">{user?.username?.[0]?.toUpperCase()}</span>
            </div>
          )}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {profile?.user?.first_name && profile?.user?.last_name 
                ? `${profile.user.first_name} ${profile.user.last_name}` 
                : user?.username}
            </h1>
            <p className="text-gray-600">{user?.email}</p>
            <div className="flex items-center space-x-4 mt-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                profile?.is_verified 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {profile?.is_verified ? 'Verified' : 'Unverified'}
              </span>
              <span className="text-sm text-gray-500">
                Member since {new Date(user?.date_joined || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <div className="card p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Profile</h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">First Name</label>
              <input
                type="text"
                {...register('first_name')}
                className="input-field"
                placeholder="Enter your first name"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Last Name</label>
              <input
                type="text"
                {...register('last_name')}
                className="input-field"
                placeholder="Enter your last name"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Email Address</label>
            <input
              type="email"
              {...register('email')}
              className="input-field"
              placeholder="Enter your email"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Phone Number</label>
              <input
                type="tel"
                {...register('phone_number')}
                className="input-field"
                placeholder="Enter your phone number"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Location</label>
              <input
                type="text"
                {...register('location')}
                className="input-field"
                placeholder="Enter your location"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Profile Picture</label>
            <input
              type="file"
              accept="image/*"
              {...register('profile_picture')}
              className="input-field"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Bio</label>
            <textarea
              {...register('bio')}
              rows={4}
              className="input-field"
              placeholder="Tell us about yourself..."
            />
          </div>
          
          {/* Account Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Account Type</label>
              <select {...register('account_type')} className="input-field">
                <option value="individual">Individual</option>
                <option value="business">Business</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Business Name (if applicable)</label>
              <input
                type="text"
                {...register('business_name')}
                className="input-field"
                placeholder="Enter business name"
              />
            </div>
          </div>
          
          {/* Notification Preferences */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>
            <div className="space-y-4">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  {...register('email_notifications')}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">Email notifications for messages and updates</span>
              </label>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  {...register('sms_notifications')}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">SMS notifications for important updates</span>
              </label>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  {...register('marketing_emails')}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">Marketing emails and promotions</span>
              </label>
            </div>
          </div>
          
          {/* Submit Button */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200"
            >
              <i className="fas fa-arrow-left mr-2"></i>Back
            </button>
            <button
              type="submit"
              className="btn-primary"
            >
              <i className="fas fa-save mr-2"></i>Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Profile