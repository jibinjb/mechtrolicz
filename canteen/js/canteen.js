/**
 * Smart Canteen Management Platform
 * Canteen Side & Kitchen Staff Controller
 */

class CanteenConsole {
  constructor(storage, audio) {
    this.storage = storage;
    this.audio = audio;
    this.activeFilter = "all";
    this.deliveryFilter = "all"; // 'all' | 'pickup' | 'classroom'
    this.init();
  }

  setDeliveryFilter(filter) {
    this.deliveryFilter = filter;
    if (this.audio) this.audio.playTap();
    this.renderOrdersBoard();
  }

  init() {
    this.renderStats();
    this.renderOrdersBoard();
    this.renderQuickStock();
    this.renderLowStockAlerts();

    // Listen for cross-tab updates (when student places order on index.html)
    this.storage.on("ordersUpdated", () => {
      this.renderStats();
      this.renderOrdersBoard();
    });
    this.storage.on("menuUpdated", () => {
      this.renderQuickStock();
    });
    this.storage.on("inventoryUpdated", () => {
      this.renderLowStockAlerts();
    });
  }

  // --- Summary Metrics ---
  renderStats() {
    const orders = this.storage.getOrders();
    const placed = orders.filter(o => ["PLACED", "PAYMENT_CONFIRMED"].includes(o.orderStatus)).length;
    const preparing = orders.filter(o => ["ACCEPTED", "PREPARING"].includes(o.orderStatus)).length;
    const ready = orders.filter(o => o.orderStatus === "READY").length;
    const completed = orders.filter(o => o.orderStatus === "COLLECTED").length + 380;

    const setEl = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = val;
    };

    setEl("canteen-stat-placed", placed);
    setEl("canteen-stat-preparing", preparing);
    setEl("canteen-stat-ready", ready);
    setEl("canteen-stat-completed", completed);
  }

  // --- Live Kitchen Kanban Board ---
  renderOrdersBoard() {
    const container = document.getElementById("canteen-orders-board");
    if (!container) return;

    const allOrders = this.storage.getOrders();
    const pickupTotal = allOrders.filter(o => o.deliveryType !== "classroom").length;
    const classroomTotal = allOrders.filter(o => o.deliveryType === "classroom").length;

    let filteredOrders = allOrders;
    if (this.deliveryFilter === "pickup") {
      filteredOrders = allOrders.filter(o => o.deliveryType !== "classroom");
    } else if (this.deliveryFilter === "classroom") {
      filteredOrders = allOrders.filter(o => o.deliveryType === "classroom");
    }

    const placedOrders = filteredOrders.filter(o => ["PLACED", "PAYMENT_CONFIRMED"].includes(o.orderStatus));
    const preparingOrders = filteredOrders.filter(o => ["ACCEPTED", "PREPARING"].includes(o.orderStatus));
    const readyOrders = filteredOrders.filter(o => o.orderStatus === "READY");
    const completedOrders = filteredOrders.filter(o => ["COLLECTED", "CANCELLED", "REFUNDED"].includes(o.orderStatus)).slice(0, 10);

    container.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 1rem;">
        <div class="kds-filter-tabs">
          <button class="kds-filter-btn ${this.deliveryFilter === 'all' ? 'active' : ''}" onclick="window.canteenConsole.setDeliveryFilter('all')">
            <span>All Orders (${allOrders.length})</span>
          </button>
          <button class="kds-filter-btn ${this.deliveryFilter === 'pickup' ? 'active' : ''}" onclick="window.canteenConsole.setDeliveryFilter('pickup')">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            <span>Counter Pickup (${pickupTotal})</span>
          </button>
          <button class="kds-filter-btn ${this.deliveryFilter === 'classroom' ? 'active' : ''}" onclick="window.canteenConsole.setDeliveryFilter('classroom')">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
            <span>Classroom Delivery (${classroomTotal})</span>
          </button>
        </div>

        <button class="btn-primary" style="padding: 0.5rem 0.95rem; font-size: 0.82rem; background: linear-gradient(135deg, #7C3AED, #6D28D9); box-shadow: 0 4px 14px rgba(124, 58, 237, 0.3);" onclick="window.canteenConsole.simulateClassroomOrder()">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2.2"><path d="M12 5v14M5 12h14"/></svg>
          <span>Simulate Classroom Order</span>
        </button>
      </div>

      <div class="kanban-grid">
        <!-- 1. Placed / New Orders -->
        <div class="kanban-column">
          <div class="kanban-column-header">
            <div class="kanban-col-name">
              <span class="pulse-indicator-dot"></span>
              <span>New Orders</span>
            </div>
            <span class="kanban-counter">${placedOrders.length}</span>
          </div>
          <div class="kanban-card-list">
            ${placedOrders.length === 0 
              ? '<div style="text-align:center; padding: 2.5rem 1rem; color: var(--text-muted); font-size: 0.88rem;">No new incoming orders in this filter.<br><span style="font-size:0.78rem;">Orders appear here automatically.</span></div>' 
              : placedOrders.map(o => this.renderOrderCard(o, "PLACED")).join("")
            }
          </div>
        </div>

        <!-- 2. In Preparation -->
        <div class="kanban-column">
          <div class="kanban-column-header">
            <div class="kanban-col-name">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" style="color: var(--brand-orange);"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              <span>Cooking & Prep</span>
            </div>
            <span class="kanban-counter" style="background: rgba(255, 94, 0, 0.15); color: var(--brand-orange-deep);">${preparingOrders.length}</span>
          </div>
          <div class="kanban-card-list">
            ${preparingOrders.length === 0 
              ? '<div style="text-align:center; padding: 2.5rem 1rem; color: var(--text-muted); font-size: 0.88rem;">Kitchen wok free.<br><span style="font-size:0.78rem;">Accept orders to begin preparation.</span></div>' 
              : preparingOrders.map(o => this.renderOrderCard(o, "PREPARING")).join("")
            }
          </div>
        </div>

        <!-- 3. Ready / Out for Delivery -->
        <div class="kanban-column">
          <div class="kanban-column-header">
            <div class="kanban-col-name">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2.2"><path d="M18 8h1a4 4 0 1 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4Z"/></svg>
              <span>Ready / Dispatched</span>
            </div>
            <span class="kanban-counter" style="background: rgba(16, 185, 129, 0.15); color: #059669;">${readyOrders.length}</span>
          </div>
          <div class="kanban-card-list">
            ${readyOrders.length === 0 
              ? '<div style="text-align:center; padding: 2.5rem 1rem; color: var(--text-muted); font-size: 0.88rem;">No meals waiting for collection/dispatch.</div>' 
              : readyOrders.map(o => this.renderOrderCard(o, "READY")).join("")
            }
          </div>
        </div>

        <!-- 4. Collected / History -->
        <div class="kanban-column">
          <div class="kanban-column-header">
            <div class="kanban-col-name">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polyline points="20 6 9 17 4 12"/></svg>
              <span>Delivered & Done</span>
            </div>
            <span class="kanban-counter" style="background: rgba(0,0,0,0.06); color: var(--text-secondary);">${completedOrders.length}</span>
          </div>
          <div class="kanban-card-list">
            ${completedOrders.length === 0 
              ? '<div style="text-align:center; padding: 2.5rem 1rem; color: var(--text-muted); font-size: 0.88rem;">No completed orders yet today.</div>' 
              : completedOrders.map(o => this.renderOrderCard(o, "COMPLETED")).join("")
            }
          </div>
        </div>
      </div>
    `;
  }

  renderOrderCard(order, colType) {
    const isClassroom = order.deliveryType === "classroom";
    let actionBtns = "";

    if (colType === "PLACED") {
      actionBtns = `
        <button class="btn-primary" style="flex: 1; padding: 0.5rem 0.75rem; font-size: 0.82rem;" onclick="window.canteenConsole.updateStatus('${order.id}', 'PREPARING')">
          Accept & Cook
        </button>
        <button class="btn-secondary" style="padding: 0.5rem 0.75rem; font-size: 0.82rem; color: #DC2626; border-color: rgba(220, 38, 38, 0.3);" onclick="window.canteenConsole.cancelOrderPrompt('${order.id}')">
          Cancel
        </button>
      `;
    } else if (colType === "PREPARING") {
      actionBtns = isClassroom ? `
        <button class="btn-primary" style="width: 100%; background: linear-gradient(135deg, #7C3AED, #6D28D9); color: #fff; padding: 0.55rem 0.75rem; font-size: 0.84rem; display: flex; align-items: center; justify-content: center; gap: 0.35rem;" onclick="window.canteenConsole.updateStatus('${order.id}', 'READY')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/></svg>
          <span>Dispatch with Runner 🏃</span>
        </button>
      ` : `
        <button class="btn-primary" style="width: 100%; background: linear-gradient(135deg, #10B981, #059669); color: #fff; padding: 0.55rem 0.75rem; font-size: 0.84rem;" onclick="window.canteenConsole.updateStatus('${order.id}', 'READY')">
          Mark Ready & Notify
        </button>
      `;
    } else if (colType === "READY") {
      actionBtns = isClassroom ? `
        <button class="btn-primary" style="width: 100%; background: linear-gradient(135deg, #10B981, #059669); color: #fff; padding: 0.55rem 0.75rem; font-size: 0.84rem;" onclick="window.canteenConsole.updateStatus('${order.id}', 'COLLECTED')">
          Mark Delivered to Room ✓
        </button>
      ` : `
        <button class="btn-primary" style="width: 100%; padding: 0.55rem 0.75rem; font-size: 0.84rem;" onclick="window.canteenConsole.updateStatus('${order.id}', 'COLLECTED')">
          Mark Picked Up
        </button>
      `;
    } else {
      actionBtns = `
        <div style="font-size: 0.75rem; color: var(--text-secondary); text-align: right;">
          Status: <strong style="color: ${order.orderStatus === 'COLLECTED' ? '#059669' : (order.orderStatus === 'REFUNDED' ? '#D97706' : '#DC2626')};">${order.orderStatus}</strong>
          ${order.returnDetails ? `<br><span style="color:#B45309; font-weight:700;">Refund: ${order.returnDetails.reasonLabel || 'Policy Claim'}</span>` : ''}
          ${isClassroom ? '<br><span style="color:#7C3AED; font-weight:700;">Delivered to Desk</span>' : ''}
        </div>
      `;
    }

    return `
      <div class="admin-order-ticket" data-id="${order.id}">
        ${isClassroom ? `
          <div class="ticket-classroom-header">
            <div class="ticket-classroom-title">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
              <span>Classroom Delivery</span>
            </div>
            <div class="ticket-classroom-room">
              ${order.classroomDetails?.room || 'Room'}
            </div>
          </div>
        ` : `
          <div class="ticket-pickup-header">
            <span>Counter Pickup (Counter 2)</span>
            <span>Token #${order.tokenNumber}</span>
          </div>
        `}

        <div class="ticket-header" style="margin-top: 0.25rem;">
          <span class="ticket-token">Token #${order.tokenNumber}</span>
          <span style="font-size: 0.74rem; color: var(--text-secondary); font-weight: 600;">
            ${order.orderType || 'Standard'} • ${order.pickupTime || 'ASAP'}
          </span>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: baseline;">
          <div style="font-size: 0.92rem; font-weight: 800; color: var(--text-dark);">
            ${order.userName}
          </div>
          <div style="font-size: 0.76rem; color: var(--text-muted); font-weight: 600;">
            ${order.userPhone || ''}
          </div>
        </div>

        ${isClassroom ? `
          <div style="font-size: 0.8rem; font-weight: 700; color: #6D28D9; margin-top: 3px;">
            📍 ${order.classroomDetails?.block || 'Campus Block'} • <strong>${order.classroomDetails?.room || ''}</strong>
          </div>
        ` : ''}

        <div style="border-top: 1px dashed var(--glass-border-subtle); border-bottom: 1px dashed var(--glass-border-subtle); padding: 0.5rem 0; display: flex; flex-direction: column; gap: 0.3rem; font-size: 0.84rem;">
          ${order.items.map(it => `
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span><strong style="color: var(--brand-orange-deep);">${it.quantity}x</strong> ${it.name}</span>
              <span style="font-weight: 700; color: var(--text-secondary);">₹${it.price * it.quantity}</span>
            </div>
          `).join("")}
          ${(order.classroomDetails?.instructions || order.notes) ? `
            <div style="color: ${isClassroom ? '#6D28D9' : '#D97706'}; font-size: 0.76rem; font-style: italic; background: ${isClassroom ? '#FAF5FF' : 'rgba(245, 158, 11, 0.08)'}; border: 1px dashed ${isClassroom ? '#D8B4FE' : 'transparent'}; padding: 3px 6px; border-radius: 4px;">
              ${isClassroom ? 'Room Note: "' + (order.classroomDetails?.instructions || order.notes) + '"' : 'Note: "' + order.notes + '"'}
            </div>
          ` : ''}
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.85rem;">
          <span style="color: var(--text-muted); font-size: 0.75rem; text-transform: uppercase; font-weight: 700;">${order.paymentMethod || 'Campus Wallet'}</span>
          <span style="font-family: var(--font-heading); font-weight: 800; font-size: 1.05rem; color: var(--brand-orange-deep);">₹${order.total.toFixed(2)}</span>
        </div>

        <div style="display: flex; gap: 0.4rem; margin-top: 0.2rem;">
          ${actionBtns}
        </div>
      </div>
    `;
  }

  updateStatus(orderId, nextStatus) {
    const order = this.storage.updateOrderStatus(orderId, nextStatus);
    if (!order) return;

    const isClassroom = order.deliveryType === "classroom";

    if (nextStatus === "READY") {
      this.audio.playOrderReady();
      if (isClassroom) {
        this.showToast(`Runner Dispatched! #${order.tokenNumber}`, `Out for delivery to ${order.classroomDetails?.room || 'classroom'}.`, "success");
      } else {
        this.showToast(`Order Ready! #${order.tokenNumber}`, "Notified student for Counter 2 pickup.", "success");
      }
    } else if (nextStatus === "COLLECTED") {
      this.audio.playTap();
      if (isClassroom) {
        this.showToast(`Delivered to Room! #${order.tokenNumber}`, `Meal delivered to ${order.classroomDetails?.room || 'classroom'}.`, "success");
      } else {
        this.showToast(`Order Completed! #${order.tokenNumber}`, "Meal successfully handed to student.", "success");
      }
    } else {
      this.audio.playTap();
      this.showToast(`Order #${order.tokenNumber}`, `Moved to ${nextStatus}`, "info");
    }
  }

  simulateClassroomOrder() {
    const mockStudents = [
      { name: "Ananya Iyer", phone: "+91 98450 12345", block: "Block B (Computer Science & IT)", room: "Room 304", note: "Row 3, near podium" },
      { name: "Rohit Verma", phone: "+91 97112 34567", block: "Block A (Main Academic)", room: "LH-101", note: "Leave with Class Rep" },
      { name: "Sneha Nair", phone: "+91 99880 55443", block: "Block C (Engineering)", room: "Lab 2", note: "Call on arrival" }
    ];
    const rand = mockStudents[Math.floor(Math.random() * mockStudents.length)];
    const menu = this.storage.getMenuItems().filter(m => m.available);
    const randItem = menu[Math.floor(Math.random() * menu.length)];

    const newOrd = this.storage.createOrder({
      userId: "usr_sim_" + Date.now(),
      userName: rand.name,
      userPhone: rand.phone,
      items: [
        { itemId: randItem.id, name: randItem.name, price: randItem.price, quantity: 1, isVeg: randItem.isVeg }
      ],
      subtotal: randItem.price,
      discount: Math.round(randItem.price * 0.1),
      gst: Math.round(randItem.price * 0.05),
      deliveryFee: 0,
      total: randItem.price - Math.round(randItem.price * 0.1) + Math.round(randItem.price * 0.05),
      paymentMethod: "Razorpay (UPI)",
      paymentStatus: "Paid",
      deliveryType: "classroom",
      classroomDetails: {
        block: rand.block,
        room: rand.room,
        instructions: rand.note,
        phone: rand.phone,
        timing: "Immediate (~15-20 min)"
      },
      orderType: "Classroom Delivery",
      pickupTime: `${rand.block} • ${rand.room}`,
      notes: `Classroom Delivery: ${rand.room}. ${rand.note}`
    });

    this.audio.playTap();
    this.showToast(`New Classroom Order #${newOrd.tokenNumber}`, `Delivery to ${rand.block} - ${rand.room}`, "success");
  }

  cancelOrderPrompt(orderId) {
    const reason = prompt("Enter cancellation reason (Student will receive full refund to Campus Wallet):", "Ingredient out of stock");
    if (reason !== null) {
      this.storage.updateOrderStatus(orderId, "CANCELLED");
      this.audio.playTap();
      this.showToast("Order Cancelled", "Order cancelled and student refunded.", "warning");
    }
  }

  // --- Fast Kitchen Menu Item Stock & Out-of-Stock Toggle ---
  renderQuickStock() {
    const container = document.getElementById("canteen-quick-stock-container");
    if (!container) return;

    const items = this.storage.getMenuItems();

    container.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 1rem;">
        <div>
          <h3 class="section-title" style="font-size: 1.3rem;">Instant Item Availability & Stock Control</h3>
          <p class="section-subtitle">Toggle food items Sold Out / Available instantly to update the student ordering website in real time.</p>
        </div>
        <div style="display: flex; gap: 0.5rem;">
          <button class="btn-secondary" style="font-size: 0.8rem; padding: 0.4rem 0.8rem;" onclick="window.canteenConsole.filterCategory('all')">All Items (${items.length})</button>
          <button class="btn-secondary" style="font-size: 0.8rem; padding: 0.4rem 0.8rem;" onclick="window.canteenConsole.filterCategory('lunch')">Meals & Wok</button>
          <button class="btn-secondary" style="font-size: 0.8rem; padding: 0.4rem 0.8rem;" onclick="window.canteenConsole.filterCategory('snacks')">Snacks</button>
          <button class="btn-secondary" style="font-size: 0.8rem; padding: 0.4rem 0.8rem;" onclick="window.canteenConsole.filterCategory('beverages')">Drinks</button>
        </div>
      </div>

      <div class="white-table-wrapper">
        <table class="navy-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Category</th>
              <th>Price</th>
              <th>Portions in Stock</th>
              <th>Availability Toggle</th>
              <th>Quick Adjust</th>
            </tr>
          </thead>
          <tbody>
            ${items
              .filter(item => this.activeFilter === "all" || item.category === this.activeFilter)
              .map(item => `
              <tr>
                <td>
                  <div style="display: flex; align-items: center; gap: 0.75rem;">
                    <img src="${item.image}" alt="${item.name}" style="width: 44px; height: 44px; border-radius: 8px; object-fit: cover;" onerror="this.src='assets/chicken_biryani.jpg'" />
                    <div>
                      <div style="font-weight: 700; color: var(--text-dark);">${item.name}</div>
                      <div style="font-size: 0.74rem; color: var(--text-muted);">${item.isVeg ? '<span class="status-dot dot-ready"></span> Pure Veg' : '<span class="status-dot dot-critical"></span> Non-Veg'}</div>
                    </div>
                  </div>
                </td>
                <td><span style="text-transform: capitalize; font-size: 0.85rem; color: var(--text-secondary);">${item.category}</span></td>
                <td><strong style="color: var(--brand-orange-deep); font-size: 0.95rem;">₹${item.price}</strong></td>
                <td>
                  <span style="font-family: var(--font-heading); font-size: 1.15rem; font-weight: 800; color: ${item.stockQuantity <= 5 ? '#DC2626' : 'var(--text-dark)'};">
                    ${item.stockQuantity}
                  </span>
                  <span style="font-size: 0.78rem; color: var(--text-muted);">portions</span>
                </td>
                <td>
                  <button class="status-pill ${item.available ? 'Available' : 'Critical'}" style="cursor: pointer; border: none; padding: 0.45rem 1rem; font-weight: 800;" onclick="window.canteenConsole.toggleItemAvailability('${item.id}')">
                    ${item.available ? '● Available' : '○ Sold Out'}
                  </button>
                </td>
                <td>
                  <div style="display: flex; gap: 0.35rem;">
                    <button class="btn-secondary" style="padding: 0.3rem 0.6rem; font-size: 0.75rem;" onclick="window.canteenConsole.adjustStock('${item.id}', 5)" title="Add 5 portions">+5</button>
                    <button class="btn-secondary" style="padding: 0.3rem 0.6rem; font-size: 0.75rem;" onclick="window.canteenConsole.adjustStock('${item.id}', -5)" title="Deduct 5 portions">-5</button>
                  </div>
                </td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    `;
  }

  filterCategory(cat) {
    this.activeFilter = cat;
    this.renderQuickStock();
  }

  toggleItemAvailability(id) {
    const item = this.storage.getMenuItems().find(i => i.id === id);
    if (!item) return;

    const newStatus = !item.available;
    this.storage.updateMenuItem(id, { available: newStatus });
    this.audio.playTap();
    this.showToast(
      "Item Updated",
      `${item.name} is now ${newStatus ? 'AVAILABLE for students' : 'marked SOLD OUT'}.`,
      newStatus ? "success" : "warning"
    );
  }

  adjustStock(id, delta) {
    const item = this.storage.getMenuItems().find(i => i.id === id);
    if (!item) return;
    const newQty = Math.max(0, (item.stockQuantity || 0) + delta);
    this.storage.updateMenuItem(id, { 
      stockQuantity: newQty,
      available: newQty > 0 ? item.available : false
    });
    this.audio.playTap();
    this.showToast("Stock Adjusted", `${item.name}: ${newQty} portions now.`, "info");
  }

  // --- Critical Ingredients Warning ---
  renderLowStockAlerts() {
    const container = document.getElementById("canteen-low-stock-container");
    if (!container) return;

    const inventory = this.storage.getInventory();
    const criticalItems = inventory.filter(i => i.status === "Critical" || i.status === "Low Stock");

    if (criticalItems.length === 0) {
      container.innerHTML = `
        <div style="background: rgba(16, 185, 129, 0.08); border: 1.5px solid rgba(16, 185, 129, 0.25); border-radius: var(--radius-md); padding: 1rem 1.25rem; display: flex; align-items: center; gap: 0.75rem; color: #059669; font-size: 0.88rem; font-weight: 600;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          <span>All kitchen ingredients & supplies are healthy and well above minimum thresholds.</span>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div style="background: rgba(239, 68, 68, 0.08); border: 1.5px solid rgba(239, 68, 68, 0.25); border-radius: var(--radius-md); padding: 1.15rem 1.35rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#DC2626" stroke-width="2.2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          <div>
            <strong style="color: #B91C1C; font-size: 0.95rem;">Kitchen Stock Warning:</strong>
            <span style="color: #DC2626; font-size: 0.85rem; margin-left: 4px;">
              ${criticalItems.map(c => `${c.name} (${c.quantity} ${c.unit})`).join(", ")} low in the pantry!
            </span>
          </div>
        </div>
        <button class="btn-primary" style="background: linear-gradient(135deg, #EF4444, #DC2626); color: #fff; font-size: 0.82rem; padding: 0.45rem 0.9rem;" onclick="window.canteenConsole.quickRestockAll()">
          + Restock All Low Supplies
        </button>
      </div>
    `;
  }

  quickRestockAll() {
    const inventory = this.storage.getInventory();
    inventory.forEach(i => {
      if (i.status === "Critical" || i.status === "Low Stock") {
        this.storage.restockInventory(i.id, 15);
      }
    });
    this.audio.playTap();
    this.showToast("Pantry Restocked", "Restocked all low kitchen ingredients (+15).", "success");
  }

  simulateIncomingOrder() {
    const mockStudents = [
      { name: "Sneha Roy", phone: "+91 94455 66778" },
      { name: "Vikram Sen", phone: "+91 97788 11223" },
      { name: "Kavya Nair", phone: "+91 98877 33445" },
      { name: "Rohan Patel", phone: "+91 91234 56789" },
      { name: "Ananya Sharma", phone: "+91 98220 33441" }
    ];
    const randStudent = mockStudents[Math.floor(Math.random() * mockStudents.length)];
    const menu = this.storage.getMenuItems().filter(m => m.available);
    const randItem = menu[Math.floor(Math.random() * menu.length)];

    const newOrd = this.storage.createOrder({
      userId: "usr_sim_" + Date.now(),
      userName: randStudent.name,
      userPhone: randStudent.phone,
      items: [
        { itemId: randItem.id, name: randItem.name, price: randItem.price, quantity: 1, isVeg: randItem.isVeg }
      ],
      total: randItem.price,
      orderType: "Standard Pickup",
      pickupTime: "ASAP",
      paymentMethod: "Campus Wallet",
      notes: "Extra spicy please"
    });

    this.audio.playOrderSuccess();
    this.showToast(`New Order Incoming! #${newOrd.tokenNumber}`, `${randStudent.name} ordered ${randItem.name}`, "bell");
  }

  toggleSound() {
    const enabled = this.audio.toggleSound();
    const btn = document.getElementById("sound-toggle-btn");
    if (btn) {
      btn.innerHTML = enabled
        ? `<svg class="ui-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>`
        : `<svg class="ui-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>`;
      btn.title = enabled ? "Mute Kitchen Chimes" : "Enable Kitchen Chimes";
    }
    if (enabled) this.audio.playTap();
  }

  showToast(title, message, icon = "bell") {
    const container = document.getElementById("toast-stack");
    if (!container) return;

    let iconSvg = `<svg class="ui-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--brand-orange)" stroke-width="2.2"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>`;
    if (icon === "success") {
      iconSvg = `<svg class="ui-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#16A34A" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`;
    } else if (icon === "warning") {
      iconSvg = `<svg class="ui-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" stroke-width="2.2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`;
    }

    const toast = document.createElement("div");
    toast.className = "clean-toast";
    toast.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: center; width: 36px; height: 36px; border-radius: 10px; background: rgba(255, 94, 0, 0.08); flex-shrink: 0;">
        ${iconSvg}
      </div>
      <div>
        <div class="toast-message-title">${title}</div>
        <div class="toast-message-desc">${message}</div>
      </div>
    `;

    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(100%)";
      toast.style.transition = "all 0.25s ease";
      setTimeout(() => toast.remove(), 250);
    }, 3500);
  }
}

// Global initialization on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  window.canteenConsole = new CanteenConsole(window.canteenStorage, window.canteenAudio);
  window.app = {
    showToast: (title, msg, icon) => window.canteenConsole.showToast(title, msg, icon)
  };
});
