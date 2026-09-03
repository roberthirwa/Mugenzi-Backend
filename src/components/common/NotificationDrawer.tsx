import React from "react";
import { useMugenzi } from "../../context/MugenziContext";

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const { notifications, markNotificationRead, clearAllNotifications } =
    useMugenzi();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Side Drawer */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Drawer Header */}
          <div className="p-6 border-b border-[#e1e3e4] flex items-center justify-between bg-[#f8f9fa]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#dae2ff] text-[#00327d] flex items-center justify-center font-bold">
                <span className="material-symbols-outlined text-[18px]">
                  notifications
                </span>
              </div>
              <h2 className="font-bold text-lg text-[#191c1d]">
                Citizen Notifications
              </h2>
            </div>
            <div className="flex items-center gap-2">
              {notifications.length > 0 && (
                <button
                  onClick={clearAllNotifications}
                  className="text-xs font-semibold text-[#00327d] hover:underline px-2 py-1"
                >
                  Clear All
                </button>
              )}
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full hover:bg-[#e1e3e4] flex items-center justify-center text-[#434653] transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {notifications.length === 0 ? (
              <div className="text-center py-16 px-4">
                <div className="w-16 h-16 rounded-full bg-[#f3f4f5] text-[#737784] mx-auto flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-3xl">
                    notifications_off
                  </span>
                </div>
                <h3 className="font-semibold text-base text-[#191c1d]">
                  No Notifications
                </h3>
                <p className="text-sm text-[#434653] mt-1">
                  You are up to date on all your Rwandan citizen journeys and
                  document verifications.
                </p>
              </div>
            ) : (
              notifications.map((n) => {
                const getIcon = (type: string) => {
                  switch (type) {
                    case "journey_update":
                      return "rocket_launch";
                    case "doc_verified":
                      return "verified";
                    case "reminder":
                      return "event";
                    default:
                      return "info";
                  }
                };

                return (
                  <div
                    key={n.id}
                    onClick={() => markNotificationRead(n.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      n.read
                        ? "bg-white border-[#e1e3e4]"
                        : "bg-[#f3f4f5] border-[#00327d]/30 shadow-sm"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          n.read
                            ? "bg-[#e7e8e9] text-[#5d5f5f]"
                            : "bg-[#dae2ff] text-[#00327d]"
                        }`}
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          {getIcon(n.type)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4
                            className={`text-sm truncate ${
                              n.read
                                ? "font-medium text-[#191c1d]"
                                : "font-bold text-[#00327d]"
                            }`}
                          >
                            {n.title}
                          </h4>
                          <span className="text-[11px] text-[#737784] shrink-0">
                            {n.timestamp}
                          </span>
                        </div>
                        <p className="text-xs text-[#434653] mt-1 leading-relaxed">
                          {n.body}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-[#e1e3e4] bg-[#f8f9fa] text-center">
            <p className="text-xs text-[#737784]">
              Powered by Mugenzi Firebase Cloud Messaging (FCM)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
