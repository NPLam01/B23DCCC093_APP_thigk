import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Alert,
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useTasks } from '../context/TaskContext';
import { Category, Priority, CATEGORIES, PRIORITIES } from '../types/task';
import FormField from '../components/FormField';
import ChoiceGroup from '../components/ChoiceGroup';
import colors from '../theme/colors';
import { validateTaskForm, FormErrors } from '../utils/validators';
import { formatDateToString, getTodayMidnight } from '../utils/dateUtils';

type TaskFormScreenRouteProp = RouteProp<RootStackParamList, 'TaskForm'>;
type TaskFormScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'TaskForm'
>;

interface TaskFormScreenProps {
  route: TaskFormScreenRouteProp;
  navigation: TaskFormScreenNavigationProp;
}

export const TaskFormScreen: React.FC<TaskFormScreenProps> = ({
  route,
  navigation,
}) => {
  const taskId = route.params?.taskId;
  const isEditing = Boolean(taskId);

  const { getTaskById, addTask, updateTask } = useTasks();

  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [category, setCategory] = useState<Category>('Công việc');
  const [priority, setPriority] = useState<Priority>('Trung bình');
  const [dueDate, setDueDate] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Khởi tạo ngày hôm nay dạng dd/mm/yyyy cho việc thêm mới
  useEffect(() => {
    if (isEditing && taskId) {
      const existing = getTaskById(taskId);
      if (existing) {
        setTitle(existing.title);
        setNote(existing.note || '');
        setCategory(existing.category);
        setPriority(existing.priority);
        setDueDate(existing.dueDate);
      } else {
        Alert.alert('Lỗi', 'Không tìm thấy công việc cần sửa', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      }
    } else {
      // Mặc định ngày hôm nay khi thêm mới
      const todayStr = formatDateToString(getTodayMidnight());
      setDueDate(todayStr);
    }
  }, [isEditing, taskId, getTaskById, navigation]);

  // Cập nhật tiêu đề trang
  useEffect(() => {
    navigation.setOptions({
      title: isEditing ? 'Chỉnh sửa công việc' : 'Thêm công việc mới',
    });
  }, [navigation, isEditing]);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (errors.title) {
      setErrors(prev => ({ ...prev, title: undefined }));
    }
  };

  const handleDueDateChange = (val: string) => {
    setDueDate(val);
    if (errors.dueDate) {
      setErrors(prev => ({ ...prev, dueDate: undefined }));
    }
  };

  const handleSubmit = async () => {
    const formErrors = validateTaskForm(
      {
        title,
        dueDate,
        category,
        priority,
      },
      !isEditing // isNew check: khi thêm mới thì hạn không được trước hôm nay
    );

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEditing && taskId) {
        const existing = getTaskById(taskId);
        await updateTask({
          id: taskId,
          title: title.trim(),
          note: note.trim(),
          category,
          priority,
          dueDate: dueDate.trim(),
          done: existing ? existing.done : false,
        });
      } else {
        await addTask({
          title: title.trim(),
          note: note.trim(),
          category,
          priority,
          dueDate: dueDate.trim(),
          done: false,
        });
      }

      navigation.goBack();
    } catch {
      Alert.alert('Lỗi', 'Đã xảy ra lỗi khi lưu công việc. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled">
        {/* Form Card */}
        <View style={styles.card}>
          <Text style={styles.cardHeader}>
            {isEditing ? 'Thông tin cần cập nhật' : 'Nhập thông tin công việc'}
          </Text>

          {/* Tiêu đề */}
          <FormField
            label="Tiêu đề công việc"
            value={title}
            onChangeText={handleTitleChange}
            placeholder="Ví dụ: Ôn tập React Native..."
            error={errors.title}
            maxLength={50}
            showCharCount
            required
          />

          {/* Ghi chú */}
          <FormField
            label="Ghi chú chi tiết"
            value={note}
            onChangeText={setNote}
            placeholder="Mô tả cụ thể hoặc các bước thực hiện..."
            multiline
            numberOfLines={3}
            hint="Không bắt buộc"
          />

          {/* Danh mục */}
          <ChoiceGroup
            label="Danh mục công việc"
            options={CATEGORIES}
            selected={category}
            onSelect={val => setCategory(val as Category)}
            variant="category"
            error={errors.category}
            required
          />

          {/* Mức ưu tiên */}
          <ChoiceGroup
            label="Mức độ ưu tiên"
            options={PRIORITIES}
            selected={priority}
            onSelect={val => setPriority(val as Priority)}
            variant="priority"
            error={errors.priority}
            required
          />

          {/* Hạn chót */}
          <FormField
            label="Hạn hoàn thành (dd/mm/yyyy)"
            value={dueDate}
            onChangeText={handleDueDateChange}
            placeholder="30/10/2026"
            error={errors.dueDate}
            keyboardType="numbers-and-punctuation"
            maxLength={10}
            required
            hint={
              isEditing
                ? 'Định dạng ngày/tháng/năm'
                : 'Định dạng ngày/tháng/năm (không được trước ngày hôm nay)'
            }
          />
        </View>

        {/* Submit & Cancel Buttons */}
        <View style={styles.btnRow}>
          <Pressable
            style={({ pressed }) => [
              styles.cancelBtn,
              pressed && styles.btnPressed,
            ]}
            onPress={() => navigation.goBack()}>
            <Text style={styles.cancelBtnText}>Hủy bỏ</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.submitBtn,
              isSubmitting && styles.submitBtnDisabled,
              pressed && styles.btnPressed,
            ]}
            disabled={isSubmitting}
            onPress={handleSubmit}>
            <Text style={styles.submitBtnText}>
              {isSubmitting
                ? 'Đang lưu...'
                : isEditing
                ? '✓ Lưu thay đổi'
                : '+ Tạo công việc'}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  cardHeader: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  btnRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.borderDark,
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  submitBtn: {
    flex: 2,
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
  },
  submitBtnDisabled: {
    opacity: 0.6,
  },
  submitBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textInverse,
  },
  btnPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },
});

export default TaskFormScreen;
