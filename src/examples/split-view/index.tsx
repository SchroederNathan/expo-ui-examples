import { Host } from '@expo/ui';
import {
  Button,
  ContentUnavailableView,
  Divider,
  HStack,
  Image,
  Label,
  List,
  Menu,
  NavigationSplitView,
  type NavigationSplitViewColumn,
  type NavigationSplitViewVisibility,
  ScrollView,
  Section,
  Spacer,
  SwipeActions,
  Text,
  Toolbar,
  ToolbarItem,
  VStack,
} from '@expo/ui/swift-ui';
import {
  background,
  badge,
  font,
  foregroundStyle,
  frame,
  lineLimit,
  listStyle,
  navigationSplitViewColumnWidth,
  navigationTitle,
  opacity,
  padding,
  shapes,
  tag,
  tint,
} from '@expo/ui/swift-ui/modifiers';
import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';

import {
  ALL_MAILBOXES,
  FOLDERS,
  MAILBOXES,
  MESSAGES,
  type Mailbox,
  type MailboxId,
  type Message,
  messagesIn,
} from './mail-data';

const secondary = foregroundStyle({ type: 'hierarchical', style: 'secondary' });
const UNREAD_BLUE = '#007AFF';

// Navigation Split View — a three-column mail client: mailboxes in the sidebar, the
// messages of the selected mailbox in the content column, and the open message in the
// detail column. The same tree lays itself out for whatever width the window has: a
// push-and-pop stack on an iPhone or the folded iPhone Duo, and side-by-side columns on
// an iPad or the unfolded Duo. Folding and unfolding keeps the selection, so the open
// message stays open. The stack header is hidden because every column brings its own
// navigation bar.
export default function SplitViewScreen() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>(MESSAGES);
  // Mail opens on the inbox, not on the list of mailboxes: the inbox starts selected,
  // and the stacked layout starts on the content column so its back button leads to
  // the mailboxes.
  const [mailboxId, setMailboxId] = useState<MailboxId | null>('inbox');
  const [messageId, setMessageId] = useState<string | null>(null);
  const [compactColumn, setCompactColumn] = useState<NavigationSplitViewColumn>('content');
  const [unreadOnly, setUnreadOnly] = useState(false);
  // Left to `automatic`, an iPad in portrait shows only the reader. Starting on
  // `doubleColumn` keeps the message list beside it, with the mailboxes one tap away.
  // The stacked layout ignores this value.
  const [visibility, setVisibility] = useState<NavigationSplitViewVisibility>('doubleColumn');

  const mailbox = ALL_MAILBOXES.find((m) => m.id === mailboxId);
  const shown = mailbox
    ? messagesIn(mailbox.id, messages).filter((m) => !unreadOnly || m.unread)
    : [];
  const message = messages.find((m) => m.id === messageId);

  const update = (id: string, change: Partial<Message>) =>
    setMessages((all) => all.map((m) => (m.id === id ? { ...m, ...change } : m)));

  const openMessage = (id: string | null) => {
    setMessageId(id);
    if (id) {
      update(id, { unread: false });
      setCompactColumn('detail');
    }
  };

  // Moving a message out of the open mailbox closes it, so the detail column never
  // shows a message the list no longer has. In the stacked layout that pops back to
  // the list.
  const move = (id: string, to: MailboxId) => {
    update(id, { mailbox: to });
    if (id === messageId) {
      setMessageId(null);
      setCompactColumn('content');
    }
  };

  // Compose and Reply both start a draft and open it, so the new message is easy to
  // find: it is the open message in Drafts.
  const startDraft = (subject: string) => {
    const id = `draft-${Date.now()}`;
    setMessages((all) => [
      {
        id,
        mailbox: 'drafts',
        sender: 'Nate',
        color: UNREAD_BLUE,
        subject,
        body: ['Draft — not sent yet.'],
        time: 'Now',
        date: 'Today, now',
        unread: false,
        flagged: false,
      },
      ...all,
    ]);
    setMailboxId('drafts');
    setUnreadOnly(false);
    setMessageId(id);
    setCompactColumn('detail');
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <Host style={{ flex: 1 }}>
        <NavigationSplitView
          // Controlled: the back button in the stacked layout reports the column it
          // goes back to, and the stack only moves once that value comes back in.
          preferredCompactColumn={compactColumn}
          onPreferredCompactColumnChange={setCompactColumn}
          // Controlled too: the sidebar button and edge swipe report the new
          // visibility here.
          columnVisibility={visibility}
          onColumnVisibilityChange={setVisibility}>
          <NavigationSplitView.Sidebar>
            <Toolbar>
              <List
                // A single-element selection. In the stacked layout, choosing a row
                // pushes the next column; popping back clears the selection.
                selection={mailboxId ? [mailboxId] : []}
                onSelectionChange={(selection) => {
                  const next = selection[0];
                  const id = typeof next === 'string' ? (next as MailboxId) : null;
                  if (id !== mailboxId) {
                    setMessageId(null);
                    setUnreadOnly(false);
                  }
                  setMailboxId(id);
                  if (id) setCompactColumn('content');
                }}
                modifiers={[
                  listStyle('sidebar'),
                  navigationTitle('Mailboxes'),
                  navigationSplitViewColumnWidth({ min: 200, ideal: 240, max: 300 }),
                ]}>
                <Section title="Mailboxes">
                  {MAILBOXES.map((m) => (
                    <MailboxRow key={m.id} mailbox={m} messages={messages} />
                  ))}
                </Section>
                <Section title="Folders">
                  {FOLDERS.map((m) => (
                    <MailboxRow key={m.id} mailbox={m} messages={messages} />
                  ))}
                </Section>
              </List>
              <Toolbar.Content>
                <ToolbarItem placement="topBarLeading">
                  {/* A toolbar shows only the icon; the label is what VoiceOver reads. */}
                  <Button
                    label="Examples"
                    systemImage="chevron.backward"
                    onPress={() => router.back()}
                  />
                </ToolbarItem>
              </Toolbar.Content>
            </Toolbar>
          </NavigationSplitView.Sidebar>

          <NavigationSplitView.Content>
            {mailbox ? (
              <Toolbar>
                {shown.length > 0 ? (
                  <List
                    selection={messageId ? [messageId] : []}
                    onSelectionChange={(selection) => {
                      const next = selection[0];
                      openMessage(typeof next === 'string' ? next : null);
                    }}
                    modifiers={[
                      listStyle('plain'),
                      navigationTitle(mailbox.name),
                      navigationSplitViewColumnWidth({ min: 300, ideal: 360, max: 440 }),
                    ]}>
                    {shown.map((m) => (
                      <MessageRow
                        key={m.id}
                        message={m}
                        inTrash={m.mailbox === 'trash'}
                        onToggleUnread={() => update(m.id, { unread: !m.unread })}
                        onToggleFlag={() => update(m.id, { flagged: !m.flagged })}
                        onArchive={() => move(m.id, 'archive')}
                        onTrash={() => move(m.id, 'trash')}
                      />
                    ))}
                  </List>
                ) : (
                  <ContentUnavailableView
                    title={unreadOnly ? 'No Unread Mail' : 'No Mail'}
                    systemImage="tray"
                    description={
                      unreadOnly
                        ? `Everything in ${mailbox.name} is read.`
                        : `${mailbox.name} is empty.`
                    }
                    modifiers={[navigationTitle(mailbox.name)]}
                  />
                )}
                {/* The bottom bar reads like Mail's: the unread filter, the status
                    centered by its `status` placement, and New Message. Toolbar items
                    render in reverse order, so New Message comes first here. */}
                <Toolbar.Content>
                  <ToolbarItem placement="bottomBar">
                    <Button
                      label="New Message"
                      systemImage="square.and.pencil"
                      onPress={() => startDraft('New Message')}
                    />
                  </ToolbarItem>
                  <ToolbarItem placement="status">
                    <Text modifiers={[font({ textStyle: 'caption' }), secondary]}>
                      {unreadOnly ? 'Filtered by: Unread' : 'Updated Just Now'}
                    </Text>
                  </ToolbarItem>
                  <ToolbarItem placement="bottomBar">
                    <Button
                      label={unreadOnly ? 'Show All Mail' : 'Show Unread Only'}
                      systemImage={
                        unreadOnly
                          ? 'line.3.horizontal.decrease.circle.fill'
                          : 'line.3.horizontal.decrease.circle'
                      }
                      onPress={() => setUnreadOnly((on) => !on)}
                    />
                  </ToolbarItem>
                </Toolbar.Content>
              </Toolbar>
            ) : (
              <ContentUnavailableView
                title="No Mailbox Selected"
                systemImage="tray.2"
                description="Pick a mailbox from the sidebar."
              />
            )}
          </NavigationSplitView.Content>

          <NavigationSplitView.Detail>
            {message ? (
              <Toolbar>
                <MessageDetail message={message} />
                <Toolbar.Content>
                  {/* Trailing toolbar items render right to left, so this order shows
                      Archive, Move, Trash, Flag, Reply from the left. */}
                  <ToolbarItem placement="topBarTrailing">
                    <Menu label="Reply" systemImage="arrowshape.turn.up.left">
                      <Button
                        label="Reply"
                        systemImage="arrowshape.turn.up.left"
                        onPress={() => startDraft(`Re: ${message.subject}`)}
                      />
                      <Button
                        label="Forward"
                        systemImage="arrowshape.turn.up.right"
                        onPress={() => startDraft(`Fwd: ${message.subject}`)}
                      />
                    </Menu>
                  </ToolbarItem>
                  <ToolbarItem placement="topBarTrailing">
                    <Button
                      label={message.flagged ? 'Unflag' : 'Flag'}
                      systemImage={message.flagged ? 'flag.fill' : 'flag'}
                      onPress={() => update(message.id, { flagged: !message.flagged })}
                    />
                  </ToolbarItem>
                  <ToolbarItem placement="topBarTrailing">
                    <Button
                      label="Trash"
                      systemImage="trash"
                      onPress={() => move(message.id, 'trash')}
                    />
                  </ToolbarItem>
                  <ToolbarItem placement="topBarTrailing">
                    <Menu label="Move" systemImage="folder">
                      {[...MAILBOXES, ...FOLDERS]
                        .filter((m) => m.id !== 'vip' && m.id !== 'flagged')
                        .filter((m) => m.id !== message.mailbox)
                        .map((m) => (
                          <Button
                            key={m.id}
                            label={m.name}
                            systemImage={m.systemImage}
                            onPress={() => move(message.id, m.id)}
                          />
                        ))}
                    </Menu>
                  </ToolbarItem>
                  <ToolbarItem placement="topBarTrailing">
                    <Button
                      label="Archive"
                      systemImage="archivebox"
                      onPress={() => move(message.id, 'archive')}
                    />
                  </ToolbarItem>
                </Toolbar.Content>
              </Toolbar>
            ) : (
              <ContentUnavailableView
                title="No Message Selected"
                systemImage="envelope"
                description={mailbox ? `Pick a message in ${mailbox.name}.` : undefined}
              />
            )}
          </NavigationSplitView.Detail>
        </NavigationSplitView>
      </Host>
    </>
  );
}

function MailboxRow({ mailbox, messages }: { mailbox: Mailbox; messages: Message[] }) {
  const inMailbox = messagesIn(mailbox.id, messages);
  // Drafts counts everything in it; the other mailboxes count only unread mail.
  const count =
    mailbox.id === 'drafts' ? inMailbox.length : inMailbox.filter((m) => m.unread).length;
  // Trash and Archive never show a count, as in Mail.
  const showCount = count > 0 && mailbox.id !== 'trash' && mailbox.id !== 'archive';

  return mailbox.color ? (
    // A fixed color goes through `icon`; a `systemImage` takes the tint instead.
    <Label
      title={mailbox.name}
      // Without a size, a custom Label icon renders at its natural symbol size, which
      // is larger than the tinted icons next to it.
      icon={<Image systemName={mailbox.systemImage} size={17} color={mailbox.color} />}
      modifiers={[tag(mailbox.id), ...(showCount ? [badge(String(count))] : [])]}
    />
  ) : (
    <Label
      title={mailbox.name}
      systemImage={mailbox.systemImage}
      modifiers={[tag(mailbox.id), ...(showCount ? [badge(String(count))] : [])]}
    />
  );
}

function MessageRow({
  message,
  inTrash,
  onToggleUnread,
  onToggleFlag,
  onArchive,
  onTrash,
}: {
  message: Message;
  inTrash: boolean;
  onToggleUnread: () => void;
  onToggleFlag: () => void;
  onArchive: () => void;
  onTrash: () => void;
}) {
  return (
    // The tag goes on the outermost view of the row, so the list can select it.
    <SwipeActions modifiers={[tag(message.id)]}>
      <HStack alignment="top" spacing={8} modifiers={[padding({ vertical: 4 })]}>
        {/* The dot keeps its slot when the message is read, so every row lines up. */}
        <Image
          systemName="circle.fill"
          size={10}
          color={UNREAD_BLUE}
          modifiers={[padding({ top: 6 }), opacity(message.unread ? 1 : 0)]}
        />
        <VStack alignment="leading" spacing={2}>
          <HStack spacing={6}>
            <Text modifiers={[font({ textStyle: 'headline' }), lineLimit(1)]}>
              {message.sender}
            </Text>
            <Spacer />
            {message.flagged ? <Image systemName="flag.fill" size={12} color="#FF9500" /> : null}
            <Text modifiers={[font({ textStyle: 'subheadline' }), secondary]}>{message.time}</Text>
          </HStack>
          <Text modifiers={[font({ textStyle: 'subheadline' }), lineLimit(1)]}>
            {message.subject}
          </Text>
          <Text modifiers={[font({ textStyle: 'subheadline' }), secondary, lineLimit(2)]}>
            {message.body[0]}
          </Text>
        </VStack>
      </HStack>
      <SwipeActions.Actions edge="leading">
        <Button
          label={message.unread ? 'Read' : 'Unread'}
          systemImage={message.unread ? 'envelope.open' : 'envelope.badge'}
          onPress={onToggleUnread}
          modifiers={[tint(UNREAD_BLUE)]}
        />
      </SwipeActions.Actions>
      <SwipeActions.Actions edge="trailing">
        {/* The first button is the one a full swipe performs. Archive leads everywhere,
            and in Trash it is also the way out, so Trash has no Trash button. */}
        <Button
          label="Archive"
          systemImage="archivebox"
          onPress={onArchive}
          modifiers={[tint('#AF52DE')]}
        />
        <Button
          label={message.flagged ? 'Unflag' : 'Flag'}
          systemImage={message.flagged ? 'flag.slash' : 'flag'}
          onPress={onToggleFlag}
          modifiers={[tint('#FF9500')]}
        />
        {inTrash ? null : (
          <Button label="Trash" systemImage="trash" role="destructive" onPress={onTrash} />
        )}
      </SwipeActions.Actions>
    </SwipeActions>
  );
}

function MessageDetail({ message }: { message: Message }) {
  return (
    <ScrollView modifiers={[navigationTitle('')]}>
      <VStack
        alignment="leading"
        spacing={16}
        modifiers={[
          padding({ horizontal: 20, vertical: 12 }),
          frame({ maxWidth: Infinity, alignment: 'leading' }),
        ]}>
        <Text modifiers={[font({ textStyle: 'title2', weight: 'bold' })]}>{message.subject}</Text>
        <HStack spacing={12}>
          <Text
            modifiers={[
              font({ textStyle: 'headline' }),
              foregroundStyle('#FFFFFF'),
              frame({ width: 44, height: 44 }),
              background(message.color, shapes.circle()),
            ]}>
            {message.sender.charAt(0)}
          </Text>
          <VStack alignment="leading" spacing={1}>
            <Text modifiers={[font({ textStyle: 'headline' })]}>{message.sender}</Text>
            <Text modifiers={[font({ textStyle: 'subheadline' }), secondary]}>To: Nate</Text>
          </VStack>
          <Spacer />
          <Text modifiers={[font({ textStyle: 'subheadline' }), secondary]}>{message.date}</Text>
        </HStack>
        <Divider />
        {message.body.map((paragraph, i) => (
          <Text key={i} modifiers={[font({ textStyle: 'body' })]}>
            {paragraph}
          </Text>
        ))}
        {message.attachment ? (
          <HStack
            spacing={12}
            modifiers={[
              padding({ all: 12 }),
              background(
                { type: 'hierarchical', style: 'quinary' },
                shapes.roundedRectangle({ cornerRadius: 16 })
              ),
            ]}>
            <Image systemName="doc.richtext.fill" size={28} color="#FF3B30" />
            <VStack alignment="leading" spacing={1}>
              <Text modifiers={[font({ textStyle: 'subheadline', weight: 'semibold' })]}>
                {message.attachment.name}
              </Text>
              <Text modifiers={[font({ textStyle: 'caption' }), secondary]}>
                {message.attachment.size}
              </Text>
            </VStack>
          </HStack>
        ) : null}
      </VStack>
    </ScrollView>
  );
}
