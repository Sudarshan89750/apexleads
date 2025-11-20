import { useState, useEffect, useMemo } from 'react';
import { Calendar as CalendarIcon, PlusCircle, MoreHorizontal, Loader2 } from 'lucide-react';
import { format, isSameDay } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/lib/api-client';
import type { Appointment } from '@shared/types';
import { AppointmentForm, AppointmentFormValues } from '@/components/AppointmentForm';
import { toast } from "sonner";
export function CalendarsPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const data = await api<Appointment[]>('/api/appointments');
      setAppointments(data);
    } catch (error) {
      toast.error("Failed to fetch appointments.");
      console.error("Failed to fetch appointments:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchAppointments();
  }, []);
  const selectedDayAppointments = useMemo(() => {
    if (!date) return [];
    return appointments
      .filter(appt => isSameDay(new Date(appt.date), date))
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [date, appointments]);
  const handleAddClick = () => {
    setSelectedAppointment(null);
    setIsFormOpen(true);
  };
  const handleEditClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsFormOpen(true);
  };
  const handleDeleteClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsDeleteConfirmOpen(true);
  };
  const handleFormSubmit = async (values: AppointmentFormValues) => {
    setIsSubmitting(true);
    try {
      if (selectedAppointment) {
        await api(`/api/appointments/${selectedAppointment.id}`, {
          method: 'PUT',
          body: JSON.stringify(values),
        });
        toast.success("Appointment updated successfully.");
      } else {
        const newAppointmentPayload = {
          ...values,
          date: format(date || new Date(), 'yyyy-MM-dd'),
        };
        await api('/api/appointments', {
          method: 'POST',
          body: JSON.stringify(newAppointmentPayload),
        });
        toast.success("Appointment created successfully.");
      }
      setIsFormOpen(false);
      fetchAppointments();
    } catch (error) {
      toast.error(`Failed to ${selectedAppointment ? 'update' : 'create'} appointment.`);
    } finally {
      setIsSubmitting(false);
    }
  };
  const confirmDelete = async () => {
    if (!selectedAppointment) return;
    setIsSubmitting(true);
    try {
      await api(`/api/appointments/${selectedAppointment.id}`, { method: 'DELETE' });
      toast.success("Appointment deleted successfully.");
      setIsDeleteConfirmOpen(false);
      fetchAppointments();
    } catch (error) {
      toast.error("Failed to delete appointment.");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Calendars</h1>
        <Button onClick={handleAddClick} disabled={!date}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Appointment
        </Button>
      </div>
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-1">
          <Card>
            <CardContent className="p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="p-3"
                classNames={{
                  day_selected: "bg-primary text-primary-foreground hover:bg-primary/90 focus:bg-primary",
                }}
              />
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>
                Appointments for {date ? format(date, 'PPP') : '...'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ) : selectedDayAppointments.length > 0 ? (
                <ul className="space-y-4">
                  {selectedDayAppointments.map(appt => (
                    <li key={appt.id} className="flex items-center gap-4 p-4 border rounded-lg group">
                      <div className="flex flex-col items-center justify-center bg-muted p-2 rounded-md w-20">
                        <span className="text-sm font-semibold">{appt.startTime}</span>
                        <span className="text-xs text-muted-foreground">to</span>
                        <span className="text-sm font-semibold">{appt.endTime}</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-foreground">{appt.title}</p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditClick(appt)}>Edit</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteClick(appt)} className="text-red-600">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-12">
                  <CalendarIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-2 text-sm font-medium text-foreground">No appointments</h3>
                  <p className="mt-1 text-sm text-muted-foreground">There are no appointments scheduled for this day.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{selectedAppointment ? 'Edit Appointment' : 'Add New Appointment'}</DialogTitle>
            <DialogDescription>
              {selectedAppointment ? 'Update the details for this appointment.' : `Schedule a new appointment for ${date ? format(date, 'PPP') : ''}.`}
            </DialogDescription>
          </DialogHeader>
          <AppointmentForm
            initialData={selectedAppointment}
            onSubmit={handleFormSubmit}
            isLoading={isSubmitting}
          />
        </DialogContent>
      </Dialog>
      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This will permanently delete the appointment "{selectedAppointment?.title}". This action cannot be undone.
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