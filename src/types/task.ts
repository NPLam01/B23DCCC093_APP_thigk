export type Category = 'Học tập' | 'Công việc' | 'Sức khoẻ' | 'Cá nhân';

export type Priority = 'Cao' | 'Trung bình' | 'Thấp';

export type FilterType = 'Tất cả' | 'Chưa xong' | 'Đã xong' | 'Quá hạn';

export type SortOption = 'dueDate' | 'priority';

export interface Task {
  id: string;
  title: string;
  note: string;
  category: Category;
  priority: Priority;
  dueDate: string; // Format: dd/mm/yyyy
  done: boolean;
}

export const CATEGORIES: Category[] = [
  'Học tập',
  'Công việc',
  'Sức khoẻ',
  'Cá nhân',
];

export const PRIORITIES: Priority[] = ['Cao', 'Trung bình', 'Thấp'];

export const FILTERS: FilterType[] = [
  'Tất cả',
  'Chưa xong',
  'Đã xong',
  'Quá hạn',
];
