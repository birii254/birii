import React from 'react'
import { Link } from 'react-router-dom'
import { Transition } from '@headlessui/react'

const MobileMenu = ({ isOpen, onClose, isAuthenticated, onLogout }) => {
  return (
    <Transition
      show={isOpen}
      enter="transition ease-out duration-200"
      enterFrom="opacity-0 -translate-y-1"
      enterTo="opacity-100 translate-y-0"
      leave="transition ease-in duration-150"
      leaveFrom="opacity-100 translate-y-0"
      leaveTo="opacity-0 -translate-y-1"
      className="lg:hidden bg-white border-t border-gray-200"
    >
      <div className="px-4 py-4 space-y-3">
        <Link
          to="/marketplace"
          onClick={onClose}
          className="block text-gray-700 hover:text-matrix-600 font-medium py-2"
        >
          <i className="fas fa-store w-5"></i> Marketplace
        </Link>
        <Link
          to="/marketplace"
          onClick={onClose}
          className="block text-gray-700 hover:text-matrix-600 font-medium py-2"
        >
          <i className="fas fa-search w-5"></i> Browse Items
        </Link>
        <Link
          to="/items/new"
          onClick={onClose}
          className="block text-gray-700 hover:text-matrix-600 font-medium py-2"
        >
          <i className="fas fa-plus w-5"></i> Sell Item
        </Link>
        <Link
          to="/featured"
          onClick={onClose}
          className="block text-gray-700 hover:text-matrix-600 font-medium py-2"
        >
          <i className="fas fa-star w-5"></i> Featured
        </Link>
        <Link
          to="/help-center"
          onClick={onClose}
          className="block text-gray-700 hover:text-matrix-600 font-medium py-2"
        >
          <i className="fas fa-question-circle w-5"></i> Help Center
        </Link>
        <Link
          to="/buyer-central"
          onClick={onClose}
          className="block text-gray-700 hover:text-matrix-600 font-medium py-2"
        >
          <i className="fas fa-user-tie w-5"></i> Buyer Central
        </Link>
        <Link
          to="/become-supplier"
          onClick={onClose}
          className="block text-gray-700 hover:text-matrix-600 font-medium py-2"
        >
          <i className="fas fa-handshake w-5"></i> Become Supplier
        </Link>
        <Link
          to="/faq"
          onClick={onClose}
          className="block text-gray-700 hover:text-matrix-600 font-medium py-2"
        >
          <i className="fas fa-question w-5"></i> FAQ
        </Link>
        {isAuthenticated ? (
          <>
            <Link
              to="/inbox"
              onClick={onClose}
              className="block text-gray-700 hover:text-matrix-600 font-medium py-2"
            >
              <i className="fas fa-envelope w-5"></i> Messages
            </Link>
            <Link
              to="/dashboard"
              onClick={onClose}
              className="block text-gray-700 hover:text-matrix-600 font-medium py-2"
            >
              <i className="fas fa-tachometer-alt w-5"></i> Dashboard
            </Link>
            <button
              onClick={() => {
                onLogout()
                onClose()
              }}
              className="block w-full text-left text-gray-700 hover:text-red-600 font-medium py-2"
            >
              <i className="fas fa-sign-out-alt w-5"></i> Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              onClick={onClose}
              className="block text-gray-700 hover:text-matrix-600 font-medium py-2"
            >
              <i className="fas fa-sign-in-alt w-5"></i> Login
            </Link>
            <Link
              to="/signup"
              onClick={onClose}
              className="block text-gray-700 hover:text-matrix-600 font-medium py-2"
            >
              <i className="fas fa-user-plus w-5"></i> Sign Up
            </Link>
          </>
        )}
      </div>
    </Transition>
  )
}

export default MobileMenu