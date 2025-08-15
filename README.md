# CARLENDAR - ปฏิทินการศึกษาและกิจกรรม

เว็บไซต์ปฏิทินการศึกษาและกิจกรรมสำหรับมหาวิทยาลัยเทคโนโลยีราชมงคลธัญบุรี

## คุณสมบัติหลัก

### 🎯 การสลับมุมมอง
- **หน้าแรก**: ปฏิทินแบบตาราง พร้อมเลือกปีและเดือน
- **หมวดหมู่**: จัดกลุ่มกิจกรรมตามประเภท
- **รายการ**: แสดงกิจกรรมเรียงตามเดือน
- **ตัวกรอง**: กรองกิจกรรมตามหมวดหมู่
- **รายละเอียด**: ข้อมูลครบถ้วนของกิจกรรม

### 📅 ระบบปฏิทิน
- เลือกปี: 2566, 2567, 2568
- เลือกเดือน: มกราคม - ธันวาคม
- แสดงวันที่มีกิจกรรมพิเศษ
- ปุ่มดาวน์โหลดไฟล์ .ics เพื่อเพิ่มลงปฏิทินส่วนตัว

### 🎨 หมวดหมู่กิจกรรม
- **การศึกษา** (สีน้ำเงิน #3f458d)
- **กิจกรรมนักศึกษา** (สีเขียว #2e8b57)
- **วันหยุด** (สีส้ม #ff8c42)
- **อบรม/สัมมนา** (สีม่วง #9b59b6)
- **กีฬา/วัฒนธรรม** (สีแดง #e74c3c)

### 📱 Responsive Design
- **Desktop**: Sidebar ซ้าย (260px) + เนื้อหาขวา
- **Tablet**: Sidebar แคบลง (220px)
- **Mobile**: เมนูแบบ hamburger ด้านบน

## โครงสร้างไฟล์

```
/
├── index.html                 # หน้าเดียวรวมทุกมุมมอง
├── assets/
│   ├── css/
│   │   └── style.css         # สไตล์หลัก
│   ├── images/
│   │   ├── university-logo.svg   # โลโก้มหาวิทยาลัย
│   │   └── mountain-bg.svg       # ภาพพื้นหลังภูเขา
│   └── files/
│       └── ics/
│           └── event-sample.ics  # ไฟล์ปฏิทินตัวอย่าง
└── README.md                 # คู่มือนี้
```

## เทคโนโลยีที่ใช้

- **HTML5**: Semantic markup, accessibility
- **CSS3**: Grid, Flexbox, Custom Properties
- **Fonts**: Sarabun (ไทย), Inter (อังกฤษ)
- **ไม่ใช้ JavaScript**: ใช้ CSS-only interactions

## วิธีใช้งาน

1. เปิดไฟล์ `index.html` ในเบราว์เซอร์
2. เลือกมุมมองจาก Sidebar ซ้าย (หรือเมนู hamburger บนมือถือ)
3. เลือกปีและเดือนในหน้าแรก
4. ใช้ตัวกรองในหน้าตัวกรองเพื่อแสดงเฉพาะหมวดหมู่ที่ต้องการ
5. คลิกปุ่ม "เพิ่มลงปฏิทิน" เพื่อดาวน์โหลดไฟล์ .ics

## การปรับแต่ง

### เปลี่ยนสีธีม
แก้ไขตัวแปรใน `:root` ของไฟล์ `style.css`:

```css
:root {
    --primary-pink: #f06faa;      /* สีหลัก */
    --secondary-blue: #3f458d;    /* สีรอง */
    --background: #f9fafb;        /* พื้นหลัง */
}
```

### เพิ่มกิจกรรม
แก้ไข HTML ในส่วน view ต่างๆ และเพิ่ม class หมวดหมู่:

```html
<article class="event-card cat-academic event">
    <div class="event-date">วัน 15 มกราคม 2568</div>
    <div class="event-details">รายละเอียด: วันเปิดเทอมภาคเรียนที่ 2/2567</div>
    <div class="event-category academic">การศึกษา</div>
</article>
```

### เพิ่มปี/เดือนใหม่
เพิ่ม radio input และ label ที่เกี่ยวข้องใน HTML และ CSS

## Accessibility Features

- ✅ Semantic HTML5 elements
- ✅ ARIA labels สำหรับ navigation
- ✅ Alt text สำหรับรูปภาพ
- ✅ Focus indicators
- ✅ High contrast mode support
- ✅ Reduced motion support
- ✅ Keyboard navigation

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

