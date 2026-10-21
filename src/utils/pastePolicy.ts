/**
 * 'short' (problems): one line of up to SHORT_PASTE_MAX characters pastes
 *   normally -- a variable name, an error message, a one-line fix -- and
 *   anything bigger is refused with a notice. Typing the solution out is the
 *   point of a problem; retyping a name you just copied isn't.
 * 'allow' (sandbox): free experimentation, nothing to protect.
 *
 * This is a typing-practice policy, not anti-cheat: anyone can retype what
 * they see, and ranking integrity is enforced in the database.
 */
export type PastePolicy = 'short' | 'allow';
export const SHORT_PASTE_MAX = 40;

export const isShortPaste = (text: string) => !/[\r\n]/.test(text) && text.length <= SHORT_PASTE_MAX;
