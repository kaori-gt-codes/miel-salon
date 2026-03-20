'use strict';

/* ============================================================
   main.js — Miel. Salon

   機能:
   1. スクロールフェードイン (IntersectionObserver)
   2. ヘッダースクロールエフェクト
   3. ハンバーガーメニュー（SP）
   4. スムーススクロール
============================================================ */


/* ============================================================
   1. スクロールフェードイン
   .js-fade-in を持つ要素が画面内に入ったら .is-visible を付与
============================================================ */
const fadeElements = document.querySelectorAll('.js-fade-in');

if (fadeElements.length > 0) {
  const fadeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          // 一度表示したら監視解除（再アニメーション不要）
          fadeObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -48px 0px',
    }
  );

  fadeElements.forEach((el) => fadeObserver.observe(el));
}


/* ============================================================
   2. ヘッダースクロールエフェクト
   スクロール量が 60px を超えたら .is-scrolled を付与
   → CSS側で背景色・シャドウを制御
============================================================ */
const header = document.getElementById('header');

const handleHeaderScroll = () => {
  if (window.scrollY > 60) {
    header.classList.add('is-scrolled');
  } else {
    header.classList.remove('is-scrolled');
  }
};

window.addEventListener('scroll', handleHeaderScroll, { passive: true });
// 初期表示時にも判定（ページ途中でリロードされた場合に対応）
handleHeaderScroll();


/* ============================================================
   3. ハンバーガーメニュー（SP）
   .is-open トグルでメニューの開閉とbodyのスクロールロックを制御
============================================================ */
const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('nav');

hamburger.addEventListener('click', () => {
  const isOpen = hamburger.classList.toggle('is-open');
  nav.classList.toggle('is-open');

  // 背景スクロールのロック / 解除
  document.body.style.overflow = isOpen ? 'hidden' : '';
  hamburger.setAttribute('aria-label', isOpen ? 'メニューを閉じる' : 'メニューを開く');
});

// メニューを閉じるヘルパー
const closeMenu = () => {
  hamburger.classList.remove('is-open');
  nav.classList.remove('is-open');
  document.body.style.overflow = '';
  hamburger.setAttribute('aria-label', 'メニューを開く');
};


/* ============================================================
   4. スムーススクロール
   href="#xxx" 形式のリンクをクリックしたとき、
   ヘッダーの高さ分オフセットしてスクロール
============================================================ */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');

    // "#" のみ（トップへ戻る）の場合
    if (href === '#') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      closeMenu();
      return;
    }

    const target = document.querySelector(href);
    if (!target) return;

    e.preventDefault();

    const headerHeight = header.offsetHeight;
    const targetTop =
      target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

    window.scrollTo({ top: targetTop, behavior: 'smooth' });

    // SPメニューが開いていれば閉じる
    closeMenu();
  });
});
