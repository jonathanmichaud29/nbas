
export interface IConfirmDeleteProps{
  isOpen:         boolean;
  title:          string;
  description:    string;
  callbackConfirmDelete(): void;
  callbackCloseModal(): void;
}
