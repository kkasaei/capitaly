import { Button } from '@/components/ui/button';

export default function CTA() {
  return (
    <div className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-5xl md:text-6xl font-bold text-black mb-8">Ready to raise your next round?</h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-black text-white hover:bg-gray-800 px-8 py-4 text-lg">
                Join Waitlist
              </Button>
              <Button size="lg" variant="outline" className="border-black text-black hover:bg-gray-100 px-8 py-4 text-lg">
                Schedule a call
              </Button>
            </div>
          </div>
          <div className="relative aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
              Image Placeholder
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 