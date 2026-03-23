"use client";
import React, { useEffect, useState } from "react";
import { getOrders } from "@/app/functions/api/order/getOrders";
import { orderListSchema } from "@/app/types/types";
import "./orders.css";
import { getToken } from "@clerk/nextjs";
import useMessage from "../store/useMessage";

const Orders = () => {
  const [orders, setOrders] = useState<orderListSchema>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());
  const [showConfirm, setShowConfirm] = useState<string | null>(null);
  const setMessage = useMessage((s) => s.setMessage);
  const setType = useMessage((s) => s.setType);
  useEffect(() => {
    const fetchOrders = async () => {
      const token = await getToken();
      if (!token) {
        setMessage("Please Login to view your orders");
        setType("error");
        return;
      }
      const result = await getOrders(token);
      if (result) {
        setOrders(result);
      }
      setLoading(false);
    };
    fetchOrders();
  }, []);

  const toggleExpand = (orderId: string) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedOrders(newExpanded);
  };

  const handleDelete = (orderId: string) => {
    console.log("Delete order:", orderId);
    // Empty function for now
  };

  const handleCancel = (orderId: string) => {
    console.log("Cancel order:", orderId);
    setShowConfirm(null);
    // Empty function for now
  };

  if (loading) {
    return (
      <div className="orders-container">
        <h1 className="orders-title">Your Orders</h1>
        <div className="no-orders">Loading your delicious history...</div>
      </div>
    );
  }

  return (
    <div className="orders-container">
      <h1 className="orders-title">Your Orders</h1>

      {orders.length === 0 ? (
        <div className="no-orders">
          <span
            className="material-symbols-outlined"
            style={{ fontSize: "3rem", marginBottom: "1rem" }}
          >
            shopping_basket
          </span>
          <p>You haven{`'`}t placed any orders yet.</p>
        </div>
      ) : (
        orders.map((order) => (
          <div key={order.id} className="order-card">
            <div className="order-header" onClick={() => toggleExpand(order.id)}>
              <div className="order-header-main">
                <div className="order-thumbnail">
                  <img src={order.items[0]?.image_url} alt="Order Thumbnail" />
                </div>
                <div className="order-info">
                  <span className="order-id">Order #{order.id}</span>
                  <div className={`order-status status-${order.status}`}>
                    <span className="material-symbols-outlined" style={{ fontSize: "1.2rem" }}>
                      {order.status === "delivered" ? "check_circle" : 
                       order.status === "cancelled" ? "cancel" : "pending_actions"}
                    </span>
                    {order.status}
                  </div>
                </div>
              </div>
              <span className={`material-symbols-outlined expand-icon ${expandedOrders.has(order.id) ? "expanded" : ""}`}>
                expand_more
              </span>
            </div>


            {expandedOrders.has(order.id) && (
              <div className="order-content">
                <div className="order-items-list">
                  {order.items.map((item, idx) => (
                    <div
                      key={`${order.id}-${item.item_id}-${idx}`}
                      className="order-item"
                    >
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="item-image"
                      />
                      <div className="item-details">
                        <div className="item-name">{item.name}</div>
                        <div className="item-meta">
                          {item.quantity} x ₹{item.price} • {item.category}
                        </div>
                      </div>
                      <div className="item-total">
                        ₹{parseFloat(item.price) * parseInt(item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="order-actions">
                  {order.status === "delivered" ||
                  order.status === "cancelled" ? (
                    <button
                      className="btn-delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(order.id);
                      }}
                    >
                      Delete History
                    </button>
                  ) : (
                    <button
                      className="btn-cancel"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowConfirm(order.id);
                      }}
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        ))
      )}

      {/* Confirmation Popup */}
      {showConfirm && (
        <div className="popup-overlay" onClick={() => setShowConfirm(null)}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ margin: "0 0 1rem", color: "var(--color-light)" }}>
              Cancel Order?
            </h3>
            <p style={{ margin: "0 0 2rem", opacity: 0.8, fontSize: "0.9rem" }}>
              Are you sure you want to cancel order #{showConfirm}? This action
              cannot be undone.
            </p>
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={() => setShowConfirm(null)}
                style={{
                  flex: 1,
                  padding: "0.75rem",
                  borderRadius: "8px",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  background: "transparent",
                  color: "var(--color-light)",
                  cursor: "pointer",
                }}
              >
                No, Keep it
              </button>
              <button
                onClick={() => handleCancel(showConfirm)}
                style={{
                  flex: 1,
                  padding: "0.75rem",
                  borderRadius: "8px",
                  border: "none",
                  background: "var(--color-primary)",
                  color: "white",
                  cursor: "pointer",
                  fontWeight: "700",
                }}
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
