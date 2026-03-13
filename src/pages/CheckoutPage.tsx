import { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronDown, Loader2, MapPin, Ticket, Truck, ShieldCheck, CheckSquare, Square, CreditCard, Plus } from 'lucide-react';
import { toast } from 'sonner';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/context/CartContext';
import { orderService, authService, storeService } from '@/services/api';

const formatPrice = (price: number) => `₹${Number(price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

const loadRazorpay = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const CheckoutPage = () => {
  const { cartItems, subtotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [isProcessing, setIsProcessing] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [saveAsDefault, setSaveAsDefault] = useState(false);
  
  const [config, setConfig] = useState({
    shipping_fee: 100,
    free_shipping_threshold: 2000,
  });

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);

  const [address, setAddress] = useState({
    firstName: '', 
    lastName: '', 
    country: '',
    state: '',
    city: '', 
    street: '', 
    landmark: '',
    pincode: '', 
    phone: ''
  });

  const [hasAttemptedPay, setHasAttemptedPay] = useState(false);
  // Track which specific fields have validation errors
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const init = async () => {
      try {
        const [addrData, configData] = await Promise.all([
          authService.getSavedAddresses().catch(() => []),
          storeService.getSiteConfig().catch(() => null)
        ]);
        
        const list = Array.isArray(addrData) ? addrData : addrData.results || [];
        setSavedAddresses(list);
        if (configData) setConfig(configData);
        
        const defaultAddr = list.find((a: any) => a.is_default);
        if (defaultAddr) handleSelectAddress(defaultAddr);
      } catch (error) {
        console.error("Initialization error", error);
      } finally {
        setLoadingInitial(false);
      }
    };
    init();
  }, []);

  const totals = useMemo(() => {
    const sub = Number(subtotal) || 0;
    const shipping = sub >= config.free_shipping_threshold || sub === 0 ? 0 : Number(config.shipping_fee);
    const discount = appliedCoupon ? Number(appliedCoupon.discount) : 0;
    const finalTotal = sub + shipping - discount;
    return { shipping, discount, finalTotal };
  }, [subtotal, config, appliedCoupon]);

  const isIndianPincode = useMemo(() => {
    const indiaRegex = /^[1-9][0-9]{5}$/;
    return indiaRegex.test(address.pincode);
  }, [address.pincode]);

  const showPincodeWarning = hasAttemptedPay && !isIndianPincode && address.pincode.length > 0;

  // Form Validation Logic
  const validateForm = () => {
    const newErrors: Record<string, boolean> = {};
    const mandatoryFields = ['firstName', 'lastName', 'country', 'state', 'city', 'street', 'pincode', 'phone'];

    mandatoryFields.forEach(field => {
      if (!address[field as keyof typeof address]?.trim()) {
        newErrors[field] = true;
      }
    });

    const phoneRegex = /^[0-9]{10}$/;
    if (address.phone && !phoneRegex.test(address.phone)) {
      newErrors.phone = true;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSelectAddress = (addr: any) => {
    setAddress({
      firstName: addr.first_name || '',
      lastName: addr.last_name || '',
      country: addr.country || '',
      state: addr.state || '',
      city: addr.city || '',
      street: addr.address || '',
      landmark: addr.landmark || '',
      pincode: addr.zip_code || '',
      phone: addr.phone || ''
    });
    setSaveAsDefault(false); 
    setHasAttemptedPay(false);
    setErrors({}); // Clear errors when selecting saved address
    toast.success(`Address "${addr.label}" selected`);
  };

  const resetAddressForm = () => {
    setAddress({
      firstName: '', lastName: '', country: '', state: '',
      city: '', street: '', landmark: '', pincode: '', phone: ''
    });
    setSaveAsDefault(false);
    setHasAttemptedPay(false);
    setErrors({});
    toast.info("Enter new delivery details");
  };

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setIsValidatingCoupon(true);
    try {
      const res = await storeService.validateCoupon(couponCode, subtotal);
      setAppliedCoupon(res);
      toast.success(res.message || "Coupon applied!");
    } catch (err: any) {
      toast.error(err.error || "Invalid coupon code");
      setAppliedCoupon(null);
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const handlePayment = async () => {
    setHasAttemptedPay(true);

    // Strict Validation Check
    const isValid = validateForm();
    if (!isValid) {
      toast.error("Required Fields Missing", {
        description: "Please fill in all mandatory fields highlighted in red."
      });
      // Smart Scroll to the form
      window.scrollTo({ top: 200, behavior: 'smooth' });
      return; // Kill the process immediately
    }

    if (!isIndianPincode) {
      toast.error("Shipping Restricted", {
        description: "Free shipping is only available in India. Please use an Indian Pincode or contact us."
      });
      return;
    }

    setIsProcessing(true);
    const scriptLoaded = await loadRazorpay();
    if (!scriptLoaded) {
      toast.error("Razorpay SDK failed to load.");
      setIsProcessing(false);
      return;
    }

    try {
      const orderData = {
        total_amount: totals.finalTotal,
        shipping_address: address.street,
        landmark: address.landmark,
        firstName: address.firstName,
        lastName: address.lastName,
        city: address.city,
        state: address.state,
        country: address.country,
        zip_code: address.pincode,
        phone: address.phone,
        coupon_code: appliedCoupon?.code || null,
        save_address: saveAsDefault, 
        items: cartItems.map(item => ({
          productId: item.productId || item.id,
          product_type: item.product_type,
          title: item.name || item.title,
          price: item.price,
          quantity: item.quantity,
          size: item.selectedSize,
          color: item.selectedColor?.name || ''
        }))
      };

      const backendOrder = await orderService.createCheckoutSession(orderData);

      const options = {
        key: backendOrder.key || import.meta.env.VITE_RAZORPAY_KEY_ID, 
        amount: backendOrder.amount,
        currency: backendOrder.currency || "INR",
        name: "GTD Fashion",
        description: "Secure Checkout",
        order_id: backendOrder.razorpay_order_id,
        handler: async (response: any) => {
          try {
            await orderService.verifyPayment(response);
            toast.success("Order Placed Successfully!");
            clearCart();
            navigate('/profile');
          } catch (err) {
            toast.error("Payment verification failed.");
          }
        },
        prefill: {
          name: `${address.firstName} ${address.lastName}`,
          contact: address.phone
        },
        theme: { color: "#ec4899" }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error: any) {
      console.error("Checkout error:", error);
      toast.error(error.error || "Payment initialization failed");
    } finally {
      setIsProcessing(false);
    }
  };

  // Helper for conditional error styling
  const errorStyle = (field: string) => 
    errors[field] ? "border-red-500 bg-red-50 focus-visible:ring-red-500" : "";

  if (loadingInitial) return <div className="h-screen flex items-center justify-center bg-[#FFF8F8]"><Loader2 className="animate-spin text-primary" /></div>;

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-40 pb-20 container mx-auto px-4 max-w-6xl">
        <h1 className="text-2xl font-black uppercase mb-10 tracking-tight">Checkout</h1>
        
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7 space-y-10">
            
            {savedAddresses.length > 0 && (
              <div>
                <div className="flex justify-between items-end mb-4">
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Select Delivery Address</p>
                  <button onClick={resetAddressForm} className="flex items-center gap-1 text-[10px] font-black uppercase text-primary border-b border-primary">
                    <Plus size={12} /> New Address
                  </button>
                </div>
                
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                  {savedAddresses.map(addr => (
                    <button 
                      key={addr.id} 
                      onClick={() => handleSelectAddress(addr)}
                      className={`flex-shrink-0 w-64 text-left p-4 rounded-2xl border-2 transition-all ${address.phone === addr.phone ? 'border-black bg-zinc-50' : 'border-zinc-100 bg-white hover:border-zinc-300'}`}
                    >
                      <p className="font-bold text-sm uppercase">{addr.label}</p>
                      <p className="text-xs text-gray-500 truncate mt-1">{addr.address}</p>
                      <p className="text-[10px] text-zinc-400 mt-2 uppercase">{addr.city}, {addr.state}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <section className="space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-widest flex items-center gap-3">
                <MapPin size={16} className="text-primary" /> Delivery Details
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <Input 
                  placeholder="First Name *" 
                  className={errorStyle('firstName')}
                  value={address.firstName} 
                  onChange={e => {
                    setAddress({...address, firstName: e.target.value});
                    if (errors.firstName) setErrors({...errors, firstName: false});
                  }} 
                />
                <Input 
                  placeholder="Last Name *" 
                  className={errorStyle('lastName')}
                  value={address.lastName} 
                  onChange={e => {
                    setAddress({...address, lastName: e.target.value});
                    if (errors.lastName) setErrors({...errors, lastName: false});
                  }} 
                />
                
                <Input 
                  className={`col-span-2 ${errorStyle('country')}`} 
                  placeholder="Country / Region *" 
                  value={address.country} 
                  onChange={e => {
                    setAddress({...address, country: e.target.value});
                    if (errors.country) setErrors({...errors, country: false});
                  }} 
                />
                <Input 
                  placeholder="State *" 
                  className={errorStyle('state')}
                  value={address.state} 
                  onChange={e => {
                    setAddress({...address, state: e.target.value});
                    if (errors.state) setErrors({...errors, state: false});
                  }} 
                />
                <Input 
                  placeholder="City *" 
                  className={errorStyle('city')}
                  value={address.city} 
                  onChange={e => {
                    setAddress({...address, city: e.target.value});
                    if (errors.city) setErrors({...errors, city: false});
                  }} 
                />
                <Input 
                  className={`col-span-2 ${errorStyle('street')}`} 
                  placeholder="Street Address / House No. *" 
                  value={address.street} 
                  onChange={e => {
                    setAddress({...address, street: e.target.value});
                    if (errors.street) setErrors({...errors, street: false});
                  }} 
                />
                <Input 
                  className="col-span-2" 
                  placeholder="Landmark (Optional)" 
                  value={address.landmark} 
                  onChange={e => setAddress({...address, landmark: e.target.value})} 
                />
                
                <Input 
                  placeholder="Pincode *" 
                  className={errorStyle('pincode')}
                  value={address.pincode} 
                  onChange={e => {
                    setAddress({...address, pincode: e.target.value});
                    if (errors.pincode) setErrors({...errors, pincode: false});
                    if (hasAttemptedPay) setHasAttemptedPay(false); 
                  }} 
                  maxLength={6} 
                />
                <Input 
                  className={`col-span-2 ${errorStyle('phone')}`} 
                  placeholder="Contact Number *" 
                  value={address.phone} 
                  onChange={e => {
                    setAddress({...address, phone: e.target.value});
                    if (errors.phone) setErrors({...errors, phone: false});
                  }} 
                  maxLength={10} 
                />
              </div>
              
              <div className="flex items-center gap-3 cursor-pointer group" onClick={() => {
                const phoneRegex = /^[0-9]{10}$/;
                if (saveAsDefault === false && !phoneRegex.test(address.phone)) {
                  toast.error("Invalid Phone Number", {
                    description: "Please enter exactly 10 digits before saving."
                  });
                  return;
                }
                setSaveAsDefault(!saveAsDefault);
              }}>
                {saveAsDefault ? <CheckSquare size={18} className="text-primary" /> : <Square size={18} className="text-zinc-300" />}
                <span className="text-[10px] font-bold uppercase text-zinc-500 group-hover:text-black transition-colors">Save this as default address</span>
              </div>
            </section>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-zinc-50 p-8 rounded-3xl border border-zinc-100 sticky top-32 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] mb-8 text-zinc-400">Order Summary</h3>
              
              <div className="mb-8 p-4 bg-white border border-zinc-200 rounded-2xl">
                <p className="text-[9px] font-black uppercase text-zinc-400 mb-3 tracking-widest">Apply Promo Code</p>
                <div className="flex gap-2">
                  <Input 
                    placeholder="ENTER CODE" 
                    className="h-10 text-xs font-bold uppercase border-none bg-zinc-50"
                    value={couponCode} 
                    onChange={e => setCouponCode(e.target.value.toUpperCase())} 
                  />
                  <Button onClick={handleApplyCoupon} disabled={isValidatingCoupon} className="bg-black text-white h-10 px-4 text-[9px] font-black uppercase">
                    {isValidatingCoupon ? "..." : "Apply"}
                  </Button>
                </div>
                {appliedCoupon && <p className="mt-2 text-[9px] font-bold text-green-600 flex items-center gap-1 uppercase tracking-tighter"><ShieldCheck size={12}/> {appliedCoupon.message}</p>}
              </div>

              <div className="space-y-4 mb-10 text-xs font-bold uppercase tracking-wider">
                <div className="flex justify-between text-zinc-500">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-zinc-500">
                  <span className="flex items-center gap-2 text-primary">Delivery <Truck size={12} /></span>
                  <span>{totals.shipping === 0 ? <span className="text-green-600 font-black uppercase">Free</span> : formatPrice(totals.shipping)}</span>
                </div>
                {totals.discount > 0 && (
                  <div className="flex justify-between text-green-600 font-black">
                    <span>Discount</span>
                    <span>-{formatPrice(totals.discount)}</span>
                  </div>
                )}
                <div className="border-t border-zinc-200 pt-6 flex justify-between text-lg font-black tracking-tighter">
                  <span>Grand Total</span>
                  <span className="text-black">{formatPrice(totals.finalTotal)}</span>
                </div>
              </div>

              {showPincodeWarning && (
                <div className="mb-6 p-5 bg-red-600 border-2 border-red-800 rounded-2xl shadow-lg animate-in fade-in zoom-in duration-300">
                  <div className="flex items-start gap-3">
                    <div className="bg-white p-1 rounded-full shrink-0">
                      <ShieldCheck size={20} className="text-red-600" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-[12px] leading-tight text-white font-black uppercase tracking-tight">
                        Shipping Restricted to India
                      </p>
                      <p className="text-[10px] leading-relaxed text-red-50 font-medium">
                        The pincode entered is outside our standard delivery zone. Free shipping is only available within India.
                      </p>
                      <a 
                        href="https://www.instagram.com/glorious_threads_by_divya_new?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-block mt-2 bg-white text-red-600 px-4 py-2 rounded-lg text-[9px] font-black uppercase hover:bg-zinc-100 transition-colors"
                      >
                        Message us on Instagram for Global Shipping
                      </a>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-6 mb-6 p-4 bg-amber-50/50 border border-amber-100 rounded-xl">
                <p className="text-[10px] leading-relaxed text-amber-900/80 font-medium">
                  By clicking Pay Now, you agree to our <Link to="/policies/return-policy" className="underline font-bold">Return Policy</Link>. 
                  <span className="block mt-1 font-bold">⚠️ Note: Mandatory Unboxing Video required for all claims.</span>
                </p>
              </div>

              <Button 
                onClick={handlePayment} 
                disabled={isProcessing || cartItems.length === 0} 
                className="w-full bg-black text-white h-16 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl active:scale-95 transition-all"
              >
                {isProcessing ? (
                  <span className="flex items-center gap-3"><Loader2 className="animate-spin" size={16} /> Connecting...</span>
                ) : (
                  <span className="flex items-center gap-3"><CreditCard size={18} /> Pay Now</span>
                )}
              </Button>
              
              <div className="mt-6 pt-4 border-t border-zinc-200 text-center">
                <p className="text-[7px] text-zinc-400 uppercase font-bold tracking-[0.1em]">
                  Secure payment processed by Razorpay. SSL Encrypted.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CheckoutPage;