"use client"

import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';

// Sample population data for multiple years
const populationData = {
  "2000": [
    {age: "0-4", male: 10.5, female: 10.1},
    {age: "5-9", male: 11.2, female: 10.8},
    {age: "10-14", male: 11.5, female: 11.0},
    {age: "15-19", male: 10.8, female: 10.3},
    {age: "20-24", male: 9.5, female: 9.2},
    {age: "25-29", male: 8.7, female: 8.5},
    {age: "30-34", male: 8.2, female: 8.1},
    {age: "35-39", male: 7.8, female: 7.7},
    {age: "40-44", male: 7.2, female: 7.3},
    {age: "45-49", male: 6.2, female: 6.4},
    {age: "50-54", male: 5.2, female: 5.5},
    {age: "55-59", male: 4.2, female: 4.6},
    {age: "60-64", male: 3.2, female: 3.7},
    {age: "65-69", male: 2.5, female: 3.1},
    {age: "70-74", male: 1.8, female: 2.5},
    {age: "75-79", male: 1.2, female: 1.8},
    {age: "80+", male: 0.8, female: 1.6}
  ],
  "2010": [
    {age: "0-4", male: 9.8, female: 9.4},
    {age: "5-9", male: 10.2, female: 9.8},
    {age: "10-14", male: 10.8, female: 10.3},
    {age: "15-19", male: 11.2, female: 10.8},
    {age: "20-24", male: 10.5, female: 10.0},
    {age: "25-29", male: 9.6, female: 9.3},
    {age: "30-34", male: 8.9, female: 8.7},
    {age: "35-39", male: 8.3, female: 8.2},
    {age: "40-44", male: 7.9, female: 7.8},
    {age: "45-49", male: 7.4, female: 7.5},
    {age: "50-54", male: 6.5, female: 6.8},
    {age: "55-59", male: 5.5, female: 5.9},
    {age: "60-64", male: 4.5, female: 5.0},
    {age: "65-69", male: 3.5, female: 4.1},
    {age: "70-74", male: 2.6, female: 3.3},
    {age: "75-79", male: 1.9, female: 2.7},
    {age: "80+", male: 1.4, female: 2.4}
  ],
  "2020": [
    {age: "0-4", male: 8.9, female: 8.5},
    {age: "5-9", male: 9.2, female: 8.8},
    {age: "10-14", male: 9.7, female: 9.3},
    {age: "15-19", male: 10.1, female: 9.7},
    {age: "20-24", male: 10.5, female: 10.1},
    {age: "25-29", male: 10.1, female: 9.8},
    {age: "30-34", male: 9.5, female: 9.2},
    {age: "35-39", male: 8.7, female: 8.5},
    {age: "40-44", male: 8.1, female: 8.0},
    {age: "45-49", male: 7.7, female: 7.6},
    {age: "50-54", male: 7.2, female: 7.3},
    {age: "55-59", male: 6.3, female: 6.6},
    {age: "60-64", male: 5.3, female: 5.8},
    {age: "65-69", male: 4.3, female: 4.9},
    {age: "70-74", male: 3.3, female: 4.0},
    {age: "75-79", male: 2.3, female: 3.1},
    {age: "80+", male: 2.0, female: 3.4}
  ],
  "2030": [
    {age: "0-4", male: 8.2, female: 7.8},
    {age: "5-9", male: 8.5, female: 8.1},
    {age: "10-14", male: 8.9, female: 8.5},
    {age: "15-19", male: 9.3, female: 8.9},
    {age: "20-24", male: 9.7, female: 9.3},
    {age: "25-29", male: 10.1, female: 9.7},
    {age: "30-34", male: 10.0, female: 9.6},
    {age: "35-39", male: 9.4, female: 9.1},
    {age: "40-44", male: 8.6, female: 8.4},
    {age: "45-49", male: 8.0, female: 7.9},
    {age: "50-54", male: 7.6, female: 7.5},
    {age: "55-59", male: 7.1, female: 7.2},
    {age: "60-64", male: 6.1, female: 6.5},
    {age: "65-69", male: 5.2, female: 5.7},
    {age: "70-74", male: 4.1, female: 4.8},
    {age: "75-79", male: 3.1, female: 3.9},
    {age: "80+", male: 2.8, female: 4.3}
  ]
};

const PopulationPyramid = () => {
  const [currentYear, setCurrentYear] = useState("2000");
  // Removed isAnimating state since we're allowing animations to be interrupted
  const svgRef = useRef();
  const years = Object.keys(populationData).sort();
  
  // Set dimensions
  const margin = { top: 20, right: 40, bottom: 30, left: 40 };
  const width = 700 - margin.left - margin.right;
  const height = 500 - margin.top - margin.bottom;
  
  // Initialize the chart on first render
  const initChart = () => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    
    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
    
    // Create the axes groups that will be updated
    g.append("g")
      .attr("class", "y-axis")
      .attr("transform", `translate(${width / 2}, 0)`);
    
    g.append("g")
      .attr("class", "x-axis-male")
      .attr("transform", `translate(0, ${height})`);
    
    g.append("g")
      .attr("class", "x-axis-female")
      .attr("transform", `translate(${width / 2}, ${height})`);
    
    // Add static labels
    g.append("text")
      .attr("text-anchor", "middle")
      .attr("x", width / 4)
      .attr("y", height + margin.bottom)
      .text("Male (%)");
    
    g.append("text")
      .attr("text-anchor", "middle")
      .attr("x", 3 * width / 4)
      .attr("y", height + margin.bottom)
      .text("Female (%)");
    
    // Add title that will be updated
    g.append("text")
      .attr("class", "chart-title")
      .attr("text-anchor", "middle")
      .attr("x", width / 2)
      .attr("y", -5)
      .attr("font-weight", "bold");
  };
  
  // Update the chart with new data
  const drawPyramid = (year, animate = false) => {
    const svg = d3.select(svgRef.current);
    const g = svg.select("g");
    
    if (g.empty()) {
      initChart();
    }
    
    // X and Y scales
    const x = d3.scaleLinear()
      .domain([0, d3.max(populationData[year], d => Math.max(d.male, d.female)) * 1.1])
      .range([0, width / 2]);
    
    const y = d3.scaleBand()
      .domain(populationData[year].map(d => d.age))
      .range([0, height])
      .padding(0.1);
    
    // Update the axes
    svg.select(".y-axis")
      .transition()
      .duration(animate ? 1000 : 0)
      .call(d3.axisRight(y));
    
    svg.select(".x-axis-male")
      .transition()
      .duration(animate ? 1000 : 0)
      .call(d3.axisBottom(x.copy().range([width / 2, 0])));
    
    svg.select(".x-axis-female")
      .transition()
      .duration(animate ? 1000 : 0)
      .call(d3.axisBottom(x));
    
    // Update title
    svg.select(".chart-title")
      .text(`Population Pyramid - ${year}`);
    
    // Update male bars
    const maleBars = g.selectAll(".male-bar")
      .data(populationData[year]);
    
    // Enter new bars
    maleBars.enter()
      .append("rect")
      .attr("class", "male-bar")
      .attr("y", d => y(d.age))
      .attr("height", y.bandwidth())
      .attr("fill", "#77AADD")
      .attr("x", width / 2)
      .attr("width", 0)
      .merge(maleBars)
      .transition()
      .duration(animate ? 1000 : 0)
      .attr("x", d => width / 2 - x(d.male))
      .attr("y", d => y(d.age))
      .attr("height", y.bandwidth())
      .attr("width", d => x(d.male));
      
    // Update female bars
    const femaleBars = g.selectAll(".female-bar")
      .data(populationData[year]);
    
    // Enter new bars
    femaleBars.enter()
      .append("rect")
      .attr("class", "female-bar")
      .attr("x", width / 2)
      .attr("y", d => y(d.age))
      .attr("height", y.bandwidth())
      .attr("fill", "#DD7788")
      .attr("width", 0)
      .merge(femaleBars)
      .transition()
      .duration(animate ? 1000 : 0)
      .attr("x", width / 2)
      .attr("y", d => y(d.age))
      .attr("height", y.bandwidth())
      .attr("width", d => x(d.female));
      
    // Update male labels
    const maleLabels = g.selectAll(".male-label")
      .data(populationData[year]);
      
    // Enter new labels
    maleLabels.enter()
      .append("text")
      .attr("class", "male-label")
      .attr("text-anchor", "end")
      .attr("font-size", "10px")
      .merge(maleLabels)
      .text(d => d.male)
      .transition()
      .duration(animate ? 1000 : 0)
      .attr("x", d => width / 2 - x(d.male) + 5)
      .attr("y", d => y(d.age) + y.bandwidth() / 2 + 4)
      .attr("opacity", 1);
      
    // Update female labels
    const femaleLabels = g.selectAll(".female-label")
      .data(populationData[year]);
      
    // Enter new labels
    femaleLabels.enter()
      .append("text")
      .attr("class", "female-label")
      .attr("text-anchor", "start")
      .attr("font-size", "10px")
      .merge(femaleLabels)
      .text(d => d.female)
      .transition()
      .duration(animate ? 1000 : 0)
      .attr("x", d => width / 2 + x(d.female) - 5)
      .attr("y", d => y(d.age) + y.bandwidth() / 2 + 4)
      .attr("opacity", 1);
  };
  
  useEffect(() => {
    initChart();
    drawPyramid(currentYear);
  }, []);
  
  const handleYearChange = (year) => {
    // No longer checking isAnimating - we allow interrupting the animation
    setCurrentYear(year);
    drawPyramid(year, true);
  };
  
  const handleNextYear = () => {
    const currentIndex = years.indexOf(currentYear);
    const nextIndex = (currentIndex + 1) % years.length;
    handleYearChange(years[nextIndex]);
  };
  
  const handlePrevYear = () => {
    const currentIndex = years.indexOf(currentYear);
    const prevIndex = (currentIndex - 1 + years.length) % years.length;
    handleYearChange(years[prevIndex]);
  };
  
  return (
    <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg shadow">
      <div className="flex items-center justify-center w-full mb-4 space-x-4">
        <button 
          onClick={handlePrevYear}
          className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          Previous
        </button>
        
        <div className="flex space-x-2">
          {years.map(year => (
            <button
              key={year}
              onClick={() => handleYearChange(year)}
              disabled={year === currentYear}
              className={`px-3 py-1 rounded ${
                year === currentYear 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {year}
            </button>
          ))}
        </div>
        
        <button 
          onClick={handleNextYear}
          className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          Next
        </button>
      </div>
      
      <div className="overflow-auto">
        <svg 
          ref={svgRef} 
          width={700} 
          height={500}
          className="bg-white"
        ></svg>
      </div>
      
      <div className="flex justify-center mt-4 space-x-4">
        <div className="flex items-center">
          <div className="w-4 h-4 mr-2 bg-blue-500"></div>
          <span>Male</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 mr-2 bg-red-400"></div>
          <span>Female</span>
        </div>
      </div>
    </div>
  );
};

export default PopulationPyramid;