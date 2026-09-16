import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronRight,
  faShieldHalved,
  faArrowRight,
  faGrip,
  faMagnifyingGlass
} from '@fortawesome/free-solid-svg-icons';
import CustomerHeader from '../../components/customer/CustomerHeader';
import BottomNavigation from '../../components/customer/BottomNavigation';
import { SERVICES_DATA } from '../../data/servicesData';

export default function AllServicesPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const servicesList = Object.values(SERVICES_DATA);

  const filteredServices = servicesList.filter((service) => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#F8F6F2] text-[#17233A] relative pb-20 md:pb-12 font-sans">
      <CustomerHeader />

      <main className="w-[95%] max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        
        {/* Breadcrumb Navigation */}
        <nav className="text-xs font-medium text-[#6B7280]">
          <ol className="flex items-center gap-1.5 flex-wrap">
            <li>
              <Link to="/" className="hover:text-[#17233A] transition-colors">Home</Link>
            </li>
            <li>
              <FontAwesomeIcon icon={faChevronRight} className="w-2 h-2 text-[#A66666]" />
            </li>
            <li className="text-[#17233A] font-bold">
              All Services Catalog
            </li>
          </ol>
        </nav>

        {/* Page Header */}
        <div className="space-y-3 border-b border-[#E8E2D8] pb-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FCFBF8] border border-[#E8E2D8] text-xs font-bold text-[#A66666] mb-2">
                <FontAwesomeIcon icon={faGrip} className="w-3.5 h-3.5" />
                <span>Complete Service Catalog</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-[#17233A] tracking-tight">
                Explore All Cooperative Services
              </h1>
            </div>
            <span className="text-xs font-bold text-[#A66666] bg-[#FCFBF8] px-4 py-1.5 rounded-full border border-[#E8E2D8]">
              Verified Guild Network • Fair Trade Guaranteed
            </span>
          </div>

          {/* Search Catalog */}
          <div className="relative max-w-xl pt-2">
            <div className="relative flex items-center">
              <FontAwesomeIcon icon={faMagnifyingGlass} className="absolute left-4 text-[#6B7280] w-4 h-4" />
              <input
                type="text"
                placeholder="Search services (e.g. electrical, plumbing, cleaning)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#FCFBF8] border border-[#E8E2D8] text-sm focus:outline-none focus:border-[#A66666] transition-colors shadow-2xs"
              />
            </div>
          </div>
        </div>

        {/* Service Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              onClick={() => navigate(`/services/${service.id}`)}
              className="bg-[#FCFBF8] border border-[#E8E2D8] rounded-[24px] overflow-hidden hover:-translate-y-1.5 hover:shadow-lg transition-all duration-300 cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="h-44 overflow-hidden relative border-b border-[#E8E2D8]">
                  <img
                    src={service.bgImg}
                    alt={service.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-[#17233A]/80 backdrop-blur-xs text-white text-[11px] font-semibold px-3 py-1 rounded-full border border-white/20">
                    {service.workersCount}
                  </div>
                  <div className="absolute top-3 right-3 bg-[#A66666] text-white text-[11px] font-bold px-3 py-1 rounded-full">
                    From ₹{service.basePrice}
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#A66666]">
                    <FontAwesomeIcon icon={service.icon} className="w-3.5 h-3.5" />
                    <span>Arrival in {service.estimatedTime}</span>
                  </div>

                  <h3 className="text-lg font-bold font-display text-[#17233A] group-hover:text-[#A66666] transition-colors">
                    {service.name}
                  </h3>

                  <p className="text-xs text-[#6B7280] leading-relaxed line-clamp-2">
                    {service.description}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0 flex items-center justify-between border-t border-transparent group-hover:border-[#E8E2D8] transition-colors">
                <span className="text-xs font-semibold text-[#6B7280]">★ {service.rating} ({service.reviewsCount} reviews)</span>
                <span className="text-xs font-bold text-[#A66666] flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
                  View Service Details <FontAwesomeIcon icon={faArrowRight} className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>

      </main>

      <BottomNavigation activeTab="services" />
    </div>
  );
}
