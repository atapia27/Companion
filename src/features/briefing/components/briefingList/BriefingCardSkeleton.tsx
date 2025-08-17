import { FileBarChart, Calendar, FileText } from 'lucide-react';

export function BriefingCardSkeleton() {
  return (
    <div className="bg-white border-2 border-neutralharmony-background-300 rounded-xl shadow-lg overflow-hidden animate-pulse">
      {/* Header */}
      <div className="p-4 border-b-2 border-neutralharmony-background-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-neutralharmony-tertiary-200 to-neutralharmony-tertiary-300 rounded-lg flex items-center justify-center">
              <FileBarChart className="w-4 h-4 text-neutralharmony-tertiary-600" />
            </div>
            <div>
              <div className="h-5 bg-neutralharmony-background-200 rounded w-48 mb-2"></div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3 text-neutralharmony-primary-400" />
                  <div className="h-3 bg-neutralharmony-background-200 rounded w-20"></div>
                </div>
                <div className="flex items-center space-x-1">
                  <FileText className="w-3 h-3 text-neutralharmony-primary-400" />
                  <div className="h-3 bg-neutralharmony-background-200 rounded w-16"></div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-neutralharmony-background-200 rounded-lg"></div>
            <div className="w-8 h-8 bg-neutralharmony-background-200 rounded-lg"></div>
            <div className="w-8 h-8 bg-neutralharmony-background-200 rounded-lg"></div>
            <div className="w-8 h-8 bg-neutralharmony-background-200 rounded-lg"></div>
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="bg-gradient-to-br from-neutralharmony-background-50 to-neutralharmony-background-100">
        <div className="p-4">
          <div className="space-y-3">
            {/* Title skeleton */}
            <div className="h-6 bg-neutralharmony-background-200 rounded w-3/4"></div>
            
            {/* Paragraph skeletons */}
            <div className="space-y-2">
              <div className="h-4 bg-neutralharmony-background-200 rounded w-full"></div>
              <div className="h-4 bg-neutralharmony-background-200 rounded w-5/6"></div>
              <div className="h-4 bg-neutralharmony-background-200 rounded w-4/5"></div>
            </div>
            
            {/* Subtitle skeleton */}
            <div className="h-5 bg-neutralharmony-background-200 rounded w-1/2 mt-4"></div>
            
            {/* More paragraph skeletons */}
            <div className="space-y-2">
              <div className="h-4 bg-neutralharmony-background-200 rounded w-full"></div>
              <div className="h-4 bg-neutralharmony-background-200 rounded w-11/12"></div>
              <div className="h-4 bg-neutralharmony-background-200 rounded w-3/4"></div>
            </div>
            
            {/* List skeleton */}
            <div className="space-y-2 mt-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-neutralharmony-background-200 rounded-full"></div>
                <div className="h-4 bg-neutralharmony-background-200 rounded w-2/3"></div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-neutralharmony-background-200 rounded-full"></div>
                <div className="h-4 bg-neutralharmony-background-200 rounded w-1/2"></div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-neutralharmony-background-200 rounded-full"></div>
                <div className="h-4 bg-neutralharmony-background-200 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
