import { Button } from '@/components/ui/button';

export default function CTA() {
  return (
    <div className="py-20 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-6xl font-bold text-black mb-8">Ready to raise your next round?</h2>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-black text-white hover:bg-gray-800 px-8 py-4 text-lg">
            Join Waitlist
          </Button>
          <Button size="lg" variant="outline" className="border-black text-black hover:bg-gray-100 px-8 py-4 text-lg">
            Schedule a call
          </Button>
        </div>
      </div>
    </div>
  );
} 