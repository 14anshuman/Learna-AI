import React from 'react';

const Tabs = ({ tabs, activeTab, setActiveTab }) => {
    return (
        <div className="w-full ">
            {/* Tabs Header */}
            <div className="border-b border-gray-200 mb-6">
                <nav className="flex gap-6">
                    {tabs.map((tab) => (
                        <button
                            key={tab.name}
                            
                            onClick={() => setActiveTab(tab.name)}
                            className={`
                                relative pb-3 px-1 text-sm cursor-pointer font-semibold transition-all duration-200
                                ${
                                    activeTab === tab.name
                                        ? 'text-emerald-600'
                                        : 'text-slate-600 hover:text-slate-900'
                                }
                            `}
                        >
                            <span>{tab.label}</span>

                            {/* Active underline */}
                            {activeTab === tab.name && (
                                <div className="absolute left-0 right-0 -bottom-[1px] h-0.5 bg-emerald-600 rounded-full" />
                            )}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                 {tabs.map((tab)=>{
                    if(tab.name===activeTab){
                        return (
                            <div key={tab.name} className="" >
                                {tab.content}

                            </div>
                        )
                    }
                    return null;
                 })}
            </div>
        </div>
    );
};

export default Tabs;
