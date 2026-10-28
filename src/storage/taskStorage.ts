import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task } from '../types/task';

export const STORAGE_KEY = '@planner_tasks';

/**
 * Danh sách 6 công việc mẫu cho lần chạy đầu tiên
 * Bao gồm ít nhất 1 việc hoàn thành và 1 việc quá hạn
 */
export const INITIAL_SAMPLE_TASKS: Task[] = [
  {
    id: 'task_001',
    title: 'Nộp báo cáo giữa kỳ React Native',
    note: 'Hoàn thiện file word báo cáo kiến trúc và slide trình chiếu',
    category: 'Học tập',
    priority: 'Cao',
    dueDate: '20/10/2026', // Quá hạn
    done: false,
  },
  {
    id: 'task_002',
    title: 'Cài đặt môi trường React Native CLI',
    note: 'Cài đặt Node.js, JDK, Android Studio và cấu hình biến môi trường',
    category: 'Học tập',
    priority: 'Cao',
    dueDate: '25/10/2026',
    done: true, // Đã hoàn thành
  },
  {
    id: 'task_003',
    title: 'Ôn tập React Navigation & Context API',
    note: 'Thực hành Stack Navigator, truyền param và quản lý global state',
    category: 'Học tập',
    priority: 'Cao',
    dueDate: '30/10/2026',
    done: false,
  },
  {
    id: 'task_004',
    title: 'Họp nhóm thiết kế giao diện Figma',
    note: 'Thống nhất bảng màu, typography và danh mục component',
    category: 'Công việc',
    priority: 'Trung bình',
    dueDate: '02/11/2026',
    done: false,
  },
  {
    id: 'task_005',
    title: 'Chạy bộ 5km công viên',
    note: 'Duy trì rèn luyện sức bền và thể lực mỗi sáng',
    category: 'Sức khoẻ',
    priority: 'Thấp',
    dueDate: '05/11/2026',
    done: false,
  },
  {
    id: 'task_006',
    title: 'Mua sách Clean Code & Refactoring',
    note: 'Đọc bổ sung kiến thức viết mã nguồn sạch và chuẩn mực',
    category: 'Cá nhân',
    priority: 'Trung bình',
    dueDate: '10/11/2026',
    done: false,
  },
];

/**
 * Đọc dữ liệu công việc từ AsyncStorage.
 * Nếu chưa có dữ liệu lưu, khởi tạo với danh sách mẫu.
 */
export const loadTasksFromStorage = async (): Promise<Task[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    if (jsonValue != null) {
      const parsed = JSON.parse(jsonValue);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
    // Lần đầu tiên: lưu danh sách mẫu và trả về
    await saveTasksToStorage(INITIAL_SAMPLE_TASKS);
    return INITIAL_SAMPLE_TASKS;
  } catch (error) {
    console.error('Lỗi khi đọc dữ liệu từ AsyncStorage:', error);
    return INITIAL_SAMPLE_TASKS;
  }
};

/**
 * Ghi dữ liệu công việc vào AsyncStorage
 */
export const saveTasksToStorage = async (tasks: Task[]): Promise<boolean> => {
  try {
    const jsonValue = JSON.stringify(tasks);
    await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
    return true;
  } catch (error) {
    console.error('Lỗi khi ghi dữ liệu vào AsyncStorage:', error);
    return false;
  }
};
