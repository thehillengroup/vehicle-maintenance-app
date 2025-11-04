"use client";

import {
  FormEvent,
  KeyboardEvent,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { FiLoader, FiPlus, FiX } from "react-icons/fi";
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

  /**
   * --- Make Autocomplete ----------------------------------------------------
   * We start by building a reliable make picker. Once this works well,
   * we can layer in model/trim/year with the same foundation.
   */
  const makeInputRef = useRef<HTMLInputElement | null>(null);
  const makeListboxId = useId();
  const makeOptions = useMemo(() => getMakeOptions(), []);
  const [makeQuery, setMakeQuery] = useState("");
  const [selectedMake, setSelectedMake] = useState("");
  const [showMakeSuggestions, setShowMakeSuggestions] = useState(false);
  const [highlightedMakeIndex, setHighlightedMakeIndex] = useState(-1);

  const modelInputRef = useRef<HTMLInputElement | null>(null);
  const modelListboxId = useId();
  const [selectedModel, setSelectedModel] = useState("");
  const [modelQuery, setModelQuery] = useState("");
  const [showModelSuggestions, setShowModelSuggestions] = useState(false);
  const [highlightedModelIndex, setHighlightedModelIndex] = useState(-1);

  const trimInputRef = useRef<HTMLInputElement | null>(null);
  const trimListboxId = useId();
  const [selectedTrim, setSelectedTrim] = useState("");
  const [trimQuery, setTrimQuery] = useState("");
  const [showTrimSuggestions, setShowTrimSuggestions] = useState(false);
  const [highlightedTrimIndex, setHighlightedTrimIndex] = useState(-1);

  const yearInputRef = useRef<HTMLInputElement | null>(null);
  const yearListboxId = useId();
  const [selectedYear, setSelectedYear] = useState("");
  const [yearQuery, setYearQuery] = useState("");
  const [showYearSuggestions, setShowYearSuggestions] = useState(false);
  const [highlightedYearIndex, setHighlightedYearIndex] = useState(-1);

  const filteredMakeOptions = useMemo(() => {
    const search = makeQuery.trim().toLowerCase();
    if (!search) {
      return makeOptions;
    }
    return makeOptions.filter((option) =>
      option.toLowerCase().includes(search),
    );
  }, [makeOptions, makeQuery]);

  const modelOptions = useMemo(() => {
    if (!selectedMake) {
      return [];
    }
    return getModelOptions(selectedMake);
  }, [selectedMake]);

  const filteredModelOptions = useMemo(() => {
    if (!selectedMake) {
      return [];
    }
    const search = modelQuery.trim().toLowerCase();
    if (!search) {
      return modelOptions;
    }
    return modelOptions.filter((option) =>
      option.toLowerCase().includes(search),
    );
  }, [modelOptions, modelQuery, selectedMake]);

  const trimOptions = useMemo(() => {
    if (!selectedMake || !selectedModel) {
      return [];
    }
    return getTrimOptions(selectedMake, selectedModel);
  }, [selectedMake, selectedModel]);

  const filteredTrimOptions = useMemo(() => {
    if (!selectedMake || !selectedModel) {
      return [];
    }
    const search = trimQuery.trim().toLowerCase();
    if (!search) {
      return trimOptions;
    }
    return trimOptions.filter((option) =>
      option.toLowerCase().includes(search),
    );
  }, [selectedMake, selectedModel, trimOptions, trimQuery]);

  const yearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear() + 1;
    const options: string[] = [];
    for (let year = currentYear; year >= 1980; year -= 1) {
      options.push(String(year));
    }
    return options;
  }, []);

  const filteredYearOptions = useMemo(() => {
    const search = yearQuery.trim();
    if (!search) {
      return yearOptions;
    }
    return yearOptions.filter((option) =>
      option.toLowerCase().includes(search.toLowerCase()),
    );
  }, [yearOptions, yearQuery]);

  useEffect(() => {
    if (!open) {
      setMakeQuery("");
      setSelectedMake("");
      setShowMakeSuggestions(false);
      setHighlightedMakeIndex(-1);
      setModelQuery("");
      setSelectedModel("");
      setShowModelSuggestions(false);
      setHighlightedModelIndex(-1);
      setTrimQuery("");
      setSelectedTrim("");
      setShowTrimSuggestions(false);
      setHighlightedTrimIndex(-1);
      setYearQuery("");
      setSelectedYear("");
      setShowYearSuggestions(false);
      setHighlightedYearIndex(-1);
    }
  }, [open]);

  const selectMake = (value: string) => {
    setSelectedMake(value);
    setMakeQuery(value);
    setShowMakeSuggestions(false);
    setHighlightedMakeIndex(-1);
    setSelectedModel("");
    setModelQuery("");
    setShowModelSuggestions(false);
    setHighlightedModelIndex(-1);
    setSelectedTrim("");
    setTrimQuery("");
    setShowTrimSuggestions(false);
    setHighlightedTrimIndex(-1);
  };

  const handleMakeChange = (value: string) => {
    setMakeQuery(value);
    setShowMakeSuggestions(true);
    setHighlightedMakeIndex(-1);
    if (!value.trim()) {
      setSelectedMake("");
      setSelectedModel("");
      setModelQuery("");
      setShowModelSuggestions(false);
      setHighlightedModelIndex(-1);
      setSelectedTrim("");
      setTrimQuery("");
      setShowTrimSuggestions(false);
      setHighlightedTrimIndex(-1);
    }
  };

  const handleMakeBlur = () => {
    requestAnimationFrame(() => {
      const active = document.activeElement;
      if (makeInputRef.current && active === makeInputRef.current) {
        return;
      }
      const match = filteredMakeOptions.find(
        (option) => option.toLowerCase() === makeQuery.trim().toLowerCase(),
      );
      if (match) {
        if (match !== selectedMake) {
          selectMake(match);
        } else {
          setMakeQuery(match);
        }
      } else if (makeQuery.trim()) {
        const firstOption = filteredMakeOptions[0];
        if (firstOption) {
          selectMake(firstOption);
        } else {
          setSelectedMake("");
          setSelectedModel("");
          setModelQuery("");
          setShowModelSuggestions(false);
          setHighlightedModelIndex(-1);
          setSelectedTrim("");
          setTrimQuery("");
          setShowTrimSuggestions(false);
          setHighlightedTrimIndex(-1);
        }
      } else if (!makeQuery.trim()) {
        setSelectedMake("");
        setSelectedModel("");
        setModelQuery("");
        setShowModelSuggestions(false);
        setHighlightedModelIndex(-1);
        setSelectedTrim("");
        setTrimQuery("");
        setShowTrimSuggestions(false);
        setHighlightedTrimIndex(-1);
      }
      setShowMakeSuggestions(false);
      setHighlightedMakeIndex(-1);
    });
  };

  const handleMakeKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!filteredMakeOptions.length) {
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setShowMakeSuggestions(true);
      setHighlightedMakeIndex((prev) =>
        prev < filteredMakeOptions.length - 1 ? prev + 1 : 0,
      );
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setShowMakeSuggestions(true);
      setHighlightedMakeIndex((prev) =>
        prev <= 0 ? filteredMakeOptions.length - 1 : prev - 1,
      );
      return;
    }

    if (event.key === "Enter") {
      if (
        showMakeSuggestions &&
        highlightedMakeIndex >= 0 &&
        highlightedMakeIndex < filteredMakeOptions.length
      ) {
        event.preventDefault();
        const option = filteredMakeOptions[highlightedMakeIndex];
        if (typeof option !== "string") {
          setShowMakeSuggestions(false);
          return;
        }
        selectMake(option);
        setShowMakeSuggestions(false);
        return;
      }
      return;
    }

    if (event.key === "Escape") {
      setShowMakeSuggestions(false);
      setHighlightedMakeIndex(-1);
    }
  };

  const selectModel = (value: string) => {
    setSelectedModel(value);
    setModelQuery(value);
    setShowModelSuggestions(false);
    setHighlightedModelIndex(-1);
    setSelectedTrim("");
    setTrimQuery("");
    setShowTrimSuggestions(false);
    setHighlightedTrimIndex(-1);
  };

  const handleModelChange = (value: string) => {
    if (!selectedMake) return;
    setModelQuery(value);
    setShowModelSuggestions(true);
    setHighlightedModelIndex(-1);
    setSelectedTrim("");
    setTrimQuery("");
    setShowTrimSuggestions(false);
    setHighlightedTrimIndex(-1);
    if (!value.trim()) {
      setSelectedModel("");
    }
  };

  const handleModelBlur = () => {
    requestAnimationFrame(() => {
      const active = document.activeElement;
      if (modelInputRef.current && active === modelInputRef.current) {
        return;
      }
      if (!selectedMake) {
        setShowModelSuggestions(false);
        return;
      }
      const match = filteredModelOptions.find(
        (option) => option.toLowerCase() === modelQuery.trim().toLowerCase(),
      );
      if (match) {
        if (match !== selectedModel) {
          selectModel(match);
        } else {
          setModelQuery(match);
        }
      } else if (!modelQuery.trim()) {
        setSelectedModel("");
        setSelectedTrim("");
        setTrimQuery("");
        setShowTrimSuggestions(false);
        setHighlightedTrimIndex(-1);
      }
      setShowModelSuggestions(false);
      setHighlightedModelIndex(-1);
    });
  };

  const selectTrim = (value: string) => {
    setSelectedTrim(value);
    setTrimQuery(value);
    setShowTrimSuggestions(false);
    setHighlightedTrimIndex(-1);
  };

  const handleTrimChange = (value: string) => {
    if (!selectedMake || !selectedModel) return;
    setTrimQuery(value);
    setShowTrimSuggestions(true);
    setHighlightedTrimIndex(-1);
    if (!value.trim()) {
      setSelectedTrim("");
    }
  };

  const handleTrimBlur = () => {
    requestAnimationFrame(() => {
      const active = document.activeElement;
      if (trimInputRef.current && active === trimInputRef.current) {
        return;
      }
      if (!selectedMake || !selectedModel) {
        setShowTrimSuggestions(false);
        return;
      }
      const match = filteredTrimOptions.find(
        (option) => option.toLowerCase() === trimQuery.trim().toLowerCase(),
      );
      if (match) {
        setTrimQuery(match);
        setSelectedTrim(match);
      } else if (!trimQuery.trim()) {
        setSelectedTrim("");
      } else {
        const firstOption = filteredTrimOptions[0];
        if (firstOption) {
          selectTrim(firstOption);
        } else {
          setSelectedTrim("");
          setTrimQuery("");
        }
      }
      setShowTrimSuggestions(false);
      setHighlightedTrimIndex(-1);
    });
  };

  const handleTrimKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!selectedMake || !selectedModel || !filteredTrimOptions.length) {
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setShowTrimSuggestions(true);
      setHighlightedTrimIndex((prev) =>
        prev < filteredTrimOptions.length - 1 ? prev + 1 : 0,
      );
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setShowTrimSuggestions(true);
      setHighlightedTrimIndex((prev) =>
        prev <= 0 ? filteredTrimOptions.length - 1 : prev - 1,
      );
      return;
    }

    if (event.key === "Enter") {
      if (
        showTrimSuggestions &&
        highlightedTrimIndex >= 0 &&
        highlightedTrimIndex < filteredTrimOptions.length
      ) {
        event.preventDefault();
        const option = filteredTrimOptions[highlightedTrimIndex];
        if (typeof option !== "string") {
          setShowTrimSuggestions(false);
          return;
        }
        selectTrim(option);
        setShowTrimSuggestions(false);
        return;
      }
      return;
    }

    if (event.key === "Escape") {
      setShowTrimSuggestions(false);
      setHighlightedTrimIndex(-1);
    }
  };

  const selectYear = (value: string) => {
    setSelectedYear(value);
    setYearQuery(value);
    setShowYearSuggestions(false);
    setHighlightedYearIndex(-1);
  };

  const handleYearChange = (value: string) => {
    const sanitized = value.replace(/[^\d]/g, "").slice(0, 4);
    setYearQuery(sanitized);
    setShowYearSuggestions(true);
    setHighlightedYearIndex(-1);
    if (!sanitized.trim()) {
      setSelectedYear("");
    }
  };

  const handleYearBlur = () => {
    requestAnimationFrame(() => {
      const active = document.activeElement;
      if (yearInputRef.current && active === yearInputRef.current) {
        return;
      }
      const match = filteredYearOptions.find(
        (option) => option === yearQuery.trim(),
      );
      if (match) {
        selectYear(match);
      } else if (!yearQuery.trim()) {
        setSelectedYear("");
      } else {
        const firstOption = filteredYearOptions[0];
        if (firstOption) {
          selectYear(firstOption);
        } else {
          setSelectedYear("");
          setYearQuery("");
        }
      }
      setShowYearSuggestions(false);
      setHighlightedYearIndex(-1);
    });
  };

  const handleYearKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!filteredYearOptions.length) {
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setShowYearSuggestions(true);
      setHighlightedYearIndex((prev) =>
        prev < filteredYearOptions.length - 1 ? prev + 1 : 0,
      );
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setShowYearSuggestions(true);
      setHighlightedYearIndex((prev) =>
        prev <= 0 ? filteredYearOptions.length - 1 : prev - 1,
      );
      return;
    }

    if (event.key === "Enter") {
      if (
        showYearSuggestions &&
        highlightedYearIndex >= 0 &&
        highlightedYearIndex < filteredYearOptions.length
      ) {
        event.preventDefault();
        const option = filteredYearOptions[highlightedYearIndex];
        if (typeof option !== "string") {
          setShowYearSuggestions(false);
          return;
        }
        selectYear(option);
        setShowYearSuggestions(false);
        return;
      }
      return;
    }

    if (event.key === "Escape") {
      setShowYearSuggestions(false);
      setHighlightedYearIndex(-1);
    }
  };

  const clearMake = () => {
    setMakeQuery("");
    setSelectedMake("");
    setShowMakeSuggestions(false);
    setHighlightedMakeIndex(-1);
    setModelQuery("");
    setSelectedModel("");
    setShowModelSuggestions(false);
    setHighlightedModelIndex(-1);
    setTrimQuery("");
    setSelectedTrim("");
    setShowTrimSuggestions(false);
    setHighlightedTrimIndex(-1);
    makeInputRef.current?.focus();
  };

  const clearModel = () => {
    setModelQuery("");
    setSelectedModel("");
    setShowModelSuggestions(false);
    setHighlightedModelIndex(-1);
    setTrimQuery("");
    setSelectedTrim("");
    setShowTrimSuggestions(false);
    setHighlightedTrimIndex(-1);
    modelInputRef.current?.focus();
  };

  const clearTrim = () => {
    setTrimQuery("");
    setSelectedTrim("");
    setShowTrimSuggestions(false);
    setHighlightedTrimIndex(-1);
    trimInputRef.current?.focus();
  };

  const clearYear = () => {
    setYearQuery("");
    setSelectedYear("");
    setShowYearSuggestions(false);
    setHighlightedYearIndex(-1);
    yearInputRef.current?.focus();
  };

  useEffect(() => {
    const inputEl = modelInputRef.current;
    if (!selectedMake || !inputEl) {
      return;
    }
    if (document.activeElement !== inputEl) {
      return;
    }
    if (selectedModel) {
      return;
    }
    setShowModelSuggestions(true);
  }, [selectedMake, selectedModel, filteredModelOptions.length]);

  useEffect(() => {
    const inputEl = trimInputRef.current;
    if (!selectedMake || !selectedModel || !inputEl) {
      return;
    }
    if (document.activeElement !== inputEl) {
      return;
    }
    if (selectedTrim) {
      return;
    }
    setShowTrimSuggestions(true);
  }, [
    selectedMake,
    selectedModel,
    selectedTrim,
    filteredTrimOptions.length,
  ]);

  useEffect(() => {
    const inputEl = yearInputRef.current;
    if (!inputEl) {
      return;
    }
    if (document.activeElement !== inputEl) {
      return;
    }
    if (selectedYear) {
      return;
    }
    setShowYearSuggestions(true);
  }, [selectedYear, filteredYearOptions.length]);

  const handleModelKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!selectedMake || !filteredModelOptions.length) {
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setShowModelSuggestions(true);
      setHighlightedModelIndex((prev) =>
        prev < filteredModelOptions.length - 1 ? prev + 1 : 0,
      );
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setShowModelSuggestions(true);
      setHighlightedModelIndex((prev) =>
        prev <= 0 ? filteredModelOptions.length - 1 : prev - 1,
      );
      return;
    }

    if (event.key === "Enter") {
      if (
        showModelSuggestions &&
        highlightedModelIndex >= 0 &&
        highlightedModelIndex < filteredModelOptions.length
      ) {
        event.preventDefault();
        const option = filteredModelOptions[highlightedModelIndex];
        if (typeof option !== "string") {
          setShowModelSuggestions(false);
          return;
        }
        selectModel(option);
        setShowModelSuggestions(false);
        return;
      }
      return;
    }

    if (event.key === "Escape") {
      setShowModelSuggestions(false);
      setHighlightedModelIndex(-1);
    }
  };

  /**
   * -------------------------------------------------------------------------
   * Submit handler: make and model values now come from our controlled state.
   * Other fields remain simple inputs until we upgrade them.
   */
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const makeValue =
      selectedMake || (formData.get("make") as string)?.trim() || "";
    const modelValue =
      selectedModel || (formData.get("model") as string)?.trim() || "";
    const trimValue =
      selectedTrim || (formData.get("trim") as string)?.trim() || "";
    const yearValue =
      selectedYear || (formData.get("year") as string)?.trim() || "";
    const resolvedYear =
      yearValue && yearOptions.includes(yearValue) ? yearValue : "";

    if (!resolvedYear) {
      setError("Please choose a valid year.");
      setSubmitting(false);
      setShowYearSuggestions(true);
      setHighlightedYearIndex(-1);
      yearInputRef.current?.focus();
      return;
    }

    const payload = {
      make: makeValue,
      model: modelValue,
      trim: trimValue || null,
      year: Number(resolvedYear),
      vin: (formData.get("vin") as string)?.trim(),
      registrationState: (formData.get("registrationState") as string)
        ?.toUpperCase()
        .slice(0, 2),
      nickname: formData.get("nickname") || null,
      mileage: formData.get("mileage")
        ? Number(formData.get("mileage"))
        : null,
      fuelType: formData.get("fuelType") || "GAS",
      registrationRenewedOn: formData.get("registrationRenewedOn") || null,
      emissionsTestedOn: formData.get("emissionsTestedOn") || null,
      licensePlate: formData.get("licensePlate") || null,
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
                      ref={makeInputRef}
                      name="make"
                      value={makeQuery}
                      onChange={(event) => handleMakeChange(event.target.value)}
                      onFocus={() => setShowMakeSuggestions(true)}
                      onBlur={handleMakeBlur}
                      onKeyDown={handleMakeKeyDown}
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
                      required
                      className="w-full rounded-lg border border-border py-2 pl-3 pr-9 text-sm text-ink shadow-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
                    />
                    {makeQuery ? (
                      <button
                        type="button"
                        onClick={clearMake}
                        aria-label="Clear make"
                        className="absolute inset-y-0 right-2 flex items-center text-ink-muted transition hover:text-ink"
                      >
                        <FiX className="h-4 w-4" />
                      </button>
                    ) : null}
                    {showMakeSuggestions && filteredMakeOptions.length ? (
                      <ul
                        id={makeListboxId}
                        role="listbox"
                        className="absolute left-0 right-0 z-20 mt-1 max-h-60 overflow-auto rounded-lg border border-border bg-white p-1 shadow-lg"
                      >
                        {filteredMakeOptions.map((option, index) => (
                          <li key={option} role="presentation">
                            <button
                              type="button"
                              role="option"
                              id={`${makeListboxId}-option-${index}`}
                              aria-selected={highlightedMakeIndex === index}
                              className={`w-full rounded-md px-3 py-2 text-left text-sm transition ${
                                highlightedMakeIndex === index
                                  ? "bg-brand-100 text-brand-900"
                                  : "text-ink hover:bg-ink-muted/10"
                              }`}
                              onMouseDown={(event) => event.preventDefault()}
                              onClick={() => selectMake(option)}
                            >
                              {option}
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                </label>

                <label className="flex flex-col gap-1 text-sm text-ink">
                  Model
                  <div className="relative">
                    <input
                      ref={modelInputRef}
                      name="model"
                      value={modelQuery}
                      onChange={(event) => handleModelChange(event.target.value)}
                      onFocus={() => {
                        if (!selectedModel) {
                          setShowModelSuggestions(true);
                        }
                      }}
                      onBlur={handleModelBlur}
                      onKeyDown={handleModelKeyDown}
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
                        selectedMake
                          ? "Start typing a model"
                          : "Select a make first"
                      }
                      disabled={!selectedMake}
                      required
                      className={`w-full rounded-lg border border-border py-2 pl-3 pr-9 text-sm text-ink shadow-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-200 ${
                        selectedMake ? "" : "bg-gray-100 text-ink-muted"
                      }`}
                    />
                    {selectedMake && (modelQuery || selectedModel) ? (
                      <button
                        type="button"
                        onClick={clearModel}
                        aria-label="Clear model"
                        className="absolute inset-y-0 right-2 flex items-center text-ink-muted transition hover:text-ink"
                      >
                        <FiX className="h-4 w-4" />
                      </button>
                    ) : null}
                    {showModelSuggestions && selectedMake ? (
                      <ul
                        id={modelListboxId}
                        role="listbox"
                        className="absolute left-0 right-0 z-20 mt-1 max-h-60 overflow-auto rounded-lg border border-border bg-white p-1 shadow-lg"
                      >
                        {filteredModelOptions.length === 0 ? (
                          <li
                            role="presentation"
                            className="px-3 py-2 text-sm text-ink-muted"
                          >
                            No matches found
                          </li>
                        ) : (
                          filteredModelOptions.map((option, index) => (
                            <li key={option} role="presentation">
                              <button
                                type="button"
                                role="option"
                                id={`${modelListboxId}-option-${index}`}
                                aria-selected={highlightedModelIndex === index}
                                onMouseDown={(event) => event.preventDefault()}
                                onClick={() => selectModel(option)}
                                className={`w-full rounded-md px-3 py-2 text-left text-sm transition ${
                                  highlightedModelIndex === index
                                    ? "bg-brand-100 text-brand-900"
                                    : "text-ink hover:bg-ink-muted/10"
                                }`}
                              >
                                {option}
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
                      ref={trimInputRef}
                      name="trim"
                      value={trimQuery}
                      onChange={(event) => handleTrimChange(event.target.value)}
                      onFocus={() => {
                        if (!selectedTrim) {
                          setShowTrimSuggestions(true);
                        }
                      }}
                      onBlur={handleTrimBlur}
                      onKeyDown={handleTrimKeyDown}
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
                        selectedModel
                          ? "Start typing a trim"
                          : "Select a model first"
                      }
                      disabled={!selectedMake || !selectedModel}
                      className={`w-full rounded-lg border border-border py-2 pl-3 pr-9 text-sm text-ink shadow-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-200 ${
                        selectedMake && selectedModel
                          ? ""
                          : "bg-gray-100 text-ink-muted"
                      }`}
                    />
                    {selectedMake &&
                    selectedModel &&
                    (trimQuery || selectedTrim) ? (
                      <button
                        type="button"
                        onClick={clearTrim}
                        aria-label="Clear trim"
                        className="absolute inset-y-0 right-2 flex items-center text-ink-muted transition hover:text-ink"
                      >
                        <FiX className="h-4 w-4" />
                      </button>
                    ) : null}
                    {showTrimSuggestions && selectedMake && selectedModel ? (
                      <ul
                        id={trimListboxId}
                        role="listbox"
                        className="absolute left-0 right-0 z-20 mt-1 max-h-60 overflow-auto rounded-lg border border-border bg-white p-1 shadow-lg"
                      >
                        {filteredTrimOptions.length === 0 ? (
                          <li
                            role="presentation"
                            className="px-3 py-2 text-sm text-ink-muted"
                          >
                            No matches found
                          </li>
                        ) : (
                          filteredTrimOptions.map((option, index) => (
                            <li key={option} role="presentation">
                              <button
                                type="button"
                                role="option"
                                id={`${trimListboxId}-option-${index}`}
                                aria-selected={highlightedTrimIndex === index}
                                onMouseDown={(event) => event.preventDefault()}
                                onClick={() => selectTrim(option)}
                                className={`w-full rounded-md px-3 py-2 text-left text-sm transition ${
                                  highlightedTrimIndex === index
                                    ? "bg-brand-100 text-brand-900"
                                    : "text-ink hover:bg-ink-muted/10"
                                }`}
                              >
                                {option}
                              </button>
                            </li>
                          ))
                        )}
                      </ul>
                    ) : null}
                  </div>
                </label>
                {/* Remaining fields will be upgraded next */}
                <label className="flex flex-col gap-1 text-sm text-ink">
                  Year
                  <div className="relative">
                    <input
                      ref={yearInputRef}
                      name="year"
                      value={yearQuery}
                      onChange={(event) => handleYearChange(event.target.value)}
                      onFocus={() => {
                        if (!selectedYear) {
                          setShowYearSuggestions(true);
                        }
                      }}
                      onBlur={handleYearBlur}
                      onKeyDown={handleYearKeyDown}
                      role="combobox"
                      aria-autocomplete="list"
                      aria-expanded={showYearSuggestions}
                      aria-controls={yearListboxId}
                      aria-activedescendant={
                        showYearSuggestions && highlightedYearIndex >= 0
                          ? `${yearListboxId}-option-${highlightedYearIndex}`
                          : undefined
                      }
                      autoComplete="off"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={4}
                      placeholder="Enter year"
                      required
                      className="w-full rounded-lg border border-border py-2 pl-3 pr-9 text-sm text-ink shadow-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
                    />
                    {yearQuery ? (
                      <button
                        type="button"
                        onClick={clearYear}
                        aria-label="Clear year"
                        className="absolute inset-y-0 right-2 flex items-center text-ink-muted transition hover:text-ink"
                      >
                        <FiX className="h-4 w-4" />
                      </button>
                    ) : null}
                    {showYearSuggestions ? (
                      <ul
                        id={yearListboxId}
                        role="listbox"
                        className="absolute left-0 right-0 z-20 mt-1 max-h-60 overflow-auto rounded-lg border border-border bg-white p-1 shadow-lg"
                      >
                        {filteredYearOptions.length === 0 ? (
                          <li
                            role="presentation"
                            className="px-3 py-2 text-sm text-ink-muted"
                          >
                            No matches found
                          </li>
                        ) : (
                          filteredYearOptions.map((option, index) => (
                            <li key={option} role="presentation">
                              <button
                                type="button"
                                role="option"
                                id={`${yearListboxId}-option-${index}`}
                                aria-selected={highlightedYearIndex === index}
                                onMouseDown={(event) => event.preventDefault()}
                                onClick={() => selectYear(option)}
                                className={`w-full rounded-md px-3 py-2 text-left text-sm transition ${
                                  highlightedYearIndex === index
                                    ? "bg-brand-100 text-brand-900"
                                    : "text-ink hover:bg-ink-muted/10"
                                }`}
                              >
                                {option}
                              </button>
                            </li>
                          ))
                        )}
                      </ul>
                    ) : null}
                  </div>
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
          </div>
        </div>
      ) : null}
    </>
  );
};






