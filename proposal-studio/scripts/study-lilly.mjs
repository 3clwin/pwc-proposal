import { chromium } from 'playwright';

async function study() {
  const browser = await chromium.launch({ headless: false, args: ['--disable-blink-features=AutomationControlled'] });
  const ctx = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
    viewport: { width: 1440, height: 900 },
  });
  const page = await ctx.newPage();

  console.log('Navigating to lilly.com...');
  await page.goto('https://www.lilly.com', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(5000);

  const title = await page.title();
  console.log('Title:', title);
  if (title.includes('moment')) {
    console.log('Cloudflare challenge, waiting...');
    await page.waitForTimeout(10000);
  }

  // Screenshot the homepage
  await page.screenshot({ path: '/Users/ereyes032/RFP Site/proposal-studio/scripts/lilly-homepage.png', fullPage: true });
  console.log('Homepage screenshot saved');

  // Extract the actual HTML structure of key sections
  const structure = await page.evaluate(() => {
    const result = { hero: '', nav: '', sections: [], cards: [], buttons: [], footer: '' };

    // Nav HTML
    const nav = document.querySelector('header') || document.querySelector('nav');
    if (nav) result.nav = nav.outerHTML.slice(0, 3000);

    // Hero section
    const hero = document.querySelector('[class*="hero"], [class*="Hero"], main > section:first-child, main > div:first-child');
    if (hero) result.hero = hero.outerHTML.slice(0, 5000);

    // Get computed styles of interesting elements
    const allSections = document.querySelectorAll('section, [class*="section"], [class*="block"], [class*="Block"]');
    for (const sec of Array.from(allSections).slice(0, 8)) {
      const cs = getComputedStyle(sec);
      const firstH = sec.querySelector('h1, h2, h3');
      const firstP = sec.querySelector('p');
      const firstBtn = sec.querySelector('a[class*="btn"], a[class*="cta"], a[class*="Cta"], button');
      result.sections.push({
        classes: sec.className.slice(0, 200),
        bg: cs.backgroundColor,
        color: cs.color,
        padding: cs.padding,
        borderRadius: cs.borderRadius,
        heading: firstH ? {
          text: firstH.textContent?.trim().slice(0, 80),
          tag: firstH.tagName,
          fontFamily: getComputedStyle(firstH).fontFamily.slice(0, 100),
          fontSize: getComputedStyle(firstH).fontSize,
          fontWeight: getComputedStyle(firstH).fontWeight,
          letterSpacing: getComputedStyle(firstH).letterSpacing,
          color: getComputedStyle(firstH).color,
        } : null,
        paragraph: firstP ? {
          text: firstP.textContent?.trim().slice(0, 100),
          fontFamily: getComputedStyle(firstP).fontFamily.slice(0, 100),
          fontSize: getComputedStyle(firstP).fontSize,
          color: getComputedStyle(firstP).color,
        } : null,
        button: firstBtn ? {
          text: firstBtn.textContent?.trim().slice(0, 50),
          bg: getComputedStyle(firstBtn).backgroundColor,
          color: getComputedStyle(firstBtn).color,
          borderRadius: getComputedStyle(firstBtn).borderRadius,
          padding: getComputedStyle(firstBtn).padding,
          fontSize: getComputedStyle(firstBtn).fontSize,
          fontWeight: getComputedStyle(firstBtn).fontWeight,
        } : null,
        html: sec.outerHTML.slice(0, 2000),
      });
    }

    // Cards
    const cardEls = document.querySelectorAll('[class*="card"], [class*="Card"], [class*="tile"], [class*="Tile"]');
    for (const card of Array.from(cardEls).slice(0, 5)) {
      const cs = getComputedStyle(card);
      result.cards.push({
        classes: card.className.slice(0, 200),
        bg: cs.backgroundColor,
        borderRadius: cs.borderRadius,
        boxShadow: cs.boxShadow,
        padding: cs.padding,
        html: card.outerHTML.slice(0, 1500),
      });
    }

    // All buttons
    const btns = document.querySelectorAll('a[class*="btn"], a[class*="Btn"], a[class*="cta"], a[class*="Cta"], [class*="button"], [class*="Button"]');
    for (const btn of Array.from(btns).slice(0, 8)) {
      const cs = getComputedStyle(btn);
      result.buttons.push({
        text: btn.textContent?.trim().slice(0, 40),
        bg: cs.backgroundColor,
        color: cs.color,
        borderRadius: cs.borderRadius,
        border: cs.border,
        padding: cs.padding,
        fontSize: cs.fontSize,
        fontFamily: cs.fontFamily.slice(0, 80),
        fontWeight: cs.fontWeight,
        classes: btn.className.slice(0, 200),
      });
    }

    return result;
  });

  console.log('\n=== NAV HTML ===');
  console.log(structure.nav.slice(0, 2000));
  console.log('\n=== HERO HTML ===');
  console.log(structure.hero.slice(0, 3000));
  console.log('\n=== SECTIONS ===');
  console.log(JSON.stringify(structure.sections, null, 2));
  console.log('\n=== CARDS ===');
  console.log(JSON.stringify(structure.cards, null, 2));
  console.log('\n=== BUTTONS ===');
  console.log(JSON.stringify(structure.buttons, null, 2));

  // Now visit a secondary page
  console.log('\nNavigating to /science-and-research...');
  await page.goto('https://www.lilly.com/our-science', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(3000);
  await page.screenshot({ path: '/Users/ereyes032/RFP Site/proposal-studio/scripts/lilly-science.png', fullPage: true });

  const scienceStructure = await page.evaluate(() => {
    const sections = [];
    const allSections = document.querySelectorAll('section, [class*="section"], [class*="block"], [class*="Block"]');
    for (const sec of Array.from(allSections).slice(0, 6)) {
      const cs = getComputedStyle(sec);
      const firstH = sec.querySelector('h1, h2, h3');
      sections.push({
        classes: sec.className.slice(0, 200),
        bg: cs.backgroundColor,
        padding: cs.padding,
        borderRadius: cs.borderRadius,
        heading: firstH ? {
          text: firstH.textContent?.trim().slice(0, 80),
          fontSize: getComputedStyle(firstH).fontSize,
          fontWeight: getComputedStyle(firstH).fontWeight,
          fontFamily: getComputedStyle(firstH).fontFamily.slice(0, 100),
          color: getComputedStyle(firstH).color,
          letterSpacing: getComputedStyle(firstH).letterSpacing,
        } : null,
      });
    }
    return sections;
  });

  console.log('\n=== SCIENCE PAGE SECTIONS ===');
  console.log(JSON.stringify(scienceStructure, null, 2));

  await browser.close();
}

study().catch(e => { console.error('Failed:', e.message); process.exit(1); });
