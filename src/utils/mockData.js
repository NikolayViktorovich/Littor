export const INITIAL_CHATS = [
  { id: '1', name: 'nikolasdev', lastMessage: 'здравия желаю вам, друзья. я не умер, все норм. пилю проекты на г...', time: '13:01', unread: 0, online: false, pinned: true, verified: true },
  { id: '2', name: 'Products Ghost Producer...', lastMessage: 'You\nпусть его жизнь хоть чему нибудь на...', time: 'Wed', unread: 0, online: false, muted: true, isYou: true },
  { id: '3', name: 'ssquad', lastMessage: 'You\nну думаю первым релизом и буд...', time: '00:46', unread: 0, online: false, muted: true, isYou: true, verified: true },
  { id: '4', name: 'Вика Мау Обои', lastMessage: 'но мне похуй', time: '02:03', unread: 0, online: true },
  { id: '5', name: 'Бэкдор', lastMessage: 'Япония открывает визовые центры В РОССИИ УЖЕ СЕГОДНЯ — они заработа...', time: '02:01', unread: 0, online: false, muted: true, verified: true },
  { id: '6', name: 'Saved Messages', lastMessage: 'Photo', time: '02:00', unread: 0, online: false, tags: ['FRONTEND', 'ФРИЛАНС'] },
  { id: '7', name: 'Клиент всегда прав', lastMessage: 'Дизайнер интерьера поделилась базовой кухней россиян в 2026 году. Го...', time: '01:53', unread: 0, online: false, muted: true },
];
export const INITIAL_CONTACTS = [
  { id: '1', name: 'Маргарита Токарева', status: 'в сети', online: true },
  { id: '2', name: 'xenofluxide†', status: 'в сети', online: true },
  { id: '3', name: 'Вика Мау Обои', status: 'в сети', online: true },
  { id: '4', name: 'Ярик Скоробогатов', status: 'был(а) только что', online: false },
  { id: '5', name: 'Лера', status: 'была только что', online: false },
  { id: '6', name: 'Серёга', status: 'был 1 минуту назад', online: false },
  { id: '7', name: 'Димас', status: 'был 2 минуты назад', online: false },
  { id: '8', name: 'Степан', status: 'был 15 минут назад', online: false },
  { id: '9', name: 'Arina', status: 'была 21 минуту назад', online: false },
  { id: '10', name: 'Сабирка', status: 'была 25 минут назад', online: false },
];
export const INITIAL_CALLS = [
  { id: '1', name: 'Вика Мау Обои', type: 'missed', date: '10.11.25', time: '14:32' },
  { id: '2', name: 'Ярик Скоробогатов', type: 'outgoing', count: 3, date: '10.09.25', time: '12:15' },
  { id: '3', name: 'Владелец IGRAY', type: 'incoming', duration: '18 min', date: '29.05.25', time: '09:20' },
  { id: '4', name: 'Павлик', type: 'incoming', duration: '27 sec', date: '02.05.25', time: '16:45' },
];
export const INITIAL_MESSAGES = {
  '6': [
    { 
      id: '1', 
      type: 'channel',
      channelName: 'Бэкдор',
      text: 'Япония открывает визовые центры В РОССИИ УЖЕ СЕГОДНЯ — они заработа...',
      views: '154.1K',
      date: 'Aug 13, 2025, 12:14',
      dateGroup: 'August 26, 2025',
      isMine: false,
      avatar: 'B'
    },
    { 
      id: '2', 
      sender: 'outca$te',
      text: 'квартира 93',
      time: 'Aug 26, 2025, 10:49',
      dateGroup: 'August 26, 2025',
      isMine: false,
      avatar: 'O'
    },
    { 
      id: '3', 
      sender: 'outca$te',
      text: 'Этаж 9',
      time: 'Aug 26, 2025, 10:53',
      dateGroup: 'August 26, 2025',
      isMine: false,
      avatar: 'P'
    },
    { 
      id: '4', 
      text: '1. СОБРАТЬ базового бота (макетом)\n2. не торопиться с платежкой',
      time: '18:43',
      dateGroup: 'August 29, 2025',
      isMine: true,
      hasCheck: true
    },
  ],
};
