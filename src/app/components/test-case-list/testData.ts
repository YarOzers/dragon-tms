// private testCase1: TestCase = {
//   id: 1,
//   author: {
//     id: 1,
//     role: 'qa',
//     name: 'Иван Иванов',
//     rights: 'create'
//   },
//   data: [
//     {
//       automationFlag: 'manual',
//       changesAuthor: {
//         id: 2,
//         role: 'admin',
//         name: 'Мария Петрова',
//         rights: 'super'
//       },
//       createdTime: '2024-07-25T08:00:00Z',
//       executionTime: '2024-07-26T10:00:00Z',
//       expectedExecutionTime: '2024-07-26T10:30:00Z',
//       name: 'Тест авторизации пользователя',
//       preConditionItems: [
//         {
//           id: 1,
//           selected: true,
//           action: 'Пользователь должен быть зарегистрирован',
//           expectedResult: 'Пользователь существует в системе'
//         }
//       ],
//       postConditionItems: [
//         {
//           id: 1,
//           selected: true,
//           action: 'Система должна записывать логин',
//           expectedResult: 'Логин записан в систему'
//         }
//       ],
//       priority: 'High',
//       stepItems: [
//         {
//           id: 1,
//           selected: true,
//           action: 'Открыть страницу авторизации',
//           expectedResult: 'Страница авторизации загружается успешно'
//         },
//         {
//           id: 2,
//           selected: true,
//           action: 'Ввести правильные учетные данные',
//           expectedResult: 'Пользователь успешно авторизован'
//         },
//         {
//           id: 3,
//           selected: true,
//           action: 'Нажать кнопку "Войти"',
//           expectedResult: 'Пользователь перенаправляется на главную страницу'
//         }
//       ],
//       type: 'functional',
//       version: '1.0.0'
//     }
//   ],
//   folder: 'Регрессионное тестирование',
//   loading: false,
//   new: true,
//   results: [
//     {
//       id: 1,
//       author: {
//         id: 1,
//         role: 'qa',
//         name: 'Иван Иванов',
//         rights: 'create'
//       },
//       executedTime: '2024-07-26T10:00:00Z',
//       result: 'successfully'
//     }
//   ],
//   selected: null
// };
// private testCase2: TestCase = {
//   id: 2,
//   author: {
//     id: 3,
//     role: 'qa',
//     name: 'Алексей Смирнов',
//     rights: 'create'
//   },
//   data: [
//     {
//       automationFlag: 'auto',
//       changesAuthor: {
//         id: 4,
//         role: 'admin',
//         name: 'Ольга Кузнецова',
//         rights: 'super'
//       },
//       createdTime: '2024-07-20T09:00:00Z',
//       executionTime: '2024-07-26T11:00:00Z',
//       expectedExecutionTime: '2024-07-26T11:15:00Z',
//       name: 'Тест добавления нового пользователя',
//       preConditionItems: [
//         {
//           id: 2,
//           selected: true,
//           action: 'Администратор авторизован в системе',
//           expectedResult: 'Администратор успешно авторизован'
//         }
//       ],
//       postConditionItems: [
//         {
//           id: 2,
//           selected: true,
//           action: 'Новый пользователь должен быть виден в списке пользователей',
//           expectedResult: 'Новый пользователь отображается в списке'
//         }
//       ],
//       priority: 'Medium',
//       stepItems: [
//         {
//           id: 4,
//           selected: true,
//           action: 'Перейти на страницу управления пользователями',
//           expectedResult: 'Страница управления пользователями загружается успешно'
//         },
//         {
//           id: 5,
//           selected: true,
//           action: 'Нажать кнопку "Добавить нового пользователя"',
//           expectedResult: 'Открывается форма добавления пользователя'
//         },
//         {
//           id: 6,
//           selected: true,
//           action: 'Заполнить форму с правильными данными и нажать "Сохранить"',
//           expectedResult: 'Пользователь успешно добавлен и отображается в списке'
//         }
//       ],
//       type: 'functional',
//       version: '1.1.0'
//     }
//   ],
//   folder: 'Функциональное тестирование',
//   loading: false,
//   new: false,
//   results: [
//     {
//       id: 2,
//       author: {
//         id: 3,
//         role: 'qa',
//         name: 'Алексей Смирнов',
//         rights: 'create'
//       },
//       executedTime: '2024-07-26T11:00:00Z',
//       result: 'in_process'
//     }
//   ],
//   selected: true
// };
