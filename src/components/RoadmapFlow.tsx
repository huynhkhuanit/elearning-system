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

// Custom styles for roadmap edges
const edgeStyles = `
  .react-flow__edge-path {
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .react-flow__edge.animated .react-flow__edge-path {
    stroke-dasharray: 5, 5;
    animation: dash 1.5s linear infinite;
  }

  @keyframes dash {
    to {
      stroke-dashoffset: -10;
    }
  }

  .react-flow__edge-core .react-flow__edge-path {
    stroke: #3b82f6 !important;
    stroke-width: 3 !important;
    filter: drop-shadow(0 1px 2px rgba(59, 130, 246, 0.3));
  }

  .react-flow__edge-optional .react-flow__edge-path {
    stroke: #8b5cf6 !important;
    stroke-width: 2 !important;
    stroke-dasharray: 5, 5 !important;
    filter: drop-shadow(0 1px 2px rgba(139, 92, 246, 0.3));
  }

  .react-flow__edge-beginner .react-flow__edge-path {
    stroke: #10b981 !important;
    stroke-width: 2 !important;
    filter: drop-shadow(0 1px 2px rgba(16, 185, 129, 0.3));
  }

  .react-flow__edge-alternative .react-flow__edge-path {
    stroke: #f59e0b !important;
    stroke-width: 2 !important;
    stroke-dasharray: 10, 5 !important;
    filter: drop-shadow(0 1px 2px rgba(245, 158, 11, 0.3));
  }

  .react-flow__edge-core.animated .react-flow__edge-path,
  .react-flow__edge-optional.animated .react-flow__edge-path,
  .react-flow__edge-beginner.animated .react-flow__edge-path,
  .react-flow__edge-alternative.animated .react-flow__edge-path {
    animation: flow 2s ease-in-out infinite;
  }

  @keyframes flow {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.6; }
  }
`;
import { ArrowLeft, Play, CheckCircle, Clock, BookOpen, Users, Star, Award, Zap, Code, Server, Database, Layers, Cloud, Gamepad2, Brain, BarChart3, Palette, Briefcase, Shield, Smartphone, Monitor, Grid3X3, List } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

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

// Custom node component
function CustomNode({ data }: { data: any }) {
  const getNodeStyle = () => {
    const baseStyle = "px-4 py-3 rounded-xl border-2 transition-all duration-300 shadow-lg hover:shadow-xl";

    switch (data.type) {
      case 'core':
        return `${baseStyle} bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-300 hover:border-blue-400`;
      case 'optional':
        return `${baseStyle} bg-gradient-to-br from-purple-50 to-pink-50 border-purple-300 hover:border-purple-400`;
      case 'beginner':
        return `${baseStyle} bg-gradient-to-br from-green-50 to-emerald-50 border-green-300 hover:border-green-400`;
      case 'alternative':
        return `${baseStyle} bg-gradient-to-br from-orange-50 to-amber-50 border-orange-300 hover:border-orange-400`;
      default:
        return `${baseStyle} bg-white border-gray-300 hover:border-gray-400`;
    }
  };

  const getStatusIcon = () => {
    switch (data.status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'current':
        return <Play className="w-5 h-5 text-blue-600" />;
      case 'locked':
        return <Clock className="w-5 h-5 text-gray-400" />;
      default:
        return <BookOpen className="w-5 h-5 text-indigo-600" />;
    }
  };

  return (
    <div className={getNodeStyle()}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-1">
          {getStatusIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-sm leading-tight mb-1">
            {data.title}
          </h3>
          {data.description && (
            <p className="text-xs text-gray-600 mb-2 line-clamp-2">
              {data.description}
            </p>
          )}
          {data.duration && (
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <Clock className="w-3 h-3" />
              <span>{data.duration}</span>
            </div>
          )}
          {data.technologies && data.technologies.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {data.technologies.slice(0, 3).map((tech: string, idx: number) => (
                <span key={idx} className="px-2 py-1 bg-white/60 text-xs rounded-full text-gray-600 border border-gray-200">
                  {tech}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Node types
const nodeTypes = {
  custom: CustomNode,
};

export default function RoadmapFlow({ roadmapId, roadmapTitle, roadmapData }: RoadmapFlowProps) {
  const [layoutMode, setLayoutMode] = useState<'vertical' | 'horizontal'>('vertical');

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
      const currentId = `node-${nodeId++}`;

      nodes.push({
        id: currentId,
        type: 'custom',
        position: { x, y },
        data: {
          ...node,
          title: node.title,
          description: node.description,
          type: node.type,
          status: node.status,
          duration: node.duration,
          technologies: node.technologies,
        },
      });

      // Create edge from parent to current node
      if (parentId) {
        const getEdgeStyle = () => {
          switch (node.type) {
            case 'core':
              return {
                stroke: '#3b82f6',
                strokeWidth: 3,
                strokeDasharray: '0',
              };
            case 'optional':
              return {
                stroke: '#8b5cf6',
                strokeWidth: 2,
                strokeDasharray: '5,5',
              };
            case 'beginner':
              return {
                stroke: '#10b981',
                strokeWidth: 2,
                strokeDasharray: '0',
              };
            case 'alternative':
              return {
                stroke: '#f59e0b',
                strokeWidth: 2,
                strokeDasharray: '10,5',
              };
            default:
              return {
                stroke: '#6b7280',
                strokeWidth: 2,
                strokeDasharray: '0',
              };
          }
        };

        edges.push({
          id: `edge-${parentId}-${currentId}`,
          source: parentId,
          target: currentId,
          type: 'smoothstep',
          className: `react-flow__edge-${node.type}${node.status === 'current' ? ' animated' : ''}`,
          style: getEdgeStyle(),
          markerEnd: {
            type: 'arrowclosed',
            color: getEdgeStyle().stroke,
            width: 20,
            height: 20,
          },
          animated: node.status === 'current',
          label: node.type === 'alternative' ? 'Alternative' : node.type === 'optional' ? 'Optional' : '',
          labelStyle: {
            fontSize: '10px',
            fontWeight: 'bold',
            fill: getEdgeStyle().stroke,
          },
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
  }, [roadmapData, layoutMode]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <style dangerouslySetInnerHTML={{ __html: edgeStyles }} />
      <div className="relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10"
        >
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link href="/roadmap" className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-700 transition-colors">
                  <ArrowLeft className="w-5 h-5" />
                  <span className="font-medium">Quay lại lộ trình</span>
                </Link>
                <div className="h-6 w-px bg-gray-300"></div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">{roadmapTitle}</h1>
                  <p className="text-sm text-gray-600">
                    {nodes.length} kỹ năng • {edges.length} mối quan hệ • Bố cục {layoutMode === 'vertical' ? 'dọc' : 'ngang'}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setLayoutMode(layoutMode === 'vertical' ? 'horizontal' : 'vertical')}
                  className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors flex items-center space-x-2"
                  title={`Chuyển sang bố cục ${layoutMode === 'vertical' ? 'ngang' : 'dọc'}`}
                >
                  {layoutMode === 'vertical' ? <Grid3X3 className="w-4 h-4" /> : <List className="w-4 h-4" />}
                  <span>{layoutMode === 'vertical' ? 'Ngang' : 'Dọc'}</span>
                </button>

                <Link href={`/roadmap/${roadmapId}`}>
                  <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center space-x-2">
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
              className="bg-white border border-gray-200 rounded-lg shadow-lg"
              showZoom
              showFitView
              showInteractive={false}
            />

            <MiniMap
              className="bg-white border border-gray-200 rounded-lg shadow-lg"
              nodeColor={(node) => {
                switch (node.data?.type) {
                  case 'core': return '#3b82f6';
                  case 'optional': return '#8b5cf6';
                  case 'beginner': return '#10b981';
                  case 'alternative': return '#f59e0b';
                  default: return '#6b7280';
                }
              }}
              maskColor="rgba(255, 255, 255, 0.8)"
            />

            <Background
              variant={BackgroundVariant.Dots}
              gap={20}
              size={1}
              color="#e2e8f0"
            />

            {/* Legend Panel */}
            <Panel position="top-right" className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl p-4 shadow-xl max-w-xs">
              <h3 className="font-semibold text-gray-900 mb-4 text-sm flex items-center">
                <BookOpen className="w-4 h-4 mr-2 text-indigo-600" />
                Hướng dẫn
              </h3>

              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-gray-800 mb-2 text-xs">Bố cục hiện tại:</h4>
                  <div className="flex items-center space-x-2 text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded">
                    {layoutMode === 'vertical' ?
                      <><List className="w-3 h-3" /> <span>Dọc (Top → Bottom)</span></> :
                      <><Grid3X3 className="w-3 h-3" /> <span>Ngang (Left → Right)</span></>
                    }
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-3">
                  <h4 className="font-medium text-gray-800 mb-2 text-xs">Loại Node:</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full border-2 border-blue-300"></div>
                      <span>Kiến thức cốt lõi</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-purple-500 rounded-full border-2 border-purple-300"></div>
                      <span>Kiến thức bổ sung</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full border-2 border-green-300"></div>
                      <span>Mức độ cơ bản</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-orange-500 rounded-full border-2 border-orange-300"></div>
                      <span>Lựa chọn thay thế</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-3">
                  <h4 className="font-medium text-gray-800 mb-2 text-xs">Trạng thái:</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-3 h-3 text-green-600" />
                      <span>Đã hoàn thành</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Play className="w-3 h-3 text-blue-600 animate-pulse" />
                      <span>Đang học</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <span>Chưa mở khóa</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-3">
                  <h4 className="font-medium text-gray-800 mb-2 text-xs">Loại đường kết nối:</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-1 bg-blue-500 rounded-full"></div>
                      <span>Bắt buộc (Core)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-0.5 border-t-2 border-dashed border-purple-500 rounded"></div>
                      <span>Tùy chọn (Optional)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-1 bg-green-500 rounded-full"></div>
                      <span>Cơ bản (Beginner)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-0.5 border-t-2 border-dashed border-orange-500 rounded" style={{background: 'repeating-linear-gradient(90deg, #f59e0b, #f59e0b 4px, transparent 4px, transparent 8px)'}}></div>
                      <span>Thay thế (Alternative)</span>
                    </div>
                  </div>
                </div>
              </div>
            </Panel>
          </ReactFlow>
        </div>
      </div>
    </div>
  );
}