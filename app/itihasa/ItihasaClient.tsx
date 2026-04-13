"use client";

import { useLocale } from "@app/context/locale-context";
import useLocaleSection from "@app/hooks/useLocaleSection";
import Loader from "@components/loader";
import PageLayout from "@components/common/PageLayout";

type GenericRecord = Record<string, unknown>;

type ItihasaClientProps = {
  initialData?: GenericRecord;
  initialLocale?: string;
};

function toRecord(value: unknown): GenericRecord {
  return value && typeof value === "object" ? (value as GenericRecord) : {};
}

function mergeTopLevelData(base: GenericRecord, incoming: GenericRecord): GenericRecord {
  return {
    ...base,
    ...incoming,
  };
}

function hasRenderableItihasaData(value: GenericRecord | undefined): boolean {
  if (!value || typeof value !== "object") return false;
  const meaning = typeof value.meaning === "string" && value.meaning.trim().length > 0;
  const intro = typeof value.introduction === "string" && value.introduction.trim().length > 0;
  const core = Array.isArray(value.core_purpose) && value.core_purpose.length > 0;
  const features = Array.isArray(value.key_features) && value.key_features.length > 0;
  const major = Array.isArray(value.major_itihasas) && value.major_itihasas.length > 0;
  const concepts = Array.isArray(value.important_concepts) && value.important_concepts.length > 0;
  return meaning || intro || core || features || major || concepts;
}

function FeatureCard({
  feature,
  explanation,
  deepUnderstanding,
  index,
}: {
  feature: string;
  explanation: string;
  deepUnderstanding?: string[];
  index: number;
}) {
  const bgColors = [
    "bg-[#fffbf7]",
    "bg-[#fff9f2]",
    "bg-[#fffaf4]",
    "bg-[#fff8f1]",
  ];

  return (
    <div
      className={`relative rounded-2xl border border-[#d4ae7a]/20 p-6 md:p-7 ${bgColors[index % 4]} shadow-[0_4px_15px_rgba(139,69,19,0.06)]`}
    >
      <h4 className="text-lg font-bold text-[#5a2d0c] mb-2">{feature}</h4>
      <p className="text-md sm:text-base text-[#6d3d1a] mb-4">{explanation}</p>
      {deepUnderstanding && deepUnderstanding.length > 0 && (
        <ul className="space-y-2 border-t border-[#d4ae7a]/15 pt-4">
          {deepUnderstanding.map((point, i) => (
            <li key={i} className="flex items-start gap-2 text-md sm:text-base text-[#7a4a2e]">
              <span className="text-[#b8860b] font-bold mt-1">•</span>
              <span>{point}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ConceptCard({
  concept,
  explanation,
  deepUnderstanding,
  index,
}: {
  concept: string;
  explanation: string;
  deepUnderstanding?: string[];
  index: number;
}) {
  const bgColors = [
    "bg-[#fffef9]",
    "bg-[#fffcf5]",
    "bg-[#fffbf7]",
    "bg-[#fffaf4]",
  ];

  return (
    <div
      className={`relative rounded-2xl border border-[#ddb892]/25 p-6 md:p-7 ${bgColors[index % 4]} shadow-[0_4px_15px_rgba(139,69,19,0.05)]`}
    >
      <h4 className="text-lg font-bold text-[#703d1b] mb-2">{concept}</h4>
      <p className="text-md sm:text-base text-[#7a4a2d] mb-4">{explanation}</p>
      {deepUnderstanding && deepUnderstanding.length > 0 && (
        <ul className="space-y-2 border-t border-[#ddb892]/15 pt-4">
          {deepUnderstanding.map((point, i) => (
            <li key={i} className="flex items-start gap-2 text-md sm:text-base text-[#8b5a3c]">
              <span className="text-[#c09850] font-bold mt-1">✦</span>
              <span>{point}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ItihasaCard({
  name,
  focus,
  summary,
  keyLessons,
  mainCharacters,
  specialTeaching,
  index,
}: {
  name: string;
  focus: string;
  summary: string;
  keyLessons?: string[];
  mainCharacters?: string[];
  specialTeaching?: GenericRecord;
  index: number;
}) {
  const bgColors = [
    "bg-gradient-to-br from-[#fff9f0] to-[#fff5e6]",
    "bg-gradient-to-br from-[#fffaf4] to-[#fff8f0]",
  ];

  return (
    <div
      className={`relative rounded-2xl border border-[#d4a574]/25 p-6 md:p-7 ${bgColors[index % 2]} shadow-[0_4px_15px_rgba(139,69,19,0.07)]`}
    >
      <div className="flex items-start justify-between mb-4">
        <h4 className="text-xl font-bold text-[#6d3414]">{name}</h4>
        <span className="px-3 py-1 rounded-full bg-[#d4a574]/10 text-[#8b5a2d] text-xs font-semibold whitespace-nowrap ml-3">
          Epic
        </span>
      </div>
      <p className="text-md sm:text-base font-semibold text-[#7a4a2d] mb-4 border-l-2 border-[#b8860b] pl-3">
        {focus}
      </p>
      <p className="text-md sm:text-base text-[#5a3d2a] mb-5">{summary}</p>

      {keyLessons && keyLessons.length > 0 && (
        <div className="mb-5 bg-[#fffbf4] rounded-xl p-4 border border-[#d4ae7a]/15">
          <h5 className="text-xs font-bold text-[#6d3414] mb-3 uppercase tracking-wide">
            Key Lessons
          </h5>
          <ul className="space-y-2">
            {keyLessons.map((lesson, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-md sm:text-base text-[#5a3d2a]"
              >
                <span className="text-[#b8860b] font-bold shrink-0">◇</span>
                <span>{lesson}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {mainCharacters && mainCharacters.length > 0 && (
        <div className="mb-5 bg-[#fffef9] rounded-xl p-4 border border-[#ddb892]/15">
          <h5 className="text-xs font-bold text-[#703d1b] mb-3 uppercase tracking-wide">
            Main Characters
          </h5>
          <ul className="space-y-1">
            {mainCharacters.map((char, i) => (
              <li key={i} className="flex items-start gap-2 text-md sm:text-base text-[#7a4a2d]">
                <span className="text-[#c09850] shrink-0">→</span>
                <span>{char}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {specialTeaching && typeof specialTeaching === "object" && (
        <div className="bg-[#fff8f1] rounded-xl p-4 border-l-4 border-[#b8860b]">
          <h5 className="text-md sm:text-base font-bold text-[#6d3414] mb-2">
            {typeof specialTeaching.name === "string"
              ? specialTeaching.name
              : "Special Teaching"}
          </h5>
          {typeof specialTeaching.importance === "string" && (
            <p className="text-xs text-[#7a4a2d] mb-2">
              <span className="font-semibold">Importance:</span>{" "}
              {specialTeaching.importance}
            </p>
          )}
          {typeof specialTeaching.simple_understanding === "string" && (
            <p className="text-md sm:text-base text-[#5a3d2a]">
              {specialTeaching.simple_understanding}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default function ItihasaClient({ initialData, initialLocale }: ItihasaClientProps) {
  const { isLoading } = useLocale();
  const pageNs = useLocaleSection("itihasa");
  const hasPageNs = pageNs && typeof pageNs === "object" && Object.keys(pageNs).length > 0;
  const pagePayload = (hasPageNs ? (pageNs as GenericRecord) : undefined);
  const pageHasRenderableData = hasRenderableItihasaData(pagePayload);
  const initialPayload = toRecord(initialData);
  const root = hasPageNs
    ? (pageHasRenderableData
      ? mergeTopLevelData(initialPayload, toRecord(pageNs))
      : initialPayload)
    : initialPayload;

  const shouldShowLoader = isLoading && !hasPageNs && (!initialData || Object.keys(initialData).length === 0);

  if (shouldShowLoader || Object.keys(root).length === 0) {
    return (
      <PageLayout
        metaKey="itihasa"
        title=""
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Itihasa" }]}
        className="layout-md"
      >
        <div className="flex items-center justify-center py-12">
          <Loader />
        </div>
      </PageLayout>
    );
  }

  const content = (root as GenericRecord) || {};
  const meaning = typeof content.meaning === "string" ? content.meaning : "";
  const introduction =
    typeof content.introduction === "string" ? content.introduction : "";
  const corePurpose = Array.isArray(content.core_purpose)
    ? content.core_purpose.filter((v) => typeof v === "string")
    : [];
  const keyFeatures = Array.isArray(content.key_features)
    ? content.key_features.filter((v) => v && typeof v === "object")
    : [];
  const majorItihasas = Array.isArray(content.major_itihasas)
    ? content.major_itihasas.filter((v) => v && typeof v === "object")
    : [];
  const importantConcepts = Array.isArray(content.important_concepts)
    ? content.important_concepts.filter((v) => v && typeof v === "object")
    : [];
  const learningApproach = Array.isArray(content.learning_approach)
    ? content.learning_approach.filter((v) => typeof v === "string")
    : [];
  const modernRelevance = Array.isArray(content.modern_relevance)
    ? content.modern_relevance.filter((v) => typeof v === "string")
    : [];

  return (
    <PageLayout
      metaKey="itihasa"
      title="Itihasa"
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Itihasa" }]}
      className="layout-md"
    >
      {/* Meaning Section */}
      {meaning && (
        <section className="mb-10 px-4 py-8 md:px-6 md:py-10 bg-[#fffaf4] rounded-2xl border border-[#ddb892]/20 shadow-[0_4px_12px_rgba(139,69,19,0.05)]">
          <h2 className="text-2xl md:text-3xl font-bold text-[#5a2d0c] mb-4">
            What is Itihasa?
          </h2>
          <p className="text-base text-[#6d3d1a] leading-relaxed">{meaning}</p>
        </section>
      )}

      {/* Introduction Section */}
      {introduction && (
        <section className="mb-10 px-4 py-8 md:px-6 md:py-10 bg-[#fff9f0] rounded-2xl border border-[#d4ae7a]/20 shadow-[0_4px_12px_rgba(139,69,19,0.05)]">
          <h2 className="text-2xl md:text-3xl font-bold text-[#6d3414] mb-4">
            Introduction
          </h2>
          <p className="text-base text-[#7a4a2d] leading-relaxed">
            {introduction}
          </p>
        </section>
      )}

      {/* Core Purpose Section */}
      {corePurpose.length > 0 && (
        <section className="mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-[#5a2d0c] mb-6">
            Core Purpose
          </h2>
          <ul className="space-y-3">
            {corePurpose.map((item, idx) => (
              <li
                key={idx}
                className="flex items-start gap-4 p-4 bg-[#fffaf4] rounded-xl border border-[#d4ae7a]/15 shadow-[0_2px_8px_rgba(139,69,19,0.04)]"
              >
                <span className="text-[#b8860b] font-bold text-2xl leading-tight shrink-0">
                  ◆
                </span>
                <span className="text-base text-[#6d3d1a]">{item}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Key Features Section */}
      {keyFeatures.length > 0 && (
        <section className="mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-[#5a2d0c] mb-6">
            Key Features of Itihasa
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(keyFeatures as GenericRecord[]).map((feature, idx) => (
              <FeatureCard
                key={idx}
                feature={
                  typeof feature.feature === "string" ? feature.feature : ""
                }
                explanation={
                  typeof feature.explanation === "string"
                    ? feature.explanation
                    : ""
                }
                deepUnderstanding={
                  Array.isArray(feature.deep_understanding)
                    ? (feature.deep_understanding as string[])
                    : undefined
                }
                index={idx}
              />
            ))}
          </div>
        </section>
      )}

      {/* Major Itihasas Section */}
      {majorItihasas.length > 0 && (
        <section className="mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-[#5a2d0c] mb-6">
            Major Itihasas
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {(majorItihasas as GenericRecord[]).map((itihasa, idx) => (
              <ItihasaCard
                key={idx}
                name={typeof itihasa.name === "string" ? itihasa.name : ""}
                focus={typeof itihasa.focus === "string" ? itihasa.focus : ""}
                summary={
                  typeof itihasa.summary === "string" ? itihasa.summary : ""
                }
                keyLessons={
                  Array.isArray(itihasa.key_lessons)
                    ? (itihasa.key_lessons as string[])
                    : undefined
                }
                mainCharacters={
                  Array.isArray(itihasa.main_characters)
                    ? (itihasa.main_characters as string[])
                    : undefined
                }
                specialTeaching={
                  itihasa.special_teaching &&
                    typeof itihasa.special_teaching === "object"
                    ? (itihasa.special_teaching as GenericRecord)
                    : undefined
                }
                index={idx}
              />
            ))}
          </div>
        </section>
      )}

      {/* Important Concepts Section */}
      {importantConcepts.length > 0 && (
        <section className="mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-[#5a2d0c] mb-6">
            Important Concepts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(importantConcepts as GenericRecord[]).map((concept, idx) => (
              <ConceptCard
                key={idx}
                concept={
                  typeof concept.concept === "string" ? concept.concept : ""
                }
                explanation={
                  typeof concept.explanation === "string"
                    ? concept.explanation
                    : ""
                }
                deepUnderstanding={
                  Array.isArray(concept.deep_understanding)
                    ? (concept.deep_understanding as string[])
                    : undefined
                }
                index={idx}
              />
            ))}
          </div>
        </section>
      )}

      {/* Learning Approach Section */}
      {learningApproach.length > 0 && (
        <section className="mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-[#5a2d0c] mb-6">
            How to Learn Itihasa
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {learningApproach.map((item, idx) => (
              <div
                key={idx}
                className="p-5 bg-linear-to-br from-[#fff9f0] to-[#fffaf4] rounded-xl border border-[#d4ae7a]/20 shadow-[0_2px_8px_rgba(139,69,19,0.04)]"
              >
                <div className="flex items-start gap-3">
                  <span className="text-[#b8860b] font-extrabold text-lg leading-tight shrink-0 pt-1">
                    {idx + 1}
                  </span>
                  <p className="text-base text-[#6d3d1a]">{item}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Modern Relevance Section */}
      {modernRelevance.length > 0 && (
        <section className="mb-10 bg-[#fffbf7] rounded-2xl border border-[#d4ae7a]/20 p-6 md:p-8 shadow-[0_4px_12px_rgba(139,69,19,0.05)]">
          <h2 className="text-2xl md:text-3xl font-bold text-[#5a2d0c] mb-6">
            Modern Relevance
          </h2>
          <ul className="space-y-3">
            {modernRelevance.map((item, idx) => (
              <li
                key={idx}
                className="flex items-start gap-4 text-base text-[#6d3d1a]"
              >
                <span className="text-[#b8860b] font-bold text-xl leading-tight shrink-0">
                  ★
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </PageLayout>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */

