import {
  parseDate,
  isValidDate,
  isOverdue,
  formatDateToString,
} from '../src/utils/dateUtils';
import {
  validateTitle,
  validateDueDate,
  validateTaskForm,
} from '../src/utils/validators';
import {
  filterTasksByStatus,
  searchTasksByTitle,
  sortTasks,
  processTasks,
  removeVietnameseTones,
} from '../src/utils/taskUtils';
import { Task } from '../src/types/task';

describe('dateUtils', () => {
  it('parses dd/mm/yyyy correctly', () => {
    const d = parseDate('25/12/2026');
    expect(d).not.toBeNull();
    expect(d?.getDate()).toBe(25);
    expect(d?.getMonth()).toBe(11); // 0-indexed December
    expect(d?.getFullYear()).toBe(2026);
  });

  it('rejects invalid real dates like 31/02/2026', () => {
    expect(isValidDate('31/02/2026')).toBe(false);
    expect(isValidDate('29/02/2025')).toBe(false);
    expect(isValidDate('30/10/2026')).toBe(true);
  });

  it('calculates isOverdue correctly', () => {
    const overdueTask: Task = {
      id: '1',
      title: 'Quá hạn',
      note: '',
      category: 'Học tập',
      priority: 'Cao',
      dueDate: '01/01/2020',
      done: false,
    };
    expect(isOverdue(overdueTask)).toBe(true);

    const completedTask: Task = {
      ...overdueTask,
      done: true,
    };
    expect(isOverdue(completedTask)).toBe(false);
  });

  it('formats Date to dd/mm/yyyy string', () => {
    const date = new Date(2026, 9, 30); // 30 Oct 2026
    expect(formatDateToString(date)).toBe('30/10/2026');
  });
});

describe('validators', () => {
  it('validates title rules (required, max 50 chars)', () => {
    expect(validateTitle('')).not.toBeNull();
    expect(validateTitle('   ')).not.toBeNull();
    expect(validateTitle('a'.repeat(51))).not.toBeNull();
    expect(validateTitle('Học React Native')).toBeNull();
  });

  it('validates dueDate rules', () => {
    expect(validateDueDate('')).not.toBeNull();
    expect(validateDueDate('invalid-date')).not.toBeNull();
    expect(validateDueDate('31/02/2026')).not.toBeNull();
    expect(validateDueDate('01/01/2020', true)).not.toBeNull(); // isNew cannot be past
  });

  it('validates full task form', () => {
    const errors = validateTaskForm({
      title: '',
      dueDate: '31/02/2026',
      category: '',
      priority: '',
    });
    expect(errors.title).toBeDefined();
    expect(errors.dueDate).toBeDefined();
    expect(errors.category).toBeDefined();
    expect(errors.priority).toBeDefined();
  });
});

describe('taskUtils', () => {
  const sampleTasks: Task[] = [
    {
      id: '1',
      title: 'Ôn tập React Native',
      note: '',
      category: 'Học tập',
      priority: 'Thấp',
      dueDate: '01/11/2026',
      done: false,
    },
    {
      id: '2',
      title: 'Nộp báo cáo giữa kỳ',
      note: '',
      category: 'Công việc',
      priority: 'Cao',
      dueDate: '05/11/2026',
      done: false,
    },
    {
      id: '3',
      title: 'Chạy bộ thể dục',
      note: '',
      category: 'Cá nhân',
      priority: 'Trung bình',
      dueDate: '02/11/2026',
      done: true,
    },
  ];

  it('filters by status correctly', () => {
    const completed = filterTasksByStatus(sampleTasks, 'Đã xong');
    expect(completed.length).toBe(1);
    expect(completed[0].id).toBe('3');
  });

  it('searches by title case-insensitively and without Vietnamese diacritics', () => {
    // Nhập không dấu vẫn tìm thấy từ có dấu
    const searched1 = searchTasksByTitle(sampleTasks, 'on tap');
    expect(searched1.length).toBe(1);
    expect(searched1[0].id).toBe('1');

    const searched2 = searchTasksByTitle(sampleTasks, 'bao cao');
    expect(searched2.length).toBe(1);
    expect(searched2[0].id).toBe('2');

    const searched3 = searchTasksByTitle(sampleTasks, 'chay bo');
    expect(searched3.length).toBe(1);
    expect(searched3[0].id).toBe('3');

    // Nhập có dấu hoa thường hỗn hợp
    const searched4 = searchTasksByTitle(sampleTasks, 'BÁO CÁO');
    expect(searched4.length).toBe(1);
    expect(searched4[0].id).toBe('2');
  });

  it('removes Vietnamese tones correctly', () => {
    expect(removeVietnameseTones('Ôn tập React')).toBe('on tap react');
    expect(removeVietnameseTones('Đã hoàn thành')).toBe('da hoan thanh');
    expect(removeVietnameseTones('Sức khoẻ & Cá nhân')).toBe('suc khoe & ca nhan');
  });

  it('sorts tasks by priority (Cao -> Trung bình -> Thấp)', () => {
    const sorted = sortTasks(sampleTasks, 'priority');
    expect(sorted[0].priority).toBe('Cao');
    expect(sorted[1].priority).toBe('Trung bình');
    expect(sorted[2].priority).toBe('Thấp');
  });

  it('sorts tasks by due date (gần nhất lên đầu)', () => {
    const sorted = sortTasks(sampleTasks, 'dueDate');
    expect(sorted[0].id).toBe('1'); // 01/11/2026
    expect(sorted[1].id).toBe('3'); // 02/11/2026
    expect(sorted[2].id).toBe('2'); // 05/11/2026
  });

  it('applies filter, search, and sort simultaneously', () => {
    const result = processTasks(sampleTasks, 'Tất cả', 'bao cao', 'dueDate');
    expect(result.length).toBe(1);
    expect(result[0].id).toBe('2');
  });
});
