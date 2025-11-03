"use client";

import {
  FormEvent,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { FiLoader, FiPlus } from "react-icons/fi";
import { Button } from "@repo/ui/button";
import { US_STATES } from "../../lib/us-states";
import {
  getMakeOptions,
  getModelOptions,
  getTrimOptions,
} from "../../lib/vehicle-catalog";

interface AddVehicleButtonProps {
  onSuccess?: () => void;
}

export const AddVehicleButton = ({ onSuccess }: AddVehicleButtonProps) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedMake, setSelectedMake] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedTrim, setSelectedTrim] = useState("");
  const [makeQuery, setMakeQuery] = useState("");
  const [modelQuery, setModelQuery] = useState("");
  const [trimQuery, setTrimQuery] = useState("");
  const [showMakeSuggestions, setShowMakeSuggestions] = useState(false);
  const [showModelSuggestions, setShowModelSuggestions] = useState(false);
  const [showTrimSuggestions, setShowTrimSuggestions] = useState(false);
  const [highlightedMakeIndex, setHighlightedMakeIndex] = useState(-1);
  const [highlightedModelIndex, setHighlightedModelIndex] = useState(-1);
  const [highlightedTrimIndex, setHighlightedTrimIndex] = useState(-1);
  const makeInputId = useId();
  const modelInputId = useId();
  const trimInputId = useId();
  const makeListboxId = `${makeInputId}-listbox`;
  const modelListboxId = `${modelInputId}-listbox`;
  const trimListboxId = `${trimInputId}-listbox`;
  const makeBlurTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const modelBlurTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const trimBlurTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const makeOptions = useMemo(() => getMakeOptions(), []);
  const modelOptions = useMemo(
    () => (selectedMake ? getModelOptions(selectedMake) : []),
    [selectedMake],
  );
  const trimOptions = useMemo(
    () =>
      selectedMake && selectedModel
        ? getTrimOptions(selectedMake, selectedModel)
        : [],
    [selectedMake, selectedModel],
  );
  const filteredMakeOptions = useMemo(() => {
    const search = makeQuery.trim().toLowerCase();
    if (!search) {
      return makeOptions;
    }
    return makeOptions.filter((make) =>
      make.toLowerCase().includes(search),
    );
  }, [makeOptions, makeQuery]);
  const filteredModelOptions = useMemo(() => {
    if (!selectedMake) {
      return [];
    }
    const search = modelQuery.trim().toLowerCase();
    if (!search) {
      return modelOptions;
    }
    return modelOptions.filter((model) =>
      model.toLowerCase().includes(search),
    );
  }, [modelOptions, modelQuery, selectedMake]);
  const filteredTrimOptions = useMemo(() => {
    if (!selectedModel) {
      return [];
    }
    const search = trimQuery.trim().toLowerCase();
    if (!search) {
      return trimOptions;
    }
    return trimOptions.filter((trim) =>
      trim.toLowerCase().includes(search),
    );
  }, [trimOptions, trimQuery, selectedModel]);

  useEffect(() => {
    if (!open) {
      setSelectedMake("");
      setSelectedModel("");
      setSelectedTrim("");
      setMakeQuery("");
      setModelQuery("");
      setTrimQuery("");
      setShowMakeSuggestions(false);
      setShowModelSuggestions(false);
      setShowTrimSuggestions(false);
      setHighlightedMakeIndex(-1);
      setHighlightedModelIndex(-1);
      setHighlightedTrimIndex(-1);
      setError(null);
    }
  }, [open]);

  useEffect(() => {
    setSelectedModel("");
    setSelectedTrim("");
    setModelQuery("");
    setTrimQuery("");
    setShowModelSuggestions(false);
    setShowTrimSuggestions(false);
    setHighlightedModelIndex(-1);
    setHighlightedTrimIndex(-1);
  }, [selectedMake]);

  useEffect(() => {
    setSelectedTrim("");
    setTrimQuery("");
    setShowTrimSuggestions(false);
    setHighlightedTrimIndex(-1);
  }, [selectedModel]);

  useEffect(() => {
    if (filteredMakeOptions.length === 0) {
      setHighlightedMakeIndex(-1);
      return;
    }
    setHighlightedMakeIndex((prev) =>
      prev >= filteredMakeOptions.length ? filteredMakeOptions.length - 1 : prev,
    );
  }, [filteredMakeOptions]);
  useEffect(() => {
    if (filteredModelOptions.length === 0) {
      setHighlightedModelIndex(-1);
      return;
    }
    setHighlightedModelIndex((prev) =>
      prev >= filteredModelOptions.length ? filteredModelOptions.length - 1 : prev,
    );
  }, [filteredModelOptions]);
  useEffect(() => {
    if (filteredTrimOptions.length === 0) {
      setHighlightedTrimIndex(-1);
      return;
    }
    setHighlightedTrimIndex((prev) =>
      prev >= filteredTrimOptions.length ? filteredTrimOptions.length - 1 : prev,
    );
  }, [filteredTrimOptions]);

  const selectMake = (make: string) => {
    setSelectedMake(make);
    setMakeQuery(make);
    setShowMakeSuggestions(false);
    setHighlightedMakeIndex(-1);
  };

  const commitMakeFromQuery = () => {
    const match = makeOptions.find(
      (make) => make.toLowerCase() === makeQuery.trim().toLowerCase(),
    );
    if (match) {
      selectMake(match);
    } else {
      if (selectedMake) {
        setSelectedMake("");
      }
    }
  };

  const cancelMakeBlurTimeout = () => {
    if (makeBlurTimeoutRef.current) {
      window.clearTimeout(makeBlurTimeoutRef.current);
      makeBlurTimeoutRef.current = null;
    }
  };

  const handleMakeInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    cancelMakeBlurTimeout();
    setMakeQuery(value);
    setShowMakeSuggestions(true);
    setHighlightedMakeIndex(-1);

    const match = makeOptions.find(
      (make) => make.toLowerCase() === value.trim().toLowerCase(),
    );
    if (match) {
      if (selectedMake !== match) {
        setSelectedMake(match);
      }
    } else if (selectedMake !== "") {
      setSelectedMake("");
    }
  };

  const handleMakeInputFocus = () => {
    cancelMakeBlurTimeout();
    setShowMakeSuggestions(true);
  };

  const handleMakeInputBlur = () => {
    makeBlurTimeoutRef.current = window.setTimeout(() => {
      commitMakeFromQuery();
      setShowMakeSuggestions(false);
    }, 100);
  };

  const handleMakeInputKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (!showMakeSuggestions) {
        setShowMakeSuggestions(true);
      }
      if (filteredMakeOptions.length > 0) {
        setHighlightedMakeIndex((prev) =>
          prev < filteredMakeOptions.length - 1 ? prev + 1 : 0,
        );
      }
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (!showMakeSuggestions) {
        setShowMakeSuggestions(true);
      }
      if (filteredMakeOptions.length > 0) {
        setHighlightedMakeIndex((prev) =>
          prev <= 0 ? filteredMakeOptions.length - 1 : prev - 1,
        );
      }
      return;
    }

    if (event.key === "Enter") {
      if (
        showMakeSuggestions &&
        highlightedMakeIndex >= 0 &&
        highlightedMakeIndex < filteredMakeOptions.length
      ) {
        event.preventDefault();
        selectMake(filteredMakeOptions[highlightedMakeIndex]);
        return;
      }
      commitMakeFromQuery();
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      setShowMakeSuggestions(false);
      setHighlightedMakeIndex(-1);
    }
  };

  const handleMakeSuggestionClick = (make: string) => {
    cancelMakeBlurTimeout();
    selectMake(make);
  };

  const cancelModelBlurTimeout = () => {
    if (modelBlurTimeoutRef.current) {
      window.clearTimeout(modelBlurTimeoutRef.current);
      modelBlurTimeoutRef.current = null;
    }
  };

  const selectModel = (model: string) => {
    setSelectedModel(model);
    setModelQuery(model);
    setShowModelSuggestions(false);
    setHighlightedModelIndex(-1);
    setSelectedTrim("");
    setTrimQuery("");
    setShowTrimSuggestions(false);
    setHighlightedTrimIndex(-1);
  };

  const commitModelFromQuery = () => {
    if (!selectedMake) return;
    const match = modelOptions.find(
      (model) => model.toLowerCase() === modelQuery.trim().toLowerCase(),
    );
    if (match) {
      selectModel(match);
    } else {
      if (selectedModel) {
        setSelectedModel("");
      }
    }
  };

  const handleModelInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (!selectedMake) return;
    const value = event.target.value;
    cancelModelBlurTimeout();
    setModelQuery(value);
    setShowModelSuggestions(true);
    setHighlightedModelIndex(-1);

    const match = modelOptions.find(
      (model) => model.toLowerCase() === value.trim().toLowerCase(),
    );
    if (match) {
      if (selectedModel !== match) {
        selectModel(match);
      }
    } else if (selectedModel !== "") {
      setSelectedModel("");
    }
  };

  const handleModelInputFocus = () => {
    if (!selectedMake) return;
    cancelModelBlurTimeout();
    setShowModelSuggestions(true);
  };

  const handleModelInputBlur = () => {
    cancelModelBlurTimeout();
    modelBlurTimeoutRef.current = window.setTimeout(() => {
      commitModelFromQuery();
      setShowModelSuggestions(false);
    }, 100);
  };

  const handleModelInputKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (!selectedMake) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (!showModelSuggestions) {
        setShowModelSuggestions(true);
      }
      if (filteredModelOptions.length > 0) {
        setHighlightedModelIndex((prev) =>
          prev < filteredModelOptions.length - 1 ? prev + 1 : 0,
        );
      }
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (!showModelSuggestions) {
        setShowModelSuggestions(true);
      }
      if (filteredModelOptions.length > 0) {
        setHighlightedModelIndex((prev) =>
          prev <= 0 ? filteredModelOptions.length - 1 : prev - 1,
        );
      }
      return;
    }

    if (event.key === "Enter") {
      if (
        showModelSuggestions &&
        highlightedModelIndex >= 0 &&
        highlightedModelIndex < filteredModelOptions.length
      ) {
        event.preventDefault();
        selectModel(filteredModelOptions[highlightedModelIndex]);
        return;
      }
      commitModelFromQuery();
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      setShowModelSuggestions(false);
      setHighlightedModelIndex(-1);
    }
  };

  const handleModelSuggestionClick = (model: string) => {
    cancelModelBlurTimeout();
    selectModel(model);
  };

  const cancelTrimBlurTimeout = () => {
    if (trimBlurTimeoutRef.current) {
      window.clearTimeout(trimBlurTimeoutRef.current);
      trimBlurTimeoutRef.current = null;
    }
  };

  const selectTrim = (trim: string) => {
    setSelectedTrim(trim);
    setTrimQuery(trim);
    setShowTrimSuggestions(false);
    setHighlightedTrimIndex(-1);
  };

  const commitTrimFromQuery = () => {
    if (!selectedModel) return;
    if (trimOptions.length === 0) {
      setSelectedTrim("");
      return;
    }
    const match = trimOptions.find(
      (trim) => trim.toLowerCase() === trimQuery.trim().toLowerCase(),
    );
    if (match) {
      selectTrim(match);
    } else {
      if (selectedTrim) {
        setSelectedTrim("");
      }
    }
  };

  const handleTrimInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (!selectedModel || trimOptions.length === 0) return;
    const value = event.target.value;
    cancelTrimBlurTimeout();
    setTrimQuery(value);
    setShowTrimSuggestions(true);
    setHighlightedTrimIndex(-1);

    const match = trimOptions.find(
      (trim) => trim.toLowerCase() === value.trim().toLowerCase(),
    );
    if (match) {
      if (selectedTrim !== match) {
        selectTrim(match);
      }
    } else if (selectedTrim !== "") {
      setSelectedTrim("");
    }
  };

  const handleTrimInputFocus = () => {
    if (!selectedModel || trimOptions.length === 0) return;
    cancelTrimBlurTimeout();
    setShowTrimSuggestions(true);
  };

  const handleTrimInputBlur = () => {
    cancelTrimBlurTimeout();
    trimBlurTimeoutRef.current = window.setTimeout(() => {
      commitTrimFromQuery();
      setShowTrimSuggestions(false);
    }, 100);
  };

  const handleTrimInputKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (!selectedModel || trimOptions.length === 0) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (!showTrimSuggestions) {
        setShowTrimSuggestions(true);
      }
      if (filteredTrimOptions.length > 0) {
        setHighlightedTrimIndex((prev) =>
          prev < filteredTrimOptions.length - 1 ? prev + 1 : 0,
        );
      }
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (!showTrimSuggestions) {
        setShowTrimSuggestions(true);
      }
      if (filteredTrimOptions.length > 0) {
        setHighlightedTrimIndex((prev) =>
          prev <= 0 ? filteredTrimOptions.length - 1 : prev - 1,
        );
      }
      return;
    }

    if (event.key === "Enter") {
      if (
        showTrimSuggestions &&
        highlightedTrimIndex >= 0 &&
        highlightedTrimIndex < filteredTrimOptions.length
      ) {
        event.preventDefault();
        selectTrim(filteredTrimOptions[highlightedTrimIndex]);
        return;
      }
      commitTrimFromQuery();
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      setShowTrimSuggestions(false);
      setHighlightedTrimIndex(-1);
    }
  };

  const handleTrimSuggestionClick = (trim: string) => {
    cancelTrimBlurTimeout();
    selectTrim(trim);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    const formData = new FormData(event.currentTarget);

    const registrationRenewedOn = formData.get("registrationRenewedOn") as
      | string
      | null;
    const emissionsTestedOn = formData.get("emissionsTestedOn") as string | null;

    if (!selectedMake) {
      setError("Please select a make from the suggestions.");
      setSubmitting(false);
      return;
    }

    if (!selectedModel) {
      setError("Please select a model.");
      setSubmitting(false);
      return;
    }

    if (trimOptions.length > 0 && !selectedTrim) {
      setError("Please select a trim.");
      setSubmitting(false);
      return;
    }

    const payload = {
      make: selectedMake,
      model: selectedModel,
      trim: selectedTrim || undefined,
      year: Number(formData.get("year")),
      vin: (formData.get("vin") as string)?.trim(),
      registrationState: formData.get("registrationState"),
      nickname: (formData.get("nickname") as string) || undefined,
      mileage: formData.get("mileage") ? Number(formData.get("mileage")) : undefined,
      fuelType: formData.get("fuelType") || "GAS",
      registrationRenewedOn: registrationRenewedOn || undefined,
      emissionsTestedOn: emissionsTestedOn || undefined,
      licensePlate: (formData.get("licensePlate") as string) || undefined,
    };

    try {
      const response = await fetch("/api/vehicles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(
          body?.error ??
            "Unable to save vehicle right now. Please try again shortly.",
        );
      }

      setOpen(false);
      event.currentTarget.reset();
      router.refresh();
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Button
        className="border border-white/40 bg-white/10 text-black transition hover:bg-white/20"
        onClick={() => setOpen(true)}
        type="button"
      >
        <FiPlus className="h-4 w-4" />
        Add vehicle
      </Button>
      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-8">
          <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-lg font-semibold text-ink">
                Add vehicle
              </h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-sm text-ink-subtle transition hover:text-ink"
              >
                Close
              </button>
            </div>
            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-1 text-sm text-ink">
                  Make
                  <div className="relative">
                    <input
                      required
                      id={makeInputId}
                      name="make"
                      value={makeQuery}
                      onChange={handleMakeInputChange}
                      onFocus={handleMakeInputFocus}
                      onBlur={handleMakeInputBlur}
                      onKeyDown={handleMakeInputKeyDown}
                      role="combobox"
                      aria-autocomplete="list"
                      aria-expanded={showMakeSuggestions}
                      aria-controls={makeListboxId}
                      aria-activedescendant={
                        highlightedMakeIndex >= 0
                          ? `${makeListboxId}-option-${highlightedMakeIndex}`
                          : undefined
                      }
                      autoComplete="off"
                      spellCheck={false}
                      placeholder="Start typing a make"
                      className="w-full rounded-lg border border-border px-3 py-2 text-sm text-ink shadow-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
                    />
                    {showMakeSuggestions ? (
                      <ul
                        id={makeListboxId}
                        role="listbox"
                        className="absolute left-0 right-0 z-20 mt-1 max-h-60 overflow-auto rounded-lg border border-border bg-white p-1 shadow-lg"
                      >
                        {filteredMakeOptions.length === 0 ? (
                          <li
                            className="px-3 py-2 text-sm text-ink-muted"
                            role="presentation"
                          >
                            No matches found
                          </li>
                        ) : (
                          filteredMakeOptions.map((make, index) => (
                            <li key={make} role="presentation">
                              <button
                                type="button"
                                role="option"
                                id={`${makeListboxId}-option-${index}`}
                                aria-selected={highlightedMakeIndex === index}
                                onMouseDown={(event) => event.preventDefault()}
                                onClick={() => handleMakeSuggestionClick(make)}
                                className={`w-full rounded-md px-3 py-2 text-left text-sm transition ${
                                  highlightedMakeIndex === index
                                    ? "bg-brand-100 text-brand-900"
                                    : "text-ink hover:bg-ink-muted/10"
                                }`}
                              >
                                {make}
                              </button>
                            </li>
                          ))
                        )}
                      </ul>
                    ) : null}
                  </div>
                </label>
                <label className="flex flex-col gap-1 text-sm text-ink">
                  Model
                  <div className="relative">
                    <input
                      required
                      id={modelInputId}
                      name="model"
                      value={modelQuery}
                      onChange={handleModelInputChange}
                      onFocus={handleModelInputFocus}
                      onBlur={handleModelInputBlur}
                      onKeyDown={handleModelInputKeyDown}
                      disabled={!selectedMake || modelOptions.length === 0}
                      role="combobox"
                      aria-autocomplete="list"
                      aria-expanded={showModelSuggestions}
                      aria-controls={modelListboxId}
                      aria-activedescendant={
                        showModelSuggestions && highlightedModelIndex >= 0
                          ? `${modelListboxId}-option-${highlightedModelIndex}`
                          : undefined
                      }
                      autoComplete="off"
                      spellCheck={false}
                      placeholder={
                        !selectedMake
                          ? "Select a make first"
                          : modelOptions.length === 0
                            ? "No models listed"
                            : "Start typing a model"
                      }
                      className={`w-full rounded-lg border border-border px-3 py-2 text-sm text-ink shadow-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-200 ${
                        !selectedMake || modelOptions.length === 0
                          ? "bg-gray-100 text-ink-muted"
                          : ""
                      }`}
                    />
                    {showModelSuggestions && selectedMake ? (
                      <ul
                        id={modelListboxId}
                        role="listbox"
                        className="absolute left-0 right-0 z-20 mt-1 max-h-60 overflow-auto rounded-lg border border-border bg-white p-1 shadow-lg"
                      >
                        {filteredModelOptions.length === 0 ? (
                          <li
                            className="px-3 py-2 text-sm text-ink-muted"
                            role="presentation"
                          >
                            No matches found
                          </li>
                        ) : (
                          filteredModelOptions.map((model, index) => (
                            <li key={model} role="presentation">
                              <button
                                type="button"
                                role="option"
                                id={`${modelListboxId}-option-${index}`}
                                aria-selected={highlightedModelIndex === index}
                                onMouseDown={(event) => event.preventDefault()}
                                onClick={() => handleModelSuggestionClick(model)}
                                className={`w-full rounded-md px-3 py-2 text-left text-sm transition ${
                                  highlightedModelIndex === index
                                    ? "bg-brand-100 text-brand-900"
                                    : "text-ink hover:bg-ink-muted/10"
                                }`}
                              >
                                {model}
                              </button>
                            </li>
                          ))
                        )}
                      </ul>
                    ) : null}
                  </div>
                </label>
                <label className="flex flex-col gap-1 text-sm text-ink">
                  Trim
                  <div className="relative">
                    <input
                      id={trimInputId}
                      name="trim"
                      value={trimQuery}
                      onChange={handleTrimInputChange}
                      onFocus={handleTrimInputFocus}
                      onBlur={handleTrimInputBlur}
                      onKeyDown={handleTrimInputKeyDown}
                      disabled={!selectedModel || trimOptions.length === 0}
                      required={trimOptions.length > 0}
                      role="combobox"
                      aria-autocomplete="list"
                      aria-expanded={showTrimSuggestions}
                      aria-controls={trimListboxId}
                      aria-activedescendant={
                        showTrimSuggestions && highlightedTrimIndex >= 0
                          ? `${trimListboxId}-option-${highlightedTrimIndex}`
                          : undefined
                      }
                      autoComplete="off"
                      spellCheck={false}
                      placeholder={
                        !selectedModel
                          ? "Select a model first"
                          : trimOptions.length === 0
                            ? "No trims listed"
                            : "Start typing a trim"
                      }
                      className={`w-full rounded-lg border border-border px-3 py-2 text-sm text-ink shadow-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-200 ${
                        !selectedModel || trimOptions.length === 0
                          ? "bg-gray-100 text-ink-muted"
                          : ""
                      }`}
                    />
                    {showTrimSuggestions && selectedModel && trimOptions.length > 0 ? (
                      <ul
                        id={trimListboxId}
                        role="listbox"
                        className="absolute left-0 right-0 z-20 mt-1 max-h-60 overflow-auto rounded-lg border border-border bg-white p-1 shadow-lg"
                      >
                        {filteredTrimOptions.length === 0 ? (
                          <li
                            className="px-3 py-2 text-sm text-ink-muted"
                            role="presentation"
                          >
                            No matches found
                          </li>
                        ) : (
                          filteredTrimOptions.map((trim, index) => (
                            <li key={trim} role="presentation">
                              <button
                                type="button"
                                role="option"
                                id={`${trimListboxId}-option-${index}`}
                                aria-selected={highlightedTrimIndex === index}
                                onMouseDown={(event) => event.preventDefault()}
                                onClick={() => handleTrimSuggestionClick(trim)}
                                className={`w-full rounded-md px-3 py-2 text-left text-sm transition ${
                                  highlightedTrimIndex === index
                                    ? "bg-brand-100 text-brand-900"
                                    : "text-ink hover:bg-ink-muted/10"
                                }`}
                              >
                                {trim}
                              </button>
                            </li>
                          ))
                        )}
                      </ul>
                    ) : null}
                  </div>
                </label>
                <label className="flex flex-col gap-1 text-sm text-ink">
                  Year
                  <input
                    required
                    name="year"
                    type="number"
                    min="1980"
                    max={new Date().getFullYear() + 1}
                    className="rounded-lg border border-border px-3 py-2 text-sm text-ink shadow-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
                  />
                </label>
                <label className="flex flex-col gap-1 text-sm text-ink">
                  VIN
                  <input
                    required
                    name="vin"
                    minLength={11}
                    maxLength={17}
                    className="rounded-lg border border-border px-3 py-2 text-sm text-ink shadow-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
                  />
                </label>
                <label className="flex flex-col gap-1 text-sm text-ink">
                  Registration state
                  <select
                    required
                    name="registrationState"
                    defaultValue="MD"
                    className="rounded-lg border border-border px-3 py-2 text-sm text-ink shadow-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
                  >
                    <option value="" disabled>
                      Select state
                    </option>
                    {US_STATES.map((state) => (
                      <option key={state.value} value={state.value}>
                        {state.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="flex flex-col gap-1 text-sm text-ink">
                  License plate
                  <input
                    name="licensePlate"
                    className="rounded-lg border border-border px-3 py-2 text-sm text-ink shadow-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
                  />
                </label>
                <label className="flex flex-col gap-1 text-sm text-ink">
                  Fuel type
                  <select
                    name="fuelType"
                    defaultValue="GAS"
                    className="rounded-lg border border-border px-3 py-2 text-sm text-ink shadow-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
                  >
                    <option value="GAS">Gasoline</option>
                    <option value="DIESEL">Diesel</option>
                    <option value="HYBRID">Hybrid</option>
                    <option value="EV">Electric</option>
                  </select>
                </label>
                <label className="flex flex-col gap-1 text-sm text-ink">
                  Mileage
                  <input
                    name="mileage"
                    type="number"
                    min="0"
                    className="rounded-lg border border-border px-3 py-2 text-sm text-ink shadow-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
                  />
                </label>
                <label className="flex flex-col gap-1 text-sm text-ink">
                  Registration renewed on
                  <input
                    name="registrationRenewedOn"
                    type="date"
                    className="rounded-lg border border-border px-3 py-2 text-sm text-ink shadow-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
                  />
                </label>
                <label className="flex flex-col gap-1 text-sm text-ink">
                  Emissions tested on
                  <input
                    name="emissionsTestedOn"
                    type="date"
                    className="rounded-lg border border-border px-3 py-2 text-sm text-ink shadow-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
                  />
                </label>
                <label className="flex flex-col gap-1 text-sm text-ink sm:col-span-2">
                  Nickname
                  <input
                    name="nickname"
                    className="rounded-lg border border-border px-3 py-2 text-sm text-ink shadow-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
                  />
                </label>
              </div>
              {error ? (
                <p className="text-sm text-danger" role="alert">
                  {error}
                </p>
              ) : null}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-ink-subtle transition hover:text-ink"
                >
                  Cancel
                </button>
                <Button
                  type="submit"
                  className="flex min-w-[120px] items-center justify-center gap-2 bg-brand-600 text-white transition hover:bg-brand-700"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <FiLoader className="h-4 w-4 animate-spin" />
                      Saving
                    </>
                  ) : (
                    "Save vehicle"
                  )}
                </Button>
              </div>
            </form>
            <p className="mt-4 text-xs text-ink-muted">
              
            </p>
          </div>
        </div>
      ) : null}
    </>
  );
};


