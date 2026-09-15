"use client";

import { useMemo, useState } from "react";
import { initials } from "@/lib/seed-data";
import type { AlumniProfile, Conversation } from "@/lib/types";

export function MessagesView({
  alumni,
  conversations,
  activeConversationId,
  draft,
  onSelectConversation,
  onStartConversation,
  onDraft,
  onSend
}: {
  alumni: AlumniProfile[];
  conversations: Conversation[];
  activeConversationId: string | null;
  draft: string;
  onSelectConversation: (id: string) => void;
  onStartConversation: (person: AlumniProfile) => void;
  onDraft: (value: string) => void;
  onSend: () => void;
}) {
  const [contactSearch, setContactSearch] = useState("");
  const [mobileThreadOpen, setMobileThreadOpen] = useState(false);
  const activeConversation = conversations.find((conversation) => conversation.id === activeConversationId) ?? conversations[0];
  const availableContacts = useMemo(() => {
    const query = contactSearch.trim().toLowerCase();
    return alumni
      .filter((person) => person.canMessage !== false)
      .filter((person) => !query || [person.name, person.industry, person.business].join(" ").toLowerCase().includes(query))
      .slice(0, 6);
  }, [alumni, contactSearch]);

  return (
    <section className="messages-layout" aria-label="Private messages">
      <aside className={mobileThreadOpen ? "glass-panel inbox-panel mobile-thread-active" : "glass-panel inbox-panel"}>
        <div className="messages-section-head">
          <div>
            <p className="section-label">Private conversations</p>
            <h3>Inbox</h3>
          </div>
          <span className="message-count">{conversations.reduce((total, item) => total + item.unread, 0)} new</span>
        </div>
        <div className="conversation-list">
          {conversations.map((conversation) => {
            const lastMessage = conversation.messages.at(-1);
            return (
              <button
                className={conversation.id === activeConversation?.id ? "conversation-item active" : "conversation-item"}
                key={conversation.id}
                onClick={() => {
                  onSelectConversation(conversation.id);
                  setMobileThreadOpen(true);
                }}
              >
                <span className="mini-avatar blue">{initials(conversation.participantName)}</span>
                <span className="conversation-copy">
                  <strong>{conversation.participantName}</strong>
                  <small>{lastMessage?.body ?? "Start the conversation"}</small>
                </span>
                {conversation.unread > 0 && <span className="unread-dot" aria-label={`${conversation.unread} unread`} />}
              </button>
            );
          })}
        </div>

        <div className="new-conversation">
          <p className="section-label">Start a conversation</p>
          <input
            aria-label="Find someone to message"
            placeholder="Search name or interest..."
            value={contactSearch}
            onChange={(event) => setContactSearch(event.target.value)}
          />
          <div className="quick-contact-list">
            {availableContacts.map((person) => (
              <button key={person.id} onClick={() => {
                onStartConversation(person);
                setMobileThreadOpen(true);
              }}>
                <span className="mini-avatar green">{initials(person.name)}</span>
                <span>
                  <strong>{person.name}</strong>
                  <small>{person.industry}</small>
                </span>
              </button>
            ))}
          </div>
        </div>
      </aside>

      <section className={mobileThreadOpen ? "glass-panel thread-panel mobile-open" : "glass-panel thread-panel"}>
        {activeConversation ? (
          <>
            <button className="mobile-back" onClick={() => setMobileThreadOpen(false)}>← Back to inbox</button>
            <header className="thread-head">
              <span className="avatar blue">{initials(activeConversation.participantName)}</span>
              <div>
                <h3>{activeConversation.participantName}</h3>
                <p>{activeConversation.participantDetail}</p>
              </div>
            </header>
            <div className="message-thread" aria-live="polite">
              {activeConversation.messages.length === 0 && (
                <div className="thread-empty">
                  <strong>Say hello</strong>
                  <span>Introduce yourself and say what you would like to connect about.</span>
                </div>
              )}
              {activeConversation.messages.map((message) => (
                <div className={message.sender === "me" ? "message-bubble mine" : "message-bubble"} key={message.id}>
                  <p>{message.body}</p>
                  <span>{message.sentAt}</span>
                </div>
              ))}
            </div>
            <form
              className="message-composer"
              onSubmit={(event) => {
                event.preventDefault();
                onSend();
              }}
            >
              <textarea
                aria-label={`Message ${activeConversation.participantName}`}
                placeholder="Write a private message..."
                value={draft}
                onChange={(event) => onDraft(event.target.value)}
              />
              <div>
                <span>Press Send when you’re ready.</span>
                <button className="primary-button" type="submit" disabled={!draft.trim()}>
                  Send
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="thread-empty large">
            <strong>Choose a conversation</strong>
            <span>Select someone from your inbox or start a new message.</span>
          </div>
        )}
      </section>
    </section>
  );
}
