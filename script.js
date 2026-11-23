/**
 * L.O.G (Love Of God) - 찬양팀 포털 애플리케이션 스크립트
 * 관리자 계정 생성용 시크릿 초대 코드: LOG2026
 */
const ADMIN_INVITE_CODE = 'LOG2026';

// 초기 샘플 데이터
const defaultUsers = [
  { id: 'leader', pw: '1234', name: '김민준 (인도자)', role: 'admin' },
  { id: 'member', pw: '1234', name: '이서연 (건반/세컨)', role: 'member' }
];

const defaultSetlists = [
  {
    id: 'set-2026-11-29',
    date: '2026-11-29',
    title: '11월 마지막 주일 2부 예배',
    leader: '김민준 인도자 · 시편 95:1-7',
    note: '전반적으로 차분하게 시작해서 3번째 곡 후렴에서 고조됩니다. 건반 패드 톤 유지 부탁드립니다.',
    songs: [
      {
        id: 's1',
        title: '예배합니다 (완전하신 나의 주)',
        key: 'G',
        bpm: '68 BPM',
        link: 'https://www.youtube.com/results?search_query=예배합니다+찬양',
        memo: 'Intro 피아노 솔로 8마디 후 보컬 진입'
      },
      {
        id: 's2',
        title: '주의 은혜라',
        key: 'G → A',
        bpm: '74 BPM',
        link: 'https://www.youtube.com/results?search_query=주의+은혜라+찬양',
        memo: '2절 후렴 끝난 뒤 브릿지에서 A키로 전조'
      },
      {
        id: 's3',
        title: '나의 모습 나의 소유',
        key: 'A',
        bpm: '72 BPM',
        link: 'https://www.youtube.com/results?search_query=나의+모습+나의+소유',
        memo: '기도회 연결 곡 - 아카펠라 코러스 2회 반복'
      }
    ]
  },
  {
    id: 'set-2026-12-06',
    date: '2026-12-06',
    title: '12월 첫째 주일 2부 예배 (대림절)',
    leader: '박지훈 인도자 · 이사야 9:6',
    note: '대림절 첫째 주 예배입니다. 경건하고 깊이 있는 호흡으로 준비해주세요.',
    songs: [
      {
        id: 's4',
        title: '오 베들레헴 작은 골',
        key: 'F',
        bpm: '76 BPM',
        link: 'https://www.youtube.com/results?search_query=오+베들레헴+작은+골',
        memo: '어쿠스틱 기타 & 첼로(건반 스트링) 중심 편곡'
      },
      {
        id: 's5',
        title: '임마누엘 (주 여기 계시네)',
        key: 'F',
        bpm: '70 BPM',
        link: 'https://www.youtube.com/results?search_query=임마누엘+찬양',
        memo: '후렴 반복 후 말씀 기도 연결'
      }
    ]
  }
];

const defaultEvents = [
  {
    id: 'ev1',
    date: '2026-11-26',
    type: 'practice',
    time: '오후 7:30',
    title: '주일예배 전체 합주',
    desc: '본당 2층 찬양대실 (모든 세션 및 싱어 필참)'
  },
  {
    id: 'ev2',
    date: '2026-11-29',
    type: 'worship',
    time: '오전 08:30',
    title: '주일 2부 예배 리허설 및 본예배',
    desc: '08:30 사운드체크 / 11:00 주일 2부 예배'
  },
  {
    id: 'ev3',
    date: '2026-12-03',
    type: 'practice',
    time: '오후 7:30',
    title: '대림절 예배 콘티 합주',
    desc: '본당 2층 찬양대실'
  },
  {
    id: 'ev4',
    date: '2026-12-05',
    type: 'event',
    time: '오후 5:00',
    title: 'L.O.G 월례 기도회 및 교제',
    desc: '비전홀 302호 · 저녁 식사 포함'
  },
  {
    id: 'ev5',
    date: '2026-12-06',
    type: 'worship',
    time: '오전 08:30',
    title: '대림절 첫째 주일 예배 섬김',
    desc: '본당 예배실'
  }
];

// 상태 관리 (localStorage 연동 - 팀명 변경 반영을 위해 키 접두사 log_ 사용)
let users = JSON.parse(localStorage.getItem('log_users')) || defaultUsers;
let setlists = JSON.parse(localStorage.getItem('log_setlists')) || defaultSetlists;
let events = JSON.parse(localStorage.getItem('log_events')) || defaultEvents;
let currentUser = JSON.parse(localStorage.getItem('log_currentUser')) || null;

let selectedSetlistId = setlists[0]?.id || null;
let currentCalYear = 2026;
let currentCalMonth = 10; // 0-indexed (10 = 11월)
let selectedDateStr = '2026-11-29';

// 데이터 저장 헬퍼
function saveData() {
  localStorage.setItem('log_users', JSON.stringify(users));
  localStorage.setItem('log_setlists', JSON.stringify(setlists));
  localStorage.setItem('log_events', JSON.stringify(events));
  localStorage.setItem('log_currentUser', JSON.stringify(currentUser));
}

function isAdmin() {
  return currentUser && currentUser.role === 'admin';
}

// 초기화
document.addEventListener('DOMContentLoaded', () => {
  renderAuthControls();
  renderHomeSummary();
  renderSetlistSection();
  renderCalendar();
  renderSelectedDayPanel();
  setupEventListeners();
  lucide.createIcons();
});

// 네비게이션 전환
function navigateTo(targetId) {
  document.querySelectorAll('.nav-link').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.target === targetId);
  });
  document.querySelectorAll('.page-section').forEach(sec => {
    sec.classList.toggle('active', sec.id === `section-${targetId}`);
  });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 상단 인증 컨트롤 렌더링
function renderAuthControls() {
  const container = document.getElementById('authControls');
  if (currentUser) {
    const roleLabel = currentUser.role === 'admin' ? 'ADMIN' : 'MEMBER';
    const roleClass = currentUser.role === 'admin' ? 'admin' : 'member';
    container.innerHTML = `
      <div class="user-pill">
        <span class="role-tag ${roleClass}">${roleLabel}</span>
        <span>${currentUser.name}</span>
      </div>
      <button class="btn btn-outline btn-sm" onclick="logout()">로그아웃</button>
    `;
  } else {
    container.innerHTML = `
      <button class="btn btn-outline btn-sm" onclick="openAuthModal('login', false)">로그인</button>
      <button class="btn btn-primary btn-sm" onclick="openAuthModal('register', false)">팀원 등록</button>
    `;
  }

  // 관리자 전용 액션 버튼 갱신
  const adminSetlistArea = document.getElementById('adminSetlistActions');
  const adminCalendarArea = document.getElementById('adminCalendarActions');

  if (isAdmin()) {
    adminSetlistArea.innerHTML = `
      <button class="btn btn-bronze btn-sm" onclick="openModal('addSetlistModal')">
        + 새 예배 콘티 추가
      </button>
    `;
    adminCalendarArea.innerHTML = `
      <button class="btn btn-bronze btn-sm" onclick="openAddEventModal()">
        + 사역 일정 등록
      </button>
    `;
  } else {
    adminSetlistArea.innerHTML = '';
    adminCalendarArea.innerHTML = '';
  }
}

// 홈 화면 요약 카드 렌더링
function renderHomeSummary() {
  // 최신 콘티 카드
  const latestSetlist = setlists[0];
  const homeSetlistEl = document.getElementById('homeLatestSetlist');
  if (latestSetlist) {
    const songsHtml = latestSetlist.songs.slice(0, 3).map((s, idx) => `
      <li>
        <span>${idx + 1}. ${s.title}</span>
        <strong>${s.key}</strong>
      </li>
    `).join('');

    homeSetlistEl.innerHTML = `
      <h3 class="card-title-serif">${latestSetlist.title}</h3>
      <p class="card-body-text">${latestSetlist.date} · ${latestSetlist.leader}</p>
      <ul class="mini-song-list">${songsHtml}</ul>
    `;
  } else {
    homeSetlistEl.innerHTML = `<p class="card-body-text">등록된 콘티가 없습니다.</p>`;
  }

  // 다가오는 일정 카드
  const homeEventsEl = document.getElementById('homeUpcomingEvents');
  const sortedEvents = [...events].sort((a, b) => a.date.localeCompare(b.date)).slice(0, 3);
  if (sortedEvents.length > 0) {
    const evListHtml = sortedEvents.map(ev => `
      <li>
        <span><strong>[${ev.date.slice(5)}]</strong> ${ev.title}</span>
        <span>${ev.time}</span>
      </li>
    `).join('');
    homeEventsEl.innerHTML = `
      <h3 class="card-title-serif">이번 주 사역 및 합주</h3>
      <p class="card-body-text">팀원들은 각 파트별 연습 일정을 확인해주세요.</p>
      <ul class="mini-song-list">${evListHtml}</ul>
    `;
  } else {
    homeEventsEl.innerHTML = `<p class="card-body-text">예정된 일정이 없습니다.</p>`;
  }
}

// 콘티 섹션 렌더링
function renderSetlistSection() {
  const tabsContainer = document.getElementById('setlistTabs');
  const detailContainer = document.getElementById('setlistDetailArea');

  if (setlists.length === 0) {
    tabsContainer.innerHTML = `<p class="card-body-text">등록된 콘티가 없습니다.</p>`;
    detailContainer.innerHTML = `<div class="card"><p>새로운 예배 콘티를 등록해주세요.</p></div>`;
    return;
  }

  if (!setlists.find(s => s.id === selectedSetlistId)) {
    selectedSetlistId = setlists[0].id;
  }

  tabsContainer.innerHTML = setlists.map(item => `
    <button class="setlist-tab-btn ${item.id === selectedSetlistId ? 'active' : ''}" 
            onclick="selectSetlist('${item.id}')">
      <span class="tab-date">${item.date}</span>
      <span class="tab-title">${item.title}</span>
    </button>
  `).join('');

  const currentSet = setlists.find(s => s.id === selectedSetlistId);
  const songsHtml = currentSet.songs.length > 0
    ? currentSet.songs.map((song, index) => `
      <div class="song-item">
        <div class="song-left">
          <span class="song-order">${index + 1}</span>
          <div>
            <div>
              <span class="song-title-text">${song.title}</span>
              <span class="song-badges">
                <span class="spec-pill">Key: ${song.key}</span>
                <span class="spec-pill">${song.bpm}</span>
              </span>
            </div>
            ${song.memo ? `<p class="song-memo-text">${song.memo}</p>` : ''}
          </div>
        </div>
        <div class="song-right">
          ${song.link ? `<a href="${song.link}" target="_blank" rel="noopener" class="ref-link-btn">레퍼런스 ↗</a>` : ''}
          ${isAdmin() ? `<button class="delete-icon-btn" title="곡 삭제" onclick="deleteSong('${currentSet.id}', '${song.id}')"><i data-lucide="trash-2"></i></button>` : ''}
        </div>
      </div>
    `).join('')
    : `<p class="card-body-text" style="padding: 20px 0;">아직 추가된 찬양 곡이 없습니다.</p>`;

  detailContainer.innerHTML = `
    <div class="card">
      <div class="setlist-header-box">
        <div>
          <span class="setlist-meta-date">${currentSet.date}</span>
          <h3 class="setlist-main-title">${currentSet.title}</h3>
          <p class="setlist-leader-info">${currentSet.leader}</p>
        </div>
        ${isAdmin() ? `
          <button class="btn btn-outline btn-sm" onclick="deleteSetlist('${currentSet.id}')">콘티 삭제</button>
        ` : ''}
      </div>

      ${currentSet.note ? `
        <div class="setlist-note-box">
          <strong>인도자 노트:</strong> ${currentSet.note}
        </div>
      ` : ''}

      <div class="song-list-header">
        <h4>찬양 곡 순서 (${currentSet.songs.length}곡)</h4>
        ${isAdmin() ? `
          <button class="btn btn-primary btn-sm" onclick="openModal('addSongModal')">+ 곡 추가하기</button>
        ` : ''}
      </div>

      <div>
        ${songsHtml}
      </div>
    </div>
  `;
  lucide.createIcons();
}

function selectSetlist(id) {
  selectedSetlistId = id;
  renderSetlistSection();
}

// 캘린더 렌더링
function renderCalendar() {
  const monthTitle = document.getElementById('calendarMonthTitle');
  const grid = document.getElementById('calendarGrid');

  monthTitle.textContent = `${currentCalYear}년 ${currentCalMonth + 1}월`;

  const firstDay = new Date(currentCalYear, currentCalMonth, 1).getDay();
  const lastDate = new Date(currentCalYear, currentCalMonth + 1, 0).getDate();
  const prevLastDate = new Date(currentCalYear, currentCalMonth, 0).getDate();

  let cellsHtml = '';

  // 이전 달 빈 칸
  for (let i = firstDay - 1; i >= 0; i--) {
    cellsHtml += `<div class="cal-cell other-month"><span class="cal-day-num">${prevLastDate - i}</span></div>`;
  }

  // 이번 달 날짜
  for (let day = 1; day <= lastDate; day++) {
    const mm = String(currentCalMonth + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    const fullDate = `${currentCalYear}-${mm}-${dd}`;

    const dayEvents = events.filter(e => e.date === fullDate);
    const isSelected = fullDate === selectedDateStr;
    const isToday = fullDate === '2026-11-23';

    const chipsHtml = dayEvents.map(ev => `
      <div class="cal-event-chip chip-${ev.type}" title="${ev.time} ${ev.title}">
        ${ev.title}
      </div>
    `).join('');

    cellsHtml += `
      <div class="cal-cell ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}" onclick="selectCalendarDate('${fullDate}')">
        <span class="cal-day-num">${day}</span>
        ${chipsHtml}
      </div>
    `;
  }

  // 다음 달 채우기
  const totalCells = firstDay + lastDate;
  const remaining = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
  for (let i = 1; i <= remaining; i++) {
    cellsHtml += `<div class="cal-cell other-month"><span class="cal-day-num">${i}</span></div>`;
  }

  grid.innerHTML = cellsHtml;
}

function selectCalendarDate(dateStr) {
  selectedDateStr = dateStr;
  renderCalendar();
  renderSelectedDayPanel();
}

function renderSelectedDayPanel() {
  const panel = document.getElementById('selectedDayPanel');
  const dayEvents = events.filter(e => e.date === selectedDateStr);

  const typeNames = {
    worship: '예배 섬김',
    practice: '합주/연습',
    event: '팀 모임'
  };

  if (dayEvents.length === 0) {
    panel.innerHTML = `
      <div class="card-header-row" style="margin-bottom:0;">
        <div>
          <strong>${selectedDateStr}</strong>
          <p class="card-body-text" style="margin-top:4px;">해당 날짜에 등록된 사역 일정이 없습니다.</p>
        </div>
        ${isAdmin() ? `<button class="btn btn-outline btn-sm" onclick="openAddEventModal('${selectedDateStr}')">+ 이 날짜에 일정 추가</button>` : ''}
      </div>
    `;
    return;
  }

  const listHtml = dayEvents.map(ev => `
    <div class="day-event-row">
      <div>
        <span class="badge badge-gray" style="margin-right:6px;">${typeNames[ev.type] || '일정'}</span>
        <strong>${ev.title}</strong> · <span style="color:var(--accent-bronze); font-weight:600;">${ev.time}</span>
        ${ev.desc ? `<p class="card-body-text" style="margin-top:4px;">${ev.desc}</p>` : ''}
      </div>
      ${isAdmin() ? `<button class="delete-icon-btn" onclick="deleteEvent('${ev.id}')" title="일정 삭제"><i data-lucide="trash-2"></i></button>` : ''}
    </div>
  `).join('');

  panel.innerHTML = `
    <div class="card-header-row">
      <h4 class="card-title-serif" style="margin:0;">${selectedDateStr} 상세 일정</h4>
      ${isAdmin() ? `<button class="btn btn-outline btn-sm" onclick="openAddEventModal('${selectedDateStr}')">+ 일정 추가</button>` : ''}
    </div>
    ${listHtml}
  `;
  lucide.createIcons();
}

// 모달 제어
function openModal(modalId) {
  document.getElementById(modalId).classList.add('open');
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.remove('open');
}

function openAuthModal(mode, forceAdminSecret) {
  switchAuthMode(mode, forceAdminSecret);
  openModal('authModal');
}

function switchAuthMode(mode, forceAdminSecret) {
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const title = document.getElementById('authModalTitle');
  const secretField = document.getElementById('adminSecretField');

  document.getElementById('loginErrorMsg').textContent = '';
  document.getElementById('regErrorMsg').textContent = '';

  if (mode === 'login') {
    loginForm.classList.remove('hidden');
    registerForm.classList.add('hidden');
    title.textContent = 'L.O.G 팀원 로그인';
  } else {
    loginForm.classList.add('hidden');
    registerForm.classList.remove('hidden');
    title.textContent = forceAdminSecret ? 'L.O.G 관리자(인도자) 등록' : 'L.O.G 팀원 등록';
    if (forceAdminSecret) {
      secretField.classList.remove('hidden');
    } else {
      secretField.classList.add('hidden');
    }
  }
}

function openAddEventModal(prefillDate) {
  document.getElementById('eventDate').value = prefillDate || selectedDateStr;
  openModal('addEventModal');
}

// 빠른 관리자 로그인
function quickAdminLogin() {
  const adminUser = users.find(u => u.id === 'leader') || defaultUsers[0];
  currentUser = adminUser;
  saveData();
  closeModal('authModal');
  renderAuthControls();
  renderSetlistSection();
  renderSelectedDayPanel();
}

function logout() {
  currentUser = null;
  saveData();
  renderAuthControls();
  renderSetlistSection();
  renderSelectedDayPanel();
}

// 관리자 데이터 CRUD
function deleteSetlist(id) {
  if (!isAdmin()) return;
  if (!confirm('이 예배 콘티를 삭제하시겠습니까?')) return;
  setlists = setlists.filter(s => s.id !== id);
  saveData();
  renderSetlistSection();
  renderHomeSummary();
}

function deleteSong(setlistId, songId) {
  if (!isAdmin()) return;
  const target = setlists.find(s => s.id === setlistId);
  if (!target) return;
  target.songs = target.songs.filter(song => song.id !== songId);
  saveData();
  renderSetlistSection();
  renderHomeSummary();
}

function deleteEvent(eventId) {
  if (!isAdmin()) return;
  events = events.filter(e => e.id !== eventId);
  saveData();
  renderCalendar();
  renderSelectedDayPanel();
  renderHomeSummary();
}

// 이벤트 리스너 설정
function setupEventListeners() {
  // 상단 메뉴 클릭
  document.querySelectorAll('.nav-link').forEach(btn => {
    btn.addEventListener('click', () => navigateTo(btn.dataset.target));
  });

  // 숨겨진 관리자 등록 트리거: 로고 5회 연속 클릭
  let logoClickCount = 0;
  let logoClickTimer = null;
  document.getElementById('brandLogo').addEventListener('click', () => {
    navigateTo('home');
    logoClickCount++;
    clearTimeout(logoClickTimer);
    logoClickTimer = setTimeout(() => { logoClickCount = 0; }, 1500);

    if (logoClickCount >= 5) {
      logoClickCount = 0;
      openAuthModal('register', true);
    }
  });

  // 회원가입 내 관리자 초대코드 토글 버튼
  document.getElementById('toggleAdminSecretBtn').addEventListener('click', () => {
    const field = document.getElementById('adminSecretField');
    field.classList.toggle('hidden');
  });

  // 로그인 제출
  document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('loginId').value.trim();
    const pw = document.getElementById('loginPw').value.trim();
    const found = users.find(u => u.id === id && u.pw === pw);

    if (!found) {
      document.getElementById('loginErrorMsg').textContent = '아이디 또는 비밀번호가 일치하지 않습니다.';
      return;
    }

    currentUser = found;
    saveData();
    closeModal('authModal');
    e.target.reset();
    renderAuthControls();
    renderSetlistSection();
    renderSelectedDayPanel();
  });

  // 회원가입 제출 (시크릿 키 검증 포함)
  document.getElementById('registerForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('regName').value.trim();
    const id = document.getElementById('regId').value.trim();
    const pw = document.getElementById('regPw').value.trim();
    const secretInput = document.getElementById('regSecretCode').value.trim();
    const isSecretVisible = !document.getElementById('adminSecretField').classList.contains('hidden');

    if (users.some(u => u.id === id)) {
      document.getElementById('regErrorMsg').textContent = '이미 사용 중인 아이디입니다.';
      return;
    }

    let role = 'member';
    if (isSecretVisible && secretInput.length > 0) {
      if (secretInput !== ADMIN_INVITE_CODE) {
        document.getElementById('regErrorMsg').textContent = '관리자 초대 코드가 올바르지 않습니다.';
        return;
      }
      role = 'admin';
    }

    const newUser = { id, pw, name, role };
    users.push(newUser);
    currentUser = newUser;
    saveData();

    closeModal('authModal');
    e.target.reset();
    renderAuthControls();
    renderSetlistSection();
    renderSelectedDayPanel();
  });

  // 새 콘티 생성 제출
  document.getElementById('addSetlistForm').addEventListener('submit', (e) => {
    e.preventDefault();
    if (!isAdmin()) return;

    const newSet = {
      id: 'set-' + Date.now(),
      date: document.getElementById('newSetlistDate').value,
      title: document.getElementById('newSetlistTitle').value.trim(),
      leader: document.getElementById('newSetlistLeader').value.trim(),
      note: document.getElementById('newSetlistNote').value.trim(),
      songs: []
    };

    setlists.unshift(newSet);
    selectedSetlistId = newSet.id;
    saveData();
    closeModal('addSetlistModal');
    e.target.reset();
    renderSetlistSection();
    renderHomeSummary();
  });

  // 콘티 내 곡 추가 제출
  document.getElementById('addSongForm').addEventListener('submit', (e) => {
    e.preventDefault();
    if (!isAdmin()) return;

    const target = setlists.find(s => s.id === selectedSetlistId);
    if (!target) return;

    target.songs.push({
      id: 'song-' + Date.now(),
      title: document.getElementById('songTitle').value.trim(),
      key: document.getElementById('songKey').value.trim(),
      bpm: document.getElementById('songBpm').value.trim(),
      link: document.getElementById('songLink').value.trim(),
      memo: document.getElementById('songMemo').value.trim()
    });

    saveData();
    closeModal('addSongModal');
    e.target.reset();
    renderSetlistSection();
    renderHomeSummary();
  });

  // 사역 일정 추가 제출
  document.getElementById('addEventForm').addEventListener('submit', (e) => {
    e.preventDefault();
    if (!isAdmin()) return;

    const dateVal = document.getElementById('eventDate').value;
    events.push({
      id: 'ev-' + Date.now(),
      date: dateVal,
      type: document.getElementById('eventType').value,
      time: document.getElementById('eventTime').value.trim(),
      title: document.getElementById('eventTitle').value.trim(),
      desc: document.getElementById('eventDesc').value.trim()
    });

    selectedDateStr = dateVal;
    saveData();
    closeModal('addEventModal');
    e.target.reset();
    renderCalendar();
    renderSelectedDayPanel();
    renderHomeSummary();
  });

  // 캘린더 월 이동
  document.getElementById('prevMonthBtn').addEventListener('click', () => {
    currentCalMonth--;
    if (currentCalMonth < 0) {
      currentCalMonth = 11;
      currentCalYear--;
    }
    renderCalendar();
  });

  document.getElementById('nextMonthBtn').addEventListener('click', () => {
    currentCalMonth++;
    if (currentCalMonth > 11) {
      currentCalMonth = 0;
      currentCalYear++;
    }
    renderCalendar();
  });

  // 모달 바깥 배경 클릭 시 닫기
  document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        backdrop.classList.remove('open');
      }
    });
  });
}