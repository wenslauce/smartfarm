import { useState, useEffect } from 'react';
import { MapPin, Search, Cloud, ChevronDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function CitySelector({
  selectedLocation,
  onLocationChange,
  searchLocation,
  searchResults,
  kenyaLocations,
  className
}) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  useEffect(() => {
    if (selectedLocation) {
      setValue(selectedLocation.name);
    }
  }, [selectedLocation]);

  const handleSearch = (search) => {
    searchLocation(search);
  };

  return (
    <Card className="mb-8 bg-gradient-to-br from-white to-sky-300 rounded-xl overflow-hidden">
      <CardContent className="p-8 relative">
        {/* Decorative background elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-sky-100/30 to-sky-200/30" />
        
        <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="w-full md:w-auto">
            <div className="bg-white/40 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/50 hover:bg-white/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-br from-sky-400 to-sky-500 p-3 rounded-lg shadow-lg">
                  <MapPin size={24} className="text-white" />
                </div>
                <div className={cn("w-full max-w-md", className)}>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/20 transition-all duration-300"
                      >
                        {value ? (
                          <>
                            <MapPin className="mr-2 h-4 w-4" />
                            {value}
                          </>
                        ) : (
                          <>
                            <Search className="mr-2 h-4 w-4" />
                            Search locations...
                          </>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0 bg-white/10 backdrop-blur-lg border-white/20">
                      <Command className="bg-transparent">
                        <CommandInput 
                          placeholder="Search for a city..." 
                          onValueChange={handleSearch}
                          className="border-none bg-transparent text-white placeholder:text-white/60"
                        />
                        <CommandList>
                          <CommandEmpty>No locations found.</CommandEmpty>
                          {searchResults.length > 0 && (
                            <CommandGroup heading="Search Results">
                              {searchResults.map((location) => (
                                <CommandItem
                                  key={location.id}
                                  value={location.name}
                                  onSelect={() => {
                                    onLocationChange(location);
                                    setValue(location.name);
                                    setOpen(false);
                                  }}
                                  className="cursor-pointer hover:bg-white/20"
                                >
                                  <MapPin className="mr-2 h-4 w-4" />
                                  {location.name}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          )}
                          <CommandGroup heading="Popular in Kenya">
                            {kenyaLocations.popular.map((location) => (
                              <CommandItem
                                key={location.id}
                                value={location.name}
                                onSelect={() => {
                                  onLocationChange(location);
                                  setValue(location.name);
                                  setOpen(false);
                                }}
                                className="cursor-pointer hover:bg-white/20"
                              >
                                <MapPin className="mr-2 h-4 w-4" />
                                {location.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                          <CommandGroup heading="Counties">
                            {kenyaLocations.counties.map((county) => (
                              <CommandItem
                                key={county.id}
                                value={county.name}
                                onSelect={() => {
                                  onLocationChange(county);
                                  setValue(county.name);
                                  setOpen(false);
                                }}
                                className="cursor-pointer hover:bg-white/20"
                              >
                                <MapPin className="mr-2 h-4 w-4" />
                                {county.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-sky-400 to-sky-500 p-2 rounded-lg shadow-lg">
              <Cloud size={32} className="text-white animate-pulse" />
            </div>
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-sky-500 to-sky-400">
              Weather Dashboard
            </h1>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="group bg-white/40 hover:bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-white/50 transition-all duration-300 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-sky-400 to-sky-500 p-2 rounded-md shadow-lg">
                <MapPin size={16} className="text-white" />
              </div>
              <div className="text-sky-900">
                <div className="text-sm font-medium group-hover:text-sky-600 transition-colors">Current Location</div>
                <div className="text-xs text-sky-600/70">Based on selected city</div>
              </div>
            </div>
          </div>
          
          <div className="group bg-white/40 hover:bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-white/50 transition-all duration-300 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-sky-400 to-sky-500 p-2 rounded-md shadow-lg">
                <Cloud size={16} className="text-white" />
              </div>
              <div className="text-sky-900">
                <div className="text-sm font-medium group-hover:text-sky-600 transition-colors">Real-time Updates</div>
                <div className="text-xs text-sky-600/70">Auto-refreshing data</div>
              </div>
            </div>
          </div>
          
          <div className="group bg-white/40 hover:bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-white/50 transition-all duration-300 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-sky-400 to-sky-500 p-2 rounded-md shadow-lg">
                <Search size={16} className="text-white" />
              </div>
              <div className="text-sky-900">
                <div className="text-sm font-medium group-hover:text-sky-600 transition-colors">Quick Search</div>
                <div className="text-xs text-sky-600/70">Find cities instantly</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}