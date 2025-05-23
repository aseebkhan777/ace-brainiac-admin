import React from 'react';
import Card from './Card'; // Import your existing Card component

export default function RecentlySubscribedMembers({ 
  members = [],
  isLoading = false,
  error = null,
  maxItems = 5, 
  title = "", // Changed to empty default
  showTitle = false, // New prop to control title visibility
  className = ""
}) {
  // Function to determine plan badge color
  const getPlanBadgeClass = (planType) => {
    switch (planType) {
      case 'Basic Plan':
        return 'bg-gray-100 text-gray-800';
      case 'Premium Plan':
        return 'bg-blue-100 text-blue-800';
      case 'Deluxe Plan':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Limit the number of displayed members
  const displayedMembers = members.slice(0, maxItems);

  return (
    <Card className={`${className} border-transparent`}>
      {showTitle && title && (
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
      )}
      
      {isLoading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      )}
      
      {error && (
        <div className="text-red-500 py-4">
          Error loading members: {error}
        </div>
      )}
      
      {!isLoading && !error && displayedMembers.length === 0 && (
        <div className="text-gray-500 py-4">
          No recently subscribed members found.
        </div>
      )}
      
      {!isLoading && !error && displayedMembers.length > 0 && (
        <div className="space-y-4">
          {displayedMembers.map((member) => (
            <div key={member.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 rounded-full overflow-hidden">
                  {member.avatar ? (
                    <img 
                      src={member.avatar} 
                      alt={member.name} 
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-gray-200 flex items-center justify-center text-gray-500">
                      {member.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-medium">{member.name}</h3>
                  <p className="text-sm text-gray-500">{member.role}</p>
                </div>
              </div>
              <div>
                <span className={`px-3 py-1 text-xs font-medium rounded-full ${getPlanBadgeClass(member.plan)}`}>
                  {member.plan}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}