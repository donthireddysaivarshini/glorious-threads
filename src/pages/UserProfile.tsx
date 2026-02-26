import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom"; 
import { 
  Package, MapPin, LogOut, ArrowLeft, Loader2, ChevronDown, 
  ChevronLeft, ChevronRight, Truck, CheckCircle, Clock, AlertCircle, 
  Trash2, Star, Plus, Pencil
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
  image?: string; // ✅ Added image field
}

interface Order {
  id: number;
  total_amount: string;
  payment_status: string;
  order_status: string;
  created_at: string;
  shipping_address: string;
  phone: string;
  items: OrderItem[];
  razorpay_order_id?: string;
}

interface SavedAddress {
  id: number;
  label: string;
  address: string;
  apartment?: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  phone: string;
  is_default: boolean;
  first_name?: string;
  last_name?: string;
}

const UserProfile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'orders' | 'addresses'>('orders');
  const [userProfile, setUserProfile] = useState<any>(null);
  
  // --- ORDER STATE ---
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // --- ADDRESS STATE ---
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [submittingAddress, setSubmittingAddress] = useState(false);
  
  const [addressForm, setAddressForm] = useState({
    label: 'Home', first_name: '', last_name: '', address: '', apartment: '',
    city: '', state: 'Telangana', zip_code: '', country: 'India', phone: '', is_default: false,
  });

  // --- AUTH & INITIAL DATA ---
  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (!token) {
      navigate("/login");
      return;
    }

    const loadInitialData = async () => {
        try {
            const profile = await authService.getProfile();
            setUserProfile(profile);
            if (profile.is_staff || profile.is_superuser) setIsAdmin(true);
            
            // Initial load for orders
            fetchOrders();
        } catch (err) {
            console.error("Profile load failed", err);
        }
    };
    loadInitialData();
  }, [navigate]);

  // Load data when tab changes
  useEffect(() => {
    if (activeTab === 'orders') fetchOrders();
    if (activeTab === 'addresses') fetchAddresses();
  }, [activeTab]);

  const fetchOrders = async () => {
    try {
      setLoadingOrders(true);
      const data = await orderService.getUserOrders();
      const ordersList = Array.isArray(data) ? data : data.results || [];
      setAllOrders(ordersList);
    } catch (error) {
      setAllOrders([]);
    } finally {
      setLoadingOrders(false);
    }
  };

  const fetchAddresses = async () => {
    setLoadingAddresses(true);
    try {
      const data = await authService.getSavedAddresses();
      setAddresses(Array.isArray(data) ? data : data.results || []);
    } catch (err) {
      setAddresses([]);
    } finally {
      setLoadingAddresses(false);
    }
  };

  const handleUpdateStatus = async (orderId: number, newStatus: string) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      toast.success(`Status updated to ${newStatus}`);
      fetchOrders(); // Refresh to show changes
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingAddress(true);
    try {
      await authService.saveAddress(addressForm);
      toast.success("Address saved");
      setShowAddForm(false);
      fetchAddresses();
    } catch (err) {
      toast.error("Could not save address");
    } finally {
      setSubmittingAddress(false);
    }
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

  if (loadingOrders && !allOrders.length) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-[#FFF8F8]/40 pt-32 pb-20">
      <Header />
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Sidebar */}
          <aside className="w-full lg:w-72 space-y-4">
            <div className="bg-white p-6 rounded-3xl border border-pink-100 shadow-sm">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center font-bold">
                        {userProfile?.email?.[0].toUpperCase()}
                    </div>
                    <div className="overflow-hidden">
                        <p className="font-bold truncate text-sm">{userProfile?.email}</p>
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest">Premium Member</p>
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

          {/* Main Content */}
          <main className="flex-1 bg-white rounded-[2.5rem] p-8 border border-pink-100 shadow-sm min-h-[600px]">
            {activeTab === 'orders' ? (
              <div className="space-y-6">
                <h2 className="text-xl font-bold uppercase tracking-tight border-b pb-4">Order History</h2>
                {allOrders.length === 0 ? (
                  <div className="text-center py-20">
                    <Package size={48} className="mx-auto text-pink-100 mb-4" />
                    <p className="text-gray-400 text-sm">No orders found.</p>
                    <Link to="/"><Button className="mt-4 bg-black text-white rounded-full text-[10px] uppercase font-bold">Shop Now</Button></Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {allOrders.map((order) => (
                      <div key={order.id} className="border border-pink-50 rounded-2xl overflow-hidden hover:shadow-md transition-all">
                        <div className="bg-gray-50/50 p-5 flex flex-wrap justify-between items-center gap-4">
                          <div className="flex gap-6">
                            <div>
                              <p className="text-[9px] font-bold text-gray-400 uppercase">Order ID</p>
                              <p className="text-xs font-bold">#{order.razorpay_order_id?.slice(-8) || order.id}</p>
                            </div>
                            <div>
                              <p className="text-[9px] font-bold text-gray-400 uppercase">Total</p>
                              <p className="text-xs font-bold">₹{order.total_amount}</p>
                            </div>
                          </div>
                          <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${getStatusConfig(order.order_status).color}`}>
                            {getStatusConfig(order.order_status).icon}
                            <span className="text-[10px] font-bold uppercase">{order.order_status}</span>
                          </div>
                        </div>

                        <div className="p-5 space-y-4">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex gap-4 items-center">
                              {/* ✅ Dynamic Product Image */}
                              <div className="w-16 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-pink-50">
                                {item.image ? (
                                    <img src={item.image} className="w-full h-full object-cover" alt={item.product_name} />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-300">GTD</div>
                                )}
                              </div>
                              <div className="flex-1">
                                {/* ✅ Link to Product Detail */}
                                <Link to={`/api/store/products/${item.product_slug}/`} className="text-sm font-bold hover:text-pink-500 transition-colors">
                                  {item.product_name}
                                </Link>
                                <p className="text-[10px] text-gray-400">{item.variant_label}</p>
                                <p className="text-[10px] font-bold">Qty: {item.quantity}</p>
                              </div>
                              <p className="font-bold text-sm">₹{item.price}</p>
                            </div>
                          ))}
                        </div>

                        {isAdmin && (
                            <div className="bg-pink-50/20 p-4 border-t border-pink-50 flex items-center justify-between">
                                <span className="text-[10px] font-bold uppercase text-gray-400">Admin Controls:</span>
                                <select 
                                    className="text-[10px] font-bold uppercase border-pink-100 rounded-lg p-1 outline-none"
                                    value={order.order_status}
                                    onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                                >
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
                )}
              </div>
            ) : (
              <div className="space-y-6">
                 <div className="flex justify-between items-center border-b pb-4">
                  <h2 className="text-xl font-bold uppercase tracking-tight">Addresses</h2>
                  {!showAddForm && addresses.length < 3 && (
                    <Button onClick={() => setShowAddForm(true)} className="bg-black text-white text-[10px] font-bold uppercase h-8 rounded-full">
                      <Plus size={14} className="mr-1" /> Add New
                    </Button>
                  )}
                </div>

                {showAddForm ? (
                   <form onSubmit={handleSaveAddress} className="grid gap-4 md:grid-cols-2 bg-gray-50 p-6 rounded-2xl animate-in fade-in zoom-in-95">
                      <input placeholder="Label (e.g. Home)" className="p-3 bg-white border rounded-xl text-sm" value={addressForm.label} onChange={e=>setAddressForm({...addressForm, label:e.target.value})} required />
                      <input placeholder="Phone" className="p-3 bg-white border rounded-xl text-sm" value={addressForm.phone} onChange={e=>setAddressForm({...addressForm, phone:e.target.value})} required />
                      <input placeholder="Address" className="p-3 bg-white border rounded-xl text-sm md:col-span-2" value={addressForm.address} onChange={e=>setAddressForm({...addressForm, address:e.target.value})} required />
                      <div className="flex gap-2">
                        <Button type="submit" disabled={submittingAddress} className="bg-black text-white px-6 rounded-full text-[10px] font-bold">Save</Button>
                        <Button type="button" onClick={()=>setShowAddForm(false)} variant="ghost" className="text-[10px] font-bold">Cancel</Button>
                      </div>
                   </form>
                ) : (
                  <div className="grid gap-4">
                    {addresses.map(addr => (
                      <div key={addr.id} className={`p-6 rounded-2xl border flex justify-between items-center ${addr.is_default ? 'border-black bg-gray-50' : 'border-pink-50'}`}>
                        <div>
                          <p className="font-bold text-[10px] uppercase text-gray-400 mb-1">{addr.label}</p>
                          <p className="text-sm font-bold">{addr.address}</p>
                          <p className="text-xs text-gray-500">{addr.city}, {addr.state}</p>
                        </div>
                        {addr.is_default && <span className="bg-black text-white text-[8px] px-2 py-1 rounded-full uppercase font-bold">Default</span>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UserProfile;