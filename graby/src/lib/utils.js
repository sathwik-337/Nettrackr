// src/lib/utils.js
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cnn(...inputs) {
  return twMerge(clsx(inputs));
}

export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}



