// import React, { useEffect, useState } from 'react';
// import { FaEdit, FaTrash, FaSave, FaTimes, FaSearch, FaFilter, FaSort, FaPlus, FaMinus } from 'react-icons/fa';
// import { getBookings } from '../services/bookingService';
// import Navbar from '../components/Navbar';
// import { deleteBooking, updateBooking } from '../services/adminService';

// const AdminDashboard = () => {
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [deleteId, setDeleteId] = useState(null);
//   const [bookings, setBookings] = useState([]);
//   const [filteredBookings, setFilteredBookings] = useState([]);
//   const [editId, setEditId] = useState(null);
//   const [editData, setEditData] = useState({});
//   const [searchTerm, setSearchTerm] = useState('');
//   const [sortConfig, setSortConfig] = useState({ key: 'bookingTime', direction: 'desc' });
//   const [filterDate, setFilterDate] = useState('');
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [expandedRows, setExpandedRows] = useState(new Set());

//   useEffect(() => {
//     fetchBookings();
//   }, []);

//   useEffect(() => {
//     filterAndSortBookings();
//   }, [bookings, searchTerm, sortConfig, filterDate]);

//   const fetchBookings = async () => {
//     try {
//       setIsLoading(true);
//       const data = await getBookings();
//       const sorted = [...data].sort((a, b) => (b.bookingTime || 0) - (a.bookingTime || 0));
//       setBookings(sorted);
//       setIsLoading(false);
//     } catch (err) {
//       setError('Failed to fetch bookings');
//       setIsLoading(false);
//     }
//   };

//   const filterAndSortBookings = () => {
//     let result = [...bookings];
    
//     // Apply search filter
//     if (searchTerm) {
//       const term = searchTerm.toLowerCase();
//       result = result.filter(b => {
//         // Convert all values to string for safe searching
//         const email = (b.email || '').toString().toLowerCase();
//         const movieName = (b.movieName || '').toString().toLowerCase();
//         const seats = (b.seats || '').toString().toLowerCase();
        
//         return email.includes(term) || 
//                movieName.includes(term) ||
//                seats.includes(term);
//       });
//     }
    
//     // Apply date filter
//     if (filterDate) {
//       result = result.filter(b => b.movieDate === filterDate);
//     }
    
//     // Apply sorting
//     if (sortConfig.key) {
//       result.sort((a, b) => {
//         // Handle undefined values in sorting
//         const aValue = a[sortConfig.key] || '';
//         const bValue = b[sortConfig.key] || '';
        
//         if (aValue < bValue) {
//           return sortConfig.direction === 'asc' ? -1 : 1;
//         }
//         if (aValue > bValue) {
//           return sortConfig.direction === 'asc' ? 1 : -1;
//         }
//         return 0;
//       });
//     }
    
//     setFilteredBookings(result);
//   };

//   const requestSort = (key) => {
//     let direction = 'asc';
//     if (sortConfig.key === key && sortConfig.direction === 'asc') {
//       direction = 'desc';
//     }
//     setSortConfig({ key, direction });
//   };

//   const handleDelete = async (id) => {
//     setShowDeleteModal(true);
//     setDeleteId(id);
//   };

//   const confirmDelete = async () => {
//     if (deleteId) {
//       try {
//         await deleteBooking(deleteId);
//         setBookings(bookings.filter(b => b.id !== deleteId));
//         setShowDeleteModal(false);
//         setDeleteId(null);
//       } catch (err) {
//         setError('Failed to delete booking');
//       }
//     }
//   };

//   const cancelDelete = () => {
//     setShowDeleteModal(false);
//     setDeleteId(null);
//   };

//   const handleEdit = (booking) => {
//     setEditId(booking.id);
//     setEditData({ ...booking });
//   };

//   const handleEditChange = (e) => {
//     const { name, value } = e.target;
//     setEditData(ed => ({ ...ed, [name]: value }));
//   };

//   const handleEditSave = async () => {
//     try {
//       await updateBooking(editId, editData);
//       setEditId(null);
//       setEditData({});
//       await fetchBookings(); // Refresh data
//     } catch (err) {
//       setError('Failed to update booking');
//     }
//   };

//   const handleEditCancel = () => {
//     setEditId(null);
//     setEditData({});
//   };

//   const toggleRowExpansion = (id) => {
//     const newExpanded = new Set(expandedRows);
//     if (newExpanded.has(id)) {
//       newExpanded.delete(id);
//     } else {
//       newExpanded.add(id);
//     }
//     setExpandedRows(newExpanded);
//   };

//   // Calculate statistics
//   const totalBookings = bookings.length;
//   const totalRevenue = bookings.reduce((sum, b) => {
//     const price = parseInt(b.ticketPrice || b.price || 0);
//     return sum + (isNaN(price) ? 0 : price);
//   }, 0);

//   const todayBookings = bookings.filter(b => {
//     const today = new Date().toISOString().split('T')[0];
//     return b.movieDate === today;
//   }).length;

//   const clearFilters = () => {
//     setSearchTerm('');
//     setFilterDate('');
//     setSortConfig({ key: 'bookingTime', direction: 'desc' });
//   };

//   if (isLoading) {
//     return (
//       <>
//         <Navbar 
//           search={searchTerm} 
//           setSearch={setSearchTerm} 
//           filterDate={filterDate} 
//           setFilterDate={setFilterDate}
//         />
//         <div className="admin-dashboard">
//           <div className="loading">Loading bookings...</div>
//         </div>
//       </>
//     );
//   }

//   if (error) {
//     return (
//       <>
//         <Navbar 
//           search={searchTerm} 
//           setSearch={setSearchTerm} 
//           filterDate={filterDate} 
//           setFilterDate={setFilterDate}
//         />
//         <div className="admin-dashboard">
//           <div className="error">{error}</div>
//           <button onClick={fetchBookings} className="retry-btn">Retry</button>
//         </div>
//       </>
//     );
//   }

//   return (
//     <>
//       <Navbar 
//         search={searchTerm} 
//         setSearch={setSearchTerm} 
//         filterDate={filterDate} 
//         setFilterDate={setFilterDate}
//       />
//       {showDeleteModal && (
//         <div className="modal-overlay">
//           <div className="modal-content">
//             <h2>Confirm Deletion</h2>
//             <p>Are you sure you want to delete this booking? This action cannot be undone.</p>
//             <div className="modal-actions">
//               <button className="btn btn-danger" onClick={confirmDelete}>Yes, Delete</button>
//               <button className="btn btn-secondary" onClick={cancelDelete}>Cancel</button>
//             </div>
//           </div>
//         </div>
//       )}
      
//       <div className="admin-dashboard">
//         <div className="dashboard-header">
//           <h2>Admin Dashboard</h2>
//           {/* <p>Manage all bookings and view analytics</p> */}
//         </div>
        
//         <div className="summary-cards">
//           <div className="summary-card">
//             <div className="card-icon bookings"></div>
//             <div className="card-content">
//               <h3>Total Bookings</h3>
//               <span className="card-value">{totalBookings}</span>
//             </div>
//           </div>
//           <div className="summary-card">
//             <div className="card-icon revenue"></div>
//             <div className="card-content">
//               <h3>Total Revenue</h3>
//               <span className="card-value">₹{totalRevenue}</span>
//             </div>
//           </div>
//           <div className="summary-card">
//             <div className="card-icon today"></div>
//             <div className="card-content">
//               <h3>Today's Bookings</h3>
//               <span className="card-value">{todayBookings}</span>
//             </div>
//           </div>
//         </div>
        
//         <div className="table-container">
//           <table className="bookings-table">
//             <thead>
//               <tr>
//                 <th></th>
//                 <th onClick={() => requestSort('email')}>
//                   Email {sortConfig.key === 'email' && (
//                     <FaSort className={sortConfig.direction === 'asc' ? 'sort-asc' : 'sort-desc'} />
//                   )}
//                 </th>
//                 <th onClick={() => requestSort('movieName')}>
//                   Movie {sortConfig.key === 'movieName' && (
//                     <FaSort className={sortConfig.direction === 'asc' ? 'sort-asc' : 'sort-desc'} />
//                   )}
//                 </th>
//                 <th onClick={() => requestSort('seats')}>
//                   Seats {sortConfig.key === 'seats' && (
//                     <FaSort className={sortConfig.direction === 'asc' ? 'sort-asc' : 'sort-desc'} />
//                   )}
//                 </th>
//                 <th onClick={() => requestSort('bookingTime')}>
//                   Booking Time {sortConfig.key === 'bookingTime' && (
//                     <FaSort className={sortConfig.direction === 'asc' ? 'sort-asc' : 'sort-desc'} />
//                   )}
//                 </th>
//                 <th onClick={() => requestSort('movieDate')}>
//                   Movie Date {sortConfig.key === 'movieDate' && (
//                     <FaSort className={sortConfig.direction === 'asc' ? 'sort-asc' : 'sort-desc'} />
//                   )}
//                 </th>
//                 <th onClick={() => requestSort('ticketPrice')}>
//                   Price {sortConfig.key === 'ticketPrice' && (
//                     <FaSort className={sortConfig.direction === 'asc' ? 'sort-asc' : 'sort-desc'} />
//                   )}
//                 </th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredBookings.length === 0 ? (
//                 <tr>
//                   <td colSpan="8" className="no-data">
//                     No bookings found {searchTerm || filterDate ? 'matching your filters' : ''}
//                   </td>
//                 </tr>
//               ) : (
//                 filteredBookings.map(booking => (
//                   <React.Fragment key={booking.id}>
//                     <tr className={expandedRows.has(booking.id) ? 'expanded' : ''}>
//                       <td>
//                         <button 
//                           className="expand-btn"
//                           onClick={() => toggleRowExpansion(booking.id)}
//                         >
//                           {expandedRows.has(booking.id) ? <FaMinus /> : <FaPlus />}
//                         </button>
//                       </td>
//                       {editId === booking.id ? (
//                         <>
//                           <td><input name="email" value={editData.email} onChange={handleEditChange} /></td>
//                           <td><input name="movieName" value={editData.movieName} onChange={handleEditChange} /></td>
//                           <td><input name="seats" value={editData.seats} onChange={handleEditChange} /></td>
//                           <td>{booking.bookingTime ? new Date(booking.bookingTime).toLocaleString() : '-'}</td>
//                           <td><input type="date" name="movieDate" value={editData.movieDate || ''} onChange={handleEditChange} /></td>
//                           <td>
//                             <div className="price-input">
//                               <span>₹</span>
//                               <input name="ticketPrice" value={editData.ticketPrice || editData.price || ''} onChange={handleEditChange} />
//                             </div>
//                           </td>
//                           <td>
//                             <div className="action-buttons">
//                               <button className="btn btn-success btn-icon" title="Save" onClick={handleEditSave}>
//                                 <FaSave />
//                               </button>
//                               <button className="btn btn-secondary btn-icon" title="Cancel" onClick={handleEditCancel}>
//                                 <FaTimes />
//                               </button>
//                             </div>
//                           </td>
//                         </>
//                       ) : (
//                         <>
//                           <td>{booking.email}</td>
//                           <td>{booking.movieName || '-'}</td>
//                           <td>{booking.seats}</td>
//                           <td>{booking.bookingTime ? new Date(booking.bookingTime).toLocaleString() : '-'}</td>
//                           <td>{booking.movieDate || '-'}</td>
//                           <td>{booking.ticketPrice ? `₹${booking.ticketPrice}` : (booking.price ? `₹${booking.price}` : '-')}</td>
//                           <td>
//                             <div className="action-buttons">
//                               <button className="btn btn-primary btn-icon" title="Edit" onClick={() => handleEdit(booking)}>
//                                 <FaEdit />
//                               </button>
//                               <button className="btn btn-danger btn-icon" title="Delete" onClick={() => handleDelete(booking.id)}>
//                                 <FaTrash />
//                               </button>
//                             </div>
//                           </td>
//                         </>
//                       )}
//                     </tr>
//                     {expandedRows.has(booking.id) && (
//                       <tr className="details-row">
//                         <td colSpan="8">
//                           <div className="booking-details">
//                             <h4>Booking Details</h4>
//                             <div className="details-grid">
//                               <div className="detail-item">
//                                 <span className="detail-label">Booking ID:</span>
//                                 <span className="detail-value">{booking.id}</span>
//                               </div>
//                               <div className="detail-item">
//                                 <span className="detail-label">Created:</span>
//                                 <span className="detail-value">
//                                   {booking.bookingTime ? new Date(booking.bookingTime).toLocaleString() : '-'}
//                                 </span>
//                               </div>
//                               <div className="detail-item">
//                                 <span className="detail-label">Last Updated:</span>
//                                 <span className="detail-value">
//                                   {booking.updatedAt ? new Date(booking.updatedAt).toLocaleString() : 'Never'}
//                                 </span>
//                               </div>
//                             </div>
//                           </div>
//                         </td>
//                       </tr>
//                     )}
//                   </React.Fragment>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
        
//         <div className="dashboard-footer">
//           <p>Showing {filteredBookings.length} of {bookings.length} bookings</p>
//         </div>
//       </div>
//     </>
//   );
// }

// export default AdminDashboard;









// import React, { useEffect, useState } from 'react';
// import axios from "axios";
// import { FaEdit, FaTrash, FaSave, FaTimes, FaSearch, FaFilter, FaSort, FaPlus, FaMinus } from 'react-icons/fa';
// import { getBookings } from '../services/bookingService';
// import Navbar from '../components/Navbar';
// import { deleteBooking, updateBooking } from '../services/adminService';

// const AdminDashboard = () => {
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [deleteId, setDeleteId] = useState(null);
//   const [bookings, setBookings] = useState([]);
//   const [filteredBookings, setFilteredBookings] = useState([]);
//   const [editId, setEditId] = useState(null);
//   const [editData, setEditData] = useState({});
//   const [searchTerm, setSearchTerm] = useState('');
//   const [sortConfig, setSortConfig] = useState({ key: 'bookingTime', direction: 'desc' });
//   const [filterDate, setFilterDate] = useState('');
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [expandedRows, setExpandedRows] = useState(new Set());
  

//   useEffect(() => {
//     fetchBookings();
//   }, []);

//   useEffect(() => {
//     filterAndSortBookings();
//   }, [bookings, searchTerm, sortConfig, filterDate]);

//   const fetchBookings = async () => {
//   try {
//     setIsLoading(true);
//     const res = await axios.get("http://localhost:5000/api/bookings");
//      console.log("Fetched bookings:", res.data);
//     const data = res.data;

//     // Sort by bookingTime (latest first)
//     const sorted = [...data].sort((a, b) => (b.bookingTime || 0) - (a.bookingTime || 0));
//     setBookings(sorted);

//     setIsLoading(false);
//   } catch (err) {
//     console.error("Error fetching bookings:", err.response || err.message || err);
//     setError("Failed to fetch bookings");
//     setIsLoading(false);
//   }
// };


//   const filterAndSortBookings = () => {
//     let result = [...bookings];
    
//     if (searchTerm) {
//       const term = searchTerm.toLowerCase();
//       result = result.filter(b => {
//         const email = (b.email || '').toString().toLowerCase();
//         const movieName = (b.movieName || '').toString().toLowerCase();
//         const seats = (b.seats || '').toString().toLowerCase();
//         return email.includes(term) || movieName.includes(term) || seats.includes(term);
//       });
//     }
    
//     if (filterDate) {
//       result = result.filter(b => b.movieDate === filterDate);
//     }
    
//     if (sortConfig.key) {
//       result.sort((a, b) => {
//         const aValue = a[sortConfig.key] || '';
//         const bValue = b[sortConfig.key] || '';
//         if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
//         if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
//         return 0;
//       });
//     }
    
//     setFilteredBookings(result);
//   };

//   const requestSort = (key) => {
//     let direction = 'asc';
//     if (sortConfig.key === key && sortConfig.direction === 'asc') {
//       direction = 'desc';
//     }
//     setSortConfig({ key, direction });
//   };

//   const handleDelete = async (id) => {
//     setShowDeleteModal(true);
//     setDeleteId(id);
//   };

//   const confirmDelete = async () => {
//     if (deleteId) {
//        console.log("🟢 Frontend: Deleting booking with ID:", deleteId);
//       try {
//         await deleteBooking(deleteId);
//         setBookings(bookings.filter(b => b._id !== deleteId));
//         setShowDeleteModal(false);
//         setDeleteId(null);
//       } catch (err) {
//         console.error("🔴 Frontend: Delete failed", err.response || err.message || err);
//         setError('Failed to delete booking');
//       }
//     }
//   };

//   const cancelDelete = () => {
//     setShowDeleteModal(false);
//     setDeleteId(null);
//   };

//   const handleEdit = (booking) => {
//     setEditId(booking._id);
//     setEditData({ ...booking });
    
//   };

//   const handleEditChange = (e) => {
//     const { name, value } = e.target;
//     setEditData(ed => ({ ...ed, [name]: value }));
//   };

//   const handleEditSave = async () => {
//     try {
//       await updateBooking(editId, editData);
//       setEditId(null);
//       setEditData({});
//       await fetchBookings();
//     } catch (err) {
//       setError('Failed to update booking');
//     }
//   };

//   const handleEditCancel = () => {
//     setEditId(null);
//     setEditData({});
//   };

//   const toggleRowExpansion = (id) => {
//     const newExpanded = new Set(expandedRows);
//     if (newExpanded.has(id)) newExpanded.delete(id);
//     else newExpanded.add(id);
//     setExpandedRows(newExpanded);
//   };

//   // ✅ Correct Total Revenue
//   const totalBookings = bookings.length;
//   const totalRevenue = bookings.reduce((sum, b) => {
//     return sum + (b.totalAmount || (b.seats * (parseInt(b.ticketPrice) || 0)));
//   }, 0);

//   const todayBookings = bookings.filter(b => {
//     const today = new Date().toISOString().split('T')[0];
//     return b.movieDate === today;
//   }).length;

//   const clearFilters = () => {
//     setSearchTerm('');
//     setFilterDate('');
//     setSortConfig({ key: 'bookingTime', direction: 'desc' });
//   };

//   if (isLoading) {
//     return (
//       <>
//         <Navbar search={searchTerm} setSearch={setSearchTerm} filterDate={filterDate} setFilterDate={setFilterDate} />
//         <div className="admin-dashboard">
//           <div className="loading">Loading bookings...</div>
//         </div>
//       </>
//     );
//   }

//   if (error) {
//     return (
//       <>
//         <Navbar search={searchTerm} setSearch={setSearchTerm} filterDate={filterDate} setFilterDate={setFilterDate} />
//         <div className="admin-dashboard">
//           <div className="error">{error}</div>
//           <button onClick={fetchBookings} className="retry-btn">Retry</button>
//         </div>
//       </>
//     );
//   }

//   return (
//     <>
//       <Navbar search={searchTerm} setSearch={setSearchTerm} filterDate={filterDate} setFilterDate={setFilterDate} />

//       {showDeleteModal && (
//         <div className="modal-overlay">
//           <div className="modal-content">
//             <h2>Confirm Deletion</h2>
//             <p>Are you sure you want to delete this booking?</p>
//             <div className="modal-actions">
//               <button className="btn btn-danger" onClick={confirmDelete}>Yes, Delete</button>
//               <button className="btn btn-secondary" onClick={cancelDelete}>Cancel</button>
//             </div>
//           </div>
//         </div>
//       )}
      
//       <div className="admin-dashboard">
//         <div className="dashboard-header">
//           <h2>Admin Dashboard</h2>
//         </div>
        
//         <div className="summary-cards">
//           <div className="summary-card">
//             <h3>Total Bookings</h3>
//             <span className="card-value">{totalBookings}</span>
//           </div>
//           <div className="summary-card">
//             <h3>Total Revenue</h3>
//             <span className="card-value">₹{totalRevenue}</span>
//           </div>
//           <div className="summary-card">
//             <h3>Today's Bookings</h3>
//             <span className="card-value">{todayBookings}</span>
//           </div>
//         </div>
        
//         <div className="table-container">
//           <table className="bookings-table">
//             <thead>
//               <tr>
//                 <th></th>
//                 <th onClick={() => requestSort('email')}>Email</th>
//                 <th onClick={() => requestSort('movieName')}>Movie</th>
//                 <th onClick={() => requestSort('seats')}>Seats</th>
//                 <th onClick={() => requestSort('bookingTime')}>Booking Time</th>
//                 <th onClick={() => requestSort('movieDate')}>Movie Date</th>
//                 <th onClick={() => requestSort('ticketPrice')}>Price</th>
//                 {/* ✅ New Total Amount column */}
//                 <th onClick={() => requestSort('totalAmount')}>Total Amount</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             {/* <tbody>
//               {filteredBookings.length === 0 ? (
//                 <tr>
//                   <td colSpan="9" className="no-data">No bookings found</td>
//                 </tr>
//               ) : (
//                 filteredBookings.map(booking => (
//                   <React.Fragment key={booking._id}>
//                     <tr className={expandedRows.has(booking._id) ? 'expanded' : ''}>
//                       <td>
//                         <button className="expand-btn" onClick={() => toggleRowExpansion(booking._id)}>
//                           {expandedRows.has(booking._id) ? <FaMinus /> : <FaPlus />}
//                         </button>
//                       </td>
//                       <td>{booking.email}</td>
//                       <td>{booking.movieName || '-'}</td>
//                       <td>{booking.seats}</td>
//                       <td>{booking.bookingTime ? new Date(booking.bookingTime).toLocaleString() : '-'}</td>
//                       <td>{booking.movieDate || '-'}</td>
//                       <td>{booking.ticketPrice ? `₹${booking.ticketPrice}` : '-'}</td>
//                       <td>{booking.totalAmount ? `₹${booking.totalAmount}` : '-'}</td>
//                       <td>
//                         <div className="action-buttons">
//                           <button className="btn btn-primary btn-icon" onClick={() => handleEdit(booking)}>
//                             <FaEdit />
//                           </button>
//                           <button className="btn btn-danger btn-icon" onClick={() => handleDelete(booking._id)}>
//                             <FaTrash />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                     {expandedRows.has(booking._id) && (
//                       <tr className="details-row">
//                         <td colSpan="9">
//                           <div className="booking-details">
//                             <h4>Booking Details</h4>
//                             <div className="details-grid">
//                               <div className="detail-item">
//                                 <span className="detail-label">Booking ID:</span>
//                                 <span className="detail-value">{booking._id}</span>
//                               </div>
//                               <div className="detail-item">
//                                 <span className="detail-label">Total Amount:</span>
//                                 <span className="detail-value">₹{booking.totalAmount}</span>
//                               </div>
//                             </div>
//                           </div>
//                         </td>
//                       </tr>
//                     )}
//                   </React.Fragment>
//                 ))
//               )}
//             </tbody> */}
//             <tbody>
//   {filteredBookings.length === 0 ? (
//     <tr>
//       <td colSpan="9" className="no-data">No bookings found</td>
//     </tr>
//   ) : (
//     filteredBookings.map(booking => (
//       <React.Fragment key={booking._id}>
//         <tr className={expandedRows.has(booking._id) ? 'expanded' : ''}>
//           <td>
//             <button className="expand-btn" onClick={() => toggleRowExpansion(booking._id)}>
//               {expandedRows.has(booking._id) ? <FaMinus /> : <FaPlus />}
//             </button>
//           </td>

//           {/* Email column (not editable) */}
//           <td>{booking.email}</td>

//           {/* Movie Name column (editable) */}
//           <td>
//             {editId === booking._id ? (
//               <input
//                 type="text"
//                 name="movieName"
//                 value={editData.movieName}
//                 onChange={handleEditChange}
//               />
//             ) : (
//               booking.movieName || '-'
//             )}
//           </td>

//           {/* Seats column (editable) */}
//           <td>
//             {editId === booking._id ? (
//               <input
//                 type="number"
//                 name="seats"
//                 value={editData.seats}
//                 onChange={handleEditChange}
//               />
//             ) : (
//               booking.seats
//             )}
//           </td>

//           {/* Booking Time (not editable) */}
//           <td>{booking.bookingTime ? new Date(booking.bookingTime).toLocaleString() : '-'}</td>

//           {/* Movie Date (editable) */}
//           <td>
//             {editId === booking._id ? (
//               <input
//                 type="date"
//                 name="movieDate"
//                 value={editData.movieDate}
//                 onChange={handleEditChange}
//               />
//             ) : (
//               booking.movieDate || '-'
//             )}
//           </td>

//           {/* Ticket Price (editable) */}
//           <td>
//             {editId === booking._id ? (
//               <input
//                 type="number"
//                 name="ticketPrice"
//                 value={editData.ticketPrice}
//                 onChange={handleEditChange}
//               />
//             ) : (
//               booking.ticketPrice ? `₹${booking.ticketPrice}` : '-'
//             )}
//           </td>

//           {/* Total Amount (auto-calculated) */}
//           <td>
//             ₹
//             {editId === booking._id
//               ? (editData.seats || 0) * (parseInt(editData.ticketPrice) || 0)
//               : booking.totalAmount || '-'}
//           </td>

//           {/* Action Buttons */}
//           <td>
//             <div className="action-buttons">
//               {editId === booking._id ? (
//                 <>
//                   <button className="btn btn-success btn-icon" onClick={handleEditSave}>
//                     <FaSave />
//                   </button>
//                   <button className="btn btn-secondary btn-icon" onClick={handleEditCancel}>
//                     <FaTimes />
//                   </button>
//                 </>
//               ) : (
//                 <>
//                   <button className="btn btn-primary btn-icon" onClick={() => handleEdit(booking)}>
//                     <FaEdit />
//                   </button>
//                   <button className="btn btn-danger btn-icon" onClick={() => handleDelete(booking._id)}>
//                     <FaTrash />
//                   </button>
//                 </>
//               )}
//             </div>
//           </td>
//         </tr>

//         {/* Expanded row details */}
//         {expandedRows.has(booking._id) && (
//           <tr className="details-row">
//             <td colSpan="9">
//               <div className="booking-details">
//                 <h4>Booking Details</h4>
//                 <div className="details-grid">
//                   <div className="detail-item">
//                     <span className="detail-label">Booking ID:</span>
//                     <span className="detail-value">{booking._id}</span>
//                   </div>
//                   <div className="detail-item">
//                     <span className="detail-label">Total Amount:</span>
//                     <span className="detail-value">₹{booking.totalAmount}</span>
//                   </div>
//                 </div>
//               </div>
//             </td>
//           </tr>
//         )}
//       </React.Fragment>
//     ))
//   )}
// </tbody>

//           </table>
//         </div>
//       </div>
//     </>
//   );
// };

// export default AdminDashboard;


import React, { useEffect, useState } from 'react';
import axios from "axios";
import { FaEdit, FaTrash, FaSave, FaTimes, FaSearch, FaFilter, FaSort, FaPlus, FaMinus } from 'react-icons/fa';
import { getBookings } from '../services/bookingService';
import Navbar from '../components/Navbar';
import { deleteBooking, updateBooking } from '../services/adminService';

const AdminDashboard = () => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'bookingTime', direction: 'desc' });
  const [filterDate, setFilterDate] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedRows, setExpandedRows] = useState(new Set());
  
  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    filterAndSortBookings();
  }, [bookings, searchTerm, sortConfig, filterDate]);

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get("http://localhost:5000/api/bookings");
      //  console.log("Fetched bookings:", res.data);
        console.log("Bookings from API:", res.data); 
      setBookings(res.data);
      const data = res.data;



      
      const sorted = [...data].sort((a, b) => {
        
        const timeA = a.bookingTime ? new Date(a.bookingTime).getTime() : 0;
        const timeB = b.bookingTime ? new Date(b.bookingTime).getTime() : 0;
        return timeB - timeA;
      });
      
      setBookings(sorted);
      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching bookings:", err.response || err.message || err);
      setError("Failed to fetch bookings");
      setIsLoading(false);
    }
  };

  const filterAndSortBookings = () => {
    let result = [...bookings];
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(b => {
        const email = (b.email || '').toString().toLowerCase();
        const movieName = (b.movieName || '').toString().toLowerCase();
        const seats = (b.seats || '').toString().toLowerCase();
        return email.includes(term) || movieName.includes(term) || seats.includes(term);
      });
    }
    
    if (filterDate) {
      result = result.filter(b => b.movieDate === filterDate);
    }
    
    if (sortConfig.key) {
      result.sort((a, b) => {
        let aValue = a[sortConfig.key] || '';
        let bValue = b[sortConfig.key] || '';
        
        // Handle numeric values for proper sorting
        if (sortConfig.key === 'seats' || sortConfig.key === 'ticketPrice' || sortConfig.key === 'totalAmount') {
          aValue = parseFloat(aValue) || 0;
          bValue = parseFloat(bValue) || 0;
        }
        
        // Handle date values for proper sorting
        if (sortConfig.key === 'bookingTime') {
          aValue = aValue ? new Date(aValue).getTime() : 0;
          bValue = bValue ? new Date(bValue).getTime() : 0;
        }
        
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    
    setFilteredBookings(result);
  };

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleDelete = async (id) => {
    setShowDeleteModal(true);
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    if (deleteId) {
      console.log("Frontend: Deleting booking with ID:", deleteId);
      try {
        await deleteBooking(deleteId);
        setBookings(bookings.filter(b => b._id !== deleteId));
        setShowDeleteModal(false);
        setDeleteId(null);
      } catch (err) {
        console.error(" Frontend: Delete failed", err.response || err.message || err);
        setError('Failed to delete booking');
      }
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteId(null);
  };

  const handleEdit = (booking) => {
    setEditId(booking._id);
    setEditData({ ...booking });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData(ed => ({ ...ed, [name]: value }));
  };

  const handleEditSave = async () => {
    try {
      // Calculate total amount before saving
      const updatedData = {
        ...editData,
        totalAmount: (parseInt(editData.seats) || 0) * (parseInt(editData.ticketPrice) || 0)
      };
      
      await updateBooking(editId, updatedData);
      setEditId(null);
      setEditData({});
      await fetchBookings(); // Refresh data
    } catch (err) {
      console.error("Update failed:", err);
      setError('Failed to update booking');
    }
  };

  const handleEditCancel = () => {
    setEditId(null);
    setEditData({});
  };

  const toggleRowExpansion = (id) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) newExpanded.delete(id);
    else newExpanded.add(id);
    setExpandedRows(newExpanded);
  };

  // Calculate statistics
  const totalBookings = bookings.length;
  const totalRevenue = bookings.reduce((sum, b) => {
    return sum + (b.totalAmount || (parseInt(b.seats) || 0) * (parseInt(b.ticketPrice) || 0));
  }, 0);

  const todayBookings = bookings.filter(b => {
    const today = new Date().toISOString().split('T')[0];
    return b.movieDate === today;
  }).length;

  const clearFilters = () => {
    setSearchTerm('');
    setFilterDate('');
    setSortConfig({ key: 'bookingTime', direction: 'desc' });
  };

  if (isLoading) {
    return (
      <>
        <Navbar search={searchTerm} setSearch={setSearchTerm} filterDate={filterDate} setFilterDate={setFilterDate} />
        <div className="admin-dashboard">
          <div className="loading">Loading bookings...</div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar search={searchTerm} setSearch={setSearchTerm} filterDate={filterDate} setFilterDate={setFilterDate} />
        <div className="admin-dashboard">
          <div className="error">{error}</div>
          <button onClick={fetchBookings} className="retry-btn">Retry</button>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar search={searchTerm} setSearch={setSearchTerm} filterDate={filterDate} setFilterDate={setFilterDate} />

      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Confirm Deletion</h2>
            <p>Are you sure you want to delete this booking?</p>
            <div className="modal-actions">
              <button className="btn btn-danger" onClick={confirmDelete}>Yes, Delete</button>
              <button className="btn btn-secondary" onClick={cancelDelete}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      
      <div className="admin-dashboard">
        <div className="dashboard-header">
          <h2>Admin Dashboard</h2>
          {/* <button onClick={clearFilters} className="btn btn-secondary">
            Clear Filters
          </button> */}
        </div>
        
        
        <div className="summary-cards">
           <div className="summary-card">
             <div className="card-icon bookings"></div>
             <div className="card-content">
               <h3>Total Bookings</h3>
               <span className="card-value">{totalBookings}</span>
             </div>
           </div>
           <div className="summary-card">
             <div className="card-icon revenue"></div>
             <div className="card-content">
               <h3>Total Revenue</h3>
               <span className="card-value">₹{totalRevenue}</span>
             </div>
          </div>
          <div className="summary-card">
             <div className="card-icon today"></div>
             <div className="card-content">
               <h3>Today's Bookings</h3>
               <span className="card-value">{todayBookings}</span>
             </div>
           </div>
         </div>
        
        <div className="table-container">
          <table className="bookings-table">
            <thead>
              <tr>
                <th></th>
                <th onClick={() => requestSort('email')}>
                  Email {sortConfig.key === 'email' && (
                    <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                  )}
                </th>
                <th onClick={() => requestSort('movieName')}>
                  Movie {sortConfig.key === 'movieName' && (
                    <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                  )}
                </th>
                <th onClick={() => requestSort('seats')}>
                  Seats {sortConfig.key === 'seats' && (
                    <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                  )}
                </th>
                <th onClick={() => requestSort('bookingTime')}>
                  Booking Time {sortConfig.key === 'bookingTime' && (
                    <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                  )}
                </th>
                <th onClick={() => requestSort('movieDate')}>
                  Movie Date {sortConfig.key === 'movieDate' && (
                    <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                  )}
                </th>
                

                <th onClick={() => requestSort('ticketPrice')}>
                  Price {sortConfig.key === 'ticketPrice' && (
                    <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                  )}
                </th>
                <th onClick={() => requestSort('totalAmount')}>
                  Total Amount {sortConfig.key === 'totalAmount' && (
                    <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                  )}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan="9" className="no-data">No bookings found</td>
                </tr>
              ) : (
                filteredBookings.map(booking => (
                  <React.Fragment key={booking._id}>
                    <tr className={expandedRows.has(booking._id) ? 'expanded' : ''}>
                      <td>
                        <button className="expand-btn" onClick={() => toggleRowExpansion(booking._id)}>
                          {expandedRows.has(booking._id) ? <FaMinus /> : <FaPlus />}
                        </button>
                      </td>

                      {/* Email column (not editable) */}
                      {/* <td>{booking.email}</td> */}
                      <td>{booking.email || booking.userEmail}</td>


                      {/* Movie Name column (editable) */}
                      <td>
                        {editId === booking._id ? (
                          <input
                            type="text"
                            name="movieName"
                            value={editData.movieName || ''}
                            onChange={handleEditChange}
                          />
                        ) : (
                          booking.movieName || '-'
                        )}
                      </td>

                      {/* Seats column (editable) */}
                      <td>
                        {editId === booking._id ? (
                          <input
                            type="number"
                            name="seats"
                            value={editData.seats || ''}
                            onChange={handleEditChange}
                            min="1"
                          />
                        ) : (
                          booking.seats
                        )}
                      </td>

                      
                      <td>{booking.bookingTime ? new Date(booking.bookingTime).toLocaleString() : '-'}</td>

                      {/* Movie Date (editable) */}
                      <td>
                        {editId === booking._id ? (
                          <input
                            type="date"
                            name="movieDate"
                            value={editData.movieDate || ''}
                            onChange={handleEditChange}
                          />
                        ) : (
                          booking.movieDate || '-'
                        )}
                      </td>
                      


                      {/* Ticket Price (editable) */}
                      <td>
                        {editId === booking._id ? (
                          <input
                            type="number"
                            name="ticketPrice"
                            value={editData.ticketPrice || ''}
                            onChange={handleEditChange}
                            min="0"
                          />
                        ) : (
                          booking.ticketPrice ? `₹${booking.ticketPrice}` : '-'
                        )}
                      </td>

                      {/* Total Amount (auto-calculated) */}
                      <td>
                        {editId === booking._id ? (
                          `₹${(parseInt(editData.seats) || 0) * (parseInt(editData.ticketPrice) || 0)}`
                        ) : (
                          booking.totalAmount ? `₹${booking.totalAmount}` : '-'
                        )}
                      </td>

                      {/* Action Buttons */}
                      <td>
                        <div className="action-buttons">
                          {editId === booking._id ? (
                            <>
                              <button className="btn btn-success btn-icon" onClick={handleEditSave}>
                                <FaSave />
                              </button>
                              <button className="btn btn-secondary btn-icon" onClick={handleEditCancel}>
                                <FaTimes />
                              </button>
                            </>
                          ) : (
                            <>
                              <button className="btn btn-primary btn-icon" onClick={() => handleEdit(booking)}>
                                <FaEdit />
                              </button>
                              <button className="btn btn-danger btn-icon" onClick={() => handleDelete(booking._id)}>
                                <FaTrash />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>

                    {/* Expanded row details */}
                    {expandedRows.has(booking._id) && (
                      <tr className="details-row">
                        <td colSpan="9">
                          <div className="booking-details">
                            <h4>Booking Details</h4>
                            <div className="details-grid">
                              <div className="detail-item">
                                <span className="detail-label">Booking ID:</span>
                                <span className="detail-value">{booking._id}</span>
                              </div>
                              <div className="detail-item">
                                <span className="detail-label">Email:</span>
                                <span className="detail-value">{booking.email}</span>
                              </div>
                              <div className="detail-item">
                                <span className="detail-label">Movie:</span>
                                <span className="detail-value">{booking.movieName || '-'}</span>
                              </div>
                              
                              <div className="detail-item">
                                <span className="detail-label">Seats:</span>
                                <span className="detail-value">{booking.seats}</span>
                              </div>
                              <div className="detail-item">
                                <span className="detail-label">Total Amount:</span>
                                <span className="detail-value">₹{booking.totalAmount || (parseInt(booking.seats) || 0) * (parseInt(booking.ticketPrice) || 0)}</span>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;