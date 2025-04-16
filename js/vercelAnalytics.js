// js/vercelAnalytics.js
import { Analytics } from '@vercel/analytics';


// Initialize the Analytics
const analytics = new Analytics();

// Function to track page views
export function trackPageView() {
    analytics.pageview(window.location.pathname + window.location.search);
}

// Function to track custom events
export function trackEvent(eventName, eventData) {
    analytics.event(eventName, eventData);
}

// Function to track visitors
export function trackVisitor() {
    analytics.event('Visitor', { timestamp: new Date().toISOString() });
}

// Call this function on page load