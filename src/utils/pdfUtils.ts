
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

// Logo as base64 string - replace with your actual logo
const LOGO_BASE64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFdklEQVR4nO2dW4hcRRCGey9ZE01UVNQHLxgvqHgBBUVFUcELehRFQRFBfTFeXjQgKGq8oGJAFLw+iIKIgkoQNCgaRfBBDBoRDAYx6npJ1k00m+xuahjYQLK9Z7Znpqer+/+gHmazdM/5uqr7VFd3RSmlUqmEdUhJ6xYHK2ktAJpOGjVp1AoMEGmQCQwYaZAJDBhpkAkMGGmQCQwYaZAJDBhpkAkMGGmQCQwYaRAA8yTdIOk9ST9L+lvSb5I+lPSkpEtLlRZo0BCNVz/CDyXtkjTW8qXfLmmYsZE0T9JKSVOENt8m6UugpVU8piU9LWl+4fgcK+lISY9KmsjQUE0bQZPUQklPSfqP0MDbJM2v7Z4sypRbyXexmjZc4opokKRjJL1PaJSWfGdJmi1whKTXCA3TEURdZHCsBtIlPUFokO7l7C3pEEm7CY3RsvAYgQMkTRIaoiXdcxqD5AlCIzQtfUrzAQ+Q9CuhAVrga3Fj8BxJaICWZbdoDJZPCA3QTBucTyg8VlILoW4tC88UGCrpD0LNWpZ9SWOQvE6oWcvCiwWGChoJaVn2vMYgeYBQs5ZlH5M0RmOAnEGoWcuy45IOFRgmN5UBsqhBO5tm0S4n1Kxl2Xc1BsmDhJq1LLuAuGTIivTohInFoQ+yvlml4gxae5N10K51VftmNQxj0DZ8B6jwaAjGlKTZA9C/eFW0SNKvhFm+vQ1A/05V0SxJjxPq1LL0QmJ9b5RkwDYlU2grSqscm7RYnxIR+4Wk5cFs9pK+JczubT+4/3l5a4nvE81qVk4WGC7rCQ3RsvAW6mK6R0h6gNAITfO2cefBoryLX9OyrNswt9Pcaz8lbCE0StPes7x3ZO+exX7ZdwkNU8/CXhdaRMPUwWkfCfIP03M1BkvbJpWH1pmsFxgs2rklffPFhoZpQe5t4vkK3SapnwiNnav1V+sIiWdWq6TruzZqf0lLa5tFWuhrubFikS1fxttOaGzb3hZtknRhrcLbZb+KjwbuZp4JKbWvuP2zrtYuF798bfYe2E/SdTVLbO/VB0v6pk2jNVm7q9gQl4vaJuIZTMVwiWfZ1gQNT6jmdqtbtdbidBG+OQvaOtidf7Z8AMNrSVcWM8ZzGQl3KDFgKF1UmRCf2Et6wesBDFfnpt3bxU3hDiT2TdF3CP1LX6PcQzsr6TjCTl56txwGd5UwwkZJ5xHiMCbpmaRDTsw6rzKn+97Sk4mGJPR4p/fKHY/0jKQdCYYkNNc90OOF8zh+IWk6wZiEZru9ajfiYPz78kRjEv+3KYy2ieELAV8kGJT4v+2TdM5AzfDAuBdxJiYYlfivsT6NnTgwyAOQliUal/i3xRUaI0d4gNTyhAkiSesrEc87cXc+bUlt0LKfJd0pJ+lMAu+iGT8lTBRfyDo3HF3gCdP48iYJfb7Jun3T57PJXrV+LGGSyC5o+nA837LulekvCRPGEx3Hd+5Sri3XJTHAYK3TkM8IeCb0youqcD+A3kUz3uz4+m6YxAuJ+oTXlc19WdSTT8YJE8froc73BkwRNvxMLLy5aE5PwuM9IF8QJpIvWvXn1kNJbzX4nJbdPxD3FixLT/voE1kXD9QQN4iwouAzNKbWDdwMN4g8eXr/GHf9XpnhnfaqsD3eQyVyZ9YU2N52eWEjwrLs087HDpU1hfrK+JrDXSPhlh9lPyBv6/VXQzPDDeIZdmapTxsS9zkD2YQwPjgy1ijUsqsqlszE+MUPETyt3T5yFd9pynzeLjkXeaYppH5eRnmDfLeX3YFFrnqEHL1nD8ydS7ySjxnnv8R2tSg4pz6+77mDcfKGvuH1cKrx+XrqNeLN/sIdwz79/Azv9FZ8sVopVVklvUr9StJV1FzWkfUmv3RdSqVSqZT6pRcGtNUKZnxCWAAAAABJRU5ErkJggg==';

/**
 * Generate a PDF report
 * @param title Report title
 * @param data Data to display in the report
 * @param columns Column definitions
 * @param fileName Name of the file to download
 */
export const generatePDF = (title, data, columns, fileName = 'london-food-report.pdf') => {
  try {
    // Create a new PDF document
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Add logo
    try {
      doc.addImage(LOGO_BASE64, 'PNG', 15, 10, 20, 20);
    } catch (err) {
      console.warn('Failed to add logo to PDF:', err);
      // Continue without the logo
    }

    // Add title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor('#ea384c'); // Red color for title
    doc.text(title, doc.internal.pageSize.width / 2, 20, {
      align: 'center'
    });

    // Add date
    const currentDate = new Date().toLocaleDateString('ar-MA');
    doc.setFontSize(12);
    doc.setTextColor(80, 80, 80); // Dark gray
    doc.text(`تاريخ: ${currentDate}`, doc.internal.pageSize.width - 20, 30, {
      align: 'right'
    });

    // Add table
    doc.setTextColor(0, 0, 0); // Black
    const tableData = data.map((item) => {
      return columns.map((col) => item[col] !== undefined ? item[col].toString() : '');
    });

    const tableHeaders = columns.map((col) => {
      // Convert camelCase to readable header
      return col.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
    });

    // Add table using autotable
    try {
      autoTable(doc, {
        head: [tableHeaders],
        body: tableData,
        theme: 'grid',
        headStyles: {
          fillColor: [234, 56, 76],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          halign: 'center'
        },
        styles: {
          font: 'helvetica',
          fontSize: 10,
          cellPadding: 5,
          halign: 'right'
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245]
        },
        margin: {
          top: 40
        }
      });
    } catch (err) {
      console.error('Error generating table:', err);
      // Add a simple text instead if the table fails
      doc.text('Failed to generate table. Please check your data.', 20, 50);
    }

    // Add footer
    try {
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.setTextColor(150, 150, 150); // Gray text
        doc.text('London Food - نظام إدارة المخزون', doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 10, {
          align: 'center'
        });
      }
    } catch (err) {
      console.warn('Failed to add footer to PDF:', err);
      // Continue without the footer
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
