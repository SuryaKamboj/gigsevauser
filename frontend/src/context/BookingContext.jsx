import React, { createContext, useContext, useState } from 'react';
import { SERVICES_DATA } from '../data/servicesData';
import { WORKERS_DATA } from '../data/workersData';
import { createBooking as apiCreateBooking, fetchBookings as apiFetchBookings } from '../services/bookingApi';

const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  const [selectedServiceId, setSelectedServiceId] = useState('electrical');
  const [selectedWorkerId, setSelectedWorkerId] = useState('el-1');
  const [bookingDetails, setBookingDetails] = useState({
    address: 'B-42 Lajpat Nagar II, New Delhi (110024)',
    date: new Date().toISOString().split('T')[0],
    timeSlot: '10:00 AM - 11:30 AM',
    specialInstructions: 'Please bring insulated wire cutters and test switchboard socket #3.',
    uploadedImage: null
  });

  const [activeBooking, setActiveBooking] = useState(null);
  const [previousBookings, setPreviousBookings] = useState([]);

  const reloadBookings = async () => {
    try {
      const list = await apiFetchBookings();
      if (Array.isArray(list)) {
        const active = list.find(b => ['PENDING', 'REQUESTED', 'ALLOCATED', 'ACCEPTED', 'IN_TRANSIT', 'ARRIVED', 'IN_PROGRESS', 'COMPLETION_PENDING'].includes(b.status));
        const prev = list.filter(b => ['COMPLETED', 'CANCELLED'].includes(b.status));

        if (active) {
          setActiveBooking({
            _id: active._id,
            bookingId: active.bookingCode || active.bookingId || active._id,
            bookingCode: active.bookingCode || active.bookingId || active._id,
            status: active.status,
            service: active.serviceId || null,
            worker: active.workerId || null,
            address: active.serviceAddress?.addressLine1 ? `${active.serviceAddress.addressLine1}, ${active.serviceAddress.city || 'Delhi'}` : bookingDetails.address,
            createdAt: new Date(active.createdAt).toLocaleTimeString(),
            bookingDate: new Date(active.createdAt).toLocaleDateString(),
            details: bookingDetails,
            pricing: active.pricing
          });
        } else {
          setActiveBooking(null);
        }

        setPreviousBookings(prev.map(p => ({
          _id: p._id,
          bookingId: p.bookingCode || p.bookingId || p._id,
          bookingCode: p.bookingCode || p.bookingId || p._id,
          status: p.status,
          service: p.serviceId || null,
          worker: p.workerId || null,
          completedDate: new Date(p.updatedAt || p.createdAt).toLocaleDateString(),
          amountPaid: p.pricing?.totalAmount || 0,
          ratingGiven: 5.0,
          paymentMethod: 'UPI (Escrow Protected)'
        })));
      }
    } catch (e) {
      // quiet notice
    }
  };

  React.useEffect(() => {
    reloadBookings();
    const interval = setInterval(reloadBookings, 4000);
    return () => clearInterval(interval);
  }, []);

  const updateBookingDetails = (fields) => {
    setBookingDetails((prev) => ({ ...prev, ...fields }));
  };

  const createNewBooking = async (serviceId, workerId, extraDetails = {}) => {
    const sId = serviceId || selectedServiceId;
    const wId = workerId || selectedWorkerId;
    
    const payload = {
      serviceId: sId,
      workerId: wId,
      notes: extraDetails.specialInstructions || bookingDetails.specialInstructions || 'Cooperative service booking',
      serviceAddress: {
        addressLine1: bookingDetails.address || 'B-42 Lajpat Nagar II',
        city: 'New Delhi',
        state: 'Delhi',
        pincode: '110024'
      }
    };

    const res = await apiCreateBooking(payload);
    const backendBooking = res?.data?.booking || res?.booking;

    if (!backendBooking) {
      throw new Error(res?.error?.message || 'Failed to create booking in database');
    }

    const bId = backendBooking.bookingCode || backendBooking.bookingId || backendBooking._id;
    const newBooking = {
      _id: backendBooking._id,
      bookingId: bId,
      bookingCode: backendBooking.bookingCode,
      status: backendBooking.status, // 'PENDING'
      worker: backendBooking.workerId || null,
      service: backendBooking.serviceId || null,
      details: { ...bookingDetails, ...extraDetails },
      createdAt: new Date(backendBooking.createdAt || Date.now()).toLocaleTimeString(),
      address: backendBooking.serviceAddress?.addressLine1 || bookingDetails.address,
      bookingDate: new Date(backendBooking.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      pricing: backendBooking.pricing
    };
    
    setActiveBooking(newBooking);
    return newBooking;
  };

  // completeBooking() intentionally removed.
  // Status is exclusively driven by MongoDB via reloadBookings() polling.
  // When the worker marks IN_PROGRESS → COMPLETED on the backend,
  // the next reloadBookings() poll will move the booking from activeBooking → previousBookings automatically.

  const [complaints, setComplaints] = useState([]);

  const addComplaint = (complaintData) => {
    const newId = `CMP-${Math.floor(1000 + Math.random() * 9000)}`;
    const newComplaint = {
      complaintId: newId,
      bookingId: complaintData.bookingId || 'BK-1001',
      serviceTitle: complaintData.serviceTitle || 'Home Service',
      workerName: complaintData.workerName || 'Assigned Artisan',
      workerCooperative: complaintData.workerCooperative || 'Regional Cooperative Guild',
      category: complaintData.category || 'Other',
      description: complaintData.description || 'No additional details provided.',
      evidenceName: complaintData.evidenceName || null,
      submittedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      currentStatus: 'Submitted',
      timeline: [
        {
          status: 'Submitted',
          timestamp: `${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
          note: 'Complaint registered & dispatched to regional guild inspection desk.'
        }
      ],
      assignedOfficer: 'Officer Rajesh Varma (Regional Cooperative Inspector)'
    };

    setComplaints((prev) => [newComplaint, ...prev]);
    return newComplaint;
  };

  return (
    <BookingContext.Provider
      value={{
        selectedServiceId,
        setSelectedServiceId,
        selectedWorkerId,
        setSelectedWorkerId,
        bookingDetails,
        updateBookingDetails,
        activeBooking,
        setActiveBooking,
        previousBookings,
        setPreviousBookings,
        complaints,
        setComplaints,
        addComplaint,
        createNewBooking,
        reloadBookings
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};
