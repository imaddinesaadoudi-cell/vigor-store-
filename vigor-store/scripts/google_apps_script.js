/**
 * VIGOR Calisthenics Gear - Google Sheets Webhook Script
 * يوضع هذا الكود داخل Google Sheets لربط المتجر بالجدول تلقائياً
 */

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // إذا كان الجدول فارغاً، أنشئ الترويسة الأنيقة تلقائياً
    if (sheet.getLastRow() === 0) {
      const headers = [
        "التاريخ والوقت",
        "اسم الزبون",
        "رقم الهاتف",
        "الولاية",
        "طريقة التوصيل",
        "البلدية / العنوان",
        "الكمية",
        "المبلغ الإجمالي (دج)",
        "حالة الطلب"
      ];
      sheet.appendRow(headers);
      
      // تنسيق الترويسة (لون نحاسي لعلامة Vigor مع خط أبيض)
      const headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setBackground("#ba5926");
      headerRange.setFontColor("#ffffff");
      headerRange.setFontWeight("bold");
      headerRange.setHorizontalAlignment("center");
    }

    // استخراج بيانات الطلب المرسلة من المتجر
    let data;
    if (e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        data = e.parameter;
      }
    } else {
      data = e.parameter;
    }

    const now = new Date();
    const formattedDate = Utilities.formatDate(now, "GMT+1", "yyyy-MM-dd HH:mm:ss");

    // تسجيل سطر الطلبية الجديد
    const newRow = [
      formattedDate,
      data.name || "بدون اسم",
      "'" + (data.phone || ""), // علامة ' لحفظ الصفر 05/06/07 كنص
      data.wilaya || "غير محدد",
      data.deliveryType === "stopdesk" ? "استلام من المكتب (Stop Desk)" : "توصيل للمنزل",
      data.commune || "",
      data.quantity || 1,
      data.totalPrice || "1,800 دج",
      "جديد ⏳"
    ];

    sheet.appendRow(newRow);

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "تم حفظ الطلبية بنجاح في جدول Vigor"
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
