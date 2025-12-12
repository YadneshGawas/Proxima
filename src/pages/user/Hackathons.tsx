/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Search, Filter, X } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { HackathonCard } from "@/components/HackathonCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Hackathon, HackathonFilters } from "@/types";
import { hackathonService } from "@/services/api";

export default function Hackathons() {
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [filteredHackathons, setFilteredHackathons] = useState<Hackathon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<HackathonFilters>({});
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const availableTags = Array.from(
    new Set(hackathons.flatMap((h) => h.tags ?? []))
  );

  useEffect(() => {
    loadHackathons();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [hackathons, searchQuery, filters, selectedTags]);

  const loadHackathons = async () => {
    try {
      const data = await hackathonService.getAll();
      setHackathons(data);
      setFilteredHackathons(data);
    } catch (error) {
      console.error("Failed to load hackathons:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...hackathons];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((h) => {
        const matchesName = h.eventName.toLowerCase().includes(query);
        const matchesTags = (h.tags || []).some((tag) =>
          tag.toLowerCase().includes(query)
        );
        return matchesName || matchesTags;
      });
    }

    // Mode filter
    if (filters.mode) {
      filtered = filtered.filter((h) => h.mode === filters.mode);
    }

    // Participation type filter
    if (filters.participationType) {
      filtered = filtered.filter(
        (h) => h.participationType === filters.participationType
      );
    }

    // Tags filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter((h) =>
        (h.tags || []).some((tag) => selectedTags.includes(tag))
      );
    }

    setFilteredHackathons(filtered);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setFilters({});
    setSelectedTags([]);
  };

  const hasActiveFilters =
    searchQuery ||
    filters.mode ||
    filters.participationType ||
    selectedTags.length > 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Hackathons</h1>
          <p className="text-muted-foreground">
            Discover and register for upcoming hackathons.
          </p>
        </div>

        {/* Search + Filters */}
        <div className="space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row">
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search hackathons..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Mode Filter */}
            <Select
              value={filters.mode || "all"}
              onValueChange={(value) =>
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                setFilters({
                  ...filters,
                  mode: value === "all" ? undefined : (value as any),
                })
              }
            >
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Modes</SelectItem>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>

            {/* Participation Type */}
            <Select
              value={filters.participationType || "all"}
              onValueChange={(value) =>
                setFilters({
                  ...filters,
                  participationType:
                    value === "all" ? undefined : (value as any),
                })
              }
            >
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="individual">Individual</SelectItem>
                <SelectItem value="team">Team</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tags Filter */}
          <div className="flex flex-wrap gap-2">
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <Filter className="h-4 w-4" /> Tags:
            </span>

            {(availableTags || []).slice(0, 10).map((tag) => (
              <Badge
                key={tag}
                variant={selectedTags.includes(tag) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>

          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="mr-1 h-4 w-4" />
              Clear Filters
            </Button>
          )}
        </div>

        {/* Hackathon Results */}
        <div>
          <p className="mb-4 text-sm text-muted-foreground">
            Showing {filteredHackathons.length} hackathon
            {filteredHackathons.length !== 1 ? "s" : ""}
          </p>

          {isLoading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-80 animate-pulse rounded-lg bg-muted"
                />
              ))}
            </div>
          ) : filteredHackathons.length === 0 ? (
            <div className="rounded-lg border border-border p-8 text-center">
              <p className="text-muted-foreground">No hackathons found.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredHackathons.map((hackathon) => (
                <HackathonCard key={hackathon.id} hackathon={hackathon} />
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
