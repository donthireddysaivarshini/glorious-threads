import { motion } from 'framer-motion';
import { Plus,Package, MapPin, User, LogOut, ChevronRight, Settings } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const UserProfile = () => {
  // Mock User Data
  const user = {
    name: "Aarti Sharma",
    email: "aarti.sharma@example.com",
    joined: "October 2025"
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-28 pb-20">
        <div className="container-luxury mx-auto px-4 max-w-5xl">
          
          {/* Top Profile Bar */}
          <div className="flex flex-col md:flex-row items-center gap-6 mb-12 p-8 bg-gray-50 rounded-2xl border border-gray-100">
            <div className="w-24 h-24 rounded-full bg-black flex items-center justify-center text-white text-3xl font-bold">
              {user.name.charAt(0)}
            </div>
            <div className="text-center md:text-left flex-1">
              <h1 className="text-2xl font-bold text-black uppercase tracking-tight">{user.name}</h1>
              <p className="text-muted-foreground text-sm">{user.email}</p>
              <p className="text-[10px] uppercase font-bold text-primary mt-1 tracking-widest">Member Since {user.joined}</p>
            </div>
            <Button variant="outline" className="border-black text-black hover:bg-black hover:text-white rounded-full px-6">
              <LogOut size={16} className="mr-2" /> Logout
            </Button>
          </div>

          <Tabs defaultValue="orders" className="w-full">
            <TabsList className="bg-transparent border-b border-gray-100 w-full justify-start rounded-none h-auto p-0 gap-8 mb-8">
              {['orders', 'address', 'account'].map((tab) => (
                <TabsTrigger 
                  key={tab}
                  value={tab} 
                  className="data-[state=active]:border-black border-b-2 border-transparent rounded-none px-0 py-4 bg-transparent font-bold text-xs uppercase tracking-widest text-muted-foreground data-[state=active]:text-black"
                >
                  {tab === 'orders' && <Package size={14} className="mr-2" />}
                  {tab === 'address' && <MapPin size={14} className="mr-2" />}
                  {tab === 'account' && <User size={14} className="mr-2" />}
                  {tab}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Orders Tab */}
            <TabsContent value="orders" className="space-y-4">
              <div className="p-6 border border-gray-100 rounded-xl flex items-center justify-between group cursor-pointer hover:border-black transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-secondary/50 rounded-lg flex items-center justify-center">
                    <Package className="text-black" size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-black">Order #GTD-8829</p>
                    <p className="text-xs text-muted-foreground">Placed on Jan 12, 2026 • ₹12,499</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold bg-green-50 text-green-700 px-2 py-1 rounded-full uppercase">Delivered</span>
                  <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
              {/* If no orders */}
              <div className="text-center py-20 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                <p className="text-muted-foreground text-sm">No other orders found.</p>
              </div>
            </TabsContent>

            {/* Address Tab */}
            <TabsContent value="address">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 border border-black rounded-xl relative">
                  <span className="absolute top-4 right-4 text-[10px] font-bold uppercase text-primary">Default</span>
                  <h4 className="font-bold text-sm mb-4 uppercase">Home</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    102, Royal Palms, <br />
                    Andheri East, Mumbai <br />
                    Maharashtra - 400069
                  </p>
                  <Button variant="link" className="text-black font-bold p-0 mt-4 h-auto text-xs uppercase underline">Edit Address</Button>
                </div>
                <button className="border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center p-6 hover:bg-gray-50 transition-colors">
                  <Plus size={24} className="text-gray-400 mb-2" />
                  <span className="text-xs font-bold uppercase text-gray-500">Add New Address</span>
                </button>
              </div>
            </TabsContent>

            {/* Account Settings */}
            <TabsContent value="account">
              <div className="max-w-md space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Full Name</label>
                  <input type="text" defaultValue={user.name} className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-black" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Email Address</label>
                  <input type="email" defaultValue={user.email} className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-black" />
                </div>
                <Button className="w-full bg-black text-white h-12 uppercase font-bold tracking-widest">Update Profile</Button>
              </div>
            </TabsContent>
          </Tabs>

        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UserProfile;