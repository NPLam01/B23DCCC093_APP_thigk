This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

# Getting Started

> **Note**: Make sure you have completed the [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment) guide before proceeding.

## Step 1: Start Metro

First, you will need to run **Metro**, the JavaScript build tool for React Native.

To start the Metro dev server, run the following command from the root of your React Native project:

```sh
# Using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Build and run your app

With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:

### Android

```sh
# Using npm
npm run android

# OR using Yarn
yarn android
```

### iOS

For iOS, remember to install CocoaPods dependencies (this only needs to be run on first clone or after updating native deps).

The first time you create a new project, run the Ruby bundler to install CocoaPods itself:

```sh
bundle install
```

Then, and every time you update your native dependencies, run:

```sh
bundle exec pod install
```

For more information, please visit [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up correctly, you should see your new app running in the Android Emulator, iOS Simulator, or your connected device.

This is one way to run your app — you can also build it directly from Android Studio or Xcode.

## Step 3: Modify your app

Now that you have successfully run the app, let's make changes!

Open `App.tsx` in your text editor of choice and make some changes. When you save, your app will automatically update and reflect these changes — this is powered by [Fast Refresh](https://reactnative.dev/docs/fast-refresh).

When you want to forcefully reload, for example to reset the state of your app, you can perform a full reload:

- **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Dev Menu**, accessed via <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS).
- **iOS**: Press <kbd>R</kbd> in iOS Simulator.

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [docs](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you're having issues getting the above steps to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.

Mục tiêu: xây dựng ứng dụng bằng React Native CLI trong 90 phút, đúng yêu cầu nghiệp vụ, lưu dữ liệu bền vững, giao diện nhất quán và có structure tách màn hình/component.

1. Ràng buộc bắt buộc của đề thi

Chỉ dùng các thư viện được cho phép:

Thư viện

Mục đích

@react-navigation/native

Điều hướng ứng dụng.

@react-navigation/native-stack

Stack Navigation giữa các màn hình.

react-native-screens

Hỗ trợ điều hướng/màn hình.

react-native-safe-area-context

Xử lý vùng an toàn.

@react-native-async-storage/async-storage

Lưu và khôi phục dữ liệu.

react-native-vector-icons

Icon, không bắt buộc.

Không được sử dụng

Thư viện UI dựng sẵn: NativeBase, React Native Paper, UI Kitten, react-native-elements và các bộ UI tương tự.

Không cài thư viện form, date picker hoặc state management bên ngoài danh sách cho phép.


Thành phần React Native có thể dùng

View, Text, TextInput, Pressable, FlatList, ScrollView, Alert, StyleSheet, KeyboardAvoidingView, ActivityIndicator và các hook React như useState, useEffect, useContext, createContext.

Không cần thư viện UI bổ sung: tự dựng card, checkbox, nút chọn, thanh tiến độ, nhãn ưu tiên và validation bằng component gốc.



3. Structure thư mục đề xuất

PlannerApp/
├── android/
├── ios/
├── src/
│   ├── components/
│   │   ├── TaskCard.js
│   │   ├── ProgressBar.js
│   │   ├── FilterBar.js
│   │   ├── ChoiceGroup.js
│   │   └── FormField.js
│   ├── screens/
│   │   ├── TaskListScreen.js
│   │   ├── TaskFormScreen.js
│   │   └── TaskDetailScreen.js
│   ├── navigation/
│   │   └── AppNavigator.js
│   ├── context/
│   │   └── TaskContext.js
│   ├── storage/
│   │   └── taskStorage.js
│   ├── utils/
│   │   ├── dateUtils.js
│   │   ├── taskUtils.js
│   │   └── validators.js
│   └── theme/
│       └── colors.js
├── App.tsx
└── package.json

Ghi chú: App.tsx có thể giữ nguyên từ template. Các file JS có thể được import từ App.tsx; nếu muốn TypeScript hoàn toàn, đổi đuôi thành .tsx/.ts và khai báo kiểu tương ứng.

4. Vai trò của từng file

File

Nhiệm vụ

TaskListScreen.js

FlatList, tiến độ, lọc, tìm kiếm, sắp xếp, xóa hàng loạt.

TaskFormScreen.js

Form dùng chung cho thêm/sửa; lỗi hiển thị dưới ô nhập.

TaskDetailScreen.js

Thông tin chi tiết, số ngày còn lại, sửa và đổi trạng thái.

TaskCard.js

Card công việc, checkbox, màu ưu tiên, nhãn quá hạn.

ProgressBar.js

Thanh tiến độ tự vẽ bằng View.

FilterBar.js

Bốn nút lọc: Tất cả / Chưa xong / Đã xong / Quá hạn.

ChoiceGroup.js

Nút tự dựng để chọn danh mục và mức ưu tiên.

FormField.js

Ô nhập có nhãn, lỗi và viền đỏ khi dữ liệu sai.

TaskContext.js

State chung và thao tác thêm/sửa/xóa/hoàn thành.

taskStorage.js

Đọc/ghi dữ liệu qua AsyncStorage.

dateUtils.js

Kiểm tra ngày thật, quá hạn và số ngày còn lại.

validators.js

Kiểm tra tên bắt buộc, tối đa 50 ký tự và hạn.

taskUtils.js

Lọc, tìm kiếm và sắp xếp công việc.

colors.js

Bảng màu và màu ưu tiên dùng chung.

AppNavigator.js

Khai báo Stack Navigation.


6. Model dữ liệu

{
  id: 'task_001',
  title: 'Ôn tập React Native',
  note: 'Ôn FlatList và Navigation',
  category: 'Học tập',
  priority: 'Cao',
  dueDate: '30/10/2026',
  done: false,
}

Danh mục hợp lệ: Học tập, Công việc, Sức khoẻ, Cá nhân.

Mức ưu tiên: Cao, Trung bình, Thấp. Màu tương ứng: đỏ, vàng, xanh.

Bộ lọc: Tất cả, Chưa xong, Đã xong, Quá hạn.

Lần chạy đầu tiên phải có ít nhất 6 công việc mẫu, bao gồm ít nhất 1 việc đã hoàn thành và 1 việc quá hạn.

7. Luồng Navigation và quản lý state

TaskListScreen → “+ Thêm việc” → TaskFormScreen ở chế độ thêm.

TaskListScreen → nhấn card → TaskDetailScreen, truyền taskId.

TaskDetailScreen → “Sửa” → TaskFormScreen, truyền taskId.

Lưu thành công → quay lại màn hình trước; danh sách lấy state mới từ TaskContext.

TaskContext là nguồn state chung; taskStorage chỉ phụ trách đọc/ghi AsyncStorage.

8. Quy tắc xác nhận xóa bằng Alert

Mọi thao tác xóa đều phải hiển thị Alert.alert() với lựa chọn Hủy và Xóa. Chỉ thực hiện xóa bên trong onPress của nút xác nhận.

Ví dụ: xác nhận xóa một công việc

import { Alert } from 'react-native';

const confirmDelete = (task) => {
  Alert.alert(
    'Xác nhận xóa',
    `Bạn có chắc muốn xóa "${task.title}" không?`,
    [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: () => deleteTask(task.id),
      },
    ]
  );
};

Ví dụ: xóa tất cả việc đã hoàn thành

const completedCount = tasks.filter(
  task => task.done
).length;

const confirmDeleteCompleted = () => {
  if (completedCount === 0) return;

  Alert.alert(
    'Xác nhận xóa',
    `Bạn sẽ xóa ${completedCount} công việc đã hoàn thành.`,
    [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa tất cả',
        style: 'destructive',
        onPress: () => deleteCompletedTasks(),
      },
    ]
  );
};

Nút “Xóa việc đã hoàn thành” phải disabled khi completedCount === 0. Có thể dùng Pressable với disabled và đổi màu/độ mờ để thể hiện trạng thái.

9. Logic nghiệp vụ quan trọng

Ngày tháng — dateUtils.js

parseDate(dateString): chuyển dd/mm/yyyy thành ngày dùng để tính toán.

isValidDate(dateString): kiểm tra định dạng và ngày có thật; 31/02/2026 phải bị từ chối.

isOverdue(task): true khi chưa hoàn thành và hạn trước ngày hiện tại.

getDaysRemaining(task): trả về số ngày còn lại hoặc số ngày quá hạn.

So sánh theo ngày lịch, bỏ giờ/phút để tránh sai lệch.

Khi thêm mới, hạn không được trước ngày hôm nay. Việc sửa phải tuân theo quy định nghiệp vụ của đề.

Lọc, tìm kiếm và sắp xếp — taskUtils.js

Tìm theo tên không phân biệt chữ hoa/chữ thường.

Áp dụng lọc trạng thái và tìm kiếm, sau đó sắp xếp kết quả.

Ưu tiên theo thứ tự Cao → Trung bình → Thấp.

Sắp xếp hạn gần nhất lên đầu.

Không gọi sort() trực tiếp trên mảng state; hãy sao chép mảng trước.

AsyncStorage — taskStorage.js

Dùng một key thống nhất, ví dụ @planner_tasks.

Khi mở app: đọc dữ liệu trước khi bật cờ đã tải xong.

Nếu chưa có dữ liệu lưu, tạo ít nhất 6 công việc mẫu.

Tránh ghi mảng rỗng đè dữ liệu cũ trước khi quá trình đọc hoàn tất.

Mọi thao tác cập nhật state chung bất biến rồi lưu lại.

10. Gợi ý giao diện theo tiêu chí chấm

Khai báo màu chung trong src/theme/colors.js; dùng StyleSheet.create.

Card bo góc, có elevation trên Android; tiêu đề nổi bật hơn thông tin phụ.

Màu ưu tiên: Cao = đỏ, Trung bình = vàng, Thấp = xanh.

Việc hoàn thành: gạch ngang tiêu đề và giảm opacity.

Quá hạn: nhãn đỏ ở danh sách và chi tiết.

Lỗi input: viền đỏ và thông báo ngay dưới ô.

Danh sách rỗng có nội dung hướng dẫn người dùng.

Dùng Pressable để tạo phản hồi nhấn; nút disabled phải khác biệt.

Dùng KeyboardAvoidingView + ScrollView cho form; chọn keyboardType phù hợp.

Dùng SafeAreaView hoặc SafeAreaProvider theo cách thiết lập của React Navigation.
Tiêu chí	Điểm	Yêu cầu
Thống nhất	0,5	Có bảng màu chung (khai báo trong một file theme/colors); font và cỡ chữ nhất quán giữa các màn hình. Dùng StyleSheet.create, hạn chế style inline.
Bố cục	0,5	Khoảng cách (padding, margin) đều; mỗi dòng danh sách trình bày dạng thẻ (card) có bo góc, đổ bóng (elevation/shadow); thông tin chính nổi bật hơn thông tin phụ.
Phản hồi thao tác	0,5	Nút có hiệu ứng khi nhấn; nút bị vô hiệu hoá trông khác biệt; có trạng thái danh sách rỗng; ô nhập sai có viền đỏ.
Trải nghiệm	0,5	Bàn phím không che ô nhập (KeyboardAvoidingView/ScrollView); dùng đúng loại bàn phím (numeric, phone-pad); hiển thị đúng trong vùng an toàn (tai thỏ, thanh trạng thái).
