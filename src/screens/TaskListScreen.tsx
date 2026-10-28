import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTasks } from '../context/TaskContext';
import { Task, FilterType, SortOption } from '../types/task';
import { RootStackParamList } from '../navigation/AppNavigator';
import TaskCard from '../components/TaskCard';
import ProgressBar from '../components/ProgressBar';
import FilterBar from '../components/FilterBar';
import colors from '../theme/colors';
import {
  processTasks,
  getTaskFilterCounts,
  getTaskProgress,
} from '../utils/taskUtils';

type TaskListScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'TaskList'
>;

interface TaskListScreenProps {
  navigation: TaskListScreenNavigationProp;
}

export const TaskListScreen: React.FC<TaskListScreenProps> = ({ navigation }) => {
  const {
    tasks,
    isLoading,
    toggleTaskStatus,
    deleteTask,
    deleteCompletedTasks,
  } = useTasks();

  const [currentFilter, setCurrentFilter] = useState<FilterType>('Tất cả');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortOption>('dueDate');

  // Lọc, tìm kiếm và sắp xếp kết quả hoạt động đồng thời
  const processedList = useMemo(() => {
    return processTasks(tasks, currentFilter, searchQuery, sortBy);
  }, [tasks, currentFilter, searchQuery, sortBy]);

  // Đếm số lượng công việc theo bộ lọc
  const filterCounts = useMemo(() => {
    return getTaskFilterCounts(tasks);
  }, [tasks]);

  // Tiến độ công việc
  const progress = useMemo(() => {
    return getTaskProgress(tasks);
  }, [tasks]);

  const completedCount = filterCounts['Đã xong'];

  // Xác nhận xóa tất cả việc đã hoàn thành theo mục 8 trong README
  const handleConfirmDeleteCompleted = () => {
    if (completedCount === 0) return;

    Alert.alert(
      'Xác nhận xóa',
      `Bạn sẽ xóa ${completedCount} công việc đã hoàn thành.`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa tất cả',
          style: 'destructive',
          onPress: async () => {
            await deleteCompletedTasks();
          },
        },
      ]
    );
  };

  const handleTaskPress = (task: Task) => {
    navigation.navigate('TaskDetail', { taskId: task.id });
  };

  const handleAddNewTask = () => {
    navigation.navigate('TaskForm', {});
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Đang tải danh sách công việc...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header Bar */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Planner App</Text>
          <Text style={styles.headerSubtitle}>Quản lý công việc thông minh</Text>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.addButton,
            pressed && styles.addButtonPressed,
          ]}
          onPress={handleAddNewTask}>
          <Text style={styles.addButtonIcon}>+</Text>
          <Text style={styles.addButtonText}>Thêm việc</Text>
        </Pressable>
      </View>

      {/* Search Input Bar (tìm kiếm không phân biệt hoa/thường) */}
      <View style={styles.searchWrapper}>
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm theo tên công việc..."
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            clearButtonMode="while-editing"
          />
          {searchQuery.length > 0 && (
            <Pressable
              style={styles.clearSearchButton}
              onPress={() => setSearchQuery('')}>
              <Text style={styles.clearSearchText}>✕</Text>
            </Pressable>
          )}
        </View>
      </View>

      {/* Tiến độ công việc */}
      <ProgressBar completed={progress.completed} total={progress.total} />

      {/* Bộ lọc 4 trạng thái */}
      <FilterBar
        currentFilter={currentFilter}
        onSelectFilter={setCurrentFilter}
        counts={filterCounts}
      />

      {/* Nút chuyển đổi sắp xếp (Hạn chót gần nhất hoặc Mức ưu tiên) */}
      <View style={styles.sortWrapper}>
        <Text style={styles.sortLabel}>Sắp xếp theo:</Text>
        <View style={styles.sortTabs}>
          <Pressable
            style={({ pressed }) => [
              styles.sortTab,
              sortBy === 'dueDate' && styles.sortTabActive,
              pressed && styles.sortTabPressed,
            ]}
            onPress={() => setSortBy('dueDate')}>
            <Text
              style={[
                styles.sortTabText,
                sortBy === 'dueDate' && styles.sortTabTextActive,
              ]}>
              📅 Hạn gần nhất
            </Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.sortTab,
              sortBy === 'priority' && styles.sortTabActive,
              pressed && styles.sortTabPressed,
            ]}
            onPress={() => setSortBy('priority')}>
            <Text
              style={[
                styles.sortTabText,
                sortBy === 'priority' && styles.sortTabTextActive,
              ]}>
              ⚡ Ưu tiên (Cao → Thấp)
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Action Bar: Tổng số & Xóa việc đã hoàn thành */}
      <View style={styles.actionBar}>
        <Text style={styles.listSummaryText}>
          {processedList.length} công việc
          {searchQuery ? ` khớp với "${searchQuery}"` : ''}
        </Text>

        <Pressable
          style={({ pressed }) => [
            styles.deleteCompletedButton,
            completedCount === 0 && styles.deleteCompletedDisabled,
            pressed && completedCount > 0 && styles.deleteCompletedPressed,
          ]}
          disabled={completedCount === 0}
          onPress={handleConfirmDeleteCompleted}>
          <Text
            style={[
              styles.deleteCompletedText,
              completedCount === 0 && styles.deleteCompletedTextDisabled,
            ]}>
            🧹 Xóa việc đã xong ({completedCount})
          </Text>
        </Pressable>
      </View>

      {/* Hướng dẫn thao tác */}
      <View style={styles.hintContainer}>
        <Text style={styles.hintText}>
          💡 Nhấn để xem chi tiết • Nhấn giữ dòng để xóa
        </Text>
      </View>

      {/* Danh sách FlatList */}
      <FlatList
        data={processedList}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TaskCard
            task={item}
            onPress={() => handleTaskPress(item)}
            onToggleDone={() => toggleTaskStatus(item.id)}
            onDelete={taskId => deleteTask(taskId)}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📝</Text>
            <Text style={styles.emptyTitle}>Không có công việc nào</Text>
            <Text style={styles.emptyDescription}>
              {searchQuery
                ? `Không tìm thấy công việc nào phù hợp với từ khóa "${searchQuery}".`
                : currentFilter !== 'Tất cả'
                ? `Không có công việc nào trong mục "${currentFilter}".`
                : 'Hãy bắt đầu ngày mới bằng việc thêm công việc đầu tiên của bạn!'}
            </Text>
            {searchQuery ? (
              <Pressable
                style={styles.emptyActionButton}
                onPress={() => setSearchQuery('')}>
                <Text style={styles.emptyActionText}>Xóa tìm kiếm</Text>
              </Pressable>
            ) : (
              <Pressable
                style={styles.emptyActionButton}
                onPress={handleAddNewTask}>
                <Text style={styles.emptyActionText}>+ Thêm công việc mới</Text>
              </Pressable>
            )}
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: colors.background,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 12.5,
    color: colors.textSecondary,
    marginTop: 1,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 22,
    elevation: 2,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
  },
  addButtonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  addButtonIcon: {
    color: colors.textInverse,
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 4,
    lineHeight: 18,
  },
  addButtonText: {
    color: colors.textInverse,
    fontSize: 13.5,
    fontWeight: '700',
  },
  searchWrapper: {
    paddingHorizontal: 16,
    marginVertical: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1.2,
    borderColor: colors.border,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.textPrimary,
    paddingVertical: 0,
  },
  clearSearchButton: {
    padding: 4,
  },
  clearSearchText: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: 'bold',
  },
  sortWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginVertical: 4,
    gap: 8,
  },
  sortLabel: {
    fontSize: 12.5,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  sortTabs: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#EEF2F6',
    borderRadius: 10,
    padding: 3,
    gap: 4,
  },
  sortTab: {
    flex: 1,
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  sortTabActive: {
    backgroundColor: colors.surface,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  sortTabPressed: {
    opacity: 0.75,
  },
  sortTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  sortTabTextActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  listSummaryText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  deleteCompletedButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  deleteCompletedDisabled: {
    backgroundColor: '#F1F5F9',
    borderColor: '#E2E8F0',
    opacity: 0.6,
  },
  deleteCompletedPressed: {
    opacity: 0.7,
  },
  deleteCompletedText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.danger,
  },
  deleteCompletedTextDisabled: {
    color: colors.textMuted,
  },
  hintContainer: {
    paddingHorizontal: 16,
    paddingBottom: 4,
  },
  hintText: {
    fontSize: 11.5,
    color: colors.textMuted,
    fontStyle: 'italic',
  },
  listContent: {
    paddingBottom: 32,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 48,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  emptyDescription: {
    fontSize: 13.5,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 18,
  },
  emptyActionButton: {
    backgroundColor: colors.primaryLight,
    paddingVertical: 9,
    paddingHorizontal: 18,
    borderRadius: 20,
  },
  emptyActionText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: colors.primaryDark,
  },
});

export default TaskListScreen;
