import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const exportToPDF = async (elementId: string, filename: string = 'interview-report.pdf') => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('Element not found');
    }

    // Temporarily hide elements that shouldn't be in PDF
    const elementsToHide = element.querySelectorAll('[data-pdf-exclude]');
    elementsToHide.forEach(el => {
      (el as HTMLElement).style.display = 'none';
    });

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
    });

    // Restore hidden elements
    elementsToHide.forEach(el => {
      (el as HTMLElement).style.display = '';
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const canvasAspectRatio = canvas.height / canvas.width;
    const pdfAspectRatio = pdfHeight / pdfWidth;

    let renderWidth, renderHeight;

    if (canvasAspectRatio > pdfAspectRatio) {
      renderHeight = pdfHeight;
      renderWidth = renderHeight / canvasAspectRatio;
    } else {
      renderWidth = pdfWidth;
      renderHeight = renderWidth * canvasAspectRatio;
    }

    const xOffset = (pdfWidth - renderWidth) / 2;
    const yOffset = (pdfHeight - renderHeight) / 2;

    pdf.addImage(imgData, 'PNG', xOffset, yOffset, renderWidth, renderHeight);
    
    // Save the PDF
    pdf.save(filename);
    
    return { success: true, message: 'PDF exported successfully' };
  } catch (error) {
    console.error('Error exporting PDF:', error);
    return { success: false, message: 'Failed to export PDF' };
  }
};

export const generatePDFBlob = async (elementId: string): Promise<Blob | null> => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('Element not found');
    }

    const elementsToHide = element.querySelectorAll('[data-pdf-exclude]');
    elementsToHide.forEach(el => {
      (el as HTMLElement).style.display = 'none';
    });

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
    });

    elementsToHide.forEach(el => {
      (el as HTMLElement).style.display = '';
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const canvasAspectRatio = canvas.height / canvas.width;
    const pdfAspectRatio = pdfHeight / pdfWidth;

    let renderWidth, renderHeight;

    if (canvasAspectRatio > pdfAspectRatio) {
      renderHeight = pdfHeight;
      renderWidth = renderHeight / canvasAspectRatio;
    } else {
      renderWidth = pdfWidth;
      renderHeight = renderWidth * canvasAspectRatio;
    }

    const xOffset = (pdfWidth - renderWidth) / 2;
    const yOffset = (pdfHeight - renderHeight) / 2;

    pdf.addImage(imgData, 'PNG', xOffset, yOffset, renderWidth, renderHeight);
    
    return pdf.output('blob');
  } catch (error) {
    console.error('Error generating PDF blob:', error);
    return null;
  }
};