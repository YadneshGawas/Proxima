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

import { Hackathon } from "@/types";
import { hackathonService } from "@/services/hackathon/hackathon.service";

export default function Hackathons() {
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // ❌ OLD
// const [searchQuery, setSearchQuery] = useState("");

  // ✅ NEW (separate raw input + debounced value)
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [mode, setMode] = useState<
    "online" | "offline" | "hybrid" | undefined
  >(undefined);
  const [participationType, setParticipationType] = useState<
    "individual" | "team" | undefined
  >(undefined);

  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // pagination (ready for later UI)
  const [page] = useState(1);
  const [total, setTotal] = useState(0);

  // derive tags from backend results (ok for now)
  const availableTags = Array.from(
    new Set(hackathons.flatMap((h) => h.tags ?? []))
  );

  // -----------------------------
  // LOAD HACKATHONS (BACKEND)
  // -----------------------------
  const loadHackathons = async () => {
    setIsLoading(true);
    try {
      const res = await hackathonService.getAll({
        page,
        search: searchQuery || undefined,
        mode,
        participation_type: participationType,
        tag: selectedTags[0], // backend supports single tag
      });

      setHackathons(res.results);
      setTotal(res.total);
    } catch (error) {
      console.error("Failed to load hackathons:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadHackathons();
  }, [page, searchQuery, mode, participationType, selectedTags]);

  // -----------------------------
  // UI HELPERS
  // -----------------------------
  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? [] : [tag] // enforce single tag
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setMode(undefined);
    setParticipationType(undefined);
    setSelectedTags([]);
  };

  const hasActiveFilters =
    !!searchQuery || !!mode || !!participationType || selectedTags.length > 0;

  // ✅ DEBOUNCE SEARCH (prevents API spam)
  useEffect(() => {
    const id = setTimeout(() => {
      setSearchQuery(searchInput);
    }, 400);

    return () => clearTimeout(id);
  }, [searchInput]);

  // -----------------------------
  // RENDER
  // -----------------------------
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
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search hackathons..."
                value={searchQuery}
                // ❌ OLD
                  // onChange={(e) => setSearchQuery(e.target.value)}

                  // ✅ NEW
                  onChange={(e) => setSearchInput(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Mode */}
            <Select
              value={mode || "all"}
              onValueChange={(v) =>
                setMode(v === "all" ? undefined : (v as any))
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

            {/* Participation */}
            <Select
              value={participationType || "all"}
              onValueChange={(v) =>
                setParticipationType(v === "all" ? undefined : (v as any))
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

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <Filter className="h-4 w-4" /> Tags:
            </span>

            {availableTags.slice(0, 10).map((tag) => (
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

        {/* Results */}
        <div>
          <p className="mb-4 text-sm text-muted-foreground">
            Showing {hackathons.length} of {total} hackathons
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
          ) : hackathons.length === 0 ? (
            <div className="rounded-lg border border-border p-8 text-center">
              <p className="text-muted-foreground">No hackathons found.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {hackathons.map((hackathon) => (
                <HackathonCard key={hackathon.id} hackathon={hackathon} />
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
