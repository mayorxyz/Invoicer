import { User, Globe, Palette, Bell } from 'lucide-react';

export default function SettingsMockup() {
  return (
    <div className="bg-white rounded-lg border border-[#E5E5E5] shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
      <div className="flex min-h-[420px] md:min-h-[480px]">
        {/* Sidebar */}
        <div className="hidden sm:flex flex-col w-[180px] border-r border-[#E5E5E5] bg-[#FAFAFA] p-4">
          <p className="text-[10px] font-semibold text-[#737373] uppercase tracking-[0.15em] mb-4 px-2">Settings</p>
          <nav className="space-y-0.5">
            {[
              { icon: User, label: 'Profile', active: true },
              { icon: Globe, label: 'Regional', active: false },
              { icon: Palette, label: 'Appearance', active: false },
              { icon: Bell, label: 'Notifications', active: false },
            ].map((item) => (
              <div
                key={item.label}
                className={`flex items-center gap-2.5 px-2.5 py-2 rounded-md text-[12px] font-medium transition-colors ${
                  item.active ? 'bg-[#111] text-white' : 'text-[#737373] hover:text-[#111] hover:bg-[#F0F0F0]'
                }`}
              >
                <item.icon size={14} strokeWidth={item.active ? 2 : 1.5} />
                {item.label}
              </div>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 p-5 md:p-8 min-w-0">
          <div className="mb-6">
            <h3 className="text-[16px] font-semibold text-[#111]">Business Profile</h3>
            <p className="text-[12px] text-[#737373] mt-1">Manage your business information and preferences</p>
          </div>
          
          <div className="space-y-5">
            <div>
              <label className="block text-[11px] font-semibold text-[#737373] uppercase tracking-[0.1em] mb-1.5">Business Name</label>
              <div className="px-3 py-2.5 border border-[#E5E5E5] rounded-md text-[13px] text-[#111] bg-[#FAFAFA]">
                Your Studio LLC
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-[#737373] uppercase tracking-[0.1em] mb-1.5">Email</label>
                <div className="px-3 py-2.5 border border-[#E5E5E5] rounded-md text-[13px] text-[#111] bg-[#FAFAFA]">
                  hello@yourstudio.com
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#737373] uppercase tracking-[0.1em] mb-1.5">Phone</label>
                <div className="px-3 py-2.5 border border-[#E5E5E5] rounded-md text-[13px] text-[#111] bg-[#FAFAFA]">
                  +1 (555) 000-0000
                </div>
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#737373] uppercase tracking-[0.1em] mb-1.5">Business Address</label>
              <div className="px-3 py-2.5 border border-[#E5E5E5] rounded-md text-[13px] text-[#111] bg-[#FAFAFA]">
                123 Design Street, Suite 400, San Francisco, CA 94102
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-[#737373] uppercase tracking-[0.1em] mb-1.5">Currency</label>
                <div className="px-3 py-2.5 border border-[#E5E5E5] rounded-md text-[13px] text-[#111] bg-[#FAFAFA] flex items-center justify-between">
                  <span>USD — US Dollar</span>
                  <span className="text-[#737373] text-[11px]">▾</span>
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#737373] uppercase tracking-[0.1em] mb-1.5">Default Tax Rate</label>
                <div className="px-3 py-2.5 border border-[#E5E5E5] rounded-md text-[13px] text-[#111] bg-[#FAFAFA]">
                  0%
                </div>
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#737373] uppercase tracking-[0.1em] mb-1.5">Payment Terms</label>
              <div className="px-3 py-2.5 border border-[#E5E5E5] rounded-md text-[13px] text-[#111] bg-[#FAFAFA] flex items-center justify-between">
                <span>Net 30</span>
                <span className="text-[#737373] text-[11px]">▾</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
