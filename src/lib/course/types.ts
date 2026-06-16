export type Question = {
  id: string;
  text: string;
  options: { id: string; text: string; correct?: boolean }[];
  explanation: string;
};

export type TheorySection = {
  title: string;
  body: string;
  bullets?: string[];
};

export type ModuleResult = {
  min: number;
  max: number;
  title: string;
  text: string;
  tips: string[];
};

export type Module = {
  id: string;
  title: string;
  description: string;
  free: boolean;
  duration: string;
  theory: TheorySection[];
  questions: Question[];
  results: ModuleResult[];
};
