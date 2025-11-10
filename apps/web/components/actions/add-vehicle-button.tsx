"use client";

import {
  FormEvent,
  KeyboardEvent as ReactKeyboardEvent,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import type { Vehicle } from "@repo/core";
import { FiLoader, FiPlus, FiX } from "react-icons/fi";
import { Button } from "@repo/ui/button";
import { US_STATES } from "../../lib/us-states";
import {
  getMakeOptions,
  getModelOptions,
  getTrimOptions,
} from "../../lib/vehicle-catalog";
import { DatePicker } from "../ui/date-picker";
import { useToast } from "../ui/toast";

const VEHICLE_TYPE_OPTIONS = [
  { value: "SEDAN", label: "Sedan" },
  { value: "COUPE", label: "Coupe" },
  { value: "SPORTS_CAR", label: "Sports Car" },
  { value: "SUV", label: "SUV" },
  { value: "MOTORCYCLE", label: "Motorcycle" },
  { value: "CROSSOVER", label: "Crossover" },
] as const;

const DEFAULT_VEHICLE_TYPE = VEHICLE_TYPE_OPTIONS[0].value;

const VEHICLE_PURPOSE_OPTIONS = [
  { value: "DAILY_DRIVER", label: "Daily Driver" },
  { value: "COMMUTER", label: "Commuter" },
  { value: "WEEKENDER", label: "Weekender" },
  { value: "UTILITY_VEHICLE", label: "Utility Vehicle" },
] as const;

const DEFAULT_VEHICLE_PURPOSE = VEHICLE_PURPOSE_OPTIONS[0].value;

type ComboField = "make" | "model" | "trim";

const createComboErrorState = (): Record<ComboField, string> => ({
  make: "",
  model: "",
  trim: "",
});

const comboFieldMessages: Record<ComboField, string> = {
  make: "Select a make to continue.",
  model: "Select a model to continue.",
  trim: "Select a trim before choosing a year.",
};

interface AddVehicleButtonProps {
  onSuccess?: (vehicle: Vehicle) => void;
  appearance?: "glass" | "primary";
  className?: string;
  autoOpen?: boolean;
}

export const AddVehicleButton = ({
  onSuccess,
  appearance = "glass",
  className = "",
  autoOpen = false,
}: AddVehicleButtonProps) => {
  const [isRefreshing, startTransition] = useTransition();
  const [open, setOpen] = useState(autoOpen);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { publish } = useToast();
  const formRef = useRef<HTMLFormElement | null>(null);
  const [formValid, setFormValid] = useState(false);
  const [comboErrors, setComboErrors] = useState<Record<ComboField, string>>(
    createComboErrorState,
  );

  useEffect(() => {
    if (autoOpen) {
      setOpen(true);
    }
  }, [autoOpen]);

  /**
   * --- Make Autocomplete ----------------------------------------------------
   * We start by building a reliable make picker. Once this works well,
   * we can layer in model/trim/year with the same foundation.
   */
  const makeInputRef = useRef<HTMLInputElement | null>(null);
  const makeListboxId = useId();
  const makeErrorMessageId = `${makeListboxId}-error`;
  const makeOptions = useMemo(() => getMakeOptions(), []);
  const [makeQuery, setMakeQuery] = useState("");
  const [selectedMake, setSelectedMake] = useState("");
  const [showMakeSuggestions, setShowMakeSuggestions] = useState(false);
  const [highlightedMakeIndex, setHighlightedMakeIndex] = useState(-1);

  const modelInputRef = useRef<HTMLInputElement | null>(null);
  const modelListboxId = useId();
  const modelErrorMessageId = `${modelListboxId}-error`;
  const [selectedModel, setSelectedModel] = useState("");
  const [modelQuery, setModelQuery] = useState("");
  const [showModelSuggestions, setShowModelSuggestions] = useState(false);
  const [highlightedModelIndex, setHighlightedModelIndex] = useState(-1);

  const trimInputRef = useRef<HTMLInputElement | null>(null);
  const trimListboxId = useId();
  const trimErrorMessageId = `${trimListboxId}-error`;
  const [selectedTrim, setSelectedTrim] = useState("");
  const [trimQuery, setTrimQuery] = useState("");
  const [showTrimSuggestions, setShowTrimSuggestions] = useState(false);
  const [highlightedTrimIndex, setHighlightedTrimIndex] = useState(-1);
  const [vehicleType, setVehicleType] = useState<string>(DEFAULT_VEHICLE_TYPE);
  const [purpose, setPurpose] = useState<string>(DEFAULT_VEHICLE_PURPOSE);

  const resetComboErrors = () => setComboErrors(createComboErrorState());

  const clearComboErrors = (...fields: ComboField[]) => {
    setComboErrors((prev) => {
      let next: Record<ComboField, string> | null = null;
      fields.forEach((field) => {
        if (prev[field]) {
          if (!next) {
            next = { ...prev };
          }
          next[field] = "";
        }
      });
      return next ?? prev;
    });
  };

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
      setVehicleType(DEFAULT_VEHICLE_TYPE);
      setPurpose(DEFAULT_VEHICLE_PURPOSE);
      setFormValid(false);
      resetComboErrors();
      setError(null);
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
    resetComboErrors();
  };

  const handleMakeChange = (value: string) => {
    setMakeQuery(value);
    setShowMakeSuggestions(true);
    setHighlightedMakeIndex(-1);
    clearComboErrors("make");
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
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

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

  const handleMakeKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
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
    clearComboErrors("model", "trim");
  };

  const handleModelChange = (value: string) => {
    if (!selectedMake) return;
    setModelQuery(value);
    setShowModelSuggestions(true);
    setHighlightedModelIndex(-1);
    clearComboErrors("model", "trim");
    setSelectedTrim("");
    setTrimQuery("");
    setShowTrimSuggestions(false);
    setHighlightedTrimIndex(-1);
    setYearQuery("");
    setSelectedYear("");
    setShowYearSuggestions(false);
    setHighlightedYearIndex(-1);
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
        setYearQuery("");
        setSelectedYear("");
        setShowYearSuggestions(false);
        setHighlightedYearIndex(-1);
      }
      setShowModelSuggestions(false);
      setHighlightedModelIndex(-1);
    });
  };

  const selectTrim = (value: string) => {
    const isChanging = value !== selectedTrim;
    setSelectedTrim(value);
    setTrimQuery(value);
    setShowTrimSuggestions(false);
    setHighlightedTrimIndex(-1);
    clearComboErrors("trim");
    if (isChanging) {
      setYearQuery("");
      setSelectedYear("");
      setShowYearSuggestions(false);
      setHighlightedYearIndex(-1);
    }
  };

  const handleTrimChange = (value: string) => {
    if (!selectedMake || !selectedModel) return;
    setTrimQuery(value);
    setShowTrimSuggestions(true);
    setHighlightedTrimIndex(-1);
    clearComboErrors("trim");
    setYearQuery("");
    setSelectedYear("");
    setShowYearSuggestions(false);
    setHighlightedYearIndex(-1);
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
        if (match !== selectedTrim) {
        }
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
          setYearQuery("");
          setSelectedYear("");
          setShowYearSuggestions(false);
          setHighlightedYearIndex(-1);
        }
      }
      setShowTrimSuggestions(false);
      setHighlightedTrimIndex(-1);
    });
  };

  const handleTrimKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
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
    if (!selectedTrim) {
      setYearQuery("");
      setSelectedYear("");
      setShowYearSuggestions(false);
      setHighlightedYearIndex(-1);
      return;
    }
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
      if (!selectedTrim) {
        setShowYearSuggestions(false);
        setHighlightedYearIndex(-1);
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

  const handleYearKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (!selectedTrim || !filteredYearOptions.length) {
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
    setVehicleType(DEFAULT_VEHICLE_TYPE);
    setPurpose(DEFAULT_VEHICLE_PURPOSE);
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
    setYearQuery("");
    setSelectedYear("");
    setShowYearSuggestions(false);
    setHighlightedYearIndex(-1);
    trimInputRef.current?.focus();
  };

  const clearYear = () => {
    setYearQuery("");
    setSelectedYear("");
    setShowYearSuggestions(false);
    setHighlightedYearIndex(-1);
    yearInputRef.current?.focus();
  };

  const updateFormValidity = useCallback(() => {
    const form = formRef.current;
    if (!form) {
      setFormValid(false);
      return;
    }

    if (!form.checkValidity()) {
      setFormValid(false);
      return;
    }

    const normalizedTrim = (selectedTrim || trimQuery || "")
      .trim()
      .toLowerCase();
    const trimMatchesCatalog =
      Boolean(normalizedTrim) &&
      trimOptions.some(
        (option) => option.toLowerCase() === normalizedTrim,
      );

    const normalizedYear = (selectedYear || yearQuery || "").trim();
    const yearMatchesCatalog =
      Boolean(normalizedYear) && yearOptions.includes(normalizedYear);

    setFormValid(trimMatchesCatalog && yearMatchesCatalog);
  }, [
    selectedTrim,
    trimQuery,
    trimOptions,
    selectedYear,
    yearQuery,
    yearOptions,
  ]);

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
  if (!inputEl || !selectedTrim) {
    return;
  }
    if (document.activeElement !== inputEl) {
      return;
    }
    if (selectedYear) {
      return;
    }
  setShowYearSuggestions(true);
}, [selectedTrim, selectedYear, filteredYearOptions.length]);

useEffect(() => {
  if (!open) return;
  updateFormValidity();
}, [open, updateFormValidity]);

  const handleModelKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
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

    const form = formRef.current;
    if (!form) {
      setError("Form not ready. Please close and reopen the modal.");
      setSubmitting(false);
      return;
    }
    if (!form.checkValidity()) {
      form.reportValidity();
      setError("Please fix the highlighted fields before saving.");
      setSubmitting(false);
      return;
    }

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
    const vehicleTypeValue = vehicleType;
    const purposeValue = purpose;
    const mileageInput = (formData.get("mileage") as string) ?? "";
    const mileageSanitized = mileageInput.replace(/[^\d]/g, "");
    const mileageValue = mileageSanitized ? Number(mileageSanitized) : null;
    const colorValue =
      (formData.get("color") as string)?.trim() || null;

    const comboErrorsToApply: Partial<Record<ComboField, string>> = {};
    let firstInvalidField: ComboField | null = null;

    if (!selectedMake) {
      comboErrorsToApply.make = comboFieldMessages.make;
      firstInvalidField = firstInvalidField ?? "make";
    }

    if (selectedMake && !selectedModel) {
      comboErrorsToApply.model = comboFieldMessages.model;
      firstInvalidField = firstInvalidField ?? "model";
    }

    if (selectedModel && !trimValue) {
      comboErrorsToApply.trim = comboFieldMessages.trim;
      firstInvalidField = firstInvalidField ?? "trim";
      setYearQuery("");
      setSelectedYear("");
      setShowYearSuggestions(false);
      setHighlightedYearIndex(-1);
      if (selectedMake && selectedModel) {
        setShowTrimSuggestions(true);
        setHighlightedTrimIndex(-1);
      }
    }

    if (firstInvalidField) {
      setComboErrors((prev) => ({ ...prev, ...comboErrorsToApply }));
      setError("Please complete the highlighted selections before saving.");
      setSubmitting(false);
      if (firstInvalidField === "make") {
        makeInputRef.current?.focus();
      } else if (firstInvalidField === "model") {
        modelInputRef.current?.focus();
      } else {
        trimInputRef.current?.focus();
      }
      return;
    }

    if (!resolvedYear) {
      setError("Please choose a valid year.");
      setSubmitting(false);
      if (selectedTrim) {
        setShowYearSuggestions(true);
        setHighlightedYearIndex(-1);
        yearInputRef.current?.focus();
      }
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
      mileage: mileageValue,
      fuelType: "GAS",
      purpose: purposeValue,
      vehicleType: vehicleTypeValue,
      color: colorValue,
      registrationRenewedOn: formData.get("registrationRenewedOn") || null,
      emissionsTestedOn: formData.get("emissionsTestedOn") || null,
      licensePlate: (formData.get("licensePlate") as string)?.toUpperCase() || null,
    };

    try {
      const response = await fetch("/api/vehicles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        console.error("Vehicle save failed", body);
        const message =
          body?.details?.formErrors?.length
            ? body.details.formErrors[0]
            : body?.error ??
              "Unable to save vehicle right now. Please try again shortly.";
        throw new Error(message);
      }

      const body = await response.json().catch(() => null);
      const createdVehicle = body?.data as Vehicle | undefined;

      setOpen(false);
      formRef.current?.reset();
      setFormValid(false);
      publish({
        title: "Vehicle saved",
        description: `${payload.year} ${payload.make} ${payload.model}`,
        tone: "success",
      });
      startTransition(() => {
        if (createdVehicle) {
          onSuccess?.(createdVehicle);
        } else {
          onSuccess?.(payload as unknown as Vehicle);
        }
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Button
        className={`${appearance === "primary"
          ? "bg-brand-600 text-white transition hover:bg-brand-700 focus-visible:ring-2 focus-visible:ring-brand-200"
          : "border border-white/40 bg-white/10 text-black transition hover:bg-white/20"} ${className}`}
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
                aria-label="Close"
              >
                <FiX className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <form
              ref={formRef}
              className="mt-6 space-y-4 text-left"
              onSubmit={handleSubmit}
              onInput={updateFormValidity}
            >
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
                    aria-invalid={comboErrors.make ? "true" : undefined}
                    aria-describedby={comboErrors.make ? makeErrorMessageId : undefined}
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
                                  ? "bg-brand-600 text-white"
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
                    {comboErrors.make ? (
                      <p id={makeErrorMessageId} className="mt-1 text-xs text-danger">
                        {comboErrors.make}
                      </p>
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
                      aria-invalid={comboErrors.model ? "true" : undefined}
                      aria-describedby={comboErrors.model ? modelErrorMessageId : undefined}
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
                                    ? "bg-brand-600 text-white"
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
                    {comboErrors.model ? (
                      <p id={modelErrorMessageId} className="mt-1 text-xs text-danger">
                        {comboErrors.model}
                      </p>
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
                      aria-invalid={comboErrors.trim ? "true" : undefined}
                      aria-describedby={comboErrors.trim ? trimErrorMessageId : undefined}
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
                                  ? "bg-brand-600 text-white"
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
                    {comboErrors.trim ? (
                      <p id={trimErrorMessageId} className="mt-1 text-xs text-danger">
                        {comboErrors.trim}
                      </p>
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
                        if (!selectedTrim) {
                          return;
                        }
                        if (!selectedYear) {
                          setShowYearSuggestions(true);
                        }
                      }}
                      onBlur={handleYearBlur}
                      onKeyDown={handleYearKeyDown}
                      role="combobox"
                      aria-autocomplete="list"
                      aria-expanded={Boolean(selectedTrim && showYearSuggestions)}
                      aria-controls={yearListboxId}
                      aria-activedescendant={
                        selectedTrim && showYearSuggestions && highlightedYearIndex >= 0
                          ? `${yearListboxId}-option-${highlightedYearIndex}`
                          : undefined
                      }
                      autoComplete="off"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={4}
                      placeholder="Enter year"
                      required
                      disabled={!selectedTrim}
                      className={`w-full rounded-lg border border-border py-2 pl-3 pr-9 text-sm text-ink shadow-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-200 ${
                        selectedTrim ? "" : "bg-gray-100 text-ink-muted cursor-not-allowed"
                      }`}
                    />
                    {selectedTrim && yearQuery ? (
                      <button
                        type="button"
                        onClick={clearYear}
                        aria-label="Clear year"
                        className="absolute inset-y-0 right-2 flex items-center text-ink-muted transition hover:text-ink"
                      >
                        <FiX className="h-4 w-4" />
                      </button>
                    ) : null}
                    {showYearSuggestions && selectedTrim ? (
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
                                    ? "bg-brand-600 text-white"
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
                    onChange={(event) =>
                      (event.currentTarget.value = event.currentTarget.value.toUpperCase())
                    }
                    className="rounded-lg border border-border px-3 py-2 text-sm text-ink shadow-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
                  />
                </label>
                <label className="flex flex-col gap-1 text-sm text-ink">
                  Purpose
                  <select
                    name="purpose"
                    value={purpose}
                    onChange={(event) => setPurpose(event.target.value)}
                    className="rounded-lg border border-border px-3 py-2 text-sm text-ink shadow-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
                  >
                    {VEHICLE_PURPOSE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="flex flex-col gap-1 text-sm text-ink">
                  Vehicle type
                  <select
                    name="vehicleType"
                    value={vehicleType}
                    onChange={(event) => setVehicleType(event.target.value)}
                    required
                    className="rounded-lg border border-border px-3 py-2 text-sm text-ink shadow-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
                  >
                    {VEHICLE_TYPE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="flex flex-col gap-1 text-sm text-ink">
                  Registration expires on
                  <DatePicker
                    name="registrationRenewedOn"
                    placeholder="Select date"
                    onValueChange={updateFormValidity}
                  />
                </label>
                <label className="flex flex-col gap-1 text-sm text-ink">
                  Emission due date
                  <DatePicker
                    name="emissionsTestedOn"
                    placeholder="Select date"
                    onValueChange={updateFormValidity}
                  />
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
                  Color
                  <input
                    name="color"
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
                  disabled={submitting || isRefreshing || !formValid}
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






