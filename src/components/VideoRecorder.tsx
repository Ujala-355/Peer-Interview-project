import React, { useState } from 'react';
import { useReactMediaRecorder } from 'react-media-recorder';
import { Video, Mic, Square, Circle } from 'lucide-react';

interface VideoRecorderProps {
  onRecordingComplete: (url: string) => void;
}

export function VideoRecorder({ onRecordingComplete }: VideoRecorderProps) {
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  
  const {
    status,
    startRecording,
    stopRecording,
    mediaBlobUrl,
  } = useReactMediaRecorder({
    video: true,
    audio: true,
    onStop: (blobUrl) => {
      setIsPreviewVisible(true);
      onRecordingComplete(blobUrl);
    },
  });

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">Interview Recording</h3>
        <div className="flex items-center space-x-2">
          <Video className="h-5 w-5 text-gray-400" />
          <Mic className="h-5 w-5 text-gray-400" />
        </div>
      </div>

      <div className="space-y-4">
        <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-lg overflow-hidden">
          {isPreviewVisible && mediaBlobUrl ? (
            <video
              src={mediaBlobUrl}
              controls
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">Camera preview will appear here</p>
            </div>
          )}
        </div>

        <div className="flex justify-center space-x-4">
          {status !== 'recording' ? (
            <button
              onClick={startRecording}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <Circle className="h-4 w-4 mr-2" />
              Start Recording
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
            >
              <Square className="h-4 w-4 mr-2" />
              Stop Recording
            </button>
          )}
        </div>

        <div className="text-sm text-gray-500 text-center">
          {status === 'recording' ? (
            <span className="text-red-500 flex items-center justify-center">
              <span className="animate-ping h-2 w-2 rounded-full bg-red-500 mr-2" />
              Recording in progress...
            </span>
          ) : (
            <p>Click "Start Recording" when you're ready to begin</p>
          )}
        </div>
      </div>
    </div>
  );
}