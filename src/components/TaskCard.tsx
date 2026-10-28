import React from 'react';
import { View, Text, Pressable, StyleSheet, Alert } from 'react-native';
import { Task } from '../types/task';
import colors from '../theme/colors';
import { isOverdue, getDaysRemaining } from '../utils/dateUtils';

interface TaskCardProps {
  task: Task;
  onPress: () => void;
  onToggleDone: () => void;
  onDelete: (taskId: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onPress,
  onToggleDone,
  onDelete,
}) => {
  const overdue = isOverdue(task);
  const remainingInfo = getDaysRemaining(task);
  const priorityStyle = colors.priority[task.priority] || colors.priority.Thấp;
  const categoryStyle = colors.category[task.category] || colors.category['Công việc'];

  // Nhấn giữ để xóa công việc theo yêu cầu
  const handleLongPress = () => {
    Alert.alert(
      'Xác nhận xóa',
      `Bạn có chắc muốn xóa "${task.title}" không?`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: () => onDelete(task.id),
        },
      ]
    );
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        task.done && styles.cardCompleted,
        overdue && styles.cardOverdue,
        pressed && styles.cardPressed,
      ]}
      onPress={onPress}
      onLongPress={handleLongPress}
      delayLongPress={400}>
      <View style={styles.contentRow}>
        {/* Custom Checkbox */}
        <Pressable
          style={({ pressed }) => [
            styles.checkbox,
            task.done && styles.checkboxChecked,
            pressed && styles.checkboxPressed,
          ]}
          hitSlop={8}
          onPress={onToggleDone}>
          {task.done && <Text style={styles.checkmark}>✓</Text>}
        </Pressable>

        {/* Main Content */}
        <View style={styles.mainInfo}>
          {/* Badges: Category & Priority */}
          <View style={styles.badgeRow}>
            <View
              style={[
                styles.categoryBadge,
                { backgroundColor: categoryStyle.background },
              ]}>
              <Text
                style={[styles.categoryText, { color: categoryStyle.color }]}>
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
              <Text
                style={[styles.priorityText, { color: priorityStyle.color }]}>
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
            ]}
            numberOfLines={2}>
            {task.title}
          </Text>

          {/* Note if exists */}
          {Boolean(task.note) && (
            <Text
              style={[styles.note, task.done && styles.noteCompleted]}
              numberOfLines={1}>
              {task.note}
            </Text>
          )}

          {/* Due date & Days remaining footer */}
          <View style={styles.footerRow}>
            <Text style={styles.dueDateLabel}>
              📅 Hạn: <Text style={styles.dueDateValue}>{task.dueDate}</Text>
            </Text>

            {!task.done && (
              <Text
                style={[
                  styles.remainingText,
                  overdue ? styles.remainingOverdue : styles.remainingNormal,
                ]}>
                • {remainingInfo.label}
              </Text>
            )}

            {task.done && (
              <Text style={styles.completedText}>• Đã xong</Text>
            )}
          </View>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: 14,
    padding: 14,
    marginHorizontal: 16,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  cardCompleted: {
    opacity: 0.65,
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
  },
  cardOverdue: {
    borderColor: '#FECACA',
    backgroundColor: '#FFFDFD',
  },
  cardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.995 }],
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: colors.borderDark,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
    marginRight: 12,
  },
  checkboxChecked: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  checkboxPressed: {
    opacity: 0.7,
  },
  checkmark: {
    color: colors.textInverse,
    fontSize: 14,
    fontWeight: 'bold',
    lineHeight: 16,
  },
  mainInfo: {
    flex: 1,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 6,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
  },
  priorityText: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  overdueBadge: {
    backgroundColor: colors.dangerLight,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  overdueText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.danger,
  },
  title: {
    fontSize: 15.5,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
    textDecorationColor: '#64748B',
    color: '#64748B',
    fontWeight: '500',
  },
  note: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  noteCompleted: {
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
    textDecorationColor: '#94A3B8',
    color: '#94A3B8',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 2,
  },
  dueDateLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  dueDateValue: {
    fontWeight: '600',
    color: colors.textPrimary,
  },
  remainingText: {
    fontSize: 12,
    fontWeight: '600',
  },
  remainingNormal: {
    color: colors.primaryDark,
  },
  remainingOverdue: {
    color: colors.danger,
    fontWeight: '700',
  },
  completedText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.success,
  },
});

export default TaskCard;
