export enum PatrolAction {
  Upload = 'UPLOAD',
  Stop = 'STOP',
}

export enum PatrolState {
  Unauthorized = 'unauthorized',
  Open = 'open',
  Done = 'done',
  Duplicate = 'duplicate',
  Rejected = 'rejected',
}
