# CARLENDAR - ปฏิทินการศึกษาและกิจกรรม (แยกไฟล์)

เว็บไซต์ปฏิทินการศึกษาและกิจกรรมสำหรับมหาวิทยาลัยราชภัฏสวนสุนันทา ที่แยกไฟล์ออกเป็นหน้าต่างๆ แล้ว

## โครงสร้างไฟล์ใหม่

```
/
├── index.html                     # หน้าแรกต้อนรับ (old version - รวมทุกมุมมอง)
├── index-new.html                 # หน้าแรกต้อนรับใหม่ (แบบแยกไฟล์)
├── pages/                         # โฟลเดอร์หน้าต่างๆ
│   ├── template.html             # Template สำหรับสร้างหน้าใหม่
│   ├── home.html                 # หน้าแรก - ปฏิทิน
│   ├── category.html             # หน้าหมวดหมู่
│   ├── list.html                 # หน้ารายการ
│   ├── filter.html               # หน้ตัวกรอง (มี JavaScript)
│   └── detail.html               # หน้ารายละเอียด
├── assets/
│   ├── css/
│   │   ├── style.css            # CSS เดิม (ใช้กับ index.html)
│   │   ├── main.css             # CSS หลักใหม่ (import ทุกอัน)
│   │   ├── base.css             # Base styles
│   │   ├── responsive.css       # Responsive design
│   │   └── components/          # CSS แยกตาม component
│   │       ├── sidebar.css      # Sidebar styles
│   │       ├── main.css         # Main content styles
│   │       ├── calendar.css     # Calendar styles
│   │       ├── events.css       # Event cards styles
│   │       ├── filter.css       # Filter controls styles
│   │       ├── detail.css       # Detail page styles
│   │       └── footer.css       # Footer styles
│   ├── images/
│   │   ├── university-logo.svg  # โลโก้มหาวิทยาลัย
│   │   └── mountain-bg.svg      # ภาพพื้นหลังภูเขา
│   └── files/
│       └── ics/
│           └── event-sample.ics # ไฟล์ปฏิทินตัวอย่าง
└── README-separated.md          # คู่มือนี้
```

## วิธีใช้งาน

### เวอร์ชันเดิม (หน้าเดียว - CSS Only)
- เปิด `index.html` - ใช้ CSS radio/checkbox เพื่อสลับมุมมอง
- ไม่ต้องการ JavaScript

### เวอร์ชันใหม่ (แยกไฟล์)
- เปิด `index-new.html` หรือ `pages/home.html` เพื่อเริ่มต้น
- คลิกเมนู Sidebar เพื่อไปหน้าต่างๆ
- หน้า filter.html ใช้ JavaScript เล็กน้อยสำหรับการกรอง

## หน้าต่างๆ

### 1. หน้าแรกต้อนรับ (`index-new.html`)
- หน้า Landing page ต้อนรับผู้ใช้
- มีปุ่มเข้าสู่ระบบปฏิทิน

### 2. หน้าแรกปฏิทิน (`pages/home.html`)
- แสดงปฏิทินรายเดือน
- เลือกปีและเดือนได้
- แสดงวันที่มีกิจกรรม

### 3. หน้าหมวดหมู่ (`pages/category.html`)
- จัดกลุ่มกิจกรรมตามประเภท
- การศึกษา, กิจกรรมนักศึกษา, วันหยุด

### 4. หน้ารายการ (`pages/list.html`)
- แสดงกิจกรรมเรียงตามเดือน
- ดูภาพรวมกิจกรรมทั้งปี

### 5. หน้าตัวกรอง (`pages/filter.html`)
- กรองกิจกรรมตามหมวดหมู่
- ใช้ JavaScript เพื่อซ่อน/แสดงกิจกรรม

### 6. หน้ารายละเอียด (`pages/detail.html`)
- แสดงรายละเอียดครบถ้วนของกิจกรรม
- ปุ่มดาวน์โหลดไฟล์ .ics

## CSS Architecture

### Base Layer
- `base.css`: Reset, variables, typography, accessibility

### Component Layer
- `sidebar.css`: Navigation sidebar
- `main.css`: Hero section, main layout
- `calendar.css`: Calendar grid, date picker
- `events.css`: Event cards, categories
- `filter.css`: Filter controls, checkboxes
- `detail.css`: Detail page, info cards
- `footer.css`: Footer layout

### Responsive Layer
- `responsive.css`: Mobile, tablet, desktop breakpoints

## การพัฒนาต่อ

### เพิ่มหน้าใหม่
1. Copy `template.html` เป็นไฟล์ใหม่
2. แทนที่ `{{content}}` ด้วยเนื้อหาที่ต้องการ
3. เพิ่ม class `active` ให้เมนูที่เกี่ยวข้อง
4. อัปเดต mobile navigation

### เพิ่ม CSS Component
1. สร้างไฟล์ใน `assets/css/components/`
2. เพิ่ม `@import` ใน `main.css`

### เพิ่มฟีเจอร์ JavaScript
- ใช้ vanilla JavaScript เบื้องต้น
- หลีกเลี่ยง framework หนัก
- รักษาความเร็วในการโหลด

## ข้อดี

### เวอร์ชันแยกไฟล์
✅ **SEO ดีกว่า** - แต่ละหน้ามี URL เฉพาะ  
✅ **โหลดเร็วกว่า** - โหลดเฉพาะส่วนที่ต้องการ  
✅ **พัฒนาง่ายกว่า** - แยกไฟล์ชัดเจน  
✅ **ปรับแต่งง่าย** - เพิ่มหน้าใหม่ได้ง่าย  
✅ **Accessibility ดีกว่า** - Navigation แบบ link  

### เวอร์ชันเดิม (หน้าเดียว)
✅ **ไม่ต้องใช้ JavaScript** - CSS-only interactions  
✅ **โหลดครั้งเดียว** - ไม่ต้อง navigate  
✅ **Offline ใช้ได้** - ไม่ต้องเรียก HTTP request  

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance

### เวอร์ชันแยกไฟล์
- First Load: ~150KB
- Subsequent Pages: ~50KB (cached CSS/JS)
- CSS Modules: แยกโหลดตามต้องการ

### เวอร์ชันเดิม
- Single Load: ~200KB
- ไม่ต้อง HTTP requests เพิ่มเติม

---

**คำแนะนำ**: ใช้เวอร์ชันแยกไฟล์สำหรับการผลิตจริง เพื่อ SEO และ UX ที่ดีกว่า
