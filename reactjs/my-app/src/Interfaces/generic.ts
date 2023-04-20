
export interface IConfirmDeleteProps{
  isOpen:         boolean;
  title:          string;
  description:    string;
  warning?:       string;
  callbackConfirmDelete(): void;
  callbackCloseModal(): void;
}
