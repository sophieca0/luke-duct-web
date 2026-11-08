#!/usr/bin/env node
/*
 * Luke Duct website builder.
 * Edit the CONFIG and the EN / VI text below, then run:  node build.js
 * It writes index.html (English) and vi/index.html (Tiếng Việt).
 */
const fs = require('fs');
const path = require('path');

/* ====================== BUSINESS DETAILS ====================== */
const CONFIG = {
  company: 'Luke Duct',
  phoneDisplay: '0478 844 995',
  phoneIntl: '+61478844995',
  email: '',          // e.g. 'hello@lukeduct.com.au' (shown when filled)
  abn: '',            // e.g. '12 345 678 901'
  licence: '',        // shown as a credential chip when filled
  insurance: '',      // e.g. '$20M public liability'
  years: '',          // e.g. '10+'
  // Free form service: create an access key at https://web3forms.com (enter the email
  // that should receive enquiries), then paste the key here. While empty, the forms
  // open the visitor's SMS app with their details addressed to the phone above.
  web3formsKey: '',
  siteUrl: 'https://sophieca0.github.io/luke-duct-web/',
  // Project photos: put files in assets/photos/ and list them here.
  photos: [
    // { src: 'assets/photos/job1.jpg', en: ['Restaurant, Richmond', 'Exhaust hood and duct run'], vi: ['Nhà hàng, Richmond', 'Hood và tuyến ống hút khói'] },
  ],
  // Customer reviews (only real ones, with permission).
  reviews: [
    // { en: 'Quote...', vi: 'Nhận xét...', by: 'Name · Venue, Suburb' },
  ],
};

/* ====================== TEXT ====================== */
const EN = {
  htmlLang: 'en', ogLocale: 'en_AU',
  title: 'Luke Duct · Commercial Kitchen Exhaust & Fresh Air Systems, Victoria',
  metaDesc: 'Luke Duct fabricates and installs commercial kitchen exhaust and fresh air systems across Victoria. Takeaways, cafés, restaurants and large kitchens. Call 0478 844 995.',
  navSystem: 'The system', navProcess: 'Process', navContact: 'Contact', navWork: 'Work',
  call: 'Call', quote: 'Request a call back', quoteShort: 'Call me back',
  eyebrow: 'Commercial kitchen exhaust & fresh air · Victoria',
  h1a: 'Kitchen exhaust & fresh air,', h1b: 'made and installed right.',
  lede: 'We fabricate and install exhaust and fresh air systems for commercial kitchens across Victoria: takeaways, cafés, restaurants and large kitchens. Built to the drawings, finished neatly, with straight answers to your technical questions.',
  motionPause: 'Pause animation', motionPlay: 'Play animation',
  formTitle: 'Request a call back',
  formSub: "Leave your details and we'll call you back to talk through the job.",
  fName: "Your Name", fPhone: 'Phone', fEmail: 'Email', fContact: 'Phone or email', phContact: '04XX XXX XXX or email', contactHint: "Please provide at least one contact method – phone or email.", badEmail: 'Please check the email address.', fVenue: "Type of Kitchen", selectPh: 'Select…',
  phName: 'Full name', phPhone: '04XX XXX XXX', phEmail: 'name@example.com', phSuburb: 'e.g. Footscray',
  vTakeaway: 'Takeaway', vCafe: 'Café', vRestaurant: 'Restaurant', vHotel: 'Hotel', vSchool: 'School', vTruck: 'Food truck', vLarge: 'Large kitchen',
  fSuburb: 'Suburb', fDetails: "Project Details (Optional)",
  fDetailsPh: 'Hood size, cooking equipment, new fit-out or upgrade, where the exhaust should discharge…',
  fWant: 'What would you like?', wQuote: 'A quote', wCall: 'Call me back',
  fService: 'System needed', svExhaust: 'Exhaust', svFresh: 'Fresh air', svBoth: 'Both',
  fTime: "Best Time to Call", tAny: 'Any time', tMorning: 'Morning', tAfternoon: 'Afternoon', tEvening: 'After 5pm',
  plansT: 'Have plans or photos?', plansS: 'Text them to',
  send: 'Call me back', sending: 'Sending…', prefer: 'Prefer to talk?',
  required: 'Please enter your name, plus a phone number or email.',
  okSent: "Thanks! We've got your request and will call you back soon.",
  okSms: 'Your messaging app should open with your details. Just press send. If it does not, call us on',
  errSend: "Sorry, that didn't go through. Please call us on",
  smsHead: 'Website enquiry',
  trustDo: 'What we do', trustDoV: 'Exhaust + fresh air',
  trustMade: 'Made by us', trustMadeV: 'Custom fabrication',
  trustArea: 'Service area', areaVal: 'Victoria-wide',
  trustCall: 'Talk to us',
  trustLicence: 'Licence', trustInsured: 'Insured', trustExp: 'Experience', yearsUnit: 'years',
  scopeEyebrow: 'The system',
  scopeH2: 'Air out, fresh air in.',
  scopeSub: 'A commercial kitchen needs both: exhaust to pull smoke and grease-laden air out, and fresh air to replace it. We make and install the whole system.',
  fact1: 'Exhaust systems', fact2: 'Fresh air systems', fact3: 'Fabricated in-house', fact4: 'Victoria-wide',
  s1t: 'Hood', s1d: 'The exhaust starts at the hood over your cooking line.',
  s2t: 'Access hatches', s2d: 'Access for cleaning, where it is required.',
  s3t: 'Duct run', s3d: 'Straight runs and tidy joins, routed to the approved drawings.',
  s4t: 'Exhaust fan', s4d: 'Fan position set out on the drawings before anything is made.',
  s5t: 'Discharge', s5d: 'Roof, wall or shaft: the discharge point is planned up front.',
  s6t: 'Fresh air', s6d: 'A supply fan and duct bring clean outside air back into the kitchen.',
  dgLabel: 'Illustration of a typical commercial kitchen system, not to scale. Numbered 1 to 6: the hood over the cooking equipment, an access hatch on the vertical riser, the duct run above the ceiling, the exhaust fan, the discharge point, and the fresh air supply coming down into the kitchen.',
  dgTitle: 'TYPICAL KITCHEN SYSTEM', dgScale: 'NOT TO SCALE', dgCeiling: 'CEILING', dgExhaust: 'EXHAUST', dgFresh: 'FRESH AIR',
  workEyebrow: 'Our work', workH2: 'Look closely at the finish.', workSub: 'Real photos from our own jobs across Victoria.',
  ctaT: 'Planning a kitchen fit-out?', ctaS: "Leave your number and we'll call you back to talk through the job.",
  procEyebrow: 'Process', procH2: 'How a job runs', procLink: 'Start with step 01',
  st1t: 'Site measure', st1d: 'We visit, listen to what you need, measure, and check the duct routes, fresh air intake and where the exhaust discharges.',
  st2t: 'Quote', st2d: 'A clear quote for the whole scope of work.',
  st3t: 'Drawings', st3d: 'Drawings you can review before anything is made.',
  st4t: 'Fabrication', st4d: 'Ductwork and fittings made by us to the approved drawings.',
  st5t: 'Installation', st5d: 'Exhaust and fresh air installed neatly, with access for cleaning where it is required.',
  st6t: 'Handover', st6d: 'We walk through the finished job with you.',
  expEyebrow: 'Working with us', expH2: 'What you can expect',
  e1t: 'Neat, careful work', e1d: 'Straight runs, tight joins and a clean site when we leave. Every detail gets care, even the ones you will rarely see.',
  e2t: 'We make it ourselves', e2d: 'We fabricate the ductwork for your job ourselves, made to fit your kitchen and the approved drawings.',
  e3t: 'Exhaust and fresh air, one team', e3d: 'One team plans the air going out and the fresh air coming in, so the two systems are worked out together.',
  e4t: 'Straight technical answers', e4d: 'Routes, access and discharge are worked out on the drawings before anything is made, and your questions get clear answers.',
  proofH: 'In their words',
  contactEyebrow: 'Contact', contactH2: "Let's Talk About Your Kitchen",
  sendH: "Helpful information to have:",
  l1: "Site address",
  l2: "Available plans, including floor plans and mechanical drawings",
  l3: "Cooking equipment list or hood layout",
  l4: "Proposed exhaust discharge location (roof, wall or shaft)",
  l5: "Your target installation date",
  kPhone: 'Phone', kEmail: 'Email', kArea: "Service Area",
  langLabel: 'Language', home: 'Luke Duct home',
  rights: 'All rights reserved.',
  contactIntro: "Planning a new commercial kitchen or looking to upgrade your existing exhaust system? Get in touch and tell us a little about your project. The more details you can share, the better we can understand your requirements and prepare an accurate quote.",
  cFormTitle: "Request a Call Back",
  cFormSub: "Have a project in mind? Leave your details below and we'll get in touch to discuss it.",
  cSelectPh: "Select your kitchen type",
  cDetailsPh: "Tell us a little about your project, such as hood size, cooking equipment, whether it's a new fit-out or upgrade, and your preferred exhaust discharge location.",
  cSend: "Request a Call Back",
  preferC: "Prefer to speak with us directly?"
};

const VI = {
  htmlLang: 'vi', ogLocale: 'vi_VN',
  title: 'Luke Duct · Hệ thống hút khói & cấp gió tươi cho bếp thương mại tại Victoria',
  metaDesc: 'Luke Duct sản xuất và lắp đặt hệ thống hút khói và cấp gió tươi cho bếp thương mại khắp bang Victoria: tiệm takeaway, quán café, nhà hàng và bếp lớn. Gọi 0478 844 995.',
  navSystem: 'Hệ thống', navProcess: 'Quy trình', navContact: 'Liên hệ', navWork: 'Công trình',
  call: 'Gọi', quote: 'Yêu cầu gọi lại', quoteShort: 'Gọi lại cho tôi',
  eyebrow: 'Hút khói & cấp gió tươi bếp thương mại · Victoria',
  h1a: 'Hệ thống hút khói & gió tươi cho bếp,', h1b: 'sản xuất và lắp đặt tận tâm.',
  lede: 'Bên mình tự sản xuất và lắp đặt hệ thống hút khói và cấp gió tươi cho bếp thương mại trên khắp bang Victoria: tiệm takeaway, quán café, nhà hàng và bếp lớn. Làm đúng bản vẽ, thi công gọn đẹp, và trả lời thẳng thắn mọi câu hỏi kỹ thuật của anh chị.',
  motionPause: 'Tạm dừng hiệu ứng', motionPlay: 'Phát hiệu ứng',
  formTitle: 'Yêu cầu gọi lại',
  formSub: 'Để lại thông tin, bên mình sẽ gọi lại để trao đổi về công trình.',
  fName: 'Họ tên', fPhone: 'Số điện thoại', fEmail: 'Email', fContact: 'Điện thoại hoặc email', phContact: '04XX XXX XXX hoặc email', contactHint: "Vui lòng để lại ít nhất một cách liên hệ – điện thoại hoặc email.", badEmail: 'Email chưa đúng, anh chị kiểm tra lại giúp.', fVenue: 'Loại bếp', selectPh: 'Chọn…',
  phName: 'Họ và tên', phPhone: '04XX XXX XXX', phEmail: 'name@example.com', phSuburb: 'VD: Footscray',
  vTakeaway: 'Tiệm takeaway', vCafe: 'Quán café', vRestaurant: 'Nhà hàng', vHotel: 'Khách sạn', vSchool: 'Trường học', vTruck: 'Xe food truck', vLarge: 'Bếp lớn',
  fSuburb: 'Khu vực (suburb)', fDetails: 'Thông tin công trình (không bắt buộc)',
  fDetailsPh: 'Cỡ hood, thiết bị nấu, làm mới hay nâng cấp, nơi xả khí…',
  fWant: 'Anh chị cần gì?', wQuote: 'Báo giá', wCall: 'Gọi lại cho tôi',
  fService: 'Hệ thống cần làm', svExhaust: 'Hút khói', svFresh: 'Gió tươi', svBoth: 'Cả hai',
  fTime: 'Giờ tiện gọi', tAny: 'Giờ nào cũng được', tMorning: 'Buổi sáng', tAfternoon: 'Buổi chiều', tEvening: 'Sau 5 giờ chiều',
  plansT: 'Có bản vẽ hoặc ảnh?', plansS: 'Nhắn tin gửi qua số',
  send: 'Gọi lại cho tôi', sending: 'Đang gửi…', prefer: 'Muốn nói chuyện trực tiếp?',
  required: 'Anh chị vui lòng nhập họ tên, và số điện thoại hoặc email.',
  okSent: 'Cảm ơn anh chị! Bên mình đã nhận yêu cầu và sẽ gọi lại sớm.',
  okSms: 'Ứng dụng tin nhắn sẽ mở sẵn thông tin của anh chị, chỉ cần bấm gửi. Nếu không mở được, anh chị gọi',
  errSend: 'Xin lỗi, gửi chưa được. Anh chị vui lòng gọi',
  smsHead: 'Yêu cầu từ website',
  trustDo: 'Bên mình làm', trustDoV: 'Hút khói + gió tươi',
  trustMade: 'Tự sản xuất', trustMadeV: 'Gia công theo bản vẽ',
  trustArea: 'Khu vực phục vụ', areaVal: 'Toàn bang Victoria',
  trustCall: 'Gọi bên mình',
  trustLicence: 'Giấy phép', trustInsured: 'Bảo hiểm', trustExp: 'Kinh nghiệm', yearsUnit: 'năm',
  scopeEyebrow: 'Hệ thống',
  scopeH2: 'Hút khói ra, đưa gió tươi vào.',
  scopeSub: 'Bếp thương mại cần cả hai: hút khói và hơi dầu mỡ ra ngoài, và cấp gió tươi bù lại. Bên mình sản xuất và lắp đặt trọn bộ hệ thống.',
  fact1: 'Hệ thống hút khói', fact2: 'Hệ thống gió tươi', fact3: 'Tự gia công', fact4: 'Toàn bang Victoria',
  s1t: 'Hood', s1d: 'Đường hút bắt đầu từ hood phía trên khu nấu.',
  s2t: 'Cửa thăm', s2d: 'Chừa lối tiếp cận để vệ sinh khi cần.',
  s3t: 'Tuyến ống', s3d: 'Ống thẳng, mối nối gọn, đi đúng theo bản vẽ đã duyệt.',
  s4t: 'Quạt hút', s4d: 'Vị trí quạt được thể hiện trên bản vẽ trước khi sản xuất.',
  s5t: 'Cửa xả khí', s5d: 'Mái, tường hay hộp gen: điểm xả khí được tính trước.',
  s6t: 'Gió tươi', s6d: 'Quạt cấp và đường ống đưa không khí sạch từ ngoài vào bếp.',
  dgLabel: 'Hình minh họa hệ thống bếp thương mại điển hình, không theo tỷ lệ. Đánh số 1 đến 6: hood phía trên thiết bị nấu, cửa thăm trên ống đứng, tuyến ống trên trần, quạt hút, cửa xả khí, và đường cấp gió tươi đi xuống bếp.',
  dgTitle: 'HỆ THỐNG BẾP ĐIỂN HÌNH', dgScale: 'KHÔNG THEO TỶ LỆ', dgCeiling: 'TRẦN', dgExhaust: 'HÚT KHÓI', dgFresh: 'GIÓ TƯƠI',
  workEyebrow: 'Công trình', workH2: 'Xem kỹ phần hoàn thiện.', workSub: 'Ảnh thật từ chính các công trình bên mình đã làm ở Victoria.',
  ctaT: 'Đang chuẩn bị làm bếp?', ctaS: 'Để lại số điện thoại, bên mình sẽ gọi lại để trao đổi về công trình.',
  procEyebrow: 'Quy trình', procH2: 'Một công trình diễn ra thế nào', procLink: 'Bắt đầu từ bước 01',
  st1t: 'Đo đạc tại chỗ', st1d: 'Đến xem mặt bằng, lắng nghe nhu cầu, đo đạc, kiểm tra lối đi ống, chỗ lấy gió tươi và vị trí xả khí.',
  st2t: 'Báo giá', st2d: 'Báo giá rõ ràng cho toàn bộ phạm vi công việc.',
  st3t: 'Bản vẽ', st3d: 'Bản vẽ để anh chị xem trước khi bắt đầu làm.',
  st4t: 'Sản xuất', st4d: 'Bên mình tự gia công ống và phụ kiện theo đúng bản vẽ đã duyệt.',
  st5t: 'Lắp đặt', st5d: 'Lắp hút khói và gió tươi gọn gàng, chừa lối tiếp cận để vệ sinh khi cần.',
  st6t: 'Nghiệm thu', st6d: 'Cùng anh chị xem lại công trình đã hoàn thành.',
  expEyebrow: 'Làm việc cùng bên mình', expH2: 'Anh chị có thể trông đợi',
  e1t: 'Làm gọn, làm kỹ', e1d: 'Ống thẳng, mối nối khít, dọn dẹp sạch sẽ khi xong việc. Chi tiết nào cũng được chăm chút, kể cả những chỗ ít ai nhìn thấy.',
  e2t: 'Tự tay sản xuất', e2d: 'Bên mình tự gia công đường ống cho từng công trình, làm vừa với căn bếp và đúng bản vẽ đã duyệt.',
  e3t: 'Hút khói và gió tươi, một đội lo', e3d: 'Một đội tính cả đường khí thải ra lẫn gió tươi đưa vào, nên hai hệ thống được thiết kế ăn khớp với nhau.',
  e4t: 'Trả lời kỹ thuật rõ ràng', e4d: 'Tuyến ống, lối tiếp cận và điểm xả khí được tính trên bản vẽ trước khi làm; câu hỏi nào cũng được giải thích dễ hiểu.',
  proofH: 'Khách hàng nói gì',
  contactEyebrow: 'Liên hệ', contactH2: "Cùng trao đổi về căn bếp của anh chị",
  sendH: "Thông tin hữu ích nên chuẩn bị:",
  l1: "Địa chỉ công trình",
  l2: "Bản vẽ hiện có, gồm mặt bằng và bản vẽ cơ điện",
  l3: "Danh sách thiết bị nấu hoặc bố trí hood",
  l4: "Vị trí xả khí dự kiến (mái, tường hoặc hộp gen)",
  l5: "Ngày dự kiến lắp đặt",
  kPhone: 'Điện thoại', kEmail: 'Email', kArea: "Khu vực phục vụ",
  langLabel: 'Ngôn ngữ', home: 'Trang chủ Luke Duct',
  rights: 'Bảo lưu mọi quyền.',
  contactIntro: "Anh chị đang chuẩn bị làm bếp thương mại mới hoặc muốn nâng cấp hệ thống hút khói hiện có? Hãy liên hệ và kể sơ cho bên mình về công trình. Anh chị chia sẻ càng chi tiết, bên mình càng hiểu rõ yêu cầu và báo giá càng chính xác.",
  cFormTitle: "Yêu cầu gọi lại",
  cFormSub: "Anh chị có công trình cần làm? Để lại thông tin bên dưới, bên mình sẽ liên hệ để trao đổi.",
  cSelectPh: "Chọn loại bếp",
  cDetailsPh: "Kể sơ về công trình, như cỡ hood, thiết bị nấu, làm mới hay nâng cấp, và vị trí xả khí mong muốn.",
  cSend: "Yêu cầu gọi lại",
  preferC: "Muốn nói chuyện trực tiếp với bên mình?"
};

/* ====================== TEMPLATE ====================== */
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const ARROW = '<svg class="arr" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
const PHONE_IC = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/></svg>';
const SMOKE = (n) => '<div class="smoke" aria-hidden="true">' + '<i></i>'.repeat(n) + '</div>';

function page(T, lang) {
  const C = CONFIG;
  const R = lang === 'vi' ? '../' : '';            // path back to site root
  const tel = 'tel:' + C.phoneIntl;
  const sms = 'sms:' + C.phoneIntl;
  const pageUrl = C.siteUrl + (lang === 'vi' ? 'vi/' : '');

  const chip = (icon, k, v) => `<li><span class="tic"><svg viewBox="0 0 24 24" aria-hidden="true">${icon}</svg></span><span><span class="mono k">${k}</span><span class="v">${v}</span></span></li>`;
  const IC = {
    flow: '<path d="M3 8h12a3 3 0 1 0-3-3M3 16h15a3 3 0 1 1-3 3M3 12h18"/>',
    tool: '<path d="M14.5 6.5a4 4 0 0 0 5 5L11 20a2.1 2.1 0 0 1-3-3z"/>',
    pin: '<path d="M12 21s7-6.2 7-11a7 7 0 0 0-14 0c0 4.8 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>',
    phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
    badge: '<circle cx="12" cy="10" r="6"/><path d="M9 15l-1 6 4-2 4 2-1-6M9.5 10l2 2 3-3.5"/>',
    shield: '<path d="M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6z"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  };
  const chips = [
    chip(IC.flow, T.trustDo, esc(T.trustDoV)),
    chip(IC.tool, T.trustMade, esc(T.trustMadeV)),
    chip(IC.pin, T.trustArea, esc(T.areaVal)),
  ];
  if (C.licence) chips.push(chip(IC.badge, T.trustLicence, esc(C.licence)));
  if (C.insurance) chips.push(chip(IC.shield, T.trustInsured, esc(C.insurance)));
  if (C.years) chips.push(chip(IC.clock, T.trustExp, esc(/^\d+\+?$/.test(C.years) ? C.years + ' ' + T.yearsUnit : C.years)));
  if (chips.length < 4 || chips.length % 4 !== 0) chips.push(chip(IC.phone, T.trustCall, `<a class="v" href="${tel}">${esc(C.phoneDisplay)}</a>`));

  const photos = C.photos.map((p, i) => {
    const cap = p[lang] || p.en || ['', ''];
    return `<li class="tile t${i + 1}"><div class="ph"><img class="pimg" src="${R}${esc(p.src)}" alt="${esc(cap.filter(Boolean).join(', '))}" loading="lazy" decoding="async"></div><div class="cap"><strong>${esc(cap[0] || '')}</strong><span class="sm">${esc(cap[1] || '')}</span></div></li>`;
  }).join('\n');
  const reviews = C.reviews.map((r) => `<blockquote class="quote"><p>${esc((lang === 'vi' && r.vi) || r.en)}</p><span class="mono by">${esc(r.by)}</span></blockquote>`).join('\n');

  const venueList = (ph) => `<option value="" selected>${ph}</option>` + [T.vTakeaway, T.vCafe, T.vRestaurant, T.vHotel, T.vSchool, T.vTruck, T.vLarge].map((v) => `<option value="${v}">${v}</option>`).join('');
  const venueOpts = venueList(T.selectPh);
  const msgs = { badEmail: T.badEmail, required: T.required, okSent: T.okSent, okSms: T.okSms, errSend: T.errSend, sending: T.sending, smsHead: T.smsHead, phone: C.phoneDisplay, tel, sms, key: C.web3formsKey, company: C.company, pause: T.motionPause, play: T.motionPlay, labels: { name: T.fName, phone: T.fPhone, email: T.fEmail, suburb: T.fSuburb, kitchen_type: T.fVenue, request: T.fWant, system: T.fService, call_time: T.fTime, details: T.fDetails } };

  const ldjson = {
    '@context': 'https://schema.org', '@type': 'HVACBusiness', name: C.company, telephone: C.phoneIntl,
    url: pageUrl, areaServed: { '@type': 'State', name: 'Victoria, Australia' },
    description: EN.metaDesc,
  };
  if (C.email) ldjson.email = C.email;

  return `<!doctype html>
<html lang="${T.htmlLang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(T.title)}</title>
<meta name="description" content="${esc(T.metaDesc)}">
<link rel="canonical" href="${pageUrl}">
<link rel="alternate" hreflang="en-AU" href="${C.siteUrl}">
<link rel="alternate" hreflang="vi" href="${C.siteUrl}vi/">
<link rel="alternate" hreflang="x-default" href="${C.siteUrl}">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(T.title)}">
<meta property="og:description" content="${esc(T.metaDesc)}">
<meta property="og:url" content="${pageUrl}">
<meta property="og:locale" content="${T.ogLocale}">
<meta name="theme-color" content="#1C1B1A">
<link rel="icon" href="${R}assets/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@100..125,500..900&amp;family=IBM+Plex+Mono:wght@400;500&amp;family=Inter:wght@400..700&amp;display=swap">
<link rel="stylesheet" href="${R}assets/styles.css">
<script type="application/ld+json">${JSON.stringify(ldjson)}</script>
</head>
<body>
<div class="pg lang-${lang}" id="top" data-lang="${lang}" data-site="${esc(JSON.stringify(msgs))}">

  <header class="top">
    <div class="in top-in">
      <a class="logo" href="#top" aria-label="${esc(T.home)}">
        <span class="lg-mark"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12h13M12 6l6 6-6 6"/></svg></span>
        <span class="lname">${esc(C.company)}</span>
      </a>
      <nav class="nav" aria-label="Main">
        ${C.photos.length ? `<a href="#work">${T.navWork}</a>` : ''}
        <a href="#system">${T.navSystem}</a>
        <a href="#process">${T.navProcess}</a>
        <a href="#contact">${T.navContact}</a>
      </nav>
      <div class="top-r">
        <a class="btn btn-ghost btn-sm hdr-cta" href="${tel}">${PHONE_IC}<span>${esc(C.phoneDisplay)}</span></a>
        <a class="btn btn-primary btn-sm hdr-cta" href="#contact">${T.quote}</a>
        <button class="iconbtn js-motion" type="button" aria-label="${T.motionPause}" title="${T.motionPause}">
          <svg class="ic-pause" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="5" y="4" width="5" height="16" rx="1.5"/><rect x="14" y="4" width="5" height="16" rx="1.5"/></svg>
          <svg class="ic-play" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 4.5v15a1 1 0 0 0 1.5.9l12-7.5a1 1 0 0 0 0-1.8l-12-7.5A1 1 0 0 0 7 4.5z"/></svg>
        </button>
        <nav class="lang" aria-label="${T.langLabel}">
          <a href="${lang === 'vi' ? '../' : './'}" hreflang="en" lang="en"${lang === 'en' ? ' aria-current="page"' : ''}>EN</a>
          <a href="${lang === 'vi' ? './' : 'vi/'}" hreflang="vi" lang="vi"${lang === 'vi' ? ' aria-current="page"' : ''}>VI</a>
        </nav>
      </div>
    </div>
  </header>

  <section class="hero dark">
    ${SMOKE(7)}
    <div class="in in-w">
      <p class="tag">${T.eyebrow}</p>
      <h1 class="h1"><span class="l1">${T.h1a}</span> <span class="l2">${T.h1b}</span></h1>
      <p class="lede">${T.lede}</p>

      <div class="qwrap" id="quote">
        <p class="qcap"><strong>${T.formTitle}</strong> ${T.formSub}</p>
        <form class="qbar js-enquiry" novalidate>
          <input type="hidden" name="source" value="Hero form (${lang.toUpperCase()})">
          <label class="qf"><span class="ql">${T.fName}</span><input type="text" name="name" autocomplete="name" placeholder="${T.phName}" required></label>
          <label class="qf"><span class="ql">${T.fContact}</span><input type="text" name="contact" autocomplete="tel" placeholder="${T.phContact}"></label>
          <label class="qf"><span class="ql">${T.fVenue}</span><span class="sel"><select name="kitchen_type">${venueOpts}</select></span></label>
          <label class="qf"><span class="ql">${T.fSuburb}</span><input type="text" name="suburb" autocomplete="address-level2" placeholder="${T.phSuburb}"></label>
          <button class="btn btn-primary" type="submit">${T.send} ${ARROW}</button>
        </form>
        <p class="notice" role="status" hidden></p>
      </div>

      <p class="after">${T.prefer} <a href="${tel}">${T.call} ${esc(C.phoneDisplay)}</a></p>

      <ul class="tchips" aria-label="${T.trustDo}">
        ${chips.join('\n        ')}
      </ul>
    </div>
  </section>

  <main>
    ${C.photos.length ? `<section class="sec sheet light alt" id="work">
      <div class="in">
        <div class="shead"><p class="tag">${T.workEyebrow}</p><h2 class="h2">${T.workH2}</h2><p class="sub">${T.workSub}</p></div>
        <ul class="tiles">${photos}</ul>
      </div>
    </section>` : ''}

    <section class="sec sheet light" id="why">
      <div class="in">
        <div class="shead">
          <p class="tag">${T.expEyebrow}</p>
          <h2 class="h2">${T.expH2}</h2>
        </div>
        <div class="expect">
          <div class="fc"><span class="fic"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 16 16 3l5 5L8 21z M7 12l2 2 M10 9l2 2 M13 6l2 2"/></svg></span><h3>${T.e1t}</h3><p>${T.e1d}</p></div>
          <div class="fc"><span class="fic"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.5 6.5a4 4 0 0 0 5 5L11 20a2.1 2.1 0 0 1-3-3z"/></svg></span><h3>${T.e2t}</h3><p>${T.e2d}</p></div>
          <div class="fc"><span class="fic"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 8h12a3 3 0 1 0-3-3M3 16h15a3 3 0 1 1-3 3M3 12h18"/></svg></span><h3>${T.e3t}</h3><p>${T.e3d}</p></div>
          <div class="fc"><span class="fic"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v11H10l-4 4v-4H4z"/></svg></span><h3>${T.e4t}</h3><p>${T.e4d}</p></div>
        </div>
        ${C.reviews.length ? `<h3 class="mono proofh">${T.proofH}</h3><div class="quotes">${reviews}</div>` : ''}
        <div class="cta dark">
          ${SMOKE(5)}
          <div><h3>${T.ctaT}</h3><p>${T.ctaS}</p></div>
          <a class="btn btn-primary" href="#contact">${T.quote} ${ARROW}</a>
        </div>
      </div>
    </section>

    <section class="sec sheet dark" id="system">
      ${SMOKE(5)}
      <div class="in">
        <div class="shead">
          <p class="tag">${T.scopeEyebrow}</p>
          <h2 class="h2">${T.scopeH2}</h2>
          <p class="sub">${T.scopeSub}</p>
          <ul class="facts"><li>${T.fact1}</li><li>${T.fact2}</li><li>${T.fact3}</li><li>${T.fact4}</li></ul>
        </div>
        <div class="sgrid">
          <figure class="panel">
            <div class="dg">
              <svg viewBox="0 0 760 424" role="img" aria-label="${esc(T.dgLabel)}">
                <defs><filter id="gl" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="6"/></filter></defs>
                <polygon class="sv-glow mk m0" points="156,260 156,76 486,76 486,116 196,116 196,260" filter="url(#gl)"/>
                <rect class="sv-glow mk m0" x="486" y="56" width="72" height="80" rx="10" filter="url(#gl)"/>

                <line class="sv-line d1" pathLength="1" x1="24" y1="380" x2="736" y2="380"/>
                <rect class="sv-duct d1" pathLength="1" x="76" y="332" width="214" height="48" rx="8"/>
                <line class="sv-mut" x1="96" y1="346" x2="136" y2="346"/>
                <line class="sv-mut" x1="156" y1="346" x2="196" y2="346"/>
                <line class="sv-mut" x1="216" y1="346" x2="256" y2="346"/>
                <polygon class="sv-duct d2" pathLength="1" points="56,312 310,312 266,260 100,260"/>
                <polygon class="sv-duct d2" pathLength="1" points="156,260 156,76 486,76 486,116 196,116 196,260"/>
                <line class="sv-dash" x1="24" y1="178" x2="156" y2="178"/>
                <line class="sv-dash" x1="196" y1="178" x2="736" y2="178"/>
                <text class="sv-lbl" x="28" y="168">${T.dgCeiling}</text>
                <rect class="sv-duct d3" pathLength="1" x="486" y="56" width="72" height="80" rx="10"/>
                <circle class="sv-line d3" pathLength="1" cx="522" cy="96" r="22"/>
                <g class="fan"><line class="sv-line" x1="508" y1="82" x2="536" y2="110"/><line class="sv-line" x1="536" y1="82" x2="508" y2="110"/></g>
                <circle class="sv-dot" cx="522" cy="96" r="3"/>

                <!-- fresh air supply -->
                <rect class="sv-fa d3" pathLength="1" x="640" y="56" width="72" height="80" rx="10"/>
                <line class="sv-falv" x1="652" y1="74" x2="700" y2="74"/>
                <line class="sv-falv" x1="652" y1="86" x2="700" y2="86"/>
                <line class="sv-falv" x1="652" y1="98" x2="700" y2="98"/>
                <line class="sv-falv" x1="652" y1="110" x2="700" y2="110"/>
                <rect class="sv-fa d3" pathLength="1" x="660" y="136" width="32" height="96"/>
                <rect class="sv-fa d3" pathLength="1" x="644" y="232" width="64" height="10" rx="3"/>

                <g class="mk m6">
                  <path class="sv-fg" d="M176 322 L176 96 L486 96"/>
                  <path class="sv-flow" d="M176 322 L176 96 L486 96"/>
                  <path class="sv-flow2" d="M176 322 L176 96 L486 96"/>
                  <path class="wisp" d="M128 322 c7 -7 -7 -14 0 -21 c7 -7 -7 -14 0 -21"/>
                  <path class="wisp w2" d="M222 322 c7 -7 -7 -14 0 -21 c7 -7 -7 -14 0 -21"/>
                  <path class="wisp w3" d="M262 322 c7 -7 -7 -14 0 -21 c7 -7 -7 -14 0 -21"/>
                  <g class="sv-rise"><line class="sv-lead2" x1="522" y1="56" x2="522" y2="40"/><polygon class="sv-hot" points="514,40 522,18 530,40"/></g>
                  <path class="sv-fafg" d="M676 24 L676 300"/>
                  <path class="sv-faflow" d="M676 24 L676 300"/>
                  <polygon class="sv-fahot" points="668,30 684,30 676,50"/>
                  <polygon class="sv-fahot" points="668,280 684,280 676,300"/>
                </g>

                <g class="mk m1"><line class="sv-lead" x1="296.5" y1="296" x2="326" y2="296"/><circle class="sv-hot" cx="296.5" cy="296" r="4"/></g>
                <g class="mk m2"><rect class="sv-hot" x="191" y="198" width="10" height="44" rx="2"/><line class="sv-lead" x1="201" y1="220" x2="240" y2="220"/></g>
                <g class="mk m3"><line class="sv-lead" x1="340" y1="76" x2="340" y2="56"/><circle class="sv-hot" cx="340" cy="76" r="4"/></g>
                <g class="mk m4"><line class="sv-lead" x1="522" y1="136" x2="522" y2="150"/><circle class="sv-hot" cx="522" cy="136" r="4"/></g>
                <g class="mk m5"><line class="sv-lead" x1="526.4" y1="30" x2="548" y2="30"/><circle class="sv-hot" cx="526.4" cy="30" r="4"/></g>
                <g class="mk m5"><line class="sv-falead" x1="644" y1="237" x2="624" y2="237"/><circle class="sv-fahot" cx="644" cy="237" r="4"/></g>

                <line class="sv-line" x1="24" y1="396" x2="736" y2="396"/>
                <text class="sv-ttl" x="24" y="416">${T.dgTitle}</text>
                <text class="sv-lgd" x="300" y="416" fill="#FF6B3D">● ${T.dgExhaust}</text>
                <text class="sv-lgd" x="420" y="416" fill="#7CC0FF">● ${T.dgFresh}</text>
                <text class="sv-ttl" x="736" y="416" text-anchor="end">${T.dgScale}</text>
              </svg>
              <span class="pill p1" style="--x:330;--y:296;--k:0"><span class="pw"><span class="pi"><b>1</b><span class="pl">${T.s1t}</span></span></span></span>
              <span class="pill p2" style="--x:244;--y:220;--k:1"><span class="pw"><span class="pi"><b>2</b><span class="pl">${T.s2t}</span></span></span></span>
              <span class="pill p3 c" style="--x:340;--y:32;--k:2"><span class="pw"><span class="pi"><b>3</b><span class="pl">${T.s3t}</span></span></span></span>
              <span class="pill p4 c" style="--x:522;--y:162;--k:3"><span class="pw"><span class="pi"><b>4</b><span class="pl">${T.s4t}</span></span></span></span>
              <span class="pill p5" style="--x:552;--y:30;--k:4"><span class="pw"><span class="pi"><b>5</b><span class="pl">${T.s5t}</span></span></span></span>
              <span class="pill p6 r" style="--x:620;--y:237;--k:5"><span class="pw"><span class="pi"><b>6</b><span class="pl">${T.s6t}</span></span></span></span>
            </div>
          </figure>
          <ol class="parts">
            <li class="part" style="--k:0"><div class="pc"><span class="num" aria-hidden="true">1</span><div><h3>${T.s1t}</h3><p>${T.s1d}</p></div></div></li>
            <li class="part" style="--k:1"><div class="pc"><span class="num" aria-hidden="true">2</span><div><h3>${T.s2t}</h3><p>${T.s2d}</p></div></div></li>
            <li class="part" style="--k:2"><div class="pc"><span class="num" aria-hidden="true">3</span><div><h3>${T.s3t}</h3><p>${T.s3d}</p></div></div></li>
            <li class="part" style="--k:3"><div class="pc"><span class="num" aria-hidden="true">4</span><div><h3>${T.s4t}</h3><p>${T.s4d}</p></div></div></li>
            <li class="part" style="--k:4"><div class="pc"><span class="num" aria-hidden="true">5</span><div><h3>${T.s5t}</h3><p>${T.s5d}</p></div></div></li>
            <li class="part fa" style="--k:5"><div class="pc"><span class="num" aria-hidden="true">6</span><div><h3>${T.s6t}</h3><p>${T.s6d}</p></div></div></li>
          </ol>
        </div>
      </div>
    </section>

    <section class="sec sheet light alt" id="process">
      <div class="in">
        <div class="shead"><p class="tag">${T.procEyebrow}</p><h2 class="h2">${T.procH2}</h2></div>
        <ol class="steps">
          <li class="step" style="--k:0"><div class="sc"><div class="top2"><span class="ic"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 8h18v8H3z M7 8v3 M11 8v4 M15 8v3 M19 8v4"/></svg></span><span class="n" aria-hidden="true">01</span></div><h3>${T.st1t}</h3><p>${T.st1d}</p></div></li>
          <li class="step" style="--k:1"><div class="sc"><div class="top2"><span class="ic"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h9l4 4v14H6z M15 3v4h4 M9 12h7 M9 16h7"/></svg></span><span class="n" aria-hidden="true">02</span></div><h3>${T.st2t}</h3><p>${T.st2d}</p></div></li>
          <li class="step" style="--k:2"><div class="sc"><div class="top2"><span class="ic"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20l1-4L16 5l3 3L8 19z M14 7l3 3"/></svg></span><span class="n" aria-hidden="true">03</span></div><h3>${T.st3t}</h3><p>${T.st3d}</p></div></li>
          <li class="step" style="--k:3"><div class="sc"><div class="top2"><span class="ic"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M12 3v3 M12 18v3 M3 12h3 M18 12h3 M5.6 5.6l2.1 2.1 M16.3 16.3l2.1 2.1 M18.4 5.6l-2.1 2.1 M7.7 16.3l-2.1 2.1"/></svg></span><span class="n" aria-hidden="true">04</span></div><h3>${T.st4t}</h3><p>${T.st4d}</p></div></li>
          <li class="step" style="--k:4"><div class="sc"><div class="top2"><span class="ic"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.5 6.5a4 4 0 0 0 5 5L11 20a2.1 2.1 0 0 1-3-3z"/></svg></span><span class="n" aria-hidden="true">05</span></div><h3>${T.st5t}</h3><p>${T.st5d}</p></div></li>
          <li class="step" style="--k:5"><div class="sc"><div class="top2"><span class="ic"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M8 12.5l2.7 2.7L16 9.5"/></svg></span><span class="n" aria-hidden="true">06</span></div><h3>${T.st6t}</h3><p>${T.st6d}</p></div></li>
        </ol>
        <div class="center"><a class="btn btn-dark" href="#contact">${T.procLink} ${ARROW}</a></div>
      </div>
    </section>
  </main>

  <section class="sec sheet dark contact" id="contact">
    ${SMOKE(5)}
    <div class="in in-w contact-in">
      <div class="contact-l">
        <p class="tag">${T.contactEyebrow}</p>
        <h2 class="h2">${T.contactH2}</h2>
        <p class="lede cintro">${T.contactIntro}</p>
        <h3 class="sendh">${T.sendH}</h3>
        <ul class="sendlist"><li>${T.l1}</li><li>${T.l2}</li><li>${T.l3}</li><li>${T.l4}</li><li>${T.l5}</li></ul>
        <div class="reach">
          <div class="r"><span class="mono k">${T.kPhone}</span><a class="big" href="${tel}">${esc(C.phoneDisplay)}</a></div>
          ${C.email ? `<div class="r"><span class="mono k">${T.kEmail}</span><a class="v" href="mailto:${esc(C.email)}">${esc(C.email)}</a></div>` : ''}
          <div class="r"><span class="mono k">${T.kArea}</span><span>${T.areaVal}</span></div>
        </div>
      </div>

      <div class="contact-r">
        <div class="fcard">
          <h2>${T.cFormTitle}</h2>
          <p class="sub">${T.cFormSub}</p>
          <form class="form js-enquiry" novalidate>
            <input type="hidden" name="source" value="Contact form (${lang.toUpperCase()})">
            <input type="hidden" name="request" value="${T.wCall}">
            <div class="row2">
              <div class="field"><label for="c-name">${T.fName} <span class="req" aria-hidden="true">*</span></label><input id="c-name" type="text" name="name" autocomplete="name" placeholder="${T.phName}" required></div>
              <div class="field"><label for="c-suburb">${T.fSuburb}</label><input id="c-suburb" type="text" name="suburb" autocomplete="address-level2" placeholder="${T.phSuburb}"></div>
            </div>
            <div class="contactpair">
              <div class="row2">
                <div class="field"><label for="c-phone">${T.fPhone}</label><input id="c-phone" type="tel" name="phone" autocomplete="tel" placeholder="${T.phPhone}" aria-describedby="c-hint"></div>
                <div class="field"><label for="c-email">${T.fEmail}</label><input id="c-email" type="email" name="email" autocomplete="email" placeholder="${T.phEmail}" aria-describedby="c-hint"></div>
              </div>
              <p class="hint" id="c-hint">${T.contactHint}</p>
            </div>
            <div class="row2">
              <div class="field"><label for="c-venue">${T.fVenue}</label><span class="sel"><select id="c-venue" name="kitchen_type">${venueList(T.cSelectPh)}</select></span></div>
              <div class="field"><label for="c-time">${T.fTime}</label><span class="sel"><select id="c-time" name="call_time"><option value="${T.tAny}">${T.tAny}</option><option value="${T.tMorning}">${T.tMorning}</option><option value="${T.tAfternoon}">${T.tAfternoon}</option><option value="${T.tEvening}">${T.tEvening}</option></select></span></div>
            </div>
            <div class="field"><label for="c-details">${T.fDetails}</label><textarea id="c-details" name="details" rows="3" placeholder="${T.cDetailsPh}"></textarea></div>
            <button class="btn btn-primary btn-block" type="submit">${T.cSend} ${ARROW}</button>
          </form>
          <p class="notice" role="status" hidden></p>
          <p class="talk">${T.preferC} <a href="${tel}">${T.call} ${esc(C.phoneDisplay)}</a>.</p>
        </div>
      </div>
    </div>
  </section>

  <footer class="foot dark">
    <div class="in">
      <span>© ${new Date().getFullYear()} ${esc(C.company)}${C.abn ? ' · ABN ' + esc(C.abn) : ''} · ${T.rights}</span>
      <span>${T.areaVal} · <a href="${tel}">${esc(C.phoneDisplay)}</a></span>
    </div>
  </footer>

  <div class="stickybar">
    <a class="btn btn-ghost btn-sm" href="${tel}">${PHONE_IC} ${T.call}</a>
    <a class="btn btn-primary btn-sm" href="#contact">${T.quoteShort}</a>
  </div>

</div>
<script src="${R}assets/main.js" defer></script>
</body>
</html>
`;
}

const root = __dirname;
fs.writeFileSync(path.join(root, 'index.html'), page(EN, 'en'));
fs.mkdirSync(path.join(root, 'vi'), { recursive: true });
fs.writeFileSync(path.join(root, 'vi', 'index.html'), page(VI, 'vi'));
console.log('Built index.html and vi/index.html');

/* ---- private preview: one self-contained page with both languages (#en / #vi) ---- */
function bodyOf(html) { return html.slice(html.indexOf('<body>\n') + 7, html.indexOf('\n<script src=')); }
function forPreview(html, lang) {
  let b = bodyOf(html).replace(/href="[^"]*" hreflang="(en|vi)"/g, 'href="#$1" hreflang="$1"');
  if (lang === 'vi') {
    b = b.replace(/ id="([^"]+)"/g, ' id="vi-$1"').replace(/ for="([^"]+)"/g, ' for="vi-$1"')
      .replace(/href="#(?!en"|vi")([^"]+)"/g, 'href="#vi-$1"').replace(/url\(#gl\)/g, 'url(#vi-gl)')
      .replace('<div class="pg', '<div hidden class="pg');
  }
  return b;
}
const css = fs.readFileSync(path.join(root, 'assets', 'styles.css'), 'utf8');
const js = fs.readFileSync(path.join(root, 'assets', 'main.js'), 'utf8');
const preview = `<title>Luke Duct Website</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@100..125,500..900&amp;family=IBM+Plex+Mono:wght@400;500&amp;family=Inter:wght@400..700&amp;display=swap">
<style>
:root{color-scheme:dark}
${css}
</style>
${forPreview(page(EN, 'en'), 'en')}
${forPreview(page(VI, 'vi'), 'vi')}
<script>
${js}
(function () {
  function show() {
    var h = location.hash.slice(1);
    if (h !== 'en' && h !== 'vi') return;
    document.querySelectorAll('.pg[data-lang]').forEach(function (p) { p.hidden = p.getAttribute('data-lang') !== h; });
    document.documentElement.lang = h;
    window.scrollTo(0, 0);
  }
  window.addEventListener('hashchange', show);
  show();
})();
</script>
`;
fs.mkdirSync(path.join(root, 'preview'), { recursive: true });
fs.writeFileSync(path.join(root, 'preview', 'luke-duct-preview.html'), preview);
console.log('Built preview/luke-duct-preview.html');
