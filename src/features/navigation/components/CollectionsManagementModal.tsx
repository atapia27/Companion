'use client';

import { Folder, Plus, Trash2, Edit3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/Modal';
import { useCollections } from '../../context-management/hooks';

interface CollectionsManagementModalProps {
  onCloseAction: () => void;
}

export function CollectionsManagementModal({ onCloseAction }: CollectionsManagementModalProps) {
  const { collections } = useCollections();

  return (
    <Modal
      isOpen={true}
      onClose={onCloseAction}
      title="Collections"
      icon={<Folder className="w-4 h-4 sm:w-5 sm:h-5 text-white" />}
      maxWidth="max-w-2xl"
      iconColor="from-neutralharmony-secondary-400 to-neutralharmony-secondary-500"
    >
      <div className="space-y-4 sm:space-y-6">
        {/* Header Section */}
        <div className="space-y-3 sm:space-y-4">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-neutralharmony-primary-900 mb-1">Your Collections</h3>
            <p className="text-xs sm:text-sm text-neutralharmony-primary-600">
              Organize your documents and URLs into themed collections
            </p>
          </div>
          <Button className="w-full md:w-auto bg-gradient-to-r from-neutralharmony-secondary-500 to-neutralharmony-secondary-600 hover:from-neutralharmony-secondary-600 hover:to-neutralharmony-secondary-700 text-white px-4 py-2.5 sm:py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center space-x-2">
            <Plus className="w-4 h-4 text-white" />
            <span className="text-white">New Collection</span>
          </Button>
        </div>

        {/* Collections List */}
        {collections.length > 0 && (
          <div className="space-y-3">
            {collections.map((collection) => (
              <div key={collection.id} className="p-3 sm:p-4 bg-white border border-neutralharmony-background-200 rounded-xl hover:border-neutralharmony-secondary-300 transition-colors duration-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 sm:space-x-3 mb-2">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-neutralharmony-secondary-400 to-neutralharmony-secondary-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Folder className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                      </div>
                      <h4 className="font-semibold text-neutralharmony-primary-900 text-sm sm:text-base truncate">{collection.name}</h4>
                    </div>
                    <p className="text-xs sm:text-sm text-neutralharmony-primary-600 mb-2 leading-relaxed line-clamp-2">
                      {collection.description}
                    </p>
                    <div className="flex items-center space-x-2 text-xs text-neutralharmony-primary-500">
                      <span className="font-medium whitespace-nowrap">{collection.documentCount} documents</span>
                      <span className="text-neutralharmony-primary-400">•</span>
                      <span className="whitespace-nowrap">Updated {collection.lastUpdated}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 ml-2 sm:ml-3 flex-shrink-0">
                    <button className="p-1.5 sm:p-2 text-neutralharmony-primary-500 hover:text-neutralharmony-secondary-600 hover:bg-neutralharmony-secondary-50 rounded-lg transition-colors duration-200">
                      <Edit3 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                    <button className="p-1.5 sm:p-2 text-neutralharmony-primary-500 hover:text-neutralharmony-contrast-600 hover:bg-neutralharmony-contrast-50 rounded-lg transition-colors duration-200">
                      <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {collections.length === 0 && (
          <div className="text-center py-6 sm:py-8">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-neutralharmony-background-200 to-neutralharmony-background-300 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <Folder className="w-6 h-6 sm:w-8 sm:h-8 text-neutralharmony-primary-600" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-neutralharmony-primary-900 mb-2">No Collections Yet</h3>
            <p className="text-xs sm:text-sm text-neutralharmony-primary-600 mb-3 sm:mb-4">
              Create your first collection to organize your documents and URLs
            </p>
            <Button className="bg-gradient-to-r from-neutralharmony-secondary-500 to-neutralharmony-secondary-600 hover:from-neutralharmony-secondary-600 hover:to-neutralharmony-secondary-700 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200">
              Create Collection
            </Button>
          </div>
        )}

        {/* Coming Soon Notice */}
        <div className="p-3 sm:p-4 bg-gradient-to-br from-neutralharmony-tertiary-50 to-neutralharmony-tertiary-100 border border-neutralharmony-tertiary-200 rounded-xl">
          <div className="flex items-start space-x-2 sm:space-x-3">
            <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-br from-neutralharmony-tertiary-400 to-neutralharmony-tertiary-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
              <Plus className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-neutralharmony-primary-900 text-xs sm:text-sm mb-1">Collections Feature (WIP)</h4>
              <p className="text-xs text-neutralharmony-primary-600 leading-relaxed">
                This feature demonstrates advanced state management and UI design patterns. Collections will showcase React hooks, context providers, and modern component architecture for scalable document organization.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
