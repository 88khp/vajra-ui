export type TPlaygroundSelectControl = {
  type: 'select';
  label: string;
  options: string[];
  default: string;
};

export type TPlaygroundBooleanControl = {
  type: 'boolean';
  label: string;
  default: boolean;
};

export type TPlaygroundTextControl = {
  type: 'text';
  label: string;
  default: string;
};

export type TPlaygroundControl =
  | TPlaygroundSelectControl
  | TPlaygroundBooleanControl
  | TPlaygroundTextControl;

export type TPlaygroundControls = Record<string, TPlaygroundControl>;

export type TPlaygroundValues<TControls extends TPlaygroundControls> = {
  [K in keyof TControls]: TControls[K] extends TPlaygroundSelectControl
    ? string
    : TControls[K] extends TPlaygroundBooleanControl
      ? boolean
      : string;
};
