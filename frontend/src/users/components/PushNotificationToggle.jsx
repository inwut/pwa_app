import React, { useEffect, useState } from "react";
import { Switch, FormControlLabel, Tooltip } from "@mui/material";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import NotificationsOffIcon from "@mui/icons-material/NotificationsOff";

import {
  createPushSubscription,
  deletePushSubscription,
} from "../../utils/pushNotificationsManager.js";
import { useNotification } from "../../common/providers/NotificationProvider.jsx";
import { useAuth } from "../../common/providers/AuthProvider.jsx";
import api from "../../common/api.js";

const PushNotificationToggle = () => {
  const { currentUser } = useAuth();
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showError, showInfo } = useNotification();

  useEffect(() => {
    (async () => {
      const isEnabled = currentUser?.pushNotificationsEnabled;
      setEnabled(isEnabled);
    })();
  }, [currentUser]);

  const toggleNotifications = async () => {
    setLoading(true);
    try {
      if (enabled) {
        await deletePushSubscription();
        await api.patch("users/disablePushNotifications");
        setEnabled(false);
      } else {
        const permissionStatus = await navigator.permissions.query({
          name: "notifications",
        });
        if (permissionStatus.state === "denied") {
          showError(
            "You've blocked notifications in your browser settings. Please enable them manually.",
          );
          return;
        }

        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          await api.patch("users/enablePushNotifications");
          await createPushSubscription();
          setEnabled(true);
        }
      }
    } catch (error) {
      if (!navigator.onLine) {
        showInfo("You're offline. Try again once you're back online!");
        return;
      }
      showError(error);
    } finally {
      setLoading(false);
    }
  };

  return "Notification" in window && "serviceWorker" in navigator ? (
    <FormControlLabel
      control={
        <Switch
          checked={enabled}
          onChange={toggleNotifications}
          disabled={loading}
          color="success"
          icon={<NotificationsOffIcon />}
          checkedIcon={<NotificationsActiveIcon />}
          sx={{
            "& .MuiSwitch-switchBase": {
              color: "#74796D",
            },
            "& .MuiSwitch-switchBase.Mui-checked": {
              color: "#476730",
            },
            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
              backgroundColor: "#476730",
            },
          }}
        />
      }
      sx={{
        fontFamily: "Libre Franklin",
        color: "#74796D",
        "& .MuiFormControlLabel-label": {
          fontFamily: "Libre Franklin",
          fontSize: "1.1rem",
        },
      }}
      label={
        <Tooltip
          title="You'll be notified when someone follows you, likes your recipe, comments, or replies"
          placement="top"
          arrow
        >
          <span style={{ cursor: "help" }}>Push notifications</span>
        </Tooltip>
      }
    />
  ) : null;
};

export default PushNotificationToggle;
