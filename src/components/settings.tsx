'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { X, Download, Trash2 } from 'lucide-react'

interface SettingsProps {
  isOpen: boolean
  onClose: () => void
  onInitializeModel: () => void
  onClearData: () => void
  modelStatus: string
  isModelLoaded: boolean
}

export function Settings({
  isOpen,
  onClose,
  onInitializeModel,
  onClearData,
  modelStatus,
  isModelLoaded
}: SettingsProps) {
  const [isClearing, setIsClearing] = useState(false)

  const handleClearData = async () => {
    if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      setIsClearing(true)
      try {
        onClearData()
      } finally {
        setIsClearing(false)
      }
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-background rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Settings</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">AI Model</h3>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">
                Status: {modelStatus}
              </div>
              {!isModelLoaded && (
                <Button 
                  onClick={onInitializeModel}
                  className="w-full"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Initialize Model
                </Button>
              )}
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Data Management</h3>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">
                All data is stored locally in your browser
              </div>
              <Button 
                variant="destructive" 
                onClick={handleClearData}
                disabled={isClearing}
                className="w-full"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {isClearing ? 'Clearing...' : 'Clear All Data'}
              </Button>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">About</h3>
            <div className="text-sm text-muted-foreground space-y-1">
              <div>Local Chat v0.1.0</div>
              <div>Powered by MLC-AI Web-LLM</div>
              <div>All processing happens locally in your browser</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 