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
        const active = list.find(b => ['REQUESTED', 'ALLOCATED', 'ACCEPTED', 'IN_TRANSIT', 'ARRIVED', 'IN_PROGRESS'].includes(b.status));
        const prev = list.filter(b => ['COMPLETED', 'CANCELLED'].includes(b.status));

        if (active) {
          setActiveBooking({
            _id: active._id,
            bookingId: active.bookingCode || active._id,
            bookingCode: active.bookingCode || active._id,
            status: active.status,
            service: active.serviceId || SERVICES_DATA['electrical'],
            worker: active.workerId || WORKERS_DATA[0],
            address: active.serviceAddress?.addressLine1 ? `${active.serviceAddress.addressLine1}, ${active.serviceAddress.city || 'Delhi'}` : bookingDetails.address,
            createdAt: new Date(active.createdAt).toLocaleTimeString(),
            bookingDate: new Date(active.createdAt).toLocaleDateString(),
            details: bookingDetails
          });
        } else {
          setActiveBooking(null);
        }

        setPreviousBookings(prev.map(p => ({
          _id: p._id,
          bookingId: p.bookingCode || p._id,
          bookingCode: p.bookingCode || p._id,
          status: p.status,
          service: p.serviceId || SERVICES_DATA['electrical'],
          worker: p.workerId || WORKERS_DATA[0],
          completedDate: new Date(p.updatedAt || p.createdAt).toLocaleDateString(),
          amountPaid: p.pricing?.totalAmount || 499,
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
    const sId = serviceId || selectedServiceId || 'electrical';
    const wId = workerId || selectedWorkerId || 'el-1';
    
    const serviceObj = SERVICES_DATA[sId] || SERVICES_DATA['electrical'];
    const workerObj = WORKERS_DATA.find((w) => w.id === wId || w._id === wId) || WORKERS_DATA[0];
    
    let backendBooking = null;
    let backendOtp = null;

    try {
      const res = await apiCreateBooking({
        serviceId: serviceObj._id || serviceObj.backendId || '6aa307c8abef287d06eb41fe',
        workerId: workerObj._id || workerObj.backendId || '6aa307c9abef287d06eb4213',
        notes: extraDetails.specialInstructions || bookingDetails.specialInstructions || 'Cooperative service booking',
        serviceAddress: {
          addressLine1: bookingDetails.address || 'B-42 Lajpat Nagar II',
          city: 'New Delhi',
          state: 'Delhi',
          pincode: '110024'
        }
      });
      if (res?.data?.booking) {
        backendBooking = res.data.booking;
        backendOtp = res.data.startOtp;
      } else if (res?.booking) {
        backendBooking = res.booking;
        backendOtp = res.startOtp;
      }
    } catch (e) {
      console.warn('[BookingContext] Backend booking creation notice:', e.message);
    }

    const newId = backendBooking?.bookingCode || `BK-${Math.floor(1000 + Math.random() * 9000)}`;
    const newBooking = {
      _id: backendBooking?._id || null,
      bookingId: newId,
      bookingCode: newId,
      startOtp: backendOtp || '1234',
      status: backendBooking?.status || 'Assigned',
      etaMinutes: 15,
      worker: workerObj,
      service: serviceObj,
      details: { ...bookingDetails, ...extraDetails },
      createdAt: new Date().toLocaleTimeString(),
      address: bookingDetails.address || 'B-42 Lajpat Nagar II, New Delhi (110024)',
      bookingDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };
    
    setActiveBooking(newBooking);
    return newBooking;
  };

  const completeBooking = () => {
    if (activeBooking && activeBooking.status !== 'Completed') {
      const completed = {
        ...activeBooking,
        status: 'Completed',
        completedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        amountPaid: (activeBooking.service?.basePrice || 499) + 49,
        ratingGiven: 5.0,
        paymentMethod: 'UPI (Escrow Protected)',
        timeSlot: 'Immediate Dispatch'
      };
      setPreviousBookings((prev) => [completed, ...prev]);
      setActiveBooking(null);
    }
  };

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
        completeBooking,
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
