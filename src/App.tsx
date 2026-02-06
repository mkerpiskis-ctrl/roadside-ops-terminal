import { useState } from 'react';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './components/dashboard/Dashboard';
import { ViewType } from './components/layout/Sidebar';

function App() {
    const [currentView, setCurrentView] = useState<ViewType>('dashboard');
    const [vendorFilter, setVendorFilter] = useState<string | null>(null);

    const handleNavigate = (view: ViewType) => {
        setCurrentView(view);
        if (view !== 'dashboard') {
            setVendorFilter(null); // Clear filter when leaving dashboard
        }
    };

    const handleVendorFilter = (vendor: string) => {
        setVendorFilter(vendor);
        if (currentView !== 'dashboard') {
            setCurrentView('dashboard');
        }
    };

    return (
        <Layout
            currentView={currentView}
            onNavigate={handleNavigate}
            onFilterVendor={handleVendorFilter}
            activeVendorFilter={vendorFilter}
        >
            {currentView === 'dashboard' && <Dashboard vendorFilter={vendorFilter} />}

            {currentView === 'service_log' && (
                <div className="flex flex-col items-center justify-center h-[calc(100vh-8rem)] text-slate-500 opacity-50">
                    <h2 className="text-xl font-mono mb-2">SERVICE_LOG_ARCHIVE</h2>
                    <p className="text-xs font-mono">ACCESSING LEGACY RECORDS...</p>
                </div>
            )}

            {currentView === 'vendors' && (
                <div className="flex flex-col items-center justify-center h-[calc(100vh-8rem)] text-slate-500 opacity-50">
                    <h2 className="text-xl font-mono mb-2">VENDOR_DATABASE</h2>
                    <p className="text-xs font-mono">LOADING RELIABILITY METRICS...</p>
                </div>
            )}

            {currentView === 'analytics' && (
                <div className="flex flex-col items-center justify-center h-[calc(100vh-8rem)] text-slate-500 opacity-50">
                    <h2 className="text-xl font-mono mb-2">ANALYTICS_ENGINE</h2>
                    <p className="text-xs font-mono">CALCULATING PREDICTIVE MODELS...</p>
                </div>
            )}
        </Layout>
    )
}

export default App
