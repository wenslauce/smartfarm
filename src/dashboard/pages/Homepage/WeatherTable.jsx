import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Filter, X, ChevronDown, ChevronUp } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowDown, ArrowUp, ArrowUpDown, Download } from "lucide-react";

const FilterPopover = ({ column, value, onChange, onClose, options }) => (
  <div className="absolute mt-2 right-0 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
    <div className="p-3">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium text-gray-700">Filter {column}</h3>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={`Search ${column}...`}
        className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {options && options.length > 0 && (
        <div className="mt-2 max-h-48 overflow-y-auto">
          {options.map((option, index) => (
            <div 
              key={index}
              className="flex items-center px-2 py-1 hover:bg-gray-50 cursor-pointer text-sm"
              onClick={() => onChange(option)}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);

const WeatherTable = ({ data = [], isLoading = false }) => {
  const [filters, setFilters] = useState({
    date: '',
    temp: '',
    humidity: '',
    pressure: '',
    windSpeed: ''
  });
  const [activeFilter, setActiveFilter] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Close filter when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.filter-container')) {
        setActiveFilter(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter data based on all active filters
  const filteredData = data.filter(day => {
    return (
      day.date.toLowerCase().includes(filters.date.toLowerCase()) &&
      day.temp.toString().includes(filters.temp) &&
      day.humidity.toString().includes(filters.humidity) &&
      day.pressure.toString().includes(filters.pressure) &&
      day.windSpeed.toString().includes(filters.windSpeed)
    );
  });

  // Sort filtered data
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortConfig.key) return 0;
    
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    
    if (aValue < bValue) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleFilterChange = (column, value) => {
    setFilters(prev => ({
      ...prev,
      [column]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      date: '',
      temp: '',
      humidity: '',
      pressure: '',
      windSpeed: ''
    });
    setActiveFilter(null);
  };

  const columns = [
    { key: 'date', label: 'Date' },
    { key: 'temp', label: 'Temperature (°C)' },
    { key: 'humidity', label: 'Humidity (%)' },
    { key: 'pressure', label: 'Pressure (hPa)' },
    { key: 'windSpeed', label: 'Wind Speed (m/s)' }
  ];

  // Get unique values for each column for filter options
  const getColumnOptions = (column) => {
    return [...new Set(data.map(item => item[column]))].sort();
  };

  const handleExport = () => {
    const csv = [
      ['Date', 'Temperature (°C)', 'Humidity (%)', 'Wind Speed (m/s)', 'Pressure (hPa)'],
      ...filteredData.map(row => [
        row.date,
        row.temp.toFixed(1),
        row.humidity.toFixed(0),
        row.windSpeed.toFixed(1),
        row.pressure.toFixed(0)
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'weather-data.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const SortIcon = ({ column }) => {
    if (sortConfig.key !== column) return <ArrowUpDown className="w-4 h-4" />;
    return sortConfig.direction === 'asc' 
      ? <ArrowUp className="w-4 h-4" />
      : <ArrowDown className="w-4 h-4" />;
  };

  if (isLoading) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-800">Loading Weather Data...</CardTitle>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader className="border-b border-gray-100">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-semibold text-gray-800">Weather Forecast</CardTitle>
          <div className="flex items-center space-x-4">
            {Object.values(filters).some(f => f !== '') && (
              <button
                onClick={clearFilters}
                className="text-sm text-red-500 hover:text-red-600 flex items-center"
              >
                <X className="w-4 h-4 mr-1" />
                Clear Filters
              </button>
            )}
            <div className="text-sm text-gray-500">
              {filteredData.length} of {data.length} entries
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 border-b border-gray-100">
                {columns.map(({ key, label }) => (
                  <TableHead 
                    key={key}
                    className="relative filter-container"
                  >
                    <div className="flex items-center justify-between">
                      <div 
                        className="flex items-center cursor-pointer"
                        onClick={() => requestSort(key)}
                      >
                        <span className="font-semibold text-gray-700">{label}</span>
                        {sortConfig.key === key && (
                          <span className="ml-1">
                            <SortIcon column={key} />
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => setActiveFilter(activeFilter === key ? null : key)}
                        className={`ml-2 p-1 rounded hover:bg-gray-200 ${
                          filters[key] ? 'text-blue-500' : 'text-gray-400'
                        }`}
                      >
                        <Filter className="w-4 h-4" />
                      </button>
                      {activeFilter === key && (
                        <FilterPopover
                          column={label}
                          value={filters[key]}
                          onChange={(value) => handleFilterChange(key, value)}
                          onClose={() => setActiveFilter(null)}
                          options={getColumnOptions(key)}
                        />
                      )}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    No data available
                  </TableCell>
                </TableRow>
              ) : (
                sortedData.map((day, index) => (
                  <TableRow 
                    key={day.date}
                    className={`
                      ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                      hover:bg-blue-50 transition-colors
                    `}
                  >
                    <TableCell className="font-medium">{day.date}</TableCell>
                    <TableCell className="text-red-600">{day.temp.toFixed(1)}°C</TableCell>
                    <TableCell className="text-blue-600">{day.humidity.toFixed(0)}%</TableCell>
                    <TableCell className="text-green-600">{day.pressure.toFixed(0)} hPa</TableCell>
                    <TableCell className="text-purple-600">{day.windSpeed.toFixed(1)} m/s</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex justify-end p-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Filter className="w-4 h-4" />
                Filters
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuLabel>Filter Data</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="p-2">
                <Input
                  placeholder="Temperature..."
                  value={filters.temp}
                  onChange={(e) => handleFilterChange('temp', e.target.value)}
                  className="mb-2"
                />
                <Input
                  placeholder="Humidity..."
                  value={filters.humidity}
                  onChange={(e) => handleFilterChange('humidity', e.target.value)}
                  className="mb-2"
                />
                <Input
                  placeholder="Wind Speed..."
                  value={filters.windSpeed}
                  onChange={(e) => handleFilterChange('windSpeed', e.target.value)}
                  className="mb-2"
                />
                <Input
                  placeholder="Pressure..."
                  value={filters.pressure}
                  onChange={(e) => handleFilterChange('pressure', e.target.value)}
                />
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleExport}
            className="ml-2 flex items-center gap-1"
          >
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherTable;