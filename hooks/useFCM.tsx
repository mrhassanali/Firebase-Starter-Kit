"use client";

import { useCallback, useContext, useEffect, useRef, useState } from "react";
import {
  getMessagingObj,
  NotificationClass,
} from "@/app/lib/firebase/notification";
import { onMessage, Unsubscribe } from "firebase/messaging";
// import { UserController } from "@/app/lib/_modules/user/controller/UserController";
// import addNotification from "react-push-notification";
import { DOMAIN } from "@/app/lib/constants/Routes";
import { dexieDB, getFCMTokenFromIndexDB } from "@/app/lib/utils/indexDB";
import isMobileDevice from "@/app/lib/utils/detectBrowser";
import { useSnackbar } from "notistack";
import AuthContext from "@/context/AuthContext";

export const useFCM = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const retryLoadToken = useRef(0);
  const { user, setNotificationPermission } = useContext(AuthContext);

  // Getting FCM Token
  async function getFCMToken(): Promise<string | null> {
    const notificationPermission =
      await NotificationClass.getInstance().getNotificationPermission();
    if (notificationPermission) {
      const token = await NotificationClass.getInstance().fetchToken();
      if (!token) {
        return null;
      }

      // if mobile device then save token in mobile_fcm else save in nextjs_fcm
      if (isMobileDevice()) {
        /*
        if (
          profile.fcm_tokens?.mobile_fcm !== token ||
          profile.fcm_tokens?.mobile_fcm === null
        ) {
          dexieDB.fcmToken.put({ id: 1, token });
          setNotificationPermission(true);
          await NotificationClass.getInstance().subscribeAndSaveFCMToken(token);
        }
        */
      } else {
        /*
        if (
          profile.fcm_tokens?.nextjs_fcm !== token ||
          profile.fcm_tokens?.nextjs_fcm === null
        ) {
          dexieDB.fcmToken.put({ id: 1, token });
          setNotificationPermission(true);
          await NotificationClass.getInstance().subscribeAndSaveFCMToken(token);
        }
        */
      }

      // if token is not match with db token then save new token
      return token;
    } else {
      setNotificationPermission(false);
      return null;
    }
  }

  const loadToken = async () => {
    if (Notification.permission === "denied") {
      console.info(
        `%cPlease enable notfications via browser settings.`,
        "color: red; background: #c7c7c7; padding: 4px; font-size: 14px"
      );
      setNotificationPermission(false);

      // remove the token from db if user denied the permission
      const token = await getFCMTokenFromIndexDB();
      if (isMobileDevice()) {
        /*
        if (profile.fcm_tokens?.mobile_fcm === token) {
          UserController.getInstance().deleteFCMToken(token);
          NotificationClass.getInstance().deleteFcmTokenFromLocal();
          dexieDB.fcmToken.clear();
        }
        */
      } else {
        /*
        if (profile.fcm_tokens?.nextjs_fcm === token) {
        UserController.getInstance().deleteFCMToken(token);
        NotificationClass.getInstance().deleteFcmTokenFromLocal();
        dexieDB.fcmToken.clear();
        }
        */
      }
      return null;
    }

    if (retryLoadToken.current >= 3) {
      enqueueSnackbar("Something went wrong, refresh the browser", {
        variant: "error",
      });
      return null;
    }

    const token = await getFCMToken();
    if (token) {
      // console.info(
      //   `%cFCM Token: ${token} --> send to backend`,
      //   'color: green; background: #c7c7c7; padding: 8px; font-size: 20px',
      // );
      return token;
    }

    if (!token) {
      retryLoadToken.current += 1;
      loadToken();
      return;
    }
    // every time update token in indexdb
    setFcmToken(token);
  };

  // useEffect(() => {
  //   if ('Notification in window' && Notification.permission === 'granted') {
  //     loadToken();
  //   }
  // }, []);

  // foreground message listener
  const listenerMessage = useCallback(async () => {
    if (!fcmToken) return null;
    // console.log(`onMessage Reg withFcmToken ${fcmToken}`);
    const messaging = await getMessagingObj();
    if (!messaging) return null;
    return onMessage(messaging, (payload) => {
      if (Notification.permission !== "granted") return;

      console.log("Foreground message loaded >>> payload", payload);
      const { data } = payload ?? {};
      if (data && data.title && data.body) {
        /*
        addNotification({
          title: data.title || "",
          message: data.body,
          theme: "darkblue",
          icon: "/favicon.ico",
          onClick: () => {
            window.open(
              `${data.click_action} || ${DOMAIN}/dashboard/jobs/${data?.category}/${data?.jobId}`,
              "_self"
            );
          },
          native: true,
        });
        */
      }
    });
  }, [fcmToken]);

  useEffect(() => {
    let instanceOnMessage: Unsubscribe | null;
    listenerMessage().then((r) => (instanceOnMessage = r));

    return () => instanceOnMessage?.();
  }, [listenerMessage]);

  return { loadToken, fcmToken };
};
