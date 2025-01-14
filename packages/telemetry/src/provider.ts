import * as Sentry from "sentry-expo";

import { createTelemetry } from "./telemetry";
import { FeatureTag, Severity, TelemetryTags, TelemetryUser } from "./types";
import  Constants from "expo-constants";
import { makeFetchTransport } from "@sentry/browser";

const MOBILE_DSN = "https://56ba5be9646a44109a51c0aa7175d28f@o87286.ingest.sentry.io/4504176016293888";

const SentryProvider = {
  
  init: () => {
    console.log(Constants.executionEnvironment);
    Sentry.init({
      sampleRate: 1.0,
      dsn: MOBILE_DSN,
      enableInExpoDevelopment: true,
      debug: true,
      enableNative: true,
      transport: Constants.executionEnvironment == "storeClient" ? makeFetchTransport : undefined
    });
  },
  captureError: (error: Error, tag: FeatureTag) => {
    console.log("Capturing error");
    Sentry.Native.captureException(error, { tags: { feature: tag } });
  },
  captureMessage: (message: string, tag: FeatureTag, severity = Severity.Info) => {
    Sentry.Native.captureMessage(message, { tags: { feature: tag }, level: severity });
  },
  addBreadcrumb: (category: string, message: string, severity: Severity) => {
    Sentry.Native.addBreadcrumb({
      category,
      message,
      level: severity,
    });
  },
  setUser: (user: TelemetryUser) => {
    Sentry.Native.setUser(user);
  },
  setTags: (tags: TelemetryTags) => {
    Sentry.Native.setTags(tags);
  },
};

export const telemetry = createTelemetry({ provider: SentryProvider }, []);
