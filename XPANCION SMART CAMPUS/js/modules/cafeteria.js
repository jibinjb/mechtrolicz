/* ==========================================================================
   SmartCampus Online Cafeteria & OTP Parcel Pickup System
   Standard White & Blue Theme with Northern & Southern Indian Specialties
   ========================================================================== */

let currentCanteenCategory = 'all';
let filterVegOnly = false;
let canteenViewMode = 'menu'; // menu | my_orders | counter_desk

function renderCafeteriaView() {
  const state = window.campusState.data;
  const user = state.currentUser;
  let menu = state.canteenMenu || [];

  if (currentCanteenCategory !== 'all') {
    const cat = currentCanteenCategory.toLowerCase();
    menu = menu.filter(m => {
      const matchCat = (m.category || '').toLowerCase().includes(cat);
      const matchReg = (m.region || '').toLowerCase().includes(cat);
      return matchCat || matchReg;
    });
  }

  if (filterVegOnly) {
    menu = menu.filter(m => m.isVeg);
  }

  const cart = state.canteenCart || [];
  const cartTotalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  const cartTotalPrice = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const myOrders = (state.canteenOrders || []).filter(o => o.user === user.name);

  return `
    <div class="view-animate-in">
      <!-- Header -->
      <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.5rem;">
        <div>
          <h2>🍱 Smart Cafeteria & Express Parcel Pickup</h2>
          <p>Order fresh Northern & Southern delicacies, pay online, and collect quickly at the parcel counter with your secure OTP.</p>
        </div>
        <div style="display: flex; gap: 0.75rem; align-items: center;">
          <button class="btn ${canteenViewMode === 'menu' ? 'btn-primary' : 'btn-outline'}" onclick="window.setCanteenViewMode('menu')">
            <span>🍽️</span> Menu
          </button>
          <button class="btn ${canteenViewMode === 'my_orders' ? 'btn-primary' : 'btn-outline'}" onclick="window.setCanteenViewMode('my_orders')">
            <span>🧾</span> Active Orders (${myOrders.filter(o => o.status !== 'collected').length})
          </button>
          <button class="btn ${canteenViewMode === 'counter_desk' ? 'btn-primary' : 'btn-outline'}" onclick="window.setCanteenViewMode('counter_desk')">
            <span>🧑‍🍳</span> Parcel Counter Desk
          </button>
        </div>
      </div>

      <!-- Main Section Switching -->
      ${canteenViewMode === 'menu' ? renderCanteenMenuSection(menu, cart, cartTotalQty, cartTotalPrice) : ''}
      ${canteenViewMode === 'my_orders' ? renderCanteenMyOrdersSection(myOrders) : ''}
      ${canteenViewMode === 'counter_desk' ? renderCanteenCounterDeskSection(state.canteenOrders || []) : ''}
    </div>
  `;
}

// --------------------------------------------------------------------------
// 1. Menu Section with Categories & Cart Dock
// --------------------------------------------------------------------------
function renderCanteenMenuSection(menu, cart, cartTotalQty, cartTotalPrice) {
  return `
    <!-- Top Filter Controls -->
    <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.25rem;">
      <div class="tabs-nav" style="margin-bottom: 0;">
        <button class="tab-btn ${currentCanteenCategory === 'all' ? 'active' : ''}" onclick="window.setCanteenCategory('all')">
          All Delicacies
        </button>
        <button class="tab-btn ${currentCanteenCategory === 'north' ? 'active' : ''}" onclick="window.setCanteenCategory('north')">
          🏔️ North Indian
        </button>
        <button class="tab-btn ${currentCanteenCategory === 'south' ? 'active' : ''}" onclick="window.setCanteenCategory('south')">
          🌴 South Indian
        </button>
        <button class="tab-btn ${currentCanteenCategory === 'meals' ? 'active' : ''}" onclick="window.setCanteenCategory('meals')">
          Meals & Thali
        </button>
        <button class="tab-btn ${currentCanteenCategory === 'breakfast' ? 'active' : ''}" onclick="window.setCanteenCategory('breakfast')">
          Breakfast & Tiffin
        </button>
        <button class="tab-btn ${currentCanteenCategory === 'snacks' ? 'active' : ''}" onclick="window.setCanteenCategory('snacks')">
          Snacks & Wraps
        </button>
        <button class="tab-btn ${currentCanteenCategory === 'beverage' ? 'active' : ''}" onclick="window.setCanteenCategory('beverage')">
          Beverages & Brews
        </button>
      </div>

      <!-- Veg Only Switch -->
      <button class="btn btn-sm ${filterVegOnly ? 'btn-primary' : 'btn-outline'}" onclick="window.toggleVegFilter()" style="border-radius: var(--radius-full);">
        <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: #059669; margin-right: 4px;"></span>
        ${filterVegOnly ? 'Pure Veg Active' : 'Filter Pure Veg'}
      </button>
    </div>

    <!-- Live Counter Express Info Banner (White & Blue) -->
    <div class="canteen-banner-express">
      <div style="display: flex; align-items: center; gap: 1rem;">
        <div style="font-size: 2.2rem; background: #ffffff; width: 54px; height: 54px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: var(--shadow-sm); border: 1px solid #bfdbfe;">
          📦
        </div>
        <div>
          <h4 style="font-size: 1.05rem; color: #1e3a8a; font-weight: 700; margin-bottom: 0.15rem;">Express Parcel Counter Pickup is LIVE</h4>
          <p style="font-size: 0.82rem; color: #334155;">
            Pre-order your meals before lecture breaks. Pay via Campus SmartCard or UPI, receive your <b>Instant 4-digit Collection OTP</b>, and collect at <b>Counter 2</b>!
          </p>
        </div>
      </div>
      <div style="display: flex; gap: 0.6rem; align-items: center;">
        <span class="badge badge-available">Avg Prep: 5-8 Mins</span>
        <span class="badge" style="background: #eff6ff; color: #2563eb; border: 1px solid #bfdbfe;">Counter 2 Window</span>
      </div>
    </div>

    <!-- Realistic Food Cards Grid -->
    <div class="items-grid" style="margin-bottom: 5rem;">
      ${menu.map(item => {
        const cartItem = cart.find(c => c.id === item.id);
        const qty = cartItem ? cartItem.qty : 0;
        const isNorth = (item.region || '').includes('North');
        const isSouth = (item.region || '').includes('South');
        const regionClass = isNorth ? 'north' : isSouth ? 'south' : 'snack';
        const regionLabel = isNorth ? '🏔️ North Indian' : isSouth ? '🌴 South Indian' : '✨ Special';

        return `
          <div class="food-card">
            <!-- Realistic Image Container -->
            <div class="food-img-wrapper">
              <img 
                src="${item.image}" 
                alt="${item.name}" 
                class="food-img" 
                loading="lazy" 
                onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80';"
              />
              
              <!-- Region Pill Badge -->
              <span class="food-region-pill ${regionClass}">
                ${regionLabel}
              </span>

              <!-- Veg / Non-Veg Indicator -->
              <div class="food-veg-indicator" title="${item.isVeg ? 'Pure Vegetarian' : 'Non-Vegetarian'}">
                <div style="width: 14px; height: 14px; border: 1.5px solid ${item.isVeg ? '#059669' : '#dc2626'}; border-radius: 3px; display: flex; align-items: center; justify-content: center;">
                  <div style="width: 6px; height: 6px; border-radius: 50%; background: ${item.isVeg ? '#059669' : '#dc2626'};"></div>
                </div>
              </div>
            </div>

            <!-- Card Body Content -->
            <div class="food-card-body">
              <div class="food-title-row">
                <div>
                  <h4 class="food-title">${item.name}</h4>
                  <span style="font-size: 0.72rem; color: var(--text-muted); font-weight: 500;">${item.category}</span>
                </div>
                <div class="food-price">₹${item.price}</div>
              </div>

              <p class="food-desc">
                ${item.description}
              </p>

              <div class="food-meta-row">
                <span>🕒 ${item.prepTime}</span>
                <span class="badge badge-primary" style="font-size: 0.7rem; padding: 0.15rem 0.45rem;">★ ${item.rating}</span>
                <span style="color: var(--primary); font-weight: 600;">📍 ${item.counter.split('(')[0].trim()}</span>
              </div>

              <!-- Action Controls -->
              <div>
                ${qty > 0 ? `
                  <div style="display: flex; align-items: center; justify-content: space-between; background: #eff6ff; border: 1px solid #bfdbfe; border-radius: var(--radius-md); padding: 0.35rem 0.75rem;">
                    <button class="btn btn-sm btn-outline" style="padding: 0.2rem 0.65rem; font-size: 1rem; border-color: #93c5fd; color: #1d4ed8; background: #fff;" onclick="window.updateCartQty('${item.id}', -1)">−</button>
                    <span style="font-weight: 700; font-size: 0.95rem; color: #1e3a8a;">${qty} in Tray</span>
                    <button class="btn btn-sm btn-primary" style="padding: 0.2rem 0.65rem; font-size: 1rem;" onclick="window.updateCartQty('${item.id}', 1)">+</button>
                  </div>
                ` : `
                  <button class="btn btn-outline" style="width: 100%; border-color: #bfdbfe; color: #2563eb;" onclick="window.addFoodToCart('${item.id}')">
                    <span>➕</span> Add to Tray
                  </button>
                `}
              </div>
            </div>
          </div>
        `;
      }).join('')}
    </div>

    <!-- Floating Docked Cart Bar (White & Blue) -->
    ${cartTotalQty > 0 ? `
      <div class="canteen-cart-dock">
        <div style="display: flex; align-items: center; gap: 1rem;">
          <div style="width: 44px; height: 44px; border-radius: 50%; background: linear-gradient(135deg, #2563eb, #1d4ed8); display: flex; align-items: center; justify-content: center; font-size: 1.3rem; color: #fff; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);">
            🛒
          </div>
          <div>
            <div style="font-weight: 700; font-size: 1.05rem; color: #0f172a;">
              ${cartTotalQty} Item${cartTotalQty > 1 ? 's' : ''} in Parcel Tray
            </div>
            <div style="font-size: 0.85rem; color: #2563eb; font-weight: 700;">
              Total: ₹${cartTotalPrice} (Incl. Taxes)
            </div>
          </div>
        </div>

        <div style="display: flex; gap: 0.65rem;">
          <button class="btn btn-sm btn-secondary" onclick="window.campusState.clearCart(); window.appRouter.renderCurrentView();">
            Clear
          </button>
          <button class="btn btn-primary" onclick="window.openCanteenCheckoutModal()">
            <span>💳</span> Checkout & Get OTP →
          </button>
        </div>
      </div>
    ` : ''}
  `;
}

// --------------------------------------------------------------------------
// 2. Active Orders & OTP Parcel Passes
// --------------------------------------------------------------------------
function renderCanteenMyOrdersSection(myOrders) {
  return `
    <div style="margin-bottom: 2rem;">
      <h3 style="margin-bottom: 1rem; color: #0f172a;">🧾 Your Cafeteria Parcel Passes</h3>
      
      ${myOrders.length === 0 ? `
        <div class="card" style="text-align: center; padding: 3rem 1.5rem;">
          <div style="font-size: 3rem; margin-bottom: 0.75rem;">🍽️</div>
          <h4>No active orders placed yet</h4>
          <p style="font-size: 0.85rem; margin: 0.5rem 0 1.25rem;">Choose delicious Northern or Southern dishes from the menu and pick up your parcel at Counter 2 using your secure OTP.</p>
          <button class="btn btn-primary" onclick="window.setCanteenViewMode('menu')">Browse Today's Menu</button>
        </div>
      ` : `
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 1.5rem;">
          ${myOrders.map(order => `
            <div class="card" style="border-color: ${order.status === 'ready_for_pickup' ? 'var(--status-available)' : order.status === 'collected' ? 'var(--border-subtle)' : '#93c5fd'}; position: relative; overflow: hidden;">
              ${order.status === 'ready_for_pickup' ? `
                <div style="position: absolute; top: 0; right: 0; background: #059669; color: #ffffff; font-weight: 800; font-size: 0.7rem; padding: 0.25rem 0.8rem; border-bottom-left-radius: var(--radius-sm); text-transform: uppercase;">
                  READY FOR COLLECTION!
                </div>
              ` : ''}

              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem;">
                <div>
                  <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 600;">ORDER TOKEN</span>
                  <div style="font-size: 1.4rem; font-weight: 800; color: #1d4ed8; font-family: var(--font-heading);">${order.token}</div>
                </div>
                <span class="badge ${order.status === 'collected' ? 'badge-available' : order.status === 'ready_for_pickup' ? 'badge-primary' : 'badge-pending'}">
                  ${order.status.replace(/_/g, ' ').toUpperCase()}
                </span>
              </div>

              <!-- High Visibility OTP Display Card (White & Blue) -->
              <div class="canteen-otp-card">
                <div style="font-size: 0.72rem; text-transform: uppercase; color: #475569; letter-spacing: 0.08em; font-weight: 700;">
                  PARCEL PICKUP OTP
                </div>
                <div class="canteen-otp-code">
                  ${order.otp}
                </div>
                <div style="font-size: 0.78rem; color: #2563eb; font-weight: 600;">
                  🔒 Share this 4-digit OTP at <b>${order.pickupCounter}</b>
                </div>
              </div>

              <!-- Items Breakdown -->
              <div style="display: flex; flex-direction: column; gap: 0.4rem; margin-top: 1rem; margin-bottom: 0.85rem; font-size: 0.82rem; background: var(--bg-surface); padding: 0.75rem; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">
                ${order.items.map(it => `
                  <div style="display: flex; justify-content: space-between;">
                    <span>${it.qty}x ${it.name}</span>
                    <b>₹${it.price * it.qty}</b>
                  </div>
                `).join('')}
                <div style="display: flex; justify-content: space-between; border-top: 1px solid var(--border-subtle); padding-top: 0.4rem; font-weight: 800; color: #1d4ed8;">
                  <span>Total Paid</span>
                  <span>₹${order.totalAmount}</span>
                </div>
              </div>

              <div style="font-size: 0.75rem; color: var(--text-muted); display: flex; justify-content: space-between; align-items: center;">
                <span>🕒 Ordered at: ${order.time}</span>
                <span>💳 ${order.paymentMethod}</span>
              </div>

              <div style="margin-top: 1rem; display: flex; gap: 0.5rem;">
                <button class="btn btn-sm btn-primary" style="width: 100%;" onclick="window.openOrderPassModal('${order.id}')">
                  <span>📱</span> View Digital Pickup Pass
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      `}
    </div>
  `;
}

// --------------------------------------------------------------------------
// 3. Parcel Counter Live Desk (Operator / Staff Terminal)
// --------------------------------------------------------------------------
function renderCanteenCounterDeskSection(allOrders) {
  const activeOrders = allOrders.filter(o => o.status !== 'collected');

  return `
    <div style="margin-bottom: 2rem;">
      <div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); padding: 1.5rem; margin-bottom: 2rem; box-shadow: var(--shadow-sm);">
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; border-bottom: 1px solid var(--border-subtle); padding-bottom: 1rem; margin-bottom: 1.25rem;">
          <div>
            <span class="badge badge-primary" style="margin-bottom: 0.3rem;">PARCEL WINDOW TERMINAL</span>
            <h3 style="font-size: 1.3rem;">Express Parcel Counter #2 (Live Dispatch)</h3>
            <p style="font-size: 0.85rem; color: var(--text-muted);">Counter operators can verify student OTPs here to dispense hot packed parcels.</p>
          </div>
          
          <!-- Instant OTP Verification Form for Staff -->
          <div style="background: #eff6ff; padding: 0.85rem 1.2rem; border-radius: var(--radius-md); border: 1px solid #bfdbfe; display: flex; align-items: center; gap: 0.6rem;">
            <input type="text" id="staff-verify-otp" placeholder="Enter 4-digit OTP" maxlength="4" style="background: #ffffff; border: 1px solid #93c5fd; color: #1e3a8a; font-family: var(--font-heading); font-size: 1.2rem; font-weight: 800; width: 140px; padding: 0.45rem 0.75rem; border-radius: var(--radius-sm); text-align: center; outline: none; letter-spacing: 0.15rem;" />
            <button class="btn btn-sm btn-primary" onclick="window.staffVerifyOTPInput()">
              ✅ Verify & Handover
            </button>
          </div>
        </div>

        <!-- Live Queue of Waiting Parcels -->
        <h4 style="font-size: 1rem; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem; color: #0f172a;">
          <span>⏳</span> Pending Counter Collections (${activeOrders.length})
        </h4>

        ${activeOrders.length === 0 ? `
          <p style="font-size: 0.85rem; color: var(--text-muted); text-align: center; padding: 2rem 0;">No parcels pending collection at this counter.</p>
        ` : `
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1rem;">
            ${activeOrders.map(order => `
              <div style="background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 1.1rem; display: flex; flex-direction: column; gap: 0.6rem;">
                <div style="display: flex; align-items: center; justify-content: space-between;">
                  <div>
                    <span style="font-size: 0.7rem; color: var(--text-muted); font-weight: 600;">TOKEN</span>
                    <h4 style="font-size: 1.25rem; color: #1d4ed8;">${order.token}</h4>
                  </div>
                  <div style="text-align: right;">
                    <div style="font-size: 0.7rem; color: var(--text-muted); font-weight: 600;">CUSTOMER OTP</div>
                    <span style="font-family: var(--font-heading); font-size: 1.15rem; font-weight: 800; color: #1e40af; background: #dbeafe; padding: 0.2rem 0.6rem; border-radius: var(--radius-sm);">${order.otp}</span>
                  </div>
                </div>

                <div style="font-size: 0.82rem; color: var(--text-primary);">
                  <b>Customer:</b> ${order.user}<br/>
                  <b>Items:</b> ${order.items.map(i => `${i.qty}x ${i.name}`).join(', ')}<br/>
                  <div style="margin-top: 0.25rem; display: flex; align-items: center; gap: 0.4rem; flex-wrap: wrap;">
                    <span class="badge ${order.paymentMethod.includes('Cash') ? 'badge-pending' : 'badge-available'}" style="font-size: 0.72rem; padding: 0.15rem 0.5rem;">${order.paymentMethod}</span>
                    ${order.paymentMethod.includes('Cash') ? `<span style="font-weight: 800; color: #b45309; font-size: 0.78rem; background: #fffbeb; padding: 0.15rem 0.4rem; border-radius: 4px; border: 1px solid #fde68a;">💵 Collect: ₹${order.totalAmount}</span>` : ''}
                  </div>
                </div>

                <div style="display: flex; gap: 0.5rem; margin-top: auto; padding-top: 0.5rem; border-top: 1px solid var(--border-subtle);">
                  ${order.status === 'preparing' ? `
                    <button class="btn btn-sm btn-outline" style="flex: 1;" onclick="window.campusState.updateCanteenOrderStatus('${order.id}', 'ready_for_pickup'); window.appRouter.renderCurrentView();">
                      Mark Ready for Pickup
                    </button>
                  ` : ''}
                  <button class="btn btn-sm btn-primary" style="flex: 1;" onclick="window.staffDirectHandover('${order.id}')">
                    Mark Handed Over
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        `}
      </div>
    </div>
  `;
}

// --------------------------------------------------------------------------
// Helper Interactions & Handlers
// --------------------------------------------------------------------------
window.setCanteenViewMode = function(mode) {
  canteenViewMode = mode;
  window.appRouter.renderCurrentView();
};

window.setCanteenCategory = function(cat) {
  currentCanteenCategory = cat;
  window.appRouter.renderCurrentView();
};

window.toggleVegFilter = function() {
  filterVegOnly = !filterVegOnly;
  window.appRouter.renderCurrentView();
};

window.addFoodToCart = function(foodId) {
  window.campusState.addToCart(foodId);
  window.showToast('Item added to parcel tray!');
  window.appRouter.renderCurrentView();
};

window.updateCartQty = function(foodId, delta) {
  window.campusState.updateCartQty(foodId, delta);
  window.appRouter.renderCurrentView();
};

// Checkout & Digital Payment Modal
window.openCanteenCheckoutModal = function() {
  const state = window.campusState.data;
  const cart = state.canteenCart || [];
  if (cart.length === 0) return;

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const packagingFee = 10; // eco parcel container packaging
  const total = subtotal + packagingFee;

  const modalHTML = `
    <div class="modal-backdrop active" id="canteen-checkout-modal">
      <div class="modal-container" style="max-width: 540px;">
        <div class="modal-header">
          <div style="display: flex; align-items: center; gap: 0.6rem;">
            <span style="font-size: 1.5rem;">🍱</span>
            <h3>Checkout & Parcel Order</h3>
          </div>
          <button class="modal-close" onclick="window.closeModal('canteen-checkout-modal')">&times;</button>
        </div>
        <div class="modal-body">
          <!-- Items Summary -->
          <div style="background: var(--bg-surface); padding: 1rem; border-radius: var(--radius-md); margin-bottom: 1.25rem; border: 1px solid var(--border-subtle);">
            <h4 style="font-size: 0.95rem; margin-bottom: 0.6rem; color: #0f172a;">Order Breakdown:</h4>
            <div style="display: flex; flex-direction: column; gap: 0.4rem; font-size: 0.85rem;">
              ${cart.map(item => `
                <div style="display: flex; justify-content: space-between;">
                  <span>${item.qty}x ${item.name}</span>
                  <b>₹${item.price * item.qty}</b>
                </div>
              `).join('')}
              <div style="display: flex; justify-content: space-between; color: var(--text-muted); font-size: 0.8rem; margin-top: 0.2rem;">
                <span>Eco-Friendly Parcel Packing Fee</span>
                <span>₹${packagingFee}</span>
              </div>
              <div style="display: flex; justify-content: space-between; border-top: 1px solid var(--border-subtle); padding-top: 0.6rem; font-size: 1.05rem; font-weight: 800; color: #1d4ed8;">
                <span>Grand Total</span>
                <span>₹${total}</span>
              </div>
            </div>
          </div>

          <!-- Pickup Counter Selector -->
          <div class="form-group">
            <label class="form-label">Select Express Collection Counter *</label>
            <select class="form-select" id="order-pickup-counter">
              <option value="Parcel Counter 2 (Express Pickup Window)" selected>Counter 2 - Express Parcel Window (East Wing)</option>
              <option value="Counter 1 (North & South Tiffin Counter)">Counter 1 - North & South Tiffin Counter</option>
              <option value="Counter 3 (Tandoor & Non-Veg Special)">Counter 3 - Tandoor & Non-Veg Special</option>
              <option value="Counter 4 (Beverages & Desserts)">Counter 4 - Beverages & Desserts Bar</option>
            </select>
          </div>

          <!-- Payment Options -->
          <div class="form-group" style="margin-top: 1rem;">
            <label class="form-label">Payment Method *</label>
            <div style="display: flex; flex-direction: column; gap: 0.6rem; margin-top: 0.3rem;">
              <label style="background: var(--bg-surface); border: 1px solid var(--border-focus); border-radius: var(--radius-md); padding: 0.75rem 1rem; display: flex; align-items: center; justify-content: space-between; cursor: pointer;">
                <div style="display: flex; align-items: center; gap: 0.6rem;">
                  <input type="radio" name="pay-method" value="Campus SmartCard RFID" checked />
                  <div>
                    <b style="font-size: 0.9rem; color: #0f172a;">Campus SmartCard (RFID)</b>
                    <div style="font-size: 0.75rem; color: #059669; font-weight: 600;">Available Balance: ₹850.00</div>
                  </div>
                </div>
                <span>💳</span>
              </label>

              <label style="background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 0.75rem 1rem; display: flex; align-items: center; justify-content: space-between; cursor: pointer;">
                <div style="display: flex; align-items: center; gap: 0.6rem;">
                  <input type="radio" name="pay-method" value="Instant UPI (GPay / PhonePe / Paytm)" />
                  <div>
                    <b style="font-size: 0.9rem; color: #0f172a;">Instant UPI (Google Pay, PhonePe, Paytm)</b>
                    <div style="font-size: 0.75rem; color: var(--text-muted);">Zero convenience charges &bull; Instant QR</div>
                  </div>
                </div>
                <span>📱</span>
              </label>

              <label style="background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 0.75rem 1rem; display: flex; align-items: center; justify-content: space-between; cursor: pointer;">
                <div style="display: flex; align-items: center; gap: 0.6rem;">
                  <input type="radio" name="pay-method" value="Cash on Delivery (Pay at Counter)" />
                  <div>
                    <b style="font-size: 0.9rem; color: #0f172a;">Cash on Delivery (COD)</b>
                    <div style="font-size: 0.75rem; color: #2563eb; font-weight: 600;">Pay cash directly at the counter window upon OTP parcel collection</div>
                  </div>
                </div>
                <span>💵</span>
              </label>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" onclick="window.closeModal('canteen-checkout-modal')">Cancel</button>
          <button type="button" class="btn btn-primary" onclick="window.confirmCanteenPayment(${total})">
            <span>🔒</span> Pay ₹${total} & Generate Pickup OTP
          </button>
        </div>
      </div>
    </div>
  `;
  window.appendModalToDOM(modalHTML);
};

window.confirmCanteenPayment = function(totalAmount) {
  const counterEl = document.getElementById('order-pickup-counter');
  const counter = counterEl ? counterEl.value : 'Parcel Counter 2 (Express Window)';
  const payMethod = document.querySelector('input[name="pay-method"]:checked')?.value || 'Campus SmartCard';

  const order = window.campusState.placeCanteenOrder({
    totalAmount,
    pickupCounter: counter,
    paymentMethod: payMethod
  });

  window.closeModal('canteen-checkout-modal');
  const isCOD = payMethod.includes('Cash');
  const msg = isCOD 
    ? `Order ${order.token} placed (Cash on Delivery: ₹${totalAmount})! Pay at counter. OTP: ${order.otp}.`
    : `Payment of ₹${totalAmount} received! Your OTP is ${order.otp}.`;
  window.showToast(msg);
  
  // Switch to My Orders and open digital pass
  canteenViewMode = 'my_orders';
  window.appRouter.renderCurrentView();
  window.openOrderPassModal(order.id);
};

// Digital Parcel Pickup Pass & OTP Modal (White & Blue)
window.openOrderPassModal = function(orderId) {
  const state = window.campusState.data;
  const order = (state.canteenOrders || []).find(o => o.id === orderId);
  if (!order) return;

  const modalHTML = `
    <div class="modal-backdrop active" id="order-pass-modal">
      <div class="modal-container" style="max-width: 440px; text-align: center;">
        <div class="modal-header">
          <h3>📦 Parcel Collection Pass</h3>
          <button class="modal-close" onclick="window.closeModal('order-pass-modal')">&times;</button>
        </div>
        <div class="modal-body">
          <div style="background: linear-gradient(135deg, #eff6ff, #dbeafe); border: 1.5px solid #bfdbfe; border-radius: var(--radius-lg); padding: 1.4rem; margin-bottom: 1.25rem;">
            <div style="font-size: 0.72rem; text-transform: uppercase; color: #1d4ed8; letter-spacing: 0.1em; font-weight: 800;">
              SMARTCAMPUS CAFETERIA PARCEL PASS
            </div>

            <div style="margin: 0.5rem 0;">
              <span style="font-size: 0.8rem; color: #475569; font-weight: 600;">ORDER TOKEN</span>
              <div style="font-size: 2.2rem; font-weight: 900; color: #1e3a8a; font-family: var(--font-heading);">${order.token}</div>
            </div>

            <!-- Prominent OTP Code Block -->
            <div style="background: #ffffff; border: 2px dashed #2563eb; border-radius: var(--radius-md); padding: 1rem; margin: 1rem 0; box-shadow: var(--shadow-sm);">
              <div style="font-size: 0.7rem; text-transform: uppercase; color: var(--text-muted); font-weight: 700;">
                COLLECTION OTP
              </div>
              <div style="font-size: 2.6rem; font-weight: 900; letter-spacing: 0.35em; color: #1d4ed8; font-family: var(--font-heading); margin: 0.2rem 0;">
                ${order.otp}
              </div>
              <div style="font-size: 0.78rem; color: #059669; font-weight: 600;">
                Show or read this code at the parcel window
              </div>
            </div>

            <div style="font-size: 0.88rem; color: #0f172a; font-weight: 700;">
              📍 ${order.pickupCounter}
            </div>
            <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.2rem;">
              Status: <b style="color: #2563eb;">${order.status.replace(/_/g, ' ').toUpperCase()}</b> &bull; ${order.estimatedReady}
            </div>
            <div style="margin-top: 0.45rem;">
              <span class="badge ${order.paymentMethod.includes('Cash') ? 'badge-pending' : 'badge-available'}">
                💳 ${order.paymentMethod}
              </span>
              ${order.paymentMethod.includes('Cash') ? `
                <div style="margin-top: 0.4rem; font-size: 0.78rem; font-weight: 700; color: #b45309; background: #fffbeb; border: 1px solid #fde68a; border-radius: var(--radius-sm); padding: 0.35rem 0.6rem;">
                  💵 Cash on Delivery: Please pay ₹${order.totalAmount} in cash at the counter window.
                </div>
              ` : ''}
            </div>

            <!-- QR Code for fast contactless counter scanner -->
            <div class="qr-code-box" style="margin: 1.25rem auto 0; width: 140px; height: 140px; padding: 0.75rem; background: #ffffff; border: 1px solid #bfdbfe; border-radius: var(--radius-md);">
              <svg viewBox="0 0 100 100" width="115" height="115">
                <rect x="5" y="5" width="25" height="25" fill="#1e3a8a" rx="2" />
                <rect x="9" y="9" width="17" height="17" fill="#fff" />
                <rect x="13" y="13" width="9" height="9" fill="#1e3a8a" />
                <rect x="70" y="5" width="25" height="25" fill="#1e3a8a" rx="2" />
                <rect x="74" y="9" width="17" height="17" fill="#fff" />
                <rect x="78" y="13" width="9" height="9" fill="#1e3a8a" />
                <rect x="5" y="70" width="25" height="25" fill="#1e3a8a" rx="2" />
                <rect x="9" y="74" width="17" height="17" fill="#fff" />
                <rect x="13" y="78" width="9" height="9" fill="#1e3a8a" />
                <rect x="35" y="10" width="10" height="10" fill="#2563eb" />
                <rect x="50" y="15" width="15" height="5" fill="#1e3a8a" />
                <rect x="35" y="35" width="30" height="30" fill="#3b82f6" rx="4" />
                <rect x="70" y="50" width="15" height="8" fill="#1e3a8a" />
                <rect x="40" y="75" width="20" height="10" fill="#2563eb" />
              </svg>
            </div>
          </div>

          <p style="font-size: 0.78rem; color: var(--text-muted);">
            Once food is packed, staff will call token <b>${order.token}</b>. Share OTP <b>${order.otp}</b> to collect your parcel.
          </p>
        </div>
        <div class="modal-footer" style="justify-content: center;">
          <button class="btn btn-secondary" onclick="window.closeModal('order-pass-modal')">Done</button>
        </div>
      </div>
    </div>
  `;
  window.appendModalToDOM(modalHTML);
};

// Staff Terminal Verification Logic
window.staffVerifyOTPInput = function() {
  const input = document.getElementById('staff-verify-otp');
  if (!input || !input.value.trim()) {
    window.showToast('Please type a 4-digit OTP.');
    return;
  }

  const otp = input.value.trim();
  const state = window.campusState.data;
  const match = (state.canteenOrders || []).find(o => o.otp === otp && o.status !== 'collected');

  if (match) {
    const res = window.campusState.verifyCanteenOTP(match.id, otp);
    if (res.success) {
      window.showToast(`✅ OTP ${otp} Verified! Parcel for Token ${match.token} handed over.`);
      input.value = '';
      window.appRouter.renderCurrentView();
    }
  } else {
    window.showToast(`❌ Invalid OTP: No pending order found for OTP "${otp}".`);
  }
};

window.staffDirectHandover = function(orderId) {
  const order = window.campusState.data.canteenOrders.find(o => o.id === orderId);
  if (order) {
    window.campusState.verifyCanteenOTP(orderId, order.otp);
    window.showToast(`Parcel for token ${order.token} marked as collected!`);
    window.appRouter.renderCurrentView();
  }
};
