"use client";
import React, { useState } from "react";
import { generateHoroscope, Period } from "../../lib/horoscope";

export default function HoroscopeClient() {
  const today = new Date().toISOString().slice(0, 10);
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState(today);
  const [period, setPeriod] = useState<Period>("day");
  const [result, setResult] = useState<any | null>(null);

  function onGenerate() {
    try {
      const r = generateHoroscope(birthDate, name || undefined, period);
      setResult(r);
    } catch (err) {
      setResult({ error: String(err) });
    }
  }

  return (
    <div>
      <div>
        <label>Name (optional)</label>
        <input value={name} onChange={(e) => setName(e.target.value)} className="border border-b-2" />
      </div>
      <div>
        <label>Birth date</label>
        <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} className="border border-b-2" />
      </div>
      <div>
        <label>Period</label>
        <div>
          <label><input type="radio" name="period" checked={period === 'day'} onChange={() => setPeriod('day')} /> Day</label>
          <label><input type="radio" name="period" checked={period === 'week'} onChange={() => setPeriod('week')} /> Week</label>
          <label><input type="radio" name="period" checked={period === 'month'} onChange={() => setPeriod('month')} /> Month</label>
        </div>
      </div>
      <div>
        <button className="bg-amber-300 hover:bg-amber-400" onClick={onGenerate}>Generate</button>
      </div>

      {result ? (
        <div>
          {result.error ? (
            <div>Error: {result.error}</div>
          ) : (
            <>
              <div>{result.sign} {result.planet}</div>
              <div>{result.text}</div>
              <div>Lucky number: {result.luckyNumber} · Period: {result.periodLabel}</div>
            </>
          )}
        </div>
      ) : null}
    </div>
  );
}
