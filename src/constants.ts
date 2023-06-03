// Finds string between @@...@@
export const dateTimeMatchRegexExcludeMatchers = /\b(?<=@@)(.*?)(?=@@)\b/g;

// Finds string between &&...&&
export const stringWildcardMatchRegexExcludeMatchers = /\b(?<=&&)(.*?)(?=&&)\b/g;

// Finds string between @@...@@ inclusive
export const dateTimeMatchRegexIncludeMatchers = /(\@@)(.*?)(\@@)/g;

// Finds string between &&...&& inclusive
export const stringWildcardMatchRegexIncludeMatchers = /(\&&)(.*?)(\&&)/g;
