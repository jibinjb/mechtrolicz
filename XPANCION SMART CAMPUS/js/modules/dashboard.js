/* ==========================================================================
   SmartCampus Main Dashboard View
   ========================================================================== */

function renderDashboardView() {
  const state = window.campusState.data;
  const user = state.currentUser;

  // Compute live stats
  const availableRoomsCount = state.rooms.filter(r => r.status === 'available').length;
  const availableLabsCount = state.rooms.filter(r => r.type === 'Laboratory' && r.status === 'available').length;
  const openComplaintsCount = state.complaints.filter(c => c.status !== 'resolved' && c.status !== 'closed').length;
  const activeEventsCount = state.events.length;
  const lostFoundCount = state.lostFound.filter(i => i.status === 'open').length;

  return `
    <div class="view-animate-in">
      <!-- Welcome Banner (Standard White & Blue) -->
      <div class="card" style="background: linear-gradient(135deg, #1e40af, #2563eb, #3b82f6); border-color: #93c5fd; color: #ffffff; margin-bottom: 2rem; box-shadow: 0 10px 25px -5px rgba(37, 99, 235, 0.25);">
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
          <div>
            <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.35rem;">
              <span style="font-size: 1.6rem;">${user.avatar}</span>
              <span class="badge" style="background: rgba(255, 255, 255, 0.2); color: #ffffff; border: 1px solid rgba(255, 255, 255, 0.35);">${user.role.toUpperCase()} PORTAL</span>
              <span style="font-size: 0.8rem; color: #dbeafe;">• ${user.department}</span>
            </div>
            <h1 style="font-size: 1.85rem; margin-bottom: 0.25rem; color: #ffffff;">Welcome back, ${user.name} 👋</h1>
            <p style="font-size: 0.95rem; color: #eff6ff;">SmartCampus Digital OS is running active diagnostics across 6 campus blocks.</p>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: center;">
            <button class="btn" style="background: rgba(255, 255, 255, 0.15); color: #ffffff; border: 1px solid rgba(255, 255, 255, 0.3);" onclick="window.appRouter.navigate('map')">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon><line x1="8" y1="2" x2="8" y2="18"></line><line x1="16" y1="6" x2="16" y2="22"></line></svg>
              Campus Map
            </button>
            <button class="btn" style="background: #ffffff; color: #1d4ed8; font-weight: 700; box-shadow: var(--shadow-sm);" onclick="window.toggleAICopilot()">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a10 10 0 0 1 10 10c0 5.523-4.477 10-10 10S2 17.523 2 12A10 10 0 0 1 12 2z"></path><path d="m9 12 2 2 4-4"></path></svg>
              AI Assistant
            </button>
          </div>
        </div>
      </div>

      <!-- Quick Metrics Grid -->
      <div class="stats-grid">
        <div class="stat-card" onclick="window.appRouter.navigate('rooms')" style="cursor: pointer;">
          <div class="stat-icon emerald">🏫</div>
          <div class="stat-info">
            <div class="stat-number">${availableRoomsCount} / ${state.rooms.length}</div>
            <div class="stat-label">Available Facilities (${availableLabsCount} Labs Free)</div>
          </div>
        </div>

        <div class="stat-card" onclick="window.appRouter.navigate('complaints')" style="cursor: pointer;">
          <div class="stat-icon amber">📝</div>
          <div class="stat-info">
            <div class="stat-number">${openComplaintsCount}</div>
            <div class="stat-label">Active Campus Tickets</div>
          </div>
        </div>

        <div class="stat-card" onclick="window.appRouter.navigate('lost-found')" style="cursor: pointer;">
          <div class="stat-icon blue">🔎</div>
          <div class="stat-info">
            <div class="stat-number">${lostFoundCount}</div>
            <div class="stat-label">Lost & Found Items (2 Matched)</div>
          </div>
        </div>

        <div class="stat-card" onclick="window.appRouter.navigate('events')" style="cursor: pointer;">
          <div class="stat-icon cyan">📅</div>
          <div class="stat-info">
            <div class="stat-number">${activeEventsCount}</div>
            <div class="stat-label">Upcoming Events & Fests</div>
        </div>
      </div>

      <!-- Quick Services Launcher (as specified in README Section 5 & 33) -->
      <div style="margin-bottom: 2rem;">
        <h3 style="margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
          <span>⚡</span> Quick Services Launcher
        </h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 1rem;">
          <div class="card" onclick="window.appRouter.navigate('lost-found')" style="text-align: center; cursor: pointer; padding: 1.25rem 0.75rem;">
            <div style="font-size: 2rem; margin-bottom: 0.4rem;">🔎</div>
            <div style="font-weight: 700; font-size: 0.88rem;">Lost & Found</div>
            <span style="font-size: 0.72rem; color: var(--text-muted);">AI Matching</span>
          </div>

          <div class="card" onclick="window.appRouter.navigate('complaints')" style="text-align: center; cursor: pointer; padding: 1.25rem 0.75rem;">
            <div style="font-size: 2rem; margin-bottom: 0.4rem;">📝</div>
            <div style="font-weight: 700; font-size: 0.88rem;">Report Issue</div>
            <span style="font-size: 0.72rem; color: var(--text-muted);">Smart Routing</span>
          </div>

          <div class="card" onclick="window.appRouter.navigate('rooms')" style="text-align: center; cursor: pointer; padding: 1.25rem 0.75rem;">
            <div style="font-size: 2rem; margin-bottom: 0.4rem;">🏫</div>
            <div style="font-weight: 700; font-size: 0.88rem;">Rooms & Labs</div>
            <span style="font-size: 0.72rem; color: var(--text-muted);">Live Occupancy</span>
          </div>

          <div class="card" onclick="window.appRouter.navigate('map')" style="text-align: center; cursor: pointer; padding: 1.25rem 0.75rem;">
            <div style="font-size: 2rem; margin-bottom: 0.4rem;">🗺️</div>
            <div style="font-weight: 700; font-size: 0.88rem;">Campus Map</div>
            <span style="font-size: 0.72rem; color: var(--text-muted);">Interactive 3D</span>
          </div>

          <div class="card" onclick="window.appRouter.navigate('events')" style="text-align: center; cursor: pointer; padding: 1.25rem 0.75rem;">
            <div style="font-size: 2rem; margin-bottom: 0.4rem;">🎟️</div>
            <div style="font-weight: 700; font-size: 0.88rem;">Events & Pass</div>
            <span style="font-size: 0.72rem; color: var(--text-muted);">QR Check-In</span>
          </div>

          <div class="card" onclick="window.appRouter.navigate('attendance')" style="text-align: center; cursor: pointer; padding: 1.25rem 0.75rem;">
            <div style="font-size: 2rem; margin-bottom: 0.4rem;">📊</div>
            <div style="font-weight: 700; font-size: 0.88rem;">Attendance</div>
            <span style="font-size: 0.72rem; color: var(--text-muted);">${state.attendance.overall}% Overall</span>
          </div>

          <div class="card" onclick="window.appRouter.navigate('cafeteria')" style="text-align: center; cursor: pointer; padding: 1.25rem 0.75rem; border-color: #bfdbfe; background: #eff6ff;">
            <div style="font-size: 2rem; margin-bottom: 0.4rem;">🍱</div>
            <div style="font-weight: 700; font-size: 0.88rem; color: #1d4ed8;">Cafeteria</div>
            <span style="font-size: 0.72rem; color: #3b82f6; font-weight: 600;">OTP Parcel</span>
          </div>

          <div class="card" onclick="window.openSOSModal()" style="text-align: center; cursor: pointer; padding: 1.25rem 0.75rem; border-color: rgba(244, 63, 94, 0.4); background: rgba(244, 63, 94, 0.08);">
            <div style="font-size: 2rem; margin-bottom: 0.4rem;">🚨</div>
            <div style="font-weight: 700; font-size: 0.88rem; color: #f43f5e;">SOS Alert</div>
            <span style="font-size: 0.72rem; color: #fda4af;">Emergency</span>
          </div>
        </div>
      </div>

      <!-- Split Layout: Announcements & Urgent Actions -->
      <div style="display: grid; grid-template-columns: 2fr 1.2fr; gap: 1.5rem;" class="dashboard-split">
        <!-- Announcements Board -->
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">📢 Campus Announcements</h3>
            <button class="btn btn-outline btn-sm" onclick="window.appRouter.navigate('announcements')">View All</button>
          </div>
          <div style="display: flex; flex-direction: column; gap: 1rem;">
            ${state.announcements.slice(0, 3).map(a => `
              <div style="background: var(--bg-surface); padding: 1rem; border-radius: var(--radius-md); border-left: 3px solid ${a.priority === 'urgent' ? 'var(--status-sos)' : a.priority === 'high' ? 'var(--primary)' : 'var(--accent-cyan)'};">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.4rem;">
                  <span style="font-weight: 700; font-size: 0.95rem;">${a.title}</span>
                  <span class="badge ${a.priority === 'urgent' ? 'badge-danger' : 'badge-primary'}">${a.priority.toUpperCase()}</span>
                </div>
                <p style="font-size: 0.85rem; margin-bottom: 0.4rem; line-height: 1.4;">${a.content}</p>
                <div style="font-size: 0.75rem; color: var(--text-muted); display: flex; gap: 0.85rem;">
                  <span>🏢 ${a.department}</span>
                  <span>🕒 ${a.date}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Live Campus Pulse / Activity Stream -->
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">⚡ Campus Pulse</h3>
            <span class="badge badge-available"><span class="badge-dot"></span> Live</span>
          </div>
          <div style="display: flex; flex-direction: column; gap: 1.1rem; font-size: 0.85rem;">
            <div style="display: flex; gap: 0.85rem;">
              <div style="font-size: 1.3rem;">🤖</div>
              <div>
                <strong style="color: var(--text-primary);">AI Match Alert</strong>
                <p style="font-size: 0.8rem;">Fossil Wallet lost in Library has a 94% match at Help Desk.</p>
                <a href="javascript:void(0)" onclick="window.appRouter.navigate('lost-found')" style="font-size: 0.75rem; color: var(--accent-cyan);">Review Match →</a>
              </div>
            </div>

            <div style="display: flex; gap: 0.85rem;">
              <div style="font-size: 1.3rem;">🔧</div>
              <div>
                <strong style="color: var(--text-primary);">Maintenance In Progress</strong>
                <p style="font-size: 0.8rem;">Technician Suresh Kumar is servicing Projector #204.</p>
                <span style="font-size: 0.72rem; color: var(--status-pending);">ETA: 45 mins</span>
              </div>
            </div>

            <div style="display: flex; gap: 0.85rem;">
              <div style="font-size: 1.3rem;">🎟️</div>
              <div>
                <strong style="color: var(--text-primary);">Hackathon Registration</strong>
                <p style="font-size: 0.8rem;">210 / 250 spots claimed for Smart Campus Hackathon.</p>
                <a href="javascript:void(0)" onclick="window.appRouter.navigate('events')" style="font-size: 0.75rem; color: var(--primary-light);">Secure Pass →</a>
              </div>
            </div>

            <div style="display: flex; gap: 0.85rem;">
              <div style="font-size: 1.3rem;">🛡️</div>
              <div>
                <strong style="color: var(--text-primary);">Security Operations</strong>
                <p style="font-size: 0.8rem;">All perimeter patrols normal. Emergency response response ready.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}
