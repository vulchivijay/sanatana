"use client";
import { useEffect, useMemo, useState } from 'react';
import { t, detectLocale, DEFAULT_LOCALE } from '../../../lib/i18n';

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
    fetch('/locales/en/questions.json')
      .then((r) => r.json())
      .then((data: Question[]) => {
        if (!mounted) return;
        setQuestionsPool(data);
        const indices = sampleIndices(data.length, 10);
        setSelectedIdx(indices);
      })
      .catch((err) => console.error('Failed to load questions', err));
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

  const loc = detectLocale() || DEFAULT_LOCALE;
  if (!questionsPool) return <div>{t('quiz.loading', loc)}</div>;
  if (qList.length === 0) return <div>{t('quiz.preparing', loc)}</div>;

  if (!started) {
    return (
      <div>
        <h2>{t('quiz.readyTitle', loc)}</h2>
        <p>{t('quiz.readyDescription', loc).replace('{count}', String(qList.length)).replace('{time}', fmtTime(timeLeft))}</p>
        <div>
          <button onClick={() => setStarted(true)}>{t('quiz.start', loc)}</button>
          <button onClick={restart}>{t('quiz.shuffle', loc)}</button>
        </div>
      </div>
    );
  }

  if (finished) {
    return (
      <div>
        <h3>{t('quiz.resultsTitle', loc) || t('quiz.resultsTitle', loc)}</h3>
        <div>{t('quiz.yourScore', loc)} <strong>{score}</strong> / {qList.length}</div>
        <div>{t('quiz.timeTaken', loc)} {fmtTime(10 * 60 - timeLeft)}</div>
        <div>
          {qList.map((q, idx) => (
            <div key={q.id}>
              <div>{idx + 1}. {q.question}</div>
              <div>
                {(['A', 'B', 'C', 'D'] as (keyof Options)[]).map((k) => {
                  const correct = k === q.answer;
                  const chosen = answers[q.id] === k;
                  return (
                    <div key={k}>
                      <strong>{k}.</strong> {q.options[k]} {correct ? ' (Correct)' : chosen ? ' (Your choice)' : ''}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <div>
          <button onClick={restart}>{t('quiz.restart', loc)}</button>
        </div>
      </div>
    );
  }

  const q = qList[current];

  return (
    <div>
      <div>
        <div>{t('quiz.questionCounter', loc).replace('{current}', String(current + 1)).replace('{total}', String(qList.length))}</div>
        <div>{t('quiz.timeLeftLabel', loc)} {fmtTime(timeLeft)}</div>
      </div>

      <div>
        <div>{q.question}</div>
        <div>
          {(['A', 'B', 'C', 'D'] as (keyof Options)[]).map((k) => (
            <button
              key={k}
              onClick={() => selectOption(k)}
            >
              <strong>{k}.</strong> {q.options[k]}
            </button>
          ))}
        </div>

        <div>
          <div>
            <button onClick={goPrev} disabled={current === 0}>{t('quiz.previous', loc)}</button>
            <button onClick={goNext}>{current < qList.length - 1 ? t('quiz.next', loc) : t('quiz.finish', loc)}</button>
          </div>
          <div>{t('quiz.answered', loc).replace('{answered}', String(Object.keys(answers).length)).replace('{total}', String(qList.length))}</div>
        </div>
      </div>
    </div>
  );
}
