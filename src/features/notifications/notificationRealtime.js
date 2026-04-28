import { HubConnectionBuilder, HubConnectionState, LogLevel } from '@microsoft/signalr'

const HUB_EVENT_NAME = 'notification_received'

let sharedConnection = null
let startPromise = null

function trimTrailingSlash(value) {
  return String(value || '').replace(/\/+$/, '')
}

function resolveNotificationHubUrl() {
  const explicitHubUrl = import.meta.env.VITE_NOTIFICATION_HUB_URL
  if (explicitHubUrl) {
    return explicitHubUrl
  }

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '/_api'
  if (/^https?:\/\//i.test(apiBaseUrl)) {
    return `${trimTrailingSlash(apiBaseUrl)}/hubs/notifications`
  }

  return `${trimTrailingSlash(apiBaseUrl)}/hubs/notifications`
}

function ensureConnection() {
  if (sharedConnection) {
    return sharedConnection
  }

  sharedConnection = new HubConnectionBuilder()
    .withUrl(resolveNotificationHubUrl(), {
      withCredentials: true,
    })
    .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
    .configureLogging(LogLevel.Warning)
    .build()

  return sharedConnection
}

async function startConnection(connection) {
  if (connection.state === HubConnectionState.Connected || connection.state === HubConnectionState.Connecting) {
    return
  }

  if (!startPromise) {
    startPromise = connection.start().finally(() => {
      startPromise = null
    })
  }

  await startPromise
}

export async function connectNotificationRealtime(onNotificationReceived) {
  const connection = ensureConnection()
  connection.on(HUB_EVENT_NAME, onNotificationReceived)

  try {
    await startConnection(connection)
  } catch (error) {
    connection.off(HUB_EVENT_NAME, onNotificationReceived)
    throw error
  }

  return () => {
    connection.off(HUB_EVENT_NAME, onNotificationReceived)
  }
}

export async function disconnectNotificationRealtime() {
  if (!sharedConnection) {
    return
  }

  if (sharedConnection.state !== HubConnectionState.Disconnected) {
    await sharedConnection.stop()
  }
}
