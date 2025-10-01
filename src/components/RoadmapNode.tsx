"use client";

import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Check, Lock } from 'lucide-react';

export interface RoadmapNodeData {
  id: string;
  title: string;
  description?: string;
  type: 'core' | 'optional' | 'beginner' | 'alternative';
  status: 'available' | 'completed' | 'current' | 'locked';
  duration?: string;
  technologies?: string[];
  difficulty?: 'Cơ bản' | 'Trung cấp' | 'Nâng cao';
  children?: any[];
  onClick?: (nodeId: string) => void;
}

const RoadmapNode = ({ data, selected }: NodeProps<RoadmapNodeData>) => {
  const getNodeStyles = () => {
    // Simple, clean border colors based on type
    switch (data.type) {
      case 'core':
        return 'border-indigo-200 hover:border-indigo-400';
      case 'optional':
        return 'border-slate-200 hover:border-slate-400';
      case 'beginner':
        return 'border-emerald-200 hover:border-emerald-400';
      case 'alternative':
        return 'border-amber-200 hover:border-amber-400';
      default:
        return 'border-gray-200 hover:border-gray-400';
    }
  };

  const getStatusStyles = () => {
    switch (data.status) {
      case 'completed':
        return 'bg-white border-2 ring-2 ring-emerald-100';
      case 'current':
        return 'bg-indigo-50 border-2 ring-2 ring-indigo-100';
      case 'locked':
        return 'bg-gray-50 border-2 opacity-60';
      default:
        return 'bg-white border-2';
    }
  };

  const borderStyle = getNodeStyles();
  const statusStyle = getStatusStyles();

  const handleClick = () => {
    if (data.status !== 'locked' && data.onClick) {
      data.onClick(data.id);
    }
  };

  return (
    <div className="relative">
      <Handle
        type="target"
        position={Position.Top}
        className="w-2 h-2 !bg-gray-300 !border-0"
      />

      <div
        onClick={handleClick}
        className={`
          ${statusStyle}
          ${borderStyle}
          ${selected ? 'ring-2 ring-indigo-300' : ''}
          ${data.status === 'locked' ? 'cursor-not-allowed' : 'cursor-pointer'}
          w-[180px] rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200
        `}
      >
        {/* Status indicator */}
        {data.status === 'completed' && (
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center shadow-sm">
            <Check className="w-4 h-4 text-white" strokeWidth={3} />
          </div>
        )}
        
        {data.status === 'locked' && (
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center shadow-sm">
            <Lock className="w-3 h-3 text-white" />
          </div>
        )}

        {/* Title */}
        <h3 className="font-semibold text-sm text-gray-900 mb-1 leading-tight">
          {data.title}
        </h3>

        {/* Duration - minimal */}
        {data.duration && (
          <p className="text-xs text-gray-500">
            {data.duration}
          </p>
        )}

        {/* Type badge - minimal */}
        <div className="mt-3 pt-2 border-t border-gray-100">
          <span className="text-[10px] font-medium text-gray-600 uppercase tracking-wider">
            {data.type === 'core' ? 'Core' :
             data.type === 'optional' ? 'Optional' :
             data.type === 'beginner' ? 'Basic' : 'Alternative'}
          </span>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="w-2 h-2 !bg-gray-300 !border-0"
      />
    </div>
  );
};

export default memo(RoadmapNode);
