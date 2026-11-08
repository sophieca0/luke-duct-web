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
  phoneDisplay: '0466 404 868',
  phoneIntl: '+61466404868',
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
  // Project photos (files in assets/photos/). The gallery page shows every photo;
  // the home page shows the ones marked home: true (up to 8).
  // cat: canopies | ductwork | roof | fitout  (used by the gallery filter buttons)
  photos: [
    { src: 'assets/photos/p51.jpg', cat: 'canopies', home: true, en: "Finished stainless steel canopy with wall sheeting", vi: "Chụp hút inox hoàn thiện với tấm ốp tường" },
    { src: 'assets/photos/p59.jpg', cat: 'roof', home: true, en: "Rooftop exhaust discharge at dusk", vi: "Điểm xả khí trên mái lúc hoàng hôn" },
    { src: 'assets/photos/p42.jpg', cat: 'canopies', home: true, en: "Long canopy in a finished commercial kitchen", vi: "Chụp hút dài trong bếp thương mại đã hoàn thiện" },
    { src: 'assets/photos/p39.jpg', cat: 'ductwork', home: true, en: "Galvanised exhaust riser on an external wall", vi: "Ống đứng tôn mạ kẽm chạy dọc tường ngoài" },
    { src: 'assets/photos/p58.jpg', cat: 'canopies', home: true, en: "Canopy with fresh air supply grilles and wall sheeting", vi: "Chụp hút với miệng cấp gió tươi và tấm ốp tường" },
    { src: 'assets/photos/p31.jpg', cat: 'canopies', home: true, en: "Canopy fabricated in our workshop, ready for delivery", vi: "Chụp hút gia công tại xưởng, sẵn sàng giao" },
    { src: 'assets/photos/p38.jpg', cat: 'roof', home: true, en: "Exhaust fan and ductwork on a roof beside solar panels", vi: "Quạt hút và đường ống trên mái cạnh pin mặt trời" },
    { src: 'assets/photos/p49.jpg', cat: 'ductwork', home: true, en: "Large ductwork rising to a high warehouse ceiling", vi: "Đường ống lớn đi lên trần nhà xưởng cao" },
    { src: 'assets/photos/p02.jpg', cat: 'canopies', en: "Stainless steel canopy and wall sheet", vi: "Chụp hút inox và tấm ốp tường" },
    { src: 'assets/photos/p44.jpg', cat: 'roof', en: "Two exhaust cowls on a grey metal roof", vi: "Hai chụp xả khí trên mái tôn xám" },
    { src: 'assets/photos/p40.jpg', cat: 'ductwork', en: "Canopy and twin risers in a warehouse kitchen", vi: "Chụp hút và hai ống đứng trong bếp nhà xưởng" },
    { src: 'assets/photos/p46.jpg', cat: 'canopies', en: "Long canopy in a bright commercial kitchen", vi: "Chụp hút dài trong bếp thương mại sáng sủa" },
    { src: 'assets/photos/p60.jpg', cat: 'roof', en: "Rooftop exhaust fan in the country", vi: "Quạt hút trên mái ở vùng ngoại ô" },
    { src: 'assets/photos/p08.jpg', cat: 'ductwork', en: "Twin ducts running up a brick wall", vi: "Hai đường ống chạy dọc tường gạch" },
    { src: 'assets/photos/p17.jpg', cat: 'canopies', en: "Canopy over twin tandoor ovens", vi: "Chụp hút phía trên hai lò tandoor" },
    { src: 'assets/photos/p54.jpg', cat: 'roof', en: "Rooftop fan and ductwork among brick buildings", vi: "Quạt hút và đường ống trên mái giữa các toà nhà gạch" },
    { src: 'assets/photos/p10.jpg', cat: 'fitout', en: "Kitchen with two canopies and wall sheeting", vi: "Bếp với hai chụp hút và tấm ốp tường" },
    { src: 'assets/photos/p41.jpg', cat: 'roof', en: "Three exhaust discharges on a roof at night", vi: "Ba điểm xả khí trên mái vào ban đêm" },
    { src: 'assets/photos/p09.jpg', cat: 'canopies', en: "Island canopy with grease filters", vi: "Chụp hút đảo với lưới lọc mỡ" },
    { src: 'assets/photos/p48.jpg', cat: 'roof', en: "Exhaust fan and ductwork on a commercial roof", vi: "Quạt hút và đường ống trên mái khu thương mại" },
    { src: 'assets/photos/p53.jpg', cat: 'fitout', en: "Stainless wall sheeting with a curved archway", vi: "Tấm ốp inox với vòm cong" },
    { src: 'assets/photos/p03.jpg', cat: 'ductwork', en: "Galvanised duct riser with a curved bend", vi: "Ống đứng tôn mạ kẽm với đoạn co cong" },
    { src: 'assets/photos/p07.jpg', cat: 'roof', en: "Exhaust discharge cowl on a corrugated roof", vi: "Chụp xả khí trên mái tôn" },
    { src: 'assets/photos/p57.jpg', cat: 'canopies', en: "Compact canopy with wall sheeting", vi: "Chụp hút nhỏ gọn với tấm ốp tường" },
    { src: 'assets/photos/p45.jpg', cat: 'ductwork', en: "Canopy with ductwork rising into the ceiling", vi: "Chụp hút với đường ống đi lên trần" },
    { src: 'assets/photos/p16.jpg', cat: 'roof', en: "Exhaust ductwork on a city rooftop", vi: "Đường ống xả trên mái nhà trong thành phố" },
    { src: 'assets/photos/p52.jpg', cat: 'canopies', en: "Long canopy with grease filters", vi: "Chụp hút dài với lưới lọc mỡ" },
    { src: 'assets/photos/p36.jpg', cat: 'fitout', en: "Stainless steel benches and wall sheeting in a new fit-out", vi: "Bàn và tấm ốp inox trong bếp mới" },
    { src: 'assets/photos/p20.jpg', cat: 'roof', en: "Two exhaust stacks on a roof at night", vi: "Hai ống xả trên mái vào ban đêm" },
    { src: 'assets/photos/p01.jpg', cat: 'canopies', en: "Canopy with stainless wall sheet below", vi: "Chụp hút với tấm ốp inox bên dưới" },
    { src: 'assets/photos/p56.jpg', cat: 'ductwork', en: "Ductwork run across a concrete ceiling", vi: "Tuyến ống đi trên trần bê tông" },
    { src: 'assets/photos/p21.jpg', cat: 'fitout', en: "Wash-up area with stainless sink and wall sheeting", vi: "Khu rửa với bồn inox và tấm ốp tường" },
    { src: 'assets/photos/p26.jpg', cat: 'canopies', en: "Long canopy mounted high, protective film still on", vi: "Chụp hút dài lắp trên cao, còn màng bảo vệ" },
    { src: 'assets/photos/p30.jpg', cat: 'fitout', en: "Small kitchen lined with stainless sheeting and a sink", vi: "Bếp nhỏ ốp inox có bồn rửa" },
    { src: 'assets/photos/p05.jpg', cat: 'canopies', en: "Canopy with filters installed, protective film still on", vi: "Chụp hút đã lắp lưới lọc, còn màng bảo vệ" },
    { src: 'assets/photos/p32.jpg', cat: 'fitout', en: "Large kitchen fit-out with wall sheeting", vi: "Bếp lớn đang hoàn thiện với tấm ốp tường" },
    { src: 'assets/photos/p35.jpg', cat: 'canopies', en: "New canopy in a working kitchen", vi: "Chụp hút mới trong bếp đang hoạt động" },
    { src: 'assets/photos/p43.jpg', cat: 'fitout', en: "Wall sheeting under a canopy, ceiling in progress", vi: "Tấm ốp tường dưới chụp hút, trần đang làm" },
    { src: 'assets/photos/p27.jpg', cat: 'canopies', en: "Canopy and wall sheeting under exposed services", vi: "Chụp hút và tấm ốp tường dưới trần kỹ thuật" },
    { src: 'assets/photos/p50.jpg', cat: 'fitout', en: "New stainless shelving in a working kitchen", vi: "Kệ inox mới trong bếp đang hoạt động" },
    { src: 'assets/photos/p04.jpg', cat: 'fitout', en: "Kitchen fit-out with ceiling grilles", vi: "Bếp đang hoàn thiện với miệng gió trên trần" },
    { src: 'assets/photos/p37.jpg', cat: 'canopies', en: "Canopy with wall sheeting, film still on", vi: "Chụp hút với tấm ốp tường, còn màng bảo vệ" },
    { src: 'assets/photos/p29.jpg', cat: 'fitout', en: "Room fully lined with stainless sheeting", vi: "Phòng ốp inox toàn bộ" },
    { src: 'assets/photos/p34.jpg', cat: 'canopies', en: "Long canopy seen from below", vi: "Chụp hút dài nhìn từ dưới lên" },
    { src: 'assets/photos/p47.jpg', cat: 'fitout', en: "Small kitchen with a corner canopy", vi: "Bếp nhỏ với chụp hút góc" },
    { src: 'assets/photos/p19.jpg', cat: 'canopies', en: "Canopy and wall sheet on a feature wall", vi: "Chụp hút và tấm ốp trên tường màu" },
    { src: 'assets/photos/p28.jpg', cat: 'fitout', en: "Canopy upgrade with new wall sheeting", vi: "Thay chụp hút với tấm ốp tường mới" },
    { src: 'assets/photos/p55.jpg', cat: 'canopies', en: "Canopy with wall sheeting during construction", vi: "Chụp hút với tấm ốp tường trong lúc thi công" },
    { src: 'assets/photos/p18.jpg', cat: 'fitout', en: "Canopy with a long run of wall sheeting", vi: "Chụp hút với dãy tấm ốp tường dài" },
  ],
  // Customer reviews (only real ones, with permission).
  reviews: [
    // { en: 'Quote...', vi: 'Nhận xét...', by: 'Name · Venue, Suburb' },
  ],
};

/* ====================== TEXT ====================== */
const EN = {
  htmlLang: 'en', ogLocale: 'en_AU',
  title: "Luke Duct · Commercial Kitchen Exhaust & Fresh Air Systems in Victoria",
  metaDesc: "Luke Duct fabricates and installs commercial kitchen exhaust and fresh air systems across Victoria, with practical advice and neat, careful workmanship. Call 0466 404 868.",
  navSystem: "The System", navProcess: "Process", navContact: "Contact", navWork: "Our Work",
  call: 'Call', quote: "Request a Call Back", quoteShort: "Request a Call Back",
  eyebrow: "Commercial kitchen exhaust & fresh air · Victoria",
  h1a: "Commercial Kitchen Exhaust & Fresh Air,", h1b: "Done Right.",
  lede: "We fabricate and install exhaust and fresh air systems for cafés, takeaways, restaurants and large commercial kitchens across Victoria. Luke brings strong technical experience, practical advice and neat, careful workmanship to every job – from straightforward installs to the tricky ones.",
  motionPause: 'Pause animation', motionPlay: 'Play animation',
  formTitle: 'Request a call back',
  formSub: "Leave your details and we'll call you back to talk through the job.",
  fName: "Your Name", fPhone: "Phone", fEmail: "Email", fContact: "Phone or Email", phContact: "Number or email", contactHint: "Please provide at least one contact method – phone or email.", badEmail: "That email address doesn't look quite right. Please check it and try again.", fVenue: "Type of Kitchen", selectPh: "Select…",
  phName: 'Full name', phPhone: '04XX XXX XXX', phEmail: 'name@example.com', phSuburb: 'e.g. Footscray',
  vTakeaway: 'Takeaway', vCafe: 'Café', vRestaurant: 'Restaurant', vHotel: 'Hotel', vSchool: 'School', vTruck: 'Food truck', vLarge: 'Large kitchen', vOther: 'Others',
  fSuburb: "Suburb", fDetails: "Project Details (Optional)",
  fDetailsPh: 'Hood size, cooking equipment, new fit-out or upgrade, where the exhaust should discharge…',
  fWant: 'What would you like?', wQuote: 'A quote', wCall: 'Call me back',
  fService: 'System needed', svExhaust: 'Exhaust', svFresh: 'Fresh air', svBoth: 'Both',
  fTime: "Best Time to Call", tAny: 'Any time', tMorning: 'Morning', tAfternoon: 'Afternoon', tEvening: 'After 5pm',
  plansT: 'Have plans or photos?', plansS: 'Text them to',
  send: "Request a Call Back", sending: "Sending…", prefer: 'Prefer to talk?',
  required: "Please add your name and a phone number or email so we can get back to you.",
  okSent: "Thanks, we've received your details. We'll be in touch soon to talk it through.",
  okSms: "Your messaging app should open with your details ready to send – just press send. If it doesn't open, give us a call on",
  errSend: "Sorry, something went wrong sending your request. Please try again, or call us on",
  smsHead: "Call back request from the website",
  trustDo: 'What we do', trustDoV: 'Exhaust + fresh air',
  trustMade: 'Made by us', trustMadeV: 'Custom fabrication',
  trustArea: 'Service area', areaVal: "Victoria-wide",
  trustCall: 'Talk to us',
  trustLicence: 'Licence', trustInsured: 'Insured', trustExp: 'Experience', yearsUnit: 'years',
  scopeEyebrow: "The system",
  scopeH2: "Air Out, Fresh Air In.",
  scopeSub: "A commercial kitchen needs a properly planned ventilation system. The exhaust removes smoke, heat and grease-laden air, while the fresh air system brings clean outside air back into the kitchen.",
  fact1: 'Exhaust systems', fact2: 'Fresh air systems', fact3: 'Fabricated in-house', fact4: 'Victoria-wide',
  s1t: "Fire-Rated Wall Sheet", s1d: "Fire-rated sheeting on the wall behind the cooking line, below the canopy, to help protect the wall from heat.",
  s2t: "Canopy", s2d: "Sits over the cooking line and captures smoke, heat and grease-laden air where it starts.",
  s3t: "Access Panel", s3d: "Placed along the duct where needed, so the system can be inspected and cleaned.",
  s4t: "Ductwork", s4d: "Carries the exhaust air from the canopy to the fan, routed neatly to the approved drawings.",
  s5t: "Exhaust Fan", s5d: "Draws air through the system. Its position is set out on the drawings before anything is made.",
  s6t: "Discharge Point", s6d: "Where the exhaust leaves the building – roof, wall or shaft – planned from the start.",
  dgLabel: "Illustration of a typical commercial kitchen system, not to scale. Numbered 1 to 7: the fire-rated wall sheet behind the cooking line under the canopy, the canopy over the cooking equipment, an access panel on the vertical riser, the ductwork above the ceiling, the exhaust fan, the discharge point, and the fresh air supply coming down into the kitchen.",
  dgTitle: 'TYPICAL KITCHEN SYSTEM', dgScale: 'NOT TO SCALE', dgCeiling: 'CEILING', dgExhaust: 'EXHAUST', dgFresh: 'FRESH AIR',
  workEyebrow: "Our work", workH2: "Look Closely at the Finish.", workSub: "Real photos from our own jobs across Victoria. Tap any photo to see it larger.",
  ctaT: "Planning a New Kitchen or Upgrading an Existing One?", ctaS: "Whether you're fitting out a new commercial kitchen or upgrading an existing system, getting the exhaust and fresh air right from the start makes a difference.",
  procEyebrow: "Process", procH2: "From First Visit to Final Handover.", procLink: 'Start with step 01',
  st1t: "Site Measure", st1d: "We visit, measure and check the duct routes, fresh air intake and discharge point.",
  st2t: "Quote", st2d: "A clear quote that sets out the full scope of work.",
  st3t: "Drawings", st3d: "Drawings to review, so any changes are sorted before anything is made.",
  st4t: "Fabrication", st4d: "Ductwork and fittings made in-house to the approved drawings.",
  st5t: "Installation", st5d: "Installed neatly and carefully, with updates as the job progresses.",
  st6t: "Handover", st6d: "We walk you through the finished work and make sure you're happy.",
  expEyebrow: "Why work with Luke Duct?", expH2: "More Than Just Installation.",
  e1t: "Quality Workmanship, Down to the Details", e1d: "Neatly routed ductwork, clean joins and careful finishing. We want the finished work to look as good as it performs.",
  e2t: "Practical Advice That Works for You", e2d: "We take the time to understand your project, talk through the options and find the right solution – not just the easiest one.",
  e3t: "Technical Experience for Challenging Jobs", e3d: "Luke's hands-on technical background helps us plan carefully and find practical solutions when a site isn't straightforward.",
  e4t: "Your Satisfaction Matters", e4d: "Clear communication from the first chat to handover, and a result we're both proud of.",
  proofH: 'In their words',
  contactEyebrow: "Contact", contactH2: "Let's Talk About Your Kitchen.",
  sendH: "Helpful information to have:",
  l1: "Site address",
  l2: "Floor plans and mechanical drawings",
  l3: "Cooking equipment list or hood layout",
  l4: "Proposed exhaust discharge location (roof, wall or shaft)",
  l5: "Target installation date",
  kPhone: "Phone", kEmail: 'Email', kArea: "Service Area",
  langLabel: 'Language', home: 'Luke Duct home',
  rights: "All rights reserved.",
  contactIntro: "Planning a new commercial kitchen or looking to upgrade your existing exhaust and fresh air system?",
  cFormTitle: "Request a Call Back",
  cFormSub: "Have a project in mind? Leave your details below and we'll get in touch to talk it through.",
  cSelectPh: "Select your kitchen type",
  cDetailsPh: "Tell us a little about your project – hood size, cooking equipment, new fit-out or upgrade, and where the exhaust should discharge.",
  cSend: "Request a Call Back",
  preferC: "Prefer to speak with us directly?",
  navWhy: "Why Us",
  lede2: "With strong technical experience and a hands-on approach, Luke brings practical advice, quality workmanship and attention to detail to every project – from straightforward installations to more challenging jobs.",
  heroFormT: "Let's Talk About Your Project",
  heroFormS: "Tell us a little about your kitchen and what you're planning. We'll get in touch to discuss your needs and how we can help.",
  hl1: "Exhaust & Fresh Air Systems",
  hl2: "Custom Fabrication",
  hl3: "Made In-House",
  hl4: "Servicing All of Victoria",
  hlLabel: "What we do",
  expSub: "A good result takes the right technical knowledge, practical thinking and care in every detail.",
  expSub2: "Here's what you can expect when working with Luke Duct.",
  ctaS2: "Let's talk through your plans and work out a practical solution for your space.",
  scopeSub2: "Both systems need to work together. We fabricate and install the complete exhaust and fresh air setup, planned to suit your kitchen and project requirements.",
  procSub: "We keep the process straightforward and make sure the important details are worked through before the installation begins.",
  contactIntro2: "Tell us a little about your project. We'll take the time to understand what you need and discuss the best way to approach the job.",
  footTag: "Commercial Kitchen Exhaust & Fresh Air Systems",
  navLabel: 'Main menu',
  s7t: "Fresh Air Supply",
  s7d: "A supply fan and ductwork bring clean outside air back into the kitchen to replace what is exhausted.",
  dgWall: "WALL SHEET",
  photoAlt: "Luke Duct installation photo",
  enlarge: "View larger photo",
  lbClose: "Close",
  lbPrev: "Previous photo",
  lbNext: "Next photo",
  viewAll: "View the Full Gallery",
  galTitle: "Project Gallery · Luke Duct · Commercial Kitchen Exhaust, Victoria",
  galMeta: "Photos of commercial kitchen canopies, ductwork, roof discharge and fit-outs fabricated and installed by Luke Duct across Victoria.",
  galEyebrow: "Project gallery",
  galH1: "Our Work, Up Close.",
  galSub: "Canopies, ductwork, roof discharge and kitchen fit-outs from jobs across Victoria. Tap any photo to see it larger.",
  galFilter: "Filter photos",
  catAll: "All",
  catCanopies: "Canopies",
  catDuct: "Ductwork",
  catRoof: "Roof & Discharge",
  catFitout: "Kitchen Fit-outs",
  galCtaT: "Like What You See?",
  galCtaS: "Tell us about your kitchen and we'll get in touch to talk it through.",
  galBack: "Back to home"
};

const VI = {
  htmlLang: 'vi', ogLocale: 'vi_VN',
  title: "Luke Duct · Hệ thống hút khói & cấp gió tươi cho bếp thương mại tại Victoria",
  metaDesc: "Luke Duct gia công và lắp đặt hệ thống hút khói và cấp gió tươi cho bếp thương mại khắp bang Victoria, tư vấn thực tế và thi công gọn gàng, cẩn thận. Gọi 0466 404 868.",
  navSystem: "Hệ thống", navProcess: "Quy trình", navContact: "Liên hệ", navWork: "Công trình",
  call: 'Gọi', quote: "Yêu cầu gọi lại", quoteShort: "Yêu cầu gọi lại",
  eyebrow: "Hút khói & cấp gió tươi bếp thương mại · Victoria",
  h1a: "Hút khói & cấp gió tươi cho bếp thương mại,", h1b: "làm đúng, làm đẹp.",
  lede: "Luke Duct gia công và lắp đặt hệ thống hút khói và cấp gió tươi cho quán café, tiệm takeaway, nhà hàng và bếp thương mại lớn khắp bang Victoria. Với nền tảng kỹ thuật vững, Luke mang đến lời khuyên thiết thực và tay nghề gọn gàng, cẩn thận cho từng công trình – từ việc lắp đặt đơn giản đến những công trình khó.",
  motionPause: 'Tạm dừng hiệu ứng', motionPlay: 'Phát hiệu ứng',
  formTitle: 'Yêu cầu gọi lại',
  formSub: "Để lại thông tin, Luke Duct sẽ gọi lại để trao đổi về công trình.",
  fName: "Họ tên", fPhone: "Số điện thoại", fEmail: "Email", fContact: "Điện thoại hoặc email", phContact: "Số hoặc email", contactHint: "Vui lòng để lại ít nhất một cách liên hệ – điện thoại hoặc email.", badEmail: "Địa chỉ email có vẻ chưa đúng. Anh chị vui lòng kiểm tra lại.", fVenue: "Loại bếp", selectPh: "Chọn…",
  phName: 'Họ và tên', phPhone: '04XX XXX XXX', phEmail: 'name@example.com', phSuburb: 'VD: Footscray',
  vTakeaway: 'Tiệm takeaway', vCafe: 'Quán café', vRestaurant: 'Nhà hàng', vHotel: 'Khách sạn', vSchool: 'Trường học', vTruck: 'Xe food truck', vLarge: 'Bếp lớn', vOther: 'Khác',
  fSuburb: "Khu vực (suburb)", fDetails: "Thông tin công trình (không bắt buộc)",
  fDetailsPh: 'Cỡ hood, thiết bị nấu, làm mới hay nâng cấp, nơi xả khí…',
  fWant: 'Anh chị cần gì?', wQuote: 'Báo giá', wCall: 'Gọi lại cho tôi',
  fService: 'Hệ thống cần làm', svExhaust: 'Hút khói', svFresh: 'Gió tươi', svBoth: 'Cả hai',
  fTime: "Giờ tiện gọi", tAny: 'Giờ nào cũng được', tMorning: 'Buổi sáng', tAfternoon: 'Buổi chiều', tEvening: 'Sau 5 giờ chiều',
  plansT: 'Có bản vẽ hoặc ảnh?', plansS: 'Nhắn tin gửi qua số',
  send: "Yêu cầu gọi lại", sending: "Đang gửi…", prefer: 'Muốn nói chuyện trực tiếp?',
  required: "Anh chị vui lòng nhập họ tên và số điện thoại hoặc email để được liên hệ lại.",
  okSent: "Cảm ơn anh chị! Luke Duct đã nhận được thông tin và sẽ sớm liên hệ để trao đổi.",
  okSms: "Ứng dụng tin nhắn sẽ mở sẵn thông tin của anh chị – chỉ cần bấm gửi. Nếu không mở được, anh chị gọi giúp số",
  errSend: "Xin lỗi, yêu cầu chưa gửi được. Anh chị vui lòng thử lại, hoặc gọi trực tiếp số",
  smsHead: "Yêu cầu gọi lại từ website",
  trustDo: "Dịch vụ", trustDoV: 'Hút khói + gió tươi',
  trustMade: 'Tự sản xuất', trustMadeV: 'Gia công theo bản vẽ',
  trustArea: 'Khu vực phục vụ', areaVal: "Toàn bang Victoria",
  trustCall: "Gọi Luke Duct",
  trustLicence: 'Giấy phép', trustInsured: 'Bảo hiểm', trustExp: 'Kinh nghiệm', yearsUnit: 'năm',
  scopeEyebrow: "Hệ thống",
  scopeH2: "Hút khói ra, gió tươi vào.",
  scopeSub: "Bếp thương mại cần một hệ thống thông gió được tính toán kỹ. Hệ thống hút đưa khói, hơi nóng và hơi dầu mỡ ra ngoài, còn hệ thống gió tươi đưa không khí sạch từ bên ngoài trở lại bếp.",
  fact1: 'Hệ thống hút khói', fact2: 'Hệ thống gió tươi', fact3: 'Tự gia công', fact4: 'Toàn bang Victoria',
  s1t: "Tấm ốp chống cháy (fire-rated wall sheet)", s1d: "Tấm ốp tường chống cháy phía sau khu nấu, bên dưới chụp hút, giúp bảo vệ tường khỏi nhiệt.",
  s2t: "Chụp hút (canopy)", s2d: "Đặt phía trên khu nấu, giữ lại khói, hơi nóng và hơi dầu mỡ ngay từ nguồn.",
  s3t: "Cửa thăm (access panel)", s3d: "Bố trí dọc tuyến ống ở những chỗ cần thiết để kiểm tra và vệ sinh hệ thống.",
  s4t: "Đường ống (ductwork)", s4d: "Dẫn khí thải từ chụp hút đến quạt, đi ống gọn gàng theo đúng bản vẽ đã duyệt.",
  s5t: "Quạt hút", s5d: "Hút khí qua toàn hệ thống. Vị trí quạt được xác định trên bản vẽ trước khi gia công.",
  s6t: "Điểm xả khí", s6d: "Nơi khí thải ra khỏi công trình – mái, tường hoặc hộp gen – được tính từ đầu.",
  dgLabel: "Hình minh họa hệ thống bếp thương mại điển hình, không theo tỷ lệ. Đánh số 1 đến 7: tấm ốp tường chống cháy phía sau khu nấu bên dưới chụp hút, chụp hút phía trên thiết bị nấu, cửa thăm trên ống đứng, đường ống trên trần, quạt hút, điểm xả khí, và đường cấp gió tươi đi xuống bếp.",
  dgTitle: 'HỆ THỐNG BẾP ĐIỂN HÌNH', dgScale: 'KHÔNG THEO TỶ LỆ', dgCeiling: 'TRẦN', dgExhaust: 'HÚT KHÓI', dgFresh: 'GIÓ TƯƠI',
  workEyebrow: "Công trình", workH2: "Xem kỹ phần hoàn thiện.", workSub: "Ảnh thật từ chính các công trình Luke Duct đã thực hiện ở Victoria. Bấm vào ảnh để xem lớn hơn.",
  ctaT: "Đang làm bếp mới hay nâng cấp bếp hiện có?", ctaS: "Dù anh chị đang làm bếp thương mại mới hay nâng cấp hệ thống hiện có, làm đúng phần hút khói và gió tươi ngay từ đầu sẽ tạo ra khác biệt.",
  procEyebrow: "Quy trình", procH2: "Từ lần khảo sát đầu tiên đến khi bàn giao.", procLink: 'Bắt đầu từ bước 01',
  st1t: "Khảo sát & đo đạc", st1d: "Đến tận nơi đo đạc, kiểm tra tuyến ống, chỗ lấy gió tươi và điểm xả khí.",
  st2t: "Báo giá", st2d: "Báo giá rõ ràng, liệt kê đầy đủ phạm vi công việc.",
  st3t: "Bản vẽ", st3d: "Bản vẽ để anh chị xem trước, mọi thay đổi được chốt trước khi gia công.",
  st4t: "Gia công", st4d: "Đường ống và phụ kiện gia công tại xưởng theo bản vẽ đã duyệt.",
  st5t: "Lắp đặt", st5d: "Lắp đặt gọn gàng, cẩn thận, cập nhật cho anh chị trong suốt quá trình.",
  st6t: "Bàn giao", st6d: "Cùng anh chị xem lại công trình và đảm bảo anh chị hài lòng.",
  expEyebrow: "Vì sao chọn Luke Duct?", expH2: "Không chỉ là lắp đặt.",
  e1t: "Tay nghề chỉn chu đến từng chi tiết", e1d: "Đường ống đi gọn gàng, mối nối sạch sẽ, hoàn thiện cẩn thận. Mục tiêu là công trình vừa đẹp mắt vừa vận hành tốt.",
  e2t: "Tư vấn thực tế, hợp với anh chị", e2d: "Luke dành thời gian tìm hiểu công trình, cùng anh chị bàn các phương án và chọn giải pháp phù hợp – không phải cách dễ nhất.",
  e3t: "Vững kỹ thuật cho cả công trình khó", e3d: "Nền tảng kỹ thuật thực hành giúp Luke lên kế hoạch kỹ và tìm ra giải pháp thực tế khi công trình không đơn giản.",
  e4t: "Sự hài lòng của anh chị là điều quan trọng", e4d: "Trao đổi rõ ràng từ buổi nói chuyện đầu tiên đến khi bàn giao, và một kết quả mà cả hai bên đều hài lòng.",
  proofH: 'Khách hàng nói gì',
  contactEyebrow: "Liên hệ", contactH2: "Cùng trao đổi về căn bếp của anh chị.",
  sendH: "Thông tin hữu ích nên chuẩn bị:",
  l1: "Địa chỉ công trình",
  l2: "Bản vẽ mặt bằng và bản vẽ cơ điện",
  l3: "Danh sách thiết bị nấu hoặc bố trí hood",
  l4: "Vị trí xả khí dự kiến (mái, tường hoặc hộp gen)",
  l5: "Thời gian dự kiến lắp đặt",
  kPhone: "Điện thoại", kEmail: 'Email', kArea: "Khu vực phục vụ",
  langLabel: 'Ngôn ngữ', home: 'Trang chủ Luke Duct',
  rights: "Bảo lưu mọi quyền.",
  contactIntro: "Anh chị đang chuẩn bị làm bếp thương mại mới, hoặc muốn nâng cấp hệ thống hút khói và gió tươi hiện có?",
  cFormTitle: "Yêu cầu gọi lại",
  cFormSub: "Anh chị có công trình cần làm? Để lại thông tin bên dưới, Luke Duct sẽ liên hệ để cùng trao đổi.",
  cSelectPh: "Chọn loại bếp",
  cDetailsPh: "Kể sơ về công trình – cỡ hood, thiết bị nấu, làm mới hay nâng cấp, và khí thải nên xả ra đâu.",
  cSend: "Yêu cầu gọi lại",
  preferC: "Muốn trao đổi trực tiếp?",
  navWhy: "Điểm mạnh",
  lede2: "Với nền tảng kỹ thuật vững và cách làm sát thực tế, Luke mang đến lời khuyên thiết thực, tay nghề chắc và sự tỉ mỉ cho từng công trình – từ việc lắp đặt đơn giản đến những công trình khó hơn.",
  heroFormT: "Kể về công trình của anh chị",
  heroFormS: "Chia sẻ đôi chút về căn bếp và dự định của anh chị. Luke Duct sẽ liên hệ để tìm hiểu nhu cầu và tư vấn cách làm phù hợp.",
  hl1: "Hệ thống hút khói & gió tươi",
  hl2: "Gia công theo yêu cầu",
  hl3: "Tự sản xuất tại xưởng",
  hl4: "Phục vụ toàn bang Victoria",
  hlLabel: "Dịch vụ của Luke Duct",
  expSub: "Một kết quả tốt cần hiểu biết kỹ thuật đúng, cách nghĩ thực tế và sự chăm chút trong từng chi tiết.",
  expSub2: "Đây là những gì anh chị có thể trông đợi khi làm việc với Luke Duct.",
  ctaS2: "Hãy cùng Luke trao đổi về kế hoạch và tìm giải pháp thực tế cho không gian của anh chị.",
  scopeSub2: "Hai hệ thống cần vận hành ăn khớp với nhau. Luke Duct gia công và lắp đặt trọn bộ hút khói và gió tươi, tính toán phù hợp với căn bếp và yêu cầu của từng công trình.",
  procSub: "Quy trình đơn giản, rõ ràng, và mọi chi tiết quan trọng đều được tính kỹ trước khi bắt đầu lắp đặt.",
  contactIntro2: "Hãy kể sơ về công trình của anh chị. Luke sẽ dành thời gian tìm hiểu nhu cầu và cùng anh chị bàn cách làm phù hợp nhất.",
  footTag: "Hệ thống hút khói & cấp gió tươi cho bếp thương mại",
  navLabel: 'Menu chính',
  s7t: "Cấp gió tươi",
  s7d: "Quạt cấp và đường ống đưa không khí sạch từ bên ngoài vào bếp, bù lại lượng khí đã hút ra.",
  photoAlt: "Ảnh công trình của Luke Duct",
  enlarge: "Xem ảnh lớn",
  lbClose: "Đóng",
  lbPrev: "Ảnh trước",
  lbNext: "Ảnh tiếp theo",
  viewAll: "Xem toàn bộ ảnh",
  galTitle: "Thư viện ảnh công trình · Luke Duct · Hút khói bếp thương mại, Victoria",
  galMeta: "Ảnh chụp hút, đường ống, điểm xả trên mái và bếp hoàn thiện do Luke Duct gia công và lắp đặt khắp bang Victoria.",
  galEyebrow: "Thư viện ảnh",
  galH1: "Công trình, nhìn cận cảnh.",
  galSub: "Chụp hút, đường ống, điểm xả trên mái và bếp hoàn thiện từ các công trình khắp Victoria. Bấm vào ảnh để xem lớn hơn.",
  galFilter: "Lọc ảnh",
  catAll: "Tất cả",
  catCanopies: "Chụp hút",
  catDuct: "Đường ống",
  catRoof: "Mái & điểm xả",
  catFitout: "Bếp hoàn thiện",
  galCtaT: "Ưng ý với tay nghề?",
  galCtaS: "Kể về căn bếp của anh chị, Luke Duct sẽ liên hệ để cùng trao đổi.",
  galBack: "Về trang chủ"
};

/* ====================== TEMPLATE ====================== */
function jpegSize(file) {
  const buf = fs.readFileSync(path.join(__dirname, file));
  let i = 2;
  while (i < buf.length) {
    if (buf[i] !== 0xff) { i++; continue; }
    const m = buf[i + 1];
    if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc) return { h: buf.readUInt16BE(i + 5), w: buf.readUInt16BE(i + 7) };
    i += 2 + buf.readUInt16BE(i + 2);
  }
  return { w: 4, h: 3 };
}
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const ARROW = '<svg class="arr" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
const PHONE_IC = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/></svg>';
const SMOKE = (n) => '<div class="smoke" aria-hidden="true">' + '<i></i>'.repeat(n) + '</div>';

function page(T, lang, kind = 'home', mode = 'site') {
  const C = CONFIG;
  const isG = kind === 'gallery';
  const view = (l, k) => (k === 'gallery' ? (l === 'vi' ? 'vi-gallery' : 'gallery') : l);
  const pfx = (l, k) => ({ 'en-home': '', 'vi-home': 'vi-', 'en-gallery': 'g-', 'vi-gallery': 'vig-' })[l + '-' + k];
  const up = (lang === 'vi' ? '../' : '') + (isG ? '../' : '');
  const R = mode === 'preview' ? '' : up;           // path back to site root (for assets)
  const HL = (a) => (!isG ? '#' + a : mode === 'preview' ? '#!' + pfx(lang, 'home') + a : '../#' + a);   // link to a home-page section
  const GL = mode === 'preview' ? '#!' + view(lang, 'gallery') : 'gallery/';                                // home -> gallery
  const LL = (to) => (mode === 'preview' ? '#!' + view(to, kind) : (up + (to === 'vi' ? 'vi/' : '') + (isG ? 'gallery/' : '')) || './');
  const tel = 'tel:' + C.phoneIntl;
  const sms = 'sms:' + C.phoneIntl;
  const pageUrl = C.siteUrl + (lang === 'vi' ? 'vi/' : '') + (isG ? 'gallery/' : '');

  const chip = (icon, k, v) => `<li><span class="tic"><svg viewBox="0 0 24 24" aria-hidden="true">${icon}</svg></span><span>${k ? `<span class="mono k">${k}</span>` : ''}<span class="v">${v}</span></span></li>`;
  const IC = {
    flow: '<path d="M3 8h12a3 3 0 1 0-3-3M3 16h15a3 3 0 1 1-3 3M3 12h18"/>',
    tool: '<path d="M14.5 6.5a4 4 0 0 0 5 5L11 20a2.1 2.1 0 0 1-3-3z"/>',
    shop: '<path d="M3 21h18M5 21V9l7-5 7 5v12M9 21v-6h6v6"/>',
    pin: '<path d="M12 21s7-6.2 7-11a7 7 0 0 0-14 0c0 4.8 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>',
    phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
    badge: '<circle cx="12" cy="10" r="6"/><path d="M9 15l-1 6 4-2 4 2-1-6M9.5 10l2 2 3-3.5"/>',
    shield: '<path d="M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6z"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  };
  const chips = [
    chip(IC.flow, '', esc(T.hl1)),
    chip(IC.tool, '', esc(T.hl2)),
    chip(IC.shop, '', esc(T.hl3)),
    chip(IC.pin, '', esc(T.hl4)),
  ];
  if (C.licence) chips.push(chip(IC.badge, T.trustLicence, esc(C.licence)));
  if (C.insurance) chips.push(chip(IC.shield, T.trustInsured, esc(C.insurance)));
  if (C.years) chips.push(chip(IC.clock, T.trustExp, esc(/^\d+\+?$/.test(C.years) ? C.years + ' ' + T.yearsUnit : C.years)));
  if (chips.length % 4 !== 0) chips.push(chip(IC.phone, T.trustCall, `<a class="v" href="${tel}">${esc(C.phoneDisplay)}</a>`));

  const tile = (p, i) => {
    const alt = (typeof p[lang] === 'string' ? p[lang] : p.en) || T.photoAlt + ' ' + (i + 1);
    const sz = jpegSize(p.src);
    return `<li class="tile" data-cat="${p.cat || ''}"><button class="ph tilebtn" type="button" data-full="${R}${esc(p.src)}" data-alt="${esc(alt)}" aria-label="${esc(T.enlarge)}: ${esc(alt)}"><img class="pimg" src="${R}${esc(p.src)}" alt="${esc(alt)}" width="${sz.w}" height="${sz.h}" loading="lazy" decoding="async"></button></li>`;
  };
  const homeList = (C.photos.some((p) => p.home) ? C.photos.filter((p) => p.home) : C.photos).slice(0, 8);
  const photos = homeList.map(tile).join('\n');
  const allTiles = C.photos.map(tile).join('\n');
  const DIALOG = `<dialog class="lb" aria-label="${T.workEyebrow}"><img class="lbimg" src="" alt=""><button class="lbbtn lbclose" type="button" aria-label="${T.lbClose}">&times;</button><button class="lbbtn lbprev" type="button" aria-label="${T.lbPrev}">&#8249;</button><button class="lbbtn lbnext" type="button" aria-label="${T.lbNext}">&#8250;</button></dialog>`;
  const cats = [['all', T.catAll], ['canopies', T.catCanopies], ['ductwork', T.catDuct], ['roof', T.catRoof], ['fitout', T.catFitout]].filter(([c]) => c === 'all' || C.photos.some((p) => p.cat === c));
  const galleryMain = `
  <main>
  <section class="hero dark gal-top">
    ${SMOKE(5)}
    <div class="in">
      <p class="tag">${T.galEyebrow}</p>
      <h1 class="h1 gal-h1">${T.galH1}</h1>
      <p class="lede">${T.galSub}</p>
      ${cats.length > 2 ? `<div class="gfilters" role="group" aria-label="${T.galFilter}">${cats.map(([c, l], i) => `<button type="button" class="gf" data-f="${c}" aria-pressed="${i === 0}">${l}</button>`).join('')}</div>` : ''}
    </div>
  </section>
  <section class="sec sheet light alt gal-grid" id="work">
    <div class="in">
      <ul class="tiles masonry">${allTiles}</ul>
      ${DIALOG}
    </div>
  </section>
  <section class="sec sheet dark gal-cta" id="contact">
    ${SMOKE(5)}
    <div class="in">
      <div class="shead"><h2 class="h2">${T.galCtaT}</h2><p class="sub">${T.galCtaS}</p></div>
      <div class="center gal-ctabtns"><a class="btn btn-primary" href="${HL('contact')}">${T.quote} ${ARROW}</a><a class="btn btn-ghost" href="${tel}">${PHONE_IC} ${T.call} ${esc(C.phoneDisplay)}</a></div>
    </div>
  </section>
  </main>`;
  const reviews = C.reviews.map((r) => `<blockquote class="quote"><p>${esc((lang === 'vi' && r.vi) || r.en)}</p><span class="mono by">${esc(r.by)}</span></blockquote>`).join('\n');

  const venueList = (ph) => `<option value="" selected>${ph}</option>` + [T.vTakeaway, T.vCafe, T.vRestaurant, T.vHotel, T.vSchool, T.vTruck, T.vLarge, T.vOther].map((v) => `<option value="${v}">${v}</option>`).join('');
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
<title>${esc(isG ? T.galTitle : T.title)}</title>
<meta name="description" content="${esc(isG ? T.galMeta : T.metaDesc)}">
<link rel="canonical" href="${pageUrl}">
<link rel="alternate" hreflang="en-AU" href="${C.siteUrl}${isG ? 'gallery/' : ''}">
<link rel="alternate" hreflang="vi" href="${C.siteUrl}vi/${isG ? 'gallery/' : ''}">
<link rel="alternate" hreflang="x-default" href="${C.siteUrl}${isG ? 'gallery/' : ''}">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(isG ? T.galTitle : T.title)}">
<meta property="og:description" content="${esc(isG ? T.galMeta : T.metaDesc)}">
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
<div class="pg lang-${lang}" id="top" data-lang="${lang}" data-view="${view(lang, kind)}" data-site="${esc(JSON.stringify(msgs))}">

  <header class="top">
    <div class="in top-in">
      <a class="logo" href="${HL('top')}" aria-label="${esc(T.home)}">
        <span class="lg-mark"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12h13M12 6l6 6-6 6"/></svg></span>
        <span class="lname">${esc(C.company)}</span>
      </a>
      <nav class="nav" aria-label="${T.navLabel}">
        ${C.photos.length ? `<a href="${HL('work')}">${T.navWork}</a>` : ''}
        <a href="${HL('why')}">${T.navWhy}</a>
        <a href="${HL('system')}">${T.navSystem}</a>
        <a href="${HL('process')}">${T.navProcess}</a>
        <a href="${HL('contact')}">${T.navContact}</a>
      </nav>
      <div class="top-r">
        <a class="btn btn-ghost btn-sm hdr-cta" href="${tel}">${PHONE_IC}<span>${esc(C.phoneDisplay)}</span></a>
        <a class="btn btn-primary btn-sm hdr-cta" href="${HL('contact')}">${T.quote}</a>
        <button class="iconbtn js-motion" type="button" aria-label="${T.motionPause}" title="${T.motionPause}">
          <svg class="ic-pause" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="5" y="4" width="5" height="16" rx="1.5"/><rect x="14" y="4" width="5" height="16" rx="1.5"/></svg>
          <svg class="ic-play" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 4.5v15a1 1 0 0 0 1.5.9l12-7.5a1 1 0 0 0 0-1.8l-12-7.5A1 1 0 0 0 7 4.5z"/></svg>
        </button>
        <nav class="lang" aria-label="${T.langLabel}">
          <a href="${LL('en')}" hreflang="en" lang="en"${lang === 'en' ? ' aria-current="page"' : ''}>EN</a>
          <a href="${LL('vi')}" hreflang="vi" lang="vi"${lang === 'vi' ? ' aria-current="page"' : ''}>VI</a>
        </nav>
      </div>
    </div>
  </header>

  ${isG ? galleryMain : `
  <section class="hero dark">
    ${SMOKE(7)}
    <div class="in in-w">
      <p class="tag">${T.eyebrow}</p>
      <h1 class="h1"><span class="l1">${T.h1a}</span> <span class="l2">${T.h1b}</span></h1>
      <p class="lede">${T.lede}</p>

      <div class="qwrap" id="quote">
        <h2 class="qtitle">${T.heroFormT}</h2>
        <p class="qcap">${T.heroFormS}</p>
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

      <p class="after">${T.preferC} <a href="${tel}">${T.call} ${esc(C.phoneDisplay)}</a>.</p>

      <ul class="tchips" aria-label="${T.hlLabel}">
        ${chips.join('\n        ')}
      </ul>
    </div>
  </section>

  <main>
    ${C.photos.length ? `<section class="sec sheet light alt" id="work">
      <div class="in">
        <div class="shead"><p class="tag">${T.workEyebrow}</p><h2 class="h2">${T.workH2}</h2><p class="sub">${T.workSub}</p></div>
        <ul class="tiles masonry">${photos}</ul>
        ${DIALOG}
        <div class="center"><a class="btn btn-dark" href="${GL}">${T.viewAll} (${C.photos.length}) ${ARROW}</a></div>
      </div>
    </section>` : ''}

    <section class="sec sheet light" id="why">
      <div class="in">
        <div class="shead">
          <p class="tag">${T.expEyebrow}</p>
          <h2 class="h2">${T.expH2}</h2>
          <p class="sub">${T.expSub}</p>
        </div>
        <div class="expect">
          <div class="fc"><span class="fic"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 16 16 3l5 5L8 21z M7 12l2 2 M10 9l2 2 M13 6l2 2"/></svg></span><h3>${T.e1t}</h3><p>${T.e1d}</p></div>
          <div class="fc"><span class="fic"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.5 6.5a4 4 0 0 0 5 5L11 20a2.1 2.1 0 0 1-3-3z"/></svg></span><h3>${T.e2t}</h3><p>${T.e2d}</p></div>
          <div class="fc"><span class="fic"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 8h12a3 3 0 1 0-3-3M3 16h15a3 3 0 1 1-3 3M3 12h18"/></svg></span><h3>${T.e3t}</h3><p>${T.e3d}</p></div>
          <div class="fc"><span class="fic"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v11H10l-4 4v-4H4z"/></svg></span><h3>${T.e4t}</h3><p>${T.e4d}</p></div>
        </div>
        ${C.reviews.length ? `<h3 class="mono proofh">${T.proofH}</h3><div class="quotes">${reviews}</div>` : ''}
      </div>
    </section>

    <section class="sec sheet dark" id="system">
      ${SMOKE(5)}
      <div class="in">
        <div class="shead">
          <p class="tag">${T.scopeEyebrow}</p>
          <h2 class="h2">${T.scopeH2}</h2>
          <p class="sub">${T.scopeSub}</p>
          <p class="sub sub2">${T.scopeSub2}</p>
        </div>
        <div class="sgrid">
          <figure class="panel">
            <div class="dg">
              <svg viewBox="0 0 760 424" role="img" aria-label="${esc(T.dgLabel)}">
                <defs><filter id="gl" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="6"/></filter></defs>
                <polygon class="sv-glow mk m0" points="156,260 156,76 486,76 486,116 196,116 196,260" filter="url(#gl)"/>
                <rect class="sv-glow mk m0" x="486" y="56" width="72" height="80" rx="10" filter="url(#gl)"/>

                <line class="sv-line d1" pathLength="1" x1="24" y1="380" x2="736" y2="380"/>
                <rect class="sv-wall d1" pathLength="1" x="64" y="306" width="238" height="74"/>
                <line class="sv-wseam" x1="124" y1="306" x2="124" y2="380"/>
                <line class="sv-wseam" x1="183" y1="306" x2="183" y2="380"/>
                <line class="sv-wseam" x1="242" y1="306" x2="242" y2="380"/>
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
                <g class="mk m1"><polyline class="sv-lead" fill="none" points="292,318 318,345 340,345"/><circle class="sv-hot" cx="292" cy="318" r="4"/></g>
                <g class="mk m5"><line class="sv-lead" x1="526.4" y1="30" x2="548" y2="30"/><circle class="sv-hot" cx="526.4" cy="30" r="4"/></g>
                <g class="mk m5"><line class="sv-falead" x1="644" y1="237" x2="624" y2="237"/><circle class="sv-fahot" cx="644" cy="237" r="4"/></g>

                <line class="sv-line" x1="24" y1="396" x2="736" y2="396"/>
                <text class="sv-ttl" x="24" y="416">${T.dgTitle}</text>
                <text class="sv-lgd" x="300" y="416" fill="#FF6B3D">● ${T.dgExhaust}</text>
                <text class="sv-lgd" x="420" y="416" fill="#7CC0FF">● ${T.dgFresh}</text>
                <text class="sv-ttl" x="736" y="416" text-anchor="end">${T.dgScale}</text>
              </svg>
              <span class="pill p1" style="--x:344;--y:345;--k:6"><span class="pw"><span class="pi"><b>1</b><span class="pl">${T.s1t.replace(/\s*\(.*\)$/, '')}</span></span></span></span>
              <span class="pill p2" style="--x:330;--y:296;--k:0"><span class="pw"><span class="pi"><b>2</b><span class="pl">${T.s2t.replace(/\s*\(.*\)$/, '')}</span></span></span></span>
              <span class="pill p3" style="--x:244;--y:220;--k:1"><span class="pw"><span class="pi"><b>3</b><span class="pl">${T.s3t.replace(/\s*\(.*\)$/, '')}</span></span></span></span>
              <span class="pill p4 c" style="--x:340;--y:32;--k:2"><span class="pw"><span class="pi"><b>4</b><span class="pl">${T.s4t.replace(/\s*\(.*\)$/, '')}</span></span></span></span>
              <span class="pill p5 c" style="--x:522;--y:162;--k:3"><span class="pw"><span class="pi"><b>5</b><span class="pl">${T.s5t.replace(/\s*\(.*\)$/, '')}</span></span></span></span>
              <span class="pill p6" style="--x:552;--y:30;--k:4"><span class="pw"><span class="pi"><b>6</b><span class="pl">${T.s6t.replace(/\s*\(.*\)$/, '')}</span></span></span></span>
              <span class="pill p7 r" style="--x:620;--y:237;--k:5"><span class="pw"><span class="pi"><b>7</b><span class="pl">${T.s7t.replace(/\s*\(.*\)$/, '')}</span></span></span></span>
            </div>
          </figure>
          <ol class="dlegend">
            <li><b aria-hidden="true">1</b>${T.s1t.replace(/\s*\(.*\)$/, '')}</li>
            <li><b aria-hidden="true">2</b>${T.s2t.replace(/\s*\(.*\)$/, '')}</li>
            <li><b aria-hidden="true">3</b>${T.s3t.replace(/\s*\(.*\)$/, '')}</li>
            <li><b aria-hidden="true">4</b>${T.s4t.replace(/\s*\(.*\)$/, '')}</li>
            <li><b aria-hidden="true">5</b>${T.s5t.replace(/\s*\(.*\)$/, '')}</li>
            <li><b aria-hidden="true">6</b>${T.s6t.replace(/\s*\(.*\)$/, '')}</li>
            <li class="fa"><b aria-hidden="true">7</b>${T.s7t.replace(/\s*\(.*\)$/, '')}</li>
          </ol>
        </div>
      </div>
    </section>

    <section class="sec sheet light alt" id="process">
      <div class="in">
        <div class="shead"><p class="tag">${T.procEyebrow}</p><h2 class="h2">${T.procH2}</h2><p class="sub">${T.procSub}</p></div>
        <ol class="tl">
          <li><span class="tn" aria-hidden="true">01</span><div><h3>${T.st1t}</h3><p>${T.st1d}</p></div></li>
          <li><span class="tn" aria-hidden="true">02</span><div><h3>${T.st2t}</h3><p>${T.st2d}</p></div></li>
          <li><span class="tn" aria-hidden="true">03</span><div><h3>${T.st3t}</h3><p>${T.st3d}</p></div></li>
          <li><span class="tn" aria-hidden="true">04</span><div><h3>${T.st4t}</h3><p>${T.st4d}</p></div></li>
          <li><span class="tn" aria-hidden="true">05</span><div><h3>${T.st5t}</h3><p>${T.st5d}</p></div></li>
          <li><span class="tn" aria-hidden="true">06</span><div><h3>${T.st6t}</h3><p>${T.st6d}</p></div></li>
        </ol>
        <div class="center"><a class="btn btn-dark" href="${HL('contact')}">${T.quote} ${ARROW}</a></div>
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
        <p class="lede cintro cintro2">${T.contactIntro2}</p>
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

`}
  <footer class="foot dark">
    <div class="in">
      <div class="foot-l"><strong class="foot-name">${esc(C.company)}</strong><span>${T.footTag}</span></div>
      <div class="foot-r"><span>${T.areaVal} · <a href="${tel}">${esc(C.phoneDisplay)}</a></span><span>© ${new Date().getFullYear()} ${esc(C.company)}${C.abn ? ' · ABN ' + esc(C.abn) : ''} · ${T.rights}</span></div>
    </div>
  </footer>

  <div class="stickybar">
    <a class="btn btn-ghost btn-sm" href="${tel}" aria-label="${T.call} ${esc(C.phoneDisplay)}">${PHONE_IC} <span class="lbl">${T.call}</span></a>
    <a class="btn btn-primary btn-sm" href="${HL('contact')}">${T.quote}</a>
  </div>

</div>
<script src="${R}assets/main.js" defer></script>
</body>
</html>
`;
}

const root = __dirname;
const out = (rel, html) => { fs.mkdirSync(path.dirname(path.join(root, rel)), { recursive: true }); fs.writeFileSync(path.join(root, rel), html); };
out('index.html', page(EN, 'en'));
out('vi/index.html', page(VI, 'vi'));
out('gallery/index.html', page(EN, 'en', 'gallery'));
out('vi/gallery/index.html', page(VI, 'vi', 'gallery'));
console.log('Built index.html, vi/index.html, gallery/index.html, vi/gallery/index.html');

/* ---- private preview: one self-contained page with all four views (#en #vi #gallery #vi-gallery) ---- */
function bodyOf(html) { return html.slice(html.indexOf('<body>\n') + 7, html.indexOf('\n<script src=')); }
function forPreview(html, prefix, hidden) {
  let b = bodyOf(html);
  if (prefix) {
    b = b.replace(/ id="([^"]+)"/g, ` id="${prefix}$1"`).replace(/ for="([^"]+)"/g, ` for="${prefix}$1"`)
      .replace(/aria-describedby="([^"]+)"/g, `aria-describedby="${prefix}$1"`)
      .replace(/href="#(?!!)([^"]+)"/g, `href="#${prefix}$1"`).replace(/url\(#gl\)/g, `url(#${prefix}gl)`);
  }
  b = b.replace(/href="#!/g, 'href="#');
  if (hidden) b = b.replace('<div class="pg', '<div hidden class="pg');
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
${forPreview(page(EN, 'en', 'home', 'preview'), '', false)}
${forPreview(page(VI, 'vi', 'home', 'preview'), 'vi-', true)}
${forPreview(page(EN, 'en', 'gallery', 'preview'), 'g-', true)}
${forPreview(page(VI, 'vi', 'gallery', 'preview'), 'vig-', true)}
<script>
${js}
(function () {
  var views = { en: 1, vi: 1, gallery: 1, 'vi-gallery': 1 };
  function show() {
    var h = location.hash.slice(1), pg = null, target = null;
    if (views[h]) pg = document.querySelector('.pg[data-view="' + h + '"]');
    else if (h) { target = document.getElementById(h); if (target) pg = target.closest('.pg'); }
    if (!pg) return;
    document.querySelectorAll('.pg[data-view]').forEach(function (p) { p.hidden = p !== pg; });
    document.documentElement.lang = pg.getAttribute('data-lang');
    if (target && target !== pg) target.scrollIntoView(); else window.scrollTo(0, 0);
  }
  window.addEventListener('hashchange', show);
  show();
})();
</script>
`;
fs.mkdirSync(path.join(root, 'preview'), { recursive: true });
fs.writeFileSync(path.join(root, 'preview', 'luke-duct-preview.html'), preview);
console.log('Built preview/luke-duct-preview.html');
