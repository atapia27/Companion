'use client';

import { X, Folder, Plus, Trash2, Edit3 } from 'lucide-react';
import { useCollections } from '../../context-management/hooks';

interface CollectionsManagementModalProps {
  onCloseAction: () => void;
}

export function CollectionsManagementModal({ onCloseAction }: CollectionsManagementModalProps) {
  const { collections } = useCollections();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">Collections</h2>
          <button
            onClick={onCloseAction}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Your Collections</h3>
              <p className="text-sm text-muted-foreground">
                Organize your documents and URLs into themed collections
              </p>
            </div>
            <button className="btn btn-primary flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>New Collection</span>
            </button>
          </div>

          {/* Collections List */}
          <div className="space-y-4">
            {collections.map((collection) => (
              <div key={collection.id} className="p-4 bg-card rounded-lg border hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <Folder className="w-5 h-5 text-primary" />
                      <h4 className="font-semibold text-foreground">{collection.name}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {collection.description}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <span>{collection.documentCount} documents</span>
                      <span>Updated {collection.lastUpdated}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-muted-foreground hover:text-destructive transition-colors">
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
              <Folder className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No Collections Yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first collection to organize your documents and URLs
              </p>
              <button className="btn btn-primary">
                Create Collection
              </button>
            </div>
          )}

          {/* Coming Soon Notice */}
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h4 className="font-medium text-foreground mb-2">Collections Feature</h4>
            <p className="text-sm text-muted-foreground">
              The collections feature is coming soon! You'll be able to organize your documents and URLs into themed collections for better organization and context management.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
