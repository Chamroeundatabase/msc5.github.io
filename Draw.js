import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Copy, Trash2, Edit3, Grid, CornerUpLeft, CornerUpRight, Plus, Box, Zap, ZapOff, Play, Save, FolderOpen, Download, HardDriveDownload } from 'lucide-react';

// Utility function to generate a unique ID
const generateId = () => `comp-${Math.random().toString(36).substr(2, 9)}`;

// Grid size for snapping and background pattern
const GRID_SIZE = 20;

// ======================================================================================================
// NEW & REFACTORED COMPONENT DEFINITIONS
// This section defines the visual representation of each diagram component using SVG.
// ======================================================================================================

// Helper component for connection points
const ConnectionPoints = ({ onPointClick, id, isHovered }) => (
  <>
    {isHovered && (
      <>
        {/* Top point */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-yellow-400 cursor-crosshair z-10 hover:scale-125 transition-transform" onClick={(e) => onPointClick(e, id, 'top')}></div>
        {/* Bottom point */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-3 h-3 rounded-full bg-yellow-400 cursor-crosshair z-10 hover:scale-125 transition-transform" onClick={(e) => onPointClick(e, id, 'bottom')}></div>
        {/* Left point */}
        <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-yellow-400 cursor-crosshair z-10 hover:scale-125 transition-transform" onClick={(e) => onPointClick(e, id, 'left')}></div>
        {/* Right point */}
        <div className="absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-1/2 w-3 h-3 rounded-full bg-yellow-400 cursor-crosshair z-10 hover:scale-125 transition-transform" onClick={(e) => onPointClick(e, id, 'right')}></div>
      </>
    )}
  </>
);

const componentsMap = {
  Transformer: React.memo(({ id, label, x, y, onEdit, onPointClick, onDragStart, onMouseEnter, onMouseLeave, isSelected, isHovered }) => (
    <div
      id={id}
      className={`absolute flex flex-col items-center p-2 bg-gray-800 text-gray-200 border rounded-lg shadow-md transition-all duration-200 diagram-component ${isSelected ? 'border-purple-500 ring-2 ring-purple-500' : 'border-gray-600'}`}
      style={{ left: x, top: y, width: '90px', height: '90px' }}
      onMouseDown={(e) => onDragStart(e, id)}
      onContextMenu={(e) => { e.preventDefault(); onEdit(e, id, 'component'); }}
      onMouseEnter={() => onMouseEnter(id)}
      onMouseLeave={() => onMouseLeave()}
    >
      <svg width="60" height="60" viewBox="0 0 100 100" className="pointer-events-none">
        <rect x="20" y="10" width="60" height="35" fill="none" stroke="currentColor" strokeWidth="4" />
        <rect x="20" y="55" width="60" height="35" fill="none" stroke="currentColor" strokeWidth="4" />
        <line x1="50" y1="0" x2="50" y2="10" stroke="currentColor" strokeWidth="3" />
        <line x1="50" y1="90" x2="50" y2="100" stroke="currentColor" strokeWidth="3" />
        <text x="50" y="50" dominantBaseline="middle" textAnchor="middle" className="text-xl font-bold fill-white">T</text>
      </svg>
      <span className="mt-1 text-xxs font-semibold text-gray-200 cursor-pointer text-center" onDoubleClick={() => onEdit(null, id, 'component')}>
        {label}
      </span>
      <ConnectionPoints onPointClick={onPointClick} id={id} isHovered={isHovered} />
    </div>
  )),
  DG: React.memo(({ id, label, x, y, onEdit, onPointClick, onDragStart, onMouseEnter, onMouseLeave, isSelected, isHovered }) => (
    <div
      id={id}
      className={`absolute flex flex-col items-center p-2 bg-gray-800 text-gray-200 border rounded-lg shadow-md transition-all duration-200 diagram-component ${isSelected ? 'border-purple-500 ring-2 ring-purple-500' : 'border-gray-600'}`}
      style={{ left: x, top: y, width: '90px', height: '90px' }}
      onMouseDown={(e) => onDragStart(e, id)}
      onContextMenu={(e) => { e.preventDefault(); onEdit(e, id, 'component'); }}
      onMouseEnter={() => onMouseEnter(id)}
      onMouseLeave={() => onMouseLeave()}
    >
      <svg width="60" height="60" viewBox="0 0 100 100" className="pointer-events-none">
        <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="4" />
        <path d="M50 10 L50 90 M10 50 L90 50" stroke="currentColor" strokeWidth="3" />
        <text x="50" y="50" dominantBaseline="middle" textAnchor="middle" className="text-xl font-bold fill-white">DG</text>
      </svg>
      <span className="mt-1 text-xxs font-semibold text-gray-200 cursor-pointer text-center" onDoubleClick={() => onEdit(null, id, 'component')}>
        {label}
      </span>
      <ConnectionPoints onPointClick={onPointClick} id={id} isHovered={isHovered} />
    </div>
  )),
  ATS: React.memo(({ id, label, x, y, onEdit, onPointClick, onDragStart, onMouseEnter, onMouseLeave, isSelected, isHovered }) => (
    <div
      id={id}
      className={`absolute flex flex-col items-center p-2 bg-gray-800 text-gray-200 border rounded-lg shadow-md transition-all duration-200 diagram-component ${isSelected ? 'border-purple-500 ring-2 ring-purple-500' : 'border-gray-600'}`}
      style={{ left: x, top: y, width: '90px', height: '90px' }}
      onMouseDown={(e) => onDragStart(e, id)}
      onContextMenu={(e) => { e.preventDefault(); onEdit(e, id, 'component'); }}
      onMouseEnter={() => onMouseEnter(id)}
      onMouseLeave={() => onMouseLeave()}
    >
      <svg width="60" height="60" viewBox="0 0 100 100" className="pointer-events-none">
        <rect x="10" y="10" width="80" height="80" fill="none" stroke="currentColor" strokeWidth="4" />
        <line x1="10" y1="50" x2="90" y2="50" stroke="currentColor" strokeWidth="3" />
        <path d="M30 40 L50 60 L70 40" stroke="currentColor" strokeWidth="3" fill="none" />
        <text x="50" y="50" dominantBaseline="middle" textAnchor="middle" className="text-xl font-bold fill-white">ATS</text>
      </svg>
      <span className="mt-1 text-xxs font-semibold text-gray-200 cursor-pointer text-center" onDoubleClick={() => onEdit(null, id, 'component')}>
        {label}
      </span>
      <ConnectionPoints onPointClick={onPointClick} id={id} isHovered={isHovered} />
    </div>
  )),
  MDB: React.memo(({ id, label, x, y, onEdit, onPointClick, onDragStart, onMouseEnter, onMouseLeave, isSelected, isHovered }) => (
    <div
      id={id}
      className={`absolute flex flex-col items-center p-2 bg-gray-800 text-gray-200 border rounded-lg shadow-md transition-all duration-200 diagram-component ${isSelected ? 'border-purple-500 ring-2 ring-purple-500' : 'border-gray-600'}`}
      style={{ left: x, top: y, width: '90px', height: '90px' }}
      onMouseDown={(e) => onDragStart(e, id)}
      onContextMenu={(e) => { e.preventDefault(); onEdit(e, id, 'component'); }}
      onMouseEnter={() => onMouseEnter(id)}
      onMouseLeave={() => onMouseLeave()}
    >
      <svg width="60" height="60" viewBox="0 0 100 100" className="pointer-events-none">
        <rect x="20" y="20" width="60" height="60" fill="none" stroke="currentColor" strokeWidth="4" />
        <line x1="50" y1="20" x2="50" y2="80" stroke="currentColor" strokeWidth="3" />
        <text x="50" y="50" dominantBaseline="middle" textAnchor="middle" className="text-xl font-bold fill-white">MDB</text>
      </svg>
      <span className="mt-1 text-xxs font-semibold text-gray-200 cursor-pointer text-center" onDoubleClick={() => onEdit(null, id, 'component')}>
        {label}
      </span>
      <ConnectionPoints onPointClick={onPointClick} id={id} isHovered={isHovered} />
    </div>
  )),
  Load: React.memo(({ id, label, x, y, onEdit, onPointClick, onDragStart, onMouseEnter, onMouseLeave, isSelected, isHovered }) => (
    <div
      id={id}
      className={`absolute flex flex-col items-center p-2 bg-gray-800 text-gray-200 border rounded-lg shadow-md transition-all duration-200 diagram-component ${isSelected ? 'border-purple-500 ring-2 ring-purple-500' : 'border-gray-600'}`}
      style={{ left: x, top: y, width: '90px', height: '90px' }}
      onMouseDown={(e) => onDragStart(e, id)}
      onContextMenu={(e) => { e.preventDefault(); onEdit(e, id, 'component'); }}
      onMouseEnter={() => onMouseEnter(id)}
      onMouseLeave={() => onMouseLeave()}
    >
      <svg width="60" height="60" viewBox="0 0 100 100" className="pointer-events-none">
        <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="4" />
        <path d="M30 40 L70 60 M30 60 L70 40" stroke="currentColor" strokeWidth="3" />
        <text x="50" y="50" dominantBaseline="middle" textAnchor="middle" className="text-xl font-bold fill-white">L</text>
      </svg>
      <span className="mt-1 text-xxs font-semibold text-gray-200 cursor-pointer text-center" onDoubleClick={() => onEdit(null, id, 'component')}>
        {label}
      </span>
      <ConnectionPoints onPointClick={onPointClick} id={id} isHovered={isHovered} />
    </div>
  )),
  CircuitBreaker: React.memo(({ id, label, x, y, onEdit, onPointClick, onDragStart, onMouseEnter, onMouseLeave, isSelected, isHovered }) => (
    <div
      id={id}
      className={`absolute flex flex-col items-center p-2 bg-gray-800 text-gray-200 border rounded-lg shadow-md transition-all duration-200 diagram-component ${isSelected ? 'border-purple-500 ring-2 ring-purple-500' : 'border-gray-600'}`}
      style={{ left: x, top: y, width: '90px', height: '90px' }}
      onMouseDown={(e) => onDragStart(e, id)}
      onContextMenu={(e) => { e.preventDefault(); onEdit(e, id, 'component'); }}
      onMouseEnter={() => onMouseEnter(id)}
      onMouseLeave={() => onMouseLeave()}
    >
      <svg width="60" height="60" viewBox="0 0 100 100" className="pointer-events-none">
        <rect x="20" y="10" width="60" height="80" fill="none" stroke="currentColor" strokeWidth="4" />
        <line x1="20" y1="50" x2="80" y2="50" stroke="currentColor" strokeWidth="3" />
        <line x1="50" y1="10" x2="50" y2="50" stroke="currentColor" strokeWidth="3" />
        <path d="M50 50 L50 70 M50 70 L65 70" stroke="currentColor" strokeWidth="3" fill="none" />
        <text x="50" y="80" dominantBaseline="middle" textAnchor="middle" className="text-sm font-bold fill-white">CB</text>
      </svg>
      <span className="mt-1 text-xxs font-semibold text-gray-200 cursor-pointer text-center" onDoubleClick={() => onEdit(null, id, 'component')}>
        {label}
      </span>
      <ConnectionPoints onPointClick={onPointClick} id={id} isHovered={isHovered} />
    </div>
  )),
  Switch: React.memo(({ id, label, x, y, onEdit, onPointClick, onDragStart, onMouseEnter, onMouseLeave, isSelected, isHovered }) => (
    <div
      id={id}
      className={`absolute flex flex-col items-center p-2 bg-gray-800 text-gray-200 border rounded-lg shadow-md transition-all duration-200 diagram-component ${isSelected ? 'border-purple-500 ring-2 ring-purple-500' : 'border-gray-600'}`}
      style={{ left: x, top: y, width: '90px', height: '90px' }}
      onMouseDown={(e) => onDragStart(e, id)}
      onContextMenu={(e) => { e.preventDefault(); onEdit(e, id, 'component'); }}
      onMouseEnter={() => onMouseEnter(id)}
      onMouseLeave={() => onMouseLeave()}
    >
      <svg width="60" height="60" viewBox="0 0 100 100" className="pointer-events-none">
        <line x1="50" y1="20" x2="50" y2="80" stroke="currentColor" strokeWidth="3" />
        <line x1="50" y1="20" x2="80" y2="40" stroke="currentColor" strokeWidth="3" />
        <circle cx="50" cy="20" r="10" fill="currentColor" />
        <circle cx="50" cy="80" r="10" fill="currentColor" />
        <path d="M50 40 L50 60" stroke="currentColor" strokeWidth="3" />
        <text x="50" y="50" dominantBaseline="middle" textAnchor="middle" className="text-sm font-bold fill-white">SW</text>
      </svg>
      <span className="mt-1 text-xxs font-semibold text-gray-200 cursor-pointer text-center" onDoubleClick={() => onEdit(null, id, 'component')}>
        {label}
      </span>
      <ConnectionPoints onPointClick={onPointClick} id={id} isHovered={isHovered} />
    </div>
  )),
};

// ======================================================================================================
// MODAL & PROPERTIES PANEL COMPONENTS
// ======================================================================================================

const ConfirmationModal = ({ title, message, onConfirm, onCancel }) => createPortal(
  <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 transition-opacity duration-300">
    <div className="bg-gray-800 p-6 rounded-lg shadow-2xl w-96 text-center animate-fade-in-up">
      <h3 className="text-xl font-bold mb-4 text-gray-200">{title}</h3>
      <p className="mb-6 text-gray-400">{message}</p>
      <div className="flex justify-center space-x-4">
        <button
          onClick={onCancel}
          className="px-6 py-2 text-sm font-semibold text-gray-200 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="px-6 py-2 text-sm font-semibold text-white bg-red-500 rounded-md hover:bg-red-600 transition-colors"
        >
          Confirm
        </button>
      </div>
    </div>
  </div>,
  document.body
);

const PropertiesPanel = ({ selectedItem, onSave, onCancel, onChange, itemState }) => {
  if (!selectedItem || !itemState) return null;

  const { type } = selectedItem;
  const { label, color, thickness, style, x, y } = itemState;

  return (
    <div className="absolute top-0 right-0 h-full w-80 bg-gray-800 p-4 shadow-lg z-20 overflow-y-auto">
      <h3 className="text-xl font-bold text-gray-200 mb-4 flex items-center">
        <Edit3 className="mr-2" size={18} />
        Edit {type === 'component' ? 'Component' : 'Line'}
      </h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Label</label>
          <input
            type="text"
            value={label}
            onChange={(e) => onChange({ ...itemState, label: e.target.value })}
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {type === 'component' && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">X Position</label>
              <input
                type="number"
                value={Math.round(x)}
                disabled
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Y Position</label>
              <input
                type="number"
                value={Math.round(y)}
                disabled
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200 focus:outline-none"
              />
            </div>
          </div>
        )}
        {type === 'line' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Color</label>
              <input
                type="color"
                value={color}
                onChange={(e) => onChange({ ...itemState, color: e.target.value })}
                className="w-full h-10 p-1 bg-gray-700 border border-gray-600 rounded-md cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Thickness</label>
              <input
                type="range"
                min="1"
                max="10"
                value={thickness}
                onChange={(e) => onChange({ ...itemState, thickness: Number(e.target.value) })}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Style</label>
              <select
                value={style}
                onChange={(e) => onChange({ ...itemState, style: e.target.value })}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="solid">Solid</option>
                <option value="dotted">Dotted</option>
              </select>
            </div>
          </>
        )}
      </div>
      <div className="flex justify-end space-x-2 mt-6">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-sm font-semibold text-gray-200 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onSave}
          className="px-4 py-2 text-sm font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors"
        >
          Save
        </button>
      </div>
    </div>
  );
};

// ======================================================================================================
// MAIN APPLICATION COMPONENT
// Manages the state, interactions, and rendering of the entire diagram editor.
// ======================================================================================================
function App() {
  const [history, setHistory] = useState([{ components: [], lines: [] }]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const [components, setComponents] = useState([]);
  const [lines, setLines] = useState([]);
  
  const [selectedItems, setSelectedItems] = useState([]); // Array of { type: 'component' | 'line', id: string }
  const [hoveredComponentId, setHoveredComponentId] = useState(null);
  const [draggedItem, setDraggedItem] = useState(null); // Can be a component or a line point
  const [drawingLineState, setDrawingLineState] = useState(null); // { startComponentId, startPointName, points }
  const [lineColor, setLineColor] = useState('#ffffff');
  const [lineStyle, setLineStyle] = useState('solid');
  const [lineThickness, setLineThickness] = useState(2);
  
  const [showClearModal, setShowClearModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [editingProperties, setEditingProperties] = useState(null);
  
  // Pan, Zoom & Marquee Selection state
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isPanning, setIsPanning] = useState(false);
  const panStart = useRef({ x: 0, y: 0 });
  const [selectionBox, setSelectionBox] = useState(null); // { x, y, width, height }
  const selectionStart = useRef({ x: 0, y: 0 });
  
  const diagramRef = useRef(null);

  // === State Management Functions ===

  // Add the current state to the history stack
  const addToHistory = useCallback((newComponents, newLines) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({ components: newComponents, lines: newLines });
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  // Save state to local storage when components or lines change
  const saveStateToLocalStorage = useCallback(() => {
    localStorage.setItem('diagramState', JSON.stringify({ components, lines }));
  }, [components, lines]);
  
  // Undo and Redo handlers
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setSelectedItems([]);
      setEditingProperties(null);
    }
  }, [historyIndex]);
  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setSelectedItems([]);
      setEditingProperties(null);
    }
  }, [historyIndex, history.length]);

  const handleDuplicate = useCallback(() => {
    selectedItems.forEach(item => {
      if (item.type === 'component') {
        const compToDuplicate = components.find(c => c.id === item.id);
        if (compToDuplicate) {
          const newComponent = {
            ...compToDuplicate,
            id: generateId(),
            x: compToDuplicate.x + 50,
            y: compToDuplicate.y + 50,
            label: `${compToDuplicate.label} (Copy)`
          };
          const newComponents = [...components, newComponent];
          setComponents(newComponents);
          addToHistory(newComponents, lines);
        }
      }
    });
  }, [selectedItems, components, lines, addToHistory]);

  // Sync components and lines state with the history state
  useEffect(() => {
    setComponents(history[historyIndex].components);
    setLines(history[historyIndex].lines);
  }, [history, historyIndex]);

  // Load state from localStorage on initial render
  useEffect(() => {
    const savedState = localStorage.getItem('diagramState');
    if (savedState) {
      const parsedState = JSON.parse(savedState);
      setHistory([parsedState]);
      setHistoryIndex(0);
    }
  }, []);
  
  // Add an event listener for keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Escape key to cancel drawing or close modals/panels
      if (e.key === 'Escape') {
        if (isDrawingMode) cancelLineDrawing();
        if (editingProperties) setEditingProperties(null);
      }
      // Delete key to delete selected items
      if (e.key === 'Delete' && selectedItems.length > 0) {
        setShowDeleteModal(true);
      }
      // Ctrl+Z / Cmd+Z for Undo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        handleUndo();
      }
      // Ctrl+Y / Cmd+Y for Redo
      if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        handleRedo();
      }
      // Ctrl+C / Cmd+C for Copy (handled by duplicate in this app)
      if ((e.ctrlKey || e.metaKey) && e.key === 'c' && selectedItems.length > 0) {
        e.preventDefault();
        handleDuplicate();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isDrawingMode, selectedItems, editingProperties, handleUndo, handleRedo, handleDuplicate]);


  const addComponent = (type) => {
    const newComponent = {
      id: generateId(),
      type,
      label: `${type}`,
      x: 50,
      y: 50,
    };
    const newComponents = [...components, newComponent];
    setComponents(newComponents);
    addToHistory(newComponents, lines);
  };

  const handleMouseEnterComponent = useCallback((id) => {
    setHoveredComponentId(id);
  }, []);

  const handleMouseLeaveComponent = useCallback(() => {
    setHoveredComponentId(null);
  }, []);
  
  // Get coordinates of a specific connection point on a component
  const getConnectionPointCoords = (componentId, pointName) => {
    const componentEl = document.getElementById(componentId);
    if (!componentEl) return null;

    const rect = componentEl.getBoundingClientRect();
    const diagramRect = diagramRef.current.getBoundingClientRect();
    
    // Adjust for component width/height
    const componentWidth = 90;
    const componentHeight = 90;

    let point = { x: rect.left, y: rect.top };

    switch (pointName) {
      case 'top':
        point = { x: rect.left + componentWidth / 2, y: rect.top };
        break;
      case 'bottom':
        point = { x: rect.left + componentWidth / 2, y: rect.top + componentHeight };
        break;
      case 'left':
        point = { x: rect.left, y: rect.top + componentHeight / 2 };
        break;
      case 'right':
        point = { x: rect.left + componentWidth, y: rect.top + componentHeight / 2 };
        break;
    }

    // Adjust for pan and zoom
    const adjustedX = (point.x - diagramRect.left - pan.x) / zoom;
    const adjustedY = (point.y - diagramRect.top - pan.y) / zoom;
    
    return { x: adjustedX, y: adjustedY };
  };
  
  const handleDragStart = (e, id, type = 'component', pointIndex = -1) => {
    if (isDrawingMode || e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();

    if (type === 'component') {
      const isMultiSelect = e.ctrlKey || e.metaKey;
      let newSelectedItems;

      const isAlreadySelected = selectedItems.some(item => item.id === id && item.type === 'component');
      if (isMultiSelect) {
        if (isAlreadySelected) {
          newSelectedItems = selectedItems.filter(item => item.id !== id);
        } else {
          newSelectedItems = [...selectedItems, { type, id }];
        }
      } else {
        newSelectedItems = [{ type, id }];
      }
      setSelectedItems(newSelectedItems);
      setEditingProperties(null);
      setHoveredComponentId(null); // Hide snap points while dragging
      
      const component = components.find(c => c.id === id);
      if (!component) return;

      // Build the initial positions map for all components in the drag group
      const itemsToDrag = newSelectedItems.filter(item => item.type === 'component');
      const initialPositions = itemsToDrag.reduce((acc, item) => {
        const comp = components.find(c => c.id === item.id);
        if (comp) {
          acc[item.id] = { x: comp.x, y: comp.y };
        }
        return acc;
      }, {});

      setDraggedItem({
        type: 'component',
        id: id,
        offsetX: (e.clientX - pan.x) / zoom - component.x,
        offsetY: (e.clientY - pan.y) / zoom - component.y,
        initialPositions: initialPositions
      });
    } else if (type === 'line-point') {
      const line = lines.find(l => l.id === id);
      if (line) {
        setSelectedItems([{ type: 'line', id }]);
        setEditingProperties(null);
        setDraggedItem({
          type: 'line-point',
          lineId: id,
          pointIndex,
          offsetX: (e.clientX - pan.x) / zoom - line.points[pointIndex].x,
          offsetY: (e.clientY - pan.y) / zoom - line.points[pointIndex].y,
        });
      }
    }
  };

  const handlePanStart = (e) => {
    if (isDrawingMode || e.target.closest('.diagram-component') || e.target.closest('.line-point-dragger') || e.button !== 0) {
      if (!e.target.closest('.diagram-component') && !e.target.closest('.line-point-dragger') && !isDrawingMode && e.button === 0) {
        // Start marquee selection
        const diagramRect = diagramRef.current.getBoundingClientRect();
        selectionStart.current = {
          x: (e.clientX - diagramRect.left - pan.x) / zoom,
          y: (e.clientY - diagramRect.top - pan.y) / zoom
        };
        setSelectionBox({ ...selectionStart.current, width: 0, height: 0 });
      }
      return;
    }
    setIsPanning(true);
    panStart.current = { x: e.clientX, y: e.clientY };
  };

  const handleZoom = (e) => {
    e.preventDefault();
    const newZoom = e.deltaY < 0 ? zoom * 1.1 : zoom / 1.1;
    const clampedZoom = Math.min(Math.max(newZoom, 0.5), 2);
    setZoom(clampedZoom);
  };
  
  const handleMouseMove = (e) => {
    if (draggedItem) {
      const newX = (e.clientX - pan.x) / zoom - draggedItem.offsetX;
      const newY = (e.clientY - pan.y) / zoom - draggedItem.offsetY;
      const snappedX = Math.round(newX / GRID_SIZE) * GRID_SIZE;
      const snappedY = Math.round(newY / GRID_SIZE) * GRID_SIZE;

      if (draggedItem.type === 'component') {
        const initialPos = draggedItem.initialPositions?.[draggedItem.id];
        
        if (initialPos) {
          const deltaX = snappedX - initialPos.x;
          const deltaY = snappedY - initialPos.y;

          const newComponents = components.map((comp) => {
            const initialCompPos = draggedItem.initialPositions?.[comp.id];
            if (initialCompPos) {
              return {
                ...comp,
                x: Math.round((initialCompPos.x + deltaX) / GRID_SIZE) * GRID_SIZE,
                y: Math.round((initialCompPos.y + deltaY) / GRID_SIZE) * GRID_SIZE
              };
            }
            return comp;
          });
          setComponents(newComponents);
        }
      } else if (draggedItem.type === 'line-point') {
        const newLines = lines.map(line => {
          if (line.id === draggedItem.lineId) {
            const newPoints = [...line.points];
            newPoints[draggedItem.pointIndex] = { x: snappedX, y: snappedY };
            return { ...line, points: newPoints };
          }
          return line;
        });
        setLines(newLines);
      }
    } else if (isPanning) {
      const deltaX = e.clientX - panStart.current.x;
      const deltaY = e.clientY - panStart.current.y;
      setPan({ x: pan.x + deltaX, y: pan.y + deltaY });
      panStart.current = { x: e.clientX, y: e.clientY };
    } else if (selectionBox) {
      const diagramRect = diagramRef.current.getBoundingClientRect();
      const currentX = (e.clientX - diagramRect.left - pan.x) / zoom;
      const currentY = (e.clientY - diagramRect.top - pan.y) / zoom;
      setSelectionBox({
        x: Math.min(selectionStart.current.x, currentX),
        y: Math.min(selectionStart.current.y, currentY),
        width: Math.abs(selectionStart.current.x - currentX),
        height: Math.abs(selectionStart.current.y - currentY)
      });
    }
    
    if (isDrawingMode && drawingLineState) {
      const diagramRect = diagramRef.current.getBoundingClientRect();
      let mousePoint = {
        x: (e.clientX - diagramRect.left - pan.x) / zoom,
        y: (e.clientY - diagramRect.top - pan.y) / zoom,
      };

      // Orthogonal snapping
      if (e.shiftKey && drawingLineState.points.length > 1) {
        const lastPoint = drawingLineState.points[drawingLineState.points.length - 2];
        const dx = Math.abs(mousePoint.x - lastPoint.x);
        const dy = Math.abs(mousePoint.y - lastPoint.y);
        if (dx < dy) { // Snap to vertical
          mousePoint.x = lastPoint.x;
        } else { // Snap to horizontal
          mousePoint.y = lastPoint.y;
        }
      }

      setDrawingLineState(prev => ({...prev, points: [...prev.points.slice(0, -1), mousePoint]}));
    }
  };

  const handleMouseUp = () => {
    if (draggedItem) {
      addToHistory(components, lines); // Save state after drag ends
    }
    setDraggedItem(null);
    setIsPanning(false);

    // Finalize marquee selection
    if (selectionBox && selectionBox.width > 5 && selectionBox.height > 5) {
      const newSelectedItems = [];
      const box = selectionBox;
      components.forEach(comp => {
        const compRect = { x: comp.x, y: comp.y, width: 90, height: 90 };
        if (compRect.x < box.x + box.width && compRect.x + compRect.width > box.x &&
            compRect.y < box.y + box.height && compRect.y + compRect.height > box.y) {
          newSelectedItems.push({ type: 'component', id: comp.id });
        }
      });
      lines.forEach(line => {
        // Simple check: if any line point is within the box
        const isLineInBox = line.points.some(p => p.x > box.x && p.x < box.x + box.width && p.y > box.y && p.y < box.y + box.height);
        if(isLineInBox) {
          newSelectedItems.push({ type: 'line', id: line.id });
        }
      });
      setSelectedItems(newSelectedItems);
    }
    setSelectionBox(null);
  };

  const handlePointClick = (e, id, pointName) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isDrawingMode) return;
    
    const coords = getConnectionPointCoords(id, pointName);
    if (!coords) return;
    
    if (!drawingLineState) {
      // Start a new line
      setDrawingLineState({
        startComponentId: id,
        startPointName: pointName,
        points: [coords, coords],
        color: lineColor,
        thickness: lineThickness,
        style: lineStyle,
      });
    } else {
      // Finish the line on a component
      const newLine = {
        id: generateId(),
        points: [...drawingLineState.points.slice(0, -1), coords],
        color: drawingLineState.color,
        style: drawingLineState.style,
        thickness: drawingLineState.thickness,
        label: '',
        startComponentId: drawingLineState.startComponentId,
        endComponentId: id,
      };
      const newLines = [...lines, newLine];
      setLines(newLines);
      addToHistory(components, newLines);
      setDrawingLineState(null); // Clear the drawing state
      setIsDrawingMode(false);
    }
  };
  
  const handleCanvasClick = (e) => {
    setSelectedItems([]); // Deselect all on canvas click
    setEditingProperties(null);
    setHoveredComponentId(null);
    if (isDrawingMode && drawingLineState) {
      const diagramRect = diagramRef.current.getBoundingClientRect();
      const newPoint = {
        x: (e.clientX - diagramRect.left - pan.x) / zoom,
        y: (e.clientY - diagramRect.top - pan.y) / zoom,
      };
      setDrawingLineState(prev => ({ ...prev, points: [...prev.points.slice(0, -1), newPoint, newPoint] }));
    }
  };

  const cancelLineDrawing = () => {
    setDrawingLineState(null);
    setIsDrawingMode(false);
  };
  
  const toggleDrawingMode = () => {
    setIsDrawingMode(prev => {
      if (prev) cancelLineDrawing();
      return !prev;
    });
  };

  const handleSelectItem = (e, id, type) => {
    e.stopPropagation();
    setEditingProperties(null);
    setHoveredComponentId(null);
    if (selectedItems.some(item => item.id === id)) {
      setSelectedItems([]);
    } else {
      setSelectedItems([{ type, id }]);
    }
  };
  
  const handleDoubleClickItem = (e, id, type) => {
    e.stopPropagation();
    setSelectedItems([{ type, id }]);
    handleEditProperties(id, type);
  };
  
  const handleEditProperties = (id, type) => {
    if (type === 'component') {
      const item = components.find(c => c.id === id);
      if (item) setEditingProperties({ id, type, itemState: item });
    } else if (type === 'line') {
      const item = lines.find(l => l.id === id);
      if (item) setEditingProperties({ id, type, itemState: item });
    }
  };

  const handleDelete = () => {
    if (selectedItems.length > 0) {
      setShowDeleteModal(true);
    }
  };
  
  const confirmDelete = () => {
    let newComponents = [...components];
    let newLines = [...lines];

    selectedItems.forEach(item => {
      if (item.type === 'component') {
        newComponents = newComponents.filter((comp) => comp.id !== item.id);
        newLines = newLines.filter((line) => line.startComponentId !== item.id && line.endComponentId !== item.id);
      } else if (item.type === 'line') {
        newLines = newLines.filter((line) => line.id !== item.id);
      }
    });

    setComponents(newComponents);
    setLines(newLines);
    addToHistory(newComponents, newLines);
    setSelectedItems([]);
    setShowDeleteModal(false);
    setEditingProperties(null);
  };

  
  const handleSaveProperties = () => {
    const { id, type, itemState } = editingProperties;
    if (type === 'component') {
      setComponents(components.map(comp => comp.id === id ? itemState : comp));
    } else if (type === 'line') {
      setLines(lines.map(line => line.id === id ? itemState : line));
    }
    addToHistory(components, lines);
    setEditingProperties(null);
  };

  const formatPoints = (points) => {
    if (!points || points.length === 0) return '';
    return points.map(p => `${p.x},${p.y}`).join(' ');
  };

  const handleSaveFile = () => {
    const data = { components, lines };
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'electrical-diagram.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleLoadFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const loadedData = JSON.parse(event.target.result);
        if (loadedData.components && loadedData.lines) {
          setComponents(loadedData.components);
          setLines(loadedData.lines);
          addToHistory(loadedData.components, loadedData.lines);
          setSelectedItems([]);
        } else {
          console.error("Invalid file format");
        }
      } catch (error) {
        console.error("Failed to parse JSON file:", error);
      }
    };
    reader.readAsText(file);
  };

  const handleExportSVG = () => {
    const svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svgElement.setAttribute('width', diagramRef.current.scrollWidth);
    svgElement.setAttribute('height', diagramRef.current.scrollHeight);
    svgElement.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svgElement.setAttribute('viewBox', `0 0 ${diagramRef.current.scrollWidth} ${diagramRef.current.scrollHeight}`);

    const style = document.createElementNS("http://www.w3.org/2000/svg", "style");
    style.textContent = `
      .fill-white { fill: #fff; }
      .stroke-white { stroke: #fff; }
      .diagram-text { font-family: sans-serif; font-size: 10px; }
      .diagram-label { font-family: sans-serif; font-size: 12px; font-weight: bold; }
    `;
    svgElement.appendChild(style);

    const svgLines = document.createElementNS("http://www.w3.org/2000/svg", "g");
    lines.forEach(line => {
      const polyline = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
      polyline.setAttribute('points', formatPoints(line.points));
      polyline.setAttribute('stroke', line.color);
      polyline.setAttribute('stroke-width', line.thickness);
      polyline.setAttribute('fill', 'none');
      if (line.style === 'dotted') {
        polyline.setAttribute('stroke-dasharray', '5,5');
      }
      polyline.setAttribute('marker-end', 'url(#arrowhead)');
      svgLines.appendChild(polyline);

      if (line.label) {
        const middlePointIndex = Math.floor(line.points.length / 2);
        const middlePoint = line.points[middlePointIndex];
        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute('x', middlePoint.x);
        text.setAttribute('y', middlePoint.y - 10);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('dominant-baseline', 'middle');
        text.setAttribute('class', 'diagram-text');
        text.textContent = line.label;
        svgLines.appendChild(text);
      }
    });

    const svgComponents = document.createElementNS("http://www.w3.org/2000/svg", "g");
    components.forEach(comp => {
      const componentEl = document.getElementById(comp.id);
      if (componentEl) {
        const svgContent = componentEl.querySelector('svg').innerHTML;
        const textContent = componentEl.querySelector('span').innerText;
        const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
        g.setAttribute('transform', `translate(${comp.x}, ${comp.y})`);

        const symbol = document.createElementNS("http://www.w3.org/2000/svg", "g");
        symbol.innerHTML = svgContent;
        g.appendChild(symbol);
        
        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute('x', 45);
        text.setAttribute('y', 90);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('dominant-baseline', 'middle');
        text.setAttribute('class', 'diagram-label');
        text.textContent = textContent;
        g.appendChild(text);

        svgComponents.appendChild(g);
      }
    });

    svgElement.appendChild(svgLines);
    svgElement.appendChild(svgComponents);

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const blob = new Blob([svgData], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'electrical-diagram.svg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  return (
    <div className="flex flex-col h-screen font-inter bg-gray-950 text-white relative">
      {/* Top toolbar */}
      <div className="flex items-center p-4 space-x-4 bg-gray-900 shadow-md flex-wrap rounded-b-lg min-h-[64px] z-30">
        <span className="text-xl font-bold text-gray-200 hidden md:block">Diagram Editor</span>
        
        {/* Component Adding Section */}
        <div className="flex space-x-2 flex-wrap items-center">
          <span className="text-sm font-semibold text-gray-300 hidden sm:block mr-2">Components:</span>
          <button onClick={() => addComponent('Transformer')} className="px-3 py-1 text-sm text-white bg-green-500 rounded-md shadow hover:bg-green-600 transition-colors tooltip" data-tip="Add Transformer">
            <Zap className="inline-block mr-1" size={16}/> T
          </button>
          <button onClick={() => addComponent('DG')} className="px-3 py-1 text-sm text-white bg-blue-500 rounded-md shadow hover:bg-blue-600 transition-colors tooltip" data-tip="Add DG">
            <Play className="inline-block mr-1" size={16}/> DG
          </button>
          <button onClick={() => addComponent('ATS')} className="px-3 py-1 text-sm text-white bg-red-500 rounded-md shadow hover:bg-red-600 transition-colors tooltip" data-tip="Add ATS">
            ATS
          </button>
          <button onClick={() => addComponent('MDB')} className="px-3 py-1 text-sm text-white bg-purple-500 rounded-md shadow hover:bg-purple-600 transition-colors tooltip" data-tip="Add MDB">
            MDB
          </button>
          <button onClick={() => addComponent('Load')} className="px-3 py-1 text-sm text-white bg-teal-500 rounded-md shadow hover:bg-teal-600 transition-colors tooltip" data-tip="Add Generic Load">
            <ZapOff className="inline-block mr-1" size={16}/> Load
          </button>
          <button onClick={() => addComponent('CircuitBreaker')} className="px-3 py-1 text-sm text-white bg-orange-500 rounded-md shadow hover:bg-orange-600 transition-colors tooltip" data-tip="Add Circuit Breaker">
            <Box className="inline-block mr-1" size={16}/> CB
          </button>
          <button onClick={() => addComponent('Switch')} className="px-3 py-1 text-sm text-white bg-cyan-500 rounded-md shadow hover:bg-cyan-600 transition-colors tooltip" data-tip="Add Switch">
            <Box className="inline-block mr-1" size={16}/> SW
          </button>
        </div>

        <div className="flex-grow"></div>

        {/* Line Drawing Section */}
        <div className="flex space-x-2 flex-wrap items-center">
          <button onClick={toggleDrawingMode} className={`px-4 py-2 text-sm rounded-md shadow transition-colors tooltip ${isDrawingMode ? 'bg-yellow-500 hover:bg-yellow-600 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-200'}`} data-tip={isDrawingMode ? 'Cancel Drawing (Esc)' : 'Draw Line'}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-block mr-1"><path d="M12 2v6l-2-2m2 2l2-2"></path><path d="M16 11l-2 2h-4l-2-2"></path><path d="M12 18v4l-2-2m2 2l2-2"></path></svg>
            {isDrawingMode ? 'Cancel' : 'Draw'}
          </button>
          <div className="flex items-center space-x-1 hidden sm:flex">
            <span className="text-sm font-semibold text-gray-300">Thickness:</span>
            <input
              type="range"
              min="1"
              max="10"
              value={lineThickness}
              onChange={(e) => setLineThickness(Number(e.target.value))}
              className="w-16 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              title="Line Thickness"
            />
            <span className="text-sm font-semibold text-gray-300">Style:</span>
            <select
              value={lineStyle}
              onChange={(e) => setLineStyle(e.target.value)}
              className="bg-gray-700 text-gray-200 text-sm rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="solid">Solid</option>
              <option value="dotted">Dotted</option>
            </select>
            <span className="text-sm font-semibold text-gray-300">Color:</span>
            <input
              type="color"
              value={lineColor}
              onChange={(e) => setLineColor(e.target.value)}
              className="w-8 h-8 rounded-full border-2 border-gray-600 cursor-pointer overflow-hidden"
              title="Line Color"
            />
          </div>
        </div>

        <div className="flex-grow"></div>
        
        {/* File & Action Section */}
        <div className="flex space-x-2 flex-wrap">
          <button onClick={handleUndo} disabled={historyIndex === 0} className={`px-4 py-2 text-sm text-white rounded-md shadow transition-colors tooltip ${historyIndex > 0 ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-800 cursor-not-allowed'}`} data-tip="Undo (Ctrl+Z)">
            <CornerUpLeft className="inline-block" size={16}/>
          </button>
          <button onClick={handleRedo} disabled={historyIndex === history.length - 1} className={`px-4 py-2 text-sm text-white rounded-md shadow transition-colors tooltip ${historyIndex < history.length - 1 ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-800 cursor-not-allowed'}`} data-tip="Redo (Ctrl+Y)">
            <CornerUpRight className="inline-block" size={16}/>
          </button>
          <button onClick={handleDelete} disabled={selectedItems.length === 0} className={`px-4 py-2 text-sm text-white rounded-md shadow transition-colors tooltip ${selectedItems.length > 0 ? 'bg-red-500 hover:bg-red-600' : 'bg-red-300 cursor-not-allowed'}`} data-tip="Delete Selected (Del)">
            <Trash2 className="inline-block" size={16}/>
          </button>
          <button onClick={handleDuplicate} disabled={selectedItems.length === 0} className={`px-4 py-2 text-sm text-white rounded-md shadow transition-colors tooltip ${selectedItems.length > 0 ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-800 cursor-not-allowed'}`} data-tip="Duplicate Selected (Ctrl+C)">
            <Copy className="inline-block" size={16}/>
          </button>
          <button onClick={handleSaveFile} className="px-4 py-2 text-sm text-white bg-gray-700 rounded-md shadow hover:bg-gray-600 transition-colors tooltip" data-tip="Save to File">
            <Save className="inline-block" size={16}/>
          </button>
          <label className="px-4 py-2 text-sm text-white bg-gray-700 rounded-md shadow hover:bg-gray-600 transition-colors cursor-pointer tooltip" data-tip="Load from File">
            <FolderOpen className="inline-block" size={16}/>
            <input type="file" onChange={handleLoadFile} className="hidden" />
          </label>
          <button onClick={handleExportSVG} className="px-4 py-2 text-sm text-white bg-gray-700 rounded-md shadow hover:bg-gray-600 transition-colors tooltip" data-tip="Export as SVG">
            <Download className="inline-block" size={16}/>
          </button>
          <button onClick={() => setShowClearModal(true)} className="px-4 py-2 text-sm text-white bg-red-500 rounded-md shadow hover:bg-red-600 transition-colors tooltip" data-tip="Clear All">
            Clear
          </button>
        </div>
      </div>

      {/* Main diagram canvas area */}
      <div
        ref={diagramRef}
        className="relative flex-grow m-4 rounded-lg overflow-hidden border-4 border-dashed border-gray-700"
        style={{
          backgroundColor: '#1a1a1a',
          backgroundImage: 'linear-gradient(to right, #374151 1px, transparent 1px), linear-gradient(to bottom, #374151 1px, transparent 1px)',
          backgroundSize: `${GRID_SIZE * zoom}px ${GRID_SIZE * zoom}px`,
          backgroundPosition: `${pan.x % (GRID_SIZE * zoom)}px ${pan.y % (GRID_SIZE * zoom)}px`,
          cursor: isPanning ? 'grabbing' : (isDrawingMode ? 'crosshair' : (selectionBox ? 'crosshair' : 'grab')),
        }}
        onMouseDown={handlePanStart}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp} // Stop panning/drawing if mouse leaves the area
        onClick={handleCanvasClick}
        onWheel={handleZoom}
      >
        <div
          className="absolute top-0 left-0 origin-top-left"
          style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}
        >
          {/* Render components */}
          {components.map((comp) => {
            const Component = componentsMap[comp.type];
            return (
              <Component
                key={comp.id}
                {...comp}
                onPointClick={handlePointClick}
                onEdit={handleDoubleClickItem}
                onDragStart={handleDragStart}
                onMouseEnter={handleMouseEnterComponent}
                onMouseLeave={handleMouseLeaveComponent}
                isSelected={selectedItems.some(item => item.id === comp.id && item.type === 'component')}
                isHovered={hoveredComponentId === comp.id}
              />
            );
          })}

          {/* Render lines */}
          <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto" markerUnits="strokeWidth">
                <polygon points="0 0, 10 3.5, 0 7" className="fill-white" />
              </marker>
            </defs>
            
            {lines.map((line) => {
              const isSelected = selectedItems.some(item => item.id === line.id && item.type === 'line');
              return (
                <g key={line.id} onDoubleClick={(e) => handleDoubleClickItem(e, line.id, 'line')} onClick={(e) => handleSelectItem(e, line.id, 'line')} onMouseDown={(e) => {
                    // Prevent canvas click from deselecting
                    e.stopPropagation();
                  }} className="transition-all duration-200"
                >
                  <polyline
                    points={formatPoints(line.points)}
                    stroke={line.color}
                    strokeWidth={line.thickness}
                    fill="none"
                    strokeDasharray={line.style === 'dotted' ? '5,5' : 'none'}
                    markerEnd="url(#arrowhead)"
                    className={`transition-all duration-200 stroke-gray-400 ${isSelected ? 'stroke-purple-500' : ''}`}
                    style={{ pointerEvents: 'auto', cursor: 'pointer' }}
                  />
                  {/* Draggable points on the line */}
                  {isSelected && line.points.map((point, index) => (
                    <circle
                      key={index}
                      cx={point.x}
                      cy={point.y}
                      r={4 / zoom}
                      fill="cyan"
                      stroke="#000"
                      strokeWidth={1 / zoom}
                      className="line-point-dragger pointer-events-auto cursor-pointer"
                      onMouseDown={(e) => handleDragStart(e, line.id, 'line-point', index)}
                    />
                  ))}
                  {line.label && (
                    <text
                      x={line.points[Math.floor(line.points.length / 2)].x}
                      y={line.points[Math.floor(line.points.length / 2)].y - 10}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="fill-white text-xs font-semibold pointer-events-auto cursor-pointer"
                    >
                      {line.label}
                    </text>
                  )}
                </g>
              );
            })}
            {/* Render the temporary line being drawn */}
            {drawingLineState && (
              <polyline
                points={formatPoints(drawingLineState.points)}
                stroke={drawingLineState.color}
                strokeWidth={drawingLineState.thickness}
                fill="none"
                strokeDasharray={drawingLineState.style === 'dotted' ? '5,5' : 'none'}
                markerEnd="url(#arrowhead)"
                className="stroke-gray-400"
              />
            )}
            {/* Render selection box */}
            {selectionBox && (
              <rect
                x={selectionBox.x}
                y={selectionBox.y}
                width={selectionBox.width}
                height={selectionBox.height}
                fill="rgba(128, 90, 213, 0.2)"
                stroke="#805AD5"
                strokeWidth="1"
                strokeDasharray="4 4"
                className="pointer-events-none"
              />
            )}
          </svg>
        </div>
      </div>

      {/* Properties Panel */}
      <PropertiesPanel
        selectedItem={selectedItems.length === 1 ? selectedItems[0] : null}
        itemState={editingProperties ? editingProperties.itemState : null}
        onSave={handleSaveProperties}
        onCancel={() => setEditingProperties(null)}
        onChange={(newItemState) => setEditingProperties(prev => ({ ...prev, itemState: newItemState }))}
      />

      {/* Confirmation Modal for Clearing Diagram */}
      {showClearModal && (
        <ConfirmationModal
          title="Confirm Clear All"
          message="Are you sure you want to clear the entire diagram? This action cannot be undone."
          onCancel={() => setShowClearModal(false)}
          onConfirm={() => {
            setComponents([]);
            setLines([]);
            setHistory([{ components: [], lines: [] }]);
            setHistoryIndex(0);
            localStorage.removeItem('diagramState');
            setShowClearModal(false);
          }}
        />
      )}

      {/* Confirmation Modal for Deleting Component */}
      {showDeleteModal && (
        <ConfirmationModal
          title="Confirm Deletion"
          message={`Are you sure you want to delete ${selectedItems.length} selected item(s)?`}
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
}

export default App;
