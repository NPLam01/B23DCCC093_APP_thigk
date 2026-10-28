import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Alert,
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useTasks } from '../context/TaskContext';
import colors from '../theme/colors';
import { isOverdue, getDaysRemaining } from '../utils/dateUtils';

type TaskDetailScreenRouteProp = RouteProp<RootStackParamList, 'TaskDetail'>;
type TaskDetailScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'TaskDetail'
>;

interface TaskDetailScreenProps {
  route: TaskDetailScreenRouteProp;
  navigation: TaskDetailScreenNavigationProp;
}

export const TaskDetailScreen: React.FC<TaskDetailScreenProps> = ({
  route,
  navigation,
}) => {
  const { taskId } = route.params;
  const { getTaskById, toggleTaskStatus, deleteTask } = useTasks();

  const task = getTaskById(taskId);

  if (!task) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.notFoundIcon}>⚠️</Text>
        <Text style={styles.notFoundText}>Công việc không tồn tại hoặc đã bị xóa.</Text>
        <Pressable
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Quay lại danh sách</Text>
        </Pressable>
      </View>
    );
  }

  const overdue = isOverdue(task);
  const remainingInfo = getDaysRemaining(task);
  const priorityStyle = colors.priority[task.priority] || colors.priority.Thấp;
  const categoryStyle = colors.category[task.category] || colors.category['Công việc'];

  const handleDelete = () => {
    Alert.alert(
      'Xác nhận xóa',
      `Bạn có chắc muốn xóa "${task.title}" không?`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            await deleteTask(task.id);
            navigation.goBack();
          },
        },
      ]
    );
  };

  const handleEdit = () => {
    navigation.navigate('TaskForm', { taskId: task.id });
  };

  const handleToggle = async () => {
    await toggleTaskStatus(task.id);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Status Banner */}
      {overdue && (
        <View style={styles.overdueBanner}>
          <Text style={styles.overdueBannerIcon}>⚠️</Text>
          <View style={styles.overdueBannerContent}>
            <Text style={styles.overdueBannerTitle}>Công việc đã quá hạn</Text>
            <Text style={styles.overdueBannerSub}>{remainingInfo.label}</Text>
          </View>
        </View>
      )}

      {task.done && (
        <View style={styles.completedBanner}>
          <Text style={styles.completedBannerIcon}>✅</Text>
          <View style={styles.completedBannerContent}>
            <Text style={styles.completedBannerTitle}>Đã hoàn thành</Text>
            <Text style={styles.completedBannerSub}>Công việc này đã được giải quyết xong</Text>
          </View>
        </View>
      )}

      {/* Main Detail Card */}
      <View style={styles.card}>
        {/* Badges Row */}
        <View style={styles.badgesRow}>
          <View
            style={[
              styles.categoryBadge,
              { backgroundColor: categoryStyle.background },
            ]}>
            <Text style={[styles.categoryText, { color: categoryStyle.color }]}>
              {task.category}
            </Text>
          </View>

          <View
            style={[
              styles.priorityBadge,
              {
                backgroundColor: priorityStyle.background,
                borderColor: priorityStyle.border,
              },
            ]}>
            <Text style={[styles.priorityText, { color: priorityStyle.color }]}>
              Ưu tiên {task.priority}
            </Text>
          </View>

          {overdue && (
            <View style={styles.overdueBadge}>
              <Text style={styles.overdueText}>Quá hạn</Text>
            </View>
          )}
        </View>

        {/* Title */}
        <Text
          style={[
            styles.title,
            task.done && styles.titleCompleted,
          ]}>
          {task.title}
        </Text>

        {/* Note section */}
        <View style={styles.divider} />
        <Text style={styles.sectionHeading}>Ghi chú chi tiết</Text>
        <Text style={styles.noteContent}>
          {task.note && task.note.trim().length > 0
            ? task.note
            : 'Không có ghi chú thêm cho công việc này.'}
        </Text>

        {/* Metadata info grid */}
        <View style={styles.divider} />
        <View style={styles.metaRow}>
          <View style={styles.metaCol}>
            <Text style={styles.metaLabel}>Hạn hoàn thành</Text>
            <Text style={styles.metaValue}>📅 {task.dueDate}</Text>
          </View>

          <View style={styles.metaCol}>
            <Text style={styles.metaLabel}>Tình trạng thời hạn</Text>
            <Text
              style={[
                styles.metaValue,
                overdue && styles.metaValueOverdue,
                task.done && styles.metaValueDone,
              ]}>
              {task.done ? 'Đã xong' : remainingInfo.label}
            </Text>
          </View>
        </View>

        <View style={styles.metaRow}>
          <View style={styles.metaCol}>
            <Text style={styles.metaLabel}>Trạng thái</Text>
            <Text
              style={[
                styles.metaValue,
                task.done ? styles.metaValueDone : styles.metaValuePending,
              ]}>
              {task.done ? '✓ Đã hoàn thành' : '⏳ Chưa hoàn thành'}
            </Text>
          </View>

          <View style={styles.metaCol}>
            <Text style={styles.metaLabel}>Mã định danh</Text>
            <Text style={styles.metaValueSub}>{task.id}</Text>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionContainer}>
        {/* Toggle Done Button */}
        <Pressable
          style={({ pressed }) => [
            styles.btnToggle,
            task.done ? styles.btnToggleDone : styles.btnTogglePending,
            pressed && styles.btnPressed,
          ]}
          onPress={handleToggle}>
          <Text style={styles.btnToggleText}>
            {task.done ? '↩️ Đánh dấu Chưa hoàn thành' : '✓ Đánh dấu Hoàn thành'}
          </Text>
        </Pressable>

        {/* Edit Button */}
        <Pressable
          style={({ pressed }) => [
            styles.btnEdit,
            pressed && styles.btnPressed,
          ]}
          onPress={handleEdit}>
          <Text style={styles.btnEditText}>✏️ Sửa công việc</Text>
        </Pressable>

        {/* Delete Button */}
        <Pressable
          style={({ pressed }) => [
            styles.btnDelete,
            pressed && styles.btnPressed,
          ]}
          onPress={handleDelete}>
          <Text style={styles.btnDeleteText}>🗑️ Xóa công việc</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: colors.background,
  },
  notFoundIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  notFoundText: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 18,
  },
  backButton: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  backButtonText: {
    color: colors.textInverse,
    fontWeight: '700',
  },
  overdueBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.dangerLight,
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
  },
  overdueBannerIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  overdueBannerContent: {
    flex: 1,
  },
  overdueBannerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.danger,
  },
  overdueBannerSub: {
    fontSize: 12.5,
    color: '#991B1B',
    marginTop: 1,
  },
  completedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    borderWidth: 1,
    borderColor: '#86EFAC',
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
  },
  completedBannerIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  completedBannerContent: {
    flex: 1,
  },
  completedBannerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.success,
  },
  completedBannerSub: {
    fontSize: 12.5,
    color: '#166534',
    marginTop: 1,
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
  badgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  priorityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
  },
  priorityText: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  overdueBadge: {
    backgroundColor: colors.dangerLight,
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  overdueText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.danger,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
    textDecorationColor: '#64748B',
    color: colors.textSecondary,
    fontWeight: '600',
    opacity: 0.7,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 14,
  },
  sectionHeading: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  noteContent: {
    fontSize: 15,
    color: colors.textPrimary,
    lineHeight: 22,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  metaCol: {
    flex: 1,
  },
  metaLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  metaValue: {
    fontSize: 14.5,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  metaValueOverdue: {
    color: colors.danger,
  },
  metaValueDone: {
    color: colors.success,
  },
  metaValuePending: {
    color: colors.primary,
  },
  metaValueSub: {
    fontSize: 12.5,
    color: colors.textMuted,
    fontFamily: 'monospace',
  },
  actionContainer: {
    marginTop: 20,
    gap: 12,
  },
  btnToggle: {
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnTogglePending: {
    backgroundColor: colors.success,
  },
  btnToggleDone: {
    backgroundColor: '#64748B',
  },
  btnToggleText: {
    color: colors.textInverse,
    fontSize: 15,
    fontWeight: '700',
  },
  btnEdit: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.primary,
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnEditText: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: '700',
  },
  btnDelete: {
    backgroundColor: '#FFF5F5',
    borderWidth: 1.5,
    borderColor: '#FECACA',
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnDeleteText: {
    color: colors.danger,
    fontSize: 15,
    fontWeight: '700',
  },
  btnPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.99 }],
  },
});

export default TaskDetailScreen;
