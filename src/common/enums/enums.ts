export enum DeviceScreenHeight {
  iPhone4inch = 568,
  BlackView = 717,
}

export enum PatrolResult {
  succeeded,
  error,
  unauthorized,
  noInternet,
}

export enum UserType {
  account = 'account',
  profile = 'profile',
}

export enum Permissions {
  patrol = 'patrol',
}

export enum PermissionLevel {
  add = 'add',
  view = 'view',
}

/**
 * Enumeration representing the different states of the authentication process.
 *
 * @enum {string}
 * @readonly
 * @property {string} unknown - The authentication state is unknown. A PIN workflow re-evaluation
 *                              is required. This state can be resolved by calling the
 *                              'updateAuthState()' method.
 * @property {string} notRequired - The current user or profile setup does not require PIN
 *                                  authentication.
 * @property {string} required - PIN authentication is required. The app should present the
 *                               'PinAuthenticationView' to authenticate the user.
 * @property {string} authenticated - The user is successfully authenticated using PIN.
 * @property {string} userInvalidated - The current active profile was removed from the server.
 * @property {string} authInvalidated - The current authentication state is invalidated due to
 *                                     sync changes and does not satisfy the PIN workflow.
 */
export enum AuthState {
  unknown = 'unknown',
  notRequired = 'notRequired',
  required = 'required',
  authenticated = 'authenticated',
  userInvalidated = 'userInvalidated',
  authInvalidated = 'authInvalidated',
}

export enum BottomSheetAction {
  dismiss = 'dismiss',
  snapToIndex = 'snapToIndex',
}

export enum BottomSheetStatus {
  expanded = 'expanded',
  minimized = 'minimized',
  closed = 'closed',
  snapToIndex = 'snapToIndex',
}

export enum BottomSheetComponentAction {
  startTracking = 'startTracking',
  startPatrol = 'startPatrol',
  stopPatrol = 'stopPatrol',
  stopTracking = 'stopTracking',
}

export enum EventStatus {
  submitted = 'SUBMITTED',
  draft = 'DRAFT',
  error = 'ERROR',
  pendingSync = 'PENDING_SYNC',
}

export enum DeviceScreenWidth {
  small = 320,
}
