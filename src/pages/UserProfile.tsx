import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom"; 
import { 
  Package, MapPin, LogOut, Loader2, ChevronRight, 
  Truck, CheckCircle, Clock, X, Info, Download, ChevronLeft, Plus, Pencil, Trash2
} from "lucide-react";
import { toast } from "sonner";
import { orderService, authService } from "@/services/api";
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';

// --- INTERFACES ---
interface OrderItem {
  id: number;
  product_id: number;
  product_slug: string; 
  product_name: string;
  variant_label: string;
  price: string;
  quantity: number;
  image?: string; 
  is_watch_buy: boolean;
  // ADDED THIS FIELD TO FIX YOUR ERROR
  color_details?: {
    name: string;
    hex: string;
  };
}

interface Order {
  id: number;
  first_name: string; 
  last_name: string;  
  total_amount: string;
  payment_status: string;
  order_status: string;
  created_at: string;
  shipping_address: string;
  phone: string;
  items: OrderItem[];
  razorpay_order_id?: string;
  landmark?: string;
  city?: string;
  state?: string;
  country?: string;
  zip_code?: string;
  tracking_link?: string;
  tracking_note?: string;
}

interface SavedAddress {
  id: number;
  label: string;
  address: string;
  landmark: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  phone: string;
  is_default: boolean;
  first_name: string;
  last_name: string;
}

const UserProfile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'orders' | 'addresses'>('orders');
  const [userProfile, setUserProfile] = useState<any>(null);
  
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [submittingAddress, setSubmittingAddress] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<number | null>(null);
  
  const initialAddressState = {
    label: 'Home', first_name: '', last_name: '', country: 'India', state: 'Telangana', 
    city: '', address: '', landmark: '', zip_code: '', phone: '', is_default: false,
  };
  const [addressForm, setAddressForm] = useState(initialAddressState);

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (!token) { navigate("/login"); return; }
    const loadInitialData = async () => {
        try {
            const profile = await authService.getProfile();
            setUserProfile(profile);
            if (profile.is_staff || profile.is_superuser) setIsAdmin(true);
            fetchOrders(1);
        } catch (err) { console.error("Profile load failed", err); }
    };
    loadInitialData();
  }, [navigate]);

  useEffect(() => {
    if (activeTab === 'orders') fetchOrders(currentPage);
    if (activeTab === 'addresses') fetchAddresses();
  }, [activeTab, currentPage]);

  const fetchOrders = async (page: number) => {
    try {
      setLoadingOrders(true);
      const data = await orderService.getUserOrders(page);
      setAllOrders(Array.isArray(data) ? data : data.results || []);
      if (data.count) setTotalPages(Math.ceil(data.count / 10)); 
    } catch (error) { setAllOrders([]); }
    finally { setLoadingOrders(false); }
  };

  const fetchAddresses = async () => {
    setLoadingAddresses(true);
    try {
      const data = await authService.getSavedAddresses();
      setAddresses(Array.isArray(data) ? data : data.results || []);
    } catch (err) { setAddresses([]); }
    finally { setLoadingAddresses(false); }
  };

  const handleExportExcel = () => {
    window.location.href = `${import.meta.env.VITE_API_URL.replace('/api', '')}/admin/orders/order/`;
    toast.info("Redirecting to Admin Export Panel");
  };

  const handleUpdateStatus = async (orderId: number, newStatus: string) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      toast.success(`Status updated to ${newStatus}`);
      fetchOrders(currentPage); 
    } catch (err) { toast.error("Failed to update status"); }
  };

  const handleEditAddress = (addr: SavedAddress) => {
    setEditingId(addr.id);
    setAddressForm({ ...addr, landmark: addr.landmark || '' });
    setShowAddForm(true);
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingAddress(true);
    try {
      if (editingId) {
        await authService.saveAddress({ ...addressForm, id: editingId });
        toast.success("Address updated");
      } else {
        await authService.saveAddress(addressForm);
        toast.success("Address saved");
      }
      setShowAddForm(false); setEditingId(null); setAddressForm(initialAddressState); fetchAddresses();
    } catch (err) { toast.error("Action failed"); }
    finally { setSubmittingAddress(false); }
  };

  const confirmDeleteAddress = async () => {
    if (!addressToDelete) return;
    try {
      await authService.deleteAddress(addressToDelete);
      toast.success("Address removed");
      fetchAddresses();
    } catch (err) { toast.error("Could not delete address."); }
    finally { setAddressToDelete(null); }
  };

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    toast.success("Logged out");
    navigate("/login");
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'Delivered': return { icon: <CheckCircle className="w-4 h-4" />, color: 'text-green-600 bg-green-50 border-green-100' };
      case 'Shipped': return { icon: <Truck className="w-4 h-4" />, color: 'text-blue-600 bg-blue-50 border-blue-100' };
      case 'Processing': return { icon: <Clock className="w-4 h-4" />, color: 'text-amber-600 bg-amber-50 border-amber-100' };
      default: return { icon: <Package className="w-4 h-4" />, color: 'text-gray-600 bg-gray-50 border-gray-100' };
    }
  };
  // UserProfile.tsx

const formatToIST = (dateString: string) => {
  return new Date(dateString).toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

  return (
    <div className="flex flex-col min-h-screen bg-white"> 
    <Header />
      <div className="container mx-auto px-4 max-w-6xl pt-40 pb-14">
        <div className="flex flex-col lg:flex-row gap-10">
          <aside className="w-full lg:w-72 space-y-4">
            <div className="bg-white p-6 rounded-3xl border border-pink-100 shadow-sm text-left">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center font-bold">
                        {userProfile?.email?.[0].toUpperCase()}
                    </div>
                    <div className="overflow-hidden">
                        <p className="font-bold truncate text-sm">{userProfile?.email}</p>
                    </div>
                </div>
                <nav className="space-y-2">
                    <button onClick={() => setActiveTab('orders')} className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-[11px] font-bold uppercase transition-all ${activeTab === 'orders' ? 'bg-black text-white' : 'hover:bg-pink-50 text-gray-600'}`}>
                        <span className="flex items-center gap-2"><Package size={16} /> My Orders</span>
                        <ChevronRight size={14} />
                    </button>
                    <button onClick={() => setActiveTab('addresses')} className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-[11px] font-bold uppercase transition-all ${activeTab === 'addresses' ? 'bg-black text-white' : 'hover:bg-pink-50 text-gray-600'}`}>
                        <span className="flex items-center gap-2"><MapPin size={16} /> Addresses</span>
                        <ChevronRight size={14} />
                    </button>
                    <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-3 text-[11px] font-bold uppercase text-red-500 hover:bg-red-50 rounded-xl transition-all mt-4">
                        <LogOut size={16} /> Logout
                    </button>
                </nav>
            </div>
          </aside>

          <main className="flex-1 bg-white rounded-[2.5rem] p-8 border border-pink-100 shadow-sm min-h-[600px]">
            {activeTab === 'orders' ? (
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b pb-4">
                  <h2 className="text-xl font-bold uppercase tracking-tight text-left">Order History</h2>
                  {isAdmin && (
                    <Button onClick={handleExportExcel} variant="outline" className="h-8 border-zinc-200 text-[10px] font-bold uppercase rounded-full">
                      <Download size={14} className="mr-2" /> Export Excel
                    </Button>
                  )}
                </div>

                {loadingOrders && !allOrders.length ? (
                  <div className="flex justify-center py-20"><Loader2 className="animate-spin" /></div>
                ) : allOrders.length === 0 ? (
                  <div className="text-center py-20">
                    <Package size={48} className="mx-auto text-pink-100 mb-4" />
                    <p className="text-gray-400 text-sm">No orders found.</p>
                    <Link to="/"><Button className="mt-4 bg-black text-white rounded-full text-[10px] uppercase font-bold">Shop Now</Button></Link>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4">
                      {allOrders.map((order, index) => (
                        <div key={order.id} className="border border-pink-50 rounded-2xl overflow-hidden hover:shadow-md transition-all">
                          <div className="bg-gray-50/50 p-5 flex flex-wrap justify-between items-center gap-4">
                            <div className="flex gap-6 text-left">
                              {/* Inside the map loop for orders */}
<div>
  <p className="text-[9px] font-bold text-gray-400 uppercase">Order ID & Date</p>
  <p className="text-xs font-bold">#{order.id}</p>
  <p className="text-[10px] text-zinc-500">{formatToIST(order.created_at)}</p>
</div>
                              <div><p className="text-[9px] font-bold text-gray-400 uppercase">Total</p><p className="text-xs font-bold">₹{order.total_amount}</p></div>
                              <div><p className="text-[9px] font-bold text-gray-400 uppercase">Payment</p><p className={`text-[10px] font-black uppercase ${order.payment_status === 'Paid' ? 'text-green-600' : 'text-red-500'}`}>{order.payment_status}</p></div>
                            </div>
                            <div className="flex flex-col items-start gap-2">
    <div className="flex items-center gap-2">
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${getStatusConfig(order.order_status).color}`}>
            {getStatusConfig(order.order_status).icon}
            <span className="text-[10px] font-bold uppercase">{order.order_status}</span>
        </div>
        {order.tracking_link && order.order_status !== 'Cancelled' && (
            <a href={order.tracking_link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 px-3 py-1 rounded-full bg-blue-600 text-white text-[10px] font-bold uppercase hover:bg-blue-700">
                <Truck size={12} /> Track
            </a>
        )}
    </div>
    
    {/* NEW: TRACKING NOTE DISPLAY */}
    {order.tracking_note && order.order_status !== 'Cancelled' && (
        <div className="mt-1 bg-zinc-100 p-2 rounded-lg border border-zinc-200 max-w-[200px] text-left">
            <p className="text-[9px] font-bold text-zinc-400 uppercase leading-tight">Tracking Note</p>
            <p className="text-[10px] font-medium text-zinc-700 break-words">{order.tracking_note}</p>
        </div>
    )}
</div>
                          </div>

                          <div className="p-5 space-y-4 text-left">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex gap-4 items-center">
                                <div className="w-16 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-pink-50">
                                  <img 
                                    src={item.image || '/placeholder.png'} 
                                    className="w-full h-full object-cover" 
                                    alt={item.product_name} 
                                  />
                                </div>
                                <div className="flex-1">
                                  <Link 
                                    to={item.product_slug ? (item.is_watch_buy ? `/watch-and-buy/${item.product_slug}` : `/product/${item.product_slug}`) : '#'} 
                                    className="text-sm font-bold hover:text-pink-500 transition-colors uppercase"
                                  >
                                    {item.product_name}
                                  </Link>
                                  
                                  {/* UPDATED UI FOR VARIANT LABEL + COLOR CIRCLE */}
                                  <div className="flex items-center gap-2 mt-0.5">
                                      {item.color_details && (
                                          <div 
                                              className="w-2.5 h-2.5 rounded-full border border-zinc-200" 
                                              style={{ backgroundColor: item.color_details.hex }}
                                          />
                                      )}
                                      <p className="text-[10px] text-gray-400">{item.variant_label}</p>
                                  </div>
                                  
                                  <p className="text-[10px] font-bold uppercase">Qty: {item.quantity}</p>
                                </div>
                                <p className="font-bold text-sm">₹{item.price}</p>
                              </div>
                            ))}
                          </div>

                          <div className="px-5 pb-5 text-left">
                            <button onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)} className="text-[10px] font-black uppercase text-zinc-400 flex items-center gap-1 hover:text-black transition-colors">
                              {expandedOrderId === order.id ? <X size={12}/> : <Info size={12}/>} 
                              {expandedOrderId === order.id ? "Hide Details" : "View Shipping Address"}
                            </button>
                            {expandedOrderId === order.id && (
                              <div className="mt-3 p-4 bg-zinc-50 rounded-xl border border-zinc-100 animate-in slide-in-from-top-2">
                                  <p className="text-[10px] font-black uppercase text-zinc-400 mb-1">Shipping To:</p>
                                  <p className="text-xs font-black uppercase text-black">{order.first_name} {order.last_name}</p>
                                  <p className="text-xs font-bold uppercase mt-1">{order.shipping_address}</p>
                                  <p className="text-[10px] text-zinc-500">{order.landmark && `${order.landmark}, `}{order.city}, {order.state}, {order.country} - {order.zip_code}</p>
                                  <p className="text-[10px] font-bold mt-2 uppercase">Contact: {order.phone}</p>
                              </div>
                            )}
                          </div>

                          {isAdmin && (
                              <div className="bg-pink-50/20 p-4 border-t border-pink-50 flex items-center justify-between">
                                  <span className="text-[10px] font-bold uppercase text-gray-400">Admin Controls:</span>
                                  <select className="text-[10px] font-bold uppercase border-pink-100 rounded-lg p-1 outline-none" value={order.order_status} onChange={(e) => handleUpdateStatus(order.id, e.target.value)}>
                                      <option value="Processing">Processing</option>
                                      <option value="Shipped">Shipped</option>
                                      <option value="Delivered">Delivered</option>
                                      <option value="Cancelled">Cancelled</option>
                                  </select>
                              </div>
                          )}
                        </div>
                      ))}
                    </div>
                    {totalPages > 1 && (
                      <div className="flex justify-center items-center gap-4 mt-10">
                        <Button variant="outline" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="rounded-full h-10 w-10 p-0"><ChevronLeft size={18} /></Button>
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Page {currentPage} of {totalPages}</span>
                        <Button variant="outline" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="rounded-full h-10 w-10 p-0"><ChevronRight size={18} /></Button>
                      </div>
                    )}
                  </>
                )}
              </div>
            ) : (
              <div className="space-y-6 text-left">
                 <div className="flex justify-between items-center border-b pb-4">
                  <h2 className="text-xl font-bold uppercase tracking-tight">Saved Addresses</h2>
                  {!showAddForm && addresses.length < 3 && (
                    <Button onClick={() => { setEditingId(null); setAddressForm(initialAddressState); setShowAddForm(true); }} className="bg-black text-white text-[10px] font-bold uppercase h-8 rounded-full">
                      <Plus size={14} className="mr-1" /> Add New
                    </Button>
                  )}
                </div>

                {showAddForm ? (
                    <form onSubmit={handleSaveAddress} className="space-y-4 bg-gray-50 p-6 rounded-2xl">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-1">
                          <label className="text-[9px] font-bold uppercase text-gray-400">Label</label>
                          <input className="w-full p-3 bg-white border rounded-xl text-sm" value={addressForm.label} onChange={e=>setAddressForm({...addressForm, label:e.target.value})} required />
                        </div>
                        <div className="col-span-1">
                          <label className="text-[9px] font-bold uppercase text-gray-400">Phone</label>
                          <input className="w-full p-3 bg-white border rounded-xl text-sm" value={addressForm.phone} onChange={e=>setAddressForm({...addressForm, phone:e.target.value})} required maxLength={10} />
                        </div>
                        <input placeholder="First Name" className="p-3 bg-white border rounded-xl text-sm" value={addressForm.first_name} onChange={e=>setAddressForm({...addressForm, first_name:e.target.value})} required />
                        <input placeholder="Last Name" className="p-3 bg-white border rounded-xl text-sm" value={addressForm.last_name} onChange={e=>setAddressForm({...addressForm, last_name:e.target.value})} required />
                        <input placeholder="Country" className="p-3 bg-white border rounded-xl text-sm col-span-2" value={addressForm.country} onChange={e=>setAddressForm({...addressForm, country:e.target.value})} required />
                        <input placeholder="State" className="p-3 bg-white border rounded-xl text-sm" value={addressForm.state} onChange={e=>setAddressForm({...addressForm, state:e.target.value})} required />
                        <input placeholder="City" className="p-3 bg-white border rounded-xl text-sm" value={addressForm.city} onChange={e=>setAddressForm({...addressForm, city:e.target.value})} required />
                        <input placeholder="Street Address" className="p-3 bg-white border rounded-xl text-sm col-span-2" value={addressForm.address} onChange={e=>setAddressForm({...addressForm, address:e.target.value})} required />
                        <input placeholder="Pincode" className="p-3 bg-white border rounded-xl text-sm" value={addressForm.zip_code} onChange={e=>setAddressForm({...addressForm, zip_code:e.target.value})} required />
                      </div>
                      <div className="flex gap-2 pt-4">
                        <Button type="submit" disabled={submittingAddress} className="bg-black text-white px-6 rounded-full text-[10px] font-bold uppercase">
                          {editingId ? "Update" : "Save"}
                        </Button>
                        <Button type="button" onClick={()=>{setShowAddForm(false); setEditingId(null);}} variant="ghost" className="text-[10px] font-bold uppercase">Cancel</Button>
                      </div>
                    </form>
                ) : (
                  <div className="grid gap-4">
                    {addresses.map(addr => (
                      <div key={addr.id} className={`p-6 rounded-2xl border flex justify-between items-start ${addr.is_default ? 'border-black bg-gray-50' : 'border-pink-50 bg-white'}`}>
                        <div>
                          <p className="font-bold text-[10px] uppercase text-gray-400 mb-2">{addr.label} {addr.is_default && "• Default"}</p>
                          <p className="text-sm font-black uppercase text-zinc-800">{addr.first_name} {addr.last_name}</p>
                          <p className="text-xs text-gray-500 mt-1 uppercase">{addr.address}, {addr.city}, {addr.state} - {addr.zip_code}</p>
                          <p className="text-[10px] font-bold text-gray-400 mt-2">📞 {addr.phone}</p>
                        </div>
                        <div className="flex gap-2">
                           <button onClick={() => handleEditAddress(addr)} className="p-2 hover:bg-zinc-100 rounded-full"><Pencil size={16} className="text-primary" /></button>
                           <button onClick={() => setAddressToDelete(addr.id)} className="p-2 hover:bg-red-50 rounded-full"><Trash2 size={16} className="text-red-400" /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      {addressToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-2xl border border-pink-100">
            <h3 className="text-lg font-bold text-center uppercase">Delete Address?</h3>
            <div className="flex gap-3 mt-8">
              <Button variant="outline" onClick={() => setAddressToDelete(null)} className="flex-1 rounded-full uppercase text-[10px] font-bold">Cancel</Button>
              <Button onClick={confirmDeleteAddress} className="flex-1 bg-red-500 text-white rounded-full uppercase text-[10px] font-bold">Delete</Button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default UserProfile;