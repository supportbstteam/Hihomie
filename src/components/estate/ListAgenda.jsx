"use client";

import {
  ChevronLeft,
  ChevronRight,
  X,
  Clock,
  User,
  MapPin,
  FileText,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { get_agendas } from "@/store/estateAgenda";

// ─── Helpers ────────────────────────────────────────────────────────────────

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const CARD_HEIGHT = 48; // ← fixed height for every card in px

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d
    .toLocaleDateString("en-GB", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    })
    .split("/")
    .reverse()
    .join("-");
}
function formatHour(h) {
  if (h === 0) return "12 AM";
  if (h < 12) return `${h} AM`;
  if (h === 12) return "12 PM";
  return `${h - 12} PM`;
}

function formatTime(timeStr) {
  if (!timeStr) return "";
  const [h, m] = timeStr.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, "0")} ${suffix}`;
}

function getWeekDates(startDate) {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    return d;
  });
}

function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function toDateObj(dateStr) {
  return new Date(dateStr);
}

function agendaStartHour(agenda) {
  if (!agenda.startTime) return 0;
  const [h] = agenda.startTime.split(":").map(Number);
  return h;
}

function agendaStartMinute(agenda) {
  if (!agenda.startTime) return 0;
  const [, m] = agenda.startTime.split(":").map(Number);
  return m || 0;
}

function agendaDurationHours(agenda) {
  if (!agenda.startTime || !agenda.endTime) return 1;
  const [sh, sm] = agenda.startTime.split(":").map(Number);
  const [eh, em] = agenda.endTime.split(":").map(Number);
  const diff = (eh * 60 + em - sh * 60 - sm) / 60;
  return diff > 0 ? diff : 1;
}

// ─── Overlap Layout ──────────────────────────────────────────────────────────

function layoutAgendas(agendas) {
  const sorted = [...agendas].sort((a, b) => {
    const aStart = agendaStartHour(a) * 60 + agendaStartMinute(a);
    const bStart = agendaStartHour(b) * 60 + agendaStartMinute(b);
    return aStart - bStart;
  });

  const columns = [];
  const assigned = sorted.map((agenda) => {
    const startMin = agendaStartHour(agenda) * 60 + agendaStartMinute(agenda);
    const endMin = startMin + agendaDurationHours(agenda) * 60;
    let col = columns.findIndex((colEnd) => colEnd <= startMin);
    if (col === -1) col = columns.length;
    columns[col] = endMin;
    return { agenda, col, startMin, endMin };
  });

  return assigned.map((item) => {
    const overlapping = assigned.filter(
      (other) => other.startMin < item.endMin && other.endMin > item.startMin,
    );
    const totalCols = Math.max(...overlapping.map((o) => o.col)) + 1;
    return { agenda: item.agenda, col: item.col, totalCols };
  });
}

// ─── Type Colors ─────────────────────────────────────────────────────────────

const TYPE_COLORS = {
  Visit: {
    bg: "bg-emerald-50",
    border: "border-emerald-400",
    text: "text-emerald-700",
    dot: "bg-emerald-400",
    badge: "bg-emerald-100 text-emerald-700",
  },
  Call: {
    bg: "bg-sky-50",
    border: "border-sky-400",
    text: "text-sky-700",
    dot: "bg-sky-400",
    badge: "bg-sky-100 text-sky-700",
  },
  Meeting: {
    bg: "bg-violet-50",
    border: "border-violet-400",
    text: "text-violet-700",
    dot: "bg-violet-400",
    badge: "bg-violet-100 text-violet-700",
  },
  default: {
    bg: "bg-gray-50",
    border: "border-gray-400",
    text: "text-gray-700",
    dot: "bg-gray-400",
    badge: "bg-gray-100 text-gray-600",
  },
};

function typeColor(type) {
  return TYPE_COLORS[type] || TYPE_COLORS.default;
}

// ─── Detail Modal ────────────────────────────────────────────────────────────

function AgendaDetailModal({ agenda, onClose }) {
  if (!agenda) return null;
  const colors = typeColor(agenda.type);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl border border-gray-300 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`h-1.5 w-full ${colors.dot}`} />

        <div className="flex items-start justify-between px-6 pt-5 pb-3">
          <div>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${colors.bg} ${colors.text} border ${colors.border} mb-2`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${colors.dot}`} />
              {agenda.type}
            </span>
            <h3 className="text-xl font-bold text-gray-900 leading-tight">
              {agenda.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="ml-4 mt-1 rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-6 pb-6 flex flex-col gap-3">
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <Clock size={15} className="text-gray-400 shrink-0" />
            <span>
              {agenda.date}
              {agenda.startTime && (
                <>
                  &nbsp;·&nbsp;{formatTime(agenda.startTime)}
                  {agenda.endTime && <> – {formatTime(agenda.endTime)}</>}
                </>
              )}
            </span>
          </div>

          {agenda.responsible && (
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <User size={15} className="text-gray-400 shrink-0" />
              <span>
                {typeof agenda.responsible === "object"
                  ? `${agenda.responsible.name || ""} ${agenda.responsible.lname || ""}`.trim()
                  : agenda.responsible}
              </span>
            </div>
          )}

          {agenda.contact && (
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <User size={15} className="text-gray-400 shrink-0" />
              <span className="text-gray-400 mr-1">Contact:</span>
              <span>
                {typeof agenda.contact === "object"
                  ? `${agenda.contact.name || ""} ${agenda.contact.lname || ""}`.trim()
                  : agenda.contact}
              </span>
            </div>
          )}

          {agenda.property && (
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <MapPin size={15} className="text-gray-400 shrink-0" />
              <span>
                {typeof agenda.property === "object"
                  ? agenda.property.full_address ||
                    agenda.property.property_title
                  : agenda.property}
              </span>
            </div>
          )}

          {agenda.observations && (
            <div className="flex items-start gap-3 text-sm text-gray-600">
              <FileText size={15} className="text-gray-400 shrink-0 mt-0.5" />
              <p className="leading-relaxed">{agenda.observations}</p>
            </div>
          )}

          {!agenda.responsible &&
            !agenda.contact &&
            !agenda.property &&
            !agenda.observations && (
              <p className="text-sm text-gray-400 italic">
                No additional details.
              </p>
            )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

const CELL_HEIGHT = 60;
const TIME_COL_WIDTH = 60;
const DAY_HEADER_HEIGHT = 56;

const ListAgenda = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const { agendas } = useSelector((state) => state.estateAgenda);

  const getThisMonday = () => {
    const today = new Date();
    const day = today.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    const monday = new Date(today);
    monday.setDate(today.getDate() + diff);
    monday.setHours(0, 0, 0, 0);
    return monday;
  };

  const [weekStart, setWeekStart] = useState(getThisMonday);
  const [selectedAgenda, setSelectedAgenda] = useState(null);
  const scrollRef = useRef(null);

  const weekDates = getWeekDates(weekStart);
  const today = new Date();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = CELL_HEIGHT * 7.5;
    }
  }, []);

  useEffect(() => {
    let end = new Date(weekStart);
    end.setDate(end.getDate() + 6);
    let startDate = formatDate(weekStart);
    let endDate = formatDate(end);

    dispatch(get_agendas({ startDate: startDate, endDate: endDate }));
  }, [weekStart]);

  const goBack = () => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() - 7);
    setWeekStart(d);
  };

  const goForward = () => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + 7);
    setWeekStart(d);
  };

  const goToday = () => setWeekStart(getThisMonday());

  const agendasForDay = (date) =>
    (agendas ?? []).filter((a) => isSameDay(toDateObj(a.date), date));

  const monthLabel = weekDates[0].toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });

  const gridCols = `${TIME_COL_WIDTH}px repeat(7, 1fr)`;

  return (
    <div className="flex flex-col bg-white font-sans min-h-screen select-none">
      {/* ── Top Bar ── */}
      <div className="flex items-center justify-between border-b border-gray-300 px-6 py-3">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-gray-800">Agenda</h2>
          <span className="text-sm text-gray-400 font-medium">
            {monthLabel}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={goToday}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Today
          </button>
          <button
            onClick={goBack}
            className="rounded-md border border-gray-300 p-1.5 text-gray-500 hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={goForward}
            className="rounded-md border border-gray-300 p-1.5 text-gray-500 hover:bg-gray-50 transition-colors"
          >
            <ChevronRight size={16} />
          </button>
          <button
            onClick={() => router.push("/estate/agenda/create")}
            className="ml-2 rounded-md bg-green-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-green-700 transition-colors"
          >
            + New Task
          </button>
        </div>
      </div>

      {/* ── Calendar: header + body in ONE scroll container ── */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto overflow-x-hidden"
        style={{ maxHeight: "calc(100vh - 57px)" }}
      >
        {/* ── Day Headers ── */}
        <div
          className="grid sticky top-0 z-30 bg-white border-b-2 border-gray-500"
          style={{ gridTemplateColumns: gridCols }}
        >
          <div
            className="border-r border-gray-500 bg-white"
            style={{ height: DAY_HEADER_HEIGHT }}
          />
          {weekDates.map((date, i) => {
            const isToday = isSameDay(date, today);
            const dayName = date
              .toLocaleDateString("en-GB", { weekday: "short" })
              .toUpperCase();
            const dayNum = date.getDate();
            return (
              <div
                key={i}
                className={`flex flex-col items-center justify-center border-r border-gray-500 last:border-r-0 ${isToday ? "bg-green-50" : "bg-white"}`}
                style={{ height: DAY_HEADER_HEIGHT }}
              >
                <span
                  className={`text-[10px] font-semibold tracking-widest ${isToday ? "text-green-600" : "text-gray-400"}`}
                >
                  {dayName}
                </span>
                <span
                  className={`mt-0.5 flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold
                    ${isToday ? "bg-green-600 text-white" : "text-gray-700"}`}
                >
                  {dayNum}
                </span>
              </div>
            );
          })}
        </div>

        {/* ── Grid Body ── */}
        <div
          className="grid relative"
          style={{
            gridTemplateColumns: gridCols,
            height: `${CELL_HEIGHT * 24}px`,
          }}
        >
          {/* ── Time Labels ── */}
          <div className="relative border-r border-gray-500">
            {HOURS.map((h) => (
              <div
                key={h}
                className="absolute right-2 flex items-start"
                style={{
                  top: `${h * CELL_HEIGHT - 8}px`,
                  height: `${CELL_HEIGHT}px`,
                }}
              >
                {h > 0 && (
                  <span className="text-[10px] font-medium text-gray-500 whitespace-nowrap">
                    {formatHour(h)}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* ── Day Columns ── */}
          {weekDates.map((date, colIdx) => {
            const isToday = isSameDay(date, today);
            const dayAgendas = agendasForDay(date);
            const laid = layoutAgendas(dayAgendas);

            return (
              <div
                key={colIdx}
                className={`relative border-r border-gray-500 last:border-r-0 ${isToday ? "bg-green-50/30" : ""}`}
              >
                {/* Hour lines */}
                {HOURS.map((h) => (
                  <div
                    key={h}
                    className="absolute left-0 right-0 border-t border-gray-300"
                    style={{ top: `${h * CELL_HEIGHT}px` }}
                  />
                ))}

                {/* Half-hour dashed lines */}
                {HOURS.map((h) => (
                  <div
                    key={`half-${h}`}
                    className="absolute left-0 right-0 border-t border-dashed border-gray-300"
                    style={{ top: `${h * CELL_HEIGHT + CELL_HEIGHT / 2}px` }}
                  />
                ))}

                {/* Current time indicator */}
                {isToday &&
                  (() => {
                    const now = new Date();
                    const top = (now.getHours() + now.getMinutes() / 60) * CELL_HEIGHT;
                    const timeString = now.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    });
                    return (
                      <div
                        title={timeString}
                        className="absolute left-0 right-0 z-10 flex items-center -translate-y-1/2"
                        style={{ top: `${top}px` }}
                      >
                        <div className="h-2.5 w-2.5 rounded-full bg-green-500 -ml-1.5 shrink-0 shadow" />
                        <div className="flex-1 border-t-2 border-green-500" />
                      </div>
                    );
                  })()}

                {/* ── Agenda Cards ── */}
                {laid.map(({ agenda, col, totalCols }, aIdx) => {
                  const startH = agendaStartHour(agenda);
                  const startM = agendaStartMinute(agenda);
                  const top = (startH + startM / 60) * CELL_HEIGHT;
                  const colors = typeColor(agenda.type);
                  const widthPct = 100 / totalCols;
                  const leftPct = col * widthPct;

                  return (
                    <div
                      key={agenda._id || aIdx}
                      onClick={() => setSelectedAgenda(agenda)}
                      className={`absolute rounded-md border-l-4 px-2 py-1.5 cursor-pointer shadow-sm transition-all hover:shadow-md hover:brightness-95 z-20
                        ${colors.bg} ${colors.border}`}
                      style={{
                        top: `${top + 1}px`,
                        height: `${CARD_HEIGHT}px`, // ← fixed height
                        left: `calc(${leftPct}% + 2px)`,
                        width: `calc(${widthPct}% - 4px)`,
                        overflow: "hidden",
                      }}
                    >
                      {/* ── Start time badge ── */}
                      {agenda.startTime && (
                        <span
                          className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[9px] font-bold mb-1 ${colors.badge}`}
                        >
                          <Clock size={8} />
                          {formatTime(agenda.startTime)}
                        </span>
                      )}

                      {/* ── Title ── */}
                      <p
                        className={`text-[11px] font-bold leading-tight truncate ${colors.text}`}
                      >
                        {agenda.title}
                      </p>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Detail Modal ── */}
      {selectedAgenda && (
        <AgendaDetailModal
          agenda={selectedAgenda}
          onClose={() => setSelectedAgenda(null)}
        />
      )}
    </div>
  );
};

export default ListAgenda;
