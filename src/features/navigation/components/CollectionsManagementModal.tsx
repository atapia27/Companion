'use client';

import { X, Folder, Plus, Trash2, Edit3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCollections } from '../../context-management/hooks';

interface CollectionsManagementModalProps {
  onCloseAction: () => void;
}

export function CollectionsManagementModal({ onCloseAction }: CollectionsManagementModalProps) {
  const { collections } = useCollections();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto shadow-2xl border border-neutralharmony-background-200">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-neutralharmony-primary-900">Collections</h2>
          <Button
            onClick={onCloseAction}
            variant="close"
            size="sm"
            className="rounded-xl"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-neutralharmony-primary-900 mb-2">Your Collections</h3>
              <p className="text-neutralharmony-primary-600">
                Organize your documents and URLs into themed collections
              </p>
            </div>
            <Button className="bg-gradient-to-r from-neutralharmony-secondary-500 to-neutralharmony-secondary-600 hover:from-neutralharmony-secondary-600 hover:to-neutralharmony-secondary-700 text-white px-4 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2">
              <Plus className="w-4 h-4 text-white" />
              <span className="text-white">New Collection</span>
            </Button>
          </div>

          {/* Collections List */}
          <div className="space-y-4">
            {collections.map((collection) => (
              <div key={collection.id} className="p-6 bg-white border-2 border-neutralharmony-background-200 rounded-xl hover:border-neutralharmony-secondary-300 transition-colors duration-200 shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-neutralharmony-secondary-400 to-neutralharmony-secondary-500 rounded-lg flex items-center justify-center">
                        <Folder className="w-5 h-5 text-white" />
                      </div>
                      <h4 className="font-bold text-neutralharmony-primary-900 text-lg">{collection.name}</h4>
                    </div>
                    <p className="text-neutralharmony-primary-600 mb-3 leading-relaxed">
                      {collection.description}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-neutralharmony-primary-500">
                      <span className="font-semibold">{collection.documentCount} documents</span>
                      <span>Updated {collection.lastUpdated}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-neutralharmony-primary-500 hover:text-neutralharmony-secondary-600 hover:bg-neutralharmony-secondary-50 rounded-lg transition-colors duration-200">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-neutralharmony-primary-500 hover:text-neutralharmony-contrast-600 hover:bg-neutralharmony-contrast-50 rounded-lg transition-colors duration-200">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {collections.length === 0 && (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gradient-to-br from-neutralharmony-background-200 to-neutralharmony-background-300 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Folder className="w-10 h-10 text-neutralharmony-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-neutralharmony-primary-900 mb-3">No Collections Yet</h3>
              <p className="text-neutralharmony-primary-600 mb-6 leading-relaxed">
                Create your first collection to organize your documents and URLs
              </p>
              <Button className="bg-gradient-to-r from-neutralharmony-secondary-500 to-neutralharmony-secondary-600 hover:from-neutralharmony-secondary-600 hover:to-neutralharmony-secondary-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200">
                Create Collection
              </Button>
            </div>
          )}

          {/* Coming Soon Notice */}
          <div className="p-6 bg-gradient-to-br from-neutralharmony-tertiary-50 to-neutralharmony-tertiary-100 border-2 border-neutralharmony-tertiary-200 rounded-xl">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-neutralharmony-tertiary-400 to-neutralharmony-tertiary-500 rounded-lg flex items-center justify-center">
                <Plus className="w-4 h-4 text-white" />
              </div>
              <h4 className="font-bold text-neutralharmony-primary-900 text-lg">Collections Feature (WIP)</h4>
            </div>
            <p className="text-neutralharmony-primary-600 leading-relaxed">
              This feature demonstrates advanced state management and UI design patterns. Collections will showcase React hooks, context providers, and modern component architecture for scalable document organization.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
