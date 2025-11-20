import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from '@/lib/api-client';
import type { Contact } from '@shared/types';
import { PlusCircle, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
export function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  useEffect(() => {
    async function fetchContacts() {
      try {
        setLoading(true);
        const data = await api<Contact[]>('/api/contacts');
        setContacts(data);
      } catch (error) {
        console.error("Failed to fetch contacts:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchContacts();
  }, []);
  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.company.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const getStatusVariant = (status: Contact['status']) => {
    switch (status) {
      case 'Active': return 'default';
      case 'Lead': return 'secondary';
      case 'Inactive': return 'outline';
      default: return 'default';
    }
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Contacts</h1>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search contacts..."
              className="pl-8 sm:w-[300px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Contact
          </Button>
        </div>
      </div>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Created At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-28" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                </TableRow>
              ))
            ) : filteredContacts.length > 0 ? (
              filteredContacts.map((contact) => (
                <TableRow key={contact.id}>
                  <TableCell className="font-medium">
                    <div>{contact.name}</div>
                    <div className="text-sm text-muted-foreground">{contact.email}</div>
                  </TableCell>
                  <TableCell>{contact.company}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(contact.status)}>{contact.status}</Badge>
                  </TableCell>
                  <TableCell>{contact.phone}</TableCell>
                  <TableCell>{new Date(contact.createdAt).toLocaleDateString()}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No contacts found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}