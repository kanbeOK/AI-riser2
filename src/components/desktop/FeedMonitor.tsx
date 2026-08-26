import { useEffect, useRef, useState } from "react";
import { Activity, FileSearch, Pin, Send } from "lucide-react";
import { SCENARIOS } from "../../game/content/scenarios";
import type { CampaignState, FeedMessageEvent, FeedState, GameAction } from "../../game/state/types";

type FeedMonitorProps = {
  feed: FeedState;
  state: CampaignState;
  dispatch: React.Dispatch<GameAction>;
  isMain: boolean;
  onOpenCase: () => void;
};

type TurnResponse = {
  message?: string;
  clues?: string[];
};

function formatTime(minutes: number): string {
  return `${Math.floor(minutes / 60).toString().padStart(2, "0")}:${(minutes % 60)
    .toString()
    .padStart(2, "0")}`;
}

export function FeedMonitor({
  feed,
  state,
  dispatch,
  isMain,
  onOpenCase,
}: FeedMonitorProps) {
  const scenario = SCENARIOS[feed.id];
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [feed.messages.length]);

  const dispatchMessage = (event: FeedMessageEvent) => {
    dispatch({ type: "PROCESS_EVENT", payload: { event } });
  };

  const handleSend = async () => {
    const userMessage = input.trim();
    if (!userMessage || loading || feed.status !== "active") return;

    const now = state.minuteOfDay;
    const nonce = `${state.day}_${now}_${feed.messages.length}`;
    setInput("");
    setLoading(true);
    dispatchMessage({
      id: `player_event_${feed.id}_${nonce}`,
      day: state.day,
      minute: now,
      type: "feed_message",
      payload: {
        feedId: feed.id,
        message: {
          id: `player_message_${feed.id}_${nonce}`,
          senderId: "player",
          senderName: "BẠN",
          text: userMessage,
          timestamp: now,
          clues: [],
        },
      },
    });

    try {
      const history = feed.messages.slice(-8).map((message) => ({
        role: message.senderId === "player" ? ("user" as const) : ("model" as const),
        parts: [{ text: message.text }],
      }));
      const response = await fetch("/api/scenarios/turn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenarioId: feed.id, userMessage, history }),
      });
      if (!response.ok) throw new Error(`Scenario API returned ${response.status}`);
      const data = (await response.json()) as TurnResponse;
      const reply = data.message?.trim() || "Tôi cần bạn làm theo hướng dẫn ngay.";
      const allowedClues = (data.clues ?? []).filter((clueId) => Boolean(scenario?.evidenceBase[clueId]));
      dispatchMessage({
        id: `reply_event_${feed.id}_${nonce}`,
        day: state.day,
        minute: now,
        type: "feed_message",
        payload: {
          feedId: feed.id,
          message: {
            id: `reply_message_${feed.id}_${nonce}`,
            senderId: "scammer",
            senderName: scenario?.title ?? "NGUỒN TÍN HIỆU",
            text: reply,
            timestamp: now,
            clues: allowedClues,
          },
        },
      });
    } catch {
      dispatchMessage({
        id: `fallback_event_${feed.id}_${nonce}`,
        day: state.day,
        minute: now,
        type: "feed_message",
        payload: {
          feedId: feed.id,
          message: {
            id: `fallback_message_${feed.id}_${nonce}`,
            senderId: "system",
            senderName: "KÊNH DỰ PHÒNG",
            text: "Phản hồi trực tiếp bị gián đoạn. Dữ liệu theo lịch vẫn tiếp tục được ghi nhận.",
            timestamp: now,
            clues: [],
          },
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const extractEvidence = (clueId: string, messageId: string) => {
    const template = scenario?.evidenceBase[clueId];
    if (!template) return;
    dispatch({
      type: "EXTRACT_EVIDENCE",
      payload: {
        token: {
          id: template.id,
          caseId: feed.id,
          feedId: feed.id,
          eventId: messageId,
          entityType: template.entityType,
          label: template.label,
          value: template.displayValue,
          observedAt: state.minuteOfDay,
          confidence: 100,
          sourceRef: `${feed.id}/${messageId}`,
          lookupResult: template.lookupResult,
          relatedEntityIds: [...template.relatedEntityIds],
          educationalNote: template.educationalNote,
          lookedUp: false,
        },
      },
    });
  };

  const minutesLeft = Math.max(0, feed.deadlineMinute - state.minuteOfDay);
  const statusLabel =
    feed.status === "active"
      ? "ĐANG THEO DÕI"
      : feed.status === "resolved"
        ? "ĐÃ KHÉP"
        : feed.status === "failed"
          ? "ĐÃ MẤT"
          : "ĐÃ ĐÓNG";

  return (
    <div className={`feed-monitor feed-monitor-${feed.status} ${isMain ? "feed-main" : "feed-mini"}`}>
      <header className="feed-header">
        <div className="feed-title">
          <Activity size={15} />
          <div>
            <strong>{feed.title}</strong>
            <span>{feed.type.toUpperCase()} / {statusLabel}</span>
          </div>
        </div>
        <div className="feed-risk">
          <span>RỦI RO {Math.round(feed.risk)}%</span>
          <div><i style={{ width: `${feed.risk}%` }} /></div>
          {feed.status === "active" && <small>T-{minutesLeft.toString().padStart(2, "0")} PHÚT</small>}
        </div>
        {isMain && (
          <button className="case-open-button" onClick={onOpenCase}>
            <FileSearch size={15} /> Mở hồ sơ
          </button>
        )}
      </header>

      <div className="feed-messages" ref={scrollRef}>
        {feed.messages.length === 0 && (
          <div className="feed-quiet-state">Kênh đã khóa. Đang chờ gói dữ liệu đầu tiên.</div>
        )}
        {feed.messages.map((message) => (
          <article key={message.id} className={`message message-${message.senderId}`}>
            <header>
              <span>{message.senderName}</span>
              <time>{formatTime(message.timestamp)}</time>
            </header>
            <div className="message-body">{message.text}</div>
            {isMain && message.clues.length > 0 && (
              <div className="clue-attachments">
                {message.clues.map((clueId) => {
                  const template = scenario?.evidenceBase[clueId];
                  if (!template) return null;
                  const collected = state.evidence.some((evidence) => evidence.id === clueId);
                  return (
                    <button
                      key={clueId}
                      disabled={collected}
                      onClick={() => extractEvidence(clueId, message.id)}
                      aria-label={collected ? `Đã niêm phong ${template.label}` : `Niêm phong ${template.label}`}
                    >
                      <Pin size={13} /> {collected ? "Đã niêm phong" : template.label}
                    </button>
                  );
                })}
              </div>
            )}
          </article>
        ))}
        {loading && <div className="typing-indicator">Nguồn đang phản hồi...</div>}
      </div>

      {isMain && feed.status === "active" && (
        <div className="feed-composer">
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") void handleSend();
            }}
            placeholder="Thăm dò nguồn tín hiệu..."
            aria-label="Tin nhắn thăm dò"
            maxLength={300}
          />
          <button onClick={() => void handleSend()} disabled={!input.trim() || loading} aria-label="Gửi tin nhắn">
            <Send size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
