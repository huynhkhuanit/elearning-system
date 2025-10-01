"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check } from 'lucide-react';

interface LearningContent {
  id: string;
  title: string;
  type: 'video' | 'article' | 'practice' | 'quiz';
  duration?: string;
  completed?: boolean;
}

interface RoadmapDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  nodeData: {
    id: string;
    title: string;
    description?: string;
    type: 'core' | 'optional' | 'beginner' | 'alternative';
    status: 'available' | 'completed' | 'current' | 'locked';
    duration?: string;
    difficulty?: 'Cơ bản' | 'Trung cấp' | 'Nâng cao';
    technologies?: string[];
    learningContents?: LearningContent[];
  } | null;
  onMarkComplete?: (nodeId: string) => void;
}

const RoadmapDetailModal: React.FC<RoadmapDetailModalProps> = ({
  isOpen,
  onClose,
  nodeData,
  onMarkComplete
}) => {
  if (!nodeData) return null;

  // Sample learning contents if not provided
  const defaultLearningContents: LearningContent[] = [
    { id: '1', title: 'Introduction to ' + nodeData.title, type: 'video', duration: '15 min' },
    { id: '2', title: 'Core Concepts', type: 'article', duration: '20 min' },
    { id: '3', title: 'Hands-on Practice', type: 'practice', duration: '30 min' },
    { id: '4', title: 'Quick Assessment', type: 'quiz', duration: '10 min' },
  ];

  const learningContents = nodeData.learningContents || defaultLearningContents;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 overflow-y-auto"
          >
            {/* Header - Clean & Simple */}
            <div className="sticky top-0 z-10 bg-white border-b border-gray-100">
              <div className="px-6 py-5">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>

                <div className="pr-10">
                  <span className="inline-block px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded mb-3">
                    {nodeData.type === 'core' ? 'Core' :
                     nodeData.type === 'optional' ? 'Optional' :
                     nodeData.type === 'beginner' ? 'Basic' : 'Alternative'}
                  </span>
                  
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    {nodeData.title}
                  </h2>

                  {nodeData.duration && (
                    <p className="text-sm text-gray-500">{nodeData.duration}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="px-6 py-6 space-y-8">
              {/* Description */}
              {nodeData.description && (
                <div>
                  <p className="text-gray-700 leading-relaxed">
                    {nodeData.description}
                  </p>
                </div>
              )}

              {/* Technologies - Simple tags */}
              {nodeData.technologies && nodeData.technologies.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">
                    Technologies
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {nodeData.technologies.map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Learning Contents - Clean list */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-4">
                  What you'll learn
                </h3>
                <div className="space-y-3">
                  {learningContents.map((content) => (
                    <div
                      key={content.id}
                      className="group"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-5 h-5 mt-0.5 rounded-full border-2 border-gray-300 group-hover:border-indigo-400 transition-colors" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900 group-hover:text-indigo-600 transition-colors">
                            {content.title}
                          </p>
                          {content.duration && (
                            <p className="text-xs text-gray-500 mt-0.5">
                              {content.duration}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Button - Fixed at bottom */}
            <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4">
              {nodeData.status === 'locked' ? (
                <button
                  disabled
                  className="w-full py-3 text-sm font-medium text-gray-400 bg-gray-100 rounded-lg cursor-not-allowed"
                >
                  Locked
                </button>
              ) : nodeData.status === 'completed' ? (
                <div className="w-full py-3 text-sm font-medium text-emerald-700 bg-emerald-50 rounded-lg flex items-center justify-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>Completed</span>
                </div>
              ) : (
                <button
                  onClick={() => onMarkComplete && onMarkComplete(nodeData.id)}
                  className="w-full py-3 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  Mark as Complete
                </button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default RoadmapDetailModal;
