import { Task, FilterType, Priority, SortOption } from '../types/task';
import { parseDate, isOverdue } from './dateUtils';

const PRIORITY_ORDER: Record<Priority, number> = {
  Cao: 1,
  'Trung bình': 2,
  Thấp: 3,
};

/**
 * Chuyển chuỗi tiếng Việt có dấu thành không dấu và chữ thường
 * Ví dụ: "Ôn tập" -> "on tap", "Đã xong" -> "da xong", "Báo cáo" -> "bao cao"
 */
export const removeVietnameseTones = (str: string): string => {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd')
    .toLowerCase()
    .trim();
};

/**
 * Lọc danh sách công việc theo bộ lọc trạng thái
 */
export const filterTasksByStatus = (
  tasks: Task[],
  filter: FilterType
): Task[] => {
  switch (filter) {
    case 'Chưa xong':
      return tasks.filter(task => !task.done && !isOverdue(task));
    case 'Đã xong':
      return tasks.filter(task => task.done);
    case 'Quá hạn':
      return tasks.filter(task => !task.done && isOverdue(task));
    case 'Tất cả':
    default:
      return tasks;
  }
};

/**
 * Tìm kiếm công việc theo tên:
 * - Không phân biệt chữ hoa/thường
 * - Không phân biệt dấu tiếng Việt (gõ không dấu vẫn tìm thấy từ có dấu)
 */
export const searchTasksByTitle = (
  tasks: Task[],
  searchQuery: string
): Task[] => {
  if (!searchQuery || searchQuery.trim().length === 0) {
    return tasks;
  }
  const cleanQuery = removeVietnameseTones(searchQuery);
  return tasks.filter(task => {
    const cleanTitle = removeVietnameseTones(task.title);
    return cleanTitle.includes(cleanQuery);
  });
};

/**
 * Sắp xếp danh sách công việc:
 * - 'dueDate': Hạn hoàn thành gần nhất lên đầu (nếu trùng hạn thì ưu tiên Cao -> Thấp)
 * - 'priority': Mức ưu tiên Cao -> Trung bình -> Thấp (nếu trùng ưu tiên thì hạn gần nhất lên đầu)
 * Luôn sao chép mảng trước khi sắp xếp để đảm bảo tính bất biến
 */
export const sortTasks = (
  tasks: Task[],
  sortBy: SortOption = 'dueDate'
): Task[] => {
  return [...tasks].sort((a, b) => {
    const priorityA = PRIORITY_ORDER[a.priority] ?? 99;
    const priorityB = PRIORITY_ORDER[b.priority] ?? 99;

    const dateA = parseDate(a.dueDate);
    const dateB = parseDate(b.dueDate);

    const compareDate = () => {
      if (!dateA && !dateB) return 0;
      if (!dateA) return 1;
      if (!dateB) return -1;
      return dateA.getTime() - dateB.getTime();
    };

    const comparePriority = () => {
      return priorityA - priorityB;
    };

    if (sortBy === 'dueDate') {
      const dateDiff = compareDate();
      if (dateDiff !== 0) {
        return dateDiff;
      }
      return comparePriority();
    } else {
      // sortBy === 'priority'
      const priorityDiff = comparePriority();
      if (priorityDiff !== 0) {
        return priorityDiff;
      }
      return compareDate();
    }
  });
};

/**
 * Áp dụng lọc trạng thái, tìm kiếm và sắp xếp kết quả đồng thời
 */
export const processTasks = (
  tasks: Task[],
  filter: FilterType,
  searchQuery: string,
  sortBy: SortOption = 'dueDate'
): Task[] => {
  const filtered = filterTasksByStatus(tasks, filter);
  const searched = searchTasksByTitle(filtered, searchQuery);
  return sortTasks(searched, sortBy);
};

/**
 * Đếm số lượng công việc cho từng nhóm bộ lọc
 */
export const getTaskFilterCounts = (
  tasks: Task[]
): Record<FilterType, number> => {
  let pending = 0;
  let completed = 0;
  let overdue = 0;

  tasks.forEach(task => {
    if (task.done) {
      completed++;
    } else if (isOverdue(task)) {
      overdue++;
    } else {
      pending++;
    }
  });

  return {
    'Tất cả': tasks.length,
    'Chưa xong': pending,
    'Đã xong': completed,
    'Quá hạn': overdue,
  };
};

/**
 * Tính tiến độ hoàn thành
 */
export const getTaskProgress = (tasks: Task[]) => {
  const total = tasks.length;
  const completed = tasks.filter(t => t.done).length;
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

  return {
    total,
    completed,
    percentage,
  };
};
