"use client";

import { useCallback, useMemo, useState } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Panel,
  Node,
  Edge,
  Connection,
  BackgroundVariant,
} from 'reactflow';
import 'reactflow/dist/style.css';

// Custom styles for roadmap edges - Simple & Clean
const edgeStyles = `
  .react-flow__edge-path {
    stroke: #d1d5db;
    stroke-width: 2;
  }

  .react-flow__edge.selected .react-flow__edge-path {
    stroke: #6366f1;
  }
`;
import { ArrowLeft, Play, CheckCircle, Clock, BookOpen, Users, Star, Award, Zap, Code, Server, Database, Layers, Cloud, Gamepad2, Brain, BarChart3, Palette, Briefcase, Shield, Smartphone, Monitor, Grid3X3, List } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import RoadmapNode from './RoadmapNode';
import RoadmapDetailModal from './RoadmapDetailModal';

interface RoadmapNode {
  id: string;
  title: string;
  description: string;
  type: 'core' | 'optional' | 'beginner' | 'alternative';
  status: 'available' | 'completed' | 'current' | 'locked';
  duration?: string;
  technologies?: string[];
  difficulty?: 'Cơ bản' | 'Trung cấp' | 'Nâng cao';
  children?: RoadmapNode[];
}

interface RoadmapFlowProps {
  roadmapId: string;
  roadmapTitle: string;
  roadmapData: RoadmapNode;
}

// Node types - Using imported RoadmapNode component
const nodeTypes = {
  roadmapNode: RoadmapNode,
};

export default function RoadmapFlow({ roadmapId, roadmapTitle, roadmapData }: RoadmapFlowProps) {
  const [layoutMode, setLayoutMode] = useState<'vertical' | 'horizontal'>('vertical');
  const [selectedNode, setSelectedNode] = useState<RoadmapNode | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [completedNodes, setCompletedNodes] = useState<Set<string>>(new Set());

  // Handle node click
  const handleNodeClick = useCallback((nodeId: string) => {
    const findNode = (node: RoadmapNode): RoadmapNode | null => {
      if (node.id === nodeId) return node;
      if (node.children) {
        for (const child of node.children) {
          const found = findNode(child);
          if (found) return found;
        }
      }
      return null;
    };
    
    const node = findNode(roadmapData);
    if (node) {
      setSelectedNode(node);
      setIsModalOpen(true);
    }
  }, [roadmapData]);

  // Handle toggle completion
  const handleToggleComplete = useCallback((nodeId: string) => {
    setCompletedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  }, []);

  // Convert roadmap data to React Flow format with improved layout
  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];
    let nodeId = 1;

    // Layout configuration
    const NODE_WIDTH = 280;
    const NODE_HEIGHT = 120;
    const VERTICAL_SPACING = 250;
    const HORIZONTAL_SPACING = 350;

    function processNode(node: RoadmapNode, x: number, y: number, parentId?: string, level: number = 0): string {
      const currentId = node.id || `node-${nodeId++}`;

      nodes.push({
        id: currentId,
        type: 'roadmapNode',
        position: { x, y },
        data: {
          ...node,
          id: node.id,
          title: node.title,
          description: node.description,
          type: node.type,
          status: completedNodes.has(currentId) ? 'completed' : node.status,
          duration: node.duration,
          technologies: node.technologies,
          onClick: handleNodeClick,
        },
      });

      // Create edge from parent to current node
      if (parentId) {
        edges.push({
          id: `edge-${parentId}-${currentId}`,
          source: parentId,
          target: currentId,
          type: 'smoothstep',
          style: {
            stroke: '#d1d5db',
            strokeWidth: 2,
          },
          animated: node.status === 'current',
        });
      }

      // Process children nodes with layout mode support
      if (node.children && node.children.length > 0) {
        if (layoutMode === 'vertical') {
          // Vertical layout (top to bottom)
          const childY = y + VERTICAL_SPACING;
          const totalChildrenWidth = node.children.length * HORIZONTAL_SPACING - (HORIZONTAL_SPACING - NODE_WIDTH);
          let startX = x - (totalChildrenWidth - NODE_WIDTH) / 2;

          // Ensure minimum spacing and prevent overlap
          const minSpacing = NODE_WIDTH + 40;
          const actualSpacing = Math.max(minSpacing, HORIZONTAL_SPACING);

          if (actualSpacing > HORIZONTAL_SPACING) {
            startX = x - ((node.children.length - 1) * actualSpacing) / 2;
          }

          node.children.forEach((child, index) => {
            const childX = startX + (index * actualSpacing);
            processNode(child, childX, childY, currentId, level + 1);
          });
        } else {
          // Horizontal layout (left to right)
          const childX = x + HORIZONTAL_SPACING;
          const totalChildrenHeight = node.children.length * VERTICAL_SPACING - (VERTICAL_SPACING - NODE_HEIGHT);
          let startY = y - (totalChildrenHeight - NODE_HEIGHT) / 2;

          // Ensure minimum spacing and prevent overlap
          const minSpacing = NODE_HEIGHT + 40;
          const actualSpacing = Math.max(minSpacing, VERTICAL_SPACING);

          if (actualSpacing > VERTICAL_SPACING) {
            startY = y - ((node.children.length - 1) * actualSpacing) / 2;
          }

          node.children.forEach((child, index) => {
            const childY = startY + (index * actualSpacing);
            processNode(child, childX, childY, currentId, level + 1);
          });
        }
      }

      return currentId;
    }

    // Start with root node centered
    const startX = typeof window !== 'undefined' ? Math.max(600, window.innerWidth / 2 - NODE_WIDTH / 2) : 600;
    const startY = 50;
    processNode(roadmapData, startX, startY);

    return { nodes, edges };
  }, [roadmapData, layoutMode, handleNodeClick, completedNodes]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <style dangerouslySetInnerHTML={{ __html: edgeStyles }} />
      <div className="relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border-b border-gray-200 sticky top-0 z-10"
        >
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link href="/roadmap" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors">
                  <ArrowLeft className="w-5 h-5" />
                  <span className="font-medium">Quay lại</span>
                </Link>
                <div className="h-6 w-px bg-gray-200"></div>
                <div>
                  <h1 className="text-lg font-semibold text-gray-900">{roadmapTitle}</h1>
                  <p className="text-sm text-gray-500">
                    {nodes.length} kỹ năng • Bố cục {layoutMode === 'vertical' ? 'Dọc' : 'Ngang'}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setLayoutMode(layoutMode === 'vertical' ? 'horizontal' : 'vertical')}
                  className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center gap-2"
                >
                  {layoutMode === 'vertical' ? <Grid3X3 className="w-4 h-4" /> : <List className="w-4 h-4" />}
                  <span>Đổi bố cục</span>
                </button>

                <Link href={`/roadmap/${roadmapId}`}>
                  <button className="px-4 py-2 text-sm font-medium text-white bg-[#6366f1] hover:bg-[#5558e3] rounded-lg transition-colors flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    <span>Xem khóa học</span>
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>

        {/* React Flow Container */}
        <div className="h-[calc(100vh-80px)]">
          <ReactFlow
            key={layoutMode} // Force re-render when layout changes
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{
              padding: 0.2,
              includeHiddenNodes: false,
              minZoom: 0.1,
              maxZoom: 1.5,
            }}
            defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
            attributionPosition="bottom-left"
            className="bg-transparent"
            minZoom={0.1}
            maxZoom={2}
            nodesDraggable={false}
            nodesConnectable={false}
            elementsSelectable={true}
            selectNodesOnDrag={false}
          >
            <Controls
              className="bg-white border border-gray-200 rounded-lg shadow-sm"
              showZoom
              showFitView
              showInteractive={false}
            />

            <MiniMap
              className="bg-white border border-gray-200 rounded-lg shadow-sm"
              nodeColor={(node) => {
                switch (node.data?.type) {
                  case 'core': return '#e0e7ff';
                  case 'optional': return '#f1f5f9';
                  case 'beginner': return '#d1fae5';
                  case 'alternative': return '#fef3c7';
                  default: return '#f3f4f6';
                }
              }}
              maskColor="rgba(255, 255, 255, 0.9)"
            />

            <Background
              variant={BackgroundVariant.Dots}
              gap={20}
              size={1}
              color="#e5e7eb"
            />

            {/* Legend Panel */}
            <Panel position="top-right" className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm max-w-xs">
              <h3 className="font-medium text-gray-900 mb-3 text-sm">
                Chú giải
              </h3>

              <div className="space-y-3">
                <div>
                  <h4 className="text-xs font-medium text-gray-700 mb-2">Loại nội dung</h4>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 border-2 border-indigo-200 rounded"></div>
                      <span className="text-gray-600">Cốt lõi</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 border-2 border-slate-200 rounded"></div>
                      <span className="text-gray-600">Tùy chọn</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 border-2 border-emerald-200 rounded"></div>
                      <span className="text-gray-600">Cơ bản</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 border-2 border-amber-200 rounded"></div>
                      <span className="text-gray-600">Thay thế</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-100">
                  <h4 className="text-xs font-medium text-gray-700 mb-2">Trạng thái</h4>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                      <span className="text-gray-600">Đã hoàn thành</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-indigo-100 border-2 border-indigo-200 rounded"></div>
                      <span className="text-gray-600">Đang học</span>
                    </div>
                  </div>
                </div>
              </div>
            </Panel>
          </ReactFlow>
        </div>
      </div>

      {/* Detail Modal */}
      <RoadmapDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        nodeData={selectedNode}
        isCompleted={selectedNode ? completedNodes.has(selectedNode.id) : false}
        onToggleComplete={handleToggleComplete}
      />
    </div>
  );
}