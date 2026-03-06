import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useEmployees } from '../hooks/useEmployees';
import { useEmployeeAttendanceHistory } from '../hooks/useAttendance';
import {
  startOfYear, endOfYear, eachDayOfInterval,
  startOfWeek, endOfWeek, format, isSameDay, isFuture, parseISO
} from 'date-fns';
import { Calendar } from 'lucide-react';

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const FIXED_GAP = 3;      // px gap between cells
const DAY_LABEL_W = 30;   // px for the day-label column
const DAY_LABEL_GAP = 8;  // px gap between label col and grid

const LEGEND_ITEMS = [
  { bg: '#e5e7eb', label: 'No Record' },
  // { bg: '#ddd6fe', label: 'Absent / Leave' },
  { bg: '#8b5cf6', label: 'Present' },
];

function ActivityHeatmap({ year, attendanceData }) {
  const containerRef = useRef(null);
  const [cellSize, setCellSize] = useState(13);

  // Compute how many weeks are in this year's grid
  const weeks = useMemo(() => {
    const yearStart = startOfYear(new Date(parseInt(year), 0, 1));
    const yearEnd   = endOfYear(yearStart);
    const startDate = startOfWeek(yearStart);
    const endDate   = endOfWeek(yearEnd);
    const days = eachDayOfInterval({ start: startDate, end: endDate });
    const result = [];
    let week = [];
    days.forEach(day => {
      week.push(day);
      if (week.length === 7) { result.push(week); week = []; }
    });
    return result;
  }, [year]);

  // Compute dynamic cell size from available width
  useEffect(() => {
    if (!containerRef.current) return;
    const compute = () => {
      const availableW = containerRef.current.clientWidth - DAY_LABEL_W - DAY_LABEL_GAP - 24; // 24 for card padding
      const numCols = weeks.length;
      // cell = (available - gaps) / numCols
      const computed = Math.max(10, Math.floor((availableW - (numCols - 1) * FIXED_GAP) / numCols));
      setCellSize(Math.min(computed, 18)); // cap at 18px
    };
    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [weeks.length]);

  const COL = cellSize + FIXED_GAP; // total width per week column

  const getDayStatus = (day) => {
    if (isFuture(day)) return null;
    const record = attendanceData?.find(r => {
      const d = typeof r.date === 'string' ? parseISO(r.date) : r.date;
      return isSameDay(d, day);
    });
    return record ? record.status : 'no_record';
  };

  const getCellBg = (day) => {
    const inYear = day.getFullYear() === parseInt(year);
    if (!inYear)        return 'transparent';
    if (isFuture(day)) return '#e5e7eb';
    const status = getDayStatus(day);
    if (!status || status === 'no_record') return '#e5e7eb';
    const map = {
      present: '#8b5cf6',
      absent:  '#ddd6fe',
      late:    '#c4b5fd',
      'half-day': '#a78bfa',
      leave:   '#ede9fe',
    };
    return map[status.toLowerCase()] ?? '#d1d5db';
  };

  const months = useMemo(() => {
    const labels = [];
    let cur = -1;
    weeks.forEach((week, wi) => {
      const first = week.find(d => d.getFullYear() === parseInt(year));
      if (!first) return;
      const m = first.getMonth();
      if (m !== cur) { labels.push({ index: wi, label: format(first, 'MMM') }); cur = m; }
    });
    return labels;
  }, [weeks, year]);

  const totalAttended = useMemo(() => {
    if (!attendanceData) return 0;
    return attendanceData.filter(r => {
      const d = typeof r.date === 'string' ? parseISO(r.date) : r.date;
      const s = r.status?.toLowerCase();
      return d.getFullYear() === parseInt(year) && s !== 'absent' && s !== 'leave';
    }).length;
  }, [attendanceData, year]);

  const gridOffsetX = DAY_LABEL_W + DAY_LABEL_GAP;

  return (
    <div ref={containerRef} className="bg-white p-6 rounded-xl shadow-card border border-gray-100 w-full">

      {/* Month row */}
      <div style={{ position: 'relative', height: 20, marginLeft: gridOffsetX, marginBottom: 6 }}>
        {months.map((m, i) => (
          <span
            key={i}
            style={{
              position: 'absolute',
              left: m.index * COL,
              fontSize: 11,
              color: '#6b7280',
              whiteSpace: 'nowrap',
              userSelect: 'none',
            }}
          >
            {m.label}
          </span>
        ))}
      </div>

      {/* Grid body */}
      <div style={{ display: 'flex', userSelect: 'none' }}>
        {/* Day-of-week labels */}
        <div style={{
          display: 'flex', flexDirection: 'column', gap: FIXED_GAP,
          width: DAY_LABEL_W, marginRight: DAY_LABEL_GAP,
          fontSize: 10, color: '#9ca3af', textAlign: 'right',
          flexShrink: 0,
        }}>
          {DAY_LABELS.map(label => (
            <div key={label} style={{ height: cellSize, lineHeight: `${cellSize}px` }}>
              {label}
            </div>
          ))}
        </div>

        {/* Cells */}
        <div style={{ display: 'flex', gap: FIXED_GAP, flex: 1 }}>
          {weeks.map((week, wi) => (
            <div key={wi} style={{ display: 'flex', flexDirection: 'column', gap: FIXED_GAP, flex: 1 }}>
              {week.map((day, di) => {
                const inYear = day.getFullYear() === parseInt(year);
                const bg = getCellBg(day);
                const status = getDayStatus(day);
                const tooltip = inYear
                  ? `${format(day, 'MMM d, yyyy')}${status && status !== 'no_record' ? ` — ${status}` : isFuture(day) ? '' : ' — No record'}`
                  : undefined;
                return (
                  <div
                    key={di}
                    title={tooltip}
                    style={{
                      height: cellSize,
                      borderRadius: 3,
                      background: bg,
                      cursor: inYear ? 'pointer' : 'default',
                      transition: 'filter 0.15s',
                      flexShrink: 0,
                    }}
                    onMouseEnter={e => { if (inYear) e.currentTarget.style.filter = 'brightness(0.85)'; }}
                    onMouseLeave={e => { e.currentTarget.style.filter = ''; }}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', alignItems: 'center', gap: FIXED_GAP, marginTop: 12, justifyContent: 'flex-end', fontSize: 11, color: '#6b7280' }}>
        <span style={{ marginRight: 4 }}>NO Record</span>
        {LEGEND_ITEMS.map(({ bg, label }) => (
          <div
            key={label}
            title={label}
            style={{ width: cellSize, height: cellSize, borderRadius: 3, background: bg, cursor: 'help', flexShrink: 0 }}
          />
        ))}
        <span style={{ marginLeft: 4, fontWeight: 600, color: '#111827' }}>Present</span>
      </div>

      {/* Attendance counter */}
      <div style={{ marginTop: 12, textAlign: 'center', fontSize: 13, color: '#4b5563' }}>
        <strong style={{ color: '#7c3aed' }}>{totalAttended}</strong> attendances in {year}
      </div>
    </div>
  );
}

export default function AttendancePage() {
  const { data: employees } = useEmployees();
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());

  const { data: attendanceHistory, isLoading: historyLoading } = useEmployeeAttendanceHistory(
    selectedEmployeeId || null
  );

  const years = Array.from({ length: 5 }, (_, i) => (new Date().getFullYear() - i).toString());

  return (
    <div className="min-h-full">
      {/* Header */}
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:tracking-tight flex items-center gap-2">
            <Calendar className="h-8 w-8 text-primary-600" />
            Attendance History
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Visualize historical attendance patterns for your team members.
          </p>
        </div>

        <div className="mt-4 sm:flex sm:gap-3 sm:mt-0">
          <select
            value={selectedEmployeeId}
            onChange={e => setSelectedEmployeeId(e.target.value)}
            className="block w-full sm:w-72 rounded-md border-0 py-2 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-primary-600 text-sm mb-2 sm:mb-0"
          >
            <option value="">Select an employee…</option>
            {employees?.map(emp => (
              <option key={emp.employee_id} value={emp.employee_id}>
                {emp.full_name} ({emp.department})
              </option>
            ))}
          </select>

          <select
            value={selectedYear}
            onChange={e => setSelectedYear(e.target.value)}
            className="block w-full sm:w-32 rounded-md border-0 py-2 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-primary-600 text-sm"
          >
            {years.map(yr => (
              <option key={yr} value={yr}>{yr}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Content */}
      {!selectedEmployeeId ? (
        <div className="bg-white rounded-xl shadow-card border border-gray-100 p-16 text-center">
          <Calendar className="mx-auto h-14 w-14 text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900">Select an Employee</h3>
          <p className="mt-2 text-sm text-gray-500">
            Choose an employee from the dropdown to view their full-year attendance heatmap.
          </p>
        </div>
      ) : (
        <div className="w-full">
          {historyLoading && (
            <div className="text-center text-sm text-gray-400 py-4 animate-pulse mb-4">
              Loading attendance records…
            </div>
          )}
          <ActivityHeatmap year={selectedYear} attendanceData={attendanceHistory} />
        </div>
      )}
    </div>
  );
}
