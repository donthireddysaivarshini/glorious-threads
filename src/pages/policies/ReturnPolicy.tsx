import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { AlertTriangle, Video, Camera, Info } from 'lucide-react';

const ReturnPolicy = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-40 pb-20 container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-black uppercase mb-10 tracking-tight">Return & Exchange Policy</h1>
        
        {/* MANDATORY UNBOXING SECTION */}
        <section className="mb-12 bg-zinc-50 border border-zinc-200 rounded-3xl p-8 md:p-10">
          <div className="flex items-center gap-3 mb-6 text-red-600">
            <Video size={24} strokeWidth={3} />
            <h2 className="text-xl font-black uppercase tracking-tight">Mandatory Unboxing Video</h2>
          </div>
          <div className="space-y-4 text-zinc-700 leading-relaxed">
            <p className="font-bold">To ensure a valid claim for any sort of complaint, please follow these strict guidelines:</p>
            <ul className="list-disc ml-5 space-y-3 font-medium">
              <li>Customers must capture a complete video while unpacking the parcel immediately upon receipt.</li>
              <li>The video must be recorded from the very beginning of opening the package to the end, without any pauses, cuts, or edits.</li>
              <li>Complaints regarding damages or missing items will not be entertained without this continuous video proof.</li>
            </ul>
          </div>
        </section>

        {/* GUIDELINES & NON-RETURNABLE REASONS */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Weaving Process Note */}
          <div className="border border-zinc-100 p-6 rounded-2xl">
            <h3 className="font-black uppercase text-sm mb-4 flex items-center gap-2">
              <Info size={18} className="text-primary" /> Weaving process
            </h3>
            <p className="text-sm text-zinc-600 leading-relaxed">
              Thread pullings and thread missings are an inherent part of the traditional weaving process. These are not considered damages. Only major manufacturing issues will be considered for replacement.
            </p>
          </div>

          {/* Color Variation Note */}
          <div className="border border-zinc-100 p-6 rounded-2xl">
            <h3 className="font-black uppercase text-sm mb-4 flex items-center gap-2">
              <Camera size={18} className="text-primary" /> Color Variation
            </h3>
            <p className="text-sm text-zinc-600 leading-relaxed">
              Slight color variations are common due to photography lighting and individual phone/screen resolutions. No returns or exchanges will be accepted based on color preferences or minor changes.
            </p>
          </div>
        </div>

        {/* ORDER & CANCELLATION SUMMARY */}
        <section className="space-y-6 text-sm border-t pt-10">
          <div>
            <h2 className="font-black uppercase mb-2">Order Cancellations</h2>
            <p className="text-zinc-600 italic">Once an order is placed, no cancellations are accepted under any situation.</p>
          </div>

         
          
          <p className="text-center text-[10px] font-bold uppercase text-zinc-400 mt-10 tracking-widest">
            Regards, Glorious Threads by Divya
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ReturnPolicy;