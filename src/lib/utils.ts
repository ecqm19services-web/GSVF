import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * En mode édition, les champs `EditableText` sont des zones `contentEditable`.
 * Une frappe (Espace, Entrée) ou un clic pour placer le curseur y a pour cible ces
 * zones : un conteneur cliquable (carte qui se déplie, panneau) doit ignorer ces
 * événements, sinon il se replie et le caractère saisi est perdu.
 */
export function isEditableTarget(target: EventTarget | null): boolean {
  return target instanceof HTMLElement && !!target.closest('[contenteditable="true"]')
}
