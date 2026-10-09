import type { SFSymbol } from 'sf-symbols-typescript';

export type MailboxId =
  | 'inbox'
  | 'vip'
  | 'flagged'
  | 'drafts'
  | 'sent'
  | 'archive'
  | 'trash'
  | 'expo'
  | 'receipts'
  | 'travel';

export type Mailbox = {
  id: MailboxId;
  name: string;
  systemImage: SFSymbol;
  /** Fixed icon color. Mailboxes without one use the tint, as Mail does. */
  color?: string;
};

// VIP and Flagged are smart mailboxes: they collect messages that live in other
// mailboxes, so no message is ever filed under them.
export const MAILBOXES: Mailbox[] = [
  { id: 'inbox', name: 'Inbox', systemImage: 'tray' },
  { id: 'vip', name: 'VIP', systemImage: 'star.fill', color: '#FFCC00' },
  { id: 'flagged', name: 'Flagged', systemImage: 'flag.fill', color: '#FF9500' },
  { id: 'drafts', name: 'Drafts', systemImage: 'doc' },
  { id: 'sent', name: 'Sent', systemImage: 'paperplane' },
  { id: 'archive', name: 'Archive', systemImage: 'archivebox' },
  { id: 'trash', name: 'Trash', systemImage: 'trash' },
];

export const FOLDERS: Mailbox[] = [
  { id: 'expo', name: 'Expo', systemImage: 'folder' },
  { id: 'receipts', name: 'Receipts', systemImage: 'folder' },
  { id: 'travel', name: 'Travel', systemImage: 'folder' },
];

export const ALL_MAILBOXES = [...MAILBOXES, ...FOLDERS];

export type Message = {
  id: string;
  /** The mailbox the message is filed in. Never a smart mailbox. */
  mailbox: MailboxId;
  sender: string;
  /** Background of the sender's avatar. */
  color: string;
  vip?: boolean;
  subject: string;
  /** The paragraphs of the body. The list row previews the first one. */
  body: string[];
  time: string;
  date: string;
  unread: boolean;
  flagged: boolean;
  attachment?: { name: string; size: string };
};

export const MESSAGES: Message[] = [
  {
    id: 'sdk-58',
    mailbox: 'inbox',
    sender: 'Expo',
    color: '#000000',
    vip: true,
    subject: 'SDK 58 is here',
    body: [
      'SDK 58 is out today. It ships React Native 0.88, a faster Expo Router, and new SwiftUI and Jetpack Compose components in Expo UI.',
      'NavigationSplitView now reports its column visibility and the preferred compact column, so one tree can lay itself out for an iPhone, an iPad, or a foldable.',
      '— The Expo team',
    ],
    time: '9:41 AM',
    date: 'Today, 9:41 AM',
    unread: true,
    flagged: false,
    attachment: { name: 'sdk-58-release-notes.pdf', size: '240 KB' },
  },
  {
    id: 'duo',
    mailbox: 'inbox',
    sender: 'Maya Chen',
    color: '#FF2D55',
    vip: true,
    subject: 'Re: Split view on the Duo',
    body: [
      'Unfolded, it shows the list beside the message. Folded, it pops back to the stack and keeps my place.',
      'Can you check the iPad in portrait next? I think the sidebar should stay hidden until I ask for it.',
      'Maya',
    ],
    time: '8:12 AM',
    date: 'Today, 8:12 AM',
    unread: true,
    flagged: true,
  },
  {
    id: 'testflight',
    mailbox: 'inbox',
    sender: 'TestFlight',
    color: '#0A84FF',
    subject: 'Field Guide 1.4 (212) is ready to test',
    body: [
      'The new build is available. Open TestFlight on your device to install it.',
      'This build expires in 90 days.',
    ],
    time: 'Yesterday',
    date: 'Yesterday, 6:30 PM',
    unread: true,
    flagged: false,
  },
  {
    id: 'github',
    mailbox: 'inbox',
    sender: 'GitHub',
    color: '#24292F',
    subject: 'PR #34 merged into main',
    body: [
      'Add the Mail split view example. 3 files changed, 412 additions.',
      'You are receiving this because you authored the thread.',
    ],
    time: 'Yesterday',
    date: 'Yesterday, 2:05 PM',
    unread: false,
    flagged: false,
  },
  {
    id: 'lunch',
    mailbox: 'inbox',
    sender: 'Jordan Lee',
    color: '#34C759',
    subject: 'Lunch on Thursday?',
    body: [
      'The new place on Valencia opens at noon. I can book a table for four.',
      'Let me know by Wednesday night.',
      'Jordan',
    ],
    time: 'Tuesday',
    date: 'Tuesday, 11:20 AM',
    unread: false,
    flagged: false,
  },
  {
    id: 'developer',
    mailbox: 'inbox',
    sender: 'Apple Developer',
    color: '#8E8E93',
    subject: 'Your membership renews soon',
    body: [
      'Your Apple Developer Program membership renews on October 21.',
      'No action is needed if your payment details are up to date.',
    ],
    time: 'Monday',
    date: 'Monday, 9:00 AM',
    unread: true,
    flagged: false,
  },
  {
    id: 'router',
    mailbox: 'expo',
    sender: 'Maya Chen',
    color: '#FF2D55',
    vip: true,
    subject: 'Router notes from the offsite',
    body: [
      'I put the notes from Tuesday in the shared folder. The short version: native tabs first, then the split view guide.',
      'Maya',
    ],
    time: 'Sep 30',
    date: 'September 30, 4:12 PM',
    unread: false,
    flagged: true,
  },
  {
    id: 'receipt-coffee',
    mailbox: 'receipts',
    sender: 'Blue Door Coffee',
    color: '#5856D6',
    subject: 'Your receipt from Blue Door Coffee',
    body: ['Oat latte and a croissant. Total $9.75, paid with Apple Pay.'],
    time: 'Sep 28',
    date: 'September 28, 8:02 AM',
    unread: false,
    flagged: false,
    attachment: { name: 'receipt-0928.pdf', size: '48 KB' },
  },
  {
    id: 'receipt-hardware',
    mailbox: 'receipts',
    sender: 'Orchard Supply',
    color: '#1F8A5B',
    subject: 'Order #1042 has shipped',
    body: ['Your two ceramic mugs and the linen apron are on the way. They arrive Friday.'],
    time: 'Sep 25',
    date: 'September 25, 3:47 PM',
    unread: false,
    flagged: false,
  },
  {
    id: 'flight',
    mailbox: 'travel',
    sender: 'Pacific Air',
    color: '#FF9500',
    subject: 'Your flight to Tokyo is confirmed',
    body: [
      'SFO to HND, October 18, departing 11:40 AM. Seat 32A.',
      'Check-in opens 24 hours before departure.',
    ],
    time: 'Sep 22',
    date: 'September 22, 10:15 AM',
    unread: false,
    flagged: true,
  },
  {
    id: 'draft-reply',
    mailbox: 'drafts',
    sender: 'Nate',
    color: '#007AFF',
    subject: 'Re: Lunch on Thursday?',
    body: ['Thursday works. Book it for four and I will bring the slides.'],
    time: 'Tuesday',
    date: 'Tuesday, 11:42 AM',
    unread: false,
    flagged: false,
  },
  {
    id: 'sent-notes',
    mailbox: 'sent',
    sender: 'Nate',
    color: '#007AFF',
    subject: 'Split view designs',
    body: [
      'The Paper file has the Mail, Orders, and Weather layouts for iPhone, the Duo, and the iPad.',
    ],
    time: 'Monday',
    date: 'Monday, 5:30 PM',
    unread: false,
    flagged: false,
  },
  {
    id: 'archived-welcome',
    mailbox: 'archive',
    sender: 'Expo',
    color: '#000000',
    vip: true,
    subject: 'Welcome to EAS',
    body: ['Your account is ready. Run your first build with eas build.'],
    time: 'Aug 2',
    date: 'August 2, 9:00 AM',
    unread: false,
    flagged: false,
  },
];

/** The messages a mailbox shows, including the smart mailboxes. */
export function messagesIn(mailbox: MailboxId, messages: Message[]): Message[] {
  switch (mailbox) {
    case 'vip':
      return messages.filter((m) => m.vip && m.mailbox === 'inbox');
    case 'flagged':
      return messages.filter((m) => m.flagged && m.mailbox !== 'trash');
    default:
      return messages.filter((m) => m.mailbox === mailbox);
  }
}
