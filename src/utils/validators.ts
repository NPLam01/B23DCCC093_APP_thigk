import { isValidDate, isDateBeforeToday } from './dateUtils';
import { CATEGORIES, PRIORITIES } from '../types/task';

export interface FormErrors {
  title?: string;
  dueDate?: string;
  category?: string;
  priority?: string;
}

/**
 * Kiểm tra tiêu đề: bắt buộc, tối đa 50 ký tự
 */
export const validateTitle = (title: string): string | null => {
  if (!title || title.trim().length === 0) {
    return 'Tiêu đề không được để trống';
  }
  if (title.trim().length > 50) {
    return 'Tiêu đề tối đa 50 ký tự (hiện tại: ' + title.trim().length + ')';
  }
  return null;
};

/**
 * Kiểm tra hạn chót:
 * - Định dạng dd/mm/yyyy
 * - Ngày có thật trên lịch
 * - Khi thêm mới: không được trước ngày hôm nay
 */
export const validateDueDate = (
  dueDate: string,
  isNew: boolean = false
): string | null => {
  if (!dueDate || dueDate.trim().length === 0) {
    return 'Hạn chót không được để trống (định dạng dd/mm/yyyy)';
  }

  const trimmed = dueDate.trim();
  if (!isValidDate(trimmed)) {
    return 'Ngày không hợp lệ hoặc không có thật (ví dụ: 30/10/2026)';
  }

  if (isNew && isDateBeforeToday(trimmed)) {
    return 'Khi thêm mới, hạn chót không được trước ngày hôm nay';
  }

  return null;
};

/**
 * Kiểm tra danh mục
 */
export const validateCategory = (category: string): string | null => {
  if (!category || !CATEGORIES.includes(category as any)) {
    return 'Vui lòng chọn danh mục';
  }
  return null;
};

/**
 * Kiểm tra mức ưu tiên
 */
export const validatePriority = (priority: string): string | null => {
  if (!priority || !PRIORITIES.includes(priority as any)) {
    return 'Vui lòng chọn mức độ ưu tiên';
  }
  return null;
};

/**
 * Kiểm tra toàn bộ form
 */
export const validateTaskForm = (
  values: {
    title: string;
    dueDate: string;
    category: string;
    priority: string;
  },
  isNew: boolean = false
): FormErrors => {
  const errors: FormErrors = {};

  const titleError = validateTitle(values.title);
  if (titleError) {
    errors.title = titleError;
  }

  const dueDateError = validateDueDate(values.dueDate, isNew);
  if (dueDateError) {
    errors.dueDate = dueDateError;
  }

  const categoryError = validateCategory(values.category);
  if (categoryError) {
    errors.category = categoryError;
  }

  const priorityError = validatePriority(values.priority);
  if (priorityError) {
    errors.priority = priorityError;
  }

  return errors;
};
