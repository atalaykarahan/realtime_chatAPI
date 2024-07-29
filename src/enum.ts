export enum RequestStatus {
  pending = 'pending',
  rejected = 'rejected',
  accepted = 'accepted',
}

export enum FriendStatus {
  friend = 'friend',
  block_both = 'block_both',
  block_first_second = 'block_first_second',
  block_second_first = 'block_second_first',
}

export enum RoomType {
  private = 'private',
  group = 'group',
}

export enum ReadStatus {
  unread = 'unread',
  readed = 'readed',
}
