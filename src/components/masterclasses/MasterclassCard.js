// Reusable masterclass card component for member portal
import Link from 'next/link';
import Image from 'next/image';
import { Icon } from '@iconify/react';

export default function MasterclassCard({ masterclass, showEnrollButton = true }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isUpcoming = () => {
    return new Date(masterclass.start_date) > new Date();
  };

  const isPast = () => {
    return new Date(masterclass.start_date) < new Date();
  };

  const getAvailabilityStatus = () => {
    if (isPast()) return { status: 'past', label: 'Past Event', color: 'text-gray-500' };
    if (masterclass.available_seats === 0) return { status: 'full', label: 'Fully Booked', color: 'text-red-500' };
    if (masterclass.available_seats <= 5) return { status: 'limited', label: 'Limited Seats', color: 'text-orange-500' };
    return { status: 'available', label: 'Available', color: 'text-green-500' };
  };

  const availability = getAvailabilityStatus();

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      {/* Image */}
      {masterclass.image_url && (
        <div className="relative">
          <div className="relative h-48 w-full">
            <Image
              src={masterclass.image_url}
              alt={masterclass.title}
              fill
              className="object-cover"
            />
          </div>
          {masterclass.is_featured && (
            <div className="absolute top-2 right-2">
              <span className="bg-yellow-500 text-white px-2 py-1 text-xs font-medium rounded">
                Featured
              </span>
            </div>
          )}
          {masterclass.is_free && (
            <div className="absolute top-2 left-2">
              <span className="bg-green-500 text-white px-2 py-1 text-xs font-medium rounded">
                FREE
              </span>
            </div>
          )}
        </div>
      )}

      <div className="p-6">
        {/* Header */}
        <div className="mb-3">
          {masterclass.category && (
            <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded mb-2 inline-block">
              {masterclass.category.name}
            </span>
          )}
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {masterclass.title}
          </h3>
          {masterclass.instructor && (
            <p className="text-sm text-gray-600">
              by {masterclass.instructor.name}
              {masterclass.instructor.title && (
                <span className="text-gray-500"> • {masterclass.instructor.title}</span>
              )}
            </p>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-3">
          {masterclass.short_description || masterclass.description}
        </p>

        {/* Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-500">
            <Icon icon="heroicons:calendar" className="w-4 h-4 mr-2" />
            <span>{formatDate(masterclass.start_date)}</span>
            <span className={`ml-2 text-xs font-medium ${availability.color}`}>
              ({availability.label})
            </span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Icon icon="heroicons:clock" className="w-4 h-4 mr-2" />
            <span>{masterclass.duration_minutes} minutes</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Icon icon="heroicons:users" className="w-4 h-4 mr-2" />
            <span>
              {masterclass.max_seats - masterclass.available_seats} / {masterclass.max_seats} enrolled
            </span>
          </div>
          {masterclass.level && (
            <div className="flex items-center text-sm text-gray-500">
              <Icon icon="heroicons:academic-cap" className="w-4 h-4 mr-2" />
              <span className="capitalize">{masterclass.level} level</span>
            </div>
          )}
          <div className="flex items-center text-sm text-gray-500">
            <Icon icon="heroicons:globe-alt" className="w-4 h-4 mr-2" />
            <span className="capitalize">{masterclass.format} format</span>
          </div>
        </div>

        {/* Pricing */}
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold text-gray-900">
                  ${masterclass.member_price}
                </span>
                <span className="text-sm text-gray-500">member</span>
              </div>
              {masterclass.member_original_price && masterclass.member_original_price > masterclass.member_price && (
                <span className="text-sm text-gray-500 line-through">
                  ${masterclass.member_original_price}
                </span>
              )}
              <div className="text-sm text-gray-500">
                ${masterclass.non_member_price} non-member
              </div>
            </div>
            {masterclass.is_free && (
              <span className="bg-green-100 text-green-800 px-2 py-1 text-xs font-medium rounded">
                FREE
              </span>
            )}
          </div>
        </div>

        {/* Learning Objectives Preview */}
        {masterclass.learning_objectives && masterclass.learning_objectives.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">What you&apos;ll learn:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              {masterclass.learning_objectives.slice(0, 2).map((objective, index) => (
                <li key={index} className="flex items-start">
                  <Icon icon="heroicons:check" className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>{objective}</span>
                </li>
              ))}
              {masterclass.learning_objectives.length > 2 && (
                <li className="text-blue-600 text-xs">
                  +{masterclass.learning_objectives.length - 2} more objectives
                </li>
              )}
            </ul>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between">
          <Link
            href={`/masterclasses/${masterclass.id}`}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            View Details
          </Link>
          
          {showEnrollButton && isUpcoming() && masterclass.available_seats > 0 && (
            <Link
              href={`/masterclasses/${masterclass.id}`}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors"
            >
              Enroll Now
            </Link>
          )}

          {showEnrollButton && masterclass.available_seats === 0 && (
            <span className="bg-gray-100 text-gray-500 px-4 py-2 rounded-lg text-sm font-medium">
              Fully Booked
            </span>
          )}

          {showEnrollButton && isPast() && (
            <span className="bg-gray-100 text-gray-500 px-4 py-2 rounded-lg text-sm font-medium">
              Past Event
            </span>
          )}
        </div>

        {/* Additional Benefits */}
        {masterclass.benefits && masterclass.benefits.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center text-xs text-gray-500">
              <Icon icon="heroicons:gift" className="w-3 h-3 mr-1" />
              <span>Includes: {masterclass.benefits.slice(0, 2).join(', ')}</span>
              {masterclass.benefits.length > 2 && <span> +{masterclass.benefits.length - 2} more</span>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}