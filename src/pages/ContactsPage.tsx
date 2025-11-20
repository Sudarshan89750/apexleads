import { useState, useEffect, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from '@/lib/api-client';
import type { Contact } from '@shared/types';
import { PlusCircle, Search, MoreHorizontal, Loader2 } from 'lucide-react';
import { ContactForm } from '@/components/ContactForm';
import { toast } from "sonner";
export function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fetchContacts = async () => {
    try {
      setLoading(true);
      const data = await api<Contact[]>('/api/contacts');
      setContacts(data);
    } catch (error) {
      toast.error("Failed to fetch contacts.");
      console.error("Failed to fetch contacts:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchContacts();
  }, []);
  const handleAddClick = () => {
    setSelectedContact(null);
    setIsFormOpen(true);
  };
  const handleEditClick = (contact: Contact) => {
    setSelectedContact(contact);
    setIsFormOpen(true);
  };
  const handleDeleteClick = (contact: Contact) => {
    setSelectedContact(contact);
    setIsDeleteConfirmOpen(true);
  };
  const handleFormSubmit = async (values: any) => {
    setIsSubmitting(true);
    try {
      if (selectedContact) {
        // Update existing contact
        await api(`/api/contacts/${selectedContact.id}`, {
          method: 'PUT',
          body: JSON.stringify(values),
        });
        toast.success("Contact updated successfully.");
      } else {
        // Create new contact
        await api('/api/contacts', {
          method: 'POST',
          body: JSON.stringify(values),
        });
        toast.success("Contact created successfully.");
      }
      setIsFormOpen(false);
      fetchContacts(); // Refresh data
    } catch (error) {
      toast.error(`Failed to ${selectedContact ? 'update' : 'create'} contact.`);
      console.error(`Failed to save contact:`, error);
    } finally {
      setIsSubmitting(false);
    }
  };
  const confirmDelete = async () => {
    if (!selectedContact) return;
    setIsSubmitting(true);
    try {
      await api(`/api/contacts/${selectedContact.id}`, { method: 'DELETE' });
      toast.success("Contact deleted successfully.");
      setIsDeleteConfirmOpen(false);
      fetchContacts(); // Refresh data
    } catch (error) {
      toast.error("Failed to delete contact.");
      console.error("Failed to delete contact:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  const filteredContacts = useMemo(() => contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (contact.company && contact.company.toLowerCase().includes(searchTerm.toLowerCase()))
  ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()), [contacts, searchTerm]);
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
          <Button onClick={handleAddClick}>
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
              <TableHead><span className="sr-only">Actions</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={6}><Skeleton className="h-10 w-full" /></TableCell>
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
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditClick(contact)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteClick(contact)} className="text-red-600">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No contacts found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {/* Add/Edit Contact Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{selectedContact ? 'Edit Contact' : 'Add New Contact'}</DialogTitle>
            <DialogDescription>
              {selectedContact ? 'Update the details for this contact.' : 'Fill in the details for the new contact.'}
            </DialogDescription>
          </DialogHeader>
          <ContactForm
            initialData={selectedContact}
            onSubmit={handleFormSubmit}
            isLoading={isSubmitting}
          />
        </DialogContent>
      </Dialog>
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the contact "{selectedContact?.name}".
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteConfirmOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}