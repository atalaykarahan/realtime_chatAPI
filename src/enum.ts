export const READ_STATUS = ['unread', 'readed'] as const;
export type ReadStatus = (typeof READ_STATUS)[number];

export enum ReqeustStatus {
  pending = 'pending',
  rejected = 'rejected',
  accepted = 'accepted',
}
