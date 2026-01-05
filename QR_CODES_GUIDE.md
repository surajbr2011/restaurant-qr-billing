# 📱 QR Code Location & Usage Guide

## 📍 Where Are the QR Codes?

### Location on Your Computer:
```
c:\Users\SURAJ\Desktop\restaurants billing software\restaurant-qr-billing\backend\qr-codes\
```

### Files Created:
✅ **10 QR Code PNG files** ready to print!

---

## 📋 QR Code Files List

| File Name | Table | Zone | Capacity |
|-----------|-------|------|----------|
| `T-001_Table_1.png` | Table 1 | Indoor | 4 guests |
| `T-002_Table_2.png` | Table 2 | Indoor | 2 guests |
| `T-003_Table_3.png` | Table 3 | Indoor | 4 guests |
| `T-004_Table_4.png` | Table 4 | Outdoor | 6 guests |
| `T-005_Table_5.png` | Table 5 | Outdoor | 4 guests |
| `T-006_VIP_Room_1.png` | VIP Room 1 | VIP | 8 guests |
| `T-007_VIP_Room_2.png` | VIP Room 2 | VIP | 6 guests |
| `T-008_Bar_Counter_1.png` | Bar Counter 1 | Bar | 2 guests |
| `T-009_Bar_Counter_2.png` | Bar Counter 2 | Bar | 2 guests |
| `T-010_Lounge_Sofa_1.png` | Lounge Sofa 1 | Lounge | 4 guests |

---

## 🖨️ How to Print QR Codes

### Recommended Print Settings:

**Size:** 10cm x 10cm (4" x 4")
- Large enough to scan easily
- Not too big to be intrusive

**Quality:** High (300 DPI minimum)
- Ensures QR code is scannable
- Clear and sharp edges

**Paper:** 
- **Option 1:** Glossy photo paper (best quality)
- **Option 2:** Heavy cardstock (durable)
- **Option 3:** Regular paper + lamination

### Printing Steps:

1. **Open the folder:**
   ```
   Windows Explorer → Navigate to:
   c:\Users\SURAJ\Desktop\restaurants billing software\restaurant-qr-billing\backend\qr-codes\
   ```

2. **Select QR code files** you want to print

3. **Right-click → Print**

4. **Set print size:**
   - Click "Options" or "Preferences"
   - Set size to 10cm x 10cm
   - Enable "High Quality" or "Best"

5. **Print**

---

## 🛡️ Protect Your QR Codes

### Lamination (Recommended):

**Why?**
- Waterproof
- Scratch-resistant
- Long-lasting
- Easy to clean

**How?**
1. Print QR codes
2. Take to a print shop or use a home laminator
3. Laminate with 125-micron pouches
4. Trim edges

### Alternative Protection:
- Clear acrylic holders
- Plastic sleeves
- Vinyl stickers (weatherproof)

---

## 📍 How to Place QR Codes

### Table Placement Options:

**Option 1: Table Tent (Recommended)**
```
┌─────────────┐
│  QR CODE    │
│  [Image]    │
│             │
│  Table 1    │
│  Scan to    │
│  Order      │
└─────────────┘
```
- Fold cardstock into tent shape
- Place QR code on front
- Add table number
- Stand on table

**Option 2: Mounted on Table**
- Stick directly to table surface
- Use strong adhesive or screws
- Good for permanent setup

**Option 3: Wall-Mounted**
- Mount near each table
- Add "Table X - Scan Here" sign
- Good for booth seating

---

## 🎨 Customize QR Code Display

### Add Branding (Optional):

Create a template with:
- Restaurant logo at top
- QR code in center
- Table number below
- Instructions: "Scan to Order"

### Example Layout:
```
┌─────────────────────┐
│   [RESTAURANT LOGO] │
│                     │
│    [QR CODE IMAGE]  │
│                     │
│      Table 1        │
│   📱 Scan to Order  │
│                     │
│   Indoor Seating    │
│   Capacity: 4       │
└─────────────────────┘
```

---

## 🔄 How QR Codes Work

### Customer Flow:

1. **Customer scans QR code** with phone camera
2. **Browser opens** with unique table link
3. **Login screen appears** showing table info
4. **Customer enters details** (optional)
5. **Menu loads** for that specific table
6. **Orders are linked** to the table automatically

### What's in the QR Code?

Each QR code contains:
- Encrypted table ID
- Room/zone information
- Unique security token
- Link to customer frontend

**Example URL:**
```
http://yourdomain.com?token=ENCRYPTED_TABLE_TOKEN
```

---

## 🔧 Regenerate QR Codes

### When to Regenerate:

- Changed restaurant domain/URL
- Security concerns
- QR codes damaged/lost
- Adding new tables

### How to Regenerate:

```powershell
# 1. Navigate to backend
cd backend

# 2. Delete old QR codes (optional)
Remove-Item qr-codes\*.png

# 3. Regenerate
node scripts/generateQRCodes.js

# 4. Download new images
node scripts/downloadQRCodes.js
```

---

## 📊 View QR Codes in Admin Dashboard

### Via API (Future Feature):

The admin dashboard can show:
- All QR codes
- Download buttons
- Regenerate options
- Usage statistics

### Current Method:

Access QR codes via:
1. **File System:** `backend/qr-codes/` folder
2. **Database:** MongoDB `qrcodes` collection
3. **API:** `GET /api/qrcode/all`

---

## 🧪 Test QR Codes

### Before Printing:

1. **Open a QR code image**
2. **Scan with your phone**
3. **Verify it opens the customer frontend**
4. **Check table info is correct**
5. **Test the complete flow**

### Test Checklist:

- [ ] QR code scans successfully
- [ ] Correct table number shown
- [ ] Login screen appears
- [ ] Menu loads
- [ ] Can place order
- [ ] Order appears in admin dashboard

---

## 📱 QR Code Specifications

### Technical Details:

- **Format:** PNG image
- **Size:** ~9KB per file
- **Dimensions:** 300x300 pixels
- **Error Correction:** High (Level H)
- **Encoding:** UTF-8
- **Type:** URL QR Code

### Scannable By:

- ✅ iPhone Camera app
- ✅ Android Camera app
- ✅ WhatsApp QR scanner
- ✅ Any QR code reader app
- ✅ WeChat scanner

---

## 🎯 Quick Commands

### Download QR Codes:
```powershell
cd backend
node scripts/downloadQRCodes.js
```

### Open QR Codes Folder:
```powershell
explorer "c:\Users\SURAJ\Desktop\restaurants billing software\restaurant-qr-billing\backend\qr-codes"
```

### Verify QR Codes in Database:
```powershell
cd backend
node scripts/verifyQRCodes.js
```

### Get Test URL:
```powershell
cd backend
node scripts/getUrl.js
```

---

## 📝 Printing Checklist

- [ ] All QR codes downloaded
- [ ] Tested at least one QR code
- [ ] Selected print size (10cm x 10cm)
- [ ] High quality print setting enabled
- [ ] Printed on good quality paper
- [ ] Laminated for protection
- [ ] Table numbers clearly visible
- [ ] Placed on tables
- [ ] Tested scanning from table distance

---

## 🚀 Next Steps

1. **Print QR codes** from the `qr-codes` folder
2. **Laminate them** for durability
3. **Place on tables** with table numbers
4. **Test scanning** from customer's perspective
5. **Train staff** on how the system works

---

**QR Codes Location:**
```
c:\Users\SURAJ\Desktop\restaurants billing software\restaurant-qr-billing\backend\qr-codes\
```

**Ready to print and deploy!** 🎉
