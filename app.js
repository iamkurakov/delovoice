'use strict';
/* Деловойс — демо кабинета на придуманной компании «Северный ветер».
   Тексты интерфейса — по документу «ДЕЛОВОЙС — весь сайт и демо простыми словами» (20.10.2026).
   Дословные слова участников встреч (цитаты) не меняются. */
const $ = s => document.querySelector(s), app = $('#app'), dialog = $('#detail');
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const TODAY = '2026-10-01';

/* ---------- отделы и люди ---------- */
const departments = ['Сборочный эллинг', 'Оболочки и газ', 'Хозяйственная служба', 'Испытания и навигация', 'Снабжение'];
const deptHint = {
  'Сборочный эллинг': 'Место, где собирают дирижабли',
  'Оболочки и газ': 'Люди, которые следят за большим воздушным корпусом и газом внутри',
  'Хозяйственная служба': 'Люди, которые чинят здания и следят за порядком',
  'Испытания и навигация': 'Люди, которые проверяют, хорошо ли работает дирижабль и куда он летит',
  'Снабжение': 'Люди, которые покупают и привозят нужные вещи'
};
const people = {'Сборочный эллинг':'Гордей Ланцов','Оболочки и газ':'Вера Штольц','Хозяйственная служба':'Савва Кольцов','Испытания и навигация':'Аглая Ветрова','Снабжение':'Тихон Брагин'};
const female = new Set(['Вера Штольц', 'Аглая Ветрова']);
const said = n => female.has(n) ? 'сказала' : 'сказал';

/* ---------- задания: [как записано, понятное название, отдел, срок, состояние] ---------- */
const specs = [
  ['Проверить крепление гондолы перед пробным подъёмом','Проверить, крепко ли держится кабина перед первым подъёмом',3,'2026-09-29','В работе'],
  ['Восстановить ворот причальной мачты № 2','Починить подъёмный механизм у второй мачты',2,'2026-09-30','В работе'],
  ['Пополнить запас гелия для испытаний','Запастись газом для проверки дирижабля',1,'2026-10-01','Новая'],
  ['Согласовать график сборки корпуса «Пеликан»','Договориться, в какие дни будут собирать дирижабль «Пеликан»',0,'2026-10-01','В работе'],
  ['Закупить стекло для иллюминаторов гондолы','Купить стёкла для окон кабины',4,'2026-10-02','В работе'],
  ['Проверить замки складов такелажа','Проверить замки на складах с тросами и оборудованием',2,'2026-09-28','Новая'],
  ['Обновить порядок предполётного осмотра','Исправить список того, что проверяют перед полётом',3,'2026-10-03','Новая'],
  ['Подготовить списки сварщиков на ночную смену','Записать, кто из сварщиков будет работать ночью',0,'2026-09-30','Выполнена'],
  ['Устранить утечку баллонета № 3','Починить третий внутренний мешок, из которого выходит газ',1,'2026-09-28','Выполнена'],
  ['Заказать новые газовые баллоны','Заказать новые баллоны с газом',4,'2026-10-05','Новая'],
  ['Проверить швартовые тросы на испытательном поле','Проверить тросы, которые удерживают дирижабль',3,'2026-10-02','В работе'],
  ['Отремонтировать ворота ангара № 1','Починить ворота первого большого здания',2,'2026-10-01','В работе'],
  ['Подготовить план замены спецодежды','Решить, кому нужна новая рабочая одежда',4,'2026-10-06','Новая'],
  ['Провести инвентаризацию шёлка и пропитки','Посчитать, сколько осталось ткани и средства для её обработки',1,'2026-10-04','В работе'],
  ['Уточнить ответственного за освещение эллинга № 2','Узнать, кто должен отвечать за свет во втором здании',2,null,'Требует уточнения'],
  ['Перенести сборку из затопленного дока','Перенести работу из помещения, куда попала вода',0,'2026-09-29','Выполнена'],
  ['Заменить сигнальные огни на испытательном поле','Поменять сигнальные лампы на площадке для проверок',3,'2026-10-07','Новая'],
  ['Проверить поставку алюминиевого профиля','Узнать, привезли ли заказанные алюминиевые детали',4,'2026-09-29','В работе'],
  ['Организовать уборку эллинга после спуска корпуса','Убрать большое рабочее здание после окончания сборки',2,'2026-09-28','Выполнена'],
  ['Согласовать допуск к хранилищу водорода','Договориться, кому можно заходить в помещение с газом',1,'2026-10-08','Новая'],
  ['Проверить программу обучения новых сборщиков','Проверить, как будут учить новых работников сборки',0,'2026-10-05','В работе'],
  ['Восстановить ограждение испытательного поля','Починить забор вокруг площадки для проверок',3,'2026-09-30','В работе'],
  ['Повторно проверить протечку кровли эллинга','Ещё раз проверить крышу большого здания, где протекала вода',2,'2026-10-03','Новая'],
  ['Пересмотреть заказ лака для оболочек','Ещё раз проверить заказ лака для большого воздушного корпуса',4,'2026-10-09','Отменена']
];
const mentions = [1,4,2,1,2,3,1,2,4,1,2,2,1,2,1,2,1,3,1,1,2,3,4,1];

/* ---------- слова на экране ---------- */
const ST = {'Новая':'Ещё не начали','В работе':'Сейчас делают','Выполнена':'Готово','Просрочена':'Срок прошёл','Требует уточнения':'Нужно спросить','Отменена':'Отменили','Неактуальна':'Больше не нужно'};
const KIND = {'Поручение поставлено':'Дали новое задание','В работе':'Начали делать','Выполнение подтверждено':'На встрече сказали, что готово','Перенос срока':'Договорились о новой дате','Проблема вернулась':'Эта проблема появилась снова','Основание поручения':'Вот из каких слов появилось задание','Уточнение руководителя':'Руководитель дал точный ответ'};
const MANUAL = 'Это проверил человек';
const closed = t => ['Выполнена','Отменена','Неактуальна'].includes(t.status);
const over = t => !closed(t) && t.due && t.due < TODAY;
const status = t => over(t) ? 'Просрочена' : t.status;
const label = t => ST[status(t)];
const chipCls = {'Просрочена':'red','Выполнена':'good','Требует уточнения':'amber'};
const badge = (st, txt) => `<span class="chip ${chipCls[st] || ''}">${esc(txt || ST[st] || st)}</span>`;
const date = s => s ? new Date(s + 'T12:00:00').toLocaleDateString('ru-RU', {day:'numeric', month:'long'}) : 'Дату не сказали';
const dshort = s => s ? new Date(s + 'T12:00:00').toLocaleDateString('ru-RU', {day:'numeric', month:'short'}) : 'Дату не сказали';
const fmt = s => new Date(s + 'T12:00:00').toLocaleDateString('ru-RU', {day:'numeric', month:'long', year:'numeric'}).replace(/\s?г\.$/, ' года');
const lower1 = s => s.charAt(0).toLowerCase() + s.slice(1);
const plural = (n, a, b, c) => { const m = n % 10, h = n % 100; return m === 1 && h !== 11 ? a : m >= 2 && m <= 4 && (h < 12 || h > 14) ? b : c; };
const owner = t => t.owner === 'Не определён' ? 'Пока не сказали, кто' : t.owner;

/* ---------- встречи, задания, вопросы ---------- */
const meetings = Array.from({length:6}, (_, i) => ({id:'M' + (i + 1), date:'2026-09-' + (23 + i), name:'Утренняя встреча', duration:27 + i * 3, people:6}));
let tasks = specs.map(([orig, title, d, due, st], n) => {
  const dept = departments[d], who = people[dept], m = meetings[n % 6];
  const events = [{date:m.date, kind:'Поручение поставлено', quote:`${who}, поручаю: ${lower1(orig)}.${due ? ' Срок — ' + date(due) + '.' : ''}`, speaker:'Марк Остроухов', time:'00:' + String(3 + n).padStart(2, '0') + ':12', meeting:m.id}];
  if (st === 'В работе') events.push({date:'2026-09-29', kind:'В работе', quote:'Работу начали. Подготовка завершена, продолжаем выполнение поручения.', speaker:who, time:'00:14:35', meeting:'M7'});
  if (st === 'Выполнена') events.push({date:'2026-09-30', kind:'Выполнение подтверждено', quote:'Поручение выполнено. Результат проверен.', speaker:who, time:'00:18:40', meeting:'M8'});
  return {id:'T-' + String(n + 1).padStart(3, '0'), orig, title, dept, owner:n === 14 ? 'Не определён' : who, due, status:st, meeting:m.id, mentions:mentions[n], events};
});
meetings.push({id:'M7', date:'2026-09-29', name:'Утренняя встреча', duration:29, people:6}, {id:'M8', date:'2026-09-30', name:'Утренняя встреча', duration:32, people:6});

let reviews = [
  {id:'R1', title:'Кто проверит свет во втором здании?', quote:'«Пусть займутся прожекторами во втором эллинге».', note:'Участники говорили о проверке света. Но никто не назвал человека, который будет отвечать.', task:'T-015', meeting:'M3', type:'owner'},
  {id:'R2', title:'Это один механизм или два разных?', quote:'«Ворот мачты» и «лебёдка у второй мачты».', note:'Возможно, люди по-разному назвали одну и ту же вещь. Но программа не уверена. Руководитель должен проверить.', task:'T-002', meeting:'M2', type:'link'},
  {id:'R3', title:'В какой день привезут баллоны?', quote:'«Баллоны привезут после выходных».', note:'Не сказали точный день. Программа не должна выбирать дату наугад.', task:'T-010', meeting:'M4', type:'date'}
];
let notifications = [
  {id:1, owner:'Аглая Ветрова', title:'Срок прошёл: проверка крепления кабины', text:'Проверка крепления кабины должна была закончиться 29 сентября. Срок прошёл. На следующей встрече нужно рассказать, что сделано.', sent:false},
  {id:2, owner:'Вера Штольц', title:'Сегодня срок: запас газа', text:'Сегодня нужно пополнить запас газа. Об этом договорились на встрече 25 сентября. Номер задания T-003.', sent:false}
];
let journal = [{time:'08:55', text:'Программа проверила сроки всех заданий'}, {time:'09:00', text:'Данные на 1 октября готовы'}];
let processing = false, progress = 0, processed = false, month = 9, filter = {q:'', dept:'', status:''}, menu = false, intro = true, fileName = '';
let sum = {meeting:'', from:'2026-09-23', to:TODAY, state:'idle', ids:[], single:false, period:'', result:null, builtAt:''};

/* ---------- меню ---------- */
const nav = [['overview','Главное'],['calendar','Когда делать'],['tasks','Все задания'],['problems','Что не получается'],['long','О чём говорят снова'],['meetings','Наши встречи'],['summary','Итоги встреч'],['analytics','Числа о работе'],['review','Нужно спросить'],['upload','Добавить встречу'],['notifications','Напоминания']];
const icons = {
  overview:'<rect x="3.5" y="3.5" width="7" height="9"/><rect x="13.5" y="3.5" width="7" height="5"/><rect x="13.5" y="11.5" width="7" height="9"/><rect x="3.5" y="15.5" width="7" height="5"/>',
  calendar:'<rect x="3.5" y="5" width="17" height="15.5" rx="1.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
  tasks:'<path d="M9 6h11M9 12h11M9 18h11"/><path d="M3.5 6l1.5 1.5L7.5 5M3.5 12l1.5 1.5 2.5-2.5"/><circle cx="5" cy="18" r="1.3"/>',
  problems:'<path d="M12 3.5l9 16H3z"/><path d="M12 10v4.5M12 17.2v.1"/>',
  long:'<path d="M4 12a8 8 0 1 0 2.3-5.6"/><path d="M4 4v3.5h3.5M12 8v4.5l3 2"/>',
  meetings:'<path d="M5 4h10l4 4v12H5z"/><path d="M15 4v4h4M8.5 12h7M8.5 16h5"/>',
  summary:'<rect x="4" y="3.5" width="16" height="17" rx="1.5"/><path d="M8 8h8M8 12h8M8 16h4.5"/>',
  analytics:'<path d="M4 20V10M10 20V4M16 20v-7M21 20H3"/>',
  review:'<path d="M3.5 13.5l2.5-8h12l2.5 8v6h-17z"/><path d="M3.5 13.5h5l1.5 2.5h4l1.5-2.5h5"/>',
  upload:'<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21M8.5 21h7"/>',
  notifications:'<path d="M6 16v-5a6 6 0 0 1 12 0v5l1.5 2h-15z"/><path d="M10 20.5h4"/>',
  menu:'<path d="M4 7h16M4 12h16M4 17h16"/>'
};
const svg = (k, n = 18) => `<svg viewBox="0 0 24 24" width="${n}" height="${n}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[k]}</svg>`;
const proc = ['upload','meetings','tasks','review','notifications'];
const stats = () => ({open:tasks.filter(t => !closed(t)).length, over:tasks.filter(over).length, done:tasks.filter(t => t.status === 'Выполнена').length, today:tasks.filter(t => !closed(t) && t.due === TODAY).length});
const link = (route, text, cls = 'btn') => `<a class="${cls}" href="#${route}">${text}</a>`;
const APP = 'https://app.delovoice.ru';
const brand = () => `<span class="brand brand-lg"><img src="assets/logo-dark.png" alt="Деловойс" width="190" height="19"></span>`;

function toast(s) { $('#toast').textContent = s; $('#toast').classList.add('show'); clearTimeout(window.toastTimer); window.toastTimer = setTimeout(() => $('#toast').classList.remove('show'), 4500); }
function modal(title, body, kicker = '') { $('#detailbody').innerHTML = `<div class="modal-head"><div><div class="eyebrow">${esc(kicker)}</div><h2>${esc(title)}</h2></div><button data-action="close" aria-label="Закрыть">×</button></div><div class="modal-body">${body}</div>`; if (!dialog.open) dialog.showModal(); }
function metric(title, num, note, route, alert = false) { return `<a href="#${route}" class="metric ${alert ? 'alert' : ''}"><span>${title}</span><strong>${num}</strong><small>${note}</small></a>`; }
function title(h, p, action = '') { return `<div class="page-title"><div><h1>${h}</h1><p>${p}</p></div>${action}</div>`; }

function taskTable(list) {
  return `<div class="table-wrap"><table><thead><tr><th>Задание</th><th>Кто делает</th><th>Сделать до</th><th>Как идут дела</th><th>Где это сказали</th></tr></thead><tbody>${
    list.map(t => `<tr class="clickable" data-task="${t.id}" tabindex="0" role="button" aria-label="Посмотреть задание: ${esc(t.title)}"><td class="cell-title"><b>${esc(t.title)}</b><small><span class="num">${t.id}</span> · ${esc(t.dept)}</small></td><td>${esc(owner(t))}</td><td><span class="num">${dshort(t.due)}</span></td><td>${badge(status(t))}</td><td><small class="num">${esc(t.events[0].time)} · ${dshort(t.events[0].date)}</small></td></tr>`).join('')
    || '<tr><td colspan="5" class="empty">Таких заданий нет. Попробуйте выбрать другой отдел или состояние</td></tr>'}</tbody></table></div>`;
}
function deptBars() {
  const max = Math.max(1, ...departments.map(d => tasks.filter(t => t.dept === d && !closed(t)).length));
  return `<div class="bars">${departments.map(d => {
    const list = tasks.filter(t => t.dept === d && !closed(t)), o = list.filter(over).length;
    return `<div class="bar-row"><a href="#tasks" data-dept="${d}"><div class="bar-label"><span>${d}</span><span class="num">${list.length} <span class="muted">/ ${o}</span></span></div><div class="bar-track"><span class="bar-fill" style="width:${(list.length - o) / max * 100}%"></span><span class="bar-over" style="width:${o / max * 100}%"></span></div></a></div>`;
  }).join('')}</div><div class="legend"><span><i></i>Ещё не готово</span><span><i class="over"></i>Срок прошёл</span></div>`;
}

/* ---------- каркас ---------- */
function shell(route) {
  const unsent = notifications.filter(n => !n.sent).length;
  return `<div class="shell ${menu ? 'menu-open' : ''}"><aside class="sidebar"><div class="sidebar-top"><a href="/" aria-label="На главную страницу Деловойс">${brand()}</a><button class="menu-close" data-action="menu" aria-label="Закрыть меню">×</button></div>
  <div class="org"><b>Компания «Северный ветер»</b><small>Здесь показан придуманный рабочий пример.</small></div>
  <nav aria-label="Разделы">${nav.map(([r, t]) => `<a href="#${r}" class="${route === r ? 'active' : ''}"><span class="nav-icon">${svg(r)}</span>${t}${r === 'review' && reviews.length ? `<em class="num">${reviews.length}</em>` : ''}</a>`).join('')}</nav>
  <div class="sidebar-bottom"><div class="org">Это учебный пример<small>В этом примере сегодня 1 октября 2026 года</small></div><a href="/">Вернуться на сайт</a><a href="${APP}/">Личный кабинет</a><p class="side-note">В настоящем кабинете работают с записями своей компании. Он открывается отдельно.</p></div></aside>${menu ? '<div class="scrim" data-action="menu" aria-hidden="true"></div>' : ''}
  <div class="main-shell"><header class="topbar"><div class="crumbs"><button class="menu-toggle" data-action="menu" aria-label="Открыть меню">${svg('menu')}</button><span class="muted">Деловойс <span class="sep">/</span> ${nav.find(n => n[0] === route)?.[1] || 'Главное'}</span></div><div class="topbar-right"><a href="#notifications">Напоминания <span class="chip plain num">${unsent}</span></a><span class="avatar">МО</span><span class="username">Марк Остроухов</span></div></header>
  <main class="workspace">${intro ? introBlock() : ''}${view(route)}</main></div></div>`;
}
function introBlock() {
  return `<section class="intro"><div><h2>Это пример работы Деловойс</h2><p>Здесь можно нажимать на кнопки и смотреть, как программа работает. Мы придумали компанию «Северный ветер», людей и их задания.</p><p>Это не настоящий кабинет компании. Настоящие сообщения никому не отправляются. Если обновить страницу, пример может начаться сначала.</p></div><button class="primary" data-action="intro">Начать смотреть</button></section>`;
}

/* ---------- разделы ---------- */
function view(r) {
  const s = stats();
  if (r === 'overview') return title('Что происходит сегодня', 'Четверг, 1 октября 2026 года. Все отделы компании «Северный ветер».', link('upload', processed ? 'Посмотреть результат встречи' : 'Посмотреть новую встречу', 'btn primary'))
    + `<div class="metrics">${metric('Ещё не готово', s.open, 'Столько заданий пока не закончено.', 'tasks')}${metric('Срок прошёл', s.over, 'Эти задания уже должны были сделать.', 'tasks-over', true)}${metric('Сделать сегодня', s.today, 'У этих заданий срок сегодня.', 'tasks-today')}${metric('Нужно уточнить', reviews.length, 'Здесь решение должен принять руководитель.', 'review')}</div>
    <p class="small muted metric-hint">Каждое число можно нажать, чтобы открыть подходящие задания.</p>
    <div class="grid2"><section class="panel"><div class="panel-head"><h3>Какие дела нужно проверить в первую очередь</h3>${link('tasks-over', 'Показать все задания с пропущенным сроком', '')}</div>${tasks.filter(over).slice(0, 4).map(t => `<div class="attention" data-task="${t.id}" tabindex="0" role="button"><div><b>${esc(t.title)}</b><small>Делает: ${esc(owner(t))} · Отдел: ${esc(t.dept)}</small></div>${badge('Просрочена')}</div>`).join('')}</section>
    <section class="panel"><div class="panel-head"><h3>Сколько дел у каждого отдела</h3>${link('analytics', 'Посмотреть числа по отделам', '')}</div><div class="panel-body">${deptBars()}<p class="small muted bars-note">Чем длиннее полоска, тем больше у отдела дел. Отдельно видно, сколько из них уже опоздали.</p></div></section></div>
    <div class="banner"><div><div class="eyebrow">Встреча 2 октября в 9:00</div><h3>Что обсудить завтра</h3><p>${s.over + s.today} ${plural(s.over + s.today, 'вопрос', 'вопроса', 'вопросов')} о делах, которые нужно закончить. Есть просроченные задания и проблемы, которые появились снова.</p></div><button class="accent-btn" data-action="agenda">Посмотреть вопросы для встречи</button></div>
    <div class="inline-note sum-teaser"><b>Итоги встреч</b> — коротко о том, что решили на последних встречах. <a href="#summary">Открыть итоги</a></div>
    <div class="grid2"><section class="panel"><div class="panel-head"><h3>Что нужно закончить сегодня</h3>${link('calendar', 'Открыть календарь', '')}</div>${tasks.filter(t => !closed(t) && t.due === TODAY).map(t => `<div class="attention" data-task="${t.id}" tabindex="0" role="button"><div><b>${esc(t.title)}</b><small>${esc(owner(t))}</small></div><span class="chip amber">Сделать сегодня</span></div>`).join('') || '<div class="empty">Здесь пока ничего нет</div>'}</section>
    <section class="panel"><div class="panel-head"><h3>Что случилось недавно</h3>${link('meetings', 'Посмотреть прошлые встречи', '')}</div><div class="panel-body">${journal.slice(-5).reverse().map(e => `<div class="logline"><time>${e.time}</time><span>${esc(e.text)}</span></div>`).join('')}</div></section></div>`;

  if (r === 'tasks') return title('Все задания', 'Здесь видно каждое дело: что сделать, кто отвечает, когда нужен результат и что об этом говорили на встречах.', `<button data-action="export">Скачать список</button>`)
    + `<div class="toolbar"><input id="search" aria-label="Найти дело или человека" placeholder="Найти дело или человека" value="${esc(filter.q)}"><select id="dept-filter" aria-label="Отдел"><option value="">Все отделы</option>${departments.map(d => `<option ${filter.dept === d ? 'selected' : ''}>${d}</option>`).join('')}</select><select id="status-filter" aria-label="Состояние"><option value="">Все состояния</option>${['Ещё не начали','Сейчас делают','Срок прошёл','Сделать сегодня','Готово','Нужно спросить','Отменили'].map(st => `<option ${filter.status === st ? 'selected' : ''}>${st}</option>`).join('')}</select><button data-action="clear-filters">Показать все задания</button></div><section class="panel" id="task-results">${taskResults()}</section>`;

  if (r === 'calendar') {
    const displayed = new Date(2026, month, 1), yr = displayed.getFullYear(), mo = displayed.getMonth(), first = (displayed.getDay() + 6) % 7, days = new Date(yr, mo + 1, 0).getDate();
    return title('В какой день нужно закончить дела', 'Здесь задания разложены по дням. Так легче увидеть, что надо сделать сегодня, завтра и позже.', `<div class="date-controls"><button data-action="prev-month" aria-label="Прошлый месяц" title="Прошлый месяц">‹</button><b>${displayed.toLocaleDateString('ru-RU', {month:'long', year:'numeric'})}</b><button data-action="next-month" aria-label="Следующий месяц" title="Следующий месяц">›</button></div>`)
      + `<div class="calendar-wrap"><div class="calendar-grid">${['Пн','Вт','Ср','Чт','Пт','Сб','Вс'].map(d => `<div class="day-head">${d}</div>`).join('')}${Array.from({length:first}, () => '<div class="day"></div>').join('')}${Array.from({length:days}, (_, i) => {
        const day = yr + '-' + String(mo + 1).padStart(2, '0') + '-' + String(i + 1).padStart(2, '0');
        return `<div class="day ${day === TODAY ? 'today' : ''}"><div class="day-number">${i + 1}</div>${tasks.filter(t => t.due === day && !closed(t)).map(t => `<button class="cal-task" data-task="${t.id}" title="${esc(t.title)}">${esc(t.title)}</button>`).join('')}</div>`;
      }).join('')}</div></div><div class="inline-note">В этом придуманном примере сегодня 1 октября 2026 года. Нажмите на дело, чтобы увидеть, кто его поручил и что о нём говорили. Все задания, с которыми опоздали, можно найти в разделе «Все задания».</div>`;
  }

  if (r === 'problems') {
    const list = tasks.filter(t => ['T-002','T-009','T-018','T-022','T-023','T-025'].includes(t.id));
    return title('Какие проблемы ещё не решены', 'Иногда что-то ломается или не работает. Люди пытаются это исправить. Потом на другой встрече выясняется, что проблема осталась или появилась снова. Здесь такие случаи собраны вместе.')
      + `<div class="cards">${list.map(t => { const back = t.id === 'T-009' || t.id === 'T-025';
        return `<article class="feature"><div class="eyebrow">${esc(t.dept)}</div><h3>${esc(t.title)}</h3><p>Об этом говорили на встречах <b>${t.mentions} ${plural(t.mentions, 'раз', 'раза', 'раз')}</b>.</p><div class="actions"><span class="small">Сейчас:</span>${badge(status(t))}<span class="chip">${back ? 'Проблема появилась снова' : 'Нужно следить'}</span></div><p class="card-note">${back ? 'Мешок внутри дирижабля починили, но он снова пропускает газ. Нужно ещё раз проверить, где повреждение.' : 'Нужно узнать, что уже сделали и что будут делать дальше.'}</p><button data-task="${t.id}">Посмотреть всю историю</button></article>`; }).join('')}</div>`;
  }

  if (r === 'long') {
    const list = tasks.filter(t => t.mentions >= 3 && !closed(t));
    return title('Какие дела вспоминают снова и снова', 'Здесь дела, о которых говорили на трёх встречах или больше. Но эти дела ещё не закончены.')
      + `<div class="cards">${list.map(t => `<article class="feature"><h3>${esc(t.title)}</h3><p>Говорили об этом ${t.mentions} ${plural(t.mentions, 'раз', 'раза', 'раз')}.</p><p class="small"><b>Кто отвечает:</b> ${esc(owner(t))}</p><div class="actions"><span class="small">Сейчас:</span>${badge(status(t))}</div><p class="card-note">Об этом деле уже говорили несколько раз. Нужно понять, что мешает его закончить.</p><button data-task="${t.id}">Посмотреть все разговоры об этом деле</button></article>`).join('')}</div><div class="inline-note">В «Что не получается» попадают трудные задачи и проблемы. В «О чём говорят снова» — незаконченные задачи, которые обсуждали много раз. Одна задача может быть в обоих разделах.</div>`;
  }

  if (r === 'meetings') return title('Все прошлые встречи', 'Здесь хранятся встречи, их записи, слова участников и задания, которые на них дали.', link('upload', 'Добавить новую встречу', 'btn primary'))
    + `<section class="panel">${meetings.slice().reverse().map(m => `<article class="meet-card"><div><div class="eyebrow">${m.id}</div><h3>${m.name}</h3><p>Когда была: ${fmt(m.date)} · Сколько длилась: ${m.duration} минут · Сколько человек участвовало: ${m.people} · Сколько заданий нашли: ${meetingTasks(m.id).length}</p></div><div class="actions"><span class="chip good">Встречу уже разобрали</span><button data-meeting="${m.id}">Прочитать слова со встречи</button><button class="primary" data-summary="${m.id}">Сделать итоги</button></div></article>`).join('')}</section>`;

  if (r === 'summary') return summaryView();

  if (r === 'analytics') {
    const counts = meetings.map(m => tasks.filter(t => t.meeting === m.id).length);
    return title('Сколько дел сделано', 'Эти числа программа посчитала по заданиям придуманной компании.', `<button data-action="report">Скачать отчёт</button>`)
      + `<div class="metrics">${metric('Всего заданий', tasks.length, 'Все дела, о которых говорили, включая готовые и отменённые.', 'tasks')}${metric('Готово', s.done, 'О выполнении этих дел сообщили на встречах.', 'tasks-done')}${metric('Срок прошёл', Math.round(s.over / Math.max(1, s.open) * 100) + '%', 'Такая часть ещё открытых заданий не была закончена вовремя.', 'tasks-over', true)}${metric('Встреч было', meetings.length, 'Столько встреч находится в списке.', 'meetings')}</div>
      <div class="grid2"><section class="panel"><div class="panel-head"><h3>Сколько дел у каждого отдела</h3></div><div class="panel-body">${deptBars()}<p class="small muted bars-note">Одна часть полоски показывает, сколько заданий ещё делают. Другая — сколько заданий уже опоздали.</p></div></section>
      <section class="panel"><div class="panel-head"><h3>На каких встречах дали новые задания</h3></div><div class="panel-body"><div class="report-grid" style="grid-template-columns:repeat(${meetings.length},1fr)">${meetings.map((m, i) => `<a href="#meetings" class="chart-col" data-meeting="${m.id}" title="Посмотреть встречу ${dshort(m.date)}"><strong>${counts[i]}</strong><div style="height:${counts[i] * 25}px"></div>${dshort(m.date)}</a>`).join('')}</div><p class="small muted bars-note">Каждый столбик — одна встреча. Чем выше столбик, тем больше новых заданий было на этой встрече.</p></div></section></div>
      <section class="panel"><div class="panel-head"><h3>Как идут дела у сотрудников</h3></div><div class="table-wrap"><table><thead><tr><th>Кто делает</th><th>Отдел</th><th>Ещё не готово</th><th>Срок прошёл</th><th>Готово</th></tr></thead><tbody>${departments.map(d => { const ts = tasks.filter(t => t.owner === people[d]); return `<tr><td>${people[d]}</td><td>${d}</td><td>${ts.filter(t => !closed(t)).length}</td><td>${ts.filter(over).length}</td><td>${ts.filter(t => t.status === 'Выполнена').length}</td></tr>`; }).join('')}</tbody></table></div></section>`;
  }

  if (r === 'review') return title('Здесь нужна помощь человека', 'Иногда из разговора нельзя точно понять, кто должен делать дело, когда его закончить или говорят ли люди об одной и той же вещи. Тогда Деловойс не угадывает. Он просит руководителя решить.')
    + `<p class="count-line">Нужно проверить: <b>${reviews.length}</b> ${plural(reviews.length, 'вопрос', 'вопроса', 'вопросов')}</p><section class="panel">${reviews.length ? reviews.map(reviewCard).join('') : '<div class="empty"><h3>Сейчас всё понятно</h3><p>Вы проверили все спорные места. Если после следующей встречи появятся новые вопросы, они будут здесь.</p></div>'}</section>`;

  if (r === 'upload') return uploadView();

  if (r === 'notifications') return title('Сообщения о важных делах', 'Деловойс может готовить сообщения для людей, чтобы они помнили о своих заданиях. Здесь показано, как это выглядит.', `<button class="primary" data-action="send-all" ${!notifications.some(n => !n.sent) ? 'disabled' : ''}>Показать отправку всех</button>`)
    + `<div class="inline-note note-top"><b>Это только пример.</b> Сообщения из этой страницы не уходят в Telegram или другие приложения.</div><section class="panel">${notifications.map(n => `<article class="notification"><div class="notif-head"><div class="small"><b>Для кого:</b> ${esc(n.owner)}</div>${badge(n.sent ? 'Выполнена' : '', n.sent ? 'Отправка показана' : 'Сообщение готово')}</div><h3><span class="muted small">Тема:</span> ${esc(n.title)}</h3><p><span class="muted">Текст:</span> ${esc(n.text)}</p><button data-send="${n.id}" ${n.sent ? 'disabled' : ''}>${n.sent ? 'Уже показали' : 'Показать отправку'}</button></article>`).join('')}</section>`;
  return '';
}

function reviewCard(q) {
  const people5 = Object.values(people);
  let field = '', ok = 'Подтвердить', no = 'Не подтверждать';
  if (q.type === 'owner') { field = `<label class="small" for="resolve-${q.id}">Выберите человека, который сделает это</label><select id="resolve-${q.id}" class="field">${people5.map(p => `<option ${p === 'Савва Кольцов' ? 'selected' : ''}>${p}</option>`).join('')}</select>`; ok = 'Да, этот человек'; no = 'Это не подходит'; }
  if (q.type === 'date') { field = `<label class="small" for="resolve-${q.id}">${q.draft ? 'Укажите день' : 'Выберите день доставки'}</label><input id="resolve-${q.id}" class="field" type="date" value="${q.draft ? '' : '2026-10-05'}">`; ok = q.draft ? 'Сохранить выбранный день' : 'Да, эта дата правильная'; }
  if (q.type === 'link') { ok = 'Да, это одно и то же'; no = 'Нет, это разные вещи'; }
  return `<article class="review-card"><div class="eyebrow">${q.id} · ${q.task}</div><h3>${q.title}</h3><div class="quote">${esc(q.quote)}<small>Слова из встречи — без изменений</small></div><p class="small">${esc(q.note)}</p>${field}<div class="actions"><button class="primary" data-resolve="${q.id}">${ok}</button>${q.draft ? '' : `<button data-reject="${q.id}">${no}</button>`}<button data-task="${q.task}">Посмотреть слова из встречи</button></div></article>`;
}

function filteredTasks() {
  return tasks.filter(t => (!filter.q || (t.title + ' ' + t.orig + ' ' + t.owner + ' ' + t.id).toLowerCase().includes(filter.q.toLowerCase()))
    && (!filter.dept || t.dept === filter.dept)
    && (!filter.status || (filter.status === 'Сделать сегодня' ? t.due === TODAY && !closed(t) : label(t) === filter.status)));
}
function taskResults() { const list = filteredTasks(); return `<div class="panel-head"><h3>Найдено заданий: ${list.length}</h3><span class="small muted">Нажмите на задание, чтобы прочитать его историю и слова из встречи</span></div>${taskTable(list)}`; }

/* ---------- добавить встречу (показ на готовом примере) ---------- */
const demoLines = [
  ['00:02:10','Марк Остроухов','Савва, ворот причальной мачты починили?','Руководитель спрашивает, починили ли механизм у мачты.'],
  ['00:02:18','Савва Кольцов','Подшипник поставили. Проверка под нагрузкой — до 3 октября.','Савва отвечает, что деталь заменили, а проверку закончат до 3 октября.'],
  ['00:05:32','Вера Штольц','Запас гелия пополнили сегодня, поручение выполнено.','Вера говорит, что запас газа пополнили.'],
  ['00:08:40','Вера Штольц','Баллонет номер три снова травит. Проверю шов до 2 октября.','Вера сообщает: воздушный мешок снова пропускает газ. Она проверит его до 2 октября.'],
  ['00:12:05','Марк Остроухов','Аглая, проверьте метеодатчики на причальной мачте до 4 октября.','Марк просит Аглаю проверить приборы, которые измеряют погоду, до 4 октября.'],
  ['00:16:20','Тихон Брагин','Новый шёлк для оболочек привезём скоро.','Тихон обещает привезти материал, но не говорит точную дату.']
];
const steps = [['Получили запись','Пример готов к разбору.'],['Записали слова','Программа показывает текст разговора.'],['Нашли задания','Программа показывает, что нужно сделать.'],['Проверили непонятное','Вопросы без точного ответа передали человеку.'],['Обновили дела','Новые задания появились в списке.']];
function transcript(plain = true) { return demoLines.map(([time, p, text, meaning]) => `<div class="transcript-row"><time>${time}</time><div><b>${p}</b>«${text}»${plain ? `<small class="plain">${meaning}</small>` : ''}</div></div>`).join(''); }
function uploadView() {
  const head = processed ? ['Встреча разобрана', 'Программа обновила список дел и числа о работе. Один новый вопрос должен проверить руководитель.']
    : processing ? ['Разбираем встречу', 'Сейчас программа разбирает пример разговора.']
    : ['Запись встречи готова', 'Мы уже приготовили пример. В нём люди говорят о механизме у мачты, мешке с газом и запасе газа. Ничего писать не нужно.'];
  return title('Посмотрим, что Деловойс узнал из встречи', '1 октября 2026 года. Утренняя встреча компании «Северный ветер».')
    + `<div class="banner"><div><h3>${head[0]}</h3><p>${head[1]}</p></div><button class="accent-btn" data-action="process" ${processing || processed ? 'disabled' : ''}>${processed ? 'Готово' : processing ? 'Показываем…' : 'Показать разбор встречи'}</button></div>
    <section class="panel"><div class="panel-body"><div class="upload-box"><span class="upload-icon">${svg('upload', 40)}</span><h3>Пример записи от 1 октября</h3><p>Вы можете сразу запустить готовый пример.</p><p class="small muted">Можно выбрать свой файл, но в этом примере программа не будет его читать или отправлять. Она всё равно покажет заранее подготовленную встречу.</p><label class="btn file-btn">Выбрать файл (только для примера)<input type="file" id="demo-file" accept="audio/*,video/*,.txt"></label><div id="file-status" class="small muted">${fileName ? `Вы выбрали файл «${esc(fileName)}». Его содержимое не будет обработано. Сейчас мы покажем готовый пример.` : ''}</div></div>
    <div class="steps">${steps.map(([h, p], i) => `<div class="step ${progress > i ? 'done' : processing && progress === i ? 'running' : ''}"><span class="step-icon">${svg(proc[i], 28)}</span><b>${String(i + 1).padStart(2, '0')}${progress > i ? ' · Готово' : processing && progress === i ? ' · Сейчас идёт' : ''}</b>${h}<small>${p}</small></div>`).join('')}</div>
    <progress value="${progress}" max="5" aria-label="Готово шагов"></progress><p class="small muted progress-note">Готово шагов: ${progress} из 5. <b>Это показ на вымышленных данных, а не разбор вашей записи.</b></p>
    ${processed ? `<div class="inline-note"><b>Что получилось:</b><ul class="result-list"><li><b>2 новых задания.</b> Появились дела, которых раньше не было.</li><li><b>1 новый срок.</b> Одно старое дело договорились закончить позже.</li><li><b>1 готовое дело.</b> На встрече сообщили, что его закончили.</li><li><b>1 вопрос.</b> Не назвали точную дату доставки.</li><li><b>2 напоминания.</b> Программа приготовила сообщения людям.</li></ul></div><div class="actions"><button class="primary" data-summary="M9">Сделать итоги встречи</button>${link('tasks', 'Посмотреть все задания')}${link('review', 'Ответить на вопрос')}${link('notifications', 'Посмотреть напоминания')}</div>` : ''}</div></section>
    <section class="panel panel-gap"><div class="panel-head"><h3>${processed ? 'Слова из разобранной встречи' : 'Что люди сказали на встрече'}</h3><span class="small muted">Это часть разговора шести человек</span></div><div class="panel-body">${transcript()}</div></section>`;
}

/* ---------- карточки ---------- */
function meetingTasks(id) { return tasks.filter(t => t.meeting === id || t.events.some(e => e.meeting === id)); }
function showTask(id) {
  const t = tasks.find(t => t.id === id);
  if (!t) {
    if (id === 'T-027') modal('Нужно узнать точный срок', `<p>Человек сказал: «Новый шёлк для оболочек привезём скоро». Но какой именно день он имел в виду, пока не ясно. Руководитель должен выбрать дату. Только после этого задание появится в списке.</p><div class="quote">«Новый шёлк для оболочек привезём скоро».<small>Сказал: Тихон Брагин. Место в записи: 00:16:20</small></div><div class="actions"><button data-meeting="M9">Посмотреть, что сказали</button></div>`, 'Нужно спросить');
    return;
  }
  modal(t.title, `<div class="detail-meta"><div><small>Кто делает</small>${esc(owner(t))}</div><div><small>Отдел</small>${esc(t.dept)}<span class="hint">${esc(deptHint[t.dept])}</span></div><div><small>Сделать до</small>${date(t.due)}</div><div><small>Сейчас</small>${badge(status(t))}</div><div><small>Сколько раз говорили об этом</small>${t.mentions}</div><div><small>Откуда мы узнали</small>Из слов на встрече</div></div>
    <h3>Что говорили об этом деле</h3><div class="timeline">${t.events.map(e => `<article><div class="eyebrow">${date(e.date)} — ${KIND[e.kind] || e.kind}</div><div class="quote">«${esc(e.quote)}»<small>${e.meeting ? `${said(e.speaker) === 'сказала' ? 'Сказала' : 'Сказал'}: ${esc(e.speaker)}. Место в записи: ${esc(e.time)}` : `${esc(e.speaker)} · ${MANUAL}`}</small></div>${e.meeting ? `<button data-meeting="${e.meeting}">Посмотреть встречу ${e.meeting}</button>` : ''}</article>`).join('')}</div>
    <p class="small muted">По записи можно проверить, что человек сказал. Решение о том, готова ли работа на самом деле, принимает руководитель.</p>`, t.id);
}
function showMeeting(id) {
  const m = meetings.find(m => m.id === id); if (!m) return;
  const ts = meetingTasks(id);
  const rows = id === 'M9' ? demoLines.map(([time, p, text]) => `<div class="transcript-row"><time>${time}</time><div><b>${p}</b>«${text}»</div></div>`).join('')
    : ts.map(t => { const e = t.events.find(e => e.meeting === id) || t.events[0]; return `<div class="transcript-row"><time>${e.time}</time><div><b>${esc(e.speaker)}</b>«${esc(e.quote)}»<div class="actions"><button data-task="${t.id}">Открыть задание ${t.id}</button></div></div></div>`; }).join('');
  modal(m.name, `<div class="detail-meta"><div><small>Когда была</small>${fmt(m.date)}</div><div><small>Сколько длилась</small>${m.duration} минут</div><div><small>Сколько заданий</small>${ts.length}</div></div>
    <div class="actions modal-actions"><button class="primary" data-summary="${m.id}">Сделать итоги этой встречи</button></div>
    <h3>Что решили на встрече</h3><p class="muted">${id === 'M9' ? 'Решили позже проверить механизм у мачты. Запас газа пополнили. Один мешок снова пропускает газ. Нужно проверить приборы на мачте. Дату доставки материала пока не назвали.' : 'Люди рассказали о своих делах. Деловойс сохранил задания и слова участников, чтобы к ним можно было вернуться.'}</p>
    <h3>Кто и что сказал</h3>${rows}`, m.id + ' · ' + dshort(m.date));
}

/* ---------- итоги встреч ---------- */
const PRESETS = {last:'Последняя встреча', today:'Сегодня', week:'За неделю', month:'За месяц', year:'За год'};
function presetRange(k) {
  if (k === 'today') return [TODAY, TODAY];
  if (k === 'week') return ['2026-09-25', TODAY];
  if (k === 'month') return ['2026-09-02', TODAY];
  if (k === 'year') return ['2025-10-02', TODAY];
  return null;
}
const range = (f, t) => f === t ? `за ${fmt(f)}` : f.slice(0, 4) === t.slice(0, 4) ? `с ${date(f)} по ${fmt(t)}` : `с ${fmt(f)} по ${fmt(t)}`;
const lastMeeting = () => meetings.slice().sort((a, b) => a.date < b.date ? 1 : -1)[0];
const meetingsIn = (from, to) => meetings.filter(m => m.date >= from && m.date <= to).sort((a, b) => a.date < b.date ? -1 : 1);

function summaryView() {
  const sel = sum.meeting || lastMeeting().id;
  const bad = sum.from && sum.to && sum.to < sum.from;
  const found = bad ? [] : meetingsIn(sum.from, sum.to);
  const foundLine = bad ? `<p class="warn-line"><b>Проверьте дни.</b> Последний день не может быть раньше первого. Выберите дни ещё раз.</p>`
    : sum.from === sum.to ? `<p class="small">Мы посмотрим встречи за ${date(sum.from)}. Найдено встреч: <b>${found.length}</b>.</p>`
    : `<p class="small">Найдено встреч: <b>${found.length}</b>.</p>`;
  return title('Что было на наших встречах', 'Можно посмотреть итоги одной встречи. А можно выбрать несколько дней и узнать, что произошло за это время.')
    + `<div class="sum-quick" role="group" aria-label="Быстрый выбор">${Object.entries(PRESETS).map(([k, v]) => `<button data-preset="${k}" class="${sum.period === k ? 'active' : ''}">${v}</button>`).join('')}</div>
    <div class="grid2 sum-form"><section class="panel"><div class="panel-body"><h3>Одна встреча</h3><p class="small muted">Выберите встречу, чтобы увидеть её короткие итоги.</p><label class="small" for="sum-meeting">Встреча</label><select id="sum-meeting" class="field">${meetings.slice().reverse().map(m => `<option value="${m.id}" ${m.id === sel ? 'selected' : ''}>${dshort(m.date)} — ${m.name} (${m.id})</option>`).join('')}</select><div class="actions"><button class="primary" data-action="sum-one">Сделать итоги</button></div></div></section>
    <section class="panel"><div class="panel-body"><h3>Несколько дней</h3><p class="small muted">Укажите первый и последний день. Деловойс посмотрит встречи между ними.</p><div class="date-pair"><label class="small">С какого дня<input type="date" id="sum-from" class="field" value="${sum.from}"></label><label class="small">По какой день<input type="date" id="sum-to" class="field" value="${sum.to}"></label></div><p class="small muted">Мы посмотрим все встречи от первого дня до последнего, включая оба этих дня.</p><div id="sum-found">${foundLine}</div><div class="actions"><button class="primary" data-action="sum-period" ${bad ? 'disabled' : ''}>Сделать итоги за эти дни</button></div></div></section></div>
    <div id="sum-out">${summaryOut()}</div>`;
}

function summaryOut() {
  if (sum.state === 'idle') return '';
  if (sum.state === 'loading') return `<section class="panel"><div class="panel-body sum-wait"><h3>${sum.single ? 'Собираем итоги' : 'Собираем итоги за выбранные дни'}</h3><p>${sum.single ? 'Деловойс читает текст встречи и выбирает самое важное.' : 'Деловойс читает встречи за это время и ищет главное. Он смотрит, что решили, что сделали и какие вопросы остались.'}</p><p class="small muted">${sum.single ? 'Встреча: ' + fmt(meetings.find(m => m.id === sum.ids[0]).date) : `Встречи ${range(sum.from, sum.to)}`}</p></div></section>`;
  if (sum.state === 'empty') return `<section class="panel"><div class="panel-body"><h3>За эти дни встреч нет</h3><p>Мы не нашли встреч ${sum.from === sum.to ? 'за ' + fmt(sum.from) : 'между ' + fmt(sum.from) + ' и ' + fmt(sum.to)}.</p>${!processed && sum.to >= TODAY ? '<p class="small muted">В этом примере встреча 1 октября появится после показа в разделе <a href="#upload">«Добавить встречу»</a>.</p>' : ''}<div class="actions"><button data-action="sum-again">Выбрать другие дни</button></div></div></section>`;
  return sum.result;
}

function collect(ids) {
  const out = [];
  tasks.forEach(t => t.events.forEach(e => { if (e.meeting && ids.includes(e.meeting)) out.push({t, e}); }));
  return out.sort((a, b) => (a.e.date + a.e.time) < (b.e.date + b.e.time) ? -1 : 1);
}
const proof = x => `<details class="proof"><summary>Показать, кто это сказал</summary><div><b>${said(x.e.speaker) === 'сказала' ? 'Сказала' : 'Сказал'}:</b> ${esc(x.e.speaker)}. <b>Когда в записи:</b> ${esc(x.e.time)}, встреча ${x.e.meeting}, ${dshort(x.e.date)}.<q>${esc(x.e.quote)}</q></div></details>`;
const LIMIT = 6;
function list(items, render, empty) {
  if (!items.length) return `<p class="muted">${empty}</p>`;
  const more = items.length - LIMIT;
  return `<ul class="sum-list">${items.slice(0, LIMIT).map(i => `<li>${render(i)}</li>`).join('')}</ul>${more > 0 ? `<p class="small muted">И ещё ${more} ${plural(more, 'пункт', 'пункта', 'пунктов')} — <a href="#tasks">все задания</a>.</p>` : ''}`;
}
const uniqByTask = arr => { const m = new Map(); arr.forEach(x => m.set(x.t.id, x)); return [...m.values()]; };
const sec = (h, body) => `<section class="sum-sec"><h3>${h}</h3>${body}</section>`;

function buildSummary(ids, single) {
  const all = collect(ids), kind = k => all.filter(x => x.e.kind === k);
  const given = all.filter(x => ['Поручение поставлено','Основание поручения','Проблема вернулась'].includes(x.e.kind));
  const started = kind('В работе'), done = kind('Выполнение подтверждено'), moved = kind('Перенос срока'), back = kind('Проблема вернулась');
  const questions = reviews.filter(q => ids.includes(q.meeting));
  const ms = ids.map(id => meetings.find(m => m.id === id));
  const n = (k, a, b, c) => `${k} ${plural(k, a, b, c)}`;
  const decision = x => `<b>${esc(x.t.title)}:</b> договорились о новой дате — ${date(x.e.due || x.t.due)}.${proof(x)}`;
  const todo = x => `<b>${esc(owner(x.t))}:</b> ${esc(lower1(x.t.title))} — ${x.t.due ? 'до ' + date(x.t.due) : 'дату ещё не назвали'}. <span class="sum-state">Сейчас: ${label(x.t)}</span>${proof(x)}`;
  const doneLine = x => `${esc(x.t.owner)} ${said(x.t.owner)}, что готово: ${esc(lower1(x.t.title))}.${proof(x)}`;
  const qLine = q => `<b>${esc(q.title)}</b> Слова из встречи: ${esc(q.quote)} <a href="#review">Уточнить</a>`;

  let head, main, body;
  if (single) {
    const m = ms[0];
    head = `<h2>Итоги встречи ${date(m.date)}</h2><p>Это короткий рассказ о встрече. Полный разговор можно открыть отдельно.</p>`;
    main = m.id === 'M9' ? 'На верфи обсудили ремонт механизма у второй мачты, запас газа и проверку оборудования. Одно дело закончили, а по другому изменили срок. Также заметили старую проблему, которая появилась снова. Одна дата осталась неизвестной.'
      : [given.length ? `На встрече дали ${n(given.length, 'новое задание', 'новых задания', 'новых заданий')}.` : 'На встрече не дали новых заданий.',
         started.length ? `По ${n(started.length, 'делу', 'делам', 'делам')} сказали, что работа уже идёт.` : '',
         done.length ? `О выполнении ${n(done.length, 'дела', 'дел', 'дел')} сообщили на встрече.` : '',
         moved.length ? `У ${n(moved.length, 'дела', 'дел', 'дел')} изменили срок.` : '',
         questions.length ? `${questions.length === 1 ? 'Один вопрос остался' : n(questions.length, 'вопрос остался', 'вопроса остались', 'вопросов остались')} без точного ответа.` : ''].filter(Boolean).slice(0, 4).join(' ');
    body = sec('Коротко о встрече', `<p>${main}</p>`)
      + sec('Что решили', list(moved, decision, 'На этой встрече не приняли новых решений.'))
      + sec('Что нужно сделать', list(given, todo, 'На этой встрече не дали новых заданий.'))
      + (started.length ? sec('Что начали делать', list(started, x => `${esc(x.t.title)} — ${esc(x.t.owner)}.${proof(x)}`, '')) : '')
      + (done.length ? sec('Что уже сделали', list(done, doneLine, '')) : '')
      + sec('Что ещё нужно выяснить', list(questions, qLine, 'В этой встрече нет вопросов, которые нужно уточнять.'));
  } else if (sum.from !== sum.to) {
    [head, body] = buildAnalytic(ids, ms);
  } else {
    const touched = uniqByTask(all), open = touched.filter(x => !closed(x.t)), late = open.filter(x => over(x.t));
    const top = touched.map(x => ({x, k:all.filter(y => y.t.id === x.t.id).length})).sort((a, b) => b.k - a.k)[0];
    head = `<h2>Итоги ${range(sum.from, sum.to)}</h2><p>Мы посмотрели ${n(ms.length, 'встречу', 'встречи', 'встреч')}. Ниже — самое важное за эти дни.</p>`;
    main = [`За эти дни дали ${n(uniqByTask(given).length, 'новое задание', 'новых задания', 'новых заданий')}.`,
      done.length ? `О выполнении ${n(uniqByTask(done).length, 'дела', 'дел', 'дел')} сообщили на встречах.` : 'О выполнении дел на встречах не сообщали.',
      moved.length ? `У ${n(uniqByTask(moved).length, 'дела', 'дел', 'дел')} изменили срок.` : '',
      back.length ? `${back.length === 1 ? 'Одна старая проблема появилась' : n(back.length, 'старая проблема появилась', 'старые проблемы появились', 'старых проблем появились')} снова.` : '',
      top && top.k > 1 ? `Чаще всего говорили о деле «${esc(top.x.t.title)}».` : ''].filter(Boolean).slice(0, 5).join(' ');
    const history = x => { const ev = all.filter(y => y.t.id === x.t.id); return ev.length > 1 ? `<span class="sum-hist">${ev.map(y => `${KIND[y.e.kind]} ${dshort(y.e.date)}`).join(' → ')}</span>` : ''; };
    body = sec('Самое главное', `<p>${main}</p>`)
      + sec('Какие решения приняли', list(uniqByTask(moved), decision, 'За эти дни в записях нет новых подтверждённых решений.'))
      + sec('Какие дела закончили', list(uniqByTask(done), doneLine, 'За эти дни о выполнении дел не сообщали.'))
      + sec('Какие дела ещё открыты', list(open, x => `<b>${esc(x.t.title)}</b> — ${esc(owner(x.t))} — ${x.t.due ? 'до ' + date(x.t.due) : 'дату ещё не назвали'}. ${history(x)}`, 'Открытых дел нет.'))
      + sec('Где срок уже прошёл', list(late, x => `<b>${esc(x.t.title)}</b> — ${esc(owner(x.t))}, срок был ${date(x.t.due)}.`, 'Дел с прошедшим сроком нет.'))
      + sec('Какие проблемы вернулись', list(back, x => `${esc(x.t.title)}. ${esc(x.t.owner)} проверит до ${date(x.t.due)}.${proof(x)}`, 'За эти дни старые проблемы не возвращались.'))
      + sec('Что нужно уточнить', list(questions, qLine, 'Вопросов без ответа нет.'))
      + sec('Какие встречи мы посмотрели', `<ul class="sum-list meet-list">${ms.slice(-LIMIT).reverse().map(m => `<li>${dshort(m.date)} — ${m.name} <button class="mini" data-meeting="${m.id}">Открыть встречу</button></li>`).join('')}</ul>${ms.length > LIMIT ? `<p class="small muted">И ещё ${ms.length - LIMIT} ${plural(ms.length - LIMIT, 'встреча', 'встречи', 'встреч')} — <a href="#meetings">все встречи</a>.</p>` : ''}`)
      + `<p class="small muted sum-note">Мы рассказываем о встречах за выбранные дни. Состояние заданий показываем на сегодняшний день: в этом примере — 1 октября 2026 года.</p>`;
  }
  const built = new Date().toLocaleTimeString('ru-RU', {hour:'2-digit', minute:'2-digit'});
  const actions = single ? `<button class="primary" data-action="pdf">Сохранить в PDF</button><button data-meeting="${ids[0]}">Читать весь разговор</button><button data-action="sum-rebuild">Сделать итоги заново</button><a class="btn" href="#meetings">Все встречи</a>`
    : `<button class="primary" data-action="pdf">Сохранить в PDF</button><button data-action="sum-again">Выбрать другие дни</button><button data-action="sum-rebuild">Сделать итоги заново</button>`;
  return `<div class="summary-actions actions">${actions}</div><p class="small muted pdf-hint">«Сохранить в PDF» откроет окно печати. Выберите в нём «Сохранить как PDF».</p>
  <article class="summary-doc" id="summary-doc"><header class="sum-top"><img src="assets/logo-dark.png" alt="Деловойс" width="150" height="15"><span>Итоги встреч · Компания «Северный ветер» · пример на придуманных данных</span></header>${head}${body}<footer class="sum-foot">Итоги собраны 1 октября 2026 года в ${built}. Деловойс · delovoice.ru</footer></article>`;
}


/* ---------- аналитический отчёт за период больше одного дня ---------- */
const C_NEW = '#2f6fae', C_DONE = '#b5532f', C_OPEN = '#2c3b4d', C_LATE = '#a1283f';
const DAY = 864e5, dnum = s => Date.parse(s + 'T12:00:00'), iso = n => new Date(n).toISOString().slice(0, 10);
const createdAt = t => t.events[0]?.date;
const closedAt = t => t.events.find(e => e.kind === 'Выполнение подтверждено')?.date;
const openAt = (t, d) => t.status !== 'Отменена' && createdAt(t) <= d && !(closedAt(t) && closedAt(t) <= d);
const lateAt = (t, d) => openAt(t, d) && t.due && t.due < d;
function buckets(from, to) {
  const span = (dnum(to) - dnum(from)) / DAY, out = [];
  if (span <= 14) { for (let n = dnum(from); n <= dnum(to); n += DAY) { const d = iso(n); out.push({from:d, to:d, label:dshort(d).replace('.', '')}); } }
  else if (span <= 92) { let n = dnum(from); while (n <= dnum(to)) { const end = Math.min(n + 6 * DAY, dnum(to)); out.push({from:iso(n), to:iso(end), label:dshort(iso(n)).replace('.', '') + '–' + new Date(end).getDate()}); n = end + DAY; } }
  else { let d = new Date(dnum(from)); d.setDate(1); while (iso(+d) <= to) { const f = iso(+d), e = new Date(d.getFullYear(), d.getMonth() + 1, 0, 12); out.push({from:f < from ? from : f, to:iso(+e) > to ? to : iso(+e), label:d.toLocaleDateString('ru-RU', {month:'short'}).replace('.', '') + (d.getMonth() === 0 ? ' ' + d.getFullYear() : '')}); d = new Date(d.getFullYear(), d.getMonth() + 1, 1, 12); } }
  return out;
}
const NARROW = () => window.innerWidth < 600 && !document.body.classList.contains('printing');
function barChart(bk) {
  const W = NARROW() ? 360 : 640, H = 230, L = 34, R = 8, T = 24, B = 34, max = Math.max(1, ...bk.flatMap(b => [b.nw, b.dn]));
  const step = (W - L - R) / bk.length, bw = Math.max(4, Math.min(22, step / 2 - 4)), y = v => T + (H - T - B) * (1 - v / max);
  const ticks = [0, Math.round(max / 2), max].filter((v, i, a) => a.indexOf(v) === i);
  const lab = (v, x, yy) => v ? `<text x="${x}" y="${yy - 5}" text-anchor="middle" class="ch-val">${v}</text>` : '';
  const showLab = bk.length <= 12, xEvery = Math.ceil(bk.length / (W < 500 ? 5 : 10));
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Новые и закрытые задания по ${bk.length > 1 ? 'периодам' : 'дням'}">
    ${ticks.map(v => `<line x1="${L}" x2="${W - R}" y1="${y(v)}" y2="${y(v)}" class="ch-grid"/><text x="${L - 8}" y="${y(v) + 4}" text-anchor="end" class="ch-ax">${v}</text>`).join('')}
    ${bk.map((b, i) => { const cx = L + step * i + step / 2, x1 = cx - bw - 1, x2 = cx + 1;
      return `<g><title>${b.label}: новых ${b.nw}, закрыли ${b.dn}</title>
        ${b.nw ? `<rect x="${x1}" y="${y(b.nw)}" width="${bw}" height="${y(0) - y(b.nw)}" rx="3" fill="${C_NEW}"/>` : ''}
        ${b.dn ? `<rect x="${x2}" y="${y(b.dn)}" width="${bw}" height="${y(0) - y(b.dn)}" rx="3" fill="${C_DONE}"/>` : ''}
        ${showLab ? lab(b.nw, x1 + bw / 2, y(b.nw)) + lab(b.dn, x2 + bw / 2, y(b.dn)) : ''}
        ${i % xEvery === 0 || i === bk.length - 1 ? `<text x="${cx}" y="${H - 12}" text-anchor="middle" class="ch-ax">${b.label}</text>` : ''}</g>`; }).join('')}
    <line x1="${L}" x2="${W - R}" y1="${y(0)}" y2="${y(0)}" class="ch-base"/></svg>
    <div class="ch-legend"><span><i style="background:${C_NEW}"></i>Новые задания</span><span><i style="background:${C_DONE}"></i>Закрыли</span></div>`;
}
function lineChart(bk) {
  const W = NARROW() ? 360 : 640, H = 210, L = 34, R = 70, T = 18, B = 34, max = Math.max(1, ...bk.flatMap(b => [b.op, b.lt]));
  const step = bk.length > 1 ? (W - L - R) / (bk.length - 1) : 0, x = i => bk.length > 1 ? L + step * i : (L + W - R) / 2, y = v => T + (H - T - B) * (1 - v / max);
  const ticks = [0, Math.round(max / 2), max].filter((v, i, a) => a.indexOf(v) === i);
  const line = (k, c) => `<polyline fill="none" stroke="${c}" stroke-width="2" stroke-linejoin="round" points="${bk.map((b, i) => x(i) + ',' + y(b[k])).join(' ')}"/>${bk.map((b, i) => `<circle cx="${x(i)}" cy="${y(b[k])}" r="4" fill="${c}" stroke="#fff" stroke-width="2"><title>${b.label}: ${k === 'op' ? 'открыто' : 'срок прошёл'} ${b[k]}</title></circle>`).join('')}`;
  const last = bk[bk.length - 1], every = Math.ceil(bk.length / (W < 500 ? 4 : 8));
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Сколько дел было открыто и сколько опаздывало">
    ${ticks.map(v => `<line x1="${L}" x2="${W - R}" y1="${y(v)}" y2="${y(v)}" class="ch-grid"/><text x="${L - 8}" y="${y(v) + 4}" text-anchor="end" class="ch-ax">${v}</text>`).join('')}
    ${line('op', C_OPEN)}${line('lt', C_LATE)}
    <text x="${x(bk.length - 1) + 10}" y="${y(last.op) + 4}" class="ch-end">${last.op} открыто</text>
    <text x="${x(bk.length - 1) + 10}" y="${y(last.lt) + (Math.abs(y(last.lt) - y(last.op)) < 14 ? 16 : 4)}" class="ch-end late">${last.lt} опоздали</text>
    ${bk.map((b, i) => i % every === 0 || i === bk.length - 1 ? `<text x="${x(i)}" y="${H - 12}" text-anchor="middle" class="ch-ax">${b.label}</text>` : '').join('')}</svg>
    <div class="ch-legend"><span><i style="background:${C_OPEN}"></i>Ещё не готово</span><span><i style="background:${C_LATE}"></i>Срок прошёл</span></div>`;
}
function statusBar(list) {
  const groups = [['Готово', 'var(--success)'], ['Сейчас делают', 'var(--info)'], ['Ещё не начали', 'var(--oatmeal)'], ['Срок прошёл', 'var(--danger)'], ['Нужно спросить', 'var(--warning)'], ['Отменили', 'var(--line-strong)']]
    .map(([g, c]) => ({g, c, n:list.filter(t => label(t) === g).length})).filter(x => x.n);
  const tot = Math.max(1, list.length);
  return `<div class="st-bar" role="img" aria-label="Состояние дел">${groups.map(x => `<span style="width:${x.n / tot * 100}%;background:${x.c}" title="${x.g}: ${x.n}"></span>`).join('')}</div>
    <div class="st-legend">${groups.map(x => `<span><i style="background:${x.c}"></i>${x.g} — <b>${x.n}</b> (${Math.round(x.n / tot * 100)}%)</span>`).join('')}</div>`;
}
function groupTable(keys, keyOf, head) {
  return `<div class="table-wrap"><table class="sum-table"><thead><tr><th>${head}</th><th>Новых</th><th>Закрыли</th><th>Ещё не готово</th><th>Срок прошёл</th></tr></thead><tbody>${keys.map(k => {
    const ts = tasks.filter(t => keyOf(t) === k), nw = ts.filter(t => createdAt(t) >= sum.from && createdAt(t) <= sum.to).length, dn = ts.filter(t => closedAt(t) && closedAt(t) >= sum.from && closedAt(t) <= sum.to).length, op = ts.filter(t => openAt(t, END())).length, lt = ts.filter(t => lateAt(t, END())).length;
    return `<tr><td>${esc(k)}</td><td class="num">${nw}</td><td class="num">${dn}</td><td class="num">${op}</td><td class="num ${lt ? 'late-n' : ''}">${lt}</td></tr>`; }).join('')}</tbody></table></div>`;
}
const END = () => sum.to > TODAY ? TODAY : sum.to;
function buildAnalytic(ids, ms) {
  const first = ms[0].date, from = sum.from < first ? first : sum.from, end = END();
  const inP = d => d && d >= sum.from && d <= sum.to;
  const bk = buckets(from, end).map(b => ({...b,
    nw:tasks.filter(t => createdAt(t) >= b.from && createdAt(t) <= b.to).length,
    dn:tasks.filter(t => closedAt(t) && closedAt(t) >= b.from && closedAt(t) <= b.to).length,
    op:tasks.filter(t => openAt(t, b.to)).length, lt:tasks.filter(t => lateAt(t, b.to)).length}));
  const created = tasks.filter(t => inP(createdAt(t))), done = tasks.filter(t => inP(closedAt(t)));
  const open = tasks.filter(t => openAt(t, end)), late = tasks.filter(t => lateAt(t, end));
  const moves = collect(ids).filter(x => x.e.kind === 'Перенос срока'), backs = collect(ids).filter(x => x.e.kind === 'Проблема вернулась');
  const questions = reviews.filter(q => ids.includes(q.meeting));
  const age = t => Math.round((dnum(end) - dnum(createdAt(t))) / DAY);
  const oldest = open.slice().sort((a, b) => age(b) - age(a) || b.mentions - a.mentions).slice(0, 5);
  const deptLate = departments.map(d => [d, late.filter(t => t.dept === d).length]).sort((a, b) => b[1] - a[1])[0];
  const pct = created.length ? Math.round(done.filter(t => inP(createdAt(t))).length / created.length * 100) : 0;
  const n = (k, a, b, c) => `${k} ${plural(k, a, b, c)}`;
  const main = [
    `За период прошло ${n(ms.length, 'встреча', 'встречи', 'встреч')}. Поставили ${n(created.length, 'новое задание', 'новых задания', 'новых заданий')}, закрыли ${n(done.length, 'дело', 'дела', 'дел')}.`,
    `Из новых заданий за этот же период закрыто ${pct}%.`,
    `На ${date(end)} ещё не готово ${n(open.length, 'дело', 'дела', 'дел')}, у ${late.length} срок уже прошёл.`,
    deptLate && deptLate[1] ? `Больше всего опозданий — в отделе «${deptLate[0]}»: ${deptLate[1]}.` : '',
    oldest[0] ? `Дольше всего не закрыто «${esc(oldest[0].title)}» — ${n(age(oldest[0]), 'день', 'дня', 'дней')}.` : ''
  ].filter(Boolean).join(' ');
  const kpi = (v, l, cls = '') => `<div class="kpi ${cls}"><strong class="num">${v}</strong><span>${l}</span></div>`;
  const head = `<h2>Отчёт ${range(sum.from, sum.to)}</h2><p>Как двигались дела за это время: что поставили, что закрыли, где опаздывают. Мы посмотрели ${n(ms.length, 'встречу', 'встречи', 'встреч')}.</p>`;
  const body = `<div class="sum-kpis">${kpi(ms.length, 'встреч')}${kpi(created.length, 'новых заданий')}${kpi(done.length, 'закрыли')}${kpi(open.length, 'ещё не готово')}${kpi(late.length, 'срок прошёл', 'late')}${kpi(moves.length, 'переносов срока')}</div>`
    + sec('Самое главное', `<p>${main}</p>`)
    + sec('Новые и закрытые задания', barChart(bk) + `<p class="small muted">${bk.length > 1 ? 'Каждая пара столбиков — ' + (bk[0].from === bk[0].to ? 'один день' : (dnum(bk[0].to) - dnum(bk[0].from)) / DAY <= 7 ? 'одна неделя' : 'один месяц') + '.' : ''} Если синий столбик выше рыжего, дел прибавляется быстрее, чем их закрывают.</p>`)
    + sec('Сколько дел висело', lineChart(bk) + `<p class="small muted">Число дел, которые ещё не готовы, на конец каждого ${bk[0].from === bk[0].to ? 'дня' : 'отрезка'}. Красная линия — те из них, у которых срок уже прошёл.</p>`)
    + sec('В каком состоянии дела сейчас', statusBar(tasks.filter(t => createdAt(t) <= end)))
    + sec('Как идут дела по отделам', groupTable(departments, t => t.dept, 'Отдел'))
    + sec('Как идут дела у сотрудников', groupTable(Object.values(people), t => t.owner, 'Кто делает'))
    + sec('Дольше всего не закрыты', oldest.length ? `<ol class="sum-rank">${oldest.map(t => `<li><b>${esc(t.title)}</b><span>${esc(owner(t))} · открыто ${n(age(t), 'день', 'дня', 'дней')} · говорили ${n(t.mentions, 'раз', 'раза', 'раз')}${over(t) ? ' · <em>срок прошёл</em>' : ''}</span></li>`).join('')}</ol>` : '<p class="muted">Открытых дел нет.</p>')
    + sec('Переносы сроков и вернувшиеся проблемы', `<p>Сроки переносили ${n(moves.length, 'раз', 'раза', 'раз')}. ${backs.length ? `Вернулось ${n(backs.length, 'проблема', 'проблемы', 'проблем')}: ${backs.map(x => '«' + esc(x.t.title) + '»').join(', ')}.` : 'Старые проблемы не возвращались.'}</p>`)
    + sec('Что нужно уточнить', questions.length ? `<p>Без точного ответа ${n(questions.length, 'вопрос', 'вопроса', 'вопросов')}: ${questions.map(q => esc(q.title.replace(/\?$/, ''))).join('; ')}. <a href="#review">Ответить</a></p>` : '<p class="muted">Вопросов без ответа нет.</p>')
    + `<p class="small muted sum-note">${from > sum.from ? `Встречи в кабинете начались ${date(from)}, поэтому графики начинаются с этого дня. ` : ''}Срок у задания берётся последний названный. Состояние дел — на ${date(end)}${end === TODAY ? ' (в этом примере сегодня)' : ''}.</p>`;
  return [head, body];
}

function runSummary(single, ids) {
  sum.single = single; sum.ids = ids;
  if (!ids.length) { sum.state = 'empty'; paintSummary(); return; }
  sum.state = 'loading'; paintSummary();
  setTimeout(() => { sum.result = buildSummary(ids, single); sum.state = 'done'; paintSummary(); document.getElementById('sum-out')?.scrollIntoView({behavior:'smooth', block:'start'}); }, 900);
}
function paintSummary() { if (location.hash !== '#summary') { location.hash = 'summary'; return; } const out = $('#sum-out'); if (out) out.innerHTML = summaryOut(); else render(); }
function summaryForMeeting(id) { if (dialog.open) dialog.close(); sum.meeting = id; sum.period = id === lastMeeting().id ? 'last' : ''; if (location.hash !== '#summary') { pendingSummary = () => runSummary(true, [id]); location.hash = 'summary'; } else { render(); runSummary(true, [id]); } }
let pendingSummary = null;

function printSummary() {
  const doc = $('#summary-doc'); if (!doc) return;
  const opened = [...doc.querySelectorAll('details:not([open])')]; opened.forEach(d => d.open = true);
  const old = document.title; document.title = (doc.querySelector('h2')?.textContent || 'Итоги встреч') + ' — Деловойс';
  document.body.classList.add('printing');
  const done = () => { document.body.classList.remove('printing'); document.title = old; opened.forEach(d => d.open = false); window.removeEventListener('afterprint', done); };
  window.addEventListener('afterprint', done);
  window.print();
  setTimeout(() => { if (document.body.classList.contains('printing') && !matchMedia('print').matches) done(); }, 1500);
}

/* ---------- действия ---------- */
function log(text) { journal.push({time:new Date().toLocaleTimeString('ru-RU', {hour:'2-digit', minute:'2-digit'}), text}); }
async function processMeeting() {
  if (processed || processing) return;
  processing = true; progress = 0; log('Начали разбирать новую встречу'); render(); toast('Начали показывать, как разбирается встреча');
  for (let i = 1; i <= 5; i++) { await new Promise(r => setTimeout(r, 900)); progress = i; if (location.hash === '#upload') render(); }
  const m = {id:'M9', date:TODAY, name:'Утренняя встреча', duration:31, people:6}; meetings.push(m);
  const ev = (kind, quote, speaker, time, extra = {}) => ({date:m.date, kind, quote, speaker, time, meeting:m.id, ...extra});
  const mast = tasks.find(t => t.id === 'T-002'); mast.due = '2026-10-03'; mast.mentions++; mast.events.push(ev('Перенос срока', 'Подшипник поставили. Проверка под нагрузкой — до 3 октября.', 'Савва Кольцов', '00:02:18', {due:'2026-10-03'}));
  const helium = tasks.find(t => t.id === 'T-003'); helium.status = 'Выполнена'; helium.events.push(ev('Выполнение подтверждено', 'Запас гелия пополнили сегодня, поручение выполнено.', 'Вера Штольц', '00:05:32'));
  tasks.push(
    {id:'T-025', orig:'Повторно проверить шов баллонета № 3', title:'Ещё раз проверить место соединения на третьем мешке с газом', dept:'Оболочки и газ', owner:'Вера Штольц', due:'2026-10-02', status:'Новая', meeting:'M9', mentions:1, events:[ev('Проблема вернулась', 'Баллонет номер три снова травит. Проверю шов до 2 октября.', 'Вера Штольц', '00:08:40')]},
    {id:'T-026', orig:'Проверить метеодатчики на причальной мачте', title:'Проверить приборы погоды на мачте', dept:'Испытания и навигация', owner:'Аглая Ветрова', due:'2026-10-04', status:'Новая', meeting:'M9', mentions:1, events:[ev('Поручение поставлено', 'Аглая, проверьте метеодатчики на причальной мачте до 4 октября.', 'Марк Остроухов', '00:12:05')]});
  reviews.push({id:'R4', title:'Когда привезут новый шёлк?', quote:'«Новый шёлк для оболочек привезём скоро».', note:'Слова «скоро» мало. Нужно узнать точную дату. После подтверждения появится новое задание.', task:'T-027', meeting:'M9', type:'date', draft:true});
  notifications.push(
    {id:3, owner:'Вера Штольц', title:'Новое задание: шов мешка № 3', text:'Новое задание: ещё раз проверить шов воздушного мешка № 3. Закончить до 2 октября. Об этом говорили на встрече M9.', sent:false},
    {id:4, owner:'Аглая Ветрова', title:'Новое задание: приборы погоды на мачте', text:'Новое задание: проверить приборы погоды на мачте. Закончить до 4 октября. Об этом говорили на встрече M9.', sent:false});
  processed = true; processing = false; log('Из встречи добавили задания и обновили список'); render();
  toast('Готово. Добавили новые задания и обновили старые. Есть один вопрос без точного ответа. Его нужно проверить.');
}
function resolveReview(id, reject = false) {
  const q = reviews.find(q => q.id === id); if (!q) return;
  const t = tasks.find(t => t.id === q.task), field = $('#resolve-' + id), value = field?.value;
  if (!reject && q.type === 'date' && !value) { toast(q.draft ? 'Сначала выберите день' : 'Выберите дату, чтобы продолжить'); return; }
  const manual = text => ({date:TODAY, kind:'Уточнение руководителя', quote:text, speaker:'Марк Остроухов', time:MANUAL, meeting:null});
  if (!reject && q.draft) tasks.push({id:'T-027', orig:'Доставить новый шёлк для оболочек', title:'Привезти новую ткань для большого воздушного корпуса', dept:'Снабжение', owner:'Тихон Брагин', due:value, status:'Новая', meeting:'M9', mentions:1, events:[{date:TODAY, kind:'Основание поручения', quote:'Новый шёлк для оболочек привезём скоро.', speaker:'Тихон Брагин', time:'00:16:20', meeting:'M9'}, manual('Руководитель выбрал день: ' + fmt(value))]});
  if (!reject && t) {
    if (q.type === 'owner') { t.owner = value; t.status = 'Новая'; }
    if (q.type === 'date') t.due = value;
    t.events.push(manual(q.type === 'owner' ? 'Руководитель выбрал человека: ' + value : q.type === 'date' ? 'Руководитель выбрал день: ' + fmt(value) : 'Руководитель подтвердил: это одно и то же дело'));
  }
  if (reject && t) t.events.push(manual(q.type === 'link' ? 'Руководитель решил: это разные дела' : 'Руководитель не подтвердил ответ'));
  reviews = reviews.filter(x => x.id !== id); log('Руководитель подтвердил ответ'); render();
  toast(reject ? (q.type === 'link' ? 'Поняли. Эти слова не будем считать одним делом' : 'Решение сохранено в истории примера') : 'Ответ сохранён');
}
function send(id) { const n = notifications.find(n => n.id === Number(id)); if (n && !n.sent) { n.sent = true; log('Показали отправку напоминания: ' + n.owner); } render(); toast('Мы показали, как выглядела бы отправка. Настоящие сообщения никому не ушли'); }
function download(name, text, type = 'text/plain;charset=utf-8') { const url = URL.createObjectURL(new Blob([text], {type})); const a = document.createElement('a'); a.href = url; a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); }

function render() {
  let r = location.hash.slice(1) || 'overview';
  if (['tasks-over','tasks-today','tasks-done'].includes(r)) { filter = {q:'', dept:'', status:({'tasks-over':'Срок прошёл','tasks-today':'Сделать сегодня','tasks-done':'Готово'})[r]}; r = 'tasks'; }
  app.innerHTML = shell(nav.some(n => n[0] === r) ? r : 'overview');
}
window.addEventListener('hashchange', () => { menu = false; render(); window.scrollTo(0, 0); if (pendingSummary && location.hash === '#summary') { const f = pendingSummary; pendingSummary = null; f(); } else if (location.hash === '#summary' && sum.state === 'loading') { /* продолжается */ } });
document.addEventListener('input', e => {
  if (e.target.id === 'search') { filter.q = e.target.value; $('#task-results').innerHTML = taskResults(); }
});
document.addEventListener('change', e => {
  const id = e.target.id;
  if (id === 'dept-filter' || id === 'status-filter') { filter[id === 'dept-filter' ? 'dept' : 'status'] = e.target.value; $('#task-results').innerHTML = taskResults(); }
  if (id === 'demo-file') { fileName = e.target.files.length ? e.target.files[0].name : ''; $('#file-status').textContent = fileName ? `Вы выбрали файл «${fileName}». Его содержимое не будет обработано. Сейчас мы покажем готовый пример.` : ''; if (fileName) toast(`Выбрали файл «${fileName}». Но в этом примере мы покажем готовую запись, а не ваш файл`); }
  if (id === 'sum-meeting') { sum.meeting = e.target.value; sum.period = ''; }
  if (id === 'sum-from' || id === 'sum-to') { sum[id === 'sum-from' ? 'from' : 'to'] = e.target.value; sum.period = ''; const keep = $('#sum-out').innerHTML; render(); $('#sum-out').innerHTML = keep; }
});
document.addEventListener('keydown', e => { if (e.key === 'Enter' && e.target.matches('[data-task]')) showTask(e.target.dataset.task); });
document.addEventListener('click', e => {
  const el = e.target.closest('[data-action],[data-task],[data-meeting],[data-dept],[data-resolve],[data-reject],[data-send],[data-summary],[data-preset]'); if (!el) return;
  if (el.dataset.task) { showTask(el.dataset.task); return; }
  if (el.dataset.meeting) { e.preventDefault(); showMeeting(el.dataset.meeting); return; }
  if (el.dataset.summary) { summaryForMeeting(el.dataset.summary); return; }
  if (el.dataset.preset) {
    const k = el.dataset.preset; sum.period = k;
    if (k === 'last') { const m = lastMeeting(); sum.meeting = m.id; render(); runSummary(true, [m.id]); return; }
    const [f, t] = presetRange(k); sum.from = f; sum.to = t; render(); runSummary(false, meetingsIn(f, t).map(m => m.id)); return;
  }
  if (el.dataset.dept) { filter = {q:'', dept:el.dataset.dept, status:''}; if (location.hash === '#tasks') render(); return; }
  if (el.dataset.resolve) { resolveReview(el.dataset.resolve); return; }
  if (el.dataset.reject) { const q = reviews.find(x => x.id === el.dataset.reject); const link_ = q?.type === 'link'; modal(link_ ? 'Вы не хотите связывать эти слова?' : 'Вы не хотите подтверждать этот ответ?', `<p>Само задание останется в списке. Вопрос исчезнет из раздела проверки. Программа запомнит решение.</p><div class="actions"><button data-action="close">Нет, вернуться</button><button class="primary" data-action="confirm-reject" data-id="${el.dataset.reject}">${link_ ? 'Да, не связывать' : 'Да, не подтверждать'}</button></div>`, 'Решение руководителя'); return; }
  if (el.dataset.send) { send(el.dataset.send); return; }
  switch (el.dataset.action) {
    case 'close': dialog.close(); break;
    case 'confirm-reject': dialog.close(); resolveReview(el.dataset.id, true); break;
    case 'intro': intro = false; render(); break;
    case 'menu': menu = !menu; render(); break;
    case 'process': processMeeting(); break;
    case 'clear-filters': filter = {q:'', dept:'', status:''}; render(); break;
    case 'prev-month': month--; render(); break;
    case 'next-month': month++; render(); break;
    case 'sum-one': { const id = $('#sum-meeting').value; sum.meeting = id; runSummary(true, [id]); break; }
    case 'sum-period': if (sum.to < sum.from) { toast('Последний день не может быть раньше первого. Выберите дни ещё раз.'); break; } runSummary(false, meetingsIn(sum.from, sum.to).map(m => m.id)); break;
    case 'sum-rebuild': runSummary(sum.single, sum.single ? sum.ids : meetingsIn(sum.from, sum.to).map(m => m.id)); break;
    case 'sum-again': sum.state = 'idle'; sum.period = ''; render(); window.scrollTo(0, 0); $('#sum-from')?.focus(); break;
    case 'pdf': printSummary(); break;
    case 'agenda': { const list = tasks.filter(t => over(t) || (!closed(t) && t.due === TODAY)); modal('Что обсудить завтра', `<p class="muted">Встреча 2 октября в 9:00 · ${list.length} ${plural(list.length, 'вопрос', 'вопроса', 'вопросов')} о сроках</p>${list.map(t => `<div class="attention" data-task="${t.id}"><div><b>${esc(t.title)}</b><small>Делает: ${esc(owner(t))} · Сделать до: ${dshort(t.due)}</small></div>${badge(status(t))}</div>`).join('')}<div class="inline-note">Отдельно: мешок с газом № 3 снова пропускает газ. И нужно проверить спорные сроки.</div>`, 'Вопросы для встречи'); break; }
    case 'send-all': notifications.filter(n => !n.sent).forEach(n => { n.sent = true; log('Показали отправку напоминания: ' + n.owner); }); render(); toast('Показали отправку всех готовых сообщений'); break;
    case 'export': { const cell = s => '"' + String(s ?? '').replace(/"/g, '""') + '"'; download('delovoice-zadaniya.csv', '﻿' + [['Номер','Задание','Отдел','Кто делает','Сделать до','Как идут дела'], ...filteredTasks().map(t => [t.id, t.title, t.dept, owner(t), t.due ? fmt(t.due) : 'Дату не сказали', label(t)])].map(row => row.map(cell).join(';')).join('\r\n'), 'text/csv;charset=utf-8'); toast('Список скачан. В нём только задания, которые сейчас показаны по выбранным условиям'); break; }
    case 'report': { const s = stats(); download('delovoice-otchet.txt', 'ДЕЛОВОЙС — отчёт о работе\nКомпания «Северный ветер» — придуманный пример · 1 октября 2026 года\n\nВсего заданий: ' + tasks.length + '\nЕщё не готово: ' + s.open + '\nСрок прошёл: ' + s.over + '\nГотово: ' + s.done + '\nВстреч было: ' + meetings.length + '\n\n' + tasks.map(t => t.id + ' | ' + t.title + ' | Кто делает: ' + owner(t) + ' | ' + label(t) + ' | Сделать до: ' + date(t.due) + '\nГде это сказали: встреча ' + t.events[0].meeting + ', ' + t.events[0].time + '\nСлова из встречи: «' + t.events[0].quote + '»').join('\n\n')); toast('Отчёт скачан. В нём есть задания, их сроки и слова из встреч'); break; }
  }
});
dialog.addEventListener('click', e => { if (e.target === dialog) { const r = dialog.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dialog.close(); } });
if (document.modelContext?.registerTool) { const ctl = new AbortController(); const tool = {name:'get_delovoice_demo_summary', description:'Read current fictional shipyard demo metrics and task IDs. Does not modify data.', inputSchema:{type:'object', properties:{}, additionalProperties:false}, annotations:{readOnlyHint:true}, execute(input) { if (!input || typeof input !== 'object' || Object.keys(input).length) throw Error('Expected an empty object'); return {...stats(), tasks:tasks.map(t => ({id:t.id, title:t.title, status:label(t)})), meetings:meetings.length, pendingReviews:reviews.length}; }}; try { Promise.resolve(document.modelContext.registerTool(tool, {signal:ctl.signal})).catch(() => {}); window.addEventListener('pagehide', () => ctl.abort(), {once:true}); } catch {} }
render();
if (location.hash === '#summary' && sum.state === 'idle') { /* открыт раздел итогов: покажем пример последней встречи */ const m = lastMeeting(); sum.meeting = m.id; sum.period = 'last'; render(); runSummary(true, [m.id]); }
