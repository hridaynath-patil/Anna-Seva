'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function AdminSidebarToggle() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Close sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [sidebarOpen]);

  useEffect(() => {
    // Add/remove sidebar-open class on the sidebar element
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    
    if (sidebar) {
      if (sidebarOpen) {
        sidebar.classList.add('sidebar-open');
      } else {
        sidebar.classList.remove('sidebar-open');
      }
    }
    if (overlay) {
      if (sidebarOpen) {
        overlay.classList.add('sidebar-overlay-visible');
      } else {
        overlay.classList.remove('sidebar-overlay-visible');
      }
    }
  }, [sidebarOpen]);

  return (
    <>
      {/* Toggle button — rendered in the dashboard header */}
      <button
        className="sidebar-toggle-btn"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
      >
        {sidebarOpen ? '✕' : '☰'}
      </button>
      {/* Overlay */}
      <div
        className="sidebar-overlay"
        onClick={() => setSidebarOpen(false)}
      />
    </>
  );
}
