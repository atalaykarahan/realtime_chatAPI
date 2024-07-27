export const READ_STATUS = ['unread', 'readed'] as const;
export type ReadStatus = (typeof READ_STATUS)[number];

export enum RequestStatus {
  pending = 'pending',
  rejected = 'rejected',
  accepted = 'accepted',
}

export enum FriendStatus {
  friend = 'friend',
  blocked = 'blocked',
}
