"use client";

import { useLocale } from "@app/context/locale-context";
import useLocaleSection from "@app/hooks/useLocaleSection";
import Loader from "@components/loader";
import PageLayout from "@components/common/PageLayout";

type GenericRecord = Record<string, unknown>;

type PuranasClientProps = {
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

function hasRenderablePuranasData(value: GenericRecord | undefined): boolean {
  if (!value || typeof value !== "object") return false;
  const meaning = typeof value.meaning === "string" && value.meaning.trim().length > 0;
  const intro = typeof value.introduction === "string" && value.introduction.trim().length > 0;
  const core = Array.isArray(value.core_purpose) && value.core_purpose.length > 0;
  const features = Array.isArray(value.key_features) && value.key_features.length > 0;
  const major = Array.isArray(value.major_puranas) && value.major_puranas.length > 0;
  const concepts = Array.isArray(value.important_concepts) && value.important_concepts.length > 0;
  return meaning || intro || core || features || major || concepts;
}

function formatLabel(str: string): string {
  return str
    .replace(/_/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
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

function PuranaCard({
  name,
  focus,
  simpleUnderstanding,
  index,
}: {
  name: string;
  focus: string;
  simpleUnderstanding: string;
  index: number;
}) {
  const bgColors = [
    "bg-gradient-to-br from-[#fff9f0] to-[#fff5e6]",
    "bg-gradient-to-br from-[#fffaf4] to-[#fff8f0]",
    "bg-gradient-to-br from-[#fffbf7] to-[#fffef9]",
  ];

  return (
    <div
      className={`relative rounded-2xl border border-[#d4a574]/25 p-6 md:p-7 ${bgColors[index % 3]} shadow-[0_4px_15px_rgba(139,69,19,0.07)]`}
    >
      <div className="flex items-start justify-between mb-3">
        <h4 className="text-lg font-bold text-[#6d3414]">{name}</h4>
        <span className="px-3 py-1 rounded-full bg-[#d4a574]/10 text-[#8b5a2d] text-xs font-semibold">
          Focus
        </span>
      </div>
      <p className="text-md sm:text-base font-semibold text-[#7a4a2d] mb-3 border-l-2 border-[#b8860b] pl-3">
        {focus}
      </p>
      <p className="text-md sm:text-base text-[#5a3d2a]">{simpleUnderstanding}</p>
    </div>
  );
}

export default function PuranasClient({ initialData, initialLocale }: PuranasClientProps) {
  const { isLoading } = useLocale();
  const pageNs = useLocaleSection("puranas");
  const hasPageNs = pageNs && typeof pageNs === "object" && Object.keys(pageNs).length > 0;
  const pagePayload = (hasPageNs ? (pageNs as GenericRecord) : undefined);
  const pageHasRenderableData = hasRenderablePuranasData(pagePayload);
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
        metaKey="puranas"
        title=""
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Puranas" }]}
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
  const structureOfPuranas = Array.isArray(content.structure_of_puranas)
    ? content.structure_of_puranas.filter((v) => typeof v === "string")
    : [];
  const majorPuranas = Array.isArray(content.major_puranas)
    ? content.major_puranas.filter((v) => v && typeof v === "object")
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
      metaKey="puranas"
      title="Puranas"
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Puranas" }]}
      className="layout-md"
    >
      {/* Meaning Section */}
      {meaning && (
        <section className="mb-10 px-4 py-8 md:px-6 md:py-10 bg-[#fffaf4] rounded-2xl border border-[#ddb892]/20 shadow-[0_4px_12px_rgba(139,69,19,0.05)]">
          <h2 className="text-2xl md:text-3xl font-bold text-[#5a2d0c] mb-4">
            What is Purana?
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
          <p className="text-base text-[#7a4a2d] leading-relaxed">{introduction}</p>
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
                <span className="text-[#b8860b] font-bold text-2xl leading-tight flex-shrink-0">
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
            Key Features of Puranas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(keyFeatures as GenericRecord[]).map((feature, idx) => (
              <FeatureCard
                key={idx}
                feature={
                  typeof feature.feature === "string"
                    ? feature.feature
                    : ""
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

      {/* Structure of Puranas Section */}
      {structureOfPuranas.length > 0 && (
        <section className="mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-[#5a2d0c] mb-6">
            Structure of Puranas
          </h2>
          <div className="space-y-3">
            {structureOfPuranas.map((item, idx) => (
              <div
                key={idx}
                className="relative pl-8 py-3 text-base text-[#6d3d1a] bg-[#fffaf4] rounded-xl border-l-4 border-[#b8860b] px-4 shadow-[0_2px_8px_rgba(139,69,19,0.04)]"
              >
                <span className="absolute left-3 top-3 w-2 h-2 rounded-full bg-[#b8860b]" />
                {item}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Major Puranas Section */}
      {majorPuranas.length > 0 && (
        <section className="mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-[#5a2d0c] mb-6">
            Major Puranas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {(majorPuranas as GenericRecord[]).map((purana, idx) => (
              <PuranaCard
                key={idx}
                name={typeof purana.name === "string" ? purana.name : ""}
                focus={typeof purana.focus === "string" ? purana.focus : ""}
                simpleUnderstanding={
                  typeof purana.simple_understanding === "string"
                    ? purana.simple_understanding
                    : ""
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
            How to Learn Puranas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {learningApproach.map((item, idx) => (
              <div
                key={idx}
                className="p-5 bg-gradient-to-br from-[#fff9f0] to-[#fffaf4] rounded-xl border border-[#d4ae7a]/20 shadow-[0_2px_8px_rgba(139,69,19,0.04)]"
              >
                <div className="flex items-start gap-3">
                  <span className="text-[#b8860b] font-extrabold text-lg leading-tight flex-shrink-0 pt-1">
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
                <span className="text-[#b8860b] font-bold text-xl leading-tight flex-shrink-0">
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

