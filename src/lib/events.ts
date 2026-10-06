/** Evento usado pelos serviços para pré-preencher o campo "project" do formulário de contato. */
export const PREFILL_EVENT = "contact:prefill";

export const prefillContact = (project: string) =>
  window.dispatchEvent(new CustomEvent<string>(PREFILL_EVENT, { detail: project }));
