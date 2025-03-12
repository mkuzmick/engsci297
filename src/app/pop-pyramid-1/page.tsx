"use client"

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import _ from 'lodash';

const AnimatedScatterPlot = () => {
  // Define the embed code as a string. This snippet can be adjusted as needed.
  const embedCode = `<AnimatedScatterPlot />`;

  // State to show copy feedback
  const [copied, setCopied] = useState(false);

  // Copy handler using the Clipboard API
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(embedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy embed code:", error);
    }
  };

  // Generate data points around a line of best fit: y = mx + b + noise
  const generateDataAroundLine = (count, m, b, noiseLevel) => {
    return _.times(count, (i) => {
      // Generate x values spread across the range
      const x = (i / count) * 800;
      // Calculate the y value on the line plus some random noise
      const y = m * x + b + (Math.random() - 0.5) * noiseLevel;
      return { x, y };
    });
  };

  // Generate two datasets with different lines of best fit
  const generateDatasets = (count) => {
    // First line: y = 0.5x + 100
    const dataset1Points = generateDataAroundLine(count, 0.5, 100, 80);
    
    // Second line: y = -0.3x + 350
    const dataset2Points = generateDataAroundLine(count, -0.3, 350, 80);
    
    // Define the line parameters for visualization
    const line1 = { m: 0.5, b: 100 };
    const line2 = { m: -0.3, b: 350 };
    
    // Combine into data points with IDs and colors
    return {
      points: _.times(count, (i) => ({
        id: i,
        dataset1: dataset1Points[i],
        dataset2: dataset2Points[i],
        color: `hsl(${Math.random() * 360}, 80%, 60%)`,
      })),
      lines: {
        line1,
        line2
      }
    };
  };

  // Initialize data
  const [data, setData] = useState(() => generateDatasets(50));
  const [showingDataset1, setShowingDataset1] = useState(true);
  
  const toggleDataset = () => {
    setShowingDataset1(!showingDataset1);
  };

  // Calculate y values for line ends
  const getLineCoordinates = (line) => {
    const x1 = 0;
    const y1 = line.b;
    const x2 = 800;
    const y2 = line.m * x2 + line.b;
    return { x1, y1, x2, y2 };
  };

  const line1Coords = getLineCoordinates(data.lines.line1);
  const line2Coords = getLineCoordinates(data.lines.line2);

  // Current line coordinates based on which dataset is shown
  const currentLine = showingDataset1 ? line1Coords : line2Coords;

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto">
      <div className="mb-4 text-xl font-bold">
        Animated Scatter Plot - Dataset {showingDataset1 ? '1' : '2'}
      </div>
      
      <div className="flex gap-2">
        <button
          onClick={toggleDataset}
          className="px-4 py-2 mb-4 text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          Toggle Dataset
        </button>
        <button
          onClick={handleCopy}
          className="px-4 py-2 mb-4 text-white bg-green-500 rounded hover:bg-green-600"
        >
          {copied ? "Copied!" : "Copy Embed Code"}
        </button>
      </div>
      
      <div className="relative w-full h-96 border border-gray-300 bg-gray-50 rounded overflow-hidden">
        {/* Axis lines */}
        <div className="absolute left-10 top-0 h-full w-px bg-gray-300"></div>
        <div className="absolute bottom-10 left-0 w-full h-px bg-gray-300"></div>
        
        {/* Line of best fit - animated with a slight delay */}
        <motion.svg className="absolute top-0 left-0 w-full h-full" style={{ overflow: 'visible' }}>
          <motion.line
            initial={{
              x1: line1Coords.x1,
              y1: line1Coords.y1,
              x2: line1Coords.x2,
              y2: line1Coords.y2,
            }}
            animate={{
              x1: currentLine.x1,
              y1: currentLine.y1,
              x2: currentLine.x2,
              y2: currentLine.y2,
            }}
            transition={{ 
              type: "spring", 
              stiffness: 70, 
              damping: 15,
              delay: 0.2 // Added delay so points move first
            }}
            stroke="#ff5555"
            strokeWidth="2"
            strokeDasharray="5,5"
          />
        </motion.svg>
        
        {/* Data points */}
        {data.points.map((point) => (
          <motion.div
            key={point.id}
            initial={{
              x: showingDataset1 ? point.dataset1.x : point.dataset2.x,
              y: showingDataset1 ? point.dataset1.y : point.dataset2.y,
            }}
            animate={{
              x: showingDataset1 ? point.dataset1.x : point.dataset2.x,
              y: showingDataset1 ? point.dataset1.y : point.dataset2.y,
            }}
            transition={{ 
              type: "spring", 
              stiffness: 100, 
              damping: 15,
              mass: 1,
              delay: point.id * 0.005 // Reduced individual point delay for faster overall movement
            }}
            className="absolute w-4 h-4 rounded-full -translate-x-2 -translate-y-2"
            style={{
              backgroundColor: point.color,
            }}
          />
        ))}
        
        {/* Legend for line of best fit */}
        <div className="absolute top-4 right-4 p-2 bg-white border border-gray-200 rounded shadow-sm">
          <div className="flex items-center">
            <div className="w-4 h-px bg-red-400 mr-2" style={{ borderTop: '2px dashed #ff5555' }}></div>
            <span className="text-xs">Line of Best Fit</span>
          </div>
        </div>
        
        {/* Equation display */}
        <div className="absolute top-12 right-4 p-2 bg-white border border-gray-200 rounded shadow-sm">
          <span className="text-xs font-mono">
            y = {showingDataset1 ? data.lines.line1.m : data.lines.line2.m}x + {showingDataset1 ? data.lines.line1.b : data.lines.line2.b}
          </span>
        </div>
        
        {/* Axis labels */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-sm text-gray-600">X Axis</div>
        <div className="absolute top-1/2 left-2 transform -translate-y-1/2 text-sm text-gray-600" style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>Y Axis</div>
      </div>
      
      <div className="mt-4 text-sm text-gray-600">
        Dataset 1: y = 0.5x + 100 (positive slope)
        <br />
        Dataset 2: y = -0.3x + 350 (negative slope)
      </div>
    </div>
  );
};

export default AnimatedScatterPlot;
