export const READ_STATUS = ['unread', 'readed'] as const;
export type ReadStatus = typeof READ_STATUS[number];
