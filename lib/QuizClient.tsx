"use client";
import React, { useEffect, useMemo, useState } from "react";

type Options = { A: string; B: string; C: string; D: string };
type Question = { id: number; question: string; options: Options; answer: keyof Options };

function sampleIndices(total: number, count: number): number[] {
  const arr = Array.from({ length: total }, (_, i) => i);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(0, count);
}

export default function QuizClient() {
  const [questionsPool, setQuestionsPool] = useState<Question[] | null>(null);
  const [selectedIdx, setSelectedIdx] = useState<number[]>([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, keyof Options>>({});
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10 * 60); // 10 minutes in seconds
  const [started, setStarted] = useState(false);

  useEffect(() => {
    let mounted = true;
    try {
      const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
      const lang = params ? params.get('lang') : null;
      const url = lang ? `/locales/${encodeURIComponent(lang)}/questions.json` : '/locales/en/questions.json';
      fetch(url)
        .then((r) => r.json())
        .then((data: Question[]) => {
          if (!mounted) return;
          setQuestionsPool(data);
          const indices = sampleIndices(data.length, 10);
          setSelectedIdx(indices);
        })
        .catch((err) => console.error('Failed to load questions', err));
    } catch (e) {
      console.error('Failed to build questions fetch URL', e);
    }
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (!started || finished) return;
    const t = setInterval(() => {
      setTimeLeft((s) => {
        if (s <= 1) {
          clearInterval(t);
          setFinished(true);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [finished, started]);

  const qList = useMemo(() => {
    if (!questionsPool || selectedIdx.length === 0) return [] as Question[];
    return selectedIdx.map((i) => questionsPool[i]);
  }, [questionsPool, selectedIdx]);

  function selectOption(opt: keyof Options) {
    if (finished) return;
    const qid = qList[current].id;
    setAnswers((prev) => ({ ...prev, [qid]: opt }));
  }

  function goNext() {
    if (current < qList.length - 1) setCurrent(current + 1);
    else setFinished(true);
  }

  function goPrev() {
    if (current > 0) setCurrent(current - 1);
  }

  function restart() {
    if (!questionsPool) return;
    const indices = sampleIndices(questionsPool.length, 10);
    setSelectedIdx(indices);
    setAnswers({});
    setCurrent(0);
    setFinished(false);
    setTimeLeft(10 * 60);
    setStarted(false);
  }

  const score = useMemo(() => {
    if (!qList || qList.length === 0) return 0;
    let s = 0;
    for (const q of qList) {
      const a = answers[q.id];
      if (a && a === q.answer) s++;
    }
    return s;
  }, [answers, qList]);

  function fmtTime(sec: number) {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  if (!questionsPool) return <div>Loading questions…</div>;
  if (qList.length === 0) return <div>Preparing quiz…</div>;

  if (!started) {
    return (
      <div className="max-w-3xl">
        <h2 className="text-2xl font-bold mb-4">Ready for the Quiz?</h2>
        <p className="mb-4">You will be asked {qList.length} random questions. You have {fmtTime(timeLeft)} to complete the quiz.</p>
        <div className="flex gap-3">
          <button onClick={() => setStarted(true)} className="px-4 py-2 bg-green-600 text-white rounded">Start Quiz</button>
          <button onClick={restart} className="px-4 py-2 border rounded">Shuffle Questions</button>
        </div>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="max-w-3xl">
        <h3 className="text-2xl font-bold mb-4">Quiz Results</h3>
        <div className="mb-4">Your score: <strong>{score}</strong> / {qList.length}</div>
        <div className="mb-4">Time taken: {fmtTime(10 * 60 - timeLeft)}</div>
        <div className="space-y-3 mb-6">
          {qList.map((q, idx) => (
            <div key={q.id} className="p-3 border rounded">
              <div className="font-medium">{idx + 1}. {q.question}</div>
              <div className="mt-1 text-sm">
                {(['A', 'B', 'C', 'D'] as (keyof Options)[]).map((k) => {
                  const correct = k === q.answer;
                  const chosen = answers[q.id] === k;
                  return (
                    <div key={k} className={`inline-block mr-4 ${correct ? 'text-green-700' : chosen ? 'text-red-700' : ''}`}>
                      <strong>{k}.</strong> {q.options[k]} {correct ? ' (Correct)' : chosen ? ' (Your choice)' : ''}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-3">
          <button onClick={restart} className="px-4 py-2 bg-blue-600 text-white rounded">Restart Quiz</button>
        </div>
      </div>
    );
  }

  const q = qList[current];

  return (
    <div className="max-w-3xl">
      <div className="flex justify-between items-center mb-4">
        <div>Question {current + 1} / {qList.length}</div>
        <div className="font-mono">Time left: {fmtTime(timeLeft)}</div>
      </div>

      <div className="p-4 border rounded bg-white">
        <div className="text-lg font-semibold mb-3">{q.question}</div>
        <div className="grid gap-2">
          {(['A', 'B', 'C', 'D'] as (keyof Options)[]).map((k) => (
            <button
              key={k}
              onClick={() => selectOption(k)}
              className={`text-left p-3 border rounded ${answers[q.id] === k ? 'bg-blue-100' : ''}`}
            >
              <strong className="mr-2">{k}.</strong> {q.options[k]}
            </button>
          ))}
        </div>

        <div className="mt-4 flex justify-between">
          <div>
            <button onClick={goPrev} disabled={current === 0} className="px-3 py-1 border rounded mr-2">Previous</button>
            <button onClick={goNext} className="px-3 py-1 bg-green-600 text-white rounded">{current < qList.length - 1 ? 'Next' : 'Finish'}</button>
          </div>
          <div className="text-sm text-gray-600">Answered: {Object.keys(answers).length} / {qList.length}</div>
        </div>
      </div>
    </div>
  );
}
