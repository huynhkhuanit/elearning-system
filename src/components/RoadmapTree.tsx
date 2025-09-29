"use client";

import { motion } from "framer-motion";
import { Check, ArrowDown, ExternalLink, BookOpen, Users, Clock } from "lucide-react";
import Link from "next/link";

interface TreeNode {
  id: string;
  title: string;
  description?: string;
  type: 'core' | 'optional' | 'alternative' | 'beginner' | 'advanced';
  status?: 'completed' | 'current' | 'locked' | 'available';
  children?: TreeNode[];
  prerequisites?: string[];
  duration?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  resources?: {
    title: string;
    type: 'course' | 'article' | 'video' | 'practice';
    url: string;
  }[];
}

interface RoadmapTreeProps {
  title: string;
  subtitle?: string;
  description?: string;
  tree: TreeNode;
  className?: string;
}

const NodeComponent = ({ node, level = 0 }: { node: TreeNode; level?: number }) => {
  const getNodeColor = () => {
    switch (node.type) {
      case 'core': return 'from-yellow-400 to-yellow-500';
      case 'optional': return 'from-blue-400 to-blue-500';
      case 'alternative': return 'from-green-400 to-green-500';
      case 'beginner': return 'from-orange-400 to-orange-500';
      case 'advanced': return 'from-purple-400 to-purple-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const getStatusColor = () => {
    switch (node.status) {
      case 'completed': return 'border-green-500 bg-green-50';
      case 'current': return 'border-blue-500 bg-blue-50 ring-2 ring-blue-200';
      case 'locked': return 'border-gray-300 bg-gray-50 opacity-60';
      default: return 'border-gray-200 bg-white hover:border-gray-300';
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Node */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: level * 0.1 }}
        className={`
          relative group cursor-pointer
          ${level === 0 ? 'w-32 h-32' : 'w-24 h-24'}
        `}
      >
        {/* Status Icon */}
        {node.status === 'completed' && (
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center z-10">
            <Check className="w-4 h-4 text-white" />
          </div>
        )}

        <div className={`
          w-full h-full rounded-2xl border-2 transition-all duration-300
          ${getStatusColor()}
          group-hover:shadow-lg group-hover:scale-105
        `}>
          {/* Core/Main Node */}
          {level === 0 ? (
            <div className={`
              w-full h-full rounded-xl bg-gradient-to-br ${getNodeColor()}
              flex flex-col items-center justify-center text-white shadow-lg
            `}>
              <div className="text-2xl font-bold mb-1">{node.title}</div>
              {node.description && (
                <div className="text-xs opacity-90 text-center px-2">
                  {node.description}
                </div>
              )}
            </div>
          ) : (
            <div className="w-full h-full p-3 flex flex-col justify-center">
              <div className="text-sm font-semibold text-gray-800 text-center leading-tight">
                {node.title}
              </div>
              {node.duration && (
                <div className="text-xs text-gray-500 text-center mt-1 flex items-center justify-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {node.duration}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Tooltip/Info on Hover */}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
          <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-lg">
            <div className="font-medium">{node.title}</div>
            {node.description && (
              <div className="opacity-75 mt-1 max-w-xs">
                {node.description}
              </div>
            )}
            {node.resources && (
              <div className="mt-2 space-y-1">
                {node.resources.slice(0, 2).map((resource, idx) => (
                  <div key={idx} className="flex items-center space-x-1">
                    <BookOpen className="w-3 h-3" />
                    <span>{resource.title}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Connection Lines and Children */}
      {node.children && node.children.length > 0 && (
        <>
          {/* Vertical line down */}
          <div className="w-0.5 h-8 bg-blue-300"></div>
          
          {/* Horizontal line for multiple children */}
          {node.children.length > 1 && (
            <div className="relative">
              <div className={`h-0.5 bg-blue-300`} style={{ width: `${(node.children.length - 1) * 150}px` }}></div>
              {/* Vertical lines to each child */}
              {node.children.map((_, idx) => (
                <div
                  key={idx}
                  className="absolute w-0.5 h-8 bg-blue-300"
                  style={{ left: `${idx * 150}px`, top: '0' }}
                ></div>
              ))}
            </div>
          )}

          {/* Children Nodes */}
          <div className={`flex ${node.children.length > 1 ? 'space-x-20' : ''} mt-8`}>
            {node.children.map((child, idx) => (
              <NodeComponent key={child.id} node={child} level={level + 1} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const RoadmapTree: React.FC<RoadmapTreeProps> = ({ 
  title, 
  subtitle, 
  description, 
  tree, 
  className = "" 
}) => {
  return (
    <div className={`w-full ${className}`}>
      {/* Header */}
      <div className="text-center mb-12">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-gray-900 mb-2"
        >
          {title}
        </motion.h2>
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-indigo-600 mb-4"
          >
            {subtitle}
          </motion.p>
        )}
        {description && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 max-w-4xl mx-auto"
          >
            {description}
          </motion.p>
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-6 mb-12">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded"></div>
          <span className="text-sm text-gray-600">Core Skills</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-gradient-to-br from-blue-400 to-blue-500 rounded"></div>
          <span className="text-sm text-gray-600">Optional</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-gradient-to-br from-green-400 to-green-500 rounded"></div>
          <span className="text-sm text-gray-600">Alternative</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-gradient-to-br from-orange-400 to-orange-500 rounded"></div>
          <span className="text-sm text-gray-600">Beginner Friendly</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-gradient-to-br from-purple-400 to-purple-500 rounded"></div>
          <span className="text-sm text-gray-600">Advanced</span>
        </div>
      </div>

      {/* Tree Visualization */}
      <div className="overflow-x-auto pb-8">
        <div className="min-w-max px-8">
          <NodeComponent node={tree} />
        </div>
      </div>

      {/* Additional Info Panel */}
      <div className="mt-12 grid md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
            <BookOpen className="w-5 h-5 text-blue-600 mr-2" />
            Personal Recommendation
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            HTML, CSS and JavaScript are the backbone of web development. Make sure to practice by building lots of projects.
          </p>
          <Link 
            href="/roadmap/beginner-projects" 
            className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
          >
            Beginner Project Ideas <ExternalLink className="w-3 h-3 ml-1" />
          </Link>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
            <Users className="w-5 h-5 text-green-600 mr-2" />
            Alternative Option
          </h3>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>• JavaScript Roadmap</li>
            <li>• React Roadmap</li>
            <li>• TypeScript Roadmap</li>
            <li>• Node.js Roadmap</li>
          </ul>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-6 border border-purple-100">
          <h3 className="font-semibold text-gray-900 mb-3">Order not strict on roadmap</h3>
          <p className="text-sm text-gray-600 mb-4">
            Find the detailed version of this roadmap along with other similar roadmaps
          </p>
          <button className="bg-gray-800 hover:bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
            roadmap.sh
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoadmapTree;