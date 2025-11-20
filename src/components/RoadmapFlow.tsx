"use client";

import { useCallback, useMemo, useState, useEffect } from 'react';
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

// Custom styles for roadmap edges - Smooth & Thick
const edgeStyles = `
  .react-flow__edge-path {
    stroke: #94a3b8;
    stroke-width: 3;
    stroke-linecap: round;
  }

  .react-flow__edge.selected .react-flow__edge-path {
    stroke: #6366f1;
    stroke-width: 4;
  }
`;

import { ArrowLeft, BookOpen, Grid3X3, List } from 'lucide-react';
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
  
  // Store original status for each node
  const [originalStatus] = useState<Map<string, string>>(() => {
    const statusMap = new Map<string, string>();
    const collectStatus = (node: RoadmapNode) => {
      statusMap.set(node.id, node.status);
      if (node.children) {
        node.children.forEach(collectStatus);
      }
    };
    collectStatus(roadmapData);
    return statusMap;
  });
  
  const [completedNodes, setCompletedNodes] = useState<Set<string>>(() => {
    // Initialize with nodes that are already completed in the data
    const initialCompleted = new Set<string>();
    const collectCompleted = (node: RoadmapNode) => {
      if (node.status === 'completed') {
        initialCompleted.add(node.id);
      }
      if (node.children) {
        node.children.forEach(collectCompleted);
      }
    };
    collectCompleted(roadmapData);
    return initialCompleted;
  });

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
    const NODE_WIDTH = 220;
    const NODE_HEIGHT = 100; // Approximate height including content
    const GAP_X = 40; // Horizontal gap between nodes
    const GAP_Y = 80; // Vertical gap between levels

    // Helper to calculate subtree dimensions
    const getSubtreeDimensions = (node: RoadmapNode, isVertical: boolean): number => {
      if (!node.children || node.children.length === 0) {
        return isVertical ? NODE_WIDTH : NODE_HEIGHT;
      }

      const childrenDimension = node.children.reduce((acc, child) => {
        return acc + getSubtreeDimensions(child, isVertical);
      }, 0);

      const gapTotal = (node.children.length - 1) * (isVertical ? GAP_X : GAP_Y);
      return Math.max(isVertical ? NODE_WIDTH : NODE_HEIGHT, childrenDimension + gapTotal);
    };

    // Recursive function to assign positions
    function processNode(
      node: RoadmapNode, 
      x: number, 
      y: number, 
      parentId?: string
    ): string {
      const currentId = node.id || `node-${nodeId++}`;

      // Determine status
      let actualStatus = node.status;
      if (completedNodes.has(currentId)) {
        actualStatus = 'completed';
      } else if (node.status === 'completed') {
        actualStatus = 'available';
      }

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
          status: actualStatus,
          duration: node.duration,
          technologies: node.technologies,
          onClick: handleNodeClick,
        },
      });

      if (parentId) {
        edges.push({
          id: `edge-${parentId}-${currentId}`,
          source: parentId,
          target: currentId,
          type: 'default',
          style: {
            stroke: '#94a3b8',
            strokeWidth: 3,
          },
          animated: actualStatus === 'current',
        });
      }

      if (node.children && node.children.length > 0) {
        const isVertical = layoutMode === 'vertical';
        const subtreeSize = getSubtreeDimensions(node, isVertical);
        
        let currentPos = isVertical 
          ? x - subtreeSize / 2 
          : y - subtreeSize / 2;

        node.children.forEach((child) => {
          const childSubtreeSize = getSubtreeDimensions(child, isVertical);
          
          if (isVertical) {
            const childX = currentPos + childSubtreeSize / 2;
            const childY = y + NODE_HEIGHT + GAP_Y;
            processNode(child, childX, childY, currentId);
            currentPos += childSubtreeSize + GAP_X;
          } else {
            const childX = x + NODE_WIDTH + GAP_X;
            const childY = currentPos + childSubtreeSize / 2;
            processNode(child, childX, childY, currentId);
            currentPos += childSubtreeSize + GAP_Y;
          }
        });
      }

      return currentId;
    }

    // Start layout from center
    const startX = 600;
    const startY = 50;
    
    processNode(roadmapData, startX, startY);

    return { nodes, edges };
  }, [roadmapData, layoutMode, handleNodeClick, completedNodes]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Update nodes when completedNodes changes
  const updateNodesStatus = useCallback(() => {
    setNodes((nds) =>
      nds.map((node) => {
        const nodeOriginalStatus = originalStatus.get(node.id) || 'available';
        let actualStatus = nodeOriginalStatus;
        
        if (completedNodes.has(node.id)) {
          actualStatus = 'completed';
        } else if (nodeOriginalStatus !== 'completed' && nodeOriginalStatus !== 'current' && nodeOriginalStatus !== 'locked') {
          // Keep original status if it's not completed
          actualStatus = nodeOriginalStatus;
        } else if (nodeOriginalStatus === 'completed') {
          // If originally completed but removed from completedNodes, set to available
          actualStatus = 'available';
        } else {
          // Keep current or locked status
          actualStatus = nodeOriginalStatus;
        }
        
        return {
          ...node,
          data: {
            ...node.data,
            status: actualStatus,
          },
        };
      })
    );
  }, [completedNodes, setNodes, originalStatus]);

  // Trigger update when completedNodes changes
  useEffect(() => {
    updateNodesStatus();
  }, [completedNodes, updateNodesStatus]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // Re-initialize nodes when layout mode changes
  useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

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
                <div className="self-stretch w-px bg-gray-200"></div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">{roadmapTitle}</h2>
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