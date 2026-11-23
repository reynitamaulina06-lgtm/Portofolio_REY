'use strict';

/* ===== Elemen ===== */
const navbar = document.getElementById('navbar');
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
const links = navLinks.querySelectorAll('a');

/* ===== Menu mobile ===== */
function setMenu(open) {
  navLinks.classList.toggle('open', open);
  menuToggle.classList.toggle('open', open);
  menuToggle.setAttribute('aria-expanded', open);
}
menuToggle.addEventListener('click', () => setMenu(!navLinks.classList.contains('open')));
links.forEach(a => a.addEventListener('click', () => setMenu(false)));

/* ===== Navbar saat scroll + menu aktif ===== */
const sections = [...links].map(a => document.querySelector(a.getAttribute('href')));
function onScroll() {
  navbar.classList.toggle('scrolled', window.scrollY > 30);
  const pos = window.scrollY + 140;
  sections.forEach((sec, i) => {
    const active = pos >= sec.offsetTop && pos < sec.offsetTop + sec.offsetHeight;
    links[i].classList.toggle('active', active);
  });
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ===== Efek mengetik ===== */
const roles = ['Web Developer', 'UI/UX Designer', 'Mahasiswa Sistem Informasi'];
const typed = document.getElementById('typed');
let r = 0, c = 0, deleting = false;
function type() {
  const word = roles[r];
  typed.textContent = word.slice(0, deleting ? --c : ++c);
  let delay = deleting ? 50 : 100;
  if (!deleting && c === word.length) { deleting = true; delay = 1400; }
  else if (deleting && c === 0) { deleting = false; r = (r + 1) % roles.length; delay = 400; }
  setTimeout(type, delay);
}
type();

/* ===== Animasi bar skill saat terlihat ===== */
const skillList = document.getElementById('skillList');
const observer = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting) {
    skillList.querySelectorAll('i').forEach(bar => { bar.style.width = bar.dataset.level + '%'; });
    observer.disconnect();
  }
}, { threshold: 0.3 });
observer.observe(skillList);

/* ===== Filter proyek ===== */
const filters = document.querySelectorAll('.filter');
const cards = document.querySelectorAll('#projectGrid .card');
filters.forEach(btn => btn.addEventListener('click', () => {
  filters.forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  cards.forEach(card => {
    const show = btn.dataset.filter === 'all' || card.dataset.cat === btn.dataset.filter;
    card.classList.toggle('hide', !show);
  });
}));

/* ===== Tahun footer ===== */
document.getElementById('year').textContent = new Date().getFullYear();
/* ===== Toast & tombol kembali ke atas ===== */
const toast = document.getElementById('toast');
let toastTimer;
function showToast(text) {
  toast.textContent = text;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
}
const toTop = document.getElementById('toTop');
window.addEventListener('scroll', () => toTop.classList.toggle('show', window.scrollY > 500), { passive: true });
toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ===== Kemampuan: klik untuk melihat penjelasan ===== */
const skillInfo = [
  'Menyusun struktur halaman yang semantik: header, section, form, dan atribut aksesibilitas.',
  'Flexbox, Grid, gradasi warna, animasi, dan desain responsif untuk desktop dan mobile.',
  'Manipulasi DOM, event, validasi form, dan logika untuk aplikasi kecil.',
  'Commit, push, dan publikasi website lewat GitHub Pages.',
  'Menyusun layout, kombinasi warna, dan tipografi yang konsisten.'
];
document.querySelectorAll('.skill').forEach((el, i) => {
  el.tabIndex = 0;
  el.setAttribute('role', 'button');
  el.setAttribute('aria-expanded', 'false');
  const p = document.createElement('p');
  p.className = 'skill-desc';
  p.textContent = skillInfo[i];
  el.appendChild(p);
  const toggle = () => el.setAttribute('aria-expanded', el.classList.toggle('open'));
  el.addEventListener('click', toggle);
  el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });
});

/* ===== Demo mini untuk tiap proyek ===== */
const demos = {
  none: () => ({ html: '', init() {} }),

  todo: () => ({
    html: `<div class="demo"><div class="demo-title">Coba langsung: To-Do List</div>
      <form class="demo-row" id="tdForm"><input type="text" id="tdInput" placeholder="Tulis tugas baru..." aria-label="Tugas baru">
      <button class="btn btn-primary btn-sm">Tambah</button></form>
      <ul class="todo" id="tdList"></ul><p class="demo-note" id="tdCount"></p></div>`,
    init(root) {
      let items = [{ t: 'Belajar JavaScript', d: true }, { t: 'Kerjakan tugas portofolio', d: false }];
      const list = root.querySelector('#tdList'), count = root.querySelector('#tdCount');
      const render = () => {
        list.innerHTML = '';
        items.forEach((it, i) => {
          const li = document.createElement('li');
          li.className = it.d ? 'done' : '';
          li.innerHTML = '<span></span><button aria-label="Hapus">&times;</button>';
          li.firstChild.textContent = it.t;
          li.addEventListener('click', e => { if (e.target.tagName === 'BUTTON') items.splice(i, 1); else it.d = !it.d; render(); });
          list.appendChild(li);
        });
        count.textContent = `${items.filter(x => x.d).length} dari ${items.length} tugas selesai. Klik tugas untuk menandai.`;
      };
      root.querySelector('#tdForm').addEventListener('submit', e => {
        e.preventDefault();
        const inp = root.querySelector('#tdInput');
        if (inp.value.trim()) { items.push({ t: inp.value.trim(), d: false }); inp.value = ''; render(); }
      });
      render();
    }
  }),

  calc: () => ({
    html: `<div class="demo"><div class="demo-title">Coba langsung: Kalkulator</div>
      <div class="calc-screen" id="cScreen">0</div><div class="calc-grid" id="cGrid"></div></div>`,
    init(root) {
      const keys = ['C','⌫','(',')','7','8','9','÷','4','5','6','×','1','2','3','−','0','.','=','+'];
      const screen = root.querySelector('#cScreen'), grid = root.querySelector('#cGrid');
      let expr = '';
      const show = v => { screen.textContent = v || '0'; };
      keys.forEach(k => {
        const b = document.createElement('button');
        b.textContent = k;
        if ('÷×−+='.includes(k)) b.className = 'op';
        b.addEventListener('click', () => {
          if (k === 'C') expr = '';
          else if (k === '⌫') expr = expr.slice(0, -1);
          else if (k === '=') {
            const e = expr.replace(/÷/g, '/').replace(/×/g, '*').replace(/−/g, '-');
            try { expr = /^[0-9+\-*/.() ]+$/.test(e) ? String(parseFloat(Function('"use strict";return (' + e + ')')().toFixed(8))) : ''; }
            catch { expr = ''; showToast('Format hitungan tidak valid'); }
            if (expr === 'Infinity' || expr === 'NaN') { expr = ''; showToast('Hasil tidak terdefinisi'); }
          } else expr += k;
          show(expr);
        });
        grid.appendChild(b);
      });
    }
  }),

  campus: () => ({
    html: `<div class="demo"><div class="demo-title">Coba langsung: Info Program Studi</div>
      <div class="chips" id="pChips"></div><p id="pInfo" class="demo-note"></p></div>`,
    init(root) {
      const data = {
        'Sistem Informasi': 'Mempelajari perancangan sistem, basis data, dan analisis kebutuhan bisnis berbasis teknologi.',
        'Teknik Informatika': 'Fokus pada pemrograman, algoritma, jaringan, dan pengembangan perangkat lunak.',
        'Manajemen': 'Mempelajari pengelolaan organisasi, keuangan, pemasaran, dan sumber daya manusia.'
      };
      const chips = root.querySelector('#pChips'), info = root.querySelector('#pInfo');
      Object.keys(data).forEach((name, i) => {
        const b = document.createElement('button');
        b.className = 'chip' + (i ? '' : ' active');
        b.textContent = name;
        b.addEventListener('click', () => {
          chips.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
          b.classList.add('active'); info.textContent = data[name];
        });
        chips.appendChild(b);
      });
      info.textContent = data['Sistem Informasi'];
    }
  }),

  cafe: () => ({
    html: `<div class="demo"><div class="demo-title">Coba langsung: Menu Kafe</div>
      <div class="chips" id="mChips"></div><div id="mList"></div>
      <p class="demo-note" id="mTotal"></p></div>`,
    init(root) {
      const menu = [
        ['Kopi Susu', 'Minuman', 18000], ['Matcha Latte', 'Minuman', 22000], ['Es Teh Lemon', 'Minuman', 12000],
        ['Roti Bakar', 'Makanan', 15000], ['Nasi Goreng', 'Makanan', 25000], ['Kentang Goreng', 'Makanan', 17000]
      ];
      let cat = 'Semua', total = 0;
      const chips = root.querySelector('#mChips'), list = root.querySelector('#mList'), tot = root.querySelector('#mTotal');
      const rp = n => 'Rp' + n.toLocaleString('id-ID');
      const render = () => {
        list.innerHTML = '';
        menu.filter(m => cat === 'Semua' || m[1] === cat).forEach(m => {
          const row = document.createElement('div');
          row.className = 'menu-item';
          row.innerHTML = `<div><strong>${m[0]}</strong><small>${rp(m[2])}</small></div><button class="btn btn-primary btn-sm">Tambah</button>`;
          row.querySelector('button').addEventListener('click', () => { total += m[2]; tot.textContent = 'Total pesanan: ' + rp(total); });
          list.appendChild(row);
        });
      };
      ['Semua', 'Minuman', 'Makanan'].forEach((name, i) => {
        const b = document.createElement('button');
        b.className = 'chip' + (i ? '' : ' active');
        b.textContent = name;
        b.addEventListener('click', () => { chips.querySelectorAll('.chip').forEach(c => c.classList.remove('active')); b.classList.add('active'); cat = name; render(); });
        chips.appendChild(b);
      });
      tot.textContent = 'Total pesanan: Rp0';
      render();
    }
  }),

  quiz: () => ({
    html: `<div class="demo"><div class="demo-title">Coba langsung: Kuis Web</div><div id="qBox"></div></div>`,
    init(root) {
      const qs = [
        { q: 'Tag HTML untuk tautan adalah...', o: ['<link>', '<a>', '<href>'], a: 1 },
        { q: 'Properti CSS untuk mengubah warna teks adalah...', o: ['color', 'font-color', 'text-style'], a: 0 },
        { q: 'Method JavaScript untuk memilih elemen berdasarkan id adalah...', o: ['getElementById', 'queryId', 'findElement'], a: 0 }
      ];
      let n = 0, score = 0;
      const box = root.querySelector('#qBox');
      const render = () => {
        if (n >= qs.length) {
          box.innerHTML = `<p><strong>Skor kamu: ${score} / ${qs.length}</strong></p><button class="btn btn-outline btn-sm" id="qAgain" style="margin-top:12px">Ulangi</button>`;
          box.querySelector('#qAgain').addEventListener('click', () => { n = 0; score = 0; render(); });
          return;
        }
        const cur = qs[n];
        box.innerHTML = `<p>${n + 1}/${qs.length}. ` + cur.q.replace(/</g, '&lt;') + '</p><div class="quiz-opts"></div>';
        const opts = box.querySelector('.quiz-opts');
        cur.o.forEach((t, i) => {
          const b = document.createElement('button');
          b.textContent = t;
          b.addEventListener('click', () => {
            opts.querySelectorAll('button').forEach((x, j) => { x.disabled = true; if (j === cur.a) x.classList.add('right'); });
            if (i === cur.a) score++; else b.classList.add('wrong');
            setTimeout(() => { n++; render(); }, 900);
          });
          opts.appendChild(b);
        });
      };
      render();
    }
  })
};

/* ===== Data proyek & modal detail ===== */
const GITHUB = 'https://github.com/reynitamaulina06-lgtm';
const projectData = [
  { title: 'Website Portofolio', demo: 'none', desc: 'Website pribadi yang menampilkan profil, kemampuan, dan daftar proyek. Dibuat sebagai tugas Pemrograman Web 1.',
    feat: ['Navigasi menu responsif dengan menu aktif otomatis', 'Efek teks mengetik dan animasi bar kemampuan', 'Filter proyek dan form kontak dengan validasi'], tags: ['HTML', 'CSS', 'JavaScript'] },
  { title: 'Aplikasi To-Do List', demo: 'todo', desc: 'Aplikasi pencatat tugas harian: tambah tugas, tandai selesai, dan hapus.',
    feat: ['Tambah dan hapus tugas', 'Tandai tugas selesai dengan satu klik', 'Penghitung progres tugas'], tags: ['JavaScript', 'DOM'] },
  { title: 'Kalkulator Web', demo: 'calc', desc: 'Kalkulator dasar untuk tugas mata kuliah Pemrograman Web, mendukung tanda kurung dan desimal.',
    feat: ['Operasi tambah, kurang, kali, bagi', 'Tombol hapus satu karakter dan reset', 'Penanganan input yang tidak valid'], tags: ['HTML', 'JS'] },
  { title: 'Landing Page Kampus', demo: 'campus', desc: 'Halaman informasi kampus fiktif dengan layout grid dan flexbox yang rapi di semua ukuran layar.',
    feat: ['Layout CSS Grid dan Flexbox', 'Bagian informasi program studi', 'Tampilan responsif'], tags: ['CSS Grid', 'Flexbox'] },
  { title: 'Menu Kafe Digital', demo: 'cafe', desc: 'Proyek fiktif berupa daftar menu kafe dengan filter kategori dan perhitungan total pesanan.',
    feat: ['Filter menu berdasarkan kategori', 'Tombol tambah pesanan', 'Total harga dihitung otomatis'], tags: ['HTML', 'CSS', 'JS'] },
  { title: 'Kuis Interaktif', demo: 'quiz', desc: 'Kuis pilihan ganda dengan umpan balik jawaban benar/salah dan skor akhir.',
    feat: ['Umpan balik warna untuk tiap jawaban', 'Skor akhir dan tombol ulangi', 'Soal mudah ditambah lewat array'], tags: ['JavaScript', 'Logic'] }
];

const modal = document.getElementById('modal');
const modalBody = document.getElementById('modalBody');
let lastFocus = null;
const esc = t => t.replace(/&/g, '&amp;').replace(/</g, '&lt;');

function openProject(i) {
  const p = projectData[i], demo = demos[p.demo]();
  lastFocus = document.activeElement;
  modalBody.innerHTML = `<h3 id="modalTitle">${esc(p.title)}</h3>
    <div class="tags">${p.tags.map(t => `<span>${esc(t)}</span>`).join('')}</div>
    <p class="lead">${esc(p.desc)}</p>
    <ul class="feat">${p.feat.map(f => `<li>${esc(f)}</li>`).join('')}</ul>
    ${demo.html}
    <div class="modal-actions">
      <a class="btn btn-primary btn-sm" href="${GITHUB}" target="_blank" rel="noopener">Lihat di GitHub</a>
      <button class="btn btn-outline btn-sm" id="mClose2">Tutup</button>
    </div>`;
  demo.init(modalBody);
  modalBody.querySelector('#mClose2').addEventListener('click', closeProject);
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  document.getElementById('modalClose').focus();
}
function closeProject() {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  if (lastFocus) lastFocus.focus();
}
document.getElementById('modalClose').addEventListener('click', closeProject);
modal.addEventListener('click', e => { if (e.target === modal) closeProject(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && modal.classList.contains('open')) closeProject(); });

cards.forEach((card, i) => {
  card.tabIndex = 0;
  card.setAttribute('role', 'button');
  card.setAttribute('aria-label', 'Buka detail proyek ' + projectData[i].title);
  card.insertAdjacentHTML('beforeend', '<span class="more">Lihat detail &rarr;</span>');
  card.addEventListener('click', () => openProject(i));
  card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openProject(i); } });
});

/* ===== Form kontak: validasi + buka aplikasi email ===== */
const form = document.getElementById('contactForm');
const msg = document.getElementById('formMsg');
form.addEventListener('submit', e => {
  e.preventDefault();
  const f = form.elements;
  const fields = [f.namedItem('name'), f.namedItem('email'), f.namedItem('message')];
  let valid = true;
  fields.forEach(el => {
    const ok = el.value.trim() !== '' && (el.type !== 'email' || /^\S+@\S+\.\S+$/.test(el.value));
    el.classList.toggle('invalid', !ok);
    if (!ok) valid = false;
  });
  msg.className = 'form-msg ' + (valid ? 'ok' : 'error');
  if (!valid) { msg.textContent = 'Lengkapi semua kolom dan pastikan format email benar.'; return; }
  const body = `${fields[2].value}\n\nDari: ${fields[0].value} (${fields[1].value})`;
  msg.textContent = 'Pesan siap dikirim. Aplikasi emailmu akan terbuka.';
  showToast('Terima kasih, ' + fields[0].value.trim() + '!');
  window.location.href = 'mailto:email@reynitamaulina06.com?subject=' + encodeURIComponent('Pesan dari website portofolio') + '&body=' + encodeURIComponent(body);
  form.reset();
});
