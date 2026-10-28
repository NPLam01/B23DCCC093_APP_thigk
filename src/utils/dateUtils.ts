/**
 * Date utility functions for PlannerApp
 */

export interface DaysRemainingInfo {
  days: number;
  isOverdue: boolean;
  label: string;
}

/**
 * Chuyển dd/mm/yyyy thành Date object với giờ/phút/giây đặt về 0 để so sánh lịch
 */
export const parseDate = (dateString: string): Date | null => {
  if (!dateString || typeof dateString !== 'string') {
    return null;
  }

  const parts = dateString.trim().split('/');
  if (parts.length !== 3) {
    return null;
  }

  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const year = parseInt(parts[2], 10);

  if (isNaN(day) || isNaN(month) || isNaN(year)) {
    return null;
  }

  const date = new Date(year, month - 1, day, 0, 0, 0, 0);

  // Kiểm tra tính hợp lệ thật (ví dụ 31/02/2026 sẽ bị tự động nhảy sang tháng 3)
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
};

/**
 * Kiểm tra định dạng dd/mm/yyyy và ngày có thật trên lịch
 * Ví dụ 31/02/2026 sẽ trả về false
 */
export const isValidDate = (dateString: string): boolean => {
  if (!dateString || typeof dateString !== 'string') {
    return false;
  }

  const regex = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
  if (!regex.test(dateString.trim())) {
    return false;
  }

  return parseDate(dateString) !== null;
};

/**
 * Trả về ngày hôm nay không có giờ phút giây (00:00:00:000)
 */
export const getTodayMidnight = (): Date => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

/**
 * Kiểm tra xem công việc có bị quá hạn hay không
 * Điều kiện: task chưa hoàn thành và hạn trước ngày hiện tại
 */
export const isOverdue = (task: { dueDate: string; done: boolean }): boolean => {
  if (task.done) {
    return false;
  }

  const taskDate = parseDate(task.dueDate);
  if (!taskDate) {
    return false;
  }

  const today = getTodayMidnight();
  return taskDate.getTime() < today.getTime();
};

/**
 * Tính số ngày còn lại hoặc số ngày quá hạn
 */
export const getDaysRemaining = (task: {
  dueDate: string;
  done?: boolean;
}): DaysRemainingInfo => {
  const taskDate = parseDate(task.dueDate);
  if (!taskDate) {
    return { days: 0, isOverdue: false, label: 'Ngày không hợp lệ' };
  }

  const today = getTodayMidnight();
  const diffTime = taskDate.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    const overdueCount = Math.abs(diffDays);
    return {
      days: overdueCount,
      isOverdue: true,
      label: `Quá hạn ${overdueCount} ngày`,
    };
  }

  if (diffDays === 0) {
    return {
      days: 0,
      isOverdue: false,
      label: 'Hạn chót hôm nay',
    };
  }

  if (diffDays === 1) {
    return {
      days: 1,
      isOverdue: false,
      label: 'Còn 1 ngày (Ngày mai)',
    };
  }

  return {
    days: diffDays,
    isOverdue: false,
    label: `Còn ${diffDays} ngày`,
  };
};

/**
 * Kiểm tra xem ngày có trước ngày hôm nay không (dùng khi thêm mới)
 */
export const isDateBeforeToday = (dateString: string): boolean => {
  const date = parseDate(dateString);
  if (!date) {
    return false;
  }
  const today = getTodayMidnight();
  return date.getTime() < today.getTime();
};

/**
 * Định dạng Date object thành chuỗi dd/mm/yyyy
 */
export const formatDateToString = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};
