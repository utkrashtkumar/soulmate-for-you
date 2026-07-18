'use client';
import { useState, useRef, useEffect } from 'react';

function calculateAgeFromDdMmYyyy(raw8Digits) {
  if (!raw8Digits || raw8Digits.length !== 8) return null;
  const day = parseInt(raw8Digits.slice(0, 2), 10);
  const month = parseInt(raw8Digits.slice(2, 4), 10) - 1;
  const year = parseInt(raw8Digits.slice(4, 8), 10);
  if (isNaN(day) || isNaN(month) || isNaN(year)) return null;

  const dob = new Date(year, month, day);
  if (isNaN(dob.getTime()) || dob.getDate() !== day || dob.getMonth() !== month || dob.getFullYear() !== year) return null;

  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
  return { age, dob, day, month, year };
}

export default function DatePicker({ value = '', onChange, placeholder = 'DD/MM/YYYY', minAge = 18 }) {
  const [displayText, setDisplayText] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedYear, setSelectedYear] = useState(2000);
  const [selectedMonth, setSelectedMonth] = useState(0); // 0-11
  const pickerRef = useRef(null);

  const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const DAYS_OF_WEEK = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  // Sync internal display with incoming value
  useEffect(() => {
    if (!value) {
      setDisplayText('');
      return;
    }

    // If YYYY-MM-DD
    if (value.includes('-')) {
      const [y, m, d] = value.split('-');
      if (y && m && d) {
        const dd = String(d).padStart(2, '0');
        const mm = String(m).padStart(2, '0');
        const raw = `${dd}${mm}${y}`;
        setDisplayText(`${dd}/${mm}/${y}`);
        setSelectedYear(parseInt(y));
        setSelectedMonth(parseInt(m) - 1);
        return;
      }
    }

    // If DDMMYYYY
    const digits = value.replace(/\D/g, '').slice(0, 8);
    let display = digits;
    if (digits.length > 2) display = digits.slice(0, 2) + '/' + digits.slice(2);
    if (digits.length > 4) display = digits.slice(0, 2) + '/' + digits.slice(2, 4) + '/' + digits.slice(4);
    setDisplayText(display);

    if (digits.length === 8) {
      const ageInfo = calculateAgeFromDdMmYyyy(digits);
      if (ageInfo) {
        setSelectedYear(ageInfo.year);
        setSelectedMonth(ageInfo.month);
      }
    }
  }, [value]);

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setShowCalendar(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  // Handle manual typing (DD/MM/YYYY)
  const handleTextInput = (e) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 8);
    let display = raw;
    if (raw.length > 2) display = raw.slice(0, 2) + '/' + raw.slice(2);
    if (raw.length > 4) display = raw.slice(0, 2) + '/' + raw.slice(2, 4) + '/' + raw.slice(4);
    setDisplayText(display);

    const ageInfo = calculateAgeFromDdMmYyyy(raw);
    if (onChange) {
      onChange({
        raw,
        display,
        isoDate: ageInfo ? `${ageInfo.year}-${String(ageInfo.month + 1).padStart(2, '0')}-${String(ageInfo.day).padStart(2, '0')}` : '',
        age: ageInfo ? ageInfo.age : null,
      });
    }
  };

  // Handle picking a day in the calendar
  const handleSelectDay = (dayNum) => {
    const dd = String(dayNum).padStart(2, '0');
    const mm = String(selectedMonth + 1).padStart(2, '0');
    const yyyy = String(selectedYear);
    const raw = `${dd}${mm}${yyyy}`;
    const display = `${dd}/${mm}/${yyyy}`;

    setDisplayText(display);
    setShowCalendar(false);

    const ageInfo = calculateAgeFromDdMmYyyy(raw);
    if (onChange) {
      onChange({
        raw,
        display,
        isoDate: `${yyyy}-${mm}-${dd}`,
        age: ageInfo ? ageInfo.age : null,
      });
    }
  };

  // Calendar rendering math
  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
  const firstDayIndex = new Date(selectedYear, selectedMonth, 1).getDay();

  // Generate Year Options (18 years ago down to 100 years ago)
  const maxAllowedYear = new Date().getFullYear() - minAge;
  const yearOptions = [];
  for (let y = maxAllowedYear; y >= 1940; y--) {
    yearOptions.push(y);
  }

  // Calculated Age Display
  const currentAgeInfo = calculateAgeFromDdMmYyyy(displayText.replace(/\D/g, ''));

  return (
    <div ref={pickerRef} style={{ position: 'relative', width: '100%' }}>
      {/* INPUT FIELD WITH CALENDAR BUTTON */}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <input
          className="input-field"
          type="text"
          placeholder={placeholder}
          value={displayText}
          onChange={handleTextInput}
          maxLength={10}
          style={{ width: '100%', paddingRight: '46px' }}
        />
        <button
          type="button"
          onClick={() => setShowCalendar(!showCalendar)}
          title="Pick date from calendar"
          style={{
            position: 'absolute',
            right: '8px',
            background: 'none',
            border: 'none',
            fontSize: '1.25rem',
            cursor: 'pointer',
            padding: '6px',
            borderRadius: '6px',
            lineHeight: 1,
            color: 'var(--brand-pink)',
            transition: 'var(--transition)',
          }}
        >
          📅
        </button>
      </div>

      {/* DYNAMIC AGE CALCULATION INDICATOR */}
      {currentAgeInfo && (
        <div style={{
          fontSize: '0.8rem',
          marginTop: '6px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          color: currentAgeInfo.age >= minAge ? '#00e676' : '#ff4d4d',
          fontWeight: 600,
        }}>
          {currentAgeInfo.age >= minAge ? (
            <span>✅ Age: {currentAgeInfo.age} years old (Verified 18+)</span>
          ) : (
            <span>🚫 Age: {currentAgeInfo.age} years old — Minimum 18 years required</span>
          )}
        </div>
      )}

      {/* CALENDAR POPOVER DROPDOWN */}
      {showCalendar && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 8px)',
          left: 0,
          zIndex: 1000,
          background: 'var(--bg-card)',
          border: '1.5px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          padding: '16px',
          boxShadow: 'var(--shadow-card)',
          width: '300px',
          backdropFilter: 'blur(16px)',
          animation: 'slide-up 0.2s ease',
        }}>
          {/* Header Controls (Month & Year Selectors) */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', gap: '8px' }}>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="input-field"
              style={{ padding: '6px 10px', fontSize: '0.85rem', flex: 1, cursor: 'pointer' }}
            >
              {MONTHS.map((m, idx) => (
                <option key={m} value={idx}>{m}</option>
              ))}
            </select>

            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="input-field"
              style={{ padding: '6px 10px', fontSize: '0.85rem', flex: 1, cursor: 'pointer' }}
            >
              {yearOptions.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          {/* Days of Week Header */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', marginBottom: '6px' }}>
            {DAYS_OF_WEEK.map(d => (
              <span key={d} style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>{d}</span>
            ))}
          </div>

          {/* Calendar Days Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center' }}>
            {/* Empty slots for month starting day offset */}
            {Array.from({ length: firstDayIndex }).map((_, i) => (
              <span key={`empty-${i}`} />
            ))}

            {/* Actual Month Days */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const isSelected = currentAgeInfo && currentAgeInfo.day === dayNum && currentAgeInfo.month === selectedMonth && currentAgeInfo.year === selectedYear;

              return (
                <button
                  key={dayNum}
                  type="button"
                  onClick={() => handleSelectDay(dayNum)}
                  style={{
                    padding: '8px 0',
                    fontSize: '0.85rem',
                    borderRadius: '50%',
                    border: 'none',
                    background: isSelected ? 'var(--brand-gradient)' : 'transparent',
                    color: isSelected ? '#ffffff' : 'var(--text-primary)',
                    fontWeight: isSelected ? 700 : 500,
                    cursor: 'pointer',
                    transition: 'var(--transition)',
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) e.currentTarget.style.background = 'rgba(255, 77, 141, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) e.currentTarget.style.background = 'transparent';
                  }}
                >
                  {dayNum}
                </button>
              );
            })}
          </div>

          {/* Close / Quick Select Hint */}
          <div style={{ marginTop: '12px', textAlign: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '8px' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Must be born before {maxAllowedYear + 1} (18+ only)
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
