
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

// Logo as base64 string - replace with your actual logo
const LOGO_BASE64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFdklEQVR4nO2dW4hcRRCGey9ZE01UVNQHLxgvqHgBBUVFUcELehRFQRFBfTFeXjQgKGq8oGJAFLw+iIKIgkoQNCgaRfBBDBoRDAYx6npJ1k00m+xuahjYQLK9Z7Znpqer+/+gHmazdM/5uqr7VFd3RSmlUqmEdUhJ6xYHK2ktAJpOGjVp1AoMEGmQCQwYaZAJDBhpkAkMGGmQCQwYaZAJDBhpkAkMGGmQCQwYaBAA8yTdIOk9ST9L+lvSb5I+lPSkpEtLlRZo0BCNVz/CDyXtkjTW8qXfLmmYsZE0T9JKSVOENt8m6UugpVU8piU9LWl+4fgcK+lISY9KmsjQUE0bQZPUQklPSfqP0MDbJM2v7Z4sypRbyXexmjZc4opokKRjJL1PaJSWfGdJmi1whKTXCA3TEURdZHCsBtIlPUFokO7l7C3pEEm7CY3RsvAYgQMkTRIaoiXdcxqD5AlCIzQtfUrzAQ+Q9CuhAVrga3Fj8BxJaICWZbdoDJZPCA3QTBucTyg8VlILoW4tC88UGCrpD0LNWpZ9SWOQvE6oWcvCiwWGChoJaVn2vMYgeYBQs5ZlH5M0RmOAnEGoWcuy45IOFRgmN5UBsqhBO5tm0S4n1Kxl2Xc1BsmDhJq1LLuAuGTIivTohInFoQ+yvlml4gxae5N10K51VftmNQxj0DZ8B6jwaAjGlKTZA9C/eFW0SNKvhFm+vQ1A/05V0SxJjxPq1LL0QmJ9b5RkwDYlU2grSqscm7RYnxIR+4Wk5cFs9pK+JczubT+4/3l5a4nvE81qVk4WGC7rCQ3RsvAW6mK6R0h6gNAITfO2cefBoryLX9OyrNswt9Pcaz8lbCE0StPes7x3ZO+exX7ZdwkNU8/CXhdaRMPUwWkfCfIP03M1BkvbJpWH1pmsFxgs2rklffPFhoZpQe5t4vkK3SapnwiNnav1V+sIiWdWq6TruzZqf0lLa5tFWuhrubFikS1fxttOaGzb3hZtknRhrcLbZb+KjwbuZp4JKbWvuP2zrtYuF798bfYe2E/SdTVLbO/VB0v6pk2jNVm7q9gQl4vaJuIZTMVwiWfZ1gQNT6jmdqtbtdbidBG+OQvaOtidf7Z8AMNrSVcWM8ZzGQl3KDFgKF1UmRCf2Et6wesBDFfnpt3bxU3hDiT2TdF3CP1LX6PcQzsr6TjCTl56txwGd5UwwkZJ5xHiMCbpmaRDTsw6rzKn+97Sk4mGJPR4p/fKHY/0jKQdCYYkNNc90OOF8zh+IWk6wZiEf+3KHu+VOwb+kGBQ4v+2T9I5AzXDA+NexJmYYFTiv8b6NHbiwCAOQliWYFTi3xZXaIwc4gDRlib457ckrZ/23dmJAvvTLkmNE/pJg/itE+fO+TdJdhIml5ZlP0t6S07SmcSeNLZOaJzk5ExITPe93920XHrV+rGEweiLjvfE6exyfJk/HZ8kDFKvgTqt4+ubQRIvJOoTXmK+vC9HPflkgjBwvB7q3N43RNjwM7HwBNL5PQmP94B8QRi4vrCpP7ceSnql5ue0byj9am44VATCAOYr8lnRN/usqbI9m/OmOwaMkmR9uok95k70VvCQsIXvmwlDVY9izztfO5ibxgWFGo3sZofL5rih0UsBxs+slQqGZts9cl6X+QNFnfV8je3ukXDLD7OfkG8l66+GZoYHqXkGnlnq04bEnZlBNoQR7wBZo1DLrqpYMhPjVzRC8DR6+8hVfKcp83m75FzkmeaT+rkZ5Q3y3V52BxY53iHk6P178eSJvcqPGeq/xPZoUXBOfXzfc+P55A19w+vhUN35esWb/clb/rI76XP69fPdXi9nLtrolb6m/DGvdF3b9VCpVCqViusXIIjYIx0mO/IAAAAASUVORK5CYII=';

/**
 * Generate a PDF report
 * @param title Report title
 * @param data Data to display in the report
 * @param columns Column definitions
 * @param fileName Name of the file to download
 */
export const generatePDF = (title, data, columns, fileName = 'london-food-report.pdf') => {
  try {
    // Create a new PDF document with RTL support
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Add Arabic font support - this is critical for proper Arabic text rendering
    // Include a custom font for proper Arabic support
    // Use Amiri font which has good Arabic support
    doc.addFont("https://fonts.gstatic.com/s/amiri/v17/J7aRnpd8CGxBHpUrtLMA7w.ttf", "Amiri", "normal");
    doc.setFont("Amiri", "normal");
    doc.setR2L(true); // Enable right-to-left for Arabic text

    // Add logo
    try {
      doc.addImage(LOGO_BASE64, 'PNG', 15, 10, 20, 20);
    } catch (err) {
      console.warn('Failed to add logo to PDF:', err);
      // Continue without the logo
    }

    // Add title
    doc.setFontSize(20);
    doc.setTextColor('#ea384c'); // Red color for title
    doc.text(title, doc.internal.pageSize.width / 2, 20, {
      align: 'center'
    });

    // Add date - Fix TypeScript error by using proper DateTimeFormatOptions values
    const now = new Date();
    const options = { year: "numeric", month: "long", day: "numeric" };
    const currentDate = now.toLocaleDateString('ar', options);
    doc.setFontSize(12);
    doc.setTextColor(80, 80, 80); // Dark gray
    doc.text(`تاريخ: ${currentDate}`, doc.internal.pageSize.width - 20, 30, {
      align: 'right'
    });

    // Translate column names to Arabic
    const translateColumn = (col) => {
      const translations = {
        'name': 'الاسم',
        'initialStock': 'المخزون الأصلي',
        'sold': 'المبيعات',
        'expectedRemaining': 'المتبقي المتوقع',
        'actualRemaining': 'المتبقي الفعلي',
        'discrepancy': 'الفرق',
        'used': 'المستخدم',
        'remaining': 'المتبقي',
        'unit': 'الوحدة'
      };
      return translations[col] || col;
    };

    // Process data for Arabic display
    const tableData = data.map((item) => {
      return columns.map((col) => {
        if (col === 'name' && item['nameAr']) {
          return item['nameAr']; // Use Arabic name if available
        }
        if (col === 'unit') {
          // Translate units to Arabic
          const unitTranslations = {
            'kg': 'كجم',
            'g': 'جم',
            'l': 'لتر',
            'pcs': 'قطعة',
            'box': 'علبة'
          };
          return unitTranslations[item[col]] || item[col];
        }
        return item[col] !== undefined ? item[col].toString() : '';
      });
    });

    const tableHeaders = columns.map((col) => {
      return translateColumn(col);
    });

    // Add table using autotable with improved Arabic support
    try {
      autoTable(doc, {
        head: [tableHeaders],
        body: tableData,
        theme: 'grid',
        headStyles: {
          fillColor: [234, 56, 76],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          halign: 'right',
          font: 'Amiri'
        },
        styles: {
          font: 'Amiri',
          fontSize: 10,
          cellPadding: 5,
          halign: 'right'
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245]
        },
        margin: {
          top: 40
        },
        didDrawPage: (data) => {
          // Footer on each page
          doc.setFontSize(10);
          doc.setTextColor(150, 150, 150); // Gray text
          doc.text('London Food - نظام إدارة المخزون', doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 10, {
            align: 'center'
          });
        }
      });
    } catch (err) {
      console.error('Error generating table:', err);
      // Add a simple text instead if the table fails
      doc.text('Failed to generate table. Please check your data.', 20, 50);
    }

    // Save the PDF
    doc.save(fileName);
    console.log('PDF generated successfully:', fileName);
    return doc;
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('حدث خطأ أثناء إنشاء ملف PDF. يرجى المحاولة مرة أخرى.');
    throw error;
  }
};

/**
 * Generate a PDF report for drinks
 */
export const generateDrinksPDF = (drinks) => {
  try {
    return generatePDF(
      'تقرير المشروبات',
      drinks,
      ['name', 'initialStock', 'sold', 'expectedRemaining', 'actualRemaining', 'discrepancy'],
      'london-food-drinks-report.pdf'
    );
  } catch (error) {
    console.error('Failed to generate drinks PDF:', error);
    alert('حدث خطأ أثناء إنشاء تقرير المشروبات. يرجى المحاولة مرة أخرى.');
    return null;
  }
};

/**
 * Generate a PDF report for ingredients
 */
export const generateIngredientsPDF = (ingredients) => {
  try {
    return generatePDF(
      'تقرير المواد الأولية',
      ingredients,
      ['name', 'initialStock', 'used', 'remaining', 'unit'],
      'london-food-ingredients-report.pdf'
    );
  } catch (error) {
    console.error('Failed to generate ingredients PDF:', error);
    alert('حدث خطأ أثناء إنشاء تقرير المواد الأولية. يرجى المحاولة مرة أخرى.');
    return null;
  }
};
