import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Users, Target } from "lucide-react";
import { api } from "@/lib/api-client";
import type { SearchResult } from "@shared/types";
export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);
  useEffect(() => {
    if (open) {
      const fetchResults = async () => {
        setLoading(true);
        try {
          const data = await api<SearchResult[]>('/api/search');
          setResults(data);
        } catch (error) {
          console.error("Failed to fetch search results:", error);
          setResults([]);
        } finally {
          setLoading(false);
        }
      };
      fetchResults();
    }
  }, [open]);
  const handleSelect = (link: string) => {
    setOpen(false);
    navigate(link);
  };
  const contactResults = results.filter(r => r.type === 'contact');
  const opportunityResults = results.filter(r => r.type === 'opportunity');
  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search for contacts or opportunities..." />
      <CommandList>
        {loading && <CommandEmpty>Loading results...</CommandEmpty>}
        {!loading && results.length === 0 && <CommandEmpty>No results found.</CommandEmpty>}
        {!loading && contactResults.length > 0 && (
          <CommandGroup heading="Contacts">
            {contactResults.map((result) => (
              <CommandItem key={result.id} onSelect={() => handleSelect(result.link)}>
                <Users className="mr-2 h-4 w-4" />
                <span>{result.title}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
        {!loading && opportunityResults.length > 0 && (
          <CommandGroup heading="Opportunities">
            {opportunityResults.map((result) => (
              <CommandItem key={result.id} onSelect={() => handleSelect(result.link)}>
                <Target className="mr-2 h-4 w-4" />
                <span>{result.title}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
}