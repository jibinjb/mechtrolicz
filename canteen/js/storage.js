/**
 * Smart Canteen Management Platform
 * Storage & Reactive State Manager
 */

class CanteenStorage {
  constructor() {
    this.STORAGE_KEY = "smart_canteen_platform_data_v2";
    this.listeners = {};
    this.init();
    
    // Cross-tab synchronization
    window.addEventListener("storage", (e) => {
      if (e.key === this.STORAGE_KEY) {
        this.emit("stateChanged", this.getState());
      }
    });
  }

  init() {
    const existing = localStorage.getItem(this.STORAGE_KEY);
    if (!existing) {
      this.resetToDefaults();
    }
  }

  getState() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (data) {
        // Strip any residual emojis from legacy caches
        const sanitized = data.replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1FA00}-\u{1FAFF}\u{FE0F}]/gu, '');
        return JSON.parse(sanitized);
      }
      return window.INITIAL_DATA;
    } catch (e) {
      console.error("Storage error:", e);
      return window.INITIAL_DATA;
    }
  }

  saveState(state) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(state));
      this.emit("stateChanged", state);
    } catch (e) {
      console.error("Failed to save state to localStorage:", e);
    }
  }

  resetToDefaults() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(window.INITIAL_DATA));
    this.emit("stateChanged", window.INITIAL_DATA);
  }

  // Pub/Sub
  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
    return () => this.off(event, callback);
  }

  off(event, callback) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
  }

  emit(event, payload) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(cb => {
        try { cb(payload); } catch (err) { console.error(err); }
      });
    }
  }

  // User & Wallet
  getUser() {
    return this.getState().currentUser;
  }

  updateUser(updates) {
    const state = this.getState();
    state.currentUser = { ...state.currentUser, ...updates };
    this.saveState(state);
    this.emit("userUpdated", state.currentUser);
    return state.currentUser;
  }

  topUpWallet(amount) {
    const state = this.getState();
    const newBal = Number(state.currentUser.walletBalance || 0) + Number(amount);
    state.currentUser.walletBalance = Math.round(newBal * 100) / 100;
    
    // Add transaction notification
    const notif = {
      id: "notif_" + Date.now(),
      title: "Wallet Top-up Successful",
      message: `₹${Number(amount).toFixed(2)} added to your campus wallet. New balance: ₹${state.currentUser.walletBalance.toFixed(2)}`,
      time: "Just now",
      read: false,
      type: "wallet"
    };
    state.notifications.unshift(notif);

    this.saveState(state);
    this.emit("userUpdated", state.currentUser);
    this.emit("notificationsUpdated", state.notifications);
    return state.currentUser.walletBalance;
  }

  toggleFavorite(itemId) {
    const state = this.getState();
    if (!state.currentUser.favorites) state.currentUser.favorites = [];
    const idx = state.currentUser.favorites.indexOf(itemId);
    let isFav = false;
    if (idx !== -1) {
      state.currentUser.favorites.splice(idx, 1);
      isFav = false;
    } else {
      state.currentUser.favorites.push(itemId);
      isFav = true;
    }
    this.saveState(state);
    this.emit("userUpdated", state.currentUser);
    return isFav;
  }

  // Menu Items
  getMenuItems() {
    return this.getState().menuItems || [];
  }

  updateMenuItem(id, updates) {
    const state = this.getState();
    const idx = state.menuItems.findIndex(i => i.id === id);
    if (idx !== -1) {
      state.menuItems[idx] = { ...state.menuItems[idx], ...updates };
      this.saveState(state);
      this.emit("menuUpdated", state.menuItems);
      return state.menuItems[idx];
    }
    return null;
  }

  addMenuItem(itemData) {
    const state = this.getState();
    const newItem = {
      id: "item_" + Date.now(),
      rating: 5.0,
      reviewsCount: 1,
      available: true,
      ...itemData
    };
    state.menuItems.unshift(newItem);
    this.saveState(state);
    this.emit("menuUpdated", state.menuItems);
    return newItem;
  }

  deleteMenuItem(id) {
    const state = this.getState();
    state.menuItems = state.menuItems.filter(i => i.id !== id);
    this.saveState(state);
    this.emit("menuUpdated", state.menuItems);
  }

  // Inventory
  getInventory() {
    return this.getState().inventory || [];
  }

  updateInventoryItem(id, updates) {
    const state = this.getState();
    const idx = state.inventory.findIndex(i => i.id === id);
    if (idx !== -1) {
      state.inventory[idx] = { ...state.inventory[idx], ...updates, lastUpdated: "Just now" };
      
      // Auto-update status based on minThreshold
      const item = state.inventory[idx];
      if (item.quantity <= item.minThreshold * 0.5) {
        item.status = "Critical";
      } else if (item.quantity <= item.minThreshold) {
        item.status = "Low Stock";
      } else {
        item.status = "Available";
      }

      this.saveState(state);
      this.emit("inventoryUpdated", state.inventory);
      return state.inventory[idx];
    }
    return null;
  }

  restockInventory(id, amount) {
    const state = this.getState();
    const idx = state.inventory.findIndex(i => i.id === id);
    if (idx !== -1) {
      state.inventory[idx].quantity += Number(amount);
      const item = state.inventory[idx];
      if (item.quantity > item.minThreshold) {
        item.status = "Available";
      } else if (item.quantity > item.minThreshold * 0.5) {
        item.status = "Low Stock";
      }
      item.lastUpdated = "Just now";
      this.saveState(state);
      this.emit("inventoryUpdated", state.inventory);
      return state.inventory[idx];
    }
    return null;
  }

  // Orders
  getOrders() {
    return this.getState().orders || [];
  }

  createOrder(orderData) {
    const state = this.getState();
    
    // Generate next token number (e.g. A1043)
    const existingTokens = state.orders.map(o => parseInt((o.tokenNumber || "A1000").replace(/\D/g, ''))).filter(n => !isNaN(n));
    const maxNum = existingTokens.length ? Math.max(...existingTokens) : 1042;
    const nextToken = "A" + (maxNum + 1);

    const activeOrdersCount = state.orders.filter(o => ["PLACED", "PAYMENT_CONFIRMED", "ACCEPTED", "PREPARING"].includes(o.orderStatus)).length;
    const estWaitMins = Math.max(5, (activeOrdersCount + 1) * 3);

    const newOrder = {
      id: "ord_" + Date.now(),
      tokenNumber: nextToken,
      placedAt: new Date().toISOString(),
      orderStatus: "PAYMENT_CONFIRMED", // Immediately confirmed if paid digitally
      queuePosition: activeOrdersCount + 1,
      estimatedWaitMins: estWaitMins,
      ...orderData
    };

    // Deduct wallet if paid by campus wallet
    if (newOrder.paymentMethod === "Campus Wallet") {
      state.currentUser.walletBalance = Math.max(0, state.currentUser.walletBalance - newOrder.total);
    }

    state.orders.unshift(newOrder);

    // Add in-app notification
    const isClassroom = newOrder.deliveryType === "classroom";
    const notifTitle = isClassroom ? `Classroom Delivery Confirmed! #${nextToken}` : `Order Confirmed! Token #${nextToken}`;
    const notifMsg = isClassroom
      ? `Your meal will be delivered directly to ${newOrder.classroomDetails?.block || 'Campus'} - ${newOrder.classroomDetails?.room || 'Classroom'}.`
      : `Your food order is confirmed! Monitor your live token #${nextToken} on the queue tracker.`;

    state.notifications.unshift({
      id: "notif_" + Date.now(),
      title: notifTitle,
      message: notifMsg,
      time: "Just now",
      read: false,
      type: "order"
    });

    this.saveState(state);
    this.emit("orderCreated", newOrder);
    this.emit("ordersUpdated", state.orders);
    this.emit("userUpdated", state.currentUser);
    this.emit("notificationsUpdated", state.notifications);
    return newOrder;
  }

  updateOrderStatus(orderId, newStatus) {
    const state = this.getState();
    const idx = state.orders.findIndex(o => o.id === orderId);
    if (idx !== -1) {
      state.orders[idx].orderStatus = newStatus;
      const order = state.orders[idx];

      let notifTitle = `Order #${order.tokenNumber} Update`;
      let notifMsg = `Status changed to ${newStatus}`;

      if (newStatus === "ACCEPTED") {
        notifTitle = `Order #${order.tokenNumber} Accepted!`;
        notifMsg = "The canteen kitchen has accepted your order and queued it for preparation.";
      } else if (newStatus === "PREPARING") {
        notifTitle = `Food is Cooking! #${order.tokenNumber}`;
        notifMsg = `Chef is preparing your order. Estimated ready in ${order.estimatedWaitMins || 6} mins.`;
      } else if (newStatus === "READY") {
        notifTitle = `ORDER READY FOR PICKUP! #${order.tokenNumber}`;
        notifMsg = `Your delicious food is ready at Counter 2! Please present Token #${order.tokenNumber} to collect.`;
        order.queuePosition = 0;
        order.estimatedWaitMins = 0;
      } else if (newStatus === "COLLECTED") {
        notifTitle = `Order Collected #${order.tokenNumber}`;
        notifMsg = "Hope you enjoyed your meal! Tap here to rate your food & service.";
      } else if (newStatus === "CANCELLED") {
        notifTitle = `Order Cancelled #${order.tokenNumber}`;
        notifMsg = "Your order was cancelled and a full refund has been credited to your Campus Wallet.";
        // Refund if wallet
        if (order.paymentMethod === "Campus Wallet") {
          state.currentUser.walletBalance += order.total;
        }
      }

      state.notifications.unshift({
        id: "notif_" + Date.now(),
        title: notifTitle,
        message: notifMsg,
        time: "Just now",
        read: false,
        type: newStatus === "READY" ? "ready" : "order"
      });

      this.saveState(state);
      this.emit("ordersUpdated", state.orders);
      this.emit("notificationsUpdated", state.notifications);
      if (newStatus === "CANCELLED") {
        this.emit("userUpdated", state.currentUser);
      }
      return order;
    }
    return null;
  }

  // Feedback & Dish Rating
  getFeedback() {
    return this.getState().feedbackList || [];
  }

  rateFoodItem(itemId, rating, reviewText, studentName) {
    const state = this.getState();
    const item = (state.menuItems || []).find(i => i.id === itemId);
    if (!item) return null;

    const numericRating = Math.max(1, Math.min(5, Number(rating) || 5));
    const priorCount = Number(item.reviewsCount) || 1;
    const priorRating = Number(item.rating) || 4.5;
    
    // Recalculate moving average
    const newCount = priorCount + 1;
    const updatedRating = parseFloat((((priorRating * priorCount) + numericRating) / newCount).toFixed(1));

    item.rating = updatedRating;
    item.reviewsCount = newCount;

    const user = studentName || (state.currentUser ? state.currentUser.name : "Campus Student");
    const newFb = {
      id: "fb_dish_" + Date.now(),
      itemId: item.id,
      itemName: item.name,
      userName: user,
      tokenNumber: "Menu Dish",
      ratingFood: numericRating,
      ratingService: 5,
      ratingValue: numericRating,
      comment: reviewText || `Rated ${item.name} ${numericRating} stars!`,
      createdAt: "Just now",
      reply: null
    };

    if (!state.feedbackList) state.feedbackList = [];
    state.feedbackList.unshift(newFb);

    this.saveState(state);
    this.emit("menuUpdated", state.menuItems);
    this.emit("feedbackUpdated", state.feedbackList);
    return { item, feedback: newFb };
  }

  addFeedback(feedbackData) {
    const state = this.getState();
    const newFb = {
      id: "fb_" + Date.now(),
      createdAt: "Just now",
      reply: null,
      ...feedbackData
    };
    if (!state.feedbackList) state.feedbackList = [];
    state.feedbackList.unshift(newFb);

    // Also mark order as reviewed and update item ratings if order has items
    if (feedbackData.orderId) {
      const ord = (state.orders || []).find(o => o.id === feedbackData.orderId);
      if (ord) {
        ord.hasFeedback = true;
        ord.rating = feedbackData.ratingFood || 5;
        ord.feedbackComment = feedbackData.comment;

        // If items are in the order, adjust their rating statistics slightly based on student score
        if (Array.isArray(ord.items) && ord.items.length > 0) {
          ord.items.forEach(it => {
            const mItem = (state.menuItems || []).find(m => m.id === it.itemId);
            if (mItem) {
              const curCount = mItem.reviewsCount || 10;
              const curRating = mItem.rating || 4.5;
              mItem.reviewsCount = curCount + 1;
              mItem.rating = parseFloat((((curRating * curCount) + Number(feedbackData.ratingFood || 5)) / (curCount + 1)).toFixed(1));
            }
          });
          this.emit("menuUpdated", state.menuItems);
        }
      }
    }

    this.saveState(state);
    this.emit("feedbackUpdated", state.feedbackList);
    this.emit("ordersUpdated", state.orders);
    return newFb;
  }

  // Return & Refund Policy Handler
  requestOrderReturn(orderId, { reason, reasonLabel, resolution, notes }) {
    const state = this.getState();
    const order = (state.orders || []).find(o => o.id === orderId);
    if (!order) return { success: false, error: "Order not found" };

    if (order.orderStatus === "REFUNDED") {
      return { success: false, error: "Order has already been refunded under Return Policy." };
    }

    const refundAmount = order.total || 0;
    const resolutionMode = resolution || "WALLET_REFUND";

    order.orderStatus = "REFUNDED";
    order.returnDetails = {
      reason: reason || "QUALITY_TASTE",
      reasonLabel: reasonLabel || "Quality / Taste Guarantee",
      resolution: resolutionMode,
      notes: notes || "",
      refundAmount: refundAmount,
      requestedAt: new Date().toISOString(),
      status: "APPROVED"
    };

    if (resolutionMode === "WALLET_REFUND") {
      if (state.currentUser) {
        state.currentUser.walletBalance = (Number(state.currentUser.walletBalance) || 0) + refundAmount;
      }

      if (!state.notifications) state.notifications = [];
      state.notifications.unshift({
        id: "notif_refund_" + Date.now(),
        title: "Campus Wallet Refund Credited",
        message: `₹${refundAmount.toFixed(2)} 100% refund credited for Order #${order.tokenNumber} under Campus Return Policy (${reasonLabel || 'Quality Guarantee'}). New Balance: ₹${(state.currentUser?.walletBalance || 0).toFixed(2)}.`,
        time: "Just now",
        read: false,
        type: "payment"
      });
    } else {
      if (!state.notifications) state.notifications = [];
      state.notifications.unshift({
        id: "notif_replace_" + Date.now(),
        title: "Kitchen Replacement Token Issued",
        message: `Express Replacement Token #${order.tokenNumber}-R issued. Show this at Express Counter 1 for instant prioritized preparation.`,
        time: "Just now",
        read: false,
        type: "order"
      });
    }

    this.saveState(state);
    this.emit("ordersUpdated", state.orders);
    this.emit("userUpdated", state.currentUser);
    this.emit("notificationsUpdated", state.notifications);
    return { success: true, order, refundAmount };
  }

  replyFeedback(feedbackId, replyText) {
    const state = this.getState();
    const fb = state.feedbackList.find(f => f.id === feedbackId);
    if (fb) {
      fb.reply = replyText;
      this.saveState(state);
      this.emit("feedbackUpdated", state.feedbackList);
      return fb;
    }
    return null;
  }

  // Notifications
  getNotifications() {
    return this.getState().notifications || [];
  }

  markNotificationsRead() {
    const state = this.getState();
    state.notifications.forEach(n => { n.read = true; });
    this.saveState(state);
    this.emit("notificationsUpdated", state.notifications);
  }
}

// Global instance
window.canteenStorage = new CanteenStorage();
